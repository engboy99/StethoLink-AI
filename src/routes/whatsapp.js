const express = require('express');
const { handleWhatsAppMessage } = require('../bots/whatsapp-ultimate');
const { logger } = require('../utils/logger');

const router = express.Router();

// WhatsApp webhook endpoint
router.post('/', async (req, res) => {
  try {
    logger.info('📱 WhatsApp webhook received', {
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    await handleWhatsAppMessage(req, res);
    
  } catch (error) {
    logger.error('❌ Error in WhatsApp webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

// WhatsApp status callback endpoint (for Twilio)
router.post('/status', async (req, res) => {
  try {
    logger.info('📊 WhatsApp status callback received', {
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = req.body;
    
    // Log the status update
    logger.info(`📊 Message Status Update: ${MessageSid} - ${MessageStatus}`, {
      messageSid: MessageSid,
      status: MessageStatus,
      errorCode: ErrorCode,
      errorMessage: ErrorMessage
    });

    // Handle different status types
    switch (MessageStatus) {
      case 'delivered':
        logger.info(`✅ Message delivered: ${MessageSid}`);
        break;
      case 'read':
        logger.info(`👁️ Message read: ${MessageSid}`);
        break;
      case 'failed':
        logger.error(`❌ Message failed: ${MessageSid} - ${ErrorMessage}`);
        break;
      case 'sent':
        logger.info(`📤 Message sent: ${MessageSid}`);
        break;
      default:
        logger.info(`ℹ️ Message status: ${MessageSid} - ${MessageStatus}`);
    }

    res.status(200).send('OK');
    
  } catch (error) {
    logger.error('❌ Error in WhatsApp status callback:', error);
    res.status(500).send('Internal Server Error');
  }
});

// WhatsApp webhook verification (for Twilio)
router.get('/', (req, res) => {
  const challenge = req.query.challenge;
  
  if (challenge) {
    logger.info('🔐 WhatsApp webhook verification', { challenge });
    res.status(200).send(challenge);
  } else {
    res.status(200).json({
      message: 'WhatsApp webhook endpoint is active',
      timestamp: new Date().toISOString(),
      features: [
        'Year-specific curriculum (1st-5th year)',
        'Sri Lankan medical context',
        'Emergency training modules',
        'Clinical procedures training',
        'Achievement tracking',
        'Research project management',
        'Clinical case management',
        'Exam schedule and study planning',
        'Natural language processing',
        '16-number menu system'
      ],
      endpoints: {
        webhook: 'POST /',
        status: 'POST /status',
        health: 'GET /health'
      }
    });
  }
});

// WhatsApp health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'WhatsApp Ultimate Bot',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    features: 'Enhanced with year-specific curriculum, Sri Lankan context, emergency training, and clinical procedures'
  });
});

module.exports = router; 