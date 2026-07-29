import mongoose from 'mongoose';

const aiQuizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answerIndex: Number,
  explanation: String,
});

const aiQuizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    questions: [aiQuizQuestionSchema],
  },
  { timestamps: true }
);

aiQuizSchema.index({ course: 1, lectureId: 1 }, { unique: true });

const AIQuiz = mongoose.model('AIQuiz', aiQuizSchema);
export default AIQuiz;
