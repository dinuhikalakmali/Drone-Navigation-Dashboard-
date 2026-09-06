import nodemailer from 'nodemailer';

let transporter;

// Initialize email transporter
const initializeTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
  }
  return transporter;
};

/**
 * Send email alert for high severity defects
 * @param {Object} defect - The defect object
 * @param {Array} recipients - Array of user objects with email property
 */
export const sendHighSeverityAlert = async (defect, recipients) => {
  try {
    if (!recipients || recipients.length === 0) {
      console.warn('⚠️ No recipients found for defect alert');
      return;
    }

    const emailTransporter = initializeTransporter();
    const emailList = recipients.map(user => user.email).join(',');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px; background-color: #f5f5f5; margin-top: 10px; border-radius: 5px; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #d32f2f; }
            .button { 
              display: inline-block; 
              padding: 10px 20px; 
              background-color: #d32f2f; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin-top: 15px;
            }
            .button:hover { background-color: #b71c1c; }
            .footer { margin-top: 20px; font-size: 12px; color: #999; text-align: center; }
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
            <div class="header">
              <h2>🚨 CRITICAL ALERT: High Severity Defect Detected</h2>
            </div>
            
            <div class="content">
              <div class="field">
                <span class="label">Title:</span> ${defect.title || 'N/A'}
              </div>
              
              <div class="field">
                <span class="label">Severity:</span> 
                <span class="severity-badge">${defect.severity}</span>
              </div>
              
              <div class="field">
                <span class="label">Type:</span> ${defect.defect_type || 'N/A'}
              </div>
              
              <div class="field">
                <span class="label">Crack Type:</span> ${defect.crack_type || 'N/A'}
              </div>
              
              <div class="field">
                <span class="label">Description:</span> ${defect.description || 'N/A'}
              </div>
              
              <div class="field">
                <span class="label">Confidence:</span> ${defect.confidence || 'N/A'}%
              </div>
              
              ${defect.location ? `
                <div class="field">
                  <span class="label">Location:</span> 
                  Latitude: ${defect.location.lat}, Longitude: ${defect.location.Lng}
                </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Drone ID:</span> ${defect.droneId || defect.drone_id || 'N/A'}
              </div>
              
              <div class="field">
                <span class="label">Detected Time:</span> ${new Date(defect.detected_time).toLocaleString()}
              </div>
              
              <div class="field">
                <span class="label">Status:</span> ${defect.status}
              </div>
              
              ${defect.image ? `
                <div class="field">
                  <span class="label">Image:</span>
                  <br/>
                  <img src="cid:defectImage" alt="Defect Image" style="max-width: 100%; height: auto; margin-top: 10px; border-radius: 5px;">
                </div>
              ` : ''}
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/defects-list" class="button">
                View Defects Dashboard
              </a>
            </div>
            
            <div class="footer">
              <p>This is an automated alert. Please do not reply to this email.</p>
              <p>&copy; Drone Navigation Dashboard</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailList,
      subject: `🚨 CRITICAL: High Severity Defect - ${defect.title}`,
      html: htmlContent,
      attachDataUrls: true
    };

    // Attach image if available
    if (defect.imageUrl) {
      mailOptions.attachments = [{
        filename: 'defect-image.jpg',
        cid: 'defectImage',
        path: defect.imageUrl
      }];
    }

    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Email alert sent successfully. Recipients: ${emailList}, Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending high severity alert email:', error.message);
    throw error;
  }
};

/**
 * Test email connection
 */
export const testEmailConnection = async () => {
  try {
    const emailTransporter = initializeTransporter();
    await emailTransporter.verify();
    console.log('✅ Email service is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error.message);
    return false;
  }
};

export default { sendHighSeverityAlert, testEmailConnection };
