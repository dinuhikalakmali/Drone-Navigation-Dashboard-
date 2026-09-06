
import mongoose from 'mongoose';

const defectSchema = new mongoose.Schema({
    crack_type: String,
    defect_type: String,
    confidence: Number,
    severity: String,
    image_path: String,
    image: String, // Base64 encoded image
    location: {
        lat: Number,
        Lng: Number
    },
    drone_id: String,
    camera_id: String,
    detected_time: { 
        type: Date, 
        default: Date.now 
    },
    description: String,
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { 
    collection: 'detections' // Points to the collection in your screenshot
});

const Defect = mongoose.model('Defect', defectSchema);
export default Defect;