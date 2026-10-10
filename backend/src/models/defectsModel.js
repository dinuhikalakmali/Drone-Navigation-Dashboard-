// ============ BLOCK 1: IMPORT ============

// Import Mongoose, the library that connects Node.js to MongoDB
// and lets us define the shape (schema) of our data
import mongoose from 'mongoose';


// ============ BLOCK 2: SCHEMA FIELDS ============

// A schema is a blueprint: it says what fields a defect record can have
const defectSchema = new mongoose.Schema({
    // Short name of the defect (text)
    title: String,

    // Longer explanation of the defect (text)
    description: String,

    // Kind of crack found
    crack_type: {
        type: String,                       // stored as text
        enum: [                             // enum = only these values are allowed
            'longitudinal_crack',           // crack running along the length
            'transverse_crack',             // crack running across
            'vertical_crack',               // vertical crack
            'pothole',                      // hole in the surface
            'spalling',                     // surface chipping or flaking
            'other'                         // anything else
        ]
    },

    // General type of the defect (any text)
    defect_type: String,

    // How serious the defect is
    severity: {
        type: String,
        // Both capital and small letter versions are allowed
        enum: ['Low', 'Medium', 'High', 'Critical', 'low', 'medium', 'high', 'critical'],
        default: 'Medium'                   // used when no severity is given
    },

    // How sure the detection model is (a number from 0 to 100)
    confidence: {
        type: Number,
        min: 0,                             // cannot be below 0
        max: 100                            // cannot be above 100
    },

    // Where the defect was found (GPS position)
    location: {
        lat: Number,                        // latitude
        Lng: Number                         // longitude (note the capital L)
    },

    // Image data or image text (e.g. base64)
    image: String,

    // Web link to the image
    imageUrl: String,

    // File path of the image on disk
    image_path: String,

    // Current progress of the defect
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open'                     // new defects start as 'open'
    },

    // ID of the drone that found it (two spellings supported)
    droneId: String,
    drone_id: String,

    // ID of the camera that captured it (two spellings supported)
    cameraId: String,
    camera_id: String,

    // ID of the inspection run this defect belongs to
    inspectionId: String,

    // When the defect was detected
    detected_time: {
        type: Date,
        default: Date.now                   // set to "now" if not given
    },

    // Which user reported this defect
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,   // stores another record's id
        ref: 'User'                             // that record is in the User model
    },

    // Extra date fields (kept for older/other code that uses them)
    time: {
        type: Date,
        default: Date.now
    },

    timestamp: {
        type: Date,
        default: Date.now
    },

    // Has the alert email already been sent?
    notificationSent: {
        type: Boolean,
        default: false                      // false until an email is sent
    }

// ============ BLOCK 3: SCHEMA OPTIONS ============
}, {
    // Automatically add and update createdAt and updatedAt fields
    timestamps: true,

    // Use the collection named 'detections' instead of Mongoose's default name
    collection: 'detections'
});


// ============ BLOCK 4: MODEL CREATION ============

// Create the model from the schema
// "mongoose.models.Defect ||" means: if the model already exists, reuse it
// (this avoids an "OverwriteModelError" when the file is loaded twice)
const Defect =
    mongoose.models.Defect ||
    mongoose.model('Defect', defectSchema);


// ============ BLOCK 5: EXPORT ============

// Export the model so other files can import and use it
export default Defect;