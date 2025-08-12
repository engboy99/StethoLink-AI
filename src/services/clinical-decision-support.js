const { logger, medicalLogger } = require('../utils/logger');
const { AIProcessingError } = require('../middleware/errorHandler');
const advancedAnalytics = require('./advanced-analytics');

class ClinicalDecisionSupportService {
    constructor() {
        this.clinicalGuidelines = {
            cardiovascular: {
                hypertension: {
                    title: 'Hypertension Management Guidelines',
                    source: 'JNC 8 / ACC/AHA 2017',
                    recommendations: [
                        'Lifestyle modifications for all patients',
                        'Pharmacotherapy for BP ≥140/90 mmHg',
                        'First-line agents: ACE inhibitors, ARBs, CCBs, thiazide diuretics',
                        'Target BP <130/80 mmHg for most adults'
                    ],
                    evidence: 'Grade A evidence from multiple RCTs',
                    lastUpdated: '2023-01-15'
                },
                heart_failure: {
                    title: 'Heart Failure Management Guidelines',
                    source: 'ACC/AHA/HFSA 2022',
                    recommendations: [
                        'ACE inhibitors or ARBs for all patients',
                        'Beta-blockers for stable patients',
                        'Mineralocorticoid receptor antagonists',
                        'SGLT2 inhibitors for HFrEF'
                    ],
                    evidence: 'Grade A evidence from landmark trials',
                    lastUpdated: '2023-03-20'
                }
            },
            respiratory: {
                asthma: {
                    title: 'Asthma Management Guidelines',
                    source: 'GINA 2023',
                    recommendations: [
                        'Inhaled corticosteroids as controller therapy',
                        'Short-acting beta-agonists as rescue',
                        'Step-up therapy based on control assessment',
                        'Regular monitoring and education'
                    ],
                    evidence: 'Grade A evidence from systematic reviews',
                    lastUpdated: '2023-02-10'
                },
                copd: {
                    title: 'COPD Management Guidelines',
                    source: 'GOLD 2023',
                    recommendations: [
                        'Bronchodilators for symptom relief',
                        'Inhaled corticosteroids for frequent exacerbations',
                        'Pulmonary rehabilitation',
                        'Smoking cessation support'
                    ],
                    evidence: 'Grade A evidence from clinical trials',
                    lastUpdated: '2023-01-25'
                }
            },
            endocrine: {
                diabetes: {
                    title: 'Diabetes Management Guidelines',
                    source: 'ADA Standards of Care 2023',
                    recommendations: [
                        'Individualized glycemic targets',
                        'Metformin as first-line therapy',
                        'Regular monitoring of HbA1c',
                        'Cardiovascular risk management'
                    ],
                    evidence: 'Grade A evidence from multiple studies',
                    lastUpdated: '2023-04-01'
                }
            }
        };

        this.drugInteractions = {
            warfarin: {
                interactions: [
                    {
                        drug: 'Aspirin',
                        severity: 'moderate',
                        effect: 'Increased bleeding risk',
                        recommendation: 'Monitor INR closely, consider alternative antiplatelet therapy',
                        evidence: 'Multiple case reports and studies'
                    },
                    {
                        drug: 'Amiodarone',
                        severity: 'major',
                        effect: 'Increased warfarin effect',
                        recommendation: 'Reduce warfarin dose by 30-50%, monitor INR frequently',
                        evidence: 'Clinical studies and pharmacokinetic data'
                    }
                ]
            },
            metformin: {
                interactions: [
                    {
                        drug: 'Furosemide',
                        severity: 'moderate',
                        effect: 'May reduce metformin efficacy',
                        recommendation: 'Monitor blood glucose, adjust metformin dose if needed',
                        evidence: 'Pharmacokinetic studies'
                    }
                ]
            }
        };

        this.clinicalScores = {
            chads2: {
                title: 'CHADS2 Score for Atrial Fibrillation',
                description: 'Risk stratification for stroke in atrial fibrillation',
                components: [
                    { factor: 'Congestive heart failure', points: 1 },
                    { factor: 'Hypertension', points: 1 },
                    { factor: 'Age ≥75 years', points: 1 },
                    { factor: 'Diabetes mellitus', points: 1 },
                    { factor: 'Stroke/TIA', points: 2 }
                ],
                interpretation: {
                    '0': 'Low risk (0.5% annual stroke rate)',
                    '1': 'Low risk (1.5% annual stroke rate)',
                    '2': 'Moderate risk (2.5% annual stroke rate)',
                    '3': 'Moderate risk (3.5% annual stroke rate)',
                    '4': 'High risk (4.0% annual stroke rate)',
                    '5': 'High risk (6.0% annual stroke rate)',
                    '6': 'High risk (8.5% annual stroke rate)'
                }
            },
            wells_dvt: {
                title: 'Wells Score for DVT',
                description: 'Clinical probability assessment for deep vein thrombosis',
                components: [
                    { factor: 'Active cancer', points: 1 },
                    { factor: 'Paralysis, paresis, or recent plaster immobilization', points: 1 },
                    { factor: 'Recently bedridden for >3 days or major surgery', points: 1 },
                    { factor: 'Localized tenderness along distribution of deep veins', points: 1 },
                    { factor: 'Entire leg swollen', points: 1 },
                    { factor: 'Calf swelling >3cm compared to asymptomatic leg', points: 1 },
                    { factor: 'Pitting edema in symptomatic leg', points: 1 },
                    { factor: 'Collateral superficial veins', points: 1 },
                    { factor: 'Alternative diagnosis as likely or more likely', points: -2 }
                ],
                interpretation: {
                    '≤0': 'Low probability (3% DVT prevalence)',
                    '1-2': 'Moderate probability (17% DVT prevalence)',
                    '≥3': 'High probability (75% DVT prevalence)'
                }
            }
        };
    }

    // Get clinical decision support
    async getClinicalDecisionSupport(query, context = {}, userId = null) {
        const startTime = Date.now();
        
        try {
            logger.info('🧠 Getting clinical decision support', { query: query.substring(0, 100), userId });

            // Analyze query and context
            const analysis = this.analyzeQuery(query, context);
            
            // Get relevant guidelines
            const guidelines = this.getRelevantGuidelines(analysis);
            
            // Get drug interactions if applicable
            const drugInteractions = this.getDrugInteractions(analysis);
            
            // Get clinical scores if applicable
            const clinicalScores = this.getClinicalScores(analysis);
            
            // Generate recommendations
            const recommendations = this.generateRecommendations(analysis, guidelines, drugInteractions, clinicalScores);
            
            // Track analytics
            if (userId) {
                await advancedAnalytics.trackClinicalDecisionSupport(
                    userId,
                    query.substring(0, 100),
                    analysis.category,
                    Date.now() - startTime
                );
            }

            const duration = Date.now() - startTime;
            
            logger.info('✅ Clinical decision support generated successfully', {
                category: analysis.category,
                duration,
                recommendationsCount: recommendations.length
            });

            return {
                success: true,
                query: query,
                analysis: analysis,
                guidelines: guidelines,
                drugInteractions: drugInteractions,
                clinicalScores: clinicalScores,
                recommendations: recommendations,
                processingTime: duration,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            const duration = Date.now() - startTime;
            
            logger.error('❌ Error getting clinical decision support:', error);
            throw new AIProcessingError(`Clinical decision support failed: ${error.message}`);
        }
    }

    // Analyze query and context
    analyzeQuery(query, context) {
        try {
            const lowerQuery = query.toLowerCase();
            
            // Determine category
            let category = 'general';
            if (lowerQuery.includes('hypertension') || lowerQuery.includes('blood pressure')) {
                category = 'cardiovascular';
            } else if (lowerQuery.includes('asthma') || lowerQuery.includes('copd') || lowerQuery.includes('breathing')) {
                category = 'respiratory';
            } else if (lowerQuery.includes('diabetes') || lowerQuery.includes('blood sugar')) {
                category = 'endocrine';
            } else if (lowerQuery.includes('warfarin') || lowerQuery.includes('drug interaction')) {
                category = 'pharmacology';
            } else if (lowerQuery.includes('chads2') || lowerQuery.includes('stroke risk')) {
                category = 'risk_assessment';
            }

            // Extract key terms
            const keyTerms = this.extractKeyTerms(lowerQuery);
            
            // Determine urgency
            const urgency = this.assessUrgency(lowerQuery, context);
            
            // Determine complexity
            const complexity = this.assessComplexity(query, context);

            return {
                category: category,
                keyTerms: keyTerms,
                urgency: urgency,
                complexity: complexity,
                context: context
            };
        } catch (error) {
            logger.error('❌ Error analyzing query:', error);
            throw new AIProcessingError(`Query analysis failed: ${error.message}`);
        }
    }

    // Extract key terms
    extractKeyTerms(query) {
        const medicalTerms = [
            'hypertension', 'diabetes', 'asthma', 'copd', 'heart failure',
            'warfarin', 'metformin', 'aspirin', 'chads2', 'wells score',
            'stroke', 'dvt', 'pneumonia', 'hypertension', 'diabetes'
        ];

        const foundTerms = [];
        medicalTerms.forEach(term => {
            if (query.includes(term)) {
                foundTerms.push(term);
            }
        });

        return foundTerms;
    }

    // Assess urgency
    assessUrgency(query, context) {
        const urgentKeywords = ['emergency', 'urgent', 'immediate', 'critical', 'severe'];
        const lowerQuery = query.toLowerCase();
        
        if (urgentKeywords.some(keyword => lowerQuery.includes(keyword))) {
            return 'urgent';
        }
        
        if (context.urgent || context.emergency) {
            return 'urgent';
        }
        
        return 'routine';
    }

    // Assess complexity
    assessComplexity(query, context) {
        const complexKeywords = ['complex', 'complicated', 'multiple', 'advanced', 'difficult'];
        const lowerQuery = query.toLowerCase();
        
        if (complexKeywords.some(keyword => lowerQuery.includes(keyword))) {
            return 'complex';
        }
        
        if (context.complexity === 'high' || context.multipleConditions) {
            return 'complex';
        }
        
        return 'standard';
    }

    // Get relevant guidelines
    getRelevantGuidelines(analysis) {
        try {
            const guidelines = [];
            
            if (analysis.category === 'cardiovascular') {
                guidelines.push(
                    this.clinicalGuidelines.cardiovascular.hypertension,
                    this.clinicalGuidelines.cardiovascular.heart_failure
                );
            } else if (analysis.category === 'respiratory') {
                guidelines.push(
                    this.clinicalGuidelines.respiratory.asthma,
                    this.clinicalGuidelines.respiratory.copd
                );
            } else if (analysis.category === 'endocrine') {
                guidelines.push(
                    this.clinicalGuidelines.endocrine.diabetes
                );
            }

            // Filter by relevance to key terms
            const relevantGuidelines = guidelines.filter(guideline => {
                return analysis.keyTerms.some(term => 
                    guideline.title.toLowerCase().includes(term) ||
                    guideline.recommendations.some(rec => rec.toLowerCase().includes(term))
                );
            });

            return relevantGuidelines;
        } catch (error) {
            logger.error('❌ Error getting relevant guidelines:', error);
            return [];
        }
    }

    // Get drug interactions
    getDrugInteractions(analysis) {
        try {
            const interactions = [];
            
            // Check for drug mentions in query
            Object.keys(this.drugInteractions).forEach(drug => {
                if (analysis.keyTerms.includes(drug)) {
                    interactions.push({
                        drug: drug,
                        interactions: this.drugInteractions[drug].interactions
                    });
                }
            });

            return interactions;
        } catch (error) {
            logger.error('❌ Error getting drug interactions:', error);
            return [];
        }
    }

    // Get clinical scores
    getClinicalScores(analysis) {
        try {
            const scores = [];
            
            // Check for score mentions in query
            Object.keys(this.clinicalScores).forEach(score => {
                if (analysis.keyTerms.includes(score)) {
                    scores.push({
                        name: score,
                        ...this.clinicalScores[score]
                    });
                }
            });

            return scores;
        } catch (error) {
            logger.error('❌ Error getting clinical scores:', error);
            return [];
        }
    }

    // Generate recommendations
    generateRecommendations(analysis, guidelines, drugInteractions, clinicalScores) {
        try {
            const recommendations = [];

            // Add guideline-based recommendations
            guidelines.forEach(guideline => {
                recommendations.push({
                    type: 'guideline',
                    source: guideline.source,
                    title: guideline.title,
                    recommendations: guideline.recommendations,
                    evidence: guideline.evidence,
                    priority: 'high'
                });
            });

            // Add drug interaction recommendations
            drugInteractions.forEach(drug => {
                drug.interactions.forEach(interaction => {
                    recommendations.push({
                        type: 'drug_interaction',
                        source: 'Drug interaction database',
                        title: `${drug.drug} - ${interaction.drug} Interaction`,
                        recommendations: [interaction.recommendation],
                        evidence: interaction.evidence,
                        priority: interaction.severity === 'major' ? 'high' : 'medium'
                    });
                });
            });

            // Add clinical score recommendations
            clinicalScores.forEach(score => {
                recommendations.push({
                    type: 'clinical_score',
                    source: 'Evidence-based scoring system',
                    title: `Use ${score.title}`,
                    recommendations: [
                        `Calculate ${score.title} for risk stratification`,
                        `Use score to guide treatment decisions`,
                        `Document score in patient record`
                    ],
                    evidence: 'Validated in multiple studies',
                    priority: 'medium'
                });
            });

            // Add general recommendations based on analysis
            if (analysis.urgency === 'urgent') {
                recommendations.push({
                    type: 'urgency',
                    source: 'Clinical assessment',
                    title: 'Urgent Care Required',
                    recommendations: [
                        'Immediate clinical evaluation recommended',
                        'Consider emergency department referral',
                        'Monitor patient closely'
                    ],
                    evidence: 'Clinical judgment based on urgency indicators',
                    priority: 'critical'
                });
            }

            if (analysis.complexity === 'complex') {
                recommendations.push({
                    type: 'complexity',
                    source: 'Clinical assessment',
                    title: 'Complex Case Management',
                    recommendations: [
                        'Consider specialist consultation',
                        'Multidisciplinary team approach',
                        'Comprehensive care planning'
                    ],
                    evidence: 'Clinical judgment based on complexity assessment',
                    priority: 'high'
                });
            }

            // Sort by priority
            const priorityOrder = { 'critical': 1, 'high': 2, 'medium': 3, 'low': 4 };
            recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

            return recommendations;
        } catch (error) {
            logger.error('❌ Error generating recommendations:', error);
            return [];
        }
    }

    // Calculate clinical score
    async calculateClinicalScore(scoreName, parameters, userId = null) {
        try {
            logger.info('📊 Calculating clinical score', { scoreName, parameters, userId });

            if (!this.clinicalScores[scoreName]) {
                throw new AIProcessingError(`Clinical score not found: ${scoreName}`);
            }

            const score = this.clinicalScores[scoreName];
            let totalScore = 0;
            const appliedFactors = [];

            // Calculate score based on parameters
            score.components.forEach(component => {
                if (parameters[component.factor] || parameters[component.factor.toLowerCase()]) {
                    totalScore += component.points;
                    appliedFactors.push({
                        factor: component.factor,
                        points: component.points,
                        present: true
                    });
                } else {
                    appliedFactors.push({
                        factor: component.factor,
                        points: component.points,
                        present: false
                    });
                }
            });

            // Get interpretation
            const interpretation = this.getScoreInterpretation(scoreName, totalScore);

            // Track analytics
            if (userId) {
                await advancedAnalytics.trackClinicalScoreCalculation(
                    userId,
                    scoreName,
                    totalScore,
                    interpretation.risk
                );
            }

            logger.info('✅ Clinical score calculated successfully', { 
                scoreName, 
                totalScore, 
                risk: interpretation.risk 
            });

            return {
                success: true,
                scoreName: scoreName,
                title: score.title,
                description: score.description,
                totalScore: totalScore,
                appliedFactors: appliedFactors,
                interpretation: interpretation,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            logger.error('❌ Error calculating clinical score:', error);
            throw new AIProcessingError(`Score calculation failed: ${error.message}`);
        }
    }

    // Get score interpretation
    getScoreInterpretation(scoreName, totalScore) {
        const score = this.clinicalScores[scoreName];
        
        if (!score.interpretation) {
            return { risk: 'unknown', description: 'Interpretation not available' };
        }

        // Find the appropriate interpretation
        let risk = 'unknown';
        let description = '';

        if (scoreName === 'chads2') {
            if (totalScore === 0) risk = 'low';
            else if (totalScore === 1) risk = 'low';
            else if (totalScore === 2) risk = 'moderate';
            else if (totalScore === 3) risk = 'moderate';
            else if (totalScore >= 4) risk = 'high';
        } else if (scoreName === 'wells_dvt') {
            if (totalScore <= 0) risk = 'low';
            else if (totalScore <= 2) risk = 'moderate';
            else if (totalScore >= 3) risk = 'high';
        }

        description = score.interpretation[totalScore] || 'Score interpretation not available';

        return { risk, description };
    }

    // Check drug interactions
    async checkDrugInteractions(medications, userId = null) {
        try {
            logger.info('💊 Checking drug interactions', { medications, userId });

            const interactions = [];
            const warnings = [];

            // Check for known interactions
            for (let i = 0; i < medications.length; i++) {
                for (let j = i + 1; j < medications.length; j++) {
                    const drug1 = medications[i];
                    const drug2 = medications[j];

                    // Check if either drug has known interactions
                    if (this.drugInteractions[drug1]) {
                        const drug1Interactions = this.drugInteractions[drug1].interactions;
                        const interaction = drug1Interactions.find(int => 
                            int.drug.toLowerCase() === drug2.toLowerCase()
                        );

                        if (interaction) {
                            interactions.push({
                                drugs: [drug1, drug2],
                                severity: interaction.severity,
                                effect: interaction.effect,
                                recommendation: interaction.recommendation,
                                evidence: interaction.evidence
                            });

                            if (interaction.severity === 'major') {
                                warnings.push({
                                    type: 'major_interaction',
                                    message: `Major interaction between ${drug1} and ${drug2}`,
                                    recommendation: interaction.recommendation
                                });
                            }
                        }
                    }
                }
            }

            // Check for contraindications
            const contraindications = this.checkContraindications(medications);

            // Track analytics
            if (userId) {
                await advancedAnalytics.trackDrugInteractionCheck(
                    userId,
                    medications,
                    interactions.length,
                    warnings.length
                );
            }

            logger.info('✅ Drug interaction check completed', { 
                medicationsCount: medications.length,
                interactionsCount: interactions.length,
                warningsCount: warnings.length 
            });

            return {
                success: true,
                medications: medications,
                interactions: interactions,
                warnings: warnings,
                contraindications: contraindications,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            logger.error('❌ Error checking drug interactions:', error);
            throw new AIProcessingError(`Drug interaction check failed: ${error.message}`);
        }
    }

    // Check contraindications
    checkContraindications(medications) {
        const contraindications = [];

        // Example contraindications
        const knownContraindications = {
            'warfarin': ['pregnancy', 'active_bleeding', 'severe_liver_disease'],
            'metformin': ['severe_kidney_disease', 'metabolic_acidosis'],
            'aspirin': ['active_peptic_ulcer', 'severe_liver_disease', 'bleeding_disorders']
        };

        medications.forEach(medication => {
            if (knownContraindications[medication.toLowerCase()]) {
                contraindications.push({
                    medication: medication,
                    contraindications: knownContraindications[medication.toLowerCase()]
                });
            }
        });

        return contraindications;
    }

    // Get evidence-based recommendations
    async getEvidenceBasedRecommendations(condition, context = {}, userId = null) {
        try {
            logger.info('📚 Getting evidence-based recommendations', { condition, userId });

            // Search for relevant guidelines
            const guidelines = this.searchGuidelines(condition);
            
            // Get latest evidence
            const evidence = await this.getLatestEvidence(condition);
            
            // Generate recommendations
            const recommendations = this.generateEvidenceBasedRecommendations(guidelines, evidence, context);

            // Track analytics
            if (userId) {
                await advancedAnalytics.trackEvidenceBasedRecommendations(
                    userId,
                    condition,
                    recommendations.length
                );
            }

            logger.info('✅ Evidence-based recommendations generated', { 
                condition, 
                recommendationsCount: recommendations.length 
            });

            return {
                success: true,
                condition: condition,
                guidelines: guidelines,
                evidence: evidence,
                recommendations: recommendations,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            logger.error('❌ Error getting evidence-based recommendations:', error);
            throw new AIProcessingError(`Evidence-based recommendations failed: ${error.message}`);
        }
    }

    // Search guidelines
    searchGuidelines(condition) {
        const results = [];
        const lowerCondition = condition.toLowerCase();

        Object.values(this.clinicalGuidelines).forEach(specialty => {
            Object.values(specialty).forEach(guideline => {
                if (guideline.title.toLowerCase().includes(lowerCondition) ||
                    guideline.recommendations.some(rec => rec.toLowerCase().includes(lowerCondition))) {
                    results.push(guideline);
                }
            });
        });

        return results;
    }

    // Get latest evidence (simulated)
    async getLatestEvidence(condition) {
        // Simulate API call to evidence database
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        return [
            {
                type: 'systematic_review',
                title: `Recent systematic review on ${condition}`,
                source: 'Cochrane Database',
                year: 2023,
                conclusion: 'Evidence supports current treatment recommendations',
                quality: 'high'
            },
            {
                type: 'randomized_trial',
                title: `New RCT on ${condition} management`,
                source: 'New England Journal of Medicine',
                year: 2023,
                conclusion: 'Novel treatment approach shows promise',
                quality: 'high'
            }
        ];
    }

    // Generate evidence-based recommendations
    generateEvidenceBasedRecommendations(guidelines, evidence, context) {
        const recommendations = [];

        // Add guideline recommendations
        guidelines.forEach(guideline => {
            recommendations.push({
                type: 'guideline',
                source: guideline.source,
                strength: 'strong',
                recommendations: guideline.recommendations,
                evidence: guideline.evidence
            });
        });

        // Add evidence-based recommendations
        evidence.forEach(study => {
            recommendations.push({
                type: 'evidence',
                source: study.source,
                strength: study.quality === 'high' ? 'moderate' : 'weak',
                recommendations: [
                    `Consider findings from ${study.title}`,
                    'Evaluate applicability to individual patient',
                    'Monitor for emerging evidence'
                ],
                evidence: `${study.type} published in ${study.year}`
            });
        });

        return recommendations;
    }

    // Get available clinical scores
    getAvailableClinicalScores() {
        return Object.keys(this.clinicalScores).map(scoreName => ({
            name: scoreName,
            ...this.clinicalScores[scoreName]
        }));
    }

    // Get available guidelines
    getAvailableGuidelines() {
        const guidelines = [];
        
        Object.entries(this.clinicalGuidelines).forEach(([specialty, conditions]) => {
            Object.entries(conditions).forEach(([condition, guideline]) => {
                guidelines.push({
                    specialty: specialty,
                    condition: condition,
                    ...guideline
                });
            });
        });

        return guidelines;
    }

    // Get service capabilities
    getServiceCapabilities() {
        return {
            clinicalGuidelines: Object.keys(this.clinicalGuidelines),
            drugInteractions: Object.keys(this.drugInteractions),
            clinicalScores: Object.keys(this.clinicalScores),
            supportedCategories: ['cardiovascular', 'respiratory', 'endocrine', 'pharmacology', 'risk_assessment'],
            features: [
                'Evidence-based clinical guidelines',
                'Drug interaction checking',
                'Clinical risk scoring',
                'Evidence-based recommendations',
                'Contraindication checking'
            ]
        };
    }
}

module.exports = new ClinicalDecisionSupportService(); 