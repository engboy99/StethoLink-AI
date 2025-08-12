const { logger } = require('../utils/logger');

class AdvancedMedicalCalculators {
  constructor() {
    this.calculatorCategories = this.initializeCalculatorCategories();
    this.calculationFormulas = this.initializeCalculationFormulas();
    this.referenceRanges = this.initializeReferenceRanges();
    this.clinicalGuidelines = this.initializeClinicalGuidelines();
  }

  // Initialize Calculator Categories
  initializeCalculatorCategories() {
    return {
      'icu_scoring': {
        name: 'ICU Scoring Systems',
        icon: '🏥',
        color: 'red',
        calculators: ['APACHE II', 'SOFA Score', 'Glasgow Coma Scale', 'RASS Score'],
        description: 'Intensive care unit mortality prediction and severity scoring'
      },
      'pediatric': {
        name: 'Pediatric Calculations',
        icon: '👶',
        color: 'blue',
        calculators: ['Pediatric Advanced Life Support', 'Pediatric Dosing', 'Growth Charts', 'Pediatric GCS'],
        description: 'Specialized calculations for pediatric patients'
      },
      'obstetric': {
        name: 'Obstetric Risk Assessment',
        icon: '🤱',
        color: 'pink',
        calculators: ['Bishop Score', 'Obstetric Risk Assessment', 'Gestational Age', 'Fetal Heart Rate'],
        description: 'Pregnancy and delivery risk assessment tools'
      },
      'oncology': {
        name: 'Oncology Staging',
        icon: '🔬',
        color: 'purple',
        calculators: ['TNM Staging', 'ECOG Performance Status', 'Karnofsky Score', 'Cancer Risk Assessment'],
        description: 'Cancer staging and performance status assessment'
      },
      'psychiatric': {
        name: 'Psychiatric Assessment',
        icon: '🧠',
        color: 'green',
        calculators: ['PHQ-9 Depression', 'GAD-7 Anxiety', 'MMSE Cognitive', 'CAGE Alcohol'],
        description: 'Mental health screening and assessment tools'
      },
      'cardiovascular': {
        name: 'Cardiovascular Risk',
        icon: '❤️',
        color: 'darkred',
        calculators: ['Framingham Risk Score', 'ASCVD Risk', 'CHADS2 Score', 'HEART Score'],
        description: 'Cardiovascular risk assessment and prediction'
      }
    };
  }

  // Initialize Calculation Formulas
  initializeCalculationFormulas() {
    return {
      'apache_ii': {
        name: 'APACHE II Score',
        description: 'Acute Physiology and Chronic Health Evaluation II',
        components: [
          'Age points',
          'Acute physiology score (12 variables)',
          'Chronic health points'
        ],
        formula: 'APACHE II = Age Points + Acute Physiology Score + Chronic Health Points',
        interpretation: {
          '0-4': 'Mortality: 4%',
          '5-9': 'Mortality: 8%',
          '10-14': 'Mortality: 15%',
          '15-19': 'Mortality: 25%',
          '20-24': 'Mortality: 40%',
          '25-29': 'Mortality: 55%',
          '30-34': 'Mortality: 75%',
          '35+': 'Mortality: 85%'
        }
      },
      'sofa_score': {
        name: 'SOFA Score',
        description: 'Sequential Organ Failure Assessment',
        components: [
          'Respiratory (PaO2/FiO2)',
          'Coagulation (Platelets)',
          'Liver (Bilirubin)',
          'Cardiovascular (MAP/Vasopressors)',
          'Central Nervous System (GCS)',
          'Renal (Creatinine/Urine Output)'
        ],
        formula: 'SOFA = Sum of all organ system scores (0-4 each)',
        interpretation: {
          '0-6': 'Mortality: <10%',
          '7-9': 'Mortality: 15-20%',
          '10-12': 'Mortality: 40-50%',
          '13-14': 'Mortality: 50-60%',
          '15+': 'Mortality: 80-95%'
        }
      },
      'glasgow_coma_scale': {
        name: 'Glasgow Coma Scale',
        description: 'Neurological assessment tool',
        components: [
          'Eye Opening (1-4 points)',
          'Verbal Response (1-5 points)',
          'Motor Response (1-6 points)'
        ],
        formula: 'GCS = Eye Opening + Verbal Response + Motor Response',
        interpretation: {
          '13-15': 'Mild brain injury',
          '9-12': 'Moderate brain injury',
          '3-8': 'Severe brain injury'
        }
      },
      'bishop_score': {
        name: 'Bishop Score',
        description: 'Cervical readiness for labor',
        components: [
          'Dilation (0-3 points)',
          'Effacement (0-3 points)',
          'Station (0-3 points)',
          'Consistency (0-2 points)',
          'Position (0-2 points)'
        ],
        formula: 'Bishop Score = Sum of all components (0-13)',
        interpretation: {
          '0-3': 'Unfavorable for induction',
          '4-6': 'Moderately favorable',
          '7-13': 'Favorable for induction'
        }
      },
      'phq9': {
        name: 'PHQ-9 Depression Screening',
        description: 'Patient Health Questionnaire-9',
        components: [
          'Little interest or pleasure in doing things',
          'Feeling down, depressed, or hopeless',
          'Trouble falling/staying asleep, sleeping too much',
          'Feeling tired or having little energy',
          'Poor appetite or overeating',
          'Feeling bad about yourself',
          'Trouble concentrating',
          'Moving or speaking slowly/being fidgety',
          'Thoughts of self-harm'
        ],
        formula: 'PHQ-9 = Sum of all responses (0-27)',
        interpretation: {
          '0-4': 'Minimal depression',
          '5-9': 'Mild depression',
          '10-14': 'Moderate depression',
          '15-19': 'Moderately severe depression',
          '20-27': 'Severe depression'
        }
      }
    };
  }

  // Initialize Reference Ranges
  initializeReferenceRanges() {
    return {
      'vital_signs': {
        'blood_pressure': {
          'systolic': { min: 90, max: 140, unit: 'mmHg' },
          'diastolic': { min: 60, max: 90, unit: 'mmHg' }
        },
        'heart_rate': { min: 60, max: 100, unit: 'bpm' },
        'respiratory_rate': { min: 12, max: 20, unit: 'breaths/min' },
        'temperature': { min: 36.5, max: 37.5, unit: '°C' },
        'oxygen_saturation': { min: 95, max: 100, unit: '%' }
      },
      'laboratory': {
        'hemoglobin': { min: 12, max: 16, unit: 'g/dL' },
        'platelets': { min: 150000, max: 450000, unit: '/μL' },
        'creatinine': { min: 0.6, max: 1.2, unit: 'mg/dL' },
        'bilirubin': { min: 0.3, max: 1.2, unit: 'mg/dL' },
        'pao2': { min: 80, max: 100, unit: 'mmHg' }
      }
    };
  }

  // Initialize Clinical Guidelines
  initializeClinicalGuidelines() {
    return {
      'apache_ii_guidelines': {
        title: 'APACHE II Clinical Guidelines',
        description: 'Guidelines for using APACHE II score in clinical practice',
        recommendations: [
          'Calculate within 24 hours of ICU admission',
          'Use for mortality prediction and resource allocation',
          'Consider limitations in specific patient populations',
          'Combine with clinical judgment for decision making'
        ],
        limitations: [
          'May not apply to all ICU populations',
          'Requires complete physiological data',
          'Does not account for quality of life outcomes'
        ]
      },
      'gcs_guidelines': {
        title: 'Glasgow Coma Scale Guidelines',
        description: 'Guidelines for GCS assessment and interpretation',
        recommendations: [
          'Assess all three components systematically',
          'Document best response for each component',
          'Reassess frequently in acute brain injury',
          'Use in conjunction with other neurological assessments'
        ],
        limitations: [
          'May be affected by sedation or paralysis',
          'Limited utility in intubated patients',
          'Requires training for accurate assessment'
        ]
      }
    };
  }

  // Calculate APACHE II Score
  calculateApacheII(patientData) {
    try {
      const {
        age,
        temperature,
        meanArterialPressure,
        heartRate,
        respiratoryRate,
        pao2,
        arterialPh,
        sodium,
        potassium,
        creatinine,
        hematocrit,
        whiteBloodCellCount,
        glasgowComaScale,
        chronicHealthConditions
      } = patientData;

      let score = 0;

      // Age points
      if (age < 44) score += 0;
      else if (age < 54) score += 2;
      else if (age < 64) score += 3;
      else if (age < 74) score += 5;
      else score += 6;

      // Acute physiology score (simplified)
      score += this.calculateAcutePhysiologyScore({
        temperature, meanArterialPressure, heartRate, respiratoryRate,
        pao2, arterialPh, sodium, potassium, creatinine,
        hematocrit, whiteBloodCellCount, glasgowComaScale
      });

      // Chronic health points
      if (chronicHealthConditions && chronicHealthConditions.length > 0) {
        score += 5;
      }

      const mortalityRisk = this.getApacheIIMortalityRisk(score);

      return {
        score,
        mortalityRisk,
        interpretation: this.getApacheIIInterpretation(score),
        components: {
          agePoints: this.getAgePoints(age),
          acutePhysiologyScore: this.calculateAcutePhysiologyScore({
            temperature, meanArterialPressure, heartRate, respiratoryRate,
            pao2, arterialPh, sodium, potassium, creatinine,
            hematocrit, whiteBloodCellCount, glasgowComaScale
          }),
          chronicHealthPoints: chronicHealthConditions && chronicHealthConditions.length > 0 ? 5 : 0
        },
        recommendations: this.getApacheIIRecommendations(score)
      };
    } catch (error) {
      logger.error('❌ Error calculating APACHE II:', error);
      throw error;
    }
  }

  // Calculate Acute Physiology Score
  calculateAcutePhysiologyScore(vitals) {
    let score = 0;
    
    // Simplified scoring - in practice, each variable has specific ranges
    const { temperature, meanArterialPressure, heartRate, respiratoryRate,
            pao2, arterialPh, sodium, potassium, creatinine,
            hematocrit, whiteBloodCellCount, glasgowComaScale } = vitals;

    // Temperature scoring
    if (temperature < 36 || temperature > 39.9) score += 3;
    else if (temperature < 38.5) score += 1;

    // Mean arterial pressure scoring
    if (meanArterialPressure < 50 || meanArterialPressure > 130) score += 4;
    else if (meanArterialPressure < 70) score += 2;

    // Heart rate scoring
    if (heartRate < 40 || heartRate > 180) score += 4;
    else if (heartRate < 55 || heartRate > 110) score += 2;

    // Respiratory rate scoring
    if (respiratoryRate < 5 || respiratoryRate > 50) score += 4;
    else if (respiratoryRate < 12 || respiratoryRate > 25) score += 2;

    // PaO2 scoring
    if (pao2 < 55) score += 4;
    else if (pao2 < 60) score += 3;
    else if (pao2 < 70) score += 1;

    // Arterial pH scoring
    if (arterialPh < 7.15 || arterialPh > 7.7) score += 4;
    else if (arterialPh < 7.25 || arterialPh > 7.5) score += 3;
    else if (arterialPh < 7.33 || arterialPh > 7.47) score += 2;

    // Sodium scoring
    if (sodium < 110 || sodium > 170) score += 4;
    else if (sodium < 120 || sodium > 160) score += 3;
    else if (sodium < 130 || sodium > 150) score += 2;

    // Potassium scoring
    if (potassium < 2.5 || potassium > 7) score += 4;
    else if (potassium < 3 || potassium > 6.5) score += 3;
    else if (potassium < 3.5 || potassium > 5.5) score += 1;

    // Creatinine scoring
    if (creatinine > 5) score += 4;
    else if (creatinine > 3.5) score += 3;
    else if (creatinine > 2) score += 2;
    else if (creatinine > 1.5) score += 1;

    // Hematocrit scoring
    if (hematocrit < 20 || hematocrit > 60) score += 4;
    else if (hematocrit < 30 || hematocrit > 46) score += 2;

    // White blood cell count scoring
    if (whiteBloodCellCount < 1 || whiteBloodCellCount > 40) score += 4;
    else if (whiteBloodCellCount < 3 || whiteBloodCellCount > 20) score += 2;

    // Glasgow Coma Scale scoring (15 - GCS)
    const gcsPoints = 15 - glasgowComaScale;
    if (gcsPoints >= 6) score += 4;
    else if (gcsPoints >= 4) score += 3;
    else if (gcsPoints >= 2) score += 2;
    else if (gcsPoints >= 1) score += 1;

    return Math.min(score, 60); // Maximum acute physiology score is 60
  }

  // Get APACHE II Mortality Risk
  getApacheIIMortalityRisk(score) {
    if (score <= 4) return 0.04;
    else if (score <= 9) return 0.08;
    else if (score <= 14) return 0.15;
    else if (score <= 19) return 0.25;
    else if (score <= 24) return 0.40;
    else if (score <= 29) return 0.55;
    else if (score <= 34) return 0.75;
    else return 0.85;
  }

  // Get APACHE II Interpretation
  getApacheIIInterpretation(score) {
    if (score <= 4) return 'Low risk of mortality';
    else if (score <= 9) return 'Low-moderate risk of mortality';
    else if (score <= 14) return 'Moderate risk of mortality';
    else if (score <= 19) return 'Moderate-high risk of mortality';
    else if (score <= 24) return 'High risk of mortality';
    else if (score <= 29) return 'Very high risk of mortality';
    else if (score <= 34) return 'Extremely high risk of mortality';
    else return 'Critical risk of mortality';
  }

  // Get APACHE II Recommendations
  getApacheIIRecommendations(score) {
    const recommendations = [];

    if (score > 20) {
      recommendations.push('Consider intensive monitoring and support');
      recommendations.push('Discuss goals of care with family');
      recommendations.push('Prepare for potential complications');
    } else if (score > 15) {
      recommendations.push('Close monitoring required');
      recommendations.push('Consider specialist consultation');
    } else if (score > 10) {
      recommendations.push('Standard ICU care appropriate');
      recommendations.push('Monitor for clinical deterioration');
    } else {
      recommendations.push('Routine ICU care');
      recommendations.push('Consider step-down when appropriate');
    }

    return recommendations;
  }

  // Calculate Glasgow Coma Scale
  calculateGCS(patientData) {
    try {
      const { eyeOpening, verbalResponse, motorResponse } = patientData;

      if (!eyeOpening || !verbalResponse || !motorResponse) {
        throw new Error('All GCS components are required');
      }

      const totalScore = eyeOpening + verbalResponse + motorResponse;
      const interpretation = this.getGCSInterpretation(totalScore);
      const severity = this.getGCSSeverity(totalScore);

      return {
        totalScore,
        eyeOpening,
        verbalResponse,
        motorResponse,
        interpretation,
        severity,
        recommendations: this.getGCSRecommendations(totalScore),
        components: {
          eyeOpening: { score: eyeOpening, description: this.getEyeOpeningDescription(eyeOpening) },
          verbalResponse: { score: verbalResponse, description: this.getVerbalResponseDescription(verbalResponse) },
          motorResponse: { score: motorResponse, description: this.getMotorResponseDescription(motorResponse) }
        }
      };
    } catch (error) {
      logger.error('❌ Error calculating GCS:', error);
      throw error;
    }
  }

  // Get GCS Interpretation
  getGCSInterpretation(score) {
    if (score >= 13) return 'Mild brain injury';
    else if (score >= 9) return 'Moderate brain injury';
    else return 'Severe brain injury';
  }

  // Get GCS Severity
  getGCSSeverity(score) {
    if (score >= 13) return 'Mild';
    else if (score >= 9) return 'Moderate';
    else return 'Severe';
  }

  // Get GCS Recommendations
  getGCSRecommendations(score) {
    const recommendations = [];

    if (score <= 8) {
      recommendations.push('Consider intubation for airway protection');
      recommendations.push('Immediate neurosurgical consultation');
      recommendations.push('Consider CT head imaging');
      recommendations.push('Monitor intracranial pressure');
    } else if (score <= 12) {
      recommendations.push('Close neurological monitoring');
      recommendations.push('Consider CT head imaging');
      recommendations.push('Neurosurgical consultation if deteriorating');
    } else {
      recommendations.push('Regular neurological assessments');
      recommendations.push('Monitor for deterioration');
    }

    return recommendations;
  }

  // Calculate Bishop Score
  calculateBishopScore(patientData) {
    try {
      const { dilation, effacement, station, consistency, position } = patientData;

      const score = dilation + effacement + station + consistency + position;
      const interpretation = this.getBishopInterpretation(score);

      return {
        score,
        interpretation,
        components: {
          dilation: { score: dilation, description: this.getDilationDescription(dilation) },
          effacement: { score: effacement, description: this.getEffacementDescription(effacement) },
          station: { score: station, description: this.getStationDescription(station) },
          consistency: { score: consistency, description: this.getConsistencyDescription(consistency) },
          position: { score: position, description: this.getPositionDescription(position) }
        },
        recommendations: this.getBishopRecommendations(score)
      };
    } catch (error) {
      logger.error('❌ Error calculating Bishop Score:', error);
      throw error;
    }
  }

  // Get Bishop Interpretation
  getBishopInterpretation(score) {
    if (score <= 3) return 'Unfavorable for induction';
    else if (score <= 6) return 'Moderately favorable for induction';
    else return 'Favorable for induction';
  }

  // Calculate PHQ-9 Depression Screening
  calculatePHQ9(patientData) {
    try {
      const { responses } = patientData;

      if (!responses || responses.length !== 9) {
        throw new Error('PHQ-9 requires 9 responses (0-3 each)');
      }

      const totalScore = responses.reduce((sum, response) => sum + response, 0);
      const interpretation = this.getPHQ9Interpretation(totalScore);
      const severity = this.getPHQ9Severity(totalScore);

      return {
        totalScore,
        interpretation,
        severity,
        responses,
        recommendations: this.getPHQ9Recommendations(totalScore),
        followUp: this.getPHQ9FollowUp(totalScore)
      };
    } catch (error) {
      logger.error('❌ Error calculating PHQ-9:', error);
      throw error;
    }
  }

  // Get PHQ-9 Interpretation
  getPHQ9Interpretation(score) {
    if (score <= 4) return 'Minimal depression';
    else if (score <= 9) return 'Mild depression';
    else if (score <= 14) return 'Moderate depression';
    else if (score <= 19) return 'Moderately severe depression';
    else return 'Severe depression';
  }

  // Get PHQ-9 Severity
  getPHQ9Severity(score) {
    if (score <= 4) return 'Minimal';
    else if (score <= 9) return 'Mild';
    else if (score <= 14) return 'Moderate';
    else if (score <= 19) return 'Moderately Severe';
    else return 'Severe';
  }

  // Get PHQ-9 Recommendations
  getPHQ9Recommendations(score) {
    const recommendations = [];

    if (score >= 20) {
      recommendations.push('Immediate psychiatric evaluation');
      recommendations.push('Consider medication management');
      recommendations.push('Safety assessment for self-harm risk');
    } else if (score >= 15) {
      recommendations.push('Psychiatric consultation');
      recommendations.push('Consider antidepressant therapy');
      recommendations.push('Regular follow-up monitoring');
    } else if (score >= 10) {
      recommendations.push('Consider antidepressant therapy');
      recommendations.push('Psychotherapy referral');
      recommendations.push('Follow-up in 2-4 weeks');
    } else if (score >= 5) {
      recommendations.push('Watchful waiting');
      recommendations.push('Reassess in 2-4 weeks');
      recommendations.push('Consider psychotherapy');
    } else {
      recommendations.push('Routine care');
      recommendations.push('Reassess if symptoms develop');
    }

    return recommendations;
  }

  // Get Calculator Categories
  getCalculatorCategories() {
    return this.calculatorCategories;
  }

  // Get Calculation Formulas
  getCalculationFormulas() {
    return this.calculationFormulas;
  }

  // Get Reference Ranges
  getReferenceRanges() {
    return this.referenceRanges;
  }

  // Get Clinical Guidelines
  getClinicalGuidelines() {
    return this.clinicalGuidelines;
  }

  // Helper methods for GCS components
  getAgePoints(age) {
    if (age < 44) return 0;
    else if (age < 54) return 2;
    else if (age < 64) return 3;
    else if (age < 74) return 5;
    else return 6;
  }

  getEyeOpeningDescription(score) {
    const descriptions = {
      4: 'Spontaneous',
      3: 'To voice',
      2: 'To pain',
      1: 'None'
    };
    return descriptions[score] || 'Invalid score';
  }

  getVerbalResponseDescription(score) {
    const descriptions = {
      5: 'Oriented',
      4: 'Confused',
      3: 'Inappropriate words',
      2: 'Incomprehensible sounds',
      1: 'None'
    };
    return descriptions[score] || 'Invalid score';
  }

  getMotorResponseDescription(score) {
    const descriptions = {
      6: 'Obeys commands',
      5: 'Localizes pain',
      4: 'Withdraws from pain',
      3: 'Flexion to pain',
      2: 'Extension to pain',
      1: 'None'
    };
    return descriptions[score] || 'Invalid score';
  }

  // Helper methods for Bishop Score components
  getDilationDescription(score) {
    const descriptions = {
      0: 'Closed',
      1: '1-2 cm',
      2: '3-4 cm',
      3: '5+ cm'
    };
    return descriptions[score] || 'Invalid score';
  }

  getEffacementDescription(score) {
    const descriptions = {
      0: '0-30%',
      1: '40-50%',
      2: '60-70%',
      3: '80+%'
    };
    return descriptions[score] || 'Invalid score';
  }

  getStationDescription(score) {
    const descriptions = {
      0: '-3',
      1: '-2',
      2: '-1, 0',
      3: '+1, +2'
    };
    return descriptions[score] || 'Invalid score';
  }

  getConsistencyDescription(score) {
    const descriptions = {
      0: 'Firm',
      1: 'Medium',
      2: 'Soft'
    };
    return descriptions[score] || 'Invalid score';
  }

  getPositionDescription(score) {
    const descriptions = {
      0: 'Posterior',
      1: 'Mid-position',
      2: 'Anterior'
    };
    return descriptions[score] || 'Invalid score';
  }

  getBishopRecommendations(score) {
    const recommendations = [];

    if (score <= 3) {
      recommendations.push('Consider cervical ripening agents');
      recommendations.push('May need longer induction process');
      recommendations.push('Monitor for failed induction');
    } else if (score <= 6) {
      recommendations.push('Standard induction protocol');
      recommendations.push('Monitor progress closely');
    } else {
      recommendations.push('Favorable for successful induction');
      recommendations.push('Consider amniotomy');
    }

    return recommendations;
  }

  getPHQ9FollowUp(score) {
    if (score >= 15) {
      return 'Reassess in 1-2 weeks';
    } else if (score >= 10) {
      return 'Reassess in 2-4 weeks';
    } else if (score >= 5) {
      return 'Reassess in 4-8 weeks';
    } else {
      return 'Routine follow-up';
    }
  }
}

module.exports = new AdvancedMedicalCalculators(); 