// GERMAN LANGUAGE SCHOOL MONGODB SCHEMAS (Mongoose Reference)

import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passportNo: { type: String, required: true },
  courseLevel: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
  learningMode: { type: String, enum: ['Online', 'On-Campus'], default: 'Online' },
  attendance: { type: String, default: '100%' },
  grade: { type: String, default: 'N/A' },
  paymentStatus: { type: String, enum: ['Paid', 'Installments', 'Pending'], default: 'Paid' },
  enrolledAt: { type: Date, default: Date.now }
});

const CourseSchema = new mongoose.Schema({
  level: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  fees: { type: String, required: true },
  schedule: { type: String, required: true },
  instructor: { type: String, required: true },
  syllabus: [String],
  seatsAvailable: { type: Number, default: 15 }
});

const DocumentVaultSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Certificates', 'ID Proofs', 'Receipts', 'Syllabus'], required: true },
  studentName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: String },
  ocrData: {
    extractedName: String,
    issueDate: String,
    scores: mongoose.Schema.Types.Mixed,
    summary: String
  },
  uploadedAt: { type: Date, default: Date.now }
});

export const Student = mongoose.model('Student', StudentSchema);
export const Course = mongoose.model('Course', CourseSchema);
export const DocumentVault = mongoose.model('DocumentVault', DocumentVaultSchema);
