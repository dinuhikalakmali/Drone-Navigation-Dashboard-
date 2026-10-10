// ============ BLOCK 1: IMPORT ============

// Import Mongoose, the library that connects Node.js to MongoDB
// and lets us define the shape (schema) of our data
import mongoose from 'mongoose';


// ============ BLOCK 2: SCHEMA FIELDS ============

// A schema is a blueprint: it says what fields a defect record can have
const defectSchema = new mongoose.Schema({
    // Kind of crack found (any text, no fixed list here)
    crack_type: String,

    // General type of the defect (text)
    defect_type: String,

    // How sure the detection model is (a number, no min/max limit here)
    confidence: Number,

    // How serious the defect is (any text allowed, no fixed list here)
    severity: String,

    // File path of the image on disk
    image_path: String,

    // Image stored as text
    image: String, // Base64 encoded image

    // Where the defect was found (GPS position)
    location: {
        lat: Number,    // latitude
        Lng: Number     // longitude (note the capital L)
    },

    // ID of the drone that found the defect
    drone_id: String,

    // ID of the camera that captured the defect
    camera_id: String,

    // When the defect was detected
    detected_time: { 
        type: Date,             // stored as a date
        default: Date.now       // set to "now" if not given
    },

    // Longer explanation of the defect (text)
    description: String,

    // Current progress of the defect
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'], // only these values allowed
        default: 'open'         // new defects start as 'open'
    },

    // Extra date field (set to "now" if not given)
    timestamp: {
        type: Date,
        default: Date.now
    }

// ============ BLOCK 3: SCHEMA OPTIONS ============
}, { 
    // Use the collection named 'detections' instead of Mongoose's default name
    collection: 'detections' // Points to the collection in your screenshot
});


// ============ BLOCK 4: MODEL CREATION AND EXPORT ============

// Create the model named 'Defect' from the schema above
const Defect = mongoose.model('Defect', defectSchema);

// Export the model so other files can import and use it
export default Defect;