import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Normalize email to prevent duplicates due to case mismatch or spacing issues
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email: normalizedEmail, password: hashedPassword, role: role || 'student' });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Normalize email
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/students', async (req, res) => {
  try {
    const studentsList = await User.find({ role: 'student' }).select('-password');
    res.json(studentsList);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.role !== 'student') {
      return res.status(400).json({ message: 'Cannot delete admin users through this route' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Sign-In Login/Registration Endpoint
router.post('/google-login', async (req, res) => {
  try {
    const { token, name, email, isMock } = req.body;
    
    let userEmail = email ? email.toLowerCase().trim() : '';
    let userName = name || 'Google User';

    if (!isMock && token) {
      // Validate real Google OAuth token using Google API
      try {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        if (!response.ok) {
          return res.status(400).json({ message: 'Invalid Google credential token' });
        }
        const data = await response.json();
        userEmail = data.email ? data.email.toLowerCase().trim() : '';
        userName = data.name || userName;
      } catch (err) {
        console.error('Google token verification failed:', err);
        return res.status(500).json({ message: 'Google authentication failed' });
      }
    }

    if (!userEmail) {
      return res.status(400).json({ message: 'Email is required from Google account' });
    }

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      // If user does not exist, register them as a student
      // Generate a secure random password since schema requires one
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = new User({
        name: userName,
        email: userEmail,
        password: hashedPassword,
        role: 'student'
      });
      await user.save();
      console.log(`Created new Google student user: ${userName} (${userEmail})`);
    }

    // Sign JWT token
    const jwtToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Google login endpoint error:', error);
    res.status(500).json({ message: 'Server error during Google Login' });
  }
});

// Forgot Password Endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Return success anyway to prevent email harvesting (security best practice)
      return res.json({ message: 'If a matching account exists, a password reset link has been sent!' });
    }

    // Generate secure random reset token
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // In local development, we print the reset link clearly in the server logs.
    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    console.log('\n================ PASSWORD RESET LINK ================');
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('=====================================================\n');

    res.json({ message: 'If a matching account exists, a password reset link has been sent!' });
  } catch (error) {
    console.error('Forgot password endpoint error:', error);
    res.status(500).json({ message: 'Server error during forgot password' });
  }
});

// Reset Password Endpoint
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Hash the new password and update the user record
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`Password successfully reset for user: ${user.name} (${user.email})`);
    res.json({ message: 'Password has been successfully updated!' });
  } catch (error) {
    console.error('Reset password endpoint error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

export default router;
