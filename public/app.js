// 🏥 StethoLink AI - Advanced Medical AI System
class StethoLinkApp {
    constructor() {
        this.currentUser = null;
        this.chatHistory = [];
        this.isAuthenticated = false;
        this.apiBaseUrl = '/.netlify/functions/api';
        this.currentSection = 'chat';
        this.animationQueue = [];
        this.isAnimating = false;
        
        // Advanced Features State
        this.advancedFeatures = {
            imageAnalysis: false,
            medicalCalculators: false,
            researchAssistant: false,
            patientSimulation: false,
            voiceProcessing: false
        };
        
        this.init();
    }

    async init() {
        try {
            // Show advanced loading animation
            this.showAdvancedLoadingScreen();
            
            // Initialize advanced UI components
            await this.initializeAdvancedUI();
            
            // Check authentication status
            await this.checkAuthStatus();
            
            // Initialize all event listeners
            this.initializeAllEventListeners();
            
            // Show appropriate container with animations
            if (this.isAuthenticated) {
                await this.showAppContainerWithAnimation();
                await this.loadUserData();
            } else {
                await this.showAuthContainerWithAnimation();
            }
            
            // Initialize advanced features
            await this.initializeAdvancedFeatures();
            
            // Start background animations
            this.startBackgroundAnimations();
            
            console.log('🚀 Advanced StethoLink AI App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing advanced app:', error);
            this.showAdvancedToast('Error initializing advanced application', 'error');
        }
    }

    showAdvancedLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="advanced-loading">
                    <div class="loading-heartbeat">
                        <div class="heartbeat-icon">❤️</div>
                        <div class="heartbeat-pulse"></div>
                    </div>
                    <div class="loading-text">
                        <h2>StethoLink AI</h2>
                        <p>Initializing Advanced Medical AI System...</p>
                        <div class="loading-progress">
                            <div class="progress-bar"></div>
                        </div>
                    </div>
                    <div class="loading-features">
                        <span class="feature-tag">🔬 AI Analysis</span>
                        <span class="feature-tag">📊 Calculators</span>
                        <span class="feature-tag">🔍 Research</span>
                        <span class="feature-tag">🎯 Simulations</span>
                    </div>
                </div>
            `;
            
            // Animate loading progress
            setTimeout(() => {
                const progressBar = loadingScreen.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = '100%';
                }
            }, 1000);
        }
    }

    async initializeAdvancedUI() {
        // Add advanced CSS animations
        this.injectAdvancedStyles();
        
        // Create floating action buttons
        this.createFloatingActionButtons();
        
        // Initialize particle effects
        this.initializeParticleEffects();
        
        // Setup advanced navigation
        this.setupAdvancedNavigation();
    }

    injectAdvancedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Advanced Animations */
            @keyframes heartbeat {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            
            @keyframes slideInUp {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes slideInLeft {
                from { transform: translateX(-100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            @keyframes glow {
                0% { box-shadow: 0 0 5px #007bff; }
                50% { box-shadow: 0 0 20px #007bff, 0 0 30px #007bff; }
                100% { box-shadow: 0 0 5px #007bff; }
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            /* Advanced Loading Screen */
            .advanced-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
            }
            
            .loading-heartbeat {
                position: relative;
                margin-bottom: 2rem;
            }
            
            .heartbeat-icon {
                font-size: 4rem;
                animation: heartbeat 1.5s ease-in-out infinite;
            }
            
            .heartbeat-pulse {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100px;
                height: 100px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: pulse 2s ease-in-out infinite;
            }
            
            .loading-progress {
                width: 300px;
                height: 4px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                margin: 1rem 0;
                overflow: hidden;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #00ff88, #00d4ff);
                width: 0%;
                transition: width 1s ease-in-out;
                border-radius: 2px;
            }
            
            .loading-features {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                justify-content: center;
                margin-top: 2rem;
            }
            
            .feature-tag {
                background: rgba(255,255,255,0.2);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.9rem;
                animation: float 3s ease-in-out infinite;
                animation-delay: calc(var(--i) * 0.5s);
            }
            
            /* Floating Action Buttons */
            .floating-actions {
                position: fixed;
                right: 20px;
                bottom: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .fab {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                animation: float 3s ease-in-out infinite;
            }
            
            .fab:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                animation: glow 2s ease-in-out infinite;
            }
            
            /* Advanced Navigation */
            .advanced-nav {
                background: linear-gradient(135deg, #1e3c72, #2a5298);
                padding: 1rem;
                border-radius: 15px;
                margin: 1rem;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            }
            
            .nav-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .nav-card {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 10px;
                text-align: center;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            .nav-card:hover {
                transform: translateY(-5px);
                background: rgba(255,255,255,0.2);
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            
            .nav-card i {
                font-size: 2rem;
                margin-bottom: 1rem;
                display: block;
            }
            
            /* Advanced Content Sections */
            .content-section {
                animation: slideInUp 0.6s ease-out;
            }
            
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin: 2rem 0;
            }
            
            .feature-card {
                background: white;
                border-radius: 15px;
                padding: 2rem;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                border: 1px solid #e0e0e0;
                position: relative;
                overflow: hidden;
            }
            
            .feature-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                transform: scaleX(0);
                transition: transform 0.3s ease;
            }
            
            .feature-card:hover::before {
                transform: scaleX(1);
            }
            
            .feature-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            }
            
            .feature-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: white;
                margin: 0 auto 1rem;
                animation: float 4s ease-in-out infinite;
            }
            
            /* Advanced Chat Interface */
            .advanced-chat {
                background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
                border-radius: 20px;
                padding: 2rem;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            
            .chat-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .chat-header h2 {
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: 2.5rem;
                margin-bottom: 0.5rem;
            }
            
            .chat-header p {
                color: #666;
                font-size: 1.1rem;
            }
            
            .message {
                margin: 1rem 0;
                animation: slideInLeft 0.5s ease-out;
            }
            
            .ai-message {
                animation: slideInLeft 0.5s ease-out;
            }
            
            .user-message {
                animation: slideInLeft 0.5s ease-out;
                animation-delay: 0.1s;
            }
            
            /* Advanced Toast */
            .advanced-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideInLeft 0.5s ease-out;
                max-width: 300px;
            }
            
            .advanced-toast.success {
                background: linear-gradient(135deg, #00b09b, #96c93d);
            }
            
            .advanced-toast.error {
                background: linear-gradient(135deg, #ff416c, #ff4b2b);
            }
            
            .advanced-toast.warning {
                background: linear-gradient(135deg, #f093fb, #f5576c);
            }
            
            /* Particle Effects */
            .particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            }
            
            .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(102, 126, 234, 0.6);
                border-radius: 50%;
                animation: float 6s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    createFloatingActionButtons() {
        const fabContainer = document.createElement('div');
        fabContainer.className = 'floating-actions';
        fabContainer.innerHTML = `
            <button class="fab" onclick="app.showAdvancedFeatures()" title="Advanced Features">
                🔬
            </button>
            <button class="fab" onclick="app.showMedicalCalculators()" title="Medical Calculators">
                📊
            </button>
            <button class="fab" onclick="app.showImageAnalysis()" title="Image Analysis">
                🖼️
            </button>
            <button class="fab" onclick="app.showResearchAssistant()" title="Research AI">
                🔍
            </button>
            <button class="fab" onclick="app.showPatientSimulation()" title="Patient Simulation">
                🎯
            </button>
        `;
        document.body.appendChild(fabContainer);
    }

    initializeParticleEffects() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
        
        document.body.appendChild(particlesContainer);
    }

    setupAdvancedNavigation() {
        const navContainer = document.querySelector('.app-sidebar');
        if (navContainer) {
            navContainer.innerHTML = `
                <div class="advanced-nav">
                    <div class="nav-grid">
                        <div class="nav-card" data-section="chat" onclick="app.switchSection('chat')">
                            <i>💬</i>
                            <h3>AI Chat</h3>
                            <p>Medical AI Assistant</p>
                        </div>
                        <div class="nav-card" data-section="advanced" onclick="app.switchSection('advanced')">
                            <i>🔬</i>
                            <h3>Advanced Features</h3>
                            <p>AI Analysis & Tools</p>
                        </div>
                        <div class="nav-card" data-section="calculators" onclick="app.switchSection('calculators')">
                            <i>📊</i>
                            <h3>Calculators</h3>
                            <p>Medical Formulas</p>
                        </div>
                        <div class="nav-card" data-section="research" onclick="app.switchSection('research')">
                            <i>🔍</i>
                            <h3>Research AI</h3>
                            <p>Literature & Analysis</p>
                        </div>
                        <div class="nav-card" data-section="simulations" onclick="app.switchSection('simulations')">
                            <i>🎯</i>
                            <h3>Simulations</h3>
                            <p>Patient Cases</p>
                        </div>
                        <div class="nav-card" data-section="progress" onclick="app.switchSection('progress')">
                            <i>📈</i>
                            <h3>Progress</h3>
                            <p>Learning Analytics</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    async initializeAdvancedFeatures() {
        try {
            // Test advanced features availability
            const response = await fetch(`${this.apiBaseUrl}/advanced-features/health`);
            if (response.ok) {
                this.advancedFeatures = {
                    imageAnalysis: true,
                    medicalCalculators: true,
                    researchAssistant: true,
                    patientSimulation: true,
                    voiceProcessing: true
                };
                console.log('✅ Advanced features initialized successfully');
            }
        } catch (error) {
            console.log('⚠️ Advanced features not available, using fallback');
        }
    }

    startBackgroundAnimations() {
        // Animate feature tags
        const featureTags = document.querySelectorAll('.feature-tag');
        featureTags.forEach((tag, index) => {
            tag.style.setProperty('--i', index);
        });
        
        // Start floating animations
        setInterval(() => {
            const floatingElements = document.querySelectorAll('.fab, .feature-icon');
            floatingElements.forEach(el => {
                el.style.animationDelay = Math.random() * 2 + 's';
            });
        }, 5000);
    }

    async showAppContainerWithAnimation() {
        const appContainer = document.getElementById('appContainer');
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                appContainer.classList.remove('hidden');
                appContainer.style.animation = 'fadeIn 0.8s ease-out';
            }, 500);
        }
    }

    async showAuthContainerWithAnimation() {
        const authContainer = document.getElementById('authContainer');
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                authContainer.classList.remove('hidden');
                authContainer.style.animation = 'slideInUp 0.8s ease-out';
            }, 500);
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    showAuthContainer() {
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
    }

    showAppContainer() {
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
    }

    async checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await fetch(`/.netlify/functions/auth/verify`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user;
                    this.isAuthenticated = true;
                    console.log('✅ User authenticated:', this.currentUser);
                } else {
                    localStorage.removeItem('authToken');
                    this.isAuthenticated = false;
                }
            } catch (error) {
                console.error('❌ Auth check error:', error);
                localStorage.removeItem('authToken');
                this.isAuthenticated = false;
            }
        }
    }

    initializeAllEventListeners() {
        // Chat form submission
        const chatForm = document.getElementById('chatForm');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => this.handleChatSubmit(e));
        }

        // Authentication forms
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Advanced feature buttons
        this.initializeAdvancedEventListeners();
    }

    initializeAdvancedEventListeners() {
        // Image analysis
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Calculator forms
        const calculatorForms = document.querySelectorAll('.calculator-form');
        calculatorForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleCalculatorSubmit(e));
        });

        // Research assistant
        const researchForm = document.getElementById('researchForm');
        if (researchForm) {
            researchForm.addEventListener('submit', (e) => this.handleResearchSubmit(e));
        }

        // Patient simulation
        const simulationForm = document.getElementById('simulationForm');
        if (simulationForm) {
            simulationForm.addEventListener('submit', (e) => this.handleSimulationSubmit(e));
        }
    }

    async loadUserData() {
        try {
            // Load user preferences and progress
            const response = await fetch(`${this.apiBaseUrl}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                this.updateUserInterface(userData);
            }
        } catch (error) {
            console.log('⚠️ Could not load user data, using defaults');
        }
    }

    updateUserInterface(userData) {
        // Update welcome message
        const welcomeElement = document.querySelector('.welcome-message');
        if (welcomeElement && userData.name) {
            welcomeElement.textContent = `Welcome back, ${userData.name}!`;
        }

        // Update progress indicators
        this.updateProgressIndicators(userData.progress || {});
    }

    updateProgressIndicators(progress) {
        const progressElements = document.querySelectorAll('.progress-indicator');
        progressElements.forEach(element => {
            const feature = element.dataset.feature;
            if (progress[feature]) {
                element.style.width = `${progress[feature]}%`;
                element.classList.add('animated');
            }
        });
    }

    // Advanced Feature Methods
    async showAdvancedFeatures() {
        this.switchSection('advanced');
        this.showAdvancedToast('Advanced Medical AI Features Activated', 'success');
        
        // Animate feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'slideInUp 0.6s ease-out';
                card.style.animationDelay = `${index * 0.1}s`;
            }, 100);
        });
    }

    async showMedicalCalculators() {
        this.switchSection('calculators');
        this.showAdvancedToast('Medical Calculators Ready', 'success');
        
        // Initialize calculator interfaces
        this.initializeCalculators();
    }

    async showImageAnalysis() {
        this.switchSection('advanced');
        this.showAdvancedToast('Medical Image Analysis Ready', 'success');
        
        // Focus on image analysis section
        const imageSection = document.querySelector('.image-analysis-section');
        if (imageSection) {
            imageSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async showResearchAssistant() {
        this.switchSection('research');
        this.showAdvancedToast('Research AI Assistant Activated', 'success');
        
        // Initialize research tools
        this.initializeResearchTools();
    }

    async showPatientSimulation() {
        this.switchSection('simulations');
        this.showAdvancedToast('Patient Simulation Ready', 'success');
        
        // Load simulation cases
        this.loadSimulationCases();
    }

    // Section Navigation
    switchSection(section) {
        this.currentSection = section;
        
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(s => s.classList.add('hidden'));
        
        // Show selected section
        const targetSection = document.querySelector(`.${section}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.style.animation = 'slideInUp 0.6s ease-out';
        }
        
        // Update navigation
        this.updateNavigation(section);
    }

    updateNavigation(activeSection) {
        const navCards = document.querySelectorAll('.nav-card');
        navCards.forEach(card => {
            card.classList.remove('active');
            if (card.dataset.section === activeSection) {
                card.classList.add('active');
                card.style.animation = 'glow 2s ease-in-out infinite';
            }
        });
    }

    // Advanced Chat Methods
    async handleChatSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        this.addMessageToChat('user', message);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send to AI backend
            const response = await fetch(`${this.apiBaseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ message })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.addMessageToChat('ai', data.response);
            } else {
                this.addMessageToChat('ai', 'I apologize, but I encountered an error. Please try again.');
            }
        } catch (error) {
            console.error('❌ Chat error:', error);
            this.addMessageToChat('ai', 'I apologize, but I encountered a connection error. Please check your internet connection.');
        }
        
        this.hideTypingIndicator();
    }

    addMessageToChat(sender, message) {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const icon = sender === 'user' ? '👤' : '🤖';
        const alignment = sender === 'user' ? 'text-right' : 'text-left';
        
        messageDiv.innerHTML = `
            <div class="message-content ${alignment}">
                <div class="message-bubble ${sender === 'user' ? 'user-bubble' : 'ai-bubble'}">
                    <div class="message-icon">${icon}</div>
                    <div class="message-text">${message}</div>
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Add to history
        this.chatHistory.push({ sender, message, timestamp: new Date() });
    }

    showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typingIndicator';
        typingIndicator.className = 'message ai-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-content text-left">
                <div class="message-bubble ai-bubble">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        const chatContainer = document.getElementById('chatContainer');
        if (chatContainer) {
            chatContainer.appendChild(typingIndicator);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Advanced Feature Implementations
    async handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Show upload progress
        this.showAdvancedToast('Analyzing medical image...', 'info');
        
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('analysisType', 'general');
            
            const response = await fetch(`${this.apiBaseUrl}/advanced-features/analyze-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                this.displayImageAnalysisResult(result);
                this.showAdvancedToast('Image analysis completed!', 'success');
            } else {
                throw new Error('Analysis failed');
            }
        } catch (error) {
            console.error('❌ Image analysis error:', error);
            this.showAdvancedToast('Image analysis failed. Please try again.', 'error');
        }
    }

    displayImageAnalysisResult(result) {
        const resultContainer = document.querySelector('.image-analysis-result');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="analysis-result-card">
                    <h3>🔬 Image Analysis Results</h3>
                    <div class="result-grid">
                        <div class="result-item">
                            <strong>Image Type:</strong> ${result.imageType || 'Unknown'}
                        </div>
                        <div class="result-item">
                            <strong>Confidence:</strong> ${result.confidence || 'N/A'}%
                        </div>
                        <div class="result-item">
                            <strong>Findings:</strong> ${result.findings || 'No significant findings'}
                        </div>
                        <div class="result-item">
                            <strong>Recommendations:</strong> ${result.recommendations || 'Consult with healthcare provider'}
                        </div>
                    </div>
                </div>
            `;
            
            resultContainer.style.animation = 'slideInUp 0.6s ease-out';
        }
    }

    async handleCalculatorSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const calculatorType = form.dataset.calculator;
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/advanced-features/calculator/${calculatorType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            
            if (response.ok) {
                const result = await response.json();
                this.displayCalculatorResult(calculatorType, result);
            } else {
                throw new Error('Calculation failed');
            }
        } catch (error) {
            console.error('❌ Calculator error:', error);
            this.showAdvancedToast('Calculation failed. Please check your inputs.', 'error');
        }
    }

    displayCalculatorResult(calculatorType, result) {
        const resultContainer = document.querySelector(`.${calculatorType}-result`);
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="calculator-result">
                    <h4>📊 ${calculatorType.toUpperCase()} Result</h4>
                    <div class="result-value">${result.result}</div>
                    <div class="result-interpretation">${result.interpretation || ''}</div>
                    <div class="result-category ${result.category || 'normal'}">${result.category || 'Normal'}</div>
                </div>
            `;
            
            resultContainer.style.animation = 'bounce 0.6s ease-out';
        }
    }

    async handleResearchSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const researchQuestion = formData.get('researchQuestion');
        
        if (!researchQuestion) return;
        
        this.showAdvancedToast('Researching medical literature...', 'info');
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/advanced-features/research`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ researchQuestion })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.displayResearchResult(result);
                this.showAdvancedToast('Research completed!', 'success');
            } else {
                throw new Error('Research failed');
            }
        } catch (error) {
            console.error('❌ Research error:', error);
            this.showAdvancedToast('Research failed. Please try again.', 'error');
        }
    }

    displayResearchResult(result) {
        const resultContainer = document.querySelector('.research-result');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="research-result-card">
                    <h3>🔍 Research Results</h3>
                    <div class="research-summary">
                        <h4>Summary</h4>
                        <p>${result.summary || 'No summary available'}</p>
                    </div>
                    <div class="research-sources">
                        <h4>Key Sources</h4>
                        <ul>
                            ${(result.sources || []).map(source => `<li>${source}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="research-recommendations">
                        <h4>Recommendations</h4>
                        <p>${result.recommendations || 'No specific recommendations'}</p>
                    </div>
                </div>
            `;
            
            resultContainer.style.animation = 'slideInUp 0.6s ease-out';
        }
    }

    async handleSimulationSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const simulationType = formData.get('simulationType');
        
        this.showAdvancedToast('Loading patient simulation...', 'info');
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/advanced-features/simulation/${simulationType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            
            if (response.ok) {
                const result = await response.json();
                this.displaySimulationResult(result);
                this.showAdvancedToast('Simulation loaded!', 'success');
            } else {
                throw new Error('Simulation failed');
            }
        } catch (error) {
            console.error('❌ Simulation error:', error);
            this.showAdvancedToast('Simulation failed. Please try again.', 'error');
        }
    }

    displaySimulationResult(result) {
        const resultContainer = document.querySelector('.simulation-result');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="simulation-result-card">
                    <h3>🎯 Patient Simulation</h3>
                    <div class="patient-case">
                        <h4>Patient Case</h4>
                        <div class="case-details">
                            <p><strong>Age:</strong> ${result.patient?.age || 'N/A'}</p>
                            <p><strong>Gender:</strong> ${result.patient?.gender || 'N/A'}</p>
                            <p><strong>Chief Complaint:</strong> ${result.patient?.chiefComplaint || 'N/A'}</p>
                        </div>
                    </div>
                    <div class="simulation-scenario">
                        <h4>Scenario</h4>
                        <p>${result.scenario || 'No scenario available'}</p>
                    </div>
                    <div class="learning-objectives">
                        <h4>Learning Objectives</h4>
                        <ul>
                            ${(result.learningObjectives || []).map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            
            resultContainer.style.animation = 'slideInUp 0.6s ease-out';
        }
    }

    // Utility Methods
    showAdvancedToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `advanced-toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // Authentication Methods
    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        try {
            const response = await fetch(`/.netlify/functions/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                this.currentUser = data.user;
                this.isAuthenticated = true;
                
                this.showAdvancedToast('Login successful! Welcome to StethoLink AI', 'success');
                await this.showAppContainerWithAnimation();
                await this.loadUserData();
            } else {
                this.showAdvancedToast('Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            this.showAdvancedToast('Login failed. Please try again.', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const name = formData.get('name');
        
        try {
            const response = await fetch(`/.netlify/functions/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, name })
            });
            
            if (response.ok) {
                this.showAdvancedToast('Registration successful! Please log in.', 'success');
                // Switch to login form
                this.switchAuthForm('login');
            } else {
                this.showAdvancedToast('Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            this.showAdvancedToast('Registration failed. Please try again.', 'error');
        }
    }

    switchAuthForm(formType) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (formType === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        this.currentUser = null;
        this.isAuthenticated = false;
        
        this.showAdvancedToast('Logged out successfully', 'info');
        this.showAuthContainerWithAnimation();
    }

    // Initialize calculators
    initializeCalculators() {
        const calculators = [
            { id: 'bmi', name: 'BMI Calculator', fields: ['weight', 'height'] },
            { id: 'gfr', name: 'GFR Calculator', fields: ['age', 'weight', 'creatinine', 'gender'] },
            { id: 'chads2', name: 'CHADS2 Score', fields: ['chf', 'hypertension', 'age', 'diabetes', 'stroke'] },
            { id: 'apache', name: 'APACHE II Score', fields: ['age', 'temperature', 'map', 'hr', 'rr', 'pao2', 'ph', 'na', 'k', 'creatinine', 'hct', 'wbc', 'glasgow'] }
        ];
        
        const calculatorContainer = document.querySelector('.calculators-section');
        if (calculatorContainer) {
            calculatorContainer.innerHTML = `
                <div class="feature-grid">
                    ${calculators.map(calc => `
                        <div class="feature-card calculator-card">
                            <div class="feature-icon">📊</div>
                            <h3>${calc.name}</h3>
                            <form class="calculator-form" data-calculator="${calc.id}">
                                ${calc.fields.map(field => `
                                    <div class="form-group">
                                        <label for="${field}">${field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                        <input type="number" id="${field}" name="${field}" step="0.01" required>
                                    </div>
                                `).join('')}
                                <button type="submit" class="btn btn-primary">Calculate</button>
                            </form>
                            <div class="${calc.id}-result"></div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Initialize research tools
    initializeResearchTools() {
        const researchContainer = document.querySelector('.research-section');
        if (researchContainer) {
            researchContainer.innerHTML = `
                <div class="feature-card">
                    <div class="feature-icon">🔍</div>
                    <h3>Medical Research Assistant</h3>
                    <p>Get AI-powered insights from medical literature and research papers.</p>
                    
                    <form id="researchForm" class="research-form">
                        <div class="form-group">
                            <label for="researchQuestion">Research Question</label>
                            <textarea id="researchQuestion" name="researchQuestion" rows="4" 
                                placeholder="Enter your medical research question here..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Research</button>
                    </form>
                    
                    <div class="research-result"></div>
                </div>
            `;
        }
    }

    // Load simulation cases
    loadSimulationCases() {
        const simulationContainer = document.querySelector('.simulations-section');
        if (simulationContainer) {
            simulationContainer.innerHTML = `
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3>Patient Simulation Cases</h3>
                    <p>Practice with realistic patient scenarios and improve your diagnostic skills.</p>
                    
                    <form id="simulationForm" class="simulation-form">
                        <div class="form-group">
                            <label for="simulationType">Case Type</label>
                            <select id="simulationType" name="simulationType" required>
                                <option value="">Select a case type</option>
                                <option value="cardiology">Cardiology</option>
                                <option value="neurology">Neurology</option>
                                <option value="emergency">Emergency Medicine</option>
                                <option value="pediatrics">Pediatrics</option>
                                <option value="internal">Internal Medicine</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Load Case</button>
                    </form>
                    
                    <div class="simulation-result"></div>
                </div>
            `;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StethoLinkApp();
});

// Close modal when clicking overlay
document.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
        window.app.hideModal();
    }
});

// Close modal with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.app.hideModal();
    }
}); 