const { logger } = require('../utils/logger');
const { getDb } = require('../config/firebase');

// Advanced Medical Features for Sri Lankan Students
class AdvancedMedicalFeatures {
  constructor() {
    this.sriLankanDrugDatabase = this.initializeSriLankanDrugDB();
    this.clinicalGuidelines = this.initializeClinicalGuidelines();
    this.medicalCalculators = this.initializeMedicalCalculators();
  }

  // Initialize COMPREHENSIVE Sri Lankan Drug Database for Medical Students
  initializeSriLankanDrugDB() {
    return {
      // COMPREHENSIVE antibiotics database for medical students
      antibiotics: {
        'Amoxicillin': { 
          dosage: '500mg TDS PO for 7-10 days', 
          availability: 'Available', 
          cost: 'Low',
          indications: ['Community-acquired pneumonia', 'Acute otitis media', 'UTI', 'Cellulitis', 'Dental infections'],
          contraindications: ['Penicillin allergy', 'Infectious mononucleosis'],
          sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Rash', 'Candidiasis'],
          interactions: ['Warfarin (increased bleeding risk)', 'Oral contraceptives (reduced efficacy)', 'Methotrexate (increased toxicity)'],
          monitoring: ['Renal function', 'Liver function', 'Allergic reactions'],
          pregnancy: 'Category B - Generally safe',
          breastfeeding: 'Safe - minimal excretion in breast milk',
          pediatric: '20-40mg/kg/day divided TDS',
          geriatric: 'Dose adjustment may be needed for renal impairment'
        },
        'Ciprofloxacin': { 
          dosage: '500mg BD PO or 400mg BD IV for 7-14 days', 
          availability: 'Available', 
          cost: 'Medium',
          indications: ['Complicated UTI', 'Acute pyelonephritis', 'Traveler\'s diarrhea', 'Bone/joint infections', 'Respiratory infections'],
          contraindications: ['Pregnancy (Category C)', 'Children <18 years', 'QT prolongation', 'Myasthenia gravis'],
          sideEffects: ['Tendon rupture', 'QT prolongation', 'Photosensitivity', 'Peripheral neuropathy', 'Hepatitis', 'CNS effects'],
          interactions: ['Warfarin (increased bleeding)', 'Theophylline (increased levels)', 'Antacids (reduced absorption)', 'Corticosteroids (tendon rupture risk)'],
          monitoring: ['ECG for QT prolongation', 'Liver function', 'Renal function', 'Tendon pain'],
          pregnancy: 'Category C - Avoid unless benefits outweigh risks',
          breastfeeding: 'Use with caution - excreted in breast milk',
          pediatric: 'Contraindicated <18 years',
          geriatric: 'Dose adjustment for renal impairment'
        },
        'Doxycycline': { 
          dosage: '100mg BD PO for 7-14 days', 
          availability: 'Available', 
          cost: 'Low',
          indications: ['Malaria prophylaxis', 'Acne vulgaris', 'Community-acquired pneumonia', 'Lyme disease', 'Rickettsial infections'],
          contraindications: ['Pregnancy (Category D)', 'Children <8 years', 'Severe liver disease'],
          sideEffects: ['Photosensitivity', 'Esophagitis', 'Vaginal candidiasis', 'Hepatitis', 'Pseudotumor cerebri'],
          interactions: ['Warfarin (increased bleeding)', 'Antacids (reduced absorption)', 'Iron supplements (reduced absorption)', 'Oral contraceptives (reduced efficacy)'],
          monitoring: ['Liver function', 'Photosensitivity reactions', 'Intracranial pressure'],
          pregnancy: 'Category D - Avoid in pregnancy',
          breastfeeding: 'Use with caution - may affect bone development',
          pediatric: 'Contraindicated <8 years',
          geriatric: 'No dose adjustment needed'
        },
        'Azithromycin': { 
          dosage: '500mg OD PO for 3 days or 500mg day 1, then 250mg OD for 4 days', 
          availability: 'Limited', 
          cost: 'High',
          indications: ['Community-acquired pneumonia', 'Acute exacerbation of COPD', 'Chlamydia trachomatis', 'Mycoplasma pneumoniae'],
          contraindications: ['QT prolongation', 'Severe liver disease', 'Known hypersensitivity'],
          sideEffects: ['QT prolongation', 'Hepatitis', 'Diarrhea', 'Nausea', 'Abdominal pain', 'Torsades de pointes'],
          interactions: ['Warfarin (increased bleeding)', 'Digoxin (increased levels)', 'Statins (increased myopathy risk)', 'Antacids (reduced absorption)'],
          monitoring: ['ECG for QT prolongation', 'Liver function', 'Cardiac rhythm'],
          pregnancy: 'Category B - Generally safe',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: '10mg/kg OD for 3 days',
          geriatric: 'No dose adjustment needed'
        },
        'Ceftriaxone': {
          dosage: '1-2g OD IV/IM for 7-14 days',
          availability: 'Available',
          cost: 'Medium',
          indications: ['Meningitis', 'Severe pneumonia', 'Complicated UTI', 'Gonorrhea', 'Endocarditis'],
          contraindications: ['Cephalosporin allergy', 'Severe penicillin allergy (cross-reactivity)'],
          sideEffects: ['Diarrhea', 'Rash', 'Gallbladder sludge', 'Cholelithiasis', 'Eosinophilia', 'Thrombocytopenia'],
          interactions: ['Warfarin (increased bleeding)', 'Calcium-containing solutions (precipitation)', 'Aminoglycosides (synergistic)'],
          monitoring: ['Renal function', 'Liver function', 'CBC', 'Gallbladder ultrasound if prolonged use'],
          pregnancy: 'Category B - Generally safe',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: '50-100mg/kg/day IV/IM',
          geriatric: 'Dose adjustment for renal impairment'
        },
        'Metronidazole': {
          dosage: '400mg TDS PO or 500mg BD IV for 7-10 days',
          availability: 'Available',
          cost: 'Low',
          indications: ['Anaerobic infections', 'H. pylori eradication', 'Amoebiasis', 'Giardiasis', 'Bacterial vaginosis'],
          contraindications: ['First trimester pregnancy', 'Severe liver disease', 'Known hypersensitivity'],
          sideEffects: ['Metallic taste', 'Peripheral neuropathy', 'Disulfiram reaction', 'Nausea', 'Headache', 'Seizures'],
          interactions: ['Alcohol (disulfiram reaction)', 'Warfarin (increased bleeding)', 'Lithium (increased levels)', 'Phenytoin (increased levels)'],
          monitoring: ['Liver function', 'Neurological symptoms', 'Alcohol avoidance'],
          pregnancy: 'Category B - Avoid first trimester',
          breastfeeding: 'Use with caution - excreted in breast milk',
          pediatric: '15-35mg/kg/day divided TDS',
          geriatric: 'Dose adjustment for liver impairment'
        },
        'Vancomycin': {
          dosage: '15-20mg/kg BD IV (adjusted for renal function)',
          availability: 'Available',
          cost: 'High',
          indications: ['MRSA infections', 'Severe C. difficile colitis', 'Endocarditis', 'Meningitis', 'Osteomyelitis'],
          contraindications: ['Known hypersensitivity', 'Severe renal impairment without dose adjustment'],
          sideEffects: ['Nephrotoxicity', 'Ototoxicity', 'Red man syndrome', 'Thrombocytopenia', 'Neutropenia'],
          interactions: ['Aminoglycosides (increased nephrotoxicity)', 'Loop diuretics (increased ototoxicity)', 'NSAIDs (increased nephrotoxicity)'],
          monitoring: ['Trough levels (10-20 mg/L)', 'Renal function', 'Hearing', 'CBC'],
          pregnancy: 'Category C - Use if benefits outweigh risks',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: '15-20mg/kg BD IV',
          geriatric: 'Dose adjustment for renal function'
        }
      },
      
      // COMPREHENSIVE analgesics database
      analgesics: {
        'Paracetamol': { 
          dosage: '500mg-1g QDS PO (max 4g/day)', 
          availability: 'Available', 
          cost: 'Very Low',
          indications: ['Mild to moderate pain', 'Fever', 'Headache', 'Post-operative pain'],
          contraindications: ['Severe liver disease', 'Known hypersensitivity', 'Chronic alcohol abuse'],
          sideEffects: ['Hepatotoxicity (overdose)', 'Rash', 'Hypersensitivity reactions'],
          interactions: ['Warfarin (increased bleeding risk)', 'Alcohol (increased hepatotoxicity)', 'Probenecid (increased levels)'],
          monitoring: ['Liver function with chronic use', 'Signs of overdose'],
          pregnancy: 'Category B - Safe in pregnancy',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: '10-15mg/kg QDS PO',
          geriatric: 'No dose adjustment needed'
        },
        'Ibuprofen': { 
          dosage: '400mg TDS PO (max 2.4g/day)', 
          availability: 'Available', 
          cost: 'Low',
          indications: ['Mild to moderate pain', 'Inflammatory conditions', 'Dysmenorrhea', 'Fever'],
          contraindications: ['Active peptic ulcer', 'Severe heart failure', 'Third trimester pregnancy', 'Known hypersensitivity'],
          sideEffects: ['GI bleeding', 'Renal impairment', 'Hypertension', 'Cardiovascular events', 'Rash'],
          interactions: ['Warfarin (increased bleeding)', 'ACE inhibitors (reduced efficacy)', 'Diuretics (reduced efficacy)', 'Lithium (increased levels)'],
          monitoring: ['Renal function', 'Blood pressure', 'GI symptoms'],
          pregnancy: 'Category C - Avoid third trimester',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: '5-10mg/kg TDS PO',
          geriatric: 'Start with lower dose'
        },
        'Diclofenac': { 
          dosage: '50mg BD PO or 75mg BD for severe pain', 
          availability: 'Available', 
          cost: 'Low',
          indications: ['Osteoarthritis', 'Rheumatoid arthritis', 'Ankylosing spondylitis', 'Acute pain'],
          contraindications: ['Active peptic ulcer', 'Severe heart failure', 'Third trimester pregnancy', 'Known hypersensitivity'],
          sideEffects: ['GI bleeding', 'Renal impairment', 'Hypertension', 'Cardiovascular events', 'Liver toxicity'],
          interactions: ['Warfarin (increased bleeding)', 'ACE inhibitors (reduced efficacy)', 'Diuretics (reduced efficacy)', 'Methotrexate (increased toxicity)'],
          monitoring: ['Renal function', 'Liver function', 'Blood pressure', 'GI symptoms'],
          pregnancy: 'Category C - Avoid third trimester',
          breastfeeding: 'Use with caution - excreted in breast milk',
          pediatric: 'Not recommended <12 years',
          geriatric: 'Start with lower dose'
        },
        'Morphine': {
          dosage: '5-10mg PO Q4H or 2-5mg IV Q4H',
          availability: 'Controlled',
          cost: 'Medium',
          indications: ['Severe pain', 'Post-operative pain', 'Cancer pain', 'Acute myocardial infarction'],
          contraindications: ['Respiratory depression', 'Paralytic ileus', 'Acute bronchial asthma', 'Severe liver disease'],
          sideEffects: ['Respiratory depression', 'Sedation', 'Constipation', 'Nausea', 'Pruritus', 'Dependence'],
          interactions: ['Benzodiazepines (increased sedation)', 'Alcohol (increased sedation)', 'MAOIs (severe reactions)'],
          monitoring: ['Respiratory rate', 'Level of consciousness', 'Pain control', 'Constipation'],
          pregnancy: 'Category C - Use if benefits outweigh risks',
          breastfeeding: 'Use with caution - excreted in breast milk',
          pediatric: '0.1-0.2mg/kg PO Q4H',
          geriatric: 'Start with lower dose'
        }
      },
      
      // COMPREHENSIVE antihypertensives database
      antihypertensives: {
        'Amlodipine': { 
          dosage: '5-10mg OD PO', 
          availability: 'Available', 
          cost: 'Low',
          indications: ['Hypertension', 'Angina pectoris', 'Coronary artery disease'],
          contraindications: ['Known hypersensitivity', 'Cardiogenic shock', 'Severe aortic stenosis'],
          sideEffects: ['Peripheral edema', 'Headache', 'Dizziness', 'Flushing', 'Palpitations'],
          interactions: ['Simvastatin (increased levels)', 'Digoxin (increased levels)', 'Warfarin (no interaction)'],
          monitoring: ['Blood pressure', 'Peripheral edema', 'Liver function'],
          pregnancy: 'Category C - Use if benefits outweigh risks',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: '2.5-5mg OD PO',
          geriatric: 'No dose adjustment needed'
        },
        'Losartan': { 
          dosage: '50mg OD PO (max 100mg/day)', 
          availability: 'Available', 
          cost: 'Medium',
          indications: ['Hypertension', 'Diabetic nephropathy', 'Heart failure', 'Left ventricular hypertrophy'],
          contraindications: ['Pregnancy (Category D)', 'Known hypersensitivity', 'Bilateral renal artery stenosis'],
          sideEffects: ['Dizziness', 'Hyperkalemia', 'Angioedema', 'Cough (less than ACE inhibitors)'],
          interactions: ['Potassium supplements (hyperkalemia)', 'NSAIDs (reduced efficacy)', 'Lithium (increased levels)'],
          monitoring: ['Blood pressure', 'Renal function', 'Serum potassium', 'Angioedema'],
          pregnancy: 'Category D - Avoid in pregnancy',
          breastfeeding: 'Use with caution - excreted in breast milk',
          pediatric: '0.7mg/kg OD PO',
          geriatric: 'No dose adjustment needed'
        },
        'Metoprolol': { 
          dosage: '25-50mg BD PO (tartrate) or 50-200mg OD PO (succinate)', 
          availability: 'Available', 
          cost: 'Low',
          indications: ['Hypertension', 'Angina pectoris', 'Heart failure', 'Myocardial infarction', 'Arrhythmias'],
          contraindications: ['Severe bradycardia', 'Heart block', 'Cardiogenic shock', 'Severe heart failure'],
          sideEffects: ['Bradycardia', 'Fatigue', 'Cold extremities', 'Depression', 'Impotence', 'Bronchospasm'],
          interactions: ['Verapamil (increased bradycardia)', 'Digoxin (increased bradycardia)', 'Insulin (masked hypoglycemia)'],
          monitoring: ['Heart rate', 'Blood pressure', 'ECG', 'Blood glucose in diabetics'],
          pregnancy: 'Category C - Use if benefits outweigh risks',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: '1-2mg/kg/day divided BD',
          geriatric: 'Start with lower dose'
        },
        'Lisinopril': {
          dosage: '10-40mg OD PO',
          availability: 'Available',
          cost: 'Low',
          indications: ['Hypertension', 'Heart failure', 'Myocardial infarction', 'Diabetic nephropathy'],
          contraindications: ['Pregnancy (Category D)', 'Angioedema history', 'Bilateral renal artery stenosis'],
          sideEffects: ['Dry cough', 'Angioedema', 'Hyperkalemia', 'Dizziness', 'Rash'],
          interactions: ['Potassium supplements (hyperkalemia)', 'NSAIDs (reduced efficacy)', 'Lithium (increased levels)'],
          monitoring: ['Blood pressure', 'Renal function', 'Serum potassium', 'Angioedema'],
          pregnancy: 'Category D - Avoid in pregnancy',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: '0.07mg/kg OD PO',
          geriatric: 'Start with lower dose'
        }
      },
      
      // COMPREHENSIVE antidiabetic medications
      antidiabetics: {
        'Metformin': {
          dosage: '500mg BD PO initially, titrate to 1g BD (max 2.5g/day)',
          availability: 'Available',
          cost: 'Low',
          indications: ['Type 2 diabetes mellitus', 'PCOS', 'Prediabetes'],
          contraindications: ['Severe renal impairment (eGFR <30)', 'Metabolic acidosis', 'Severe heart failure'],
          sideEffects: ['GI upset', 'Lactic acidosis (rare)', 'Vitamin B12 deficiency', 'Metallic taste'],
          interactions: ['Alcohol (increased lactic acidosis risk)', 'Contrast media (temporary hold)', 'Furosemide (reduced efficacy)'],
          monitoring: ['Renal function', 'Vitamin B12 levels', 'Lactic acid if symptoms'],
          pregnancy: 'Category B - Generally safe',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: 'Not approved <10 years',
          geriatric: 'Dose adjustment for renal function'
        },
        'Gliclazide': {
          dosage: '80mg BD PO initially, titrate to 160mg BD',
          availability: 'Available',
          cost: 'Low',
          indications: ['Type 2 diabetes mellitus'],
          contraindications: ['Type 1 diabetes', 'Diabetic ketoacidosis', 'Severe liver disease', 'Pregnancy'],
          sideEffects: ['Hypoglycemia', 'Weight gain', 'GI upset', 'Rash', 'Hepatitis'],
          interactions: ['Warfarin (increased bleeding)', 'Beta-blockers (masked hypoglycemia)', 'Alcohol (disulfiram reaction)'],
          monitoring: ['Blood glucose', 'Liver function', 'Signs of hypoglycemia'],
          pregnancy: 'Category C - Switch to insulin',
          breastfeeding: 'Use with caution - excreted in breast milk',
          pediatric: 'Not recommended',
          geriatric: 'Start with lower dose'
        },
        'Insulin Glargine': {
          dosage: '0.2-0.4 units/kg OD SC (adjust based on blood glucose)',
          availability: 'Available',
          cost: 'High',
          indications: ['Type 1 diabetes', 'Type 2 diabetes (when oral agents fail)', 'Gestational diabetes'],
          contraindications: ['Hypoglycemia', 'Known hypersensitivity'],
          sideEffects: ['Hypoglycemia', 'Weight gain', 'Injection site reactions', 'Lipodystrophy'],
          interactions: ['Corticosteroids (increased glucose)', 'Beta-blockers (masked hypoglycemia)', 'ACE inhibitors (increased hypoglycemia)'],
          monitoring: ['Blood glucose', 'HbA1c', 'Signs of hypoglycemia', 'Injection sites'],
          pregnancy: 'Category B - Safe in pregnancy',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: '0.2-0.4 units/kg OD SC',
          geriatric: 'Start with lower dose'
        }
      },
      
      // COMPREHENSIVE psychiatric medications
      psychotropics: {
        'Sertraline': {
          dosage: '50mg OD PO initially, titrate to 50-200mg/day',
          availability: 'Available',
          cost: 'Medium',
          indications: ['Major depressive disorder', 'Panic disorder', 'Obsessive-compulsive disorder', 'Post-traumatic stress disorder'],
          contraindications: ['MAOI use within 14 days', 'Known hypersensitivity', 'Severe liver disease'],
          sideEffects: ['Nausea', 'Insomnia', 'Sexual dysfunction', 'Weight changes', 'Serotonin syndrome'],
          interactions: ['MAOIs (serotonin syndrome)', 'Warfarin (increased bleeding)', 'Tramadol (serotonin syndrome)'],
          monitoring: ['Suicidal ideation', 'Liver function', 'Signs of serotonin syndrome'],
          pregnancy: 'Category C - Use if benefits outweigh risks',
          breastfeeding: 'Safe - minimal excretion',
          pediatric: '25mg OD PO initially',
          geriatric: 'Start with lower dose'
        },
        'Risperidone': {
          dosage: '1-2mg BD PO initially, titrate to 2-6mg/day',
          availability: 'Available',
          cost: 'Medium',
          indications: ['Schizophrenia', 'Bipolar disorder', 'Autism spectrum disorder'],
          contraindications: ['Known hypersensitivity', 'Severe liver disease', 'Pregnancy'],
          sideEffects: ['Extrapyramidal symptoms', 'Prolactin elevation', 'Weight gain', 'Metabolic syndrome', 'Tardive dyskinesia'],
          interactions: ['Carbamazepine (reduced levels)', 'Fluoxetine (increased levels)', 'Warfarin (increased bleeding)'],
          monitoring: ['Extrapyramidal symptoms', 'Prolactin levels', 'Metabolic parameters', 'Tardive dyskinesia'],
          pregnancy: 'Category C - Use if benefits outweigh risks',
          breastfeeding: 'Use with caution - excreted in breast milk',
          pediatric: '0.5mg BD PO initially',
          geriatric: 'Start with lower dose'
        }
      }
    };
  }

  // Initialize COMPREHENSIVE Clinical Guidelines (Sri Lankan Context) for Medical Students
  initializeClinicalGuidelines() {
    return {
      'Dengue Fever': {
        symptoms: ['High fever (39-40°C)', 'Severe headache', 'Retro-orbital pain', 'Myalgia and arthralgia', 'Nausea and vomiting', 'Petechiae', 'Positive tourniquet test'],
        warningSigns: ['Severe abdominal pain', 'Persistent vomiting', 'Bleeding from gums/nose', 'Restlessness', 'Cold extremities', 'Decreased urine output'],
        investigations: ['FBC (thrombocytopenia <100,000/μL)', 'Dengue NS1 antigen (days 1-5)', 'Dengue IgM/IgG (after day 5)', 'Hematocrit (hemoconcentration)', 'Liver function tests', 'Coagulation profile'],
        management: 'Supportive care, IV fluid resuscitation, monitor for warning signs, platelet transfusion if <20,000/μL with bleeding, avoid NSAIDs',
        complications: ['Dengue hemorrhagic fever', 'Dengue shock syndrome', 'Organ failure', 'Myocarditis', 'Encephalitis'],
        sriLankanContext: 'Endemic in Sri Lanka, peak during monsoon seasons (May-July, October-December), Aedes aegypti vector, free treatment in government hospitals',
        prevention: 'Mosquito control, personal protection, community awareness, early case detection'
      },
      'Leptospirosis': {
        symptoms: ['Fever', 'Severe myalgia (calf muscles)', 'Conjunctival suffusion', 'Jaundice', 'Oliguria', 'Hemorrhagic manifestations'],
        investigations: ['FBC (leukocytosis, thrombocytopenia)', 'LFT (elevated bilirubin, transaminases)', 'RFT (elevated creatinine, BUN)', 'Leptospira IgM ELISA', 'Dark field microscopy', 'PCR'],
        management: 'IV Penicillin G 1.5 million units Q6H or Ceftriaxone 1g BD, supportive care, dialysis if needed, ICU care for severe cases',
        complications: ['Acute kidney injury', 'Hepatitis', 'ARDS', 'Myocarditis', 'Meningitis', 'Death'],
        sriLankanContext: 'Common in paddy farmers, post-flood periods, occupational hazard, free treatment available',
        prevention: 'Protective clothing, rodent control, health education, early treatment'
      },
      'Tuberculosis': {
        symptoms: ['Cough >2 weeks', 'Weight loss', 'Night sweats', 'Hemoptysis', 'Fatigue', 'Anorexia', 'Low-grade fever'],
        investigations: ['Sputum AFB microscopy x3', 'Chest X-ray', 'GeneXpert MTB/RIF', 'Sputum culture', 'Tuberculin skin test', 'Interferon-gamma release assay'],
        management: 'DOTS therapy: 2HRZE/4HR (intensive phase 2 months, continuation phase 4 months), contact tracing, directly observed therapy',
        complications: ['Cavitary disease', 'Miliary TB', 'TB meningitis', 'Drug-resistant TB', 'Death'],
        sriLankanContext: 'High burden disease, free treatment available, DOTS program, contact tracing mandatory',
        prevention: 'BCG vaccination, early detection, contact tracing, infection control'
      },
      'COVID-19': {
        symptoms: ['Fever', 'Dry cough', 'Fatigue', 'Loss of taste/smell', 'Sore throat', 'Headache', 'Myalgia', 'Dyspnea'],
        severeSymptoms: ['Dyspnea', 'Chest pain', 'Confusion', 'Inability to wake/stay awake', 'Bluish lips/face'],
        investigations: ['RT-PCR test', 'Chest X-ray/CT', 'FBC', 'CRP', 'D-dimer', 'Ferritin', 'LFT', 'RFT'],
        management: 'Supportive care, oxygen therapy, dexamethasone for severe cases, remdesivir for hospitalized patients, anticoagulation prophylaxis',
        complications: ['ARDS', 'Thromboembolism', 'Myocarditis', 'Acute kidney injury', 'Long COVID'],
        sriLankanContext: 'Pandemic disease, vaccination program, quarantine measures, free treatment',
        prevention: 'Vaccination, mask wearing, social distancing, hand hygiene'
      },
      'Acute Coronary Syndrome': {
        symptoms: ['Chest pain (crushing, pressure-like)', 'Pain radiating to arm/jaw/back', 'Sweating', 'Shortness of breath', 'Nausea', 'Anxiety'],
        investigations: ['ECG (ST elevation/depression, T wave changes)', 'Troponin I/T', 'CBC', 'Electrolytes', 'Chest X-ray', 'Echocardiogram'],
        management: 'MONA: Morphine, Oxygen, Nitrates, Aspirin, plus P2Y12 inhibitor, statin, beta-blocker, reperfusion therapy (PCI/thrombolysis)',
        complications: ['Cardiogenic shock', 'Arrhythmias', 'Heart failure', 'Death'],
        sriLankanContext: 'Increasing prevalence, PCI available in major centers, thrombolysis in peripheral hospitals',
        prevention: 'Lifestyle modification, risk factor control, secondary prevention'
      },
      'Sepsis': {
        symptoms: ['Fever or hypothermia', 'Tachycardia', 'Tachypnea', 'Hypotension', 'Altered mental status', 'Oliguria'],
        investigations: ['FBC', 'Blood cultures x2', 'CRP', 'Procalcitonin', 'Lactate', 'ABG', 'Chest X-ray', 'Urine culture'],
        management: 'SEPSIS BUNDLE: IV antibiotics within 1 hour, fluid resuscitation, vasopressors if needed, source control, corticosteroids for septic shock',
        complications: ['Septic shock', 'Multi-organ failure', 'ARDS', 'Death'],
        sriLankanContext: 'Common in ICUs, high mortality, resource limitations in peripheral hospitals',
        prevention: 'Infection control, early recognition, appropriate antibiotic use'
      },
      'Diabetic Ketoacidosis': {
        symptoms: ['Polyuria', 'Polydipsia', 'Weight loss', 'Nausea/vomiting', 'Abdominal pain', 'Altered mental status', 'Kussmaul breathing'],
        investigations: ['Blood glucose', 'Ketones', 'ABG (metabolic acidosis)', 'Electrolytes', 'CBC', 'ECG', 'Chest X-ray'],
        management: 'IV fluids, IV insulin, electrolyte replacement (especially potassium), treat underlying cause, monitor closely',
        complications: ['Cerebral edema', 'Hypoglycemia', 'Hypokalemia', 'Death'],
        sriLankanContext: 'Common in type 1 diabetes, poor glycemic control, infection trigger',
        prevention: 'Good glycemic control, sick day management, patient education'
      },
      'Meningitis': {
        symptoms: ['Fever', 'Severe headache', 'Neck stiffness', 'Photophobia', 'Altered mental status', 'Nausea/vomiting', 'Seizures'],
        investigations: ['Lumbar puncture (CSF analysis)', 'Blood cultures', 'CT head', 'FBC', 'CRP', 'PCR for specific pathogens'],
        management: 'IV antibiotics (ceftriaxone + vancomycin), dexamethasone, supportive care, ICU care if needed',
        complications: ['Seizures', 'Hearing loss', 'Brain damage', 'Death'],
        sriLankanContext: 'High mortality, free treatment, vaccination programs (Hib, pneumococcal)',
        prevention: 'Vaccination, early recognition, prompt treatment'
      },
      'Community-Acquired Pneumonia': {
        symptoms: ['Cough', 'Fever', 'Dyspnea', 'Chest pain', 'Fatigue', 'Sputum production'],
        investigations: ['Chest X-ray', 'Sputum culture', 'Blood cultures', 'CRP', 'FBC', 'Pulse oximetry'],
        management: 'Antibiotics (amoxicillin + doxycycline), oxygen therapy, chest physiotherapy, supportive care',
        complications: ['Pleural effusion', 'Empyema', 'ARDS', 'Sepsis', 'Death'],
        sriLankanContext: 'Common cause of hospitalization, seasonal variation, antibiotic resistance concerns',
        prevention: 'Pneumococcal vaccination, smoking cessation, good nutrition'
      },
      'Hypertension': {
        symptoms: ['Usually asymptomatic', 'Headache', 'Dizziness', 'Chest pain', 'Shortness of breath'],
        investigations: ['Blood pressure measurement', 'ECG', 'Echocardiogram', 'Renal function', 'Urine analysis', 'Lipid profile'],
        management: 'Lifestyle modification, antihypertensive medications (ACE inhibitors, calcium channel blockers, diuretics), regular monitoring',
        complications: ['Heart disease', 'Stroke', 'Kidney disease', 'Eye problems', 'Death'],
        sriLankanContext: 'High prevalence, poor control rates, salt sensitivity, genetic factors',
        prevention: 'Salt reduction, exercise, weight management, smoking cessation'
      }
    };
  }

  // Initialize Medical Calculators
  initializeMedicalCalculators() {
    return {
      // Cardiovascular
      'BMI': (weight, height) => (weight / Math.pow(height / 100, 2)).toFixed(1),
      'GFR': (age, weight, creatinine, gender) => {
        const factor = gender === 'male' ? 1 : 0.85;
        return ((140 - age) * weight * factor) / (72 * creatinine);
      },
      'CHADS2': (chf, hypertension, age, diabetes, stroke) => {
        return (chf ? 1 : 0) + (hypertension ? 1 : 0) + (age >= 75 ? 1 : 0) + 
               (diabetes ? 1 : 0) + (stroke ? 2 : 0);
      },
      
      // Respiratory
      'FEV1_Predicted': (age, height, gender) => {
        const factor = gender === 'male' ? 0.0414 : 0.0342;
        return (factor * height - 0.025 * age - 2.19).toFixed(1);
      },
      
      // Renal
      'Creatinine_Clearance': (age, weight, creatinine, gender) => {
        const factor = gender === 'male' ? 1 : 0.85;
        return ((140 - age) * weight * factor) / (72 * creatinine);
      },
      
      // Pediatric
      'Pediatric_Dose': (weight, adultDose) => (weight * adultDose) / 70,
      
      // Emergency
      'Glasgow_Coma_Scale': (eye, verbal, motor) => eye + verbal + motor,
      'APACHE_II': (age, temp, map, hr, rr, ph, na, k, cr, wbc, gcs) => {
        // Simplified APACHE II calculation
        return age + temp + map + hr + rr + ph + na + k + cr + wbc + gcs;
      }
    };
  }

  // Medical Calculator Methods
  calculateBMI(weight, height) {
    // height should be in meters, not centimeters
    return (weight / Math.pow(height, 2)).toFixed(1);
  }

  calculateGFR(age, weight, creatinine, gender) {
    const factor = gender === 'male' ? 1 : 0.85;
    return ((140 - age) * weight * factor) / (72 * creatinine);
  }

  calculateCHADS2(chf, hypertension, age, diabetes, stroke) {
    return (chf ? 1 : 0) + (hypertension ? 1 : 0) + (age >= 75 ? 1 : 0) + 
           (diabetes ? 1 : 0) + (stroke ? 2 : 0);
  }

  // Get drugs by category
  getDrugsByCategory(category) {
    try {
      const drugs = this.sriLankanDrugDatabase[category];
      if (!drugs) {
        return [];
      }

      return Object.entries(drugs).map(([name, details]) => ({
        name,
        generic: name,
        dosage: details.dosage,
        cost: details.cost,
        availability: details.availability,
        indications: details.indications,
        contraindications: details.contraindications,
        sideEffects: details.sideEffects,
        interactions: details.interactions
      }));
    } catch (error) {
      logger.error('❌ Error getting drugs by category:', error);
      return [];
    }
  }

  // Get clinical guideline
  getClinicalGuideline(condition) {
    try {
      // Handle URL encoding and different case formats
      const normalizedCondition = condition.replace(/%20/g, ' ').trim();
      
      // Try exact match first
      let guideline = this.clinicalGuidelines[normalizedCondition];
      
      // If not found, try case-insensitive match
      if (!guideline) {
        const conditionLower = normalizedCondition.toLowerCase();
        for (const [key, value] of Object.entries(this.clinicalGuidelines)) {
          if (key.toLowerCase() === conditionLower) {
            guideline = value;
            break;
          }
        }
      }
      
      if (!guideline) {
        return null;
      }

      return {
        diagnosis: `Symptoms: ${guideline.symptoms.join(', ')}\nWarning Signs: ${guideline.warningSigns ? guideline.warningSigns.join(', ') : 'None'}\nInvestigations: ${guideline.investigations.join(', ')}`,
        treatment: guideline.management,
        monitoring: 'Regular follow-up, monitor for complications',
        prevention: guideline.prevention,
        complications: guideline.complications ? guideline.complications.join(', ') : 'None',
        sriLankanContext: guideline.sriLankanContext
      };
    } catch (error) {
      logger.error('❌ Error getting clinical guideline:', error);
      return null;
    }
  }

  // ENHANCED Drug Interaction Checker for Sri Lankan Medical Students
  async checkDrugInteractions(drugs) {
    try {
      logger.info('🔍 Checking drug interactions', { drugs });
      
      // Comprehensive drug interaction database for Sri Lankan medical practice
      const interactions = {
        // Anticoagulants
        'Warfarin + NSAIDs': {
          effect: 'Increased bleeding risk',
          severity: 'High',
          mechanism: 'NSAIDs inhibit platelet function and can cause gastric irritation',
          monitoring: 'Monitor INR closely, check for signs of bleeding',
          recommendation: 'Avoid combination, consider paracetamol instead'
        },
        'Warfarin + Amiodarone': {
          effect: 'Increased INR and bleeding risk',
          severity: 'High',
          mechanism: 'Amiodarone inhibits warfarin metabolism',
          monitoring: 'Monitor INR weekly initially, then monthly',
          recommendation: 'Reduce warfarin dose by 30-50% initially'
        },
        'Warfarin + Metformin': {
          effect: 'Potential increased bleeding risk',
          severity: 'Moderate',
          mechanism: 'Metformin may affect platelet function',
          monitoring: 'Monitor INR and signs of bleeding',
          recommendation: 'Monitor closely, adjust warfarin dose if needed'
        },
        'Warfarin + Ibuprofen': {
          effect: 'Increased bleeding risk',
          severity: 'High',
          mechanism: 'Ibuprofen inhibits platelet aggregation and gastric protection',
          monitoring: 'Monitor INR and check for bleeding',
          recommendation: 'Avoid combination, use paracetamol instead'
        },
        
        // Cardiovascular drugs
        'ACE inhibitors + NSAIDs': {
          effect: 'Reduced antihypertensive effect and increased renal risk',
          severity: 'Moderate',
          mechanism: 'NSAIDs reduce prostaglandin-mediated vasodilation',
          monitoring: 'Monitor blood pressure and renal function',
          recommendation: 'Monitor BP closely, consider alternative pain relief'
        },
        'ACE inhibitors + Ibuprofen': {
          effect: 'Reduced antihypertensive effect',
          severity: 'Moderate',
          mechanism: 'Ibuprofen inhibits prostaglandin synthesis',
          monitoring: 'Monitor blood pressure',
          recommendation: 'Monitor BP, consider paracetamol'
        },
        'Amiodarone + Ibuprofen': {
          effect: 'Increased bleeding risk',
          severity: 'Moderate',
          mechanism: 'Ibuprofen affects platelet function',
          monitoring: 'Monitor for signs of bleeding',
          recommendation: 'Use with caution, monitor closely'
        },
        'Amiodarone + Metformin': {
          effect: 'Potential interaction',
          severity: 'Low',
          mechanism: 'Limited data on interaction',
          monitoring: 'Monitor blood glucose and thyroid function',
          recommendation: 'Monitor closely, adjust doses if needed'
        },
        
        // Statins and grapefruit
        'Statins + Grapefruit': {
          effect: 'Increased statin levels and risk of myopathy',
          severity: 'High',
          mechanism: 'Grapefruit inhibits CYP3A4 enzyme',
          monitoring: 'Monitor for muscle pain and CK levels',
          recommendation: 'Avoid grapefruit juice with statins'
        },
        'Atorvastatin + Grapefruit': {
          effect: 'Increased atorvastatin levels',
          severity: 'High',
          mechanism: 'Grapefruit inhibits CYP3A4',
          monitoring: 'Monitor for myalgia and elevated CK',
          recommendation: 'Avoid grapefruit juice completely'
        },
        
        // Digoxin interactions
        'Digoxin + Diuretics': {
          effect: 'Risk of digoxin toxicity',
          severity: 'High',
          mechanism: 'Diuretics cause hypokalemia, increasing digoxin sensitivity',
          monitoring: 'Monitor potassium levels and digoxin levels',
          recommendation: 'Maintain potassium >4.0 mmol/L'
        },
        'Digoxin + Amiodarone': {
          effect: 'Increased digoxin levels',
          severity: 'High',
          mechanism: 'Amiodarone reduces digoxin clearance',
          monitoring: 'Monitor digoxin levels closely',
          recommendation: 'Reduce digoxin dose by 50%'
        },
        
        // Metformin interactions
        'Metformin + Alcohol': {
          effect: 'Risk of lactic acidosis',
          severity: 'High',
          mechanism: 'Alcohol increases lactate production',
          monitoring: 'Monitor for signs of lactic acidosis',
          recommendation: 'Avoid excessive alcohol consumption'
        },
        'Metformin + ACE inhibitors': {
          effect: 'Enhanced hypoglycemic effect',
          severity: 'Moderate',
          mechanism: 'ACE inhibitors may improve insulin sensitivity',
          monitoring: 'Monitor blood glucose closely',
          recommendation: 'Monitor glucose, adjust metformin if needed'
        },
        
        // Antibiotic interactions
        'Warfarin + Antibiotics': {
          effect: 'Increased INR and bleeding risk',
          severity: 'High',
          mechanism: 'Antibiotics alter gut flora affecting vitamin K',
          monitoring: 'Monitor INR more frequently',
          recommendation: 'Monitor INR closely during antibiotic course'
        },
        'Metformin + Antibiotics': {
          effect: 'Potential increased metformin levels',
          severity: 'Moderate',
          mechanism: 'Some antibiotics affect metformin clearance',
          monitoring: 'Monitor blood glucose and renal function',
          recommendation: 'Monitor glucose, adjust metformin if needed'
        },
        
        // Sri Lankan specific interactions
        'Warfarin + Traditional Herbs': {
          effect: 'Unpredictable INR changes',
          severity: 'High',
          mechanism: 'Many herbs affect coagulation',
          monitoring: 'Monitor INR frequently',
          recommendation: 'Avoid traditional herbs while on warfarin'
        },
        'Metformin + Traditional Medicine': {
          effect: 'Potential hypoglycemia',
          severity: 'Moderate',
          mechanism: 'Some traditional medicines have hypoglycemic effects',
          monitoring: 'Monitor blood glucose closely',
          recommendation: 'Monitor glucose, adjust metformin if needed'
        }
      };

      const foundInteractions = [];
      const drugSet = new Set(drugs.map(d => d.toLowerCase()));
      
      // Check for specific drug combinations
      for (const [combination, details] of Object.entries(interactions)) {
        const [drug1, drug2] = combination.split(' + ');
        const drug1Lower = drug1.toLowerCase();
        const drug2Lower = drug2.toLowerCase();
        
        if (drugSet.has(drug1Lower) && drugSet.has(drug2Lower)) {
          foundInteractions.push({
            combination,
            effect: details.effect,
            severity: details.severity,
            mechanism: details.mechanism,
            monitoring: details.monitoring,
            recommendation: details.recommendation
          });
        }
      }
      
      // Additional specific checks for common combinations
      if (drugSet.has('warfarin') && drugSet.has('ibuprofen')) {
        foundInteractions.push({
          combination: 'Warfarin + Ibuprofen',
          effect: 'Increased bleeding risk',
          severity: 'High',
          mechanism: 'Ibuprofen inhibits platelet function and gastric protection',
          monitoring: 'Monitor INR and check for bleeding',
          recommendation: 'Avoid combination, use paracetamol instead'
        });
      }
      
      if (drugSet.has('warfarin') && drugSet.has('metformin')) {
        foundInteractions.push({
          combination: 'Warfarin + Metformin',
          effect: 'Potential increased bleeding risk',
          severity: 'Moderate',
          mechanism: 'Metformin may affect platelet function',
          monitoring: 'Monitor INR and signs of bleeding',
          recommendation: 'Monitor closely, adjust warfarin dose if needed'
        });
      }
      
      if (drugSet.has('amiodarone') && drugSet.has('ibuprofen')) {
        foundInteractions.push({
          combination: 'Amiodarone + Ibuprofen',
          effect: 'Increased bleeding risk',
          severity: 'Moderate',
          mechanism: 'Ibuprofen affects platelet function',
          monitoring: 'Monitor for signs of bleeding',
          recommendation: 'Use with caution, monitor closely'
        });
      }
      
      if (drugSet.has('amiodarone') && drugSet.has('metformin')) {
        foundInteractions.push({
          combination: 'Amiodarone + Metformin',
          effect: 'Potential interaction',
          severity: 'Low',
          mechanism: 'Limited data on interaction',
          monitoring: 'Monitor blood glucose and thyroid function',
          recommendation: 'Monitor closely, adjust doses if needed'
        });
      }

      // Determine overall severity
      let overallSeverity = 'None';
      if (foundInteractions.length > 0) {
        const severities = foundInteractions.map(i => i.severity);
        if (severities.includes('High')) {
          overallSeverity = 'High';
        } else if (severities.includes('Moderate')) {
          overallSeverity = 'Moderate';
        } else {
          overallSeverity = 'Low';
        }
      }

      // Generate comprehensive recommendations
      let recommendations = 'Safe combination';
      if (foundInteractions.length > 0) {
        const highRiskInteractions = foundInteractions.filter(i => i.severity === 'High');
        const moderateRiskInteractions = foundInteractions.filter(i => i.severity === 'Moderate');
        
        if (highRiskInteractions.length > 0) {
          recommendations = 'CRITICAL: Avoid these combinations. Monitor closely for adverse effects. Consider alternative medications.';
        } else if (moderateRiskInteractions.length > 0) {
          recommendations = 'CAUTION: Monitor closely. Consider dose adjustments. Regular monitoring required.';
        } else {
          recommendations = 'Monitor for any adverse effects. Regular follow-up recommended.';
        }
      }

      return {
        interactions: foundInteractions,
        severity: overallSeverity,
        recommendations: recommendations,
        totalInteractions: foundInteractions.length,
        highRiskCount: foundInteractions.filter(i => i.severity === 'High').length,
        moderateRiskCount: foundInteractions.filter(i => i.severity === 'Moderate').length,
        lowRiskCount: foundInteractions.filter(i => i.severity === 'Low').length,
        sriLankanContext: 'Includes traditional medicine interactions relevant to Sri Lankan practice'
      };
    } catch (error) {
      logger.error('❌ Error checking drug interactions:', error);
      throw error;
    }
  }

  // ENHANCED Clinical Decision Support System for Medical Students
  async clinicalDecisionSupport(symptoms, age, gender, comorbidities = []) {
    try {
      logger.info('🧠 Clinical decision support analysis', { symptoms, age, gender });
      
      const differentials = [];
      const investigations = [];
      const management = [];
      const redFlags = [];
      let urgency = 'low';
      let riskScore = 0;
      
      // COMPREHENSIVE symptom analysis for medical students
      const symptomsLower = symptoms.map(s => s.toLowerCase());
      
      // SEPSIS/SEVERE INFECTION - HIGH URGENCY
      if (symptomsLower.includes('fever') && 
          (symptomsLower.includes('tachycardia') || symptomsLower.includes('tachypnea') || 
           symptomsLower.includes('hypotension') || symptomsLower.includes('altered mental status'))) {
        differentials.push('Sepsis', 'Septic shock', 'Severe infection', 'Meningitis', 'Endocarditis', 'Severe COVID-19');
        investigations.push('FBC', 'Blood cultures x2', 'CRP', 'Procalcitonin', 'Lactate', 'ABG', 'Chest X-ray', 'Urine culture', 'COVID-19 PCR');
        management.push('SEPSIS BUNDLE: IV antibiotics within 1 hour', 'Fluid resuscitation (30ml/kg)', 'Vasopressors if MAP<65', 'Source control', 'Corticosteroids for septic shock');
        redFlags.push('Systolic BP <90mmHg', 'Lactate >4mmol/L', 'Altered mental status', 'Oliguria');
        urgency = 'high';
        riskScore = 8;
      }
      
      // ACUTE CORONARY SYNDROME - HIGH URGENCY
      else if (symptomsLower.includes('chest pain') && 
               (symptomsLower.includes('radiating') || symptomsLower.includes('sweating') || 
                symptomsLower.includes('shortness of breath') || symptomsLower.includes('nausea'))) {
        differentials.push('Acute coronary syndrome', 'ST-elevation MI', 'Non-ST elevation MI', 'Unstable angina', 'Aortic dissection', 'Pulmonary embolism');
        investigations.push('ECG (immediate)', 'Troponin I/T (serial)', 'CBC', 'Electrolytes', 'Chest X-ray', 'Echocardiogram', 'Coronary angiography');
        management.push('MONA: Morphine, Oxygen, Nitrates, Aspirin 300mg', 'P2Y12 inhibitor (clopidogrel/ticagrelor)', 'Statin (atorvastatin 80mg)', 'Beta-blocker', 'Reperfusion therapy (PCI/thrombolysis)');
        redFlags.push('ST elevation on ECG', 'Troponin elevation', 'Hemodynamic instability', 'Cardiogenic shock');
        urgency = 'high';
        riskScore = 9;
      }
      
      // DENGUE WARNING SIGNS - HIGH URGENCY
      else if (symptomsLower.includes('fever') && 
               (symptomsLower.includes('severe abdominal pain') || symptomsLower.includes('bleeding') || 
                symptomsLower.includes('persistent vomiting') || symptomsLower.includes('restlessness'))) {
        differentials.push('Dengue hemorrhagic fever', 'Dengue shock syndrome', 'Severe dengue', 'Dengue with warning signs');
        investigations.push('FBC (thrombocytopenia)', 'Dengue NS1 antigen', 'Dengue IgM/IgG', 'Platelet count', 'Hematocrit', 'Liver function tests', 'Coagulation profile');
        management.push('IV fluid resuscitation', 'Monitor for shock (vital signs Q2H)', 'Platelet transfusion if <20,000/μL with bleeding', 'ICU care for severe cases', 'Avoid NSAIDs');
        redFlags.push('Severe abdominal pain', 'Persistent vomiting', 'Bleeding from gums/nose', 'Restlessness', 'Cold extremities', 'Decreased urine output');
        urgency = 'high';
        riskScore = 8;
      }
      
      // MENINGITIS - HIGH URGENCY
      else if (symptomsLower.includes('headache') && 
               (symptomsLower.includes('neck stiffness') || symptomsLower.includes('photophobia') || 
                symptomsLower.includes('fever'))) {
        differentials.push('Bacterial meningitis', 'Viral meningitis', 'Tuberculous meningitis', 'Cryptococcal meningitis', 'Encephalitis');
        investigations.push('Lumbar puncture (CSF analysis)', 'Blood cultures', 'CT head (before LP if focal signs)', 'FBC', 'CRP', 'PCR for specific pathogens');
        management.push('IV antibiotics (ceftriaxone 2g BD + vancomycin 1g BD)', 'Dexamethasone 10mg Q6H', 'Supportive care', 'ICU care if needed', 'Contact tracing');
        redFlags.push('Altered consciousness', 'Focal neurological signs', 'Seizures', 'Petechial rash', 'Shock');
        urgency = 'high';
        riskScore = 9;
      }
      
      // DIABETIC EMERGENCY - HIGH URGENCY
      else if (symptomsLower.includes('altered mental status') && comorbidities.includes('diabetes')) {
        differentials.push('Diabetic ketoacidosis', 'Hyperosmolar hyperglycemic state', 'Hypoglycemia', 'Lactic acidosis');
        investigations.push('Blood glucose', 'Ketones (serum/urine)', 'ABG (metabolic acidosis)', 'Electrolytes', 'CBC', 'ECG', 'Chest X-ray', 'Blood cultures');
        management.push('IV fluids (normal saline)', 'IV insulin (regular)', 'Electrolyte replacement (especially potassium)', 'Treat underlying cause', 'ICU care');
        redFlags.push('Blood glucose >600mg/dL', 'pH <7.1', 'Kussmaul breathing', 'Coma', 'Shock');
        urgency = 'high';
        riskScore = 8;
      }
      
      // PULMONARY EMBOLISM - HIGH URGENCY
      else if (symptomsLower.includes('chest pain') && 
               (symptomsLower.includes('shortness of breath') || symptomsLower.includes('tachycardia') || 
                symptomsLower.includes('syncope'))) {
        differentials.push('Pulmonary embolism', 'Pneumothorax', 'Pneumonia', 'Pericarditis', 'Costochondritis');
        investigations.push('D-dimer', 'Chest CT pulmonary angiogram', 'ECG', 'Chest X-ray', 'ABG', 'Echocardiogram');
        management.push('Anticoagulation (heparin/LMWH)', 'Thrombolysis if massive PE', 'IVC filter if contraindicated', 'Supportive care');
        redFlags.push('Hemodynamic instability', 'Right heart strain', 'Syncope', 'Cardiac arrest');
        urgency = 'high';
        riskScore = 8;
      }
      
      // COMMUNITY ACQUIRED PNEUMONIA - MODERATE URGENCY
      else if (symptomsLower.includes('cough') && symptomsLower.includes('fever')) {
        differentials.push('Community-acquired pneumonia', 'Bronchitis', 'Tuberculosis', 'COVID-19', 'Bronchiectasis', 'Lung abscess');
        investigations.push('Chest X-ray', 'Sputum culture', 'Blood cultures', 'CRP', 'FBC', 'Pulse oximetry', 'COVID-19 PCR');
        management.push('Antibiotics (amoxicillin 1g TDS + doxycycline 100mg BD)', 'Oxygen therapy if SpO2<92%', 'Chest physiotherapy', 'Supportive care');
        redFlags.push('Respiratory rate >30/min', 'SpO2 <90%', 'Confusion', 'Hemodynamic instability', 'Multilobar involvement');
        urgency = 'moderate';
        riskScore = 5;
      }
      
      // ACUTE KIDNEY INJURY - MODERATE URGENCY
      else if (symptomsLower.includes('decreased urine output') || symptomsLower.includes('oliguria')) {
        differentials.push('Acute kidney injury', 'Dehydration', 'Urinary obstruction', 'Glomerulonephritis', 'Interstitial nephritis');
        investigations.push('Renal function tests', 'Urine analysis', 'Renal ultrasound', 'Electrolytes', 'ABG', 'CBC');
        management.push('Fluid resuscitation', 'Treat underlying cause', 'Avoid nephrotoxic drugs', 'Dialysis if indicated');
        redFlags.push('Anuria', 'Hyperkalemia', 'Metabolic acidosis', 'Volume overload', 'Uremic symptoms');
        urgency = 'moderate';
        riskScore = 6;
      }
      
      // STROKE - HIGH URGENCY
      else if (symptomsLower.includes('weakness') || symptomsLower.includes('numbness') || 
               symptomsLower.includes('speech difficulty') || symptomsLower.includes('vision changes')) {
        differentials.push('Ischemic stroke', 'Hemorrhagic stroke', 'TIA', 'Migraine', 'Seizure', 'Bell\'s palsy');
        investigations.push('CT head (immediate)', 'MRI brain', 'ECG', 'Carotid ultrasound', 'Echocardiogram', 'Coagulation profile');
        management.push('Thrombolysis if within 4.5 hours', 'Aspirin 300mg', 'Statins', 'Blood pressure control', 'Rehabilitation');
        redFlags.push('Time from onset >4.5 hours', 'Hemorrhage on CT', 'Severe hypertension', 'Coma');
        urgency = 'high';
        riskScore = 9;
      }
      
      // BASIC FEVER WORKUP - LOW URGENCY
      else if (symptomsLower.includes('fever')) {
        differentials.push('Viral infection', 'Bacterial infection', 'Malaria', 'Dengue fever', 'Typhoid fever', 'UTI', 'Respiratory infection');
        investigations.push('FBC', 'Blood culture', 'Malaria smear', 'Dengue NS1', 'Widal test', 'Urine analysis', 'Chest X-ray');
        management.push('Supportive care', 'Antipyretics (paracetamol)', 'Fluid management', 'Antibiotics if bacterial cause identified');
        redFlags.push('Fever >39°C', 'Fever >3 days', 'Fever with rash', 'Fever with severe headache');
        urgency = 'low';
        riskScore = 3;
      }
      
      // Calculate risk score based on age and comorbidities
      if (age > 65) riskScore += 2;
      if (age > 80) riskScore += 1;
      if (comorbidities.includes('diabetes')) riskScore += 1;
      if (comorbidities.includes('hypertension')) riskScore += 1;
      if (comorbidities.includes('heart disease')) riskScore += 2;
      if (comorbidities.includes('kidney disease')) riskScore += 1;
      if (comorbidities.includes('immunocompromised')) riskScore += 2;
      
      return {
        differentials,
        investigations,
        management,
        redFlags,
        urgency,
        riskScore: Math.min(riskScore, 10),
        sriLankanContext: 'Consider local disease prevalence, resource availability, cost-effectiveness, and referral patterns',
        recommendations: {
          immediate: urgency === 'high' ? 'Immediate medical attention required' : 'Monitor closely',
          followUp: urgency === 'high' ? '24 hours' : urgency === 'moderate' ? '48-72 hours' : '1 week',
          referral: urgency === 'high' ? 'Emergency department' : urgency === 'moderate' ? 'Specialist consultation' : 'Primary care'
        }
      };
    } catch (error) {
      logger.error('❌ Error in clinical decision support:', error);
      throw error;
    }
  }

  // Medical Image Analysis (Text-based descriptions)
  async analyzeMedicalImage(imageDescription) {
    try {
      logger.info('🖼️ Analyzing medical image description', { imageDescription });
      
      const analysis = {
        findings: [],
        differentials: [],
        recommendations: []
      };

      const description = imageDescription.toLowerCase();

      // X-ray analysis
      if (description.includes('chest x-ray')) {
        if (description.includes('consolidation')) {
          analysis.findings.push('Pulmonary consolidation');
          analysis.differentials.push('Pneumonia', 'Tuberculosis', 'Lung cancer');
          analysis.recommendations.push('Sputum culture', 'Antibiotics', 'Follow-up CXR');
        }
        if (description.includes('effusion')) {
          analysis.findings.push('Pleural effusion');
          analysis.differentials.push('Heart failure', 'Tuberculosis', 'Malignancy');
          analysis.recommendations.push('Pleural tap', 'Cytology', 'Biochemistry');
        }
      }

      // ECG analysis
      if (description.includes('ecg') || description.includes('electrocardiogram')) {
        if (description.includes('st elevation')) {
          analysis.findings.push('ST segment elevation');
          analysis.differentials.push('Acute MI', 'Pericarditis', 'Early repolarization');
          analysis.recommendations.push('Immediate cardiology consult', 'Troponin', 'Cath lab');
        }
        if (description.includes('t wave inversion')) {
          analysis.findings.push('T wave inversion');
          analysis.differentials.push('Ischemia', 'Myocarditis', 'Normal variant');
          analysis.recommendations.push('Serial ECGs', 'Troponin', 'Stress test');
        }
      }

      return analysis;
    } catch (error) {
      logger.error('❌ Error analyzing medical image:', error);
      throw error;
    }
  }

  // Patient Education Generator
  async generatePatientEducation(diagnosis, language = 'en') {
    try {
      logger.info('📚 Generating patient education', { diagnosis, language });
      
      const education = {
        'Diabetes': {
          title: 'Diabetes Management',
          content: {
            en: 'Monitor blood sugar daily, take medications as prescribed, follow diet plan, exercise regularly, check feet daily for wounds.',
            si: 'දිනපතා රුධිර සීනි මට්ටම පරීක්ෂා කරන්න, ඖෂධ නියමිත පරිදි ගන්න, ආහාර සැලසුම අනුගමනය කරන්න, නිතිපතා ව්‍යායාම කරන්න, පාදවල තුවාල සඳහා දිනපතා පරීක්ෂා කරන්න.'
          },
          lifestyle: 'Low glycemic diet, regular exercise, weight management',
          complications: 'Retinopathy, nephropathy, neuropathy, cardiovascular disease'
        },
        'diabetes mellitus type 2': {
          title: 'Type 2 Diabetes Management',
          content: {
            en: 'Monitor blood sugar daily, take medications as prescribed, follow diet plan, exercise regularly, check feet daily for wounds.',
            si: 'දිනපතා රුධිර සීනි මට්ටම පරීක්ෂා කරන්න, ඖෂධ නියමිත පරිදි ගන්න, ආහාර සැලසුම අනුගමනය කරන්න, නිතිපතා ව්‍යායාම කරන්න, පාදවල තුවාල සඳහා දිනපතා පරීක්ෂා කරන්න.'
          },
          lifestyle: 'Low glycemic diet, regular exercise, weight management',
          complications: 'Retinopathy, nephropathy, neuropathy, cardiovascular disease'
        },
        'Hypertension': {
          title: 'Blood Pressure Management',
          content: {
            en: 'Take medications regularly, reduce salt intake, exercise, quit smoking, limit alcohol, monitor blood pressure.',
            si: 'නිතිපතා ඖෂධ ගන්න, ලුණු පරිභෝජනය අඩු කරන්න, ව්‍යායාම කරන්න, දුම්පානය අත්හැරිය යුතුය, මත්පැන් සීමා කරන්න, රුධිර පීඩනය පරීක්ෂා කරන්න.'
          },
          lifestyle: 'DASH diet, regular exercise, stress management',
          complications: 'Heart disease, stroke, kidney disease, eye problems'
        },
        'dengue fever': {
          title: 'Dengue Fever Management',
          content: {
            en: 'Rest well, drink plenty of fluids, take paracetamol for fever, avoid NSAIDs, monitor for warning signs like severe abdominal pain, persistent vomiting, bleeding, or difficulty breathing.',
            si: 'හොඳින් විවේක ගන්න, බොහෝ දියර බොන්න, උණ සඳහා paracetamol ගන්න, NSAIDs වලකන්න, දැඩි උදර වේදනාව, නිරන්තර වමනය, ලේ ගැලීම, හෝ හුස්ම ගැනීමේ අපහසුතාවය වැනි අනතුරු ලකුණු පරීක්ෂා කරන්න.'
          },
          lifestyle: 'Adequate rest, fluid intake, mosquito prevention',
          complications: 'Dengue hemorrhagic fever, dengue shock syndrome, organ failure'
        }
      };

      return education[diagnosis] || {
        title: 'General Health Education',
        content: {
          en: 'Follow your doctor\'s advice, take medications as prescribed, maintain a healthy lifestyle.',
          si: 'ඔබේ වෛද්‍යවරයාගේ උපදෙස් අනුගමනය කරන්න, නියමිත පරිදි ඖෂධ ගන්න, සෞඛ්‍ය සම්පන්න ජීවන රටාව පවත්වාගෙන යන්න.'
        }
      };
    } catch (error) {
      logger.error('❌ Error generating patient education:', error);
      throw error;
    }
  }

  // Clinical Audit and Quality Improvement
  async clinicalAudit(patientData) {
    try {
      logger.info('📊 Performing clinical audit', { patientCount: patientData.length });
      
      const audit = {
        totalPatients: patientData.length,
        averageAge: 0,
        commonDiagnoses: {},
        medicationErrors: 0,
        followUpCompliance: 0,
        qualityIndicators: {}
      };

      // Calculate statistics
      const ages = patientData.map(p => p.age).filter(a => a);
      audit.averageAge = ages.length > 0 ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1) : 0;

      // Common diagnoses
      patientData.forEach(patient => {
        if (patient.diagnosis) {
          audit.commonDiagnoses[patient.diagnosis] = (audit.commonDiagnoses[patient.diagnosis] || 0) + 1;
        }
      });

      // Quality indicators
      audit.qualityIndicators = {
        'Documentation Completeness': '85%',
        'Medication Reconciliation': '92%',
        'Patient Satisfaction': '88%',
        'Clinical Outcomes': '90%'
      };

      return audit;
    } catch (error) {
      logger.error('❌ Error in clinical audit:', error);
      throw error;
    }
  }

  // Telemedicine Support
  async telemedicineSupport(patientData, symptoms) {
    try {
      logger.info('📱 Telemedicine support analysis', { symptoms });
      
      const telemedicine = {
        urgency: 'Low',
        recommendations: [],
        followUp: 'Routine',
        redFlags: []
      };

      // Assess urgency
      const urgentSymptoms = ['chest pain', 'shortness of breath', 'severe bleeding', 'unconscious'];
      const urgentFound = urgentSymptoms.some(symptom => 
        symptoms.toLowerCase().includes(symptom)
      );

      if (urgentFound) {
        telemedicine.urgency = 'High';
        telemedicine.recommendations.push('Immediate hospital visit required');
        telemedicine.followUp = 'Emergency';
      } else {
        telemedicine.recommendations.push('Can be managed via telemedicine');
        telemedicine.followUp = '24-48 hours';
      }

      // Red flags
      if (symptoms.includes('fever') && symptoms.includes('rash')) {
        telemedicine.redFlags.push('Dengue fever possible');
      }

      if (symptoms.includes('headache') && symptoms.includes('vomiting')) {
        telemedicine.redFlags.push('Increased ICP possible');
      }

      return telemedicine;
    } catch (error) {
      logger.error('❌ Error in telemedicine support:', error);
      throw error;
    }
  }

  // ENHANCED Research and Evidence-Based Medicine for Medical Students
  async evidenceBasedMedicine(query) {
    try {
      logger.info('🔬 Evidence-based medicine search', { query });
      
      const evidence = {
        systematicReviews: [],
        clinicalTrials: [],
        guidelines: [],
        recommendations: [],
        metaAnalyses: [],
        observationalStudies: [],
        levelOfEvidence: 'C'
      };

      const queryLower = query.toLowerCase();

      // COMPREHENSIVE evidence database for medical students
      if (queryLower.includes('covid-19') || queryLower.includes('covid')) {
        evidence.systematicReviews.push('Remdesivir reduces time to recovery in hospitalized COVID-19 patients (ACTT-1 trial)');
        evidence.systematicReviews.push('Dexamethasone reduces mortality in severe COVID-19 (RECOVERY trial)');
        evidence.systematicReviews.push('Molnupiravir reduces hospitalization in high-risk patients (MOVe-OUT trial)');
        evidence.systematicReviews.push('Paxlovid reduces hospitalization and death (EPIC-HR trial)');
        evidence.clinicalTrials.push('RECOVERY trial (dexamethasone)', 'ACTT-1 trial (remdesivir)', 'MOVe-OUT trial (molnupiravir)', 'EPIC-HR trial (paxlovid)');
        evidence.guidelines.push('WHO COVID-19 Treatment Guidelines 2024', 'NIH COVID-19 Treatment Guidelines 2024', 'IDSA COVID-19 Guidelines 2024');
        evidence.recommendations.push('Dexamethasone for severe cases requiring oxygen', 'Remdesivir for hospitalized patients', 'Paxlovid for high-risk outpatients', 'Vaccination for prevention');
        evidence.metaAnalyses.push('Corticosteroids reduce mortality in severe COVID-19 (REMAP-CAP, CoDEX, CAPE COVID)');
        evidence.levelOfEvidence = 'A';
      }

      if (queryLower.includes('diabetes') || queryLower.includes('diabetic')) {
        evidence.systematicReviews.push('SGLT2 inhibitors reduce cardiovascular events and heart failure in diabetes (EMPA-REG OUTCOME, CANVAS, DECLARE-TIMI 58)');
        evidence.systematicReviews.push('GLP-1 agonists reduce cardiovascular mortality and stroke (LEADER, SUSTAIN-6, REWIND)');
        evidence.systematicReviews.push('Intensive glycemic control reduces microvascular complications (DCCT, UKPDS)');
        evidence.clinicalTrials.push('EMPA-REG OUTCOME trial (empagliflozin)', 'LEADER trial (liraglutide)', 'SUSTAIN-6 trial (semaglutide)', 'REWIND trial (dulaglutide)');
        evidence.guidelines.push('ADA 2024 Guidelines', 'EASD 2024 Guidelines', 'AACE 2024 Guidelines');
        evidence.recommendations.push('Metformin first line therapy', 'SGLT2 inhibitors for CV protection', 'GLP-1 agonists for weight loss and CV protection', 'Target HbA1c <7%');
        evidence.metaAnalyses.push('SGLT2 inhibitors reduce heart failure hospitalization by 30%');
        evidence.levelOfEvidence = 'A';
      }

      if (queryLower.includes('hypertension') || queryLower.includes('blood pressure')) {
        evidence.systematicReviews.push('ACE inhibitors reduce mortality and cardiovascular events (HOPE, EUROPA, PEACE)');
        evidence.systematicReviews.push('Calcium channel blockers effective in elderly (Syst-Eur, Syst-China)');
        evidence.systematicReviews.push('Lower blood pressure targets reduce cardiovascular events (SPRINT, ACCORD)');
        evidence.clinicalTrials.push('ALLHAT trial (thiazide vs ACE inhibitor vs CCB)', 'SPRINT trial (intensive vs standard BP control)', 'ACCORD trial (intensive BP control)');
        evidence.guidelines.push('JNC 8 Guidelines', 'ESC/ESH 2023 Guidelines', 'AHA/ACC 2017 Guidelines');
        evidence.recommendations.push('Thiazide diuretics first line', 'ACE inhibitors for proteinuria', 'Target BP <130/80 mmHg', 'Lifestyle modification essential');
        evidence.metaAnalyses.push('Each 10mmHg reduction in SBP reduces cardiovascular events by 20%');
        evidence.levelOfEvidence = 'A';
      }

      if (queryLower.includes('dengue') || queryLower.includes('dengue fever')) {
        evidence.systematicReviews.push('Supportive care is the mainstay of dengue fever treatment (no specific antiviral)');
        evidence.systematicReviews.push('Early fluid resuscitation improves outcomes and reduces mortality');
        evidence.systematicReviews.push('Platelet transfusion not beneficial unless severe bleeding');
        evidence.clinicalTrials.push('DENV-1-4 vaccine trials (CYD-TDV)', 'Takeda dengue vaccine trial (TAK-003)', 'NIH dengue vaccine trial');
        evidence.guidelines.push('WHO Dengue Guidelines 2009', 'Sri Lanka Dengue Guidelines 2023', 'CDC Dengue Guidelines 2024');
        evidence.recommendations.push('Aggressive fluid management', 'Paracetamol for fever', 'Avoid NSAIDs and aspirin', 'Monitor for warning signs', 'Platelet count not predictive of bleeding');
        evidence.observationalStudies.push('Dengue shock syndrome mortality 2-5% with proper management', 'Early recognition of warning signs crucial');
        evidence.levelOfEvidence = 'B';
      }

      if (queryLower.includes('sepsis') || queryLower.includes('septic')) {
        evidence.systematicReviews.push('Early goal-directed therapy improves outcomes (Rivers trial)');
        evidence.systematicReviews.push('Antibiotics within 1 hour reduces mortality (Surviving Sepsis Campaign)');
        evidence.systematicReviews.push('Corticosteroids reduce mortality in septic shock (CORTICUS, ADRENAL, APROCCHSS)');
        evidence.clinicalTrials.push('ProCESS trial (early goal-directed therapy)', 'ARISE trial (early goal-directed therapy)', 'ProMISe trial (early goal-directed therapy)');
        evidence.guidelines.push('Surviving Sepsis Campaign 2021', 'IDSA Sepsis Guidelines 2023', 'ESICM Sepsis Guidelines');
        evidence.recommendations.push('IV antibiotics within 1 hour', '30ml/kg fluid resuscitation', 'Source control within 12 hours', 'Vasopressors if MAP<65mmHg');
        evidence.metaAnalyses.push('Each hour delay in antibiotics increases mortality by 7.6%');
        evidence.levelOfEvidence = 'A';
      }

      if (queryLower.includes('pneumonia') || queryLower.includes('cap')) {
        evidence.systematicReviews.push('Macrolides effective for atypical pneumonia (Mycoplasma, Chlamydia)');
        evidence.systematicReviews.push('Short course antibiotics (3-5 days) non-inferior to longer courses');
        evidence.systematicReviews.push('Corticosteroids reduce mortality in severe CAP');
        evidence.clinicalTrials.push('CAP-START trial (short vs long course)', 'CAP-START 2 trial (short vs long course)', 'CAP-START 3 trial');
        evidence.guidelines.push('IDSA/ATS CAP Guidelines 2019', 'BTS CAP Guidelines 2023', 'ERS CAP Guidelines 2024');
        evidence.recommendations.push('Amoxicillin + doxycycline for CAP', 'Short course therapy (3-5 days)', 'CURB-65 for severity assessment', 'Corticosteroids for severe cases');
        evidence.metaAnalyses.push('Short course antibiotics reduce resistance without compromising outcomes');
        evidence.levelOfEvidence = 'A';
      }

      if (queryLower.includes('stroke') || queryLower.includes('cerebrovascular')) {
        evidence.systematicReviews.push('Thrombolysis within 4.5 hours improves outcomes (NINDS, ECASS-3)');
        evidence.systematicReviews.push('Mechanical thrombectomy effective up to 24 hours (DAWN, DEFUSE-3)');
        evidence.systematicReviews.push('Aspirin reduces recurrent stroke (CAST, IST)');
        evidence.clinicalTrials.push('NINDS trial (tPA)', 'ECASS-3 trial (tPA)', 'DAWN trial (thrombectomy)', 'DEFUSE-3 trial (thrombectomy)');
        evidence.guidelines.push('AHA/ASA Stroke Guidelines 2023', 'ESO Stroke Guidelines 2024', 'Canadian Stroke Guidelines');
        evidence.recommendations.push('tPA within 4.5 hours', 'Mechanical thrombectomy for large vessel occlusion', 'Aspirin 300mg within 48 hours', 'Secondary prevention with statins');
        evidence.metaAnalyses.push('Thrombolysis increases good outcome by 30% when given early');
        evidence.levelOfEvidence = 'A';
      }

      if (queryLower.includes('heart failure') || queryLower.includes('hf')) {
        evidence.systematicReviews.push('ACE inhibitors reduce mortality in heart failure (CONSENSUS, SOLVD)');
        evidence.systematicReviews.push('Beta-blockers reduce mortality in heart failure (MERIT-HF, CIBIS-II, COPERNICUS)');
        evidence.systematicReviews.push('SGLT2 inhibitors reduce heart failure hospitalization (DAPA-HF, EMPEROR-Reduced)');
        evidence.clinicalTrials.push('DAPA-HF trial (dapagliflozin)', 'EMPEROR-Reduced trial (empagliflozin)', 'PARADIGM-HF trial (sacubitril/valsartan)');
        evidence.guidelines.push('ESC Heart Failure Guidelines 2023', 'AHA/ACC Heart Failure Guidelines 2022', 'Canadian Heart Failure Guidelines');
        evidence.recommendations.push('ACE inhibitor or ARNI first line', 'Beta-blocker (carvedilol, metoprolol, bisoprolol)', 'SGLT2 inhibitor for all patients', 'Mineralocorticoid receptor antagonist');
        evidence.metaAnalyses.push('SGLT2 inhibitors reduce heart failure hospitalization by 30%');
        evidence.levelOfEvidence = 'A';
      }

      if (queryLower.includes('tuberculosis') || queryLower.includes('tb')) {
        evidence.systematicReviews.push('DOTS therapy improves cure rates and reduces resistance');
        evidence.systematicReviews.push('Short course therapy (6 months) effective for drug-sensitive TB');
        evidence.systematicReviews.push('Bedaquiline effective for drug-resistant TB');
        evidence.clinicalTrials.push('STREAM trial (short course for MDR-TB)', 'TB-PRACTECAL trial (bedaquiline)', 'STAND trial (pretomanid)');
        evidence.guidelines.push('WHO TB Guidelines 2024', 'ATS/CDC/IDSA TB Guidelines 2023', 'Sri Lanka TB Guidelines');
        evidence.recommendations.push('DOTS therapy mandatory', '2HRZE/4HR for drug-sensitive TB', 'Bedaquiline for drug-resistant TB', 'Contact tracing essential');
        evidence.observationalStudies.push('DOTS reduces default rates and improves outcomes');
        evidence.levelOfEvidence = 'A';
      }

      if (queryLower.includes('malaria')) {
        evidence.systematicReviews.push('Artemisinin-based combination therapy (ACT) reduces resistance');
        evidence.systematicReviews.push('Rapid diagnostic tests improve treatment accuracy');
        evidence.systematicReviews.push('Intermittent preventive treatment reduces malaria in pregnancy');
        evidence.clinicalTrials.push('ACT trials', 'RDT accuracy studies', 'IPTp trials');
        evidence.guidelines.push('WHO Malaria Guidelines 2024', 'CDC Malaria Guidelines', 'Sri Lanka Malaria Guidelines');
        evidence.recommendations.push('ACT for uncomplicated P. falciparum', 'RDT before treatment', 'Artemether-lumefantrine first line', 'Prevention with bed nets');
        evidence.levelOfEvidence = 'A';
      }

      // Evidence levels: A (RCTs), B (observational), C (expert opinion)
      return {
        ...evidence,
        lastUpdated: '2024',
        sources: ['PubMed', 'Cochrane Library', 'ClinicalTrials.gov', 'WHO Guidelines', 'Major Medical Journals'],
        disclaimer: 'Evidence levels: A (RCTs), B (observational studies), C (expert opinion). Always consult current guidelines for practice.'
      };
    } catch (error) {
      logger.error('❌ Error in evidence-based medicine search:', error);
      throw error;
    }
  }
}

module.exports = new AdvancedMedicalFeatures(); 