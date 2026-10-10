// ============ BLOCK 1: IMPORTS AND ROUTER ============

// Import Express to create routes
import express from 'express';

// Import the Defect model (used to talk to the "defects" collection in MongoDB)
import Defect from '../models/defectsModel.js';

// Import the "protect" middleware, which only lets logged-in users pass
import { protect } from '../middleware/authMiddleware.js';

// Import the function that sends the high severity alert email
import { sendHighSeverityAlert } from '../services/emailService.js';

// Import the helper that returns the users who should receive defect alerts
import { getDefectAccessUsers } from '../helpers/defectNotification.js';

// Create a router: a mini-app that holds the defect-related routes
const router = express.Router();


// ============ BLOCK 2: COUNT ROUTE ============

// URL: GET /api/defects/  (public: no login needed)
router.get('/', async (req, res) => {
  // 'try' runs the code; 'catch' at the bottom handles unexpected errors
  try {
    // Count how many defect records exist in the database
    const count = await Defect.countDocuments();

    // Send the count back to the frontend as JSON
    res.json({ message: 'fetched', data: count });
  } catch (err) {
    // Any unexpected error: send 500 (Server Error) with the message
    res.status(500).json({ error: err.message });
  }
});


// ============ BLOCK 3: LIST ALL DEFECTS ============

// URL: GET /api/defects/defects  (public)
router.get('/defects', async (req, res) => {
  try {
    // Get all defects; sort({ time: -1 }) puts the newest first (-1 = descending)
    const defects = await Defect.find().sort({ time: -1 });

    // Send the list to the frontend
    res.json({ status: 200, message: 'fetched', data: defects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============ BLOCK 4: PDF DATA ROUTE ============

// URL: GET /api/defects/datapdf  (public)
router.get('/datapdf', async (req, res) => {
  try {
    // Get defects newest first, but only the first 30 (.limit(30))
    // A smaller list keeps PDF reports quick and short
    const defects = await Defect.find().sort({ time: -1 }).limit(30);

    // Send the 30 defects to the frontend
    res.json({ status: 200, message: 'fetched', data: defects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============ BLOCK 5: CREATE DEFECT ============

// URL: POST /api/defects/  (protect = user must be logged in)
router.post('/', protect, async (req, res) => {
  try {
    // Create a new defect using all data sent in the request body (...req.body)
    // and also store which logged-in user reported it
    const defect = await Defect.create({ ...req.body, reportedBy: req.user._id });
    
    // 🚨 TRIGGER: Check if severity is High or Critical
    // (all spellings are checked: capital and small letters)
    if (defect.severity === 'High' || defect.severity === 'high' || 
        defect.severity === 'Critical' || defect.severity === 'critical') {
      
      // Inner try/catch so an email problem does not break defect creation
      try {
        // Get all users with access to defects table
        const recipients = await getDefectAccessUsers();
        
        // Only continue if there is at least one person to notify
        if (recipients.length > 0) {
          // Send alert email asynchronously (don't wait for it)
          // No "await" here, so the API replies quickly while the email sends in the background
          sendHighSeverityAlert(defect, recipients)
            .then(() => {
              // Email was sent, so mark the defect as "notification sent"
              // (this stops the poller from emailing it again)
              Defect.findByIdAndUpdate(defect._id, { notificationSent: true }).catch(err => 
                // If the database update fails, only print the error
                console.error('Error updating notification status:', err)
              );
            })
            // If the email fails, print the error message (request is not affected)
            .catch(err => console.error('Email send failed:', err.message));
        }
      } catch (error) {
        // Failure while finding recipients or starting the email
        console.error('Error triggering email notification:', error.message);
        // Don't fail the API request if email fails
      }
    }
    
    // 201 = Created. Send back the saved defect
    res.status(201).json({ message: 'Defect created', data: defect });
  } catch (err) {
    // If creating the defect itself failed, send a 500 error
    res.status(500).json({ error: err.message });
  }
});


// ============ BLOCK 6: EXPORT ============

// Export the router so server.js can use it with app.use('/api/defects', defectRouter)
export default router;