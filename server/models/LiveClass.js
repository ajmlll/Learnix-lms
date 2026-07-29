import mongoose from 'mongoose';

const liveClassSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
    jitsiRoomName: {
      type: String,
      required: true,
      unique: true,
    },
    jitsiMeetingUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'ended', 'cancelled'],
      default: 'scheduled',
    },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinedAt: Date,
        leftAt: Date,
      },
    ],
  },
  { timestamps: true }
);

liveClassSchema.index({ course: 1, scheduledAt: 1 });

const LiveClass = mongoose.model('LiveClass', liveClassSchema);
export default LiveClass;
