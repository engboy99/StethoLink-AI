// StethoLink AI Standalone App - Enhanced with Offline Capabilities
class StethoLinkApp {
    constructor() {
        this.currentUser = null;
        this.currentContext = null;
        this.isOnline = navigator.onLine;
        this.offlineData = new Map();
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkForExistingUser();
        this.setupPWA();
        this.setupOfflineCapabilities();
        this.monitorConnection();
        this.setupChat();
    }

    setupOfflineCapabilities() {
        // Mark features that work offline
        this.markOfflineFeatures();
        
        // Initialize offline data storage
        this.initializeOfflineData();
        
        // Setup service worker for offline functionality
        this.setupServiceWorker();
    }

    markOfflineFeatures() {
        // Features that work completely offline
        const offlineFeatures = ['1', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
        
        offlineFeatures.forEach(featureId => {
            const menuItem = document.querySelector(`[data-action="${featureId}"]`);
            if (menuItem) {
                menuItem.classList.add('offline-available');
            }
        });
    }

    initializeOfflineData() {
        // Store essential medical data offline
        this.offlineData.set('medical-calculators', {
            bmi: {
                formula: 'BMI = Weight (kg) / Height (m)²',
                categories: {
                    underweight: '< 18.5 kg/m²',
                    normal: '18.5 - 24.9 kg/m²',
                    overweight: '25.0 - 29.9 kg/m²',
                    obese1: '30.0 - 34.9 kg/m²',
                    obese2: '35.0 - 39.9 kg/m²',
                    obese3: '≥ 40.0 kg/m²'
                }
            },
            gfr: {
                formula: 'GFR = [(140 - Age) × Weight (kg)] / [72 × Serum Creatinine (mg/dL)]',
                stages: {
                    stage1: '≥90 mL/min/1.73m² (Normal)',
                    stage2: '60-89 mL/min/1.73m² (Mild decrease)',
                    stage3a: '45-59 mL/min/1.73m² (Moderate decrease)',
                    stage3b: '30-44 mL/min/1.73m² (Moderate decrease)',
                    stage4: '15-29 mL/min/1.73m² (Severe decrease)',
                    stage5: '<15 mL/min/1.73m² (Kidney failure)'
                }
            }
        });

        // Store study plans offline
        this.offlineData.set('study-plans', {
            '1st': {
                title: '1st Year Study Plan - Sri Lankan Medical Curriculum',
                semesters: [
                    {
                        name: 'Semester 1',
                        subjects: ['Anatomy I - Gross Anatomy, Histology', 'Physiology I - Cell Physiology, Cardiovascular', 'Biochemistry I - Biomolecules, Metabolism', 'Community Medicine I - Epidemiology, Biostatistics']
                    },
                    {
                        name: 'Semester 2',
                        subjects: ['Anatomy II - Neuroanatomy, Embryology', 'Physiology II - Respiratory, Renal, Endocrine', 'Biochemistry II - Clinical Biochemistry, Genetics', 'Community Medicine II - Public Health, Nutrition']
                    }
                ],
                strategy: {
                    daily: '2 hours anatomy, 1.5 hours physiology, 1 hour biochemistry',
                    weekly: '1 practical session, 1 group study, 1 self-assessment',
                    monthly: 'Progress review and curriculum adjustment'
                },
                resources: ['Gray\'s Anatomy (Sri Lankan Edition)', 'Guyton & Hall Physiology', 'Harper\'s Biochemistry', 'Park\'s Community Medicine']
            }
        });

        // Store drug information offline
        this.offlineData.set('drug-info', {
            'beta-blockers': {
                mechanism: 'Competitive antagonists of β-adrenergic receptors',
                indications: ['Hypertension', 'Angina pectoris', 'Heart failure', 'Atrial fibrillation', 'Myocardial infarction prophylaxis'],
                sideEffects: ['Bradycardia', 'Fatigue', 'Cold extremities', 'Sexual dysfunction', 'Bronchospasm'],
                pearls: ['Start low, go slow', 'Avoid abrupt withdrawal', 'Monitor HR and BP', 'Consider cardioselective agents in COPD']
            }
        });
    }

    setupServiceWorker() {
        // Service worker is now managed by ServiceWorkerManager
        // Check if it's available and ready
        if (window.swManager && window.swManager.registration) {
            console.log('ServiceWorker ready:', window.swManager.registration);
            this.setupOfflineSync(window.swManager.registration);
        } else {
            // Fallback if service worker manager isn't ready yet
            console.log('Waiting for ServiceWorker to be ready...');
            setTimeout(() => this.setupServiceWorker(), 1000);
        }
    }

    setupOfflineSync(registration) {
        // Setup background sync for when connection is restored
        if ('sync' in registration) {
            registration.sync.register('offline-data-sync');
        }
    }

    monitorConnection() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus('🟢 Online', true);
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus('🔴 Offline', false);
        });

        // Monitor service worker status
        this.monitorServiceWorkerStatus();

        // Initial status check
        this.updateConnectionStatus(
            this.isOnline ? '🟢 Online' : '🔴 Offline',
            this.isOnline
        );
    }

    monitorServiceWorkerStatus() {
        // Check service worker status every 5 seconds
        setInterval(() => {
            if (window.swManager) {
                this.updateServiceWorkerStatus();
            }
        }, 5000);

        // Initial check
        setTimeout(() => {
            if (window.swManager) {
                this.updateServiceWorkerStatus();
            }
        }, 2000);
    }

    updateServiceWorkerStatus() {
        const swStatus = document.getElementById('sw-status');
        const swStatusText = document.getElementById('sw-status-text');
        const swUpdateBtn = document.getElementById('sw-update-btn');

        if (!swStatus || !swStatusText || !swUpdateBtn) return;

        if (window.swManager) {
            swStatus.style.display = 'block';
            
            if (window.swManager.isUpdateAvailable) {
                swStatusText.textContent = 'Service Worker: Update Available';
                swUpdateBtn.style.display = 'inline-block';
                swUpdateBtn.onclick = () => window.swManager.updateServiceWorker();
            } else {
                swStatusText.textContent = 'Service Worker: Ready';
                swUpdateBtn.style.display = 'none';
            }
        } else {
            swStatus.style.display = 'none';
        }
    }

    updateConnectionStatus(status, isOnline) {
        const indicator = document.getElementById('offline-indicator');
        const statusText = document.getElementById('connection-status');
        
        statusText.textContent = status;
        
        if (isOnline) {
            indicator.classList.add('online');
        } else {
            indicator.classList.remove('online');
        }
    }

    async syncOfflineData() {
        // Sync any offline data when connection is restored
        if (this.offlineData.size > 0) {
            console.log('Syncing offline data...');
            
            // Use the service worker manager for advanced sync
            if (window.swManager) {
                try {
                    await window.swManager.getCacheStatus();
                    console.log('Cache status updated');
                } catch (error) {
                    console.log('Cache status check failed:', error);
                }
            }
            
            // In a real app, this would sync with the server
        }
    }

    // Enhanced feature handling with offline support
    handleMenuAction(action) {
        if (!this.currentUser) {
            this.showError('Please start the app first');
            return;
        }

        // Check if feature is available offline
        const isOfflineFeature = this.isOfflineFeature(action);
        
        if (!this.isOnline && !isOfflineFeature) {
            this.showError('This feature requires an internet connection. Please check your connection and try again.');
            return;
        }

        switch (action) {
            case '1':
                this.showChatInterface('Study Plans', 'study-plans');
                break;
            case '2':
                this.showTaskManager();
                break;
            case '3':
                this.showChatInterface('Medical Calculators', 'medical-calculators');
                break;
            case '4':
                this.showChatInterface('Drug Information', 'drug-info');
                break;
            case '5':
                this.showChatInterface('Clinical Guidelines', 'clinical-guidelines');
                break;
            case '6':
                this.showChatInterface('Drug Interactions', 'drug-interactions');
                break;
            case '7':
                this.showChatInterface('Clinical Decision Support', 'clinical-decision');
                break;
            case '8':
                this.showChatInterface('Patient Education', 'patient-education');
                break;
            case '9':
                this.showChatInterface('Evidence-Based Medicine', 'evidence-medicine');
                break;
            case '10':
                this.showChatInterface('Patient Simulation', 'patient-simulation');
                break;
            case '11':
                this.showChatInterface('Research Assistant', 'research-assistant');
                break;
            case '12':
                this.showChatInterface('Medical Image Analysis', 'image-analysis');
                break;
            case '13':
                this.showProgressTracking();
                break;
            case '14':
                this.showNotesJournal();
                break;
            case '15':
                this.showAchievements();
                break;
            case '16':
                this.showSettings();
                break;
            default:
                this.showError('Feature not implemented yet');
        }
    }

    isOfflineFeature(action) {
        // Features that work completely offline
        const offlineFeatures = ['1', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
        return offlineFeatures.includes(action);
    }

    bindEvents() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startApp();
        });

        // Enter key in name input
        document.getElementById('student-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startApp();
            }
        });

        // Menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                this.handleMenuAction(action);
            });
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Back to menu button
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showMainMenu();
        });

        // Send button in chat
        document.getElementById('send-btn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key in chat input
        document.getElementById('chat-input-field').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Year selection buttons
        document.querySelectorAll('.year-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const year = btn.dataset.year;
                this.selectYear(year);
            });
        });

        // Close year modal
        document.getElementById('close-year-modal').addEventListener('click', () => {
            this.closeYearModal();
        });
    }

    startApp() {
        const nameInput = document.getElementById('student-name');
        const name = nameInput.value.trim();
        
        if (!name) {
            this.showError('Please enter your name');
            return;
        }

        // Create user profile
        this.currentUser = {
            id: this.generateUserId(),
            name: name,
            year: null,
            createdAt: new Date().toISOString(),
            preferences: {
                language: 'en'
            }
        };

        // Save to localStorage
        localStorage.setItem('stetholink_user', JSON.stringify(this.currentUser));

        // Show year selection
        this.showYearSelection();
    }

    showYearSelection() {
        document.getElementById('year-modal').style.display = 'flex';
    }

    closeYearModal() {
        document.getElementById('year-modal').style.display = 'none';
    }

    selectYear(year) {
        this.currentUser.year = parseInt(year);
        localStorage.setItem('stetholink_user', JSON.stringify(this.currentUser));
        
        this.closeYearModal();
        this.showMainMenu();
    }

    showMainMenu() {
        document.getElementById('welcome-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'none';
        document.getElementById('main-menu-section').style.display = 'block';
        
        // Update user name display
        document.getElementById('user-name-display').textContent = this.currentUser.name;
    }

    handleQuickAction(action) {
        const actions = {
            'symptoms': () => this.showSymptomChecker(),
            'calculator': () => this.showMedicalCalculators(),
            'tasks': () => this.showTaskManager(),
            'curriculum': () => this.showCurriculum()
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    showChatInterface(title, context) {
        this.currentContext = context;
        document.getElementById('chat-title').textContent = title;
        document.getElementById('main-menu-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'block';
        
        // Clear previous messages
        document.getElementById('chat-messages').innerHTML = '';
        
        // Add welcome message
        this.addBotMessage(this.getWelcomeMessage(context));
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.innerHTML = message;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async sendMessage() {
        const input = document.getElementById('chat-input-field');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addUserMessage(message);
        input.value = '';

        // Show typing indicator
        this.addBotMessage('🤔 Thinking...');

        try {
            // Send to backend
            const response = await fetch('/api/general-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    userId: this.currentUser.id,
                    context: this.currentContext
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Remove typing indicator and add response
                const messages = document.getElementById('chat-messages');
                messages.removeChild(messages.lastChild);
                this.addBotMessage(data.response);
            } else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            // Remove typing indicator and show error
            const messages = document.getElementById('chat-messages');
            messages.removeChild(messages.lastChild);
            this.addBotMessage('Sorry, I encountered an error. Please try again.');
        }
    }

    getWelcomeMessage(context) {
        const welcomeMessages = {
            'study-plans': `📚 <strong>Study Plans for ${this.currentUser.year}${this.getOrdinalSuffix(this.currentUser.year)} Year</strong><br><br>
                Welcome to your personalized study plan! I'll help you create a structured approach to your medical studies.<br><br>
                <strong>What would you like to focus on?</strong><br>
                • Specific subjects or topics<br>
                • Exam preparation strategies<br>
                • Clinical skills development<br>
                • Time management tips<br><br>
                Just tell me what you need help with!`,
            
            'task-manager': `📋 <strong>Task Manager</strong><br><br>
                Let's organize your medical studies! I can help you:<br><br>
                • Add new tasks with deadlines<br>
                • View your current tasks<br>
                • Set study reminders<br>
                • Track your progress<br><br>
                <strong>What would you like to do?</strong>`,
            
            'medical-calculators': `🧮 <strong>Medical Calculators</strong><br><br>
                I have several medical calculators to help you:<br><br>
                • <strong>BMI Calculator</strong> - Body Mass Index<br>
                • <strong>GFR Calculator</strong> - Glomerular Filtration Rate<br>
                • <strong>CHADS2 Score</strong> - Stroke Risk Assessment<br><br>
                <strong>Which calculator would you like to use?</strong><br>
                Just tell me the name or ask me to calculate something!`,
            
            'patient-simulation': `🏥 <strong>Patient Simulation</strong><br><br>
                Welcome to virtual patient practice! I'll simulate realistic patient cases to help you develop your clinical skills.<br><br>
                <strong>Available scenarios:</strong><br>
                • Emergency cases<br>
                • Chronic disease management<br>
                • Acute presentations<br>
                • Pediatric cases<br><br>
                <strong>Ready to start?</strong> Just tell me what type of case you'd like to practice!`
        };

        return welcomeMessages[context] || `Welcome to ${context}! How can I help you today?`;
    }

    getOrdinalSuffix(num) {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return 'st';
        if (j === 2 && k !== 12) return 'nd';
        if (j === 3 && k !== 13) return 'rd';
        return 'th';
    }

    // Feature implementations
    showStudyPlans() {
        this.showChatInterface('Study Plans', 'study-plans');
    }

    showTaskManager() {
        this.showChatInterface('Task Manager', 'task-manager');
    }

    showMedicalCalculators() {
        this.showChatInterface('Medical Calculators', 'medical-calculators');
    }

    showDrugInformation() {
        this.showChatInterface('Drug Information', 'drug-info');
    }

    showClinicalGuidelines() {
        this.showChatInterface('Clinical Guidelines', 'clinical-guidelines');
    }

    showDrugInteractions() {
        this.showChatInterface('Drug Interactions', 'drug-interactions');
    }

    showClinicalDecision() {
        this.showChatInterface('Clinical Decision Support', 'clinical-decision');
    }

    showPatientEducation() {
        this.showChatInterface('Patient Education', 'patient-education');
    }

    showEvidenceMedicine() {
        this.showChatInterface('Evidence-Based Medicine', 'evidence-medicine');
    }

    showPatientSimulation() {
        this.showChatInterface('Patient Simulation', 'patient-simulation');
    }

    showResearchAssistant() {
        this.showChatInterface('Research Assistant', 'research-assistant');
    }

    showImageAnalysis() {
        this.showChatInterface('Medical Image Analysis', 'image-analysis');
    }

    showProgressTracking() {
        this.showChatInterface('Progress Tracking', 'progress-tracking');
    }

    showNotesJournal() {
        this.showChatInterface('Notes & Journal', 'notes-journal');
    }

    showAchievements() {
        this.showChatInterface('Achievements', 'achievements');
    }

    showSettings() {
        this.showChatInterface('Settings & Configuration', 'settings');
    }

    showSymptomChecker() {
        this.showChatInterface('Symptom Checker', 'symptom-checker');
    }

    showCurriculum() {
        this.showChatInterface('Medical Curriculum', 'curriculum');
    }

    // Chat functionality
    setupChat() {
        const chatInput = document.getElementById('chat-input-field');
        const chatMessages = document.getElementById('chat-messages');
        const sendButton = document.getElementById('send-btn');
        
        if (!chatInput || !chatMessages || !sendButton) return;
        
        this.chatHistory = [];
        
        // Auto-scroll to bottom of chat
        this.scrollToBottom = () => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };
        
        // Add message to chat
        this.addMessage = (content, isUser = false) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
            messageDiv.innerHTML = content;
            
            chatMessages.appendChild(messageDiv);
            this.chatHistory.push({ content, isUser, timestamp: new Date() });
            
            // Scroll to bottom after a short delay to ensure DOM update
            setTimeout(() => this.scrollToBottom(), 100);
        };
        
        // Send message
        this.sendMessage = async () => {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message
            this.addMessage(message, true);
            chatInput.value = '';
            
            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot typing';
            typingDiv.innerHTML = '<em>AI is thinking...</em>';
            chatMessages.appendChild(typingDiv);
            
            try {
                // Determine context based on message content
                let context = 'general';
                const lowerMessage = message.toLowerCase();
                
                if (lowerMessage.includes('study') || lowerMessage.includes('curriculum') || lowerMessage.includes('1st') || lowerMessage.includes('2nd') || lowerMessage.includes('3rd')) {
                    context = 'study-plans';
                } else if (lowerMessage.includes('calculator') || lowerMessage.includes('formula') || lowerMessage.includes('calculate')) {
                    context = 'medical-calculators';
                } else if (lowerMessage.includes('drug') || lowerMessage.includes('medicine') || lowerMessage.includes('pharmacology')) {
                    context = 'drug-info';
                } else if (lowerMessage.includes('guideline') || lowerMessage.includes('protocol') || lowerMessage.includes('clinical')) {
                    context = 'clinical-guidelines';
                } else if (lowerMessage.includes('patient') || lowerMessage.includes('case') || lowerMessage.includes('simulation')) {
                    context = 'patient-simulation';
                } else if (lowerMessage.includes('image') || lowerMessage.includes('x-ray') || lowerMessage.includes('scan')) {
                    context = 'image-analysis';
                }
                
                const response = await fetch('/api/general-chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message,
                        userId: this.currentUser?.id || 'anonymous',
                        context
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Remove typing indicator
                chatMessages.removeChild(typingDiv);
                
                if (data.success) {
                    this.addMessage(data.response, false);
                } else {
                    this.addMessage('Sorry, I encountered an error. Please try again.', false);
                }
                
            } catch (error) {
                console.error('Error sending message:', error);
                
                // Remove typing indicator
                if (typingDiv.parentNode) {
                    chatMessages.removeChild(typingDiv);
                }
                
                this.addMessage('Sorry, I\'m having trouble connecting. Please check your internet connection and try again.', false);
            }
        };
        
        // Event listeners
        sendButton.addEventListener('click', () => this.sendMessage());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Focus input on chat section click
        chatMessages.addEventListener('click', () => {
            chatInput.focus();
        });
        
        // Initial scroll to bottom
        setTimeout(() => this.scrollToBottom(), 100);
        
        // Add welcome message
        this.addMessage('👋 Welcome to StethoLink AI! I\'m here to help you with medical studies, calculations, and clinical guidance. Ask me anything about medical curriculum, tools, or patient cases.', false);
    }

    checkForExistingUser() {
        const savedUser = localStorage.getItem('stetholink_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainMenu();
        }
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showError(message) {
        // Simple error display - can be enhanced
        alert(message);
    }

    setupPWA() {
        // PWA installation prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install prompt after a delay
            setTimeout(() => {
                this.showInstallPrompt();
            }, 3000);
        });

        // Handle successful installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallPrompt();
        });
    }

    showInstallPrompt() {
        // Create install prompt element
        const prompt = document.createElement('div');
        prompt.className = 'install-prompt';
        prompt.innerHTML = `
            <span>📱 Install StethoLink AI on your phone</span>
            <div>
                <button onclick="app.installPWA()">Install</button>
                <button class="close-prompt" onclick="app.hideInstallPrompt()">✕</button>
            </div>
        `;
        
        document.body.appendChild(prompt);
    }

    hideInstallPrompt() {
        const prompt = document.querySelector('.install-prompt');
        if (prompt) {
            prompt.remove();
        }
    }

    async installPWA() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            window.deferredPrompt = null;
        }
        this.hideInstallPrompt();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 StethoLink AI App initializing...');
    
    // Initialize the main app
    window.app = new StethoLinkApp();
    
    console.log('✅ StethoLink AI App initialized successfully');
}); 