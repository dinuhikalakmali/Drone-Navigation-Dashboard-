import mongoose from 'mongoose';

const defectSchema = new mongoose.Schema({
    title: String,
    description: String,

    crack_type: {
        type: String,
        enum: [
            'longitudinal_crack',
            'transverse_crack',
            'vertical_crack',
            'pothole',
            'spalling',
            'other'
        ]
    },

    defect_type: String,

    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical', 'low', 'medium', 'high', 'critical'],
        default: 'Medium'
    },

    confidence: {
        type: Number,
        min: 0,
        max: 100
    },

    location: {
        lat: Number,
        Lng: Number
    },

    image: String,
    imageUrl: String,
    image_path: String,

    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open'
    },

    droneId: String,
    drone_id: String,

    cameraId: String,
    camera_id: String,

    inspectionId: String,

    detected_time: {
        type: Date,
        default: Date.now
    },

    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    time: {
        type: Date,
        default: Date.now
    },

    timestamp: {
        type: Date,
        default: Date.now
    },

    notificationSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'detections'
});

const Defect =
    mongoose.models.Defect ||
    mongoose.model('Defect', defectSchema);

export default Defect;