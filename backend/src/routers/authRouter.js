import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { protect } from '../middleware/authMiddleware.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// ===================== REGISTER =====================
// Public registration or admin user creation
router.post('/register', protect, async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    // Check if user is admin when creating users with specific roles (from settings)
    const userData = req.user; // From protect middleware
    if (type && type !== 'user' && userData?.type !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create users with specific roles' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      type: type || 'user'          // saves the type you send
    });

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
    res.status(500).json({ error: err.message });
  }
});

// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is temporarily locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMs = user.lockUntil - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return res.status(429).json({
        message: `Account locked. Try again in ${remainingMin} minute(s).`
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock after 5 failed attempts (e.g. for 15 minutes)
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        await user.save();
        return res.status(429).json({
          message: 'Too many failed attempts. Account locked for 15 minutes.'
        });
      }

      await user.save();
      return res.status(400).json({
        message: `Invalid credentials. ${5 - user.failedLoginAttempts} attempt(s) remaining.`
      });
    }

    // Successful login → reset counter
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

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
    res.status(500).json({ error: err.message });
  }
});


// ===================== FORGOT PASSWORD =====================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if the email exists or not
      return res.json({ message: 'If this email exists, a reset link has been sent.' });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Drone Dashboard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
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

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});
// ===================== RESET PASSWORD =====================
router.post('/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ===================== PROFILE (Protected) =====================
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

// ===================== GET ALL USERS (Admin Only) =====================
router.get('/users', protect, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.type?.toLowerCase() !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Only admins can view all users' 
      });
    }

    const allUsers = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: allUsers
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching users',
      error: err.message 
    });
  }
});

// ===================== UPDATE USER ROLE (Admin Only) =====================
router.put('/users/:id/role', protect, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.type?.toLowerCase() !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Only admins can update user roles' 
      });
    }

    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ 
        success: false,
        message: 'Role is required' 
      });
    }

    // Validate role
    const validRoles = ['admin', 'project supervisor', 'site engineer', 'qa officer', 'user'];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role. Must be one of: ' + validRoles.join(', ') 
      });
    }

    // Prevent removing last admin
    if (adminUser._id.toString() === req.params.id && role.toLowerCase() !== 'admin') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot remove admin role from your own account' 
      });
    }

    const targetUser = await User.findByIdAndUpdate(
      req.params.id,
      { type: role.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!targetUser) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

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

export default router;