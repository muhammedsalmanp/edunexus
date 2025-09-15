import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  _id: string;
  googleId?: string; // 👈 for Google login
  name: string;
  email: string;
  password?: string; // 👈 optional now
  phone?: string; // 👈 optional now
  role: string;
  qualifications: string[];
  experience: number;
  certificates: { name: string; year?: number; image?: string }[];
  bio?: string;
  profilePic?: string;
  educationHistory?: { degree: string; institution: string; year?: number }[];
  specializations?: string[];
  approvedByAdmin?: "pending" | "approved" | "rejected";
  rejectionMessage?: string;
  awards?: { title: string; year?: number; issuer?: string }[];
  isBlocked?: boolean;
  isVerified?: boolean;
  hasApplied?: boolean;
  isActive?: boolean;        // 👈 new field
  lastActiveAt?: Date;       // 👈 new field
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>({
  _id: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // allow either Google or password login
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, 
  },
  phone: {
    type: String, // no required
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "teacher", "admin"],
  },
  qualifications: {
    type: [String],
    required: function (this: UserDocument) {
      return this.role === "teacher";
    },
    default: [],
  },
  experience: {
    type: Number,
    required: function (this: UserDocument) {
      return this.role === "teacher";
    },
    default: 0,
  },
  certificates: {
    type: [
      {
        name: { type: String, required: true },
        year: { type: Number },
        image: { type: String },
      },
    ],
    required: function (this: UserDocument) {
      return this.role === "teacher";
    },
    default: [],
  },
  bio: String,
  profilePic: String,
  educationHistory: {
    type: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: Number },
      },
    ],
    default: [],
  },
  specializations: {
    type: [String],
    default: [],
  },
  approvedByAdmin: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: function (this: UserDocument) {
      return this.role === "teacher";
    },
  },
  rejectionMessage: {
    type: String,
    required: function (this: UserDocument) {
      return this.role === "teacher" && this.approvedByAdmin === "rejected";
    },
    default: null,
  },
  awards: {
    type: [
      {
        title: { type: String, required: true },
        year: { type: Number },
        issuer: { type: String },
      },
    ],
    default: [],
  },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  hasApplied: {
    type: Boolean,
    default: false,
    required: function (this: UserDocument) {
      return this.role === "teacher";
    },
  },
  isActive: { type: Boolean, default: false }, // 👈 new
  lastActiveAt: { type: Date, default: null }, // 👈 new
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
