
import mongoose from 'mongoose';

const defectSchema = new mongoose.Schema({
    crack_type: String,
    confidence: Number,
    severity: String,
    image_path: String,
    // Add other fields you need
}, { 
    collection: 'detections' // Points to the collection in your screenshot
});

const Defect = mongoose.model('Defect', defectSchema);
export default Defect;