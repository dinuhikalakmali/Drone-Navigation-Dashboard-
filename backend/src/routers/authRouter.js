// ============ BLOCK 1: IMPORTS AND ROUTER ============

// Import Express to create routes
import express from 'express';

// Import bcryptjs to hash (scramble) passwords and compare them safely
import bcrypt from 'bcryptjs';

// Import jsonwebtoken to create login tokens (JWT)
import jwt from 'jsonwebtoken';

// Import the User model (used to talk to the "users" collection in MongoDB)
import User from '../models/userModel.js';

// Import the "protect" middleware, which only lets logged-in users pass
import { protect } from '../middleware/authMiddleware.js';

// Import Nodemailer to send emails (used for forgot password)
import nodemailer from 'nodemailer';

// Create a router: a mini-app that holds the auth-related routes
const router = express.Router();


// ============ BLOCK 2: REGISTER ============

// ===================== REGISTER =====================
// Public registration or admin user creation
// URL: POST /api/auth/register  (protect = user must be logged in)
router.post('/register', protect, async (req, res) => {
  // 'try' runs the code; 'catch' at the bottom handles unexpected errors
  try {
    // Take these values from the request body sent by the frontend
    const { name, email, password, type } = req.body;

    // Check if user is admin when creating users with specific roles (from settings)
    const userData = req.user; // From protect middleware (the logged-in user)

    // If a role other than 'user' is requested and the caller is not an admin...
    if (type && type !== 'user' && userData?.type !== 'admin') {
      // ...reject with 403 (Forbidden)
      return res.status(403).json({ message: 'Only admins can create users with specific roles' });
    }

    // Name, email and password must all be provided
    if (!name || !email || !password) {
      // 400 = Bad Request
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Look in the database for a user with the same email
    const exists = await User.findOne({ email });
    if (exists) {
      // Email is already taken
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Password must be at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the password (10 = how strong/slow the hashing is)
    // We never store the real password in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,     // store the hashed password
      type: type || 'user'          // saves the type you send (default is 'user')
    });

    // 201 = Created. Send back the user details (without the password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      }
    });
  } catch (err) {
    // Any unexpected error: send 500 (Server Error) with the message
    res.status(500).json({ error: err.message });
  }
});


// ============ BLOCK 3: LOGIN ============

// ===================== LOGIN =====================
// URL: POST /api/auth/login  (public: no login needed)
router.post('/login', async (req, res) => {
  try {
    // Get email and password from the request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Vague message so attackers can't tell if the email exists
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is temporarily locked
    // lockUntil holds the time until which the account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      // Time left in milliseconds
      const remainingMs = user.lockUntil - Date.now();
      // Convert to minutes and round up (60000 ms = 1 minute)
      const remainingMin = Math.ceil(remainingMs / 60000);
      // 429 = Too Many Requests
      return res.status(429).json({
        message: `Account locked. Try again in ${remainingMin} minute(s).`
      });
    }

    // Check password: compare typed password with the stored hashed one
    const isMatch = await bcrypt.compare(password, user.password);

    // If the password is wrong...
    if (!isMatch) {
      // Increase the failed attempts counter by 1 (start from 0 if empty)
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock after 5 failed attempts (e.g. for 15 minutes)
      if (user.failedLoginAttempts >= 5) {
        // Set the lock end time = now + 15 minutes
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        // Save the changes to the database
        await user.save();
        return res.status(429).json({
          message: 'Too many failed attempts. Account locked for 15 minutes.'
        });
      }

      // Not locked yet: save the updated counter
      await user.save();
      // Tell the user how many tries are left
      return res.status(400).json({
        message: `Invalid credentials. ${5 - user.failedLoginAttempts} attempt(s) remaining.`
      });
    }

    // Successful login → reset counter
    user.failedLoginAttempts = 0;
    // Remove any old lock time
    user.lockUntil = undefined;
    // Save the reset values
    await user.save();

    // Create a JWT token that contains the user's id
    const token = jwt.sign(
      { id: user._id },            // data stored inside the token
      process.env.JWT_SECRET,      // secret key from .env used to sign it
      { expiresIn: '1d' }          // token is valid for 1 day
    );

    // Send the token and basic user details to the frontend
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      }
    });
  } catch (err) {
    // Unexpected error
    res.status(500).json({ error: err.message });
  }
});


// ============ BLOCK 4: FORGOT PASSWORD ============

// ===================== FORGOT PASSWORD =====================
// URL: POST /api/auth/forgot-password  (public)
router.post('/forgot-password', async (req, res) => {
  try {
    // Get the email from the request body
    const { email } = req.body;

    // Email is required
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find the user with this email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if the email exists or not
      // (same message is used whether the email exists or not)
      return res.json({ message: 'If this email exists, a reset link has been sent.' });
    }

    // Create transporter (the email connection)
    const transporter = nodemailer.createTransport({
      service: 'gmail',                 // use Gmail to send
      auth: {
        user: process.env.EMAIL_USER,   // sender email from .env
        pass: process.env.EMAIL_PASS,   // sender password from .env
      },
    });

    // Email content
    const mailOptions = {
      // Sender shown as: "Drone Dashboard" <email>
      from: `"Drone Dashboard" <${process.env.EMAIL_USER}>`,
      // Send to the user who asked for the reset
      to: email,
      // Email subject line
      subject: 'Password Reset Request',
      // HTML body of the email
      html: `
        <h2>Password Reset</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="http://localhost:5173/auth-1/new-password?email=${email}" 
           style="padding: 10px 20px; background: #0d6efd; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    // Send email (wait until it is sent)
    await transporter.sendMail(mailOptions);

    // Tell the frontend the request was handled
    res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (err) {
    // Print the full error in the terminal for debugging
    console.error('Email error:', err);
    // Send a friendly error to the frontend
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});


// ============ BLOCK 5: RESET PASSWORD ============

// ===================== RESET PASSWORD =====================
// URL: POST /api/auth/reset-password  (public)
router.post('/reset-password', async (req, res) => {
  try {
    // Get the email and the new password from the request body
    const { email, password } = req.body;

    // Both are required
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // New password must be at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // 404 = Not Found
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    // Replace the old password with the new hashed one
    user.password = hashedPassword;
    // Save to the database
    await user.save();

    // Tell the frontend it worked
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============ BLOCK 6: PROFILE ============

// ===================== PROFILE (Protected) =====================
// URL: GET /api/auth/profile  (user must be logged in)
router.get('/profile', protect, (req, res) => {
  // "protect" already attached the user to req.user, so just send it back
  res.json(req.user);
});


// ============ BLOCK 7: GET ALL USERS ============

// ===================== GET ALL USERS (Admin Only) =====================
// URL: GET /api/auth/users
router.get('/users', protect, async (req, res) => {
  try {
    // Check if user is admin
    // Load the logged-in user fresh from the database
    const user = await User.findById(req.user.id);

    // If user is missing or their type is not 'admin' (case-insensitive)...
    if (!user || user.type?.toLowerCase() !== 'admin') {
      // ...block with 403 (Forbidden)
      return res.status(403).json({ 
        success: false,
        message: 'Only admins can view all users' 
      });
    }

    // Get every user; { password: 0 } means "do not include the password field"
    // sort({ createdAt: -1 }) puts the newest users first
    const allUsers = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    // Send the list to the frontend
    res.json({
      success: true,
      data: allUsers
    });
  } catch (err) {
    // Print the error in the terminal
    console.error('Error fetching users:', err);
    // Send a failure response
    res.status(500).json({ 
      success: false,
      message: 'Error fetching users',
      error: err.message 
    });
  }
});


// ============ BLOCK 8: UPDATE USER ROLE ============

// ===================== UPDATE USER ROLE (Admin Only) =====================
// URL: PUT /api/auth/users/:id/role  (:id = the id of the user to change)
router.put('/users/:id/role', protect, async (req, res) => {
  try {
    // Check if user is admin
    // Load the logged-in person (the one making the change)
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.type?.toLowerCase() !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Only admins can update user roles' 
      });
    }

    // Get the new role from the request body
    const { role } = req.body;

    // A role must be provided
    if (!role) {
      return res.status(400).json({ 
        success: false,
        message: 'Role is required' 
      });
    }

    // Validate role
    // List of roles that are allowed in the system
    const validRoles = ['admin', 'project supervisor', 'site engineer', 'qa officer', 'user'];
    // Reject if the given role is not in the list
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role. Must be one of: ' + validRoles.join(', ') 
      });
    }

    // Prevent removing last admin
    // If the admin is editing their own account and picking a non-admin role, stop it
    if (adminUser._id.toString() === req.params.id && role.toLowerCase() !== 'admin') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot remove admin role from your own account' 
      });
    }

    // Find the target user by id and update their role
    const targetUser = await User.findByIdAndUpdate(
      req.params.id,                  // which user to update
      { type: role.toLowerCase() },   // new role (saved in small letters)
      { new: true, runValidators: true } // return the updated user and run schema checks
    );

    // If no user has that id
    if (!targetUser) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Send back the updated user details
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        type: targetUser.type
      }
    });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating user role',
      error: err.message 
    });
  }
});


// ============ BLOCK 9: EXPORT ============

// Export the router so server.js can use it with app.use('/api/auth', authRouter)
export default router;