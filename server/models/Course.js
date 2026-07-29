import mongoose from 'mongoose';

// Lecture Resource Subdocument Schema
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
});

// Lecture Subdocument Schema
const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a lecture title'],
    trim: true,
  },
  videoUrl: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 0, // Duration in seconds
  },
  resources: [resourceSchema],
  order: {
    type: Number,
    default: 0,
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
});

// Section Subdocument Schema
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a section title'],
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  lectures: [lectureSchema],
});

// Main Course Schema
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Course must have an instructor'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Course must belong to a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please specify a course price'],
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'beginner',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published'],
      default: 'draft',
    },
    reviewNotes: {
      type: String,
      default: '',
    },
    sections: [sectionSchema],
    enrolledCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Defined Indexes
courseSchema.index({ category: 1, isPublished: 1, price: 1 });
courseSchema.index({ title: 'text', description: 'text' });

const Course = mongoose.model('Course', courseSchema);
export default Course;
