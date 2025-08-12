// StethoLink AI Application
class StethoLinkApp {
    constructor() {
        this.currentUser = null;
        this.chatHistory = [];
        this.isAuthenticated = false;
        this.apiBaseUrl = '/.netlify/functions/api';
        
        this.init();
    }

    async init() {
        try {
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Check authentication status
            await this.checkAuthStatus();
            
            // Initialize event listeners
            this.initializeEventListeners();
            
            // Show appropriate container
            if (this.isAuthenticated) {
                this.showAppContainer();
                await this.loadUserData();
            } else {
                this.showAuthContainer();
            }
            
            console.log('🚀 StethoLink AI App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            this.showToast('Error initializing application', 'error');
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
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                // Verify token with backend
                const response = await fetch(`/.netlify/functions/auth/verify`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    this.currentUser = userData.user;
                    this.isAuthenticated = true;
                    return true;
                } else {
                    // Token invalid, remove it
                    localStorage.removeItem('authToken');
                    return false;
                }
            }
            return false;
        } catch (error) {
            console.error('Error checking auth status:', error);
            return false;
        }
    }

    initializeEventListeners() {
        // Authentication events
        this.setupAuthEvents();
        
        // Navigation events
        this.setupNavigationEvents();
        
        // Chat events
        this.setupChatEvents();
        
        // User menu events
        this.setupUserMenuEvents();
        
        // Global events
        this.setupGlobalEvents();
    }

    setupAuthEvents() {
        // Show/hide forms
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForms();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForms();
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    setupNavigationEvents() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
            });
        });
    }

    setupChatEvents() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendMessageBtn');

        // Auto-resize textarea
        chatInput.addEventListener('input', () => {
            this.autoResizeTextarea(chatInput);
            this.toggleSendButton();
        });

        // Send message on Enter
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Send button click
        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Chat action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.title.toLowerCase();
                this.handleChatAction(action);
            });
        });
    }

    setupUserMenuEvents() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');

        userMenuBtn.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });

        // Profile link
        document.getElementById('profileLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showProfile();
        });

        // Settings link
        document.getElementById('settingsLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSettings();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
    }

    setupGlobalEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle beforeunload
        window.addEventListener('beforeunload', () => {
            this.saveChatHistory();
        });
    }

    toggleAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await fetch(`/.netlify/functions/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                this.currentUser = data.user;
                this.isAuthenticated = true;
                
                this.showToast('Login successful!', 'success');
                this.showAppContainer();
                await this.loadUserData();
            } else {
                this.showToast(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Network error. Please try again.', 'error');
        }
    }

    async handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const language = document.getElementById('registerLanguage').value;

        if (!name || !email || !password) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            const response = await fetch(`/.netlify/functions/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password, 
                    language,
                    platform: 'web'
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.showToast('Account created successfully! Please log in.', 'success');
                this.toggleAuthForms(); // Switch to login form
            } else {
                this.showToast(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showToast('Network error. Please try again.', 'error');
        }
    }

    async handleLogout() {
        try {
            // Clear local storage
            localStorage.removeItem('authToken');
            
            // Clear user data
            this.currentUser = null;
            this.isAuthenticated = false;
            this.chatHistory = [];
            
            // Save chat history before logout
            this.saveChatHistory();
            
            // Show auth container
            this.showAuthContainer();
            
            // Clear forms
            this.clearAuthForms();
            
            this.showToast('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    clearAuthForms() {
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
    }

    switchSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to nav item
        const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Load section data
        this.loadSectionData(sectionName);
    }

    async loadSectionData(sectionName) {
        try {
            switch (sectionName) {
                case 'tasks':
                    await this.loadTasks();
                    break;
                case 'progress':
                    await this.loadProgress();
                    break;
                case 'notebook':
                    await this.loadNotebook();
                    break;
                case 'simulations':
                    await this.loadSimulations();
                    break;
            }
        } catch (error) {
            console.error(`Error loading ${sectionName} data:`, error);
        }
    }

    async loadUserData() {
        try {
            // Update user display name
            const userDisplayName = document.getElementById('userDisplayName');
            if (userDisplayName && this.currentUser) {
                userDisplayName.textContent = this.currentUser.displayName || this.currentUser.name || 'User';
            }

            // Load chat history
            await this.loadChatHistory();

            // Load initial section data
            await this.loadSectionData('chat');
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async loadChatHistory() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/chat/history`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.chatHistory = data.conversations || [];
                this.displayChatHistory();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    displayChatHistory() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        // Clear existing messages (except welcome message)
        const welcomeMessage = chatMessages.querySelector('.ai-message');
        chatMessages.innerHTML = '';
        if (welcomeMessage) {
            chatMessages.appendChild(welcomeMessage);
        }

        // Display chat history
        this.chatHistory.forEach(conversation => {
            if (conversation.message) {
                this.addMessageToChat(conversation.message, 'user');
            }
            if (conversation.response) {
                this.addMessageToChat(conversation.response, 'ai');
            }
        });

        // Scroll to bottom
        this.scrollChatToBottom();
    }

    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addMessageToChat(message, 'user');

        // Clear input
        chatInput.value = '';
        this.autoResizeTextarea(chatInput);
        this.toggleSendButton();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send message to backend
            const response = await fetch(`${this.apiBaseUrl}/chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    message,
                    platform: 'web',
                    context: {
                        userId: this.currentUser.id,
                        previousMessages: this.chatHistory.slice(-5)
                    }
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Remove typing indicator
                this.hideTypingIndicator();

                // Add AI response to chat
                this.addMessageToChat(data.response, 'ai');

                // Save to chat history
                this.chatHistory.push({
                    message,
                    response: data.response,
                    timestamp: new Date(),
                    platform: 'web'
                });

                // Save chat history
                this.saveChatHistory();
            } else {
                throw new Error(data.message || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
            this.showToast('Error sending message', 'error');
        }
    }

    addMessageToChat(content, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.innerHTML = content;

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatTime(new Date());

        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        this.scrollChatToBottom();
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typingIndicator';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(messageContent);

        chatMessages.appendChild(typingDiv);
        this.scrollChatToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollChatToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    toggleSendButton() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendMessageBtn');
        
        if (sendBtn) {
            sendBtn.disabled = !chatInput.value.trim();
        }
    }

    handleChatAction(action) {
        switch (action) {
            case 'voice message':
                this.showToast('Voice messages coming soon!', 'info');
                break;
            case 'attach file':
                this.showToast('File attachments coming soon!', 'info');
                break;
            case 'quick actions':
                this.showQuickActions();
                break;
        }
    }

    showQuickActions() {
        const actions = [
            { label: 'Study Plan', icon: '📚', action: () => this.switchSection('progress') },
            { label: 'Add Task', icon: '📋', action: () => this.switchSection('tasks') },
            { label: 'Take Notes', icon: '📝', action: () => this.switchSection('notebook') },
            { label: 'Practice', icon: '🎯', action: () => this.switchSection('simulations') }
        ];

        this.showModal('Quick Actions', this.createQuickActionsHTML(actions), actions);
    }

    createQuickActionsHTML(actions) {
        return `
            <div class="quick-actions-grid">
                ${actions.map(action => `
                    <button class="quick-action-btn" data-action="${action.label.toLowerCase().replace(' ', '-')}">
                        <div class="action-icon">${action.icon}</div>
                        <div class="action-label">${action.label}</div>
                    </button>
                `).join('')}
            </div>
        `;
    }

    async loadTasks() {
        const tasksContainer = document.getElementById('tasksContainer');
        if (!tasksContainer) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.displayTasks(data.tasks || []);
            } else {
                tasksContainer.innerHTML = '<p class="error-message">Failed to load tasks</p>';
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            tasksContainer.innerHTML = '<p class="error-message">Error loading tasks</p>';
        }
    }

    displayTasks(tasks) {
        const tasksContainer = document.getElementById('tasksContainer');
        if (!tasksContainer) return;

        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <h3>No tasks yet</h3>
                    <p>Create your first learning task to get started</p>
                    <button class="btn-primary" onclick="app.showAddTaskModal()">
                        <i class="fas fa-plus"></i>
                        Create Task
                    </button>
                </div>
            `;
            return;
        }

        const tasksHTML = tasks.map(task => `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-header">
                    <h4>${task.title}</h4>
                    <span class="task-status ${task.status}">${task.status}</span>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-meta">
                    <span class="task-category">${task.category}</span>
                    <span class="task-due-date">${this.formatDate(task.dueDate)}</span>
                </div>
            </div>
        `).join('');

        tasksContainer.innerHTML = tasksHTML;
    }

    async loadProgress() {
        const progressContainer = document.getElementById('progressContainer');
        if (!progressContainer) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/progress`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.displayProgress(data);
            } else {
                progressContainer.innerHTML = '<p class="error-message">Failed to load progress</p>';
            }
        } catch (error) {
            console.error('Error loading progress:', error);
            progressContainer.innerHTML = '<p class="error-message">Error loading progress</p>';
        }
    }

    displayProgress(data) {
        const progressContainer = document.getElementById('progressContainer');
        if (!progressContainer) return;

        progressContainer.innerHTML = `
            <div class="progress-overview">
                <div class="progress-card">
                    <h3>Overall Progress</h3>
                    <div class="progress-circle">
                        <span class="progress-percentage">${data.overallProgress || 0}%</span>
                    </div>
                </div>
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-label">Tasks Completed</span>
                        <span class="stat-value">${data.completedTasks || 0}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Study Streak</span>
                        <span class="stat-value">${data.currentStreak || 0} days</span>
                    </div>
                </div>
            </div>
        `;
    }

    async loadNotebook() {
        const notebookContainer = document.getElementById('notebookContainer');
        if (!notebookContainer) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/notebook`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.displayNotebook(data.notes || []);
            } else {
                notebookContainer.innerHTML = '<p class="error-message">Failed to load notes</p>';
            }
        } catch (error) {
            console.error('Error loading notebook:', error);
            notebookContainer.innerHTML = '<p class="error-message">Error loading notes</p>';
        }
    }

    displayNotebook(notes) {
        const notebookContainer = document.getElementById('notebookContainer');
        if (!notebookContainer) return;

        if (notes.length === 0) {
            notebookContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <h3>No notes yet</h3>
                    <p>Start taking notes to track your learning</p>
                    <button class="btn-primary" onclick="app.showAddNoteModal()">
                        <i class="fas fa-plus"></i>
                        Add Note
                    </button>
                </div>
            `;
            return;
        }

        const notesHTML = notes.map(note => `
            <div class="note-item" data-note-id="${note.id}">
                <div class="note-header">
                    <h4>${note.title}</h4>
                    <span class="note-date">${this.formatDate(note.createdAt)}</span>
                </div>
                <p class="note-content">${note.content}</p>
                <div class="note-tags">
                    ${note.tags ? note.tags.map(tag => `<span class="note-tag">${tag}</span>`).join('') : ''}
                </div>
            </div>
        `).join('');

        notebookContainer.innerHTML = notesHTML;
    }

    async loadSimulations() {
        const simulationsContainer = document.getElementById('simulationsContainer');
        if (!simulationsContainer) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/simulations`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.displaySimulations(data.simulations || []);
            } else {
                simulationsContainer.innerHTML = '<p class="error-message">Failed to load simulations</p>';
            }
        } catch (error) {
            console.error('Error loading simulations:', error);
            simulationsContainer.innerHTML = '<p class="error-message">Error loading simulations</p>';
        }
    }

    displaySimulations(simulations) {
        const simulationsContainer = document.getElementById('simulationsContainer');
        if (!simulationsContainer) return;

        if (simulations.length === 0) {
            simulationsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-md"></i>
                    <h3>No simulations available</h3>
                    <p>Medical simulations will be available soon</p>
                </div>
            `;
            return;
        }

        const simulationsHTML = simulations.map(sim => `
            <div class="simulation-item" data-sim-id="${sim.id}">
                <div class="simulation-header">
                    <h4>${sim.title}</h4>
                    <span class="simulation-difficulty ${sim.difficulty}">${sim.difficulty}</span>
                </div>
                <p class="simulation-description">${sim.description}</p>
                <button class="btn-primary" onclick="app.startSimulation('${sim.id}')">
                    <i class="fas fa-play"></i>
                    Start Simulation
                </button>
            </div>
        `).join('');

        simulationsContainer.innerHTML = simulationsHTML;
    }

    showModal(title, content, actions = []) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.innerHTML = content;

        modalOverlay.classList.remove('hidden');

        // Add event listeners for actions
        if (actions.length > 0) {
            actions.forEach(action => {
                const actionBtn = modalBody.querySelector(`[data-action="${action.label.toLowerCase().replace(' ', '-')}"]`);
                if (actionBtn) {
                    actionBtn.addEventListener('click', action.action);
                }
            });
        }
    }

    hideModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.add('hidden');
    }

    showProfile() {
        this.showModal('User Profile', `
            <div class="profile-content">
                <div class="profile-section">
                    <h4>Personal Information</h4>
                    <p><strong>Name:</strong> ${this.currentUser?.displayName || this.currentUser?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${this.currentUser?.email || 'N/A'}</p>
                    <p><strong>Member since:</strong> ${this.formatDate(this.currentUser?.createdAt)}</p>
                </div>
                <div class="profile-section">
                    <h4>Learning Statistics</h4>
                    <p><strong>Total sessions:</strong> ${this.currentUser?.stats?.totalSessions || 0}</p>
                    <p><strong>Current streak:</strong> ${this.currentUser?.stats?.currentStreak || 0} days</p>
                </div>
            </div>
        `);
    }

    showSettings() {
        this.showModal('Settings', `
            <div class="settings-content">
                <div class="setting-group">
                    <label>Language</label>
                    <select id="languageSetting">
                        <option value="en">English</option>
                        <option value="si">සිංහල (Sinhala)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                    </select>
                </div>
                <div class="setting-group">
                    <label>Notifications</label>
                    <div class="checkbox-group">
                        <input type="checkbox" id="emailNotif" checked>
                        <label for="emailNotif">Email notifications</label>
                    </div>
                    <div class="checkbox-group">
                        <input type="checkbox" id="pushNotif" checked>
                        <label for="pushNotif">Push notifications</label>
                    </div>
                </div>
                <button class="btn-primary" onclick="app.saveSettings()">Save Settings</button>
            </div>
        `);
    }

    async saveSettings() {
        // Implementation for saving settings
        this.showToast('Settings saved successfully!', 'success');
        this.hideModal();
    }

    startSimulation(simId) {
        this.showToast(`Starting simulation ${simId}...`, 'info');
        // Implementation for starting simulation
    }

    showAddTaskModal() {
        this.showModal('Add New Task', `
            <form id="addTaskForm">
                <div class="form-group">
                    <label for="taskTitle">Task Title</label>
                    <input type="text" id="taskTitle" required>
                </div>
                <div class="form-group">
                    <label for="taskDescription">Description</label>
                    <textarea id="taskDescription" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="taskCategory">Category</label>
                    <select id="taskCategory" required>
                        <option value="anatomy">Anatomy</option>
                        <option value="physiology">Physiology</option>
                        <option value="pathology">Pathology</option>
                        <option value="pharmacology">Pharmacology</option>
                        <option value="clinical">Clinical Skills</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="taskDueDate">Due Date</label>
                    <input type="date" id="taskDueDate">
                </div>
                <button type="submit" class="btn-primary">Create Task</button>
            </form>
        `);

        // Add form submission handler
        const form = document.getElementById('addTaskForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createTask();
            });
        }
    }

    async createTask() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const category = document.getElementById('taskCategory').value;
        const dueDate = document.getElementById('taskDueDate').value;

        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    dueDate: dueDate || null
                })
            });

            if (response.ok) {
                this.showToast('Task created successfully!', 'success');
                this.hideModal();
                this.loadTasks(); // Refresh tasks
            } else {
                const data = await response.json();
                this.showToast(data.message || 'Failed to create task', 'error');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            this.showToast('Error creating task', 'error');
        }
    }

    showAddNoteModal() {
        this.showModal('Add New Note', `
            <form id="addNoteForm">
                <div class="form-group">
                    <label for="noteTitle">Note Title</label>
                    <input type="text" id="noteTitle" required>
                </div>
                <div class="form-group">
                    <label for="noteContent">Content</label>
                    <textarea id="noteContent" rows="6" required></textarea>
                </div>
                <div class="form-group">
                    <label for="noteTags">Tags (comma-separated)</label>
                    <input type="text" id="noteTags" placeholder="anatomy, heart, cardiovascular">
                </div>
                <button type="submit" class="btn-primary">Save Note</button>
            </form>
        `);

        // Add form submission handler
        const form = document.getElementById('addNoteForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createNote();
            });
        }
    }

    async createNote() {
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        const tags = document.getElementById('noteTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        try {
            const response = await fetch(`${this.apiBaseUrl}/notebook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    title,
                    content,
                    tags
                })
            });

            if (response.ok) {
                this.showToast('Note saved successfully!', 'success');
                this.hideModal();
                this.loadNotebook(); // Refresh notes
            } else {
                const data = await response.json();
                this.showToast(data.message || 'Failed to save note', 'error');
            }
        } catch (error) {
            console.error('Error saving note:', error);
            this.showToast('Error saving note', 'error');
        }
    }

    saveChatHistory() {
        try {
            localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    handleResize() {
        // Handle responsive behavior
        const sidebar = document.querySelector('.app-sidebar');
        if (window.innerWidth <= 768) {
            sidebar.classList.add('mobile');
        } else {
            sidebar.classList.remove('mobile');
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Initialize app when DOM is loaded
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