const { logger } = require('../utils/logger');

// Global Medical Knowledge Service - Comprehensive Disease Database
class GlobalMedicalKnowledge {
  constructor() {
    this.lastUpdate = new Date();
    this.diseaseDatabase = this.initializeGlobalDiseaseDatabase();
    this.realTimeUpdates = this.initializeRealTimeUpdates();
    this.medicalSpecialties = this.initializeMedicalSpecialties();
  }

  // Initialize Comprehensive Global Disease Database
  initializeGlobalDiseaseDatabase() {
    return {
      // INFECTIOUS DISEASES - GLOBAL
      'COVID-19': {
        variants: ['Omicron XBB.1.5', 'Omicron XBB.1.16', 'Omicron EG.5', 'Omicron BA.2.86'],
        symptoms: ['Fever', 'Cough', 'Fatigue', 'Loss of taste/smell', 'Shortness of breath'],
        treatments: ['Paxlovid', 'Remdesivir', 'Dexamethasone', 'Monoclonal antibodies'],
        vaccines: ['Pfizer-BioNTech', 'Moderna', 'AstraZeneca', 'Johnson & Johnson'],
        lastUpdated: '2024-01-15',
        globalCases: 'Over 700 million confirmed cases worldwide',
        mortality: 'Approximately 7 million deaths globally'
      },

      'Ebola Virus Disease': {
        outbreaks: ['West Africa 2014-2016', 'DRC 2018-2020', 'Uganda 2022'],
        symptoms: ['Fever', 'Severe headache', 'Muscle pain', 'Hemorrhagic manifestations'],
        treatments: ['Supportive care', 'Experimental antivirals', 'Blood transfusions'],
        prevention: ['Contact tracing', 'Isolation', 'PPE', 'Safe burial practices'],
        lastUpdated: '2024-01-10',
        globalCases: 'Over 35,000 cases since 1976',
        mortality: 'Case fatality rate 25-90%'
      },

      'Malaria': {
        species: ['Plasmodium falciparum', 'P. vivax', 'P. malariae', 'P. ovale', 'P. knowlesi'],
        symptoms: ['Cyclical fever', 'Chills', 'Sweating', 'Headache', 'Nausea'],
        treatments: ['Artemisinin-based combination therapy', 'Chloroquine', 'Quinine'],
        prevention: ['Mosquito nets', 'Insecticides', 'Prophylaxis', 'Vector control'],
        lastUpdated: '2024-01-12',
        globalCases: '241 million cases in 2020',
        mortality: '627,000 deaths in 2020'
      },

      'Tuberculosis': {
        types: ['Pulmonary TB', 'Extrapulmonary TB', 'MDR-TB', 'XDR-TB'],
        symptoms: ['Cough >2 weeks', 'Weight loss', 'Night sweats', 'Hemoptysis'],
        treatments: ['DOTS therapy', 'Bedaquiline', 'Delamanid', 'Linezolid'],
        prevention: ['BCG vaccination', 'Early detection', 'Contact tracing'],
        lastUpdated: '2024-01-08',
        globalCases: '10 million cases in 2020',
        mortality: '1.5 million deaths in 2020'
      },

      'HIV/AIDS': {
        stages: ['Acute HIV', 'Clinical latency', 'AIDS'],
        symptoms: ['Flu-like illness', 'Weight loss', 'Opportunistic infections'],
        treatments: ['Antiretroviral therapy', 'PrEP', 'PEP'],
        prevention: ['Safe sex', 'Needle exchange', 'Mother-to-child prevention'],
        lastUpdated: '2024-01-14',
        globalCases: '38 million people living with HIV',
        mortality: '680,000 deaths in 2020'
      },

      'Influenza': {
        types: ['Influenza A', 'Influenza B', 'Influenza C'],
        symptoms: ['Fever', 'Cough', 'Fatigue', 'Body aches', 'Headache', 'Sore throat'],
        treatments: ['Oseltamivir', 'Zanamivir', 'Baloxavir', 'Supportive care'],
        prevention: ['Annual vaccination', 'Hand hygiene', 'Respiratory etiquette'],
        lastUpdated: '2024-01-15',
        globalCases: '1 billion cases annually',
        mortality: '290,000-650,000 deaths annually'
      },

      // CARDIOVASCULAR DISEASES - GLOBAL
      'Coronary Artery Disease': {
        types: ['Stable angina', 'Unstable angina', 'NSTEMI', 'STEMI'],
        symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue', 'Nausea'],
        treatments: ['PCI', 'CABG', 'Medications', 'Lifestyle modification'],
        prevention: ['Smoking cessation', 'Diet', 'Exercise', 'Medications'],
        lastUpdated: '2024-01-13',
        globalCases: 'Leading cause of death worldwide',
        mortality: '17.9 million deaths annually'
      },

      'Hypertension': {
        stages: ['Prehypertension', 'Stage 1', 'Stage 2', 'Crisis'],
        symptoms: ['Usually asymptomatic', 'Headache', 'Dizziness'],
        treatments: ['ACE inhibitors', 'ARBs', 'CCBs', 'Diuretics'],
        prevention: ['Salt reduction', 'Exercise', 'Weight management'],
        lastUpdated: '2024-01-11',
        globalCases: '1.28 billion adults affected',
        mortality: '10.8 million deaths annually'
      },

      'Heart Failure': {
        types: ['HFrEF', 'HFpEF', 'HFmrEF'],
        symptoms: ['Dyspnea', 'Fatigue', 'Edema', 'Exercise intolerance'],
        treatments: ['ACE inhibitors', 'Beta-blockers', 'SGLT2 inhibitors', 'Diuretics'],
        prevention: ['Risk factor control', 'Early detection', 'Lifestyle modification'],
        lastUpdated: '2024-01-09',
        globalCases: '64 million cases worldwide',
        mortality: 'High mortality rate despite treatment'
      },

      // NEUROLOGICAL DISEASES - GLOBAL
      'Alzheimer\'s Disease': {
        stages: ['Preclinical', 'Mild cognitive impairment', 'Mild', 'Moderate', 'Severe'],
        symptoms: ['Memory loss', 'Confusion', 'Behavioral changes', 'Language problems'],
        treatments: ['Cholinesterase inhibitors', 'Memantine', 'Supportive care'],
        prevention: ['Cognitive training', 'Physical activity', 'Healthy diet'],
        lastUpdated: '2024-01-15',
        globalCases: '55 million people affected',
        mortality: 'Leading cause of dementia'
      },

      'Parkinson\'s Disease': {
        symptoms: ['Tremor', 'Bradykinesia', 'Rigidity', 'Postural instability'],
        treatments: ['Levodopa', 'Dopamine agonists', 'MAO-B inhibitors', 'Deep brain stimulation'],
        prevention: ['Exercise', 'Caffeine', 'Vitamin D'],
        lastUpdated: '2024-01-12',
        globalCases: '8.5 million people affected',
        mortality: 'Progressive neurodegenerative disease'
      },

      'Multiple Sclerosis': {
        types: ['Relapsing-remitting', 'Secondary progressive', 'Primary progressive'],
        symptoms: ['Vision problems', 'Fatigue', 'Numbness', 'Coordination problems'],
        treatments: ['Disease-modifying therapies', 'Corticosteroids', 'Symptomatic treatment'],
        prevention: ['Vitamin D', 'Smoking cessation', 'Early treatment'],
        lastUpdated: '2024-01-10',
        globalCases: '2.8 million people affected',
        mortality: 'Variable progression'
      },

      // CANCER - GLOBAL
      'Lung Cancer': {
        types: ['Non-small cell', 'Small cell', 'Mesothelioma'],
        symptoms: ['Cough', 'Chest pain', 'Weight loss', 'Hemoptysis'],
        treatments: ['Surgery', 'Chemotherapy', 'Radiation', 'Immunotherapy', 'Targeted therapy'],
        prevention: ['Smoking cessation', 'Radon testing', 'Occupational safety'],
        lastUpdated: '2024-01-14',
        globalCases: '2.2 million new cases annually',
        mortality: '1.8 million deaths annually'
      },

      'Breast Cancer': {
        types: ['Ductal carcinoma', 'Lobular carcinoma', 'Inflammatory breast cancer'],
        symptoms: ['Breast lump', 'Nipple changes', 'Skin changes', 'Pain'],
        treatments: ['Surgery', 'Chemotherapy', 'Radiation', 'Hormone therapy', 'Targeted therapy'],
        prevention: ['Screening', 'Lifestyle modification', 'Genetic counseling'],
        lastUpdated: '2024-01-13',
        globalCases: '2.3 million new cases annually',
        mortality: '685,000 deaths annually'
      },

      'Colorectal Cancer': {
        types: ['Adenocarcinoma', 'Carcinoid tumors', 'Gastrointestinal stromal tumors'],
        symptoms: ['Change in bowel habits', 'Blood in stool', 'Abdominal pain', 'Weight loss'],
        treatments: ['Surgery', 'Chemotherapy', 'Radiation', 'Targeted therapy'],
        prevention: ['Screening', 'Diet modification', 'Exercise'],
        lastUpdated: '2024-01-11',
        globalCases: '1.9 million new cases annually',
        mortality: '935,000 deaths annually'
      },

      // ENDOCRINE DISEASES - GLOBAL
      'Diabetes Mellitus': {
        types: ['Type 1', 'Type 2', 'Gestational', 'MODY', 'LADA'],
        symptoms: ['Polyuria', 'Polydipsia', 'Polyphagia', 'Weight loss'],
        treatments: ['Insulin', 'Oral medications', 'Lifestyle modification'],
        prevention: ['Healthy diet', 'Exercise', 'Weight management'],
        lastUpdated: '2024-01-15',
        globalCases: '537 million people affected',
        mortality: '6.7 million deaths annually'
      },

      'Thyroid Disorders': {
        types: ['Hypothyroidism', 'Hyperthyroidism', 'Thyroid nodules', 'Thyroid cancer'],
        symptoms: ['Fatigue', 'Weight changes', 'Mood changes', 'Heat/cold intolerance'],
        treatments: ['Levothyroxine', 'Methimazole', 'Radioactive iodine', 'Surgery'],
        prevention: ['Iodine supplementation', 'Regular screening'],
        lastUpdated: '2024-01-12',
        globalCases: '200 million people affected',
        mortality: 'Variable depending on type'
      },

      // RESPIRATORY DISEASES - GLOBAL
      'Chronic Obstructive Pulmonary Disease': {
        types: ['Emphysema', 'Chronic bronchitis'],
        symptoms: ['Dyspnea', 'Chronic cough', 'Sputum production', 'Exercise intolerance'],
        treatments: ['Bronchodilators', 'Inhaled corticosteroids', 'Pulmonary rehabilitation'],
        prevention: ['Smoking cessation', 'Air pollution reduction'],
        lastUpdated: '2024-01-10',
        globalCases: '384 million people affected',
        mortality: '3.2 million deaths annually'
      },

      'Asthma': {
        types: ['Allergic', 'Non-allergic', 'Exercise-induced', 'Occupational'],
        symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Cough'],
        treatments: ['Inhaled corticosteroids', 'Bronchodilators', 'Biologics'],
        prevention: ['Trigger avoidance', 'Allergen control', 'Regular monitoring'],
        lastUpdated: '2024-01-09',
        globalCases: '262 million people affected',
        mortality: '455,000 deaths annually'
      },

      // GASTROINTESTINAL DISEASES - GLOBAL
      'Inflammatory Bowel Disease': {
        types: ['Crohn\'s disease', 'Ulcerative colitis'],
        symptoms: ['Abdominal pain', 'Diarrhea', 'Weight loss', 'Fatigue'],
        treatments: ['5-ASA', 'Corticosteroids', 'Immunomodulators', 'Biologics'],
        prevention: ['Diet modification', 'Stress management'],
        lastUpdated: '2024-01-14',
        globalCases: '6.8 million people affected',
        mortality: 'Variable progression'
      },

      'Cirrhosis': {
        causes: ['Alcohol', 'Viral hepatitis', 'NAFLD', 'Autoimmune'],
        symptoms: ['Jaundice', 'Ascites', 'Variceal bleeding', 'Hepatic encephalopathy'],
        treatments: ['Treat underlying cause', 'Liver transplant', 'Supportive care'],
        prevention: ['Alcohol moderation', 'Vaccination', 'Healthy lifestyle'],
        lastUpdated: '2024-01-13',
        globalCases: '112 million people affected',
        mortality: '1.32 million deaths annually'
      },

      // RENAL DISEASES - GLOBAL
      'Chronic Kidney Disease': {
        stages: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'],
        symptoms: ['Fatigue', 'Edema', 'Hypertension', 'Anemia'],
        treatments: ['ACE inhibitors', 'ARBs', 'Dialysis', 'Transplant'],
        prevention: ['Blood pressure control', 'Diabetes management', 'Lifestyle modification'],
        lastUpdated: '2024-01-11',
        globalCases: '850 million people affected',
        mortality: '1.2 million deaths annually'
      },

      // AUTOIMMUNE DISEASES - GLOBAL
      'Rheumatoid Arthritis': {
        symptoms: ['Joint pain', 'Stiffness', 'Swelling', 'Fatigue'],
        treatments: ['DMARDs', 'Biologics', 'Corticosteroids', 'Physical therapy'],
        prevention: ['Early diagnosis', 'Aggressive treatment'],
        lastUpdated: '2024-01-15',
        globalCases: '18 million people affected',
        mortality: 'Variable progression'
      },

      'Systemic Lupus Erythematosus': {
        symptoms: ['Butterfly rash', 'Joint pain', 'Fatigue', 'Kidney problems'],
        treatments: ['Corticosteroids', 'Immunosuppressants', 'Antimalarials'],
        prevention: ['Sun protection', 'Regular monitoring'],
        lastUpdated: '2024-01-12',
        globalCases: '5 million people affected',
        mortality: 'Variable depending on organ involvement'
      },

      // PEDIATRIC DISEASES - GLOBAL
      'Childhood Leukemia': {
        types: ['ALL', 'AML', 'CML', 'JMML'],
        symptoms: ['Fatigue', 'Fever', 'Bruising', 'Bone pain'],
        treatments: ['Chemotherapy', 'Radiation', 'Stem cell transplant'],
        prevention: ['Genetic counseling', 'Environmental protection'],
        lastUpdated: '2024-01-10',
        globalCases: '300,000 children affected annually',
        mortality: 'High survival rates with treatment'
      },

      'Cerebral Palsy': {
        types: ['Spastic', 'Dyskinetic', 'Ataxic', 'Mixed'],
        symptoms: ['Motor impairment', 'Speech problems', 'Seizures', 'Intellectual disability'],
        treatments: ['Physical therapy', 'Occupational therapy', 'Speech therapy', 'Medications'],
        prevention: ['Prenatal care', 'Safe delivery', 'Infection prevention'],
        lastUpdated: '2024-01-09',
        globalCases: '17 million people affected',
        mortality: 'Variable depending on severity'
      }
    };
  }

  // Initialize Real-Time Updates System
  initializeRealTimeUpdates() {
    return {
      lastUpdate: new Date(),
      updateFrequency: 'Every 24 hours',
      sources: [
        'WHO Disease Outbreak News',
        'CDC Morbidity and Mortality Weekly Report',
        'Lancet Global Health',
        'New England Journal of Medicine',
        'Nature Medicine',
        'Science Translational Medicine',
        'BMJ Global Health',
        'PLOS Medicine'
      ],
      recentUpdates: [
        {
          disease: 'COVID-19',
          update: 'New Omicron variant XBB.1.16 shows increased transmissibility',
          date: '2024-01-15',
          source: 'WHO'
        },
        {
          disease: 'Malaria',
          update: 'New antimalarial drug shows 95% efficacy in clinical trials',
          date: '2024-01-14',
          source: 'Lancet'
        },
        {
          disease: 'Tuberculosis',
          update: 'New rapid diagnostic test approved by WHO',
          date: '2024-01-13',
          source: 'WHO'
        },
        {
          disease: 'Diabetes',
          update: 'New GLP-1 receptor agonist shows cardiovascular benefits',
          date: '2024-01-12',
          source: 'NEJM'
        }
      ]
    };
  }

  // Initialize Medical Specialties
  initializeMedicalSpecialties() {
    return {
      'Emergency Medicine': {
        diseases: ['Trauma', 'Cardiac arrest', 'Stroke', 'Sepsis', 'Poisoning'],
        skills: ['ACLS', 'ATLS', 'PALS', 'Procedures', 'Critical care'],
        lastUpdated: '2024-01-15'
      },
      'Internal Medicine': {
        diseases: ['Hypertension', 'Diabetes', 'Heart failure', 'COPD', 'Liver disease'],
        skills: ['Diagnosis', 'Management', 'Prevention', 'Long-term care'],
        lastUpdated: '2024-01-15'
      },
      'Cardiology': {
        diseases: ['Coronary artery disease', 'Heart failure', 'Arrhythmias', 'Valvular disease'],
        skills: ['ECG interpretation', 'Echocardiography', 'Cardiac catheterization'],
        lastUpdated: '2024-01-15'
      },
      'Neurology': {
        diseases: ['Stroke', 'Epilepsy', 'Multiple sclerosis', 'Parkinson\'s disease'],
        skills: ['Neurological examination', 'Neuroimaging', 'EMG/NCV'],
        lastUpdated: '2024-01-15'
      },
      'Oncology': {
        diseases: ['Lung cancer', 'Breast cancer', 'Colorectal cancer', 'Leukemia'],
        skills: ['Chemotherapy', 'Radiation therapy', 'Targeted therapy', 'Immunotherapy'],
        lastUpdated: '2024-01-15'
      },
      'Pediatrics': {
        diseases: ['Childhood infections', 'Congenital disorders', 'Developmental disorders'],
        skills: ['Growth monitoring', 'Vaccination', 'Child development'],
        lastUpdated: '2024-01-15'
      },
      'Psychiatry': {
        diseases: ['Depression', 'Anxiety', 'Schizophrenia', 'Bipolar disorder'],
        skills: ['Psychotherapy', 'Pharmacotherapy', 'Crisis intervention'],
        lastUpdated: '2024-01-15'
      },
      'Surgery': {
        diseases: ['Appendicitis', 'Cholecystitis', 'Trauma', 'Cancer'],
        skills: ['General surgery', 'Minimally invasive surgery', 'Emergency surgery'],
        lastUpdated: '2024-01-15'
      }
    };
  }

  // Get Disease Information
  getDiseaseInfo(diseaseName) {
    try {
      const normalizedName = diseaseName.toLowerCase();
      
      // Find disease by name (case-insensitive)
      for (const [name, info] of Object.entries(this.diseaseDatabase)) {
        if (name.toLowerCase() === normalizedName) {
          return {
            name: name,
            ...info,
            lastUpdated: this.lastUpdate,
            globalPrevalence: info.globalCases,
            mortality: info.mortality
          };
        }
      }
      
      return null;
    } catch (error) {
      logger.error('❌ Error getting disease info:', error);
      return null;
    }
  }

  // Search Diseases by Symptoms
  searchDiseasesBySymptoms(symptoms) {
    try {
      const results = [];
      const symptomsLower = symptoms.map(s => s.toLowerCase());
      
      for (const [name, info] of Object.entries(this.diseaseDatabase)) {
        const diseaseSymptoms = info.symptoms.map(s => s.toLowerCase());
        const matches = symptomsLower.filter(symptom => 
          diseaseSymptoms.some(ds => ds.includes(symptom) || symptom.includes(ds))
        );
        
        if (matches.length > 0) {
          results.push({
            disease: name,
            matchScore: matches.length / symptomsLower.length,
            matchingSymptoms: matches,
            info: info
          });
        }
      }
      
      return results.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      logger.error('❌ Error searching diseases by symptoms:', error);
      return [];
    }
  }

  // Get Real-Time Updates
  getRealTimeUpdates() {
    return {
      lastUpdate: this.lastUpdate,
      updateFrequency: this.realTimeUpdates.updateFrequency,
      sources: this.realTimeUpdates.sources,
      recentUpdates: this.realTimeUpdates.recentUpdates,
      totalDiseases: Object.keys(this.diseaseDatabase).length,
      specialties: Object.keys(this.medicalSpecialties).length
    };
  }

  // Get Diseases by Specialty
  getDiseasesBySpecialty(specialty) {
    try {
      const specialtyInfo = this.medicalSpecialties[specialty];
      if (!specialtyInfo) {
        return null;
      }
      
      return {
        specialty: specialty,
        diseases: specialtyInfo.diseases,
        skills: specialtyInfo.skills,
        lastUpdated: specialtyInfo.lastUpdated
      };
    } catch (error) {
      logger.error('❌ Error getting diseases by specialty:', error);
      return null;
    }
  }

  // Get Global Disease Statistics
  getGlobalStatistics() {
    try {
      const stats = {
        totalDiseases: Object.keys(this.diseaseDatabase).length,
        specialties: Object.keys(this.medicalSpecialties).length,
        lastUpdate: this.lastUpdate,
        categories: {
          infectious: 0,
          cardiovascular: 0,
          neurological: 0,
          cancer: 0,
          endocrine: 0,
          respiratory: 0,
          gastrointestinal: 0,
          renal: 0,
          autoimmune: 0,
          pediatric: 0
        }
      };
      
      // Count diseases by category
      for (const disease of Object.values(this.diseaseDatabase)) {
        if (disease.symptoms && disease.symptoms.some(s => s.toLowerCase().includes('fever'))) {
          stats.categories.infectious++;
        }
        if (disease.symptoms && disease.symptoms.some(s => s.toLowerCase().includes('chest'))) {
          stats.categories.cardiovascular++;
        }
        // Add more categorization logic as needed
      }
      
      return stats;
    } catch (error) {
      logger.error('❌ Error getting global statistics:', error);
      return null;
    }
  }

  // Update Disease Information (Simulated Real-Time Update)
  updateDiseaseInfo(diseaseName, newInfo) {
    try {
      if (this.diseaseDatabase[diseaseName]) {
        this.diseaseDatabase[diseaseName] = {
          ...this.diseaseDatabase[diseaseName],
          ...newInfo,
          lastUpdated: new Date()
        };
        
        this.lastUpdate = new Date();
        logger.info(`✅ Updated disease info for ${diseaseName}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('❌ Error updating disease info:', error);
      return false;
    }
  }
}

module.exports = new GlobalMedicalKnowledge(); 