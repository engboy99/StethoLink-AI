// StethoLink AI Chat System with Memory
// Implements persistent chat sessions, history, and memory like ChatGPT

class StethoLinkChat {
    constructor() {
        this.currentChatId = null;
        this.chatHistory = [];
        this.currentChat = [];
        this.isLoading = false;
        
        this.init();
    }

    init() {
        console.log('🚀 StethoLink AI Chat System initialized');
        this.loadChatHistory();
        this.setupEventListeners();
        this.createNewChat();
        this.renderChatHistory();
    }

    setupEventListeners() {
        // New chat button
        document.getElementById('new-chat-btn').addEventListener('click', () => {
            this.createNewChat();
        });

        // Send button and input
        const sendBtn = document.getElementById('send-btn');
        const chatInput = document.getElementById('chat-input');
        
        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        chatInput.addEventListener('input', (e) => {
            this.updateCharCount(e.target.value.length);
            this.updateSendButton(e.target.value.trim().length > 0);
        });

        // Sidebar toggle for mobile
        document.getElementById('toggle-sidebar').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Mobile overlay
        document.getElementById('mobile-overlay').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Clear history
        document.getElementById('clear-history-btn').addEventListener('click', () => {
            this.clearChatHistory();
        });

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });

        // Export and share buttons
        document.getElementById('export-chat-btn').addEventListener('click', () => {
            this.exportChat();
        });

        document.getElementById('share-chat-btn').addEventListener('click', () => {
            this.shareChat();
        });
    }

    // Chat Management
    createNewChat() {
        const chatId = 'chat_' + Date.now();
        const chatTitle = 'New Medical Chat';
        
        this.currentChatId = chatId;
        this.currentChat = [];
        
        // Add to history if not empty
        if (this.currentChat.length > 0) {
            this.saveCurrentChat();
        }
        
        // Create new chat entry
        const newChatEntry = {
            id: chatId,
            title: chatTitle,
            timestamp: new Date().toISOString(),
            messageCount: 0,
            lastMessage: 'New chat started'
        };
        
        this.chatHistory.unshift(newChatEntry);
        this.saveChatHistory();
        this.renderChatHistory();
        
        // Clear chat area
        this.clearChatArea();
        this.updateChatTitle(chatTitle);
        
        console.log('🆕 New chat created:', chatId);
    }

    loadChat(chatId) {
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (!chat) return;

        // Save current chat if exists
        if (this.currentChat.length > 0) {
            this.saveCurrentChat();
        }

        // Load chat from localStorage
        const chatData = localStorage.getItem(`chat_${chatId}`);
        if (chatData) {
            this.currentChat = JSON.parse(chatData);
            this.currentChatId = chatId;
            this.renderChat();
            this.updateChatTitle(chat.title);
            this.markChatAsActive(chatId);
        }
    }

    saveCurrentChat() {
        if (this.currentChatId && this.currentChat.length > 0) {
            localStorage.setItem(`chat_${this.currentChatId}`, JSON.stringify(this.currentChat));
            
            // Update history entry
            const historyEntry = this.chatHistory.find(c => c.id === this.currentChatId);
            if (historyEntry) {
                historyEntry.messageCount = this.currentChat.length;
                historyEntry.lastMessage = this.currentChat[this.currentChat.length - 1]?.content?.substring(0, 50) + '...' || 'No messages';
                historyEntry.timestamp = new Date().toISOString();
                this.saveChatHistory();
            }
        }
    }

    // Message Handling
    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage('user', message);
        input.value = '';
        this.updateCharCount(0);
        this.updateSendButton(false);

        // Show loading
        this.showLoading(true);

        try {
            // Get AI response
            const aiResponse = await this.getAIResponse(message);
            this.addMessage('ai', aiResponse);
            
            // Save chat
            this.saveCurrentChat();
            
        } catch (error) {
            console.error('❌ Error getting AI response:', error);
            this.addMessage('ai', 'Sorry, I encountered an error. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    addMessage(sender, content) {
        const message = {
            id: Date.now(),
            sender: sender,
            content: content,
            timestamp: new Date().toISOString()
        };

        this.currentChat.push(message);
        this.renderMessage(message);
        
        // Update chat title if it's the first message
        if (this.currentChat.length === 2) { // User message + AI response
            this.updateChatTitle(this.generateChatTitle(content));
        }
    }

    renderMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}-message`;
        messageDiv.id = `message-${message.id}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${this.formatMessageContent(message.content)}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatMessageContent(content) {
        // Convert markdown-like formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    // AI Response Generation
    async getAIResponse(userMessage) {
        // Simulate AI response - in real implementation, this would call your AI service
        const responses = [
            `Great question! Let me explain this medical concept in detail. ${userMessage} is an important topic in medical education. Here are the key points you should know:

**Key Concepts:**
• Understanding the pathophysiology
• Clinical presentation and symptoms
• Diagnostic approaches
• Treatment options and management

**Study Tips:**
• Focus on the underlying mechanisms
• Practice with clinical scenarios
• Review related anatomy and physiology

Would you like me to elaborate on any specific aspect?`,

            `Excellent question about ${userMessage}! This is a fundamental concept that appears frequently in medical exams. Let me break it down:

**Clinical Relevance:**
• Common in emergency medicine
• Important for differential diagnosis
• Critical for patient safety

**Learning Approach:**
• Start with basic concepts
• Build up to complex scenarios
• Practice with real cases

What specific aspect would you like to explore further?`,

            `Ah, ${userMessage}! This is a classic medical topic that every student should master. Here's what you need to know:

**Core Principles:**
• Basic mechanisms and causes
• Risk factors and prevention
• Clinical manifestations
• Evidence-based treatments

**Exam Preparation:**
• Focus on high-yield facts
• Understand the "why" behind concepts
• Practice with sample questions

Would you like me to create a study plan for this topic?`
        ];

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Return a contextual response
        const responseIndex = Math.floor(Math.random() * responses.length);
        return responses[responseIndex];
    }

    // Chat History Management
    loadChatHistory() {
        const saved = localStorage.getItem('stetholink_chat_history');
        if (saved) {
            this.chatHistory = JSON.parse(saved);
        }
    }

    saveChatHistory() {
        localStorage.setItem('stetholink_chat_history', JSON.stringify(this.chatHistory));
    }

    renderChatHistory() {
        const historyContainer = document.getElementById('chat-history');
        historyContainer.innerHTML = '';

        this.chatHistory.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-history-item';
            chatItem.setAttribute('data-chat-id', chat.id);
            
            chatItem.innerHTML = `
                <h4>${chat.title}</h4>
                <p>${chat.lastMessage}</p>
            `;
            
            chatItem.addEventListener('click', () => {
                this.loadChat(chat.id);
            });
            
            historyContainer.appendChild(chatItem);
        });
    }

    markChatAsActive(chatId) {
        // Remove active class from all items
        document.querySelectorAll('.chat-history-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current chat
        const activeItem = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    clearChatHistory() {
        if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
            // Clear localStorage
            this.chatHistory.forEach(chat => {
                localStorage.removeItem(`chat_${chat.id}`);
            });
            
            // Clear history array
            this.chatHistory = [];
            this.saveChatHistory();
            
            // Clear current chat
            this.currentChat = [];
            this.currentChatId = null;
            
            // Update UI
            this.renderChatHistory();
            this.clearChatArea();
            this.updateChatTitle('New Medical Chat');
            
            console.log('🗑️ Chat history cleared');
        }
    }

    // UI Updates
    clearChatArea() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = `
            <div class="message system-message">
                <div class="message-content">
                    <h3>👨‍⚕️ Welcome to StethoLink AI Medical Assistant!</h3>
                    <p>I'm Dr. StethoLink, your AI medical learning companion. I can help you with:</p>
                    <ul>
                        <li>📚 Medical concepts and explanations</li>
                        <li>🔍 Symptom analysis and differential diagnosis</li>
                        <li>🧮 Medical calculations and formulas</li>
                        <li>📋 Study planning and task management</li>
                        <li>🎭 Patient simulation scenarios</li>
                        <li>💊 Drug information and interactions</li>
                    </ul>
                    <p><strong>Start by asking me any medical question!</strong></p>
                </div>
            </div>
        `;
    }

    renderChat() {
        this.clearChatArea();
        this.currentChat.forEach(message => {
            this.renderMessage(message);
        });
    }

    updateChatTitle(title) {
        document.getElementById('current-chat-title').textContent = title;
        
        // Update history entry
        if (this.currentChatId) {
            const historyEntry = this.chatHistory.find(c => c.id === this.currentChatId);
            if (historyEntry) {
                historyEntry.title = title;
                this.saveChatHistory();
                this.renderChatHistory();
            }
        }
    }

    generateChatTitle(firstMessage) {
        // Generate a title based on the first message
        const words = firstMessage.split(' ').slice(0, 5);
        return words.join(' ') + (words.length >= 5 ? '...' : '');
    }

    updateCharCount(count) {
        document.querySelector('.char-count').textContent = `${count}/2000`;
    }

    updateSendButton(enabled) {
        const sendBtn = document.getElementById('send-btn');
        sendBtn.disabled = !enabled;
    }

    showLoading(show) {
        this.isLoading = show;
        const loadingIndicator = document.getElementById('loading-indicator');
        loadingIndicator.style.display = show ? 'block' : 'none';
    }

    // Mobile Sidebar
    toggleSidebar() {
        const sidebar = document.getElementById('chat-sidebar');
        const overlay = document.getElementById('mobile-overlay');
        
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    // Quick Actions
    handleQuickAction(action) {
        const prompts = {
            symptoms: 'Can you help me understand the symptoms and differential diagnosis for chest pain?',
            calculator: 'I need help with medical calculations. Can you explain how to calculate BMI and interpret the results?',
            simulation: 'I want to practice with a patient simulation. Can you create a clinical scenario for me?'
        };

        const prompt = prompts[action];
        if (prompt) {
            document.getElementById('chat-input').value = prompt;
            this.updateCharCount(prompt.length);
            this.updateSendButton(true);
        }
    }

    // Export and Share
    exportChat() {
        if (this.currentChat.length === 0) {
            alert('No chat to export');
            return;
        }

        const chatText = this.currentChat.map(msg => 
            `${msg.sender === 'user' ? 'You' : 'Dr. StethoLink'}: ${msg.content}`
        ).join('\n\n');

        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stetholink-chat-${this.currentChatId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    shareChat() {
        if (navigator.share && this.currentChat.length > 0) {
            const chatText = this.currentChat.map(msg => 
                `${msg.sender === 'user' ? 'You' : 'Dr. StethoLink'}: ${msg.content}`
            ).join('\n\n');

            navigator.share({
                title: 'StethoLink AI Medical Chat',
                text: chatText.substring(0, 100) + '...',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const chatText = this.currentChat.map(msg => 
                `${msg.sender === 'user' ? 'You' : 'Dr. StethoLink'}: ${msg.content}`
            ).join('\n\n');

            navigator.clipboard.writeText(chatText).then(() => {
                alert('Chat copied to clipboard!');
            }).catch(() => {
                alert('Failed to copy chat to clipboard');
            });
        }
    }
}

// Initialize the chat system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StethoLinkChat();
}); 