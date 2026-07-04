import mongoose from 'mongoose';

const DefectSchema = new mongoose.Schema({
  time: String,
  status: { type: String },
  image: String,
});

export default mongoose.model('defects', DefectSchema);