import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the payment amount'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    paymentGatewayId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Defined Indexes
paymentSchema.index({ student: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
