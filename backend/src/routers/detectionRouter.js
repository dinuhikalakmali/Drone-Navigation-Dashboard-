import express from 'express';
import Defect from '../models/detection.js'; 

const router = express.Router();

// The index.js handles '/api/defects', so we only need '/count' here
router.get('/count', async (req, res) => {
    try {
        const count = await Defect.countDocuments({});
        res.status(200).json({ success: true, count: count });
    } catch (error) {
        console.error("Error fetching defect count:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET all defects
router.get('/', async (req, res) => {
    try {
        const defects = await Defect.find({}); // Fetches all documents
        res.status(200).json({ success: true, data: defects });
    } catch (error) {
        console.error("Error fetching defects:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;