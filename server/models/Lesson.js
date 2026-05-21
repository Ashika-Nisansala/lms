import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  materialsUrl: { type: String },
  orderIndex: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);
