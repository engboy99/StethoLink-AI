const { logger } = require('../utils/logger');

// Basic validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Basic validation - can be extended with Joi or other validation libraries
      if (!req.body) {
        return res.status(400).json({
          success: false,
          error: 'Request body is required'
        });
      }
      next();
    } catch (error) {
      logger.error('Validation error:', error);
      res.status(400).json({
        success: false,
        error: 'Validation failed'
      });
    }
  };
};

// Specific validators
const validateDrugInteractions = (req, res, next) => {
  if (!req.body.drugs || !Array.isArray(req.body.drugs)) {
    return res.status(400).json({
      success: false,
      error: 'Drugs array is required'
    });
  }
  next();
};

const validateClinicalDecision = (req, res, next) => {
  if (!req.body.symptoms || !Array.isArray(req.body.symptoms)) {
    return res.status(400).json({
      success: false,
      error: 'Symptoms array is required'
    });
  }
  if (!req.body.age || !req.body.gender) {
    return res.status(400).json({
      success: false,
      error: 'Age and gender are required'
    });
  }
  next();
};

const validateImageAnalysis = (req, res, next) => {
  if (!req.body.imageDescription) {
    return res.status(400).json({
      success: false,
      error: 'Image description is required'
    });
  }
  next();
};

const validatePatientEducation = (req, res, next) => {
  if (!req.body.diagnosis) {
    return res.status(400).json({
      success: false,
      error: 'Diagnosis is required'
    });
  }
  next();
};

const validateCalculator = (req, res, next) => {
  if (!req.body.type || !req.body.parameters) {
    return res.status(400).json({
      success: false,
      error: 'Calculator type and parameters are required'
    });
  }
  next();
};

module.exports = {
  validateRequest,
  validateDrugInteractions,
  validateClinicalDecision,
  validateImageAnalysis,
  validatePatientEducation,
  validateCalculator
}; 