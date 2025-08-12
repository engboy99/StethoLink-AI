// 🏥 StethoLink AI - Revolutionary Medical AI Assistant for Sri Lanka
class StethoLinkApp {
    constructor() {
        this.currentUser = null;
        this.chatHistory = [];
        this.isAuthenticated = false;
        this.apiBaseUrl = '/.netlify/functions/api';
        this.currentSection = 'chat';
        this.animationQueue = [];
        this.isAnimating = false;
        this.userProfile = null;
        this.notes = [];
        this.drugDatabase = {};
        this.hospitalDirectory = {};
        this.knowledgeBank = {};
        
        // Revolutionary Features State
        this.advancedFeatures = {
            imageAnalysis: true,
            medicalCalculators: true,
            researchAssistant: true,
            patientSimulation: true,
            voiceProcessing: true,
            knowledgeBank: true,
            drugDatabase: true,
            hospitalDirectory: true,
            interUniversity: true,
            noteTaking: true,
            downloadTemplates: true
        };
        
        this.init();
    }

    async init() {
        try {
            // Show revolutionary loading animation
            this.showRevolutionaryLoadingScreen();
            
            // Initialize revolutionary UI components
            await this.initializeRevolutionaryUI();
            
            // Check authentication status
            await this.checkAuthStatus();
            
            // Initialize all event listeners
            this.initializeAllEventListeners();
            
            // Show appropriate container with animations
            if (this.isAuthenticated) {
                await this.showAppContainerWithAnimation();
                await this.loadUserData();
                this.updateTimeDisplay();
                setInterval(() => this.updateTimeDisplay(), 1000);
            } else {
                await this.showAuthContainerWithAnimation();
            }
            
            // Initialize revolutionary features
            await this.initializeRevolutionaryFeatures();
            
            // Start background animations
            this.startRevolutionaryBackgroundAnimations();
            
            console.log('🚀 Revolutionary StethoLink AI App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing revolutionary app:', error);
            this.showRevolutionaryToast('Error initializing revolutionary application', 'error');
        }
    }

    showRevolutionaryLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="advanced-loading">
                    <div class="loading-heartbeat">
                        <div class="heartbeat-icon">❤️</div>
                        <div class="heartbeat-pulse"></div>
                    </div>
                    <div class="loading-text">
                        <h2>🏥 StethoLink AI</h2>
                        <p>Initializing Revolutionary Medical AI System for Sri Lanka...</p>
                        <div class="loading-progress">
                            <div class="progress-bar"></div>
                        </div>
                    </div>
                    <div class="loading-features">
                        <span class="feature-tag">🔬 AI Analysis</span>
                        <span class="feature-tag">📊 Calculators</span>
                        <span class="feature-tag">🔍 Research</span>
                        <span class="feature-tag">🎯 Simulations</span>
                        <span class="feature-tag">💊 Drug Database</span>
                        <span class="feature-tag">🏥 Hospital Directory</span>
                        <span class="feature-tag">📚 Knowledge Bank</span>
                        <span class="feature-tag">🎓 Inter-University</span>
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

    async initializeRevolutionaryUI() {
        // Add revolutionary CSS animations
        this.injectRevolutionaryStyles();
        
        // Create floating action buttons
        this.createRevolutionaryFloatingActionButtons();
        
        // Initialize particle effects
        this.initializeRevolutionaryParticleEffects();
        
        // Setup revolutionary navigation
        this.setupRevolutionaryNavigation();
    }

    injectRevolutionaryStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Revolutionary Animations */
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
            
            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            /* Revolutionary Loading Screen */
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
            
            /* Revolutionary Floating Action Buttons */
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
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.8rem;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                animation: float 4s ease-in-out infinite;
            }
            
            .fab:hover {
                transform: scale(1.15);
                box-shadow: 0 12px 35px rgba(0,0,0,0.4);
                animation: glow 2s ease-in-out infinite;
            }
            
            /* Revolutionary Navigation */
            .advanced-nav {
                background: linear-gradient(135deg, #1e3c72, #2a5298);
                padding: 1.5rem;
                border-radius: 20px;
                margin: 1rem 0;
                box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                position: relative;
                overflow: hidden;
            }
            
            .advanced-nav::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                transform: translateX(-100%);
                animation: navShimmer 4s ease-in-out infinite;
            }
            
            @keyframes navShimmer {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
            }
            
            .nav-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                position: relative;
                z-index: 1;
            }
            
            .nav-card {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 15px;
                text-align: center;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                position: relative;
                overflow: hidden;
            }
            
            .nav-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                transform: translateX(-100%);
                transition: transform 0.5s;
            }
            
            .nav-card:hover::before {
                transform: translateX(100%);
            }
            
            .nav-card:hover {
                transform: translateY(-8px);
                background: rgba(255,255,255,0.2);
                box-shadow: 0 15px 35px rgba(0,0,0,0.3);
            }
            
            .nav-card.active {
                background: rgba(255,255,255,0.3);
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                animation: activeGlow 2s ease-in-out infinite;
            }
            
            @keyframes activeGlow {
                0%, 100% { box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
                50% { box-shadow: 0 10px 25px rgba(102, 126, 234,0.5); }
            }
            
            .nav-card i {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                display: block;
                animation: iconFloat 3s ease-in-out infinite;
            }
            
            @keyframes iconFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            
            .nav-card h3 {
                font-size: 1.1rem;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }
            
            .nav-card p {
                font-size: 0.9rem;
                opacity: 0.9;
                line-height: 1.4;
            }
            
            /* Revolutionary Content Sections */
            .content-section {
                animation: slideInUp 0.6s ease-out;
            }
            
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
                margin: 2rem 0;
            }
            
            .feature-card {
                background: white;
                border-radius: 20px;
                padding: 2.5rem;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                transition: all 0.4s ease;
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
                background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
                background-size: 200% 100%;
                animation: gradientShift 3s ease-in-out infinite;
            }
            
            .feature-card:hover {
                transform: translateY(-15px) scale(1.02);
                box-shadow: 0 30px 60px rgba(0,0,0,0.15);
            }
            
            .feature-icon {
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                color: white;
                margin: 0 auto 1.5rem;
                animation: iconPulse 4s ease-in-out infinite;
            }
            
            @keyframes iconPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            /* Revolutionary Chat Interface */
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
            
            /* Revolutionary Toast */
            .advanced-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 15px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideInLeft 0.5s ease-out;
                max-width: 350px;
                backdrop-filter: blur(10px);
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
            
            .advanced-toast.info {
                background: linear-gradient(135deg, #667eea, #764ba2);
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

    createRevolutionaryFloatingActionButtons() {
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
            <button class="fab" onclick="app.showKnowledgeBank()" title="Knowledge Bank">
                📚
            </button>
            <button class="fab" onclick="app.showDrugDatabase()" title="Drug Database">
                💊
            </button>
            <button class="fab" onclick="app.showHospitalDirectory()" title="Hospital Directory">
                🏥
            </button>
            <button class="fab" onclick="app.showNoteTaking()" title="Smart Notes">
                📝
            </button>
        `;
        document.body.appendChild(fabContainer);
    }

    initializeRevolutionaryParticleEffects() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        
        for (let i = 0; i < 30; i++) {
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

    setupRevolutionaryNavigation() {
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
                        <div class="nav-card" data-section="knowledge-bank" onclick="app.switchSection('knowledge-bank')">
                            <i>📚</i>
                            <h3>Knowledge Bank</h3>
                            <p>Medical Database</p>
                        </div>
                        <div class="nav-card" data-section="drug-database" onclick="app.switchSection('drug-database')">
                            <i>💊</i>
                            <h3>Drug Database</h3>
                            <p>Medications & Interactions</p>
                        </div>
                        <div class="nav-card" data-section="hospital-directory" onclick="app.switchSection('hospital-directory')">
                            <i>🏥</i>
                            <h3>Hospital Directory</h3>
                            <p>Sri Lanka Hospitals</p>
                        </div>
                        <div class="nav-card" data-section="inter-university" onclick="app.switchSection('inter-university')">
                            <i>🎓</i>
                            <h3>Inter-University</h3>
                            <p>Medical Community</p>
                        </div>
                        <div class="nav-card" data-section="note-taking" onclick="app.switchSection('note-taking')">
                            <i>📝</i>
                            <h3>Smart Notes</h3>
                            <p>AI-Powered Notes</p>
                        </div>
                        <div class="nav-card" data-section="progress" onclick="app.switchSection('progress')">
                            <i>📈</i>
                            <h3>Progress</h3>
                            <p>Learning Analytics</p>
                        </div>
                        <div class="nav-card" data-section="profile" onclick="app.showProfile()">
                            <i>👤</i>
                            <h3>Profile</h3>
                            <p>Settings & Preferences</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    async initializeRevolutionaryFeatures() {
        try {
            // Test advanced features availability
            const response = await fetch(`${this.apiBaseUrl}/advanced-features/health`);
            if (response.ok) {
                this.advancedFeatures = {
                    imageAnalysis: true,
                    medicalCalculators: true,
                    researchAssistant: true,
                    patientSimulation: true,
                    voiceProcessing: true,
                    knowledgeBank: true,
                    drugDatabase: true,
                    hospitalDirectory: true,
                    interUniversity: true,
                    noteTaking: true,
                    downloadTemplates: true
                };
                console.log('✅ Revolutionary features initialized successfully');
            }
        } catch (error) {
            console.log('⚠️ Revolutionary features not available, using fallback');
        }
    }

    startRevolutionaryBackgroundAnimations() {
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

    // Time Display
    updateTimeDisplay() {
        const now = new Date();
        const timeElement = document.getElementById('currentTime');
        const dateElement = document.getElementById('currentDate');
        
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('en-US', { 
                hour12: true, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
        }
        
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    }

    // Profile Setup
    showProfileSetup() {
        const modal = document.getElementById('profileSetupModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    selectGender(gender) {
        const options = document.querySelectorAll('.gender-option');
        options.forEach(option => option.classList.remove('selected'));
        
        const selectedOption = event.currentTarget;
        selectedOption.classList.add('selected');
        
        const radio = selectedOption.querySelector('input');
        radio.checked = true;
        
        // Update avatar
        const avatar = document.getElementById('profileAvatar');
        if (avatar) {
            avatar.textContent = gender === 'male' ? '👨‍⚕️' : '👩‍⚕️';
        }
    }

    async handleProfileSetup(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        const profileData = {
            name: formData.get('name'),
            gender: formData.get('gender'),
            university: formData.get('university'),
            year: formData.get('year')
        };
        
        // Save profile data
        this.userProfile = profileData;
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        
        // Update welcome message
        this.updateWelcomeMessage();
        
        // Hide modal
        const modal = document.getElementById('profileSetupModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        
        this.showRevolutionaryToast(`Welcome Dr. ${profileData.name}! Your profile is complete.`, 'success');
    }

    updateWelcomeMessage() {
        const welcomeElement = document.getElementById('welcomeMessage');
        if (welcomeElement && this.userProfile) {
            welcomeElement.textContent = `Welcome, Dr. ${this.userProfile.name}!`;
        }
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
                
                // Check if profile exists
                const savedProfile = localStorage.getItem('userProfile');
                if (savedProfile) {
                    this.userProfile = JSON.parse(savedProfile);
                    await this.showAppContainerWithAnimation();
                    await this.loadUserData();
                    this.updateWelcomeMessage();
                } else {
                    // Show profile setup
                    this.showProfileSetup();
                }
                
                this.showRevolutionaryToast('Login successful! Welcome to StethoLink AI', 'success');
            } else {
                this.showRevolutionaryToast('Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            this.showRevolutionaryToast('Login failed. Please try again.', 'error');
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
                this.showRevolutionaryToast('Registration successful! Please log in.', 'success');
                // Switch to login form
                this.switchAuthForm('login');
            } else {
                this.showRevolutionaryToast('Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            this.showRevolutionaryToast('Registration failed. Please try again.', 'error');
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
        
        this.showRevolutionaryToast('Logged out successfully', 'info');
        this.showAuthContainerWithAnimation();
    }

    // Revolutionary Feature Methods
    async showKnowledgeBank() {
        this.switchSection('knowledge-bank');
        this.showRevolutionaryToast('📚 Medical Knowledge Bank Activated', 'success');
        this.initializeKnowledgeBank();
    }

    async showDrugDatabase() {
        this.switchSection('drug-database');
        this.showRevolutionaryToast('💊 Drug Database & Interactions Ready', 'success');
        this.initializeDrugDatabase();
    }

    async showHospitalDirectory() {
        this.switchSection('hospital-directory');
        this.showRevolutionaryToast('🏥 Sri Lanka Hospital Directory Loaded', 'success');
        this.initializeHospitalDirectory();
    }

    async showInterUniversity() {
        this.switchSection('inter-university');
        this.showRevolutionaryToast('🎓 Inter-University Medical Community Connected', 'success');
        this.initializeInterUniversity();
    }

    async showNoteTaking() {
        this.switchSection('note-taking');
        this.showRevolutionaryToast('📝 Smart Note Taking System Ready', 'success');
        this.initializeNoteTaking();
    }

    // Initialize Knowledge Bank
    initializeKnowledgeBank() {
        const container = document.querySelector('.knowledge-container');
        if (container) {
            container.innerHTML = `
                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="feature-icon">📚</div>
                        <h3>Medical Knowledge Base</h3>
                        <p>Comprehensive medical information with Sri Lankan context</p>
                        
                        <div class="knowledge-search">
                            <input type="text" id="knowledgeSearch" placeholder="Search medical knowledge..." class="form-control">
                            <button class="btn btn-primary" onclick="app.searchKnowledge()">Search</button>
                        </div>
                        
                        <div class="knowledge-categories">
                            <h4>Categories:</h4>
                            <div class="category-grid">
                                <span class="category-tag">Anatomy</span>
                                <span class="category-tag">Physiology</span>
                                <span class="category-tag">Pathology</span>
                                <span class="category-tag">Pharmacology</span>
                                <span class="category-tag">Clinical Skills</span>
                                <span class="category-tag">Emergency Medicine</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Initialize Drug Database
    initializeDrugDatabase() {
        const container = document.querySelector('.drug-container');
        if (container) {
            container.innerHTML = `
                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="feature-icon">💊</div>
                        <h3>Drug Information & Interactions</h3>
                        <p>Comprehensive drug database with dosage, side effects, and interactions</p>
                        
                        <div class="drug-search">
                            <input type="text" id="drugSearch" placeholder="Search for drugs..." class="form-control">
                            <button class="btn btn-primary" onclick="app.searchDrug()">Search</button>
                        </div>
                        
                        <div class="drug-categories">
                            <h4>Drug Categories:</h4>
                            <div class="category-grid">
                                <span class="category-tag">Antibiotics</span>
                                <span class="category-tag">Analgesics</span>
                                <span class="category-tag">Cardiovascular</span>
                                <span class="category-tag">Psychiatric</span>
                                <span class="category-tag">Emergency</span>
                                <span class="category-tag">Pediatric</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Initialize Hospital Directory
    initializeHospitalDirectory() {
        const container = document.querySelector('.hospital-container');
        if (container) {
            container.innerHTML = `
                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🏥</div>
                        <h3>Sri Lanka Hospital Directory</h3>
                        <p>Complete directory of hospitals, clinics, and medical facilities</p>
                        
                        <div class="hospital-search">
                            <input type="text" id="hospitalSearch" placeholder="Search hospitals..." class="form-control">
                            <select id="hospitalProvince" class="form-control">
                                <option value="">All Provinces</option>
                                <option value="western">Western Province</option>
                                <option value="central">Central Province</option>
                                <option value="southern">Southern Province</option>
                                <option value="northern">Northern Province</option>
                                <option value="eastern">Eastern Province</option>
                                <option value="north-western">North Western Province</option>
                                <option value="north-central">North Central Province</option>
                                <option value="uva">Uva Province</option>
                                <option value="sabaragamuwa">Sabaragamuwa Province</option>
                            </select>
                            <button class="btn btn-primary" onclick="app.searchHospitals()">Search</button>
                        </div>
                        
                        <div class="hospital-results"></div>
                    </div>
                </div>
            `;
        }
    }

    // Initialize Inter-University Features
    initializeInterUniversity() {
        const container = document.querySelector('.inter-university-container');
        if (container) {
            container.innerHTML = `
                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🎓</div>
                        <h3>Inter-University Medical Community</h3>
                        <p>Connect with medical students and faculty across Sri Lankan universities</p>
                        
                        <div class="university-connections">
                            <h4>Connected Universities:</h4>
                            <div class="university-grid">
                                <div class="university-card">
                                    <h5>University of Colombo</h5>
                                    <p>Faculty of Medicine</p>
                                    <button class="btn btn-secondary" onclick="app.connectUniversity('colombo')">Connect</button>
                                </div>
                                <div class="university-card">
                                    <h5>University of Peradeniya</h5>
                                    <p>Faculty of Medicine</p>
                                    <button class="btn btn-secondary" onclick="app.connectUniversity('peradeniya')">Connect</button>
                                </div>
                                <div class="university-card">
                                    <h5>University of Jaffna</h5>
                                    <p>Faculty of Medicine</p>
                                    <button class="btn btn-secondary" onclick="app.connectUniversity('jaffna')">Connect</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Initialize Note Taking
    initializeNoteTaking() {
        const container = document.querySelector('.note-taking-container');
        if (container) {
            container.innerHTML = `
                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="feature-icon">📝</div>
                        <h3>Smart Note Taking System</h3>
                        <p>AI-powered note taking with templates, organization, and search</p>
                        
                        <div class="note-actions">
                            <button class="btn btn-primary" onclick="app.createNewNote()">Create New Note</button>
                            <button class="btn btn-secondary" onclick="app.showNoteTemplates()">Note Templates</button>
                        </div>
                        
                        <div class="note-templates">
                            <h4>Available Templates:</h4>
                            <div class="template-grid">
                                <span class="template-tag" onclick="app.useTemplate('patient-history')">Patient History</span>
                                <span class="template-tag" onclick="app.useTemplate('prescription')">Prescription</span>
                                <span class="template-tag" onclick="app.useTemplate('case-study')">Case Study</span>
                                <span class="template-tag" onclick="app.useTemplate('research-notes')">Research Notes</span>
                            </div>
                        </div>
                        
                        <div class="notes-list">
                            <h4>Your Notes:</h4>
                            <div id="notesContainer"></div>
                        </div>
                    </div>
                </div>
            `;
            
            this.loadNotes();
        }
    }

    // Utility Methods
    showRevolutionaryToast(message, type = 'info') {
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

    // Initialize all event listeners
    initializeAllEventListeners() {
        // Profile setup form
        const profileForm = document.getElementById('profileSetupForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileSetup(e));
        }

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

    // Complete the remaining revolutionary methods
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

    // Revolutionary Feature Methods
    async showAdvancedFeatures() {
        this.switchSection('advanced');
        this.showRevolutionaryToast('🔬 Advanced Medical AI Features Activated', 'success');
        
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
        this.showRevolutionaryToast('📊 Medical Calculators Ready', 'success');
        
        // Initialize calculator interfaces
        this.initializeCalculators();
    }

    async showImageAnalysis() {
        this.switchSection('advanced');
        this.showRevolutionaryToast('🖼️ Medical Image Analysis Ready', 'success');
        
        // Focus on image analysis section
        const imageSection = document.querySelector('.image-analysis-section');
        if (imageSection) {
            imageSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async showResearchAssistant() {
        this.switchSection('research');
        this.showRevolutionaryToast('🔍 Research AI Assistant Activated', 'success');
        
        // Initialize research tools
        this.initializeResearchTools();
    }

    async showPatientSimulation() {
        this.switchSection('simulations');
        this.showRevolutionaryToast('🎯 Patient Simulation Ready', 'success');
        
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
        this.showRevolutionaryToast('Analyzing medical image...', 'info');
        
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
                this.showRevolutionaryToast('Image analysis completed!', 'success');
            } else {
                throw new Error('Analysis failed');
            }
        } catch (error) {
            console.error('❌ Image analysis error:', error);
            this.showRevolutionaryToast('Image analysis failed. Please try again.', 'error');
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
            this.showRevolutionaryToast('Calculation failed. Please check your inputs.', 'error');
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
        
        this.showRevolutionaryToast('Researching medical literature...', 'info');
        
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
                this.showRevolutionaryToast('Research completed!', 'success');
            } else {
                throw new Error('Research failed');
            }
        } catch (error) {
            console.error('❌ Research error:', error);
            this.showRevolutionaryToast('Research failed. Please try again.', 'error');
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
        
        this.showRevolutionaryToast('Loading patient simulation...', 'info');
        
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
                this.showRevolutionaryToast('Simulation loaded!', 'success');
            } else {
                throw new Error('Simulation failed');
            }
        } catch (error) {
            console.error('❌ Simulation error:', error);
            this.showRevolutionaryToast('Simulation failed. Please try again.', 'error');
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

    // Authentication Methods
    switchAuthForm(formType) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const showLogin = document.getElementById('showLogin');
        const showRegister = document.getElementById('showRegister');
        
        if (formType === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            showLogin.classList.add('hidden');
            showRegister.classList.remove('hidden');
        } else {
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
            showRegister.classList.add('hidden');
            showLogin.classList.remove('hidden');
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userProfile');
        this.currentUser = null;
        this.userProfile = null;
        this.isAuthenticated = false;
        
        this.showRevolutionaryToast('Logged out successfully', 'info');
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
        
        const calculatorContainer = document.querySelector('.calculators-container');
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
        const researchContainer = document.querySelector('.research-container');
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
        const simulationContainer = document.querySelector('.simulations-container');
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

    // Note Taking Methods
    createNewNote() {
        const note = {
            id: Date.now(),
            title: 'New Note',
            content: '',
            template: 'general',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.notes.push(note);
        this.saveNotes();
        this.loadNotes();
        this.showRevolutionaryToast('New note created!', 'success');
    }

    useTemplate(templateType) {
        const templates = {
            'patient-history': {
                title: 'Patient History Template',
                content: `Patient Name: _____________
Age: _____________
Gender: _____________
Chief Complaint: _____________
History of Present Illness: _____________
Past Medical History: _____________
Medications: _____________
Allergies: _____________
Family History: _____________
Social History: _____________`
            },
            'prescription': {
                title: 'Prescription Template',
                content: `Patient Name: _____________
Date: _____________
Rx: _____________
Sig: _____________
Disp: _____________
Refills: _____________
Prescriber: Dr. ${this.userProfile?.name || '[Your Name]'}`
            },
            'case-study': {
                title: 'Case Study Template',
                content: `Case Title: _____________
Patient Demographics: _____________
Clinical Presentation: _____________
Differential Diagnosis: _____________
Investigations: _____________
Final Diagnosis: _____________
Treatment Plan: _____________
Outcome: _____________
Learning Points: _____________`
            },
            'research-notes': {
                title: 'Research Notes Template',
                content: `Research Topic: _____________
Research Question: _____________
Hypothesis: _____________
Methodology: _____________
Key Findings: _____________
Conclusions: _____________
References: _____________`
            }
        };
        
        const template = templates[templateType];
        if (template) {
            const note = {
                id: Date.now(),
                title: template.title,
                content: template.content,
                template: templateType,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            this.notes.push(note);
            this.saveNotes();
            this.loadNotes();
            this.showRevolutionaryToast(`Template "${template.title}" applied!`, 'success');
        }
    }

    loadNotes() {
        const notesContainer = document.getElementById('notesContainer');
        if (notesContainer) {
            if (this.notes.length === 0) {
                notesContainer.innerHTML = '<p>No notes yet. Create your first note!</p>';
                return;
            }
            
            notesContainer.innerHTML = this.notes.map(note => `
                <div class="note-item" data-note-id="${note.id}">
                    <div class="note-header">
                        <h5>${note.title}</h5>
                        <div class="note-actions">
                            <button onclick="app.editNote(${note.id})" class="btn btn-secondary btn-sm">Edit</button>
                            <button onclick="app.deleteNote(${note.id})" class="btn btn-secondary btn-sm">Delete</button>
                            <button onclick="app.downloadNote(${note.id})" class="btn btn-primary btn-sm">Download</button>
                        </div>
                    </div>
                    <div class="note-content">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
                    <div class="note-meta">
                        <small>Created: ${note.createdAt.toLocaleDateString()}</small>
                        <small>Updated: ${note.updatedAt.toLocaleDateString()}</small>
                    </div>
                </div>
            `).join('');
        }
    }

    saveNotes() {
        localStorage.setItem('userNotes', JSON.stringify(this.notes));
    }

    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            // Create edit modal
            const modal = document.createElement('div');
            modal.className = 'note-edit-modal';
            modal.innerHTML = `
                <div class="note-edit-card">
                    <h3>Edit Note</h3>
                    <input type="text" id="editNoteTitle" value="${note.title}" class="form-control">
                    <textarea id="editNoteContent" rows="10" class="form-control">${note.content}</textarea>
                    <div class="note-edit-actions">
                        <button onclick="app.saveNoteEdit(${noteId})" class="btn btn-primary">Save</button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

    saveNoteEdit(noteId) {
        const title = document.getElementById('editNoteTitle').value;
        const content = document.getElementById('editNoteContent').value;
        
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            note.title = title;
            note.content = content;
            note.updatedAt = new Date();
            
            this.saveNotes();
            this.loadNotes();
            this.showRevolutionaryToast('Note updated successfully!', 'success');
            
            // Remove modal
            const modal = document.querySelector('.note-edit-modal');
            if (modal) modal.remove();
        }
    }

    deleteNote(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== noteId);
            this.saveNotes();
            this.loadNotes();
            this.showRevolutionaryToast('Note deleted successfully!', 'success');
        }
    }

    downloadNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            const content = `${note.title}\n\n${note.content}\n\nCreated: ${note.createdAt.toLocaleDateString()}\nUpdated: ${note.updatedAt.toLocaleDateString()}\n\nGenerated by StethoLink AI`;
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showRevolutionaryToast('Note downloaded successfully!', 'success');
        }
    }

    // Profile Methods
    showProfile() {
        this.switchSection('profile');
        this.showRevolutionaryToast('Profile section loaded!', 'info');
        this.loadProfileData();
    }

    loadProfileData() {
        const profileContainer = document.querySelector('.profile-section');
        if (profileContainer && this.userProfile) {
            profileContainer.innerHTML = `
                <div class="feature-card">
                    <div class="feature-icon">👤</div>
                    <h3>Your Profile</h3>
                    
                    <div class="profile-info">
                        <div class="profile-field">
                            <label>Name:</label>
                            <span>Dr. ${this.userProfile.name}</span>
                        </div>
                        <div class="profile-field">
                            <label>Gender:</label>
                            <span>${this.userProfile.gender === 'male' ? '👨‍⚕️ Male' : '👩‍⚕️ Female'}</span>
                        </div>
                        <div class="profile-field">
                            <label>University:</label>
                            <span>${this.userProfile.university}</span>
                        </div>
                        <div class="profile-field">
                            <label>Year of Study:</label>
                            <span>${this.userProfile.year} Year</span>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button onclick="app.editProfile()" class="btn btn-primary">Edit Profile</button>
                        <button onclick="app.logout()" class="btn btn-secondary">Logout</button>
                    </div>
                </div>
            `;
        }
    }

    editProfile() {
        this.showProfileSetup();
    }

    // Utility Methods
    showRevolutionaryToast(message, type = 'info') {
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