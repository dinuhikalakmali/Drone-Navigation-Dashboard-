import express from 'express';
import Defect from '../models/defectsModel.js';
import { protect } from '../middleware/authMiddleware.js';
import { sendHighSeverityAlert } from '../services/emailService.js';
import { getDefectAccessUsers } from '../helpers/defectNotification.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const count = await Defect.countDocuments();
    res.json({ message: 'fetched', data: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/defects', async (req, res) => {
  try {
    const defects = await Defect.find().sort({ time: -1 });
    res.json({ status: 200, message: 'fetched', data: defects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/datapdf', async (req, res) => {
  try {
    const defects = await Defect.find().sort({ time: -1 }).limit(30);
    res.json({ status: 200, message: 'fetched', data: defects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const defect = await Defect.create({ ...req.body, reportedBy: req.user._id });
    
    // 🚨 TRIGGER: Check if severity is High or Critical
    if (defect.severity === 'High' || defect.severity === 'high' || 
        defect.severity === 'Critical' || defect.severity === 'critical') {
      
      try {
        // Get all users with access to defects table
        const recipients = await getDefectAccessUsers();
        
        if (recipients.length > 0) {
          // Send alert email asynchronously (don't wait for it)
          sendHighSeverityAlert(defect, recipients)
            .then(() => {
              // Mark as notification sent
              Defect.findByIdAndUpdate(defect._id, { notificationSent: true }).catch(err => 
                console.error('Error updating notification status:', err)
              );
            })
            .catch(err => console.error('Email send failed:', err.message));
        }
      } catch (error) {
        console.error('Error triggering email notification:', error.message);
        // Don't fail the API request if email fails
      }
    }
    
    res.status(201).json({ message: 'Defect created', data: defect });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
