import mongoose from 'mongoose';

const defectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  location: String,
  coordinates: { lat: Number, lng: Number },
  imageUrl: String,
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  droneId: String,
  inspectionId: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  time: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Defect', defectSchema);
