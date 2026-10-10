// ============ BLOCK 1: IMPORTS AND ROUTER ============

// Import Express to create routes
import express from 'express';

// Import the Defect model (used to talk to the defects collection in MongoDB)
// Note: this one comes from '../models/detection.js', not defectsModel.js
import Defect from '../models/detection.js'; 

// Create a router: a mini-app that holds the defect-related routes
const router = express.Router();


// ============ BLOCK 2: COUNT ROUTE ============

// The index.js handles '/api/defects', so we only need '/count' here
// URL: GET /api/defects/count
router.get('/count', async (req, res) => {
    // 'try' runs the code; 'catch' at the bottom handles unexpected errors
    try {
        // Count all documents ({} = no filter, so everything is counted)
        const count = await Defect.countDocuments({});

        // 200 = OK. Send the count back as JSON
        res.status(200).json({ success: true, count: count });
    } catch (error) {
        // Print the full error in the terminal for debugging
        console.error("Error fetching defect count:", error);

        // 500 = Server Error. Send a simple message to the frontend
        res.status(500).json({ success: false, message: "Server Error" });
    }
});


// ============ BLOCK 3: PDF DATA ROUTE ============

// GET all defects for PDF (with optional date range filtering)
// URL: GET /api/defects/datapdf?fromDate=2026-01-01&toDate=2026-01-31
router.get('/datapdf', async (req, res) => {
    try {
        // Read fromDate and toDate from the URL query string (the part after ?)
        const { fromDate, toDate } = req.query;
        
        // Start with an empty filter (means "match everything")
        let query = {};
        
        // Add date range filter if provided
        // Only filter when BOTH dates are given
        if (fromDate && toDate) {
            query = {
                // $or = match if ANY of the conditions below is true
                // (different records may store their date in different fields)
                $or: [
                    {
                        // Check the detected_time field is between the two dates
                        detected_time: {
                            $gte: new Date(fromDate), // $gte = greater than or equal (start date)
                            $lte: new Date(toDate)    // $lte = less than or equal (end date)
                        }
                    },
                    {
                        // Same check, but on the timestamp field
                        timestamp: {
                            $gte: new Date(fromDate),
                            $lte: new Date(toDate)
                        }
                    },
                    {
                        // Same check, but on the time field
                        time: {
                            $gte: new Date(fromDate),
                            $lte: new Date(toDate)
                        }
                    }
                ]
            };
        }
        
        // Find defects that match the filter
        const defects = await Defect.find(query)
            // Sort newest first by detected_time, then timestamp, then time (-1 = descending)
            .sort({ detected_time: -1, timestamp: -1, time: -1 })
            .limit(500); // Increased limit for date-ranged queries (max 500 results)
        
        // Send the defects to the frontend
        res.status(200).json({ success: true, data: defects });
    } catch (error) {
        console.error("Error fetching defects for PDF:", error);
        // Also send the error message to help with debugging
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});


// ============ BLOCK 4: LIST ALL DEFECTS ============

// GET all defects
// URL: GET /api/defects/
router.get('/', async (req, res) => {
    try {
        // Fetch every defect with no filter and no sorting
        const defects = await Defect.find({}); // Fetches all documents

        // Send the list to the frontend
        res.status(200).json({ success: true, data: defects });
    } catch (error) {
        console.error("Error fetching defects:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});


// ============ BLOCK 5: CREATE DEFECT ============

// POST - Add a new defect
// URL: POST /api/defects/  (no login required here)
router.post('/', async (req, res) => {
    try {
        // Create a new defect using everything sent in the request body
        const defect = await Defect.create(req.body);

        // 201 = Created. Send back a success message and the saved defect
        res.status(201).json({ 
            success: true, 
            message: 'Defect created', 
            data: defect 
        });
    } catch (error) {
        console.error("Error creating defect:", error);
        // Send the error message so the cause is visible
        res.status(500).json({ 
            success: false, 
            message: "Error creating defect",
            error: error.message 
        });
    }
});


// ============ BLOCK 6: EXPORT ============

// Export the router so it can be used with app.use('/api/defects', ...)
export default router;