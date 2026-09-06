import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routers/authRouter.js';
import defectRouter from './routers/detectionRouter.js';
import { initializeDefectMonitoring } from './services/defectWatcher.js';
import { testEmailConnection } from './services/emailService.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRouter);
app.use('/api/defects', defectRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Drone Navigation Dashboard API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize email service and defect monitoring
  try {
    const emailReady = await testEmailConnection();
    if (emailReady) {
      await initializeDefectMonitoring();
    } else {
      console.warn('⚠️ Email service not available - notifications will be skipped');
    }
  } catch (error) {
    console.error('Error initializing services:', error.message);
  }
});
