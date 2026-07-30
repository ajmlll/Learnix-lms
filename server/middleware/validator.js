import { body, param, validationResult } from 'express-validator';

/**
 * Common Middleware to check express-validator result and return formatted 400 error
 */
export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check your inputs.',
      errors: formattedErrors,
    });
  }
  next();
};

// Authentication Validators
export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  validateResult,
];

export const validateLogin = [
  body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
  validateResult,
];

export const validateForgotPassword = [
  body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address.'),
  validateResult,
];

export const validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  validateResult,
];

// Category Validator
export const validateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required.'),
  validateResult,
];

// Course Validator
export const validateCourse = [
  body('title').trim().notEmpty().withMessage('Course title is required.'),
  body('description').trim().notEmpty().withMessage('Course description is required.'),
  body('category').isMongoId().withMessage('Valid category ID is required.'),
  validateResult,
];

// Review Validator
export const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5.'),
  validateResult,
];

// Checkout Validator
export const validateCheckout = [
  body('courseId').isMongoId().withMessage('Valid course ID is required for checkout.'),
  validateResult,
];

export default {
  validateResult,
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateCategory,
  validateCourse,
  validateReview,
  validateCheckout,
};
