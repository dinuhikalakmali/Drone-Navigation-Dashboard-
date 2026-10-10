// ============ BLOCK 1: IMPORT AND TRANSPORTER VARIABLE ============

// Import Nodemailer, the library used to send emails from Node.js
import nodemailer from 'nodemailer';

// Variable to store the email connection (called a "transporter")
// It is empty at first and filled the first time it is needed
let transporter;


// ============ BLOCK 2: CREATE THE EMAIL TRANSPORTER ============

// Initialize email transporter
const initializeTransporter = () => {
  // Only create a new connection if one does not exist yet
  if (!transporter) {
    // Create the connection using settings from the .env file
    transporter = nodemailer.createTransport({
      // Email provider name (e.g. gmail). Uses 'gmail' if EMAIL_SERVICE is not set
      service: process.env.EMAIL_SERVICE || 'gmail',

      // Login details used to sign in to the email account
      auth: {
        // The email address that will send the emails
        user: process.env.EMAIL_USER,
        // The password (for Gmail, this is usually an "App Password")
        pass: process.env.EMAIL_PASSWORD,
      }
    });
  }

  // Give back the transporter (new one or the existing one)
  return transporter;
};


// ============ BLOCK 3: SEND HIGH SEVERITY ALERT EMAIL ============

/**
 * Send email alert for high severity defects
 * @param {Object} defect - The defect object
 * @param {Array} recipients - Array of user objects with email property
 */
// 'export' lets other files use this; 'async' because sending email takes time
export const sendHighSeverityAlert = async (defect, recipients) => {
  // 'try' block: if anything fails, 'catch' at the bottom handles it
  try {
    // If the recipients list is missing or empty, there is nobody to email
    if (!recipients || recipients.length === 0) {
      // Show a warning in the terminal
      console.warn('⚠️ No recipients found for defect alert');
      // Stop the function here (nothing to send)
      return;
    }

    // Get the email connection (created once, reused after)
    const emailTransporter = initializeTransporter();

    // Take only the email address from each user and join them with commas
    // Example: "a@x.com,b@x.com,c@x.com"
    const emailList = recipients.map(user => user.email).join(',');

    // Build the email body as HTML text
    // Backticks (`) allow multi-line text and ${...} to insert values
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* Page font and text colour */
            body { font-family: Arial, sans-serif; color: #333; }

            /* Centre the email content and limit its width */
            .container { max-width: 600px; margin: 0 auto; }

            /* Red banner at the top of the email */
            .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 5px; }

            /* Grey box that holds the defect details */
            .content { padding: 20px; background-color: #f5f5f5; margin-top: 10px; border-radius: 5px; }

            /* Spacing between each detail row */
            .field { margin: 10px 0; }

            /* Bold red text for labels like "Title:" */
            .label { font-weight: bold; color: #d32f2f; }

            /* Red button style for the dashboard link */
            .button { 
              display: inline-block; 
              padding: 10px 20px; 
              background-color: #d32f2f; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin-top: 15px;
            }

            /* Darker red when the mouse is over the button */
            .button:hover { background-color: #b71c1c; }

            /* Small grey text at the bottom */
            .footer { margin-top: 20px; font-size: 12px; color: #999; text-align: center; }

            /* Red badge that highlights the severity word */
            .severity-badge { 
              display: inline-block; 
              padding: 5px 10px; 
              background-color: #d32f2f; 
              color: white; 
              border-radius: 3px; 
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Red banner with the alert heading -->
            <div class="header">
              <h2>🚨 CRITICAL ALERT: High Severity Defect Detected</h2>
            </div>
            
            <!-- Main box with defect details -->
            <div class="content">
              <!-- Defect title (shows N/A if missing) -->
              <div class="field">
                <span class="label">Title:</span> ${defect.title || 'N/A'}
              </div>
              
              <!-- Severity shown inside the red badge -->
              <div class="field">
                <span class="label">Severity:</span> 
                <span class="severity-badge">${defect.severity}</span>
              </div>
              
              <!-- Type of defect -->
              <div class="field">
                <span class="label">Type:</span> ${defect.defect_type || 'N/A'}
              </div>
              
              <!-- Type of crack -->
              <div class="field">
                <span class="label">Crack Type:</span> ${defect.crack_type || 'N/A'}
              </div>
              
              <!-- Description of the defect -->
              <div class="field">
                <span class="label">Description:</span> ${defect.description || 'N/A'}
              </div>
              
              <!-- How sure the detection model is, in percent -->
              <div class="field">
                <span class="label">Confidence:</span> ${defect.confidence || 'N/A'}%
              </div>
              
              <!-- Show location only if the defect has location data -->
              ${defect.location ? `
                <div class="field">
                  <span class="label">Location:</span> 
                  Latitude: ${defect.location.lat}, Longitude: ${defect.location.Lng}
                </div>
              ` : ''}
              
              <!-- Drone ID (tries droneId first, then drone_id) -->
              <div class="field">
                <span class="label">Drone ID:</span> ${defect.droneId || defect.drone_id || 'N/A'}
              </div>
              
              <!-- Time of detection, converted to a readable local date and time -->
              <div class="field">
                <span class="label">Detected Time:</span> ${new Date(defect.detected_time).toLocaleString()}
              </div>
              
              <!-- Current status of the defect -->
              <div class="field">
                <span class="label">Status:</span> ${defect.status}
              </div>
              
              <!-- Show the image only if the defect has one -->
              <!-- "cid:defectImage" points to the attachment added further below -->
              ${defect.image ? `
                <div class="field">
                  <span class="label">Image:</span>
                  <br/>
                  <img src="cid:defectImage" alt="Defect Image" style="max-width: 100%; height: auto; margin-top: 10px; border-radius: 5px;">
                </div>
              ` : ''}
              
              <!-- Button linking to the frontend defects page -->
              <!-- Uses FRONTEND_URL from .env, or localhost:3000 if not set -->
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/defects-list" class="button">
                View Defects Dashboard
              </a>
            </div>
            
            <!-- Footer text -->
            <div class="footer">
              <p>This is an automated alert. Please do not reply to this email.</p>
              <p>&copy; Drone Navigation Dashboard</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Prepare the email settings
    const mailOptions = {
      // Sender address
      from: process.env.EMAIL_USER,
      // Receiver addresses (comma separated list)
      to: emailList,
      // Subject line of the email
      subject: `🚨 CRITICAL: High Severity Defect - ${defect.title}`,
      // The HTML body built above
      html: htmlContent,
      // Allow images given as data URLs (base64) inside the email
      attachDataUrls: true
    };

    // Attach image if available
    if (defect.imageUrl) {
      // Add the image as an attachment that the <img src="cid:..."> can display
      mailOptions.attachments = [{
        // File name shown to the receiver
        filename: 'defect-image.jpg',
        // Content ID: must match "cid:defectImage" in the HTML
        cid: 'defectImage',
        // Where the image is located (a URL or file path)
        path: defect.imageUrl
      }];
    }

    // Send the email and wait for the result
    const info = await emailTransporter.sendMail(mailOptions);

    // Print a success message with the recipients and the email's unique ID
    console.log(`✅ Email alert sent successfully. Recipients: ${emailList}, Message ID: ${info.messageId}`);

    // Return the result to whoever called this function
    return info;
  } catch (error) {
    // If sending failed, print the error message
    console.error('❌ Error sending high severity alert email:', error.message);
    // Throw the error again so the caller (watcher/poller) knows it failed
    throw error;
  }
};


// ============ BLOCK 4: TEST EMAIL CONNECTION ============

/**
 * Test email connection
 */
export const testEmailConnection = async () => {
  try {
    // Get the email connection
    const emailTransporter = initializeTransporter();

    // Ask the email server if our login details and settings are valid
    await emailTransporter.verify();

    // Verification passed
    console.log('✅ Email service is ready to send messages');
    // Return true: email works
    return true;
  } catch (error) {
    // Verification failed (wrong password, no internet, etc.)
    console.error('❌ Email service verification failed:', error.message);
    // Return false: email does not work (server.js uses this to skip monitoring)
    return false;
  }
};


// ============ BLOCK 5: EXPORTS ============

// Export both functions together as the default export
export default { sendHighSeverityAlert, testEmailConnection };