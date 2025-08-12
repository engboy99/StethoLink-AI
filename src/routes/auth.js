const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUser, updateUser, logAnalytics } = require('../config/firebase');
const { asyncHandler, validateRequest, requireAuth } = require('../middleware/errorHandler');
const { logger, medicalLogger } = require('../utils/logger');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  displayName: Joi.string().min(2).max(100).required(),
  language: Joi.string().valid('en', 'si', 'ta').default('en'),
  platform: Joi.string().valid('whatsapp', 'telegram', 'api').default('api')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(2).max(100).optional(),
  language: Joi.string().valid('en', 'si', 'ta').optional(),
  preferences: Joi.object({
    notifications: Joi.boolean().optional(),
    dailyReminders: Joi.boolean().optional()
  }).optional()
});

// Register new user
router.post('/register', validateRequest(registerSchema), asyncHandler(async (req, res) => {
  try {
    const { email, password, displayName, language, platform } = req.body;
    
    logger.info('👤 User registration attempt', { email, platform });

    // Check if user already exists
    try {
      const existingUser = await getUser(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists',
          message: 'A user with this email already exists'
        });
      }
    } catch (error) {
      // User doesn't exist, continue with registration
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user data
    const userData = {
      email,
      password: hashedPassword,
      displayName,
      language,
      platform
    };

    // Create user in Firebase
    const userRecord = await createUser(userData);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: userRecord.uid, 
        email: userRecord.email,
        role: 'student'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log analytics
    await logAnalytics({
      event: 'user_registration',
      userId: userRecord.uid,
      platform,
      language
    });

    logger.info('✅ User registered successfully', { userId: userRecord.uid });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: userRecord.uid,
          email: userRecord.email,
          displayName,
          language,
          platform
        },
        token
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in user registration:', error);
    medicalLogger.medicalError(error, {
      operation: 'user_registration',
      endpoint: '/auth/register'
    });
    
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  }
}));

// Login user
router.post('/login', validateRequest(loginSchema), asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    
    logger.info('🔐 User login attempt', { email });

    // Get user from database
    const user = await getUser(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.uid, 
        email: user.email,
        role: 'student'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update last login
    await updateUser(user.uid, {
      'stats.lastLogin': new Date(),
      'stats.lastActive': new Date()
    });

    // Log analytics
    await logAnalytics({
      event: 'user_login',
      userId: user.uid,
      platform: user.platform || 'api'
    });

    logger.info('✅ User logged in successfully', { userId: user.uid });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          language: user.language,
          platform: user.platform
        },
        token
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in user login:', error);
    medicalLogger.medicalError(error, {
      operation: 'user_login',
      endpoint: '/auth/login'
    });
    
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
}));

// Get user profile
router.get('/profile', requireAuth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    
    logger.info('👤 User profile request', { userId });

    const user = await getUser(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    // Remove sensitive data
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      data: {
        user: userProfile
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error getting user profile:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
      message: error.message
    });
  }
}));

// Update user profile
router.put('/profile', requireAuth, validateRequest(updateProfileSchema), asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    logger.info('👤 User profile update request', { userId, updateData });

    // Update user in database
    await updateUser(userId, updateData);

    // Get updated user data
    const updatedUser = await getUser(userId);
    const { password, ...userProfile } = updatedUser;

    // Log analytics
    await logAnalytics({
      event: 'user_profile_updated',
      userId,
      updateData
    });

    logger.info('✅ User profile updated successfully', { userId });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userProfile
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error updating user profile:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
}));

// Change password
router.post('/change-password', requireAuth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Invalid password',
        message: 'New password must be at least 8 characters long'
      });
    }

    logger.info('🔐 Password change request', { userId });

    // Get user
    const user = await getUser(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await updateUser(userId, { password: hashedNewPassword });

    // Log analytics
    await logAnalytics({
      event: 'password_changed',
      userId
    });

    logger.info('✅ Password changed successfully', { userId });

    res.json({
      success: true,
      message: 'Password changed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error changing password:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      message: error.message
    });
  }
}));

// Logout (client-side token invalidation)
router.post('/logout', requireAuth, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    
    logger.info('🚪 User logout request', { userId });

    // Update last logout
    await updateUser(userId, {
      'stats.lastLogout': new Date()
    });

    // Log analytics
    await logAnalytics({
      event: 'user_logout',
      userId
    });

    logger.info('✅ User logged out successfully', { userId });

    res.json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in user logout:', error);
    
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: error.message
    });
  }
}));

// Verify token
router.get('/verify', requireAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: req.user
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Authentication Service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router; 