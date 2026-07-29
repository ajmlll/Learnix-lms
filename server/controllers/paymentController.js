import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { createEnrollmentInternal } from './enrollmentController.js';
import { invalidateCourseCache } from '../utils/cacheInvalidation.js';

const getStripeInstance = () => {
  return new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/checkout-session
// @access  Private (Student)
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a courseId.',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course.',
      });
    }

    const stripe = getStripeInstance();
    const finalPrice = course.discountPrice > 0 ? course.discountPrice : course.price;
    const unitAmount = Math.max(Math.round(finalPrice * 100), 50); // Minimum 50 cents for Stripe

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,
      client_reference_id: req.user._id.toString(),
      metadata: {
        courseId: course._id.toString(),
        studentId: req.user._id.toString(),
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description ? course.description.substring(0, 200) : 'Learnix LMS Course',
              images: course.thumbnail ? [course.thumbnail] : [],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/course/${course._id}`,
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe Webhook Listener
// @route   POST /api/payments/webhook
// @access  Public (Stripe signature verified)
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const stripe = getStripeInstance();
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // In development if secret not set, parse JSON body directly
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error(`[Stripe Webhook Verification Error]: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const courseId = session.metadata?.courseId;
    const studentId = session.metadata?.studentId;

    console.log(`[Stripe Webhook Success]: Received payment for course ${courseId} by student ${studentId}`);

    if (courseId && studentId) {
      try {
        // 1. Record payment in DB
        await Payment.create({
          student: studentId,
          course: courseId,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency ? session.currency.toUpperCase() : 'USD',
          paymentGatewayId: session.payment_intent || session.id,
          status: 'success',
        });

        // 2. Create enrollment for student
        await createEnrollmentInternal(studentId, courseId);

        // 3. Increment course enrolledCount
        await Course.findByIdAndUpdate(courseId, {
          $inc: { enrolledCount: 1 },
        });

        // 4. Invalidate course cache
        await invalidateCourseCache(courseId);
      } catch (dbErr) {
        console.error('[Stripe Webhook DB Error]:', dbErr.message);
      }
    }
  }

  res.status(200).json({ received: true });
};

// @desc    Process Order / Dummy Stripe Payment (Multi-course)
// @route   POST /api/payments/process-order
// @access  Private (Student)
export const processOrder = async (req, res, next) => {
  try {
    const { courseIds, amount, paymentMethod = 'card' } = req.body;

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of courseIds.',
      });
    }

    const studentId = req.user._id;
    const createdPayments = [];
    const createdEnrollments = [];

    for (const courseId of courseIds) {
      const course = await Course.findById(courseId);
      if (!course) continue;

      const coursePrice = course.price || 0;

      // 1. Create Payment Record
      const payment = await Payment.create({
        student: studentId,
        course: courseId,
        amount: coursePrice,
        currency: 'INR',
        paymentGatewayId: `PAY-STRIPE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: 'success',
      });
      createdPayments.push(payment);

      // 2. Create Enrollment Record
      const enrollment = await createEnrollmentInternal(studentId, courseId);
      createdEnrollments.push(enrollment);

      // 3. Increment course enrolledCount
      await Course.findByIdAndUpdate(courseId, {
        $inc: { enrolledCount: 1 },
      });

      // 4. Invalidate course cache
      await invalidateCourseCache(courseId);
    }

    res.status(200).json({
      success: true,
      message: 'Payment and enrollments processed successfully!',
      count: createdEnrollments.length,
      payments: createdPayments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's payment history
// @route   GET /api/payments/history
// @access  Private (Student)
export const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ student: req.user._id })
      .populate('course', 'title thumbnail slug price')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get instructor's earnings dashboard summary
// @route   GET /api/payments/instructor-earnings
// @access  Private (Instructor/Admin)
export const getInstructorEarnings = async (req, res, next) => {
  try {
    // 1. Get instructor's course IDs
    const instructorCourses = await Course.find({ instructor: req.user._id }).select('_id');
    const courseIds = instructorCourses.map((c) => c._id);

    // 2. Aggregate total earnings & sales count via MongoDB $group + $sum pipeline
    const [earningsAggregation, payments] = await Promise.all([
      Payment.aggregate([
        { $match: { course: { $in: courseIds }, status: 'success' } },
        { $group: { _id: null, totalEarnings: { $sum: '$amount' }, totalSales: { $sum: 1 } } },
      ]),
      Payment.find({
        course: { $in: courseIds },
        status: 'success',
      })
        .populate('student', 'name email avatar')
        .populate('course', 'title price')
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    ]);

    const totalEarnings = earningsAggregation[0]?.totalEarnings || 0;
    const totalSales = earningsAggregation[0]?.totalSales || 0;

    res.status(200).json({
      success: true,
      totalEarnings,
      totalSales,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};
