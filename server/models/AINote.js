import mongoose from 'mongoose';

const aiNoteSchema = new mongoose.Schema(
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
    summary: {
      type: String,
      required: true,
    },
    keyTakeaways: [String],
    transcriptSummary: String,
  },
  { timestamps: true }
);

aiNoteSchema.index({ course: 1, lectureId: 1 }, { unique: true });

const AINote = mongoose.model('AINote', aiNoteSchema);
export default AINote;
