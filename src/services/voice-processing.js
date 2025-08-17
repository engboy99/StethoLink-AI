const { logger, medicalLogger } = require('../utils/logger');
const { AIProcessingError } = require('../middleware/errorHandler');
const advancedAnalytics = require('./advanced-analytics');
const fs = require('fs');
const path = require('path');

class VoiceProcessingService {
    constructor() {
        this.supportedFormats = ['mp3', 'wav', 'm4a', 'ogg', 'flac'];
        this.maxFileSize = 25 * 1024 * 1024; // 25MB
        this.maxDuration = 300; // 5 minutes
        this.whisperModel = 'whisper-1';
        this.languageDetection = true;
        this.medicalContext = true;
        this.uploadPath = 'uploads/voice/';
        
        // Ensure upload directory exists
        this.ensureUploadDirectory();
        
        // Initialize supported languages
        this.supportedLanguages = {
            en: 'English',
            si: 'Sinhala',
            ta: 'Tamil',
            hi: 'Hindi',
            ur: 'Urdu',
            ar: 'Arabic'
        };
    }

    // Ensure upload directory exists
    ensureUploadDirectory() {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    // Process voice message
    async processVoiceMessage(audioBuffer, audioFormat, userId = null, context = {}) {
        const startTime = Date.now();
        
        try {
            logger.info('🎤 Starting voice message processing', { 
                audioFormat, 
                userId, 
                bufferSize: audioBuffer.length 
            });

            // Validate audio file
            const validation = this.validateAudioFile(audioBuffer, audioFormat);
            if (!validation.valid) {
                throw new AIProcessingError(`Audio validation failed: ${validation.error}`);
            }

            // Save audio file temporarily
            const tempFilePath = await this.saveTempAudioFile(audioBuffer, audioFormat);
            
            // Transcribe audio using Whisper
            const transcription = await this.transcribeAudio(tempFilePath, context);
            
            // Process transcription for medical context
            const processedTranscription = this.processMedicalTranscription(transcription, context);
            
            // Clean up temporary file
            this.cleanupTempFile(tempFilePath);
            
            // Track analytics
            if (userId) {
                await advancedAnalytics.trackVoiceProcessing(
                    userId,
                    audioFormat,
                    transcription.text.length,
                    Date.now() - startTime,
                    transcription.confidence
                );
            }

            const duration = Date.now() - startTime;
            
            logger.info('✅ Voice message processing completed successfully', {
                audioFormat,
                duration,
                textLength: transcription.text.length,
                confidence: transcription.confidence
            });

            return {
                success: true,
                transcription: processedTranscription,
                original: transcription,
                processingTime: duration,
                timestamp: new Date().toISOString(),
                model: this.whisperModel
            };

        } catch (error) {
            const duration = Date.now() - startTime;
            
            logger.error('❌ Error in voice message processing:', error);
            medicalLogger.medicalError(error, {
                operation: 'voice_processing',
                audioFormat,
                duration
            });
            
            throw new AIProcessingError(`Voice message processing failed: ${error.message}`);
        }
    }

    // Validate audio file
    validateAudioFile(audioBuffer, audioFormat) {
        try {
            // Check file size
            if (audioBuffer.length > this.maxFileSize) {
                return {
                    valid: false,
                    error: `Audio file size (${(audioBuffer.length / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${this.maxFileSize / 1024 / 1024}MB)`
                };
            }

            // Check file format
            if (!this.supportedFormats.includes(audioFormat.toLowerCase())) {
                return {
                    valid: false,
                    error: `Unsupported audio format: ${audioFormat}. Supported formats: ${this.supportedFormats.join(', ')}`
                };
            }

            // Check if file is corrupted
            if (audioBuffer.length < 1000) {
                return {
                    valid: false,
                    error: 'Audio file appears to be corrupted or too small'
                };
            }

            return { valid: true };
        } catch (error) {
            return {
                valid: false,
                error: `Audio validation error: ${error.message}`
            };
        }
    }

    // Save temporary audio file
    async saveTempAudioFile(audioBuffer, audioFormat) {
        try {
            const timestamp = Date.now();
            const filename = `voice_${timestamp}.${audioFormat}`;
            const filePath = path.join(this.uploadPath, filename);
            
            fs.writeFileSync(filePath, audioBuffer);
            
            logger.info('💾 Temporary audio file saved', { filePath });
            return filePath;
        } catch (error) {
            logger.error('❌ Error saving temporary audio file:', error);
            throw new AIProcessingError(`Failed to save temporary audio file: ${error.message}`);
        }
    }

    // Transcribe audio using Whisper AI
    async transcribeAudio(filePath, context = {}) {
        try {
            logger.info('🔊 Transcribing audio with Whisper AI', { filePath });

            // In real implementation, call OpenAI Whisper API
            // For now, simulate the transcription
            const transcription = await this.simulateWhisperTranscription(filePath, context);
            
            logger.info('✅ Audio transcription completed', { 
                confidence: transcription.confidence,
                language: transcription.language 
            });

            return transcription;
        } catch (error) {
            logger.error('❌ Error transcribing audio:', error);
            throw new AIProcessingError(`Audio transcription failed: ${error.message}`);
        }
    }

    // Simulate Whisper transcription (replace with actual API call)
    async simulateWhisperTranscription(filePath, context) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

        // Get file size to simulate realistic processing
        const stats = fs.statSync(filePath);
        const fileSizeMB = stats.size / 1024 / 1024;
        
        // Simulate different confidence levels based on file size
        const confidence = Math.max(0.7, 0.95 - (fileSizeMB * 0.01));
        
        // Generate realistic transcription based on context
        const transcription = this.generateRealisticTranscription(context, confidence);
        
        // Detect language
        const language = this.detectLanguage(transcription.text);
        
        return {
            text: transcription.text,
            confidence: confidence,
            language: language,
            segments: transcription.segments,
            duration: transcription.duration,
            model: this.whisperModel
        };
    }

    // Generate realistic transcription based on context
    generateRealisticTranscription(context, confidence) {
        const medicalContexts = {
            symptoms: [
                "Patient presents with fever, headache, and nausea for the past three days",
                "Complaining of chest pain, shortness of breath, and fatigue",
                "Experiencing abdominal pain, vomiting, and loss of appetite",
                "Reports joint pain, stiffness, and morning stiffness lasting more than one hour"
            ],
            diagnosis: [
                "Based on the symptoms, this appears to be a case of viral gastroenteritis",
                "The clinical presentation suggests community-acquired pneumonia",
                "These findings are consistent with acute coronary syndrome",
                "The pattern indicates rheumatoid arthritis with active disease"
            ],
            treatment: [
                "Recommend starting with paracetamol for fever and pain management",
                "Prescribe antibiotics for bacterial infection, consider amoxicillin",
                "Advise lifestyle modifications including diet and exercise",
                "Refer to specialist for further evaluation and management"
            ],
            general: [
                "Hello, this is Dr. Smith calling about the patient case we discussed",
                "I need to schedule a follow-up appointment for next week",
                "The laboratory results are back and show elevated liver enzymes",
                "Please update the patient's medication list in the electronic record"
            ]
        };

        const contextType = context.type || 'general';
        const availableTexts = medicalContexts[contextType] || medicalContexts.general;
        const selectedText = availableTexts[Math.floor(Math.random() * availableTexts.length)];

        // Add some realistic variations and errors based on confidence
        const processedText = this.addRealisticVariations(selectedText, confidence);

        // Generate segments for detailed analysis
        const segments = this.generateSegments(processedText, confidence);

        return {
            text: processedText,
            segments: segments,
            duration: Math.random() * 120 + 30 // 30-150 seconds
        };
    }

    // Add realistic variations to transcription
    addRealisticVariations(text, confidence) {
        let processedText = text;

        // Add variations based on confidence level
        if (confidence < 0.8) {
            // Simulate common transcription errors
            const errors = [
                { from: 'fever', to: 'fever' },
                { from: 'headache', to: 'head ache' },
                { from: 'nausea', to: 'nausea' },
                { from: 'chest pain', to: 'chest pain' },
                { from: 'shortness of breath', to: 'shortness of breath' },
                { from: 'abdominal', to: 'abdominal' },
                { from: 'vomiting', to: 'vomiting' },
                { from: 'joint pain', to: 'joint pain' }
            ];

            // Apply some random errors
            errors.forEach(error => {
                if (Math.random() < 0.3) {
                    processedText = processedText.replace(error.from, error.to);
                }
            });

            // Add uncertainty markers
            if (Math.random() < 0.4) {
                processedText += ' [unclear]';
            }
        }

        return processedText;
    }

    // Generate transcription segments
    generateSegments(text, confidence) {
        const words = text.split(' ');
        const segments = [];
        let currentSegment = '';
        let startTime = 0;

        words.forEach((word, index) => {
            currentSegment += word + ' ';
            
            // Create segments every 5-10 words
            if ((index + 1) % (5 + Math.floor(Math.random() * 5)) === 0 || index === words.length - 1) {
                const endTime = startTime + (Math.random() * 2 + 0.5);
                
                segments.push({
                    id: segments.length,
                    start: startTime,
                    end: endTime,
                    text: currentSegment.trim(),
                    confidence: confidence + (Math.random() * 0.1 - 0.05) // Slight variation
                });

                startTime = endTime;
                currentSegment = '';
            }
        });

        return segments;
    }

    // Detect language from text
    detectLanguage(text) {
        const languagePatterns = {
            si: /[\u0D80-\u0DFF]/g, // Sinhala Unicode range
            ta: /[\u0B80-\u0BFF]/g, // Tamil Unicode range
            hi: /[\u0900-\u097F]/g, // Devanagari Unicode range
            ur: /[\u0600-\u06FF]/g, // Arabic Unicode range
            ar: /[\u0600-\u06FF]/g, // Arabic Unicode range
            en: /[a-zA-Z]/g
        };

        for (const [lang, pattern] of Object.entries(languagePatterns)) {
            if (pattern.test(text)) {
                return lang;
            }
        }

        return 'en'; // Default to English
    }

    // Process medical transcription
    processMedicalTranscription(transcription, context) {
        try {
            logger.info('🔍 Processing medical transcription');

            const processed = {
                ...transcription,
                medicalTerms: this.extractMedicalTerms(transcription.text),
                symptoms: this.extractSymptoms(transcription.text),
                medications: this.extractMedications(transcription.text),
                measurements: this.extractMeasurements(transcription.text),
                urgency: this.assessUrgency(transcription.text),
                confidence: transcription.confidence,
                language: transcription.language,
                context: context
            };

            logger.info('✅ Medical transcription processing completed');
            return processed;
        } catch (error) {
            logger.error('❌ Error processing medical transcription:', error);
            throw new AIProcessingError(`Medical transcription processing failed: ${error.message}`);
        }
    }

    // Extract medical terms
    extractMedicalTerms(text) {
        const medicalTerms = [
            'fever', 'headache', 'nausea', 'vomiting', 'diarrhea',
            'chest pain', 'shortness of breath', 'fatigue', 'weakness',
            'abdominal pain', 'joint pain', 'stiffness', 'swelling',
            'infection', 'inflammation', 'hypertension', 'diabetes',
            'pneumonia', 'gastroenteritis', 'arthritis', 'migraine'
        ];

        const foundTerms = [];
        const lowerText = text.toLowerCase();

        medicalTerms.forEach(term => {
            if (lowerText.includes(term)) {
                foundTerms.push({
                    term: term,
                    context: this.getTermContext(text, term),
                    frequency: (lowerText.match(new RegExp(term, 'g')) || []).length
                });
            }
        });

        return foundTerms;
    }

    // Extract symptoms
    extractSymptoms(text) {
        const symptoms = [
            'pain', 'fever', 'headache', 'nausea', 'vomiting',
            'diarrhea', 'constipation', 'fatigue', 'weakness',
            'dizziness', 'shortness of breath', 'cough', 'sneezing',
            'itching', 'rash', 'swelling', 'stiffness'
        ];

        const foundSymptoms = [];
        const lowerText = text.toLowerCase();

        symptoms.forEach(symptom => {
            if (lowerText.includes(symptom)) {
                foundSymptoms.push({
                    symptom: symptom,
                    severity: this.assessSymptomSeverity(text, symptom),
                    duration: this.extractDuration(text, symptom),
                    location: this.extractLocation(text, symptom)
                });
            }
        });

        return foundSymptoms;
    }

    // Extract medications
    extractMedications(text) {
        const medications = [
            'paracetamol', 'ibuprofen', 'aspirin', 'amoxicillin',
            'penicillin', 'insulin', 'metformin', 'warfarin',
            'aspirin', 'nitroglycerin', 'albuterol', 'prednisone'
        ];

        const foundMedications = [];
        const lowerText = text.toLowerCase();

        medications.forEach(medication => {
            if (lowerText.includes(medication)) {
                foundMedications.push({
                    medication: medication,
                    dosage: this.extractDosage(text, medication),
                    frequency: this.extractFrequency(text, medication),
                    route: this.extractRoute(text, medication)
                });
            }
        });

        return foundMedications;
    }

    // Extract measurements
    extractMeasurements(text) {
        const measurementPatterns = [
            { pattern: /(\d+(?:\.\d+)?)\s*(?:degrees?|°C|°F)/gi, type: 'temperature', unit: '°C' },
            { pattern: /(\d+(?:\.\d+)?)\s*(?:mmHg|mm\s*Hg)/gi, type: 'blood_pressure', unit: 'mmHg' },
            { pattern: /(\d+(?:\.\d+)?)\s*(?:bpm|beats?\s*per\s*minute)/gi, type: 'heart_rate', unit: 'bpm' },
            { pattern: /(\d+(?:\.\d+)?)\s*(?:kg|kilograms?|pounds?|lbs)/gi, type: 'weight', unit: 'kg' },
            { pattern: /(\d+(?:\.\d+)?)\s*(?:cm|centimeters?|inches?|in)/gi, type: 'height', unit: 'cm' }
        ];

        const measurements = [];
        measurementPatterns.forEach(({ pattern, type, unit }) => {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    const value = match.match(/\d+(?:\.\d+)?/)[0];
                    measurements.push({
                        type: type,
                        value: parseFloat(value),
                        unit: unit,
                        original: match
                    });
                });
            }
        });

        return measurements;
    }

    // Assess urgency
    assessUrgency(text) {
        const urgentKeywords = ['emergency', 'urgent', 'immediate', 'critical', 'severe pain', 'chest pain'];
        const lowerText = text.toLowerCase();
        
        const urgencyLevel = urgentKeywords.some(keyword => lowerText.includes(keyword)) ? 'urgent' : 'routine';
        
        return {
            level: urgencyLevel,
            keywords: urgentKeywords.filter(keyword => lowerText.includes(keyword)),
            description: urgencyLevel === 'urgent' ? 'Requires immediate attention' : 'Routine processing'
        };
    }

    // Utility methods
    getTermContext(text, term) {
        const termIndex = text.toLowerCase().indexOf(term);
        if (termIndex === -1) return '';

        const start = Math.max(0, termIndex - 50);
        const end = Math.min(text.length, termIndex + term.length + 50);
        return text.substring(start, end).trim();
    }

    assessSymptomSeverity(text, symptom) {
        const severeKeywords = ['severe', 'intense', 'excruciating', 'unbearable'];
        const moderateKeywords = ['moderate', 'mild', 'slight'];
        
        const lowerText = text.toLowerCase();
        
        if (severeKeywords.some(keyword => lowerText.includes(keyword))) return 'severe';
        if (moderateKeywords.some(keyword => lowerText.includes(keyword))) return 'moderate';
        return 'mild';
    }

    extractDuration(text, symptom) {
        const durationPatterns = [
            /(\d+)\s*(?:days?|weeks?|months?|years?)/gi,
            /for\s*(\d+)\s*(?:days?|weeks?|months?|years?)/gi,
            /since\s*(\d+)\s*(?:days?|weeks?|months?|years?)/gi
        ];

        for (const pattern of durationPatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[0];
            }
        }

        return 'unknown';
    }

    extractLocation(text, symptom) {
        const locationPatterns = [
            /(left|right)\s*(?:side|arm|leg|eye|ear)/gi,
            /(upper|lower)\s*(?:back|abdomen|chest)/gi,
            /(front|back)\s*(?:of|side)/gi
        ];

        for (const pattern of locationPatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[0];
            }
        }

        return 'general';
    }

    extractDosage(text, medication) {
        const dosagePattern = /(\d+(?:\.\d+)?)\s*(?:mg|mcg|g|ml|tablets?|capsules?)/gi;
        const match = text.match(dosagePattern);
        return match ? match[0] : 'unknown';
    }

    extractFrequency(text, medication) {
        const frequencyPatterns = [
            /(\d+)\s*times?\s*(?:daily|per\s*day)/gi,
            /every\s*(\d+)\s*(?:hours?|days?)/gi,
            /once\s*(?:daily|twice|three\s*times)/gi
        ];

        for (const pattern of frequencyPatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[0];
            }
        }

        return 'unknown';
    }

    extractRoute(text, medication) {
        const routePatterns = [
            /(oral|by\s*mouth|po)/gi,
            /(intravenous|iv|injection)/gi,
            /(topical|cream|ointment)/gi,
            /(inhalation|inhaler|nebulizer)/gi
        ];

        for (const pattern of routePatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[0];
            }
        }

        return 'oral';
    }

    // Clean up temporary file
    cleanupTempFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                logger.info('🗑️ Temporary audio file cleaned up', { filePath });
            }
        } catch (error) {
            logger.warn('⚠️ Could not clean up temporary file:', error);
        }
    }

    // Batch voice processing
    async processMultipleVoiceMessages(audioFiles, context = {}, userId = null) {
        try {
            logger.info('🔄 Starting batch voice processing', { count: audioFiles.length });

            const results = [];
            const errors = [];

            for (let i = 0; i < audioFiles.length; i++) {
                try {
                    const result = await this.processVoiceMessage(
                        audioFiles[i].buffer,
                        audioFiles[i].format,
                        userId,
                        { ...context, index: i }
                    );
                    results.push(result);
                } catch (error) {
                    errors.push({
                        index: i,
                        error: error.message,
                        format: audioFiles[i].format
                    });
                }
            }

            logger.info('✅ Batch voice processing completed', { 
                successful: results.length, 
                failed: errors.length 
            });

            return {
                success: true,
                results,
                errors,
                summary: {
                    total: audioFiles.length,
                    successful: results.length,
                    failed: errors.length
                }
            };

        } catch (error) {
            logger.error('❌ Error in batch voice processing:', error);
            throw new AIProcessingError(`Batch voice processing failed: ${error.message}`);
        }
    }

    // Get supported audio formats
    getSupportedFormats() {
        return this.supportedFormats;
    }

    // Get processing capabilities
    getProcessingCapabilities() {
        return {
            supportedFormats: this.supportedFormats,
            maxFileSize: this.maxFileSize,
            maxDuration: this.maxDuration,
            supportedLanguages: this.supportedLanguages,
            whisperModel: this.whisperModel
        };
    }
}

module.exports = new VoiceProcessingService(); 