// ============ BLOCK 1: IMPORTS ============

// Import Express, the main framework used to build the web server
import express from 'express';

// Import CORS, which lets a frontend on a different domain/port call this API
import cors from 'cors';

// Import dotenv, which reads secret values from a .env file
import dotenv from 'dotenv';

// Import the function that connects to the database (e.g. MongoDB)
import connectDB from './config/db.js';

// Import the router that handles login/signup related URLs
import authRouter from './routers/authRouter.js';

// Import the router that handles defect detection URLs
// (it is named "defectRouter" here, but the file is detectionRouter.js)
import defectRouter from './routers/detectionRouter.js';

// Import the function that starts watching for new defects in the background
import { initializeDefectMonitoring } from './services/defectWatcher.js';

// Import the function that checks whether the email service is working
import { testEmailConnection } from './services/emailService.js';


// ============ BLOCK 2: SETUP ============

// Load all values from the .env file into process.env
// (e.g. PORT, database URL, email password)
dotenv.config();

// Connect to the database as soon as the app starts
connectDB();


// ============ BLOCK 3: APP CREATION AND MIDDLEWARE ============

// Create the Express application (our server)
const app = express();

// Allow requests from other origins (needed when the frontend runs separately)
app.use(cors());

// Let the server read JSON data sent in requests
// 'limit: 10mb' allows bigger payloads (e.g. image data)
app.use(express.json({ limit: '10mb' }));


// ============ BLOCK 4: ROUTES ============

// Any URL starting with /api/auth is handled by authRouter
// Example: /api/auth/login
app.use('/api/auth', authRouter);

// Any URL starting with /api/defects is handled by defectRouter
// Example: /api/defects/list
app.use('/api/defects', defectRouter);


// ============ BLOCK 5: HEALTH-CHECK ROUTE ============

// When someone opens the main URL "/" with a GET request...
app.get('/', (req, res) => {
  // ...reply with a small JSON message to show the API is working
  res.json({ message: 'Drone Navigation Dashboard API is running' });
});


// ============ BLOCK 6: STARTING THE SERVER ============

// Use the PORT from .env if available, otherwise use 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for requests on that port
// 'async' is used because we use 'await' inside
app.listen(PORT, async () => {
  // Print a message in the terminal to confirm the server started
  console.log(`Server running on port ${PORT}`);

  // Initialize email service and defect monitoring

  // 'try' runs the code; if anything fails, 'catch' handles the error
  try {
    // Check if the email service can connect (wait for the result)
    const emailReady = await testEmailConnection();

    // If email works...
    if (emailReady) {
      // ...start monitoring for defects (wait until it is set up)
      await initializeDefectMonitoring();
    } else {
      // If email does not work, show a warning
      // Monitoring is NOT started, so no notifications are sent
      console.warn('⚠️ Email service not available - notifications will be skipped');
    }
  } catch (error) {
    // If any error happens above, print only the error message
    console.error('Error initializing services:', error.message);
  }
});