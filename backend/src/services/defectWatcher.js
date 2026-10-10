// ============ BLOCK 1: IMPORTS ============

// Import the Defect model (used to talk to the "defects" collection in MongoDB)
import Defect from '../models/defectsModel.js';

// Import a helper that returns the list of users who should receive defect alerts
import { getDefectAccessUsers } from '../helpers/defectNotification.js';

// Import the function that sends the high severity alert email
import { sendHighSeverityAlert } from './emailService.js';


// ============ BLOCK 2: CHANGE STREAM WATCHER ============

/**
 * Start MongoDB Change Stream watcher for high severity defects
 * This watches for new defects being inserted and triggers alerts
 */
// 'export' lets other files import this function; 'async' lets us use 'await' inside
export const startDefectWatcher = async () => {
  // 'try' block: if anything fails while starting, 'catch' at the bottom handles it
  try {
    // Create a change stream on the Defect collection
    // A change stream is a live feed of database changes
    const changeStream = Defect.watch([
      {
        // $match is a filter: only changes matching these rules are delivered to us
        $match: {
          // Only care about new documents being inserted (not updates or deletes)
          'operationType': 'insert',

          // Only care if the new defect's severity is one of these values
          // (both capital and small letters are listed to be safe)
          'fullDocument.severity': { 
            $in: ['High', 'high', 'Critical', 'critical'] 
          }
        }
      }
    ]);

    // When a matching change arrives, run this function
    changeStream.on('change', async (change) => {
      // Inner try/catch so one failed alert doesn't crash the whole watcher
      try {
        // 'fullDocument' is the complete new defect record that was inserted
        const defect = change.fullDocument;

        // Print a message in the terminal showing which defect was detected
        console.log('🚨 High severity defect detected via Change Stream:', defect.title);

        // Get all users who have access to defects (these will receive the email)
        const recipients = await getDefectAccessUsers();

        // If there is at least one person to notify...
        if (recipients.length > 0) {
          // Send alert email (wait until it finishes)
          await sendHighSeverityAlert(defect, recipients);
        } else {
          // Nobody to notify, so just print a warning
          console.warn('⚠️ No recipients found for defect alert');
        }
      } catch (error) {
        // If anything fails while processing this defect, print the error message
        console.error('❌ Error processing defect change:', error.message);
      }
    });


    // ============ BLOCK 3: ERROR AND CLOSE HANDLING ============

    // When the change stream hits an error (e.g. network problem), run this
    changeStream.on('error', (error) => {
      // Print the error message
      console.error('❌ Change stream error:', error.message);
      
      // 1. Explicitly close the broken stream
      try {
        changeStream.close();
      } catch (err) {
        // Ignore close errors (the stream may already be closed)
      }

      // 2. Wait 5 seconds to let network settle
      setTimeout(() => {
        // Defect.db.readyState === 1 means Mongoose is successfully connected
        if (Defect.db.readyState === 1) {
          // Database is fine, so try starting the watcher again
          console.log('🔄 Database connected. Attempting to restart defect watcher...');
          startDefectWatcher();
        } else {
          // Database is not connected, so use the backup polling method instead
          console.log('⚠️ Database disconnected. Switching to fallback poller...');
          startDefectPoller(); // Trigger your built-in fallback!
        }
      }, 5000); // 5000 milliseconds = 5 seconds
    });

    // When the change stream closes, just print a message
    changeStream.on('close', () => {
      console.log('⚠️ Change stream closed');
    });

    // If we reached here, the watcher started without problems
    console.log('✅ Defect watcher started successfully - listening for high severity defects');

    // Return the stream so the caller knows it worked
    return changeStream;
  } catch (error) {
    // Starting failed (for example, Change Streams need a MongoDB replica set)
    console.error('❌ Failed to start defect watcher:', error.message);
    console.log('⚠️ Change Streams not available, falling back to polling...');
    // Could implement polling fallback here

    // Return null so the caller knows the watcher did NOT start
    return null;
  }
};


// ============ BLOCK 4: FALLBACK POLLER ============

/**
 * Fallback polling mechanism in case Change Streams fail
 * Checks database every 30 seconds for new high severity defects
 */

// Variable meant to remember the running timer (so we can stop an old one)
let activePollInterval = null;

export const startDefectPoller = async () => {
  // If a poller timer already exists, stop it so we don't run two at once
  if (activePollInterval) {
    clearInterval(activePollInterval);
  }

  // Remember the time of the last check; only defects newer than this are "new"
  let lastCheckTime = new Date();

  // Flag to stop a new check from starting while the previous one is still running
  let isProcessing = false;

  // Check every 30 seconds
  // setInterval runs the given function again and again after every 30000 ms
  const pollInterval = setInterval(async () => {
    // If the last check is still busy, skip this round
    if (isProcessing) return;

    // Mark that we are now busy
    isProcessing = true;
    try {
      // Find high severity defects created after last check that haven't sent notification
      const newDefects = await Defect.find({
        // Severity must be High or Critical
        severity: { $in: ['High', 'high', 'Critical', 'critical'] },

        // Created after the last time we checked ($gt = greater than)
        createdAt: { $gt: lastCheckTime },

        // Email not already sent ($ne = not equal to true)
        notificationSent: { $ne: true }
      }).sort({ createdAt: -1 }); // Sort newest first

      // If we found at least one new defect...
      if (newDefects.length > 0) {
        // Print how many were found
        console.log(`📋 Polling found ${newDefects.length} new high severity defect(s)`);

        // Get the users who should be notified (fetched once for all defects)
        const recipients = await getDefectAccessUsers();

        // Go through each defect one by one
        for (const defect of newDefects) {
          // Inner try/catch so one failure doesn't stop the other defects
          try {
            // Send the alert email for this defect
            await sendHighSeverityAlert(defect, recipients);
            
            // Mark notification as sent (so it is not emailed again)
            await Defect.findByIdAndUpdate(defect._id, { notificationSent: true });

            // Print a success message
            console.log(`✅ Notification sent for defect: ${defect.title}`);
          } catch (error) {
            // Print which defect failed and why
            console.error(`❌ Failed to send alert for defect ${defect._id}:`, error.message);
          }
        }
      }

      // Update the last check time to "now" for the next round
      lastCheckTime = new Date();
    } catch (error) {
      // If the whole check failed (e.g. database error), print the error
      console.error('❌ Poller error:', error.message);
    } finally {
      // 'finally' always runs: mark as not busy so the next round can start
      isProcessing = false;
    }
  }, 30000); // 30 seconds

  // Print that the poller has started
  console.log('✅ Defect poller started - checking every 30 seconds');

  // Return the timer so it can be stopped later if needed
  return pollInterval;
};


// ============ BLOCK 5: INITIALIZE MONITORING ============

/**
 * Initialize defect monitoring
 * Tries Change Streams first, falls back to polling if unavailable
 */
export const initializeDefectMonitoring = async () => {
  // Print a message that setup is beginning
  console.log('🚀 Initializing defect monitoring...');

  // Try the live Change Stream watcher first (wait for the result)
  const changeStream = await startDefectWatcher();

  // If it returned null, the watcher failed to start
  if (!changeStream) {
    console.log('⚠️ Change Streams unavailable, starting fallback poller');

    // Start the backup poller instead
    startDefectPoller();
  }
};


// ============ BLOCK 6: EXPORTS ============

// Also export all three functions together as the default export
export default { startDefectWatcher, startDefectPoller, initializeDefectMonitoring };