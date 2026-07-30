import crypto from 'crypto';
import User from '../models/User.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    // Prevent unauthorized creation of admin role via public registration
    const userRole = role === 'admin' ? 'student' : role || 'student';

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: userRole,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user by email and explicitly select password
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - Send reset password email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user registered with that email address.',
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const htmlMessage = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Learnix account.</p>
      <p>Please click the following link to reset your password (valid for 10 minutes):</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>If you did not request this email, please ignore it.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Learnix LMS - Password Reset Token',
        html: htmlMessage,
      });

      res.status(200).json({
        success: true,
        message: 'Email sent with password reset link.',
      });
    } catch (err) {
      console.error('[Forgot Password Email Error]:', err.message);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password of at least 6 characters.',
      });
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's cart from MongoDB
// @route   GET /api/auth/cart
// @access  Private
export const getUserCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'cart',
      select: 'title slug thumbnail price discountPrice level instructor category',
      populate: [
        { path: 'instructor', select: 'name avatar' },
        { path: 'category', select: 'name slug' },
      ],
    });

    const validCart = (user?.cart || []).filter((item) => item != null);

    res.status(200).json({
      success: true,
      data: validCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add course to user's cart in MongoDB
// @route   POST /api/auth/cart
// @access  Private
export const addToUserCart = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Please provide a courseId' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { cart: courseId } },
      { new: true }
    ).populate({
      path: 'cart',
      select: 'title slug thumbnail price discountPrice level instructor category',
      populate: [
        { path: 'instructor', select: 'name avatar' },
        { path: 'category', select: 'name slug' },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Course added to cart in database.',
      data: user.cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove course from user's cart in MongoDB
// @route   DELETE /api/auth/cart/:courseId
// @access  Private
export const removeFromUserCart = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { cart: courseId } },
      { new: true }
    ).populate({
      path: 'cart',
      select: 'title slug thumbnail price discountPrice level instructor category',
      populate: [
        { path: 'instructor', select: 'name avatar' },
        { path: 'category', select: 'name slug' },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Course removed from cart in database.',
      data: user.cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear user's cart in MongoDB
// @route   DELETE /api/auth/cart
// @access  Private
export const clearUserCart = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

    res.status(200).json({
      success: true,
      message: 'Cart cleared in database.',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};
