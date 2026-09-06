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

// GET all defects for PDF (with optional date range filtering)
router.get('/datapdf', async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        
        let query = {};
        
        // Add date range filter if provided
        if (fromDate && toDate) {
            query = {
                $or: [
                    {
                        detected_time: {
                            $gte: new Date(fromDate),
                            $lte: new Date(toDate)
                        }
                    },
                    {
                        timestamp: {
                            $gte: new Date(fromDate),
                            $lte: new Date(toDate)
                        }
                    },
                    {
                        time: {
                            $gte: new Date(fromDate),
                            $lte: new Date(toDate)
                        }
                    }
                ]
            };
        }
        
        const defects = await Defect.find(query)
            .sort({ detected_time: -1, timestamp: -1, time: -1 })
            .limit(500); // Increased limit for date-ranged queries
        
        res.status(200).json({ success: true, data: defects });
    } catch (error) {
        console.error("Error fetching defects for PDF:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
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

// POST - Add a new defect
router.post('/', async (req, res) => {
    try {
        const defect = await Defect.create(req.body);
        res.status(201).json({ 
            success: true, 
            message: 'Defect created', 
            data: defect 
        });
    } catch (error) {
        console.error("Error creating defect:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error creating defect",
            error: error.message 
        });
    }
});

export default router;