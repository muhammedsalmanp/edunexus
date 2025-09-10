import mongoose, { Schema, Document } from 'mongoose';

export interface CourseDocument extends Document {
    id: string;
    name: string;
    description: string;
    price: number;
    thumbnailImage: string;
    coveringTopics: string[];
    chapters: { name: string; description: string; video: string }[];
    createdBy: string | mongoose.Types.ObjectId; // Reference to User _id
    courseStatus: 'published' | 'unpublished' | 'pending';
    createdAt: Date;
}

const chapterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
});

const courseSchema = new Schema<CourseDocument>({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnailImage: {
    type: String,
    required: true
  },
  coveringTopics: {
    type: [String],
    required: true,
    default: []
  },
  chapters: [chapterSchema],
  createdBy: {
    type: String,         
    ref: 'User',
    required: true
  },
  courseStatus: {
    type: String,
    enum: ['published', 'unpublished', 'pending'],
    required: true,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});


export const CourseModel = mongoose.model<CourseDocument>('Course', courseSchema);