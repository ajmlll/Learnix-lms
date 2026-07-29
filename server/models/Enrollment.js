import mongoose from 'mongoose';

const lectureProgressSchema = new mongoose.Schema({
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
});

const enrollmentSchema = new mongoose.Schema(
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
    progress: [lectureProgressSchema],
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedAt: Date,
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1, enrolledAt: -1 });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
