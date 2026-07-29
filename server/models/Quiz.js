import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  explanation: String,
});

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    title: {
      type: String,
      required: true,
    },
    passingScore: {
      type: Number,
      default: 70, // percentage
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

quizSchema.index({ course: 1, lectureId: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
