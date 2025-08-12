const crypto = require('crypto');
const { logger } = require('./logger');

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

// Validate encryption key
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  logger.error('❌ Invalid encryption key. Must be 32 bytes (64 hex characters)');
  throw new Error('Invalid encryption key configuration');
}

// Convert hex key to buffer
const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');

/**
 * Encrypt data using AES-256-GCM
 * @param {string|Buffer} data - Data to encrypt
 * @param {string} purpose - Purpose of encryption (for logging)
 * @returns {string} - Encrypted data as base64 string
 */
function encryptData(data, purpose = 'general') {
  try {
    // Convert data to buffer if it's a string
    const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
    
    // Generate random IV
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Generate random salt
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipher(ALGORITHM, keyBuffer);
    cipher.setAAD(salt);
    
    // Encrypt data
    let encrypted = cipher.update(dataBuffer, null, 'base64');
    encrypted += cipher.final('base64');
    
    // Get auth tag
    const tag = cipher.getAuthTag();
    
    // Combine IV, salt, tag, and encrypted data
    const result = Buffer.concat([iv, salt, tag, Buffer.from(encrypted, 'base64')]);
    
    logger.info('🔐 Data encrypted successfully', {
      purpose,
      originalSize: dataBuffer.length,
      encryptedSize: result.length
    });
    
    return result.toString('base64');
    
  } catch (error) {
    logger.error('❌ Encryption failed:', error);
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

/**
 * Decrypt data using AES-256-GCM
 * @param {string} encryptedData - Encrypted data as base64 string
 * @param {string} purpose - Purpose of decryption (for logging)
 * @returns {string} - Decrypted data as string
 */
function decryptData(encryptedData, purpose = 'general') {
  try {
    // Convert base64 to buffer
    const encryptedBuffer = Buffer.from(encryptedData, 'base64');
    
    // Extract components
    const iv = encryptedBuffer.subarray(0, IV_LENGTH);
    const salt = encryptedBuffer.subarray(IV_LENGTH, IV_LENGTH + SALT_LENGTH);
    const tag = encryptedBuffer.subarray(IV_LENGTH + SALT_LENGTH, IV_LENGTH + SALT_LENGTH + TAG_LENGTH);
    const encrypted = encryptedBuffer.subarray(IV_LENGTH + SALT_LENGTH + TAG_LENGTH);
    
    // Create decipher
    const decipher = crypto.createDecipher(ALGORITHM, keyBuffer);
    decipher.setAAD(salt);
    decipher.setAuthTag(tag);
    
    // Decrypt data
    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');
    
    logger.info('🔓 Data decrypted successfully', {
      purpose,
      encryptedSize: encryptedBuffer.length,
      decryptedSize: decrypted.length
    });
    
    return decrypted;
    
  } catch (error) {
    logger.error('❌ Decryption failed:', error);
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

/**
 * Encrypt sensitive medical data
 * @param {object} medicalData - Medical data to encrypt
 * @returns {string} - Encrypted medical data
 */
function encryptMedicalData(medicalData) {
  try {
    const dataString = JSON.stringify(medicalData);
    return encryptData(dataString, 'medical');
  } catch (error) {
    logger.error('❌ Medical data encryption failed:', error);
    throw new Error(`Medical data encryption failed: ${error.message}`);
  }
}

/**
 * Decrypt sensitive medical data
 * @param {string} encryptedMedicalData - Encrypted medical data
 * @returns {object} - Decrypted medical data
 */
function decryptMedicalData(encryptedMedicalData) {
  try {
    const decryptedString = decryptData(encryptedMedicalData, 'medical');
    return JSON.parse(decryptedString);
  } catch (error) {
    logger.error('❌ Medical data decryption failed:', error);
    throw new Error(`Medical data decryption failed: ${error.message}`);
  }
}

/**
 * Hash sensitive data (one-way encryption)
 * @param {string} data - Data to hash
 * @param {string} salt - Optional salt
 * @returns {string} - Hashed data
 */
function hashData(data, salt = null) {
  try {
    const dataToHash = salt ? data + salt : data;
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
    
    logger.info('🔒 Data hashed successfully', {
      originalSize: data.length,
      hashedSize: hash.length
    });
    
    return hash;
  } catch (error) {
    logger.error('❌ Data hashing failed:', error);
    throw new Error(`Data hashing failed: ${error.message}`);
  }
}

/**
 * Generate secure random string
 * @param {number} length - Length of random string
 * @returns {string} - Random string
 */
function generateRandomString(length = 32) {
  try {
    return crypto.randomBytes(length).toString('hex');
  } catch (error) {
    logger.error('❌ Random string generation failed:', error);
    throw new Error(`Random string generation failed: ${error.message}`);
  }
}

/**
 * Generate secure token for authentication
 * @param {string} userId - User ID
 * @param {number} expiry - Expiry time in seconds
 * @returns {string} - Secure token
 */
function generateSecureToken(userId, expiry = 3600) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const expiryTime = timestamp + expiry;
    const randomPart = generateRandomString(16);
    
    const tokenData = {
      userId,
      timestamp,
      expiry: expiryTime,
      random: randomPart
    };
    
    const tokenString = JSON.stringify(tokenData);
    return encryptData(tokenString, 'authentication');
  } catch (error) {
    logger.error('❌ Secure token generation failed:', error);
    throw new Error(`Secure token generation failed: ${error.message}`);
  }
}

/**
 * Verify secure token
 * @param {string} token - Token to verify
 * @returns {object|null} - Token data or null if invalid
 */
function verifySecureToken(token) {
  try {
    const tokenData = JSON.parse(decryptData(token, 'authentication'));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (tokenData.expiry < currentTime) {
      logger.warn('⚠️ Token expired', { userId: tokenData.userId });
      return null;
    }
    
    return tokenData;
  } catch (error) {
    logger.error('❌ Token verification failed:', error);
    return null;
  }
}

/**
 * Encrypt file data
 * @param {Buffer} fileBuffer - File buffer to encrypt
 * @returns {string} - Encrypted file data
 */
function encryptFile(fileBuffer) {
  try {
    return encryptData(fileBuffer, 'file');
  } catch (error) {
    logger.error('❌ File encryption failed:', error);
    throw new Error(`File encryption failed: ${error.message}`);
  }
}

/**
 * Decrypt file data
 * @param {string} encryptedFileData - Encrypted file data
 * @returns {Buffer} - Decrypted file buffer
 */
function decryptFile(encryptedFileData) {
  try {
    const decryptedString = decryptData(encryptedFileData, 'file');
    return Buffer.from(decryptedString, 'base64');
  } catch (error) {
    logger.error('❌ File decryption failed:', error);
    throw new Error(`File decryption failed: ${error.message}`);
  }
}

// Test encryption/decryption on startup
function testEncryption() {
  try {
    const testData = 'Hello, StethoLink AI!';
    const encrypted = encryptData(testData, 'test');
    const decrypted = decryptData(encrypted, 'test');
    
    if (decrypted === testData) {
      logger.info('✅ Encryption/decryption test passed');
    } else {
      throw new Error('Encryption/decryption test failed');
    }
  } catch (error) {
    logger.error('❌ Encryption/decryption test failed:', error);
    throw error;
  }
}

module.exports = {
  encryptData,
  decryptData,
  encryptMedicalData,
  decryptMedicalData,
  hashData,
  generateRandomString,
  generateSecureToken,
  verifySecureToken,
  encryptFile,
  decryptFile,
  testEncryption
}; 