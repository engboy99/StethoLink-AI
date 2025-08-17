const { logger, medicalLogger } = require('../utils/logger');
const { AIProcessingError } = require('../middleware/errorHandler');
const advancedAnalytics = require('./advanced-analytics');

class AdvancedSimulationsService {
    constructor() {
        this.simulationTypes = {
            emergency: ['cardiac_arrest', 'stroke', 'trauma', 'respiratory_failure', 'septic_shock'],
            medical: ['diabetes', 'hypertension', 'pneumonia', 'heart_failure', 'renal_failure'],
            surgical: ['appendicitis', 'cholecystitis', 'bowel_obstruction', 'hernia', 'fracture'],
            pediatric: ['fever', 'dehydration', 'asthma', 'seizure', 'poisoning'],
            obstetric: ['preeclampsia', 'hemorrhage', 'fetal_distress', 'labor_complications']
        };
        
        this.difficultyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
        this.specialties = ['emergency', 'internal_medicine', 'surgery', 'pediatrics', 'obstetrics', 'psychiatry'];
        
        // Initialize simulation scenarios
        this.initializeSimulationScenarios();
    }

    // Initialize simulation scenarios
    initializeSimulationScenarios() {
        this.scenarios = {
            cardiac_arrest: {
                title: 'Cardiac Arrest Simulation',
                difficulty: 'advanced',
                specialty: 'emergency',
                duration: 15,
                description: 'Manage a patient in cardiac arrest with realistic time pressure and clinical decisions',
                objectives: [
                    'Recognize cardiac arrest',
                    'Initiate CPR immediately',
                    'Apply appropriate defibrillation',
                    'Manage airway and ventilation',
                    'Coordinate team response'
                ],
                patientProfile: {
                    age: 65,
                    gender: 'male',
                    presentingCondition: 'Unresponsive, no pulse, no breathing',
                    vitalSigns: {
                        bloodPressure: '0/0',
                        heartRate: 0,
                        respiratoryRate: 0,
                        temperature: '36.5°C',
                        oxygenSaturation: 0
                    },
                    history: 'Known coronary artery disease, previous MI',
                    medications: ['Aspirin', 'Metoprolol', 'Atorvastatin']
                }
            },
            stroke: {
                title: 'Acute Ischemic Stroke Simulation',
                difficulty: 'advanced',
                specialty: 'neurology',
                duration: 20,
                description: 'Manage acute stroke with time-critical decisions and thrombolytic therapy',
                objectives: [
                    'Recognize stroke symptoms',
                    'Perform NIHSS assessment',
                    'Order appropriate imaging',
                    'Determine thrombolytic eligibility',
                    'Coordinate with stroke team'
                ],
                patientProfile: {
                    age: 72,
                    gender: 'female',
                    presentingCondition: 'Sudden onset right-sided weakness and aphasia',
                    vitalSigns: {
                        bloodPressure: '180/95',
                        heartRate: 88,
                        respiratoryRate: 18,
                        temperature: '37.0°C',
                        oxygenSaturation: 96
                    },
                    history: 'Hypertension, atrial fibrillation',
                    medications: ['Warfarin', 'Lisinopril', 'Metoprolol']
                }
            },
            diabetes: {
                title: 'Diabetic Ketoacidosis Simulation',
                difficulty: 'intermediate',
                specialty: 'internal_medicine',
                duration: 25,
                description: 'Manage DKA with fluid resuscitation, insulin therapy, and electrolyte monitoring',
                objectives: [
                    'Recognize DKA symptoms',
                    'Assess severity and complications',
                    'Initiate fluid resuscitation',
                    'Manage insulin therapy',
                    'Monitor electrolytes and glucose'
                ],
                patientProfile: {
                    age: 28,
                    gender: 'male',
                    presentingCondition: 'Polyuria, polydipsia, nausea, abdominal pain',
                    vitalSigns: {
                        bloodPressure: '90/60',
                        heartRate: 110,
                        respiratoryRate: 24,
                        temperature: '37.2°C',
                        oxygenSaturation: 98
                    },
                    history: 'Type 1 diabetes, poor compliance',
                    medications: ['Insulin glargine', 'Insulin aspart']
                }
            }
        };
    }

    // Start advanced simulation
    async startAdvancedSimulation(simulationType, difficulty, userId = null) {
        try {
            logger.info('🎯 Starting advanced simulation', { simulationType, difficulty, userId });

            // Validate simulation type
            if (!this.isValidSimulationType(simulationType)) {
                throw new AIProcessingError(`Invalid simulation type: ${simulationType}`);
            }

            // Get or create simulation scenario
            const scenario = await this.getSimulationScenario(simulationType, difficulty);
            
            // Initialize simulation session
            const session = this.initializeSimulationSession(scenario, userId);
            
            // Track analytics
            if (userId) {
                await advancedAnalytics.trackSimulationStart(
                    userId,
                    simulationType,
                    difficulty,
                    scenario.title
                );
            }

            logger.info('✅ Advanced simulation started successfully', { 
                simulationType, 
                difficulty, 
                sessionId: session.sessionId 
            });

            return {
                success: true,
                session: session,
                scenario: scenario,
                instructions: this.getSimulationInstructions(scenario)
            };

        } catch (error) {
            logger.error('❌ Error starting advanced simulation:', error);
            throw new AIProcessingError(`Failed to start simulation: ${error.message}`);
        }
    }

    // Validate simulation type
    isValidSimulationType(simulationType) {
        return Object.values(this.simulationTypes).flat().includes(simulationType);
    }

    // Get simulation scenario
    async getSimulationScenario(simulationType, difficulty) {
        // Check if we have a predefined scenario
        if (this.scenarios[simulationType]) {
            return this.scenarios[simulationType];
        }

        // Generate dynamic scenario based on type and difficulty
        return await this.generateDynamicScenario(simulationType, difficulty);
    }

    // Generate dynamic scenario
    async generateDynamicScenario(simulationType, difficulty) {
        try {
            logger.info('🔄 Generating dynamic simulation scenario', { simulationType, difficulty });

            // Simulate AI-generated scenario
            const scenario = await this.simulateAIScenarioGeneration(simulationType, difficulty);
            
            logger.info('✅ Dynamic scenario generated', { simulationType, difficulty });
            return scenario;
        } catch (error) {
            logger.error('❌ Error generating dynamic scenario:', error);
            throw new AIProcessingError(`Scenario generation failed: ${error.message}`);
        }
    }

    // Simulate AI scenario generation
    async simulateAIScenarioGeneration(simulationType, difficulty) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const baseScenarios = {
            emergency: {
                title: `${simulationType.replace('_', ' ').toUpperCase()} Emergency Simulation`,
                difficulty: difficulty,
                specialty: 'emergency',
                duration: 15 + Math.floor(Math.random() * 10),
                description: `Manage a complex ${simulationType.replace('_', ' ')} emergency with realistic clinical challenges`,
                objectives: this.generateObjectives(simulationType, difficulty),
                patientProfile: this.generatePatientProfile(simulationType, difficulty)
            },
            medical: {
                title: `${simulationType.replace('_', ' ').toUpperCase()} Medical Case Simulation`,
                difficulty: difficulty,
                specialty: 'internal_medicine',
                duration: 20 + Math.floor(Math.random() * 15),
                description: `Comprehensive management of ${simulationType.replace('_', ' ')} with multiple complications`,
                objectives: this.generateObjectives(simulationType, difficulty),
                patientProfile: this.generatePatientProfile(simulationType, difficulty)
            },
            surgical: {
                title: `${simulationType.replace('_', ' ').toUpperCase()} Surgical Case Simulation`,
                difficulty: difficulty,
                specialty: 'surgery',
                duration: 25 + Math.floor(Math.random() * 20),
                description: `Preoperative, operative, and postoperative management of ${simulationType.replace('_', ' ')}`,
                objectives: this.generateObjectives(simulationType, difficulty),
                patientProfile: this.generatePatientProfile(simulationType, difficulty)
            }
        };

        const category = this.getSimulationCategory(simulationType);
        return baseScenarios[category] || baseScenarios.medical;
    }

    // Get simulation category
    getSimulationCategory(simulationType) {
        for (const [category, types] of Object.entries(this.simulationTypes)) {
            if (types.includes(simulationType)) {
                return category;
            }
        }
        return 'medical';
    }

    // Generate objectives
    generateObjectives(simulationType, difficulty) {
        const baseObjectives = [
            'Assess patient condition',
            'Formulate differential diagnosis',
            'Order appropriate investigations',
            'Initiate treatment plan',
            'Monitor patient response'
        ];

        const advancedObjectives = [
            'Manage complications',
            'Coordinate multidisciplinary care',
            'Make critical decisions under pressure',
            'Handle ethical dilemmas',
            'Document clinical reasoning'
        ];

        const objectives = [...baseObjectives];
        
        if (difficulty === 'advanced' || difficulty === 'expert') {
            objectives.push(...advancedObjectives);
        }

        return objectives;
    }

    // Generate patient profile
    generatePatientProfile(simulationType, difficulty) {
        const age = 25 + Math.floor(Math.random() * 60);
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        
        const profile = {
            age: age,
            gender: gender,
            presentingCondition: this.generatePresentingCondition(simulationType),
            vitalSigns: this.generateVitalSigns(simulationType, difficulty),
            history: this.generateMedicalHistory(simulationType, age),
            medications: this.generateMedications(simulationType, age)
        };

        return profile;
    }

    // Generate presenting condition
    generatePresentingCondition(simulationType) {
        const conditions = {
            cardiac_arrest: 'Unresponsive, no pulse, no breathing',
            stroke: 'Sudden onset neurological symptoms',
            trauma: 'Multiple injuries from accident',
            respiratory_failure: 'Severe shortness of breath',
            septic_shock: 'Fever, hypotension, altered mental status',
            diabetes: 'Polyuria, polydipsia, weight loss',
            hypertension: 'Headache, chest pain, vision changes',
            pneumonia: 'Cough, fever, chest pain',
            appendicitis: 'Right lower quadrant pain',
            fracture: 'Pain, swelling, deformity'
        };

        return conditions[simulationType] || 'Acute medical condition requiring immediate attention';
    }

    // Generate vital signs
    generateVitalSigns(simulationType, difficulty) {
        const baseVitals = {
            bloodPressure: '120/80',
            heartRate: 80,
            respiratoryRate: 18,
            temperature: '37.0°C',
            oxygenSaturation: 98
        };

        // Modify based on simulation type and difficulty
        if (simulationType.includes('cardiac') || simulationType.includes('shock')) {
            baseVitals.bloodPressure = '80/50';
            baseVitals.heartRate = 120;
            baseVitals.oxygenSaturation = 85;
        }

        if (simulationType.includes('respiratory')) {
            baseVitals.respiratoryRate = 28;
            baseVitals.oxygenSaturation = 88;
        }

        if (difficulty === 'advanced' || difficulty === 'expert') {
            // Add more complex vital sign variations
            baseVitals.bloodPressure = this.generateComplexBloodPressure(simulationType);
        }

        return baseVitals;
    }

    // Generate complex blood pressure
    generateComplexBloodPressure(simulationType) {
        const pressures = {
            cardiac_arrest: '0/0',
            septic_shock: '70/40',
            stroke: '180/95',
            trauma: '90/60',
            normal: '120/80'
        };

        return pressures[simulationType] || '120/80';
    }

    // Generate medical history
    generateMedicalHistory(simulationType, age) {
        const histories = {
            cardiac_arrest: 'Coronary artery disease, previous MI, hypertension',
            stroke: 'Hypertension, atrial fibrillation, diabetes',
            diabetes: 'Type 2 diabetes, obesity, hypertension',
            trauma: 'No significant medical history',
            pneumonia: 'COPD, smoking history, recent surgery'
        };

        return histories[simulationType] || 'Generally healthy with no significant medical history';
    }

    // Generate medications
    generateMedications(simulationType, age) {
        const medications = {
            cardiac_arrest: ['Aspirin', 'Metoprolol', 'Atorvastatin'],
            stroke: ['Warfarin', 'Lisinopril', 'Metoprolol'],
            diabetes: ['Metformin', 'Insulin', 'Lisinopril'],
            hypertension: ['Amlodipine', 'Lisinopril', 'Hydrochlorothiazide'],
            pneumonia: ['Albuterol', 'Prednisone', 'Azithromycin']
        };

        return medications[simulationType] || ['No current medications'];
    }

    // Initialize simulation session
    initializeSimulationSession(scenario, userId) {
        const session = {
            sessionId: this.generateSessionId(),
            userId: userId,
            scenario: scenario,
            startTime: new Date().toISOString(),
            currentStep: 0,
            totalSteps: this.calculateTotalSteps(scenario),
            actions: [],
            decisions: [],
            outcomes: [],
            score: 0,
            maxScore: this.calculateMaxScore(scenario),
            status: 'active',
            timeRemaining: scenario.duration * 60 // Convert to seconds
        };

        return session;
    }

    // Generate session ID
    generateSessionId() {
        return `sim_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    // Calculate total steps
    calculateTotalSteps(scenario) {
        return scenario.objectives.length + 5; // Base steps + additional clinical decisions
    }

    // Calculate max score
    calculateMaxScore(scenario) {
        return scenario.objectives.length * 10 + 50; // 10 points per objective + bonus
    }

    // Get simulation instructions
    getSimulationInstructions(scenario) {
        return {
            overview: scenario.description,
            objectives: scenario.objectives,
            timeLimit: `${scenario.duration} minutes`,
            scoring: 'Points awarded for correct decisions and timely actions',
            tips: [
                'Read the scenario carefully before starting',
                'Think through your decisions systematically',
                'Consider the patient\'s history and risk factors',
                'Prioritize patient safety and evidence-based care',
                'Document your reasoning for each decision'
            ]
        };
    }

    // Process simulation action
    async processSimulationAction(sessionId, action, userId = null) {
        try {
            logger.info('🎯 Processing simulation action', { sessionId, action: action.type, userId });

            // Get session
            const session = this.getActiveSession(sessionId);
            if (!session) {
                throw new AIProcessingError('Simulation session not found');
            }

            // Validate action
            const validation = this.validateAction(action, session);
            if (!validation.valid) {
                throw new AIProcessingError(`Action validation failed: ${validation.error}`);
            }

            // Process action
            const result = await this.executeAction(action, session);
            
            // Update session
            this.updateSession(session, action, result);
            
            // Track analytics
            if (userId) {
                await advancedAnalytics.trackSimulationAction(
                    userId,
                    session.scenario.title,
                    action.type,
                    result.score,
                    result.outcome
                );
            }

            logger.info('✅ Simulation action processed successfully', { 
                sessionId, 
                actionType: action.type,
                score: result.score 
            });

            return {
                success: true,
                result: result,
                session: session,
                nextStep: this.getNextStep(session)
            };

        } catch (error) {
            logger.error('❌ Error processing simulation action:', error);
            throw new AIProcessingError(`Action processing failed: ${error.message}`);
        }
    }

    // Get active session (placeholder - in real implementation, store in database)
    getActiveSession(sessionId) {
        // This would typically query a database
        // For now, return a mock session
        return {
            sessionId: sessionId,
            status: 'active',
            currentStep: 1,
            score: 0
        };
    }

    // Validate action
    validateAction(action, session) {
        if (!action.type) {
            return { valid: false, error: 'Action type is required' };
        }

        if (!action.data) {
            return { valid: false, error: 'Action data is required' };
        }

        if (session.status !== 'active') {
            return { valid: false, error: 'Simulation session is not active' };
        }

        return { valid: true };
    }

    // Execute action
    async executeAction(action, session) {
        try {
            logger.info('⚡ Executing simulation action', { actionType: action.type });

            // Simulate action execution
            const result = await this.simulateActionExecution(action, session);
            
            logger.info('✅ Action execution completed', { 
                actionType: action.type,
                score: result.score 
            });

            return result;
        } catch (error) {
            logger.error('❌ Error executing action:', error);
            throw new AIProcessingError(`Action execution failed: ${error.message}`);
        }
    }

    // Simulate action execution
    async simulateActionExecution(action, session) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        const actionResults = {
            assess_patient: {
                score: 10,
                outcome: 'Patient assessment completed successfully',
                feedback: 'Good systematic approach to patient evaluation',
                nextActions: ['order_tests', 'formulate_diagnosis']
            },
            order_tests: {
                score: 8,
                outcome: 'Appropriate diagnostic tests ordered',
                feedback: 'Tests selected based on clinical presentation',
                nextActions: ['interpret_results', 'initiate_treatment']
            },
            initiate_treatment: {
                score: 12,
                outcome: 'Treatment plan initiated',
                feedback: 'Evidence-based treatment approach',
                nextActions: ['monitor_response', 'adjust_treatment']
            },
            make_decision: {
                score: 15,
                outcome: 'Clinical decision made',
                feedback: 'Decision based on available evidence and clinical judgment',
                nextActions: ['document_reasoning', 'implement_decision']
            }
        };

        const result = actionResults[action.type] || {
            score: 5,
            outcome: 'Action completed',
            feedback: 'Standard action execution',
            nextActions: ['continue_simulation']
        };

        // Add some randomness to scoring
        result.score += Math.floor(Math.random() * 3) - 1; // ±1 point variation
        result.score = Math.max(0, result.score); // Ensure non-negative

        return result;
    }

    // Update session
    updateSession(session, action, result) {
        session.actions.push({
            type: action.type,
            data: action.data,
            timestamp: new Date().toISOString(),
            score: result.score,
            outcome: result.outcome
        });

        session.score += result.score;
        session.currentStep++;

        // Check if simulation is complete
        if (session.currentStep >= session.totalSteps) {
            session.status = 'completed';
            session.endTime = new Date().toISOString();
        }
    }

    // Get next step
    getNextStep(session) {
        if (session.status === 'completed') {
            return {
                type: 'completion',
                description: 'Simulation completed successfully',
                actions: ['view_results', 'review_performance', 'start_new_simulation']
            };
        }

        const nextSteps = [
            {
                type: 'assessment',
                description: 'Continue patient assessment',
                actions: ['examine_patient', 'review_vitals', 'assess_symptoms']
            },
            {
                type: 'diagnosis',
                description: 'Formulate differential diagnosis',
                actions: ['consider_diagnoses', 'order_tests', 'consult_specialist']
            },
            {
                type: 'treatment',
                description: 'Initiate treatment plan',
                actions: ['prescribe_medication', 'order_procedures', 'monitor_response']
            }
        ];

        return nextSteps[session.currentStep % nextSteps.length];
    }

    // Complete simulation
    async completeSimulation(sessionId, userId = null) {
        try {
            logger.info('🏁 Completing simulation', { sessionId, userId });

            // Get session
            const session = this.getActiveSession(sessionId);
            if (!session) {
                throw new AIProcessingError('Simulation session not found');
            }

            // Calculate final score and performance
            const performance = this.calculatePerformance(session);
            
            // Generate completion report
            const report = this.generateCompletionReport(session, performance);
            
            // Track analytics
            if (userId) {
                await advancedAnalytics.trackSimulationCompletion(
                    userId,
                    session.scenario.title,
                    performance.score,
                    performance.percentage,
                    performance.duration
                );
            }

            logger.info('✅ Simulation completed successfully', { 
                sessionId, 
                finalScore: performance.score,
                percentage: performance.percentage 
            });

            return {
                success: true,
                performance: performance,
                report: report,
                recommendations: this.generateRecommendations(performance)
            };

        } catch (error) {
            logger.error('❌ Error completing simulation:', error);
            throw new AIProcessingError(`Simulation completion failed: ${error.message}`);
        }
    }

    // Calculate performance
    calculatePerformance(session) {
        const duration = session.endTime ? 
            new Date(session.endTime) - new Date(session.startTime) : 0;
        
        const percentage = Math.round((session.score / session.maxScore) * 100);
        
        let grade = 'F';
        if (percentage >= 90) grade = 'A';
        else if (percentage >= 80) grade = 'B';
        else if (percentage >= 70) grade = 'C';
        else if (percentage >= 60) grade = 'D';

        return {
            score: session.score,
            maxScore: session.maxScore,
            percentage: percentage,
            grade: grade,
            duration: duration,
            actions: session.actions.length,
            decisions: session.decisions.length
        };
    }

    // Generate completion report
    generateCompletionReport(session, performance) {
        return {
            summary: `Simulation completed with ${performance.percentage}% score (${performance.grade})`,
            details: {
                totalActions: performance.actions,
                totalDecisions: performance.decisions,
                timeSpent: `${Math.round(performance.duration / 1000 / 60)} minutes`,
                objectivesMet: this.calculateObjectivesMet(session),
                areasForImprovement: this.identifyImprovementAreas(performance)
            },
            feedback: this.generateDetailedFeedback(session, performance)
        };
    }

    // Calculate objectives met
    calculateObjectivesMet(session) {
        // This would analyze actions against objectives
        return Math.floor(Math.random() * 3) + 2; // Mock calculation
    }

    // Identify improvement areas
    identifyImprovementAreas(performance) {
        const areas = [];
        
        if (performance.percentage < 80) {
            areas.push('Clinical decision making');
        }
        
        if (performance.percentage < 70) {
            areas.push('Patient assessment skills');
        }
        
        if (performance.percentage < 60) {
            areas.push('Treatment planning');
        }

        return areas;
    }

    // Generate detailed feedback
    generateDetailedFeedback(session, performance) {
        const feedback = {
            strengths: this.identifyStrengths(session, performance),
            weaknesses: this.identifyWeaknesses(session, performance),
            suggestions: this.generateSuggestions(performance),
            resources: this.recommendResources(performance)
        };

        return feedback;
    }

    // Identify strengths
    identifyStrengths(session, performance) {
        const strengths = [];
        
        if (performance.percentage >= 80) {
            strengths.push('Strong clinical reasoning');
        }
        
        if (performance.actions > 5) {
            strengths.push('Comprehensive patient management');
        }
        
        if (performance.decisions > 3) {
            strengths.push('Good decision-making process');
        }

        return strengths;
    }

    // Identify weaknesses
    identifyWeaknesses(session, performance) {
        const weaknesses = [];
        
        if (performance.percentage < 70) {
            weaknesses.push('Clinical decision making needs improvement');
        }
        
        if (performance.actions < 3) {
            weaknesses.push('Limited patient interaction');
        }

        return weaknesses;
    }

    // Generate suggestions
    generateSuggestions(performance) {
        const suggestions = [];
        
        if (performance.percentage < 80) {
            suggestions.push('Review clinical guidelines for this condition');
            suggestions.push('Practice similar case scenarios');
            suggestions.push('Seek feedback from experienced clinicians');
        }
        
        if (performance.percentage >= 80) {
            suggestions.push('Challenge yourself with more complex scenarios');
            suggestions.push('Mentor other learners');
            suggestions.push('Explore advanced clinical topics');
        }

        return suggestions;
    }

    // Recommend resources
    recommendResources(performance) {
        const resources = [
            'Clinical practice guidelines',
            'Evidence-based medicine resources',
            'Medical simulation training',
            'Peer-reviewed journals',
            'Continuing medical education courses'
        ];

        if (performance.percentage < 70) {
            resources.unshift('Basic clinical skills review');
            resources.unshift('Fundamental medical knowledge resources');
        }

        return resources;
    }

    // Get available simulations
    getAvailableSimulations(difficulty = null, specialty = null) {
        let simulations = [];

        if (difficulty && specialty) {
            // Filter by both difficulty and specialty
            simulations = Object.entries(this.scenarios)
                .filter(([key, scenario]) => 
                    scenario.difficulty === difficulty && 
                    scenario.specialty === specialty
                )
                .map(([key, scenario]) => ({
                    id: key,
                    ...scenario
                }));
        } else if (difficulty) {
            // Filter by difficulty only
            simulations = Object.entries(this.scenarios)
                .filter(([key, scenario]) => scenario.difficulty === difficulty)
                .map(([key, scenario]) => ({
                    id: key,
                    ...scenario
                }));
        } else if (specialty) {
            // Filter by specialty only
            simulations = Object.entries(this.scenarios)
                .filter(([key, scenario]) => scenario.specialty === specialty)
                .map(([key, scenario]) => ({
                    id: key,
                    ...scenario
                }));
        } else {
            // Return all simulations
            simulations = Object.entries(this.scenarios)
                .map(([key, scenario]) => ({
                    id: key,
                    ...scenario
                }));
        }

        return {
            count: simulations.length,
            simulations: simulations,
            filters: { difficulty, specialty }
        };
    }

    // Get simulation statistics
    getSimulationStatistics() {
        return {
            totalScenarios: Object.keys(this.scenarios).length,
            difficultyDistribution: this.getDifficultyDistribution(),
            specialtyDistribution: this.getSpecialtyDistribution(),
            averageDuration: this.calculateAverageDuration(),
            complexityLevels: this.difficultyLevels,
            availableSpecialties: this.specialties
        };
    }

    // Get difficulty distribution
    getDifficultyDistribution() {
        const distribution = {};
        this.difficultyLevels.forEach(level => {
            distribution[level] = Object.values(this.scenarios)
                .filter(scenario => scenario.difficulty === level).length;
        });
        return distribution;
    }

    // Get specialty distribution
    getSpecialtyDistribution() {
        const distribution = {};
        this.specialties.forEach(specialty => {
            distribution[specialty] = Object.values(this.scenarios)
                .filter(scenario => scenario.specialty === specialty).length;
        });
        return distribution;
    }

    // Calculate average duration
    calculateAverageDuration() {
        const durations = Object.values(this.scenarios).map(scenario => scenario.duration);
        const average = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
        return Math.round(average);
    }
}

module.exports = new AdvancedSimulationsService(); 