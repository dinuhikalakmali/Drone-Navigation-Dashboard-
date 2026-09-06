import Defect from '../models/defectsModel.js';
import { getDefectAccessUsers } from '../helpers/defectNotification.js';
import { sendHighSeverityAlert } from './emailService.js';

/**
 * Start MongoDB Change Stream watcher for high severity defects
 * This watches for new defects being inserted and triggers alerts
 */
export const startDefectWatcher = async () => {
  try {
    // Create a change stream on the Defect collection
    const changeStream = Defect.watch([
      {
        $match: {
          'operationType': 'insert',
          'fullDocument.severity': { 
            $in: ['High', 'high', 'Critical', 'critical'] 
          }
        }
      }
    ]);

    changeStream.on('change', async (change) => {
      try {
        const defect = change.fullDocument;
        console.log('🚨 High severity defect detected via Change Stream:', defect.title);

        // Get all users who have access to defects
        const recipients = await getDefectAccessUsers();

        if (recipients.length > 0) {
          // Send alert email
          await sendHighSeverityAlert(defect, recipients);
        } else {
          console.warn('⚠️ No recipients found for defect alert');
        }
      } catch (error) {
        console.error('❌ Error processing defect change:', error.message);
      }
    });

    changeStream.on('error', (error) => {
console.error('❌ Change stream error:', error.message);
      
      // 1. Explicitly close the broken stream
      try {
        changeStream.close();
      } catch (err) {
        // Ignore close errors
      }

      // 2. Wait 5 seconds to let network settle
      setTimeout(() => {
        // Defect.db.readyState === 1 means Mongoose is successfully connected
        if (Defect.db.readyState === 1) {
          console.log('🔄 Database connected. Attempting to restart defect watcher...');
          startDefectWatcher();
        } else {
          console.log('⚠️ Database disconnected. Switching to fallback poller...');
          startDefectPoller(); // Trigger your built-in fallback!
        }
      }, 5000);
    });

    changeStream.on('close', () => {
      console.log('⚠️ Change stream closed');
    });

    console.log('✅ Defect watcher started successfully - listening for high severity defects');
    return changeStream;
  } catch (error) {
    console.error('❌ Failed to start defect watcher:', error.message);
    console.log('⚠️ Change Streams not available, falling back to polling...');
    // Could implement polling fallback here
    return null;
  }
};

/**
 * Fallback polling mechanism in case Change Streams fail
 * Checks database every 30 seconds for new high severity defects
 */
let activePollInterval = null;
export const startDefectPoller = async () => {
  if (activePollInterval) {
    clearInterval(activePollInterval);
  }
  let lastCheckTime = new Date();
  let isProcessing = false;

  // Check every 30 seconds
  const pollInterval = setInterval(async () => {
    if (isProcessing) return;

    isProcessing = true;
    try {
      // Find high severity defects created after last check that haven't sent notification
      const newDefects = await Defect.find({
        severity: { $in: ['High', 'high', 'Critical', 'critical'] },
        createdAt: { $gt: lastCheckTime },
        notificationSent: { $ne: true }
      }).sort({ createdAt: -1 });

      if (newDefects.length > 0) {
        console.log(`📋 Polling found ${newDefects.length} new high severity defect(s)`);
        const recipients = await getDefectAccessUsers();

        for (const defect of newDefects) {
          try {
            await sendHighSeverityAlert(defect, recipients);
            
            // Mark notification as sent
            await Defect.findByIdAndUpdate(defect._id, { notificationSent: true });
            console.log(`✅ Notification sent for defect: ${defect.title}`);
          } catch (error) {
            console.error(`❌ Failed to send alert for defect ${defect._id}:`, error.message);
          }
        }
      }

      lastCheckTime = new Date();
    } catch (error) {
      console.error('❌ Poller error:', error.message);
    } finally {
      isProcessing = false;
    }
  }, 30000); // 30 seconds

  console.log('✅ Defect poller started - checking every 30 seconds');
  return pollInterval;
};

/**
 * Initialize defect monitoring
 * Tries Change Streams first, falls back to polling if unavailable
 */
export const initializeDefectMonitoring = async () => {
  console.log('🚀 Initializing defect monitoring...');

  const changeStream = await startDefectWatcher();

  if (!changeStream) {
    console.log('⚠️ Change Streams unavailable, starting fallback poller');
    startDefectPoller();
  }
};

export default { startDefectWatcher, startDefectPoller, initializeDefectMonitoring };
