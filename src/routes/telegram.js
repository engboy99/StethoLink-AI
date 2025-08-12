const express = require('express');
const { processTelegramWebhook } = require('../bots/telegram');
const { logger } = require('../utils/logger');

const router = express.Router();

// Telegram webhook endpoint with bot token
router.post('/:token', async (req, res) => {
  try {
    logger.info('📲 Telegram webhook received', {
      method: req.method,
      token: req.params.token,
      body: req.body
    });

    await processTelegramWebhook(req, res);
    
  } catch (error) {
    logger.error('❌ Error in Telegram webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Telegram webhook verification
router.get('/:token', (req, res) => {
  const token = req.params.token;
  
  logger.info('🔐 Telegram webhook verification', { token });
  
  res.status(200).json({
    message: 'Telegram webhook endpoint is active',
    token: token ? 'valid' : 'missing',
    timestamp: new Date().toISOString()
  });
});

// Telegram health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Telegram Bot',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router; 