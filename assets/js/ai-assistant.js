// AI Assistant JavaScript
class AIAssistant {
    constructor() {
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
        this.modelName = localStorage.getItem('gemini_model') || 'gemini-pro';
        this.temperature = parseFloat(localStorage.getItem('gemini_temperature')) || 0.7;
        this.chatHistory = [];
        this.isTyping = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.updateStatus();
    }
    
    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendMessage');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.apiKeyInput = document.getElementById('apiKey');
        this.modelSelect = document.getElementById('modelName');
        this.temperatureSlider = document.getElementById('temperature');
        this.tempValue = document.getElementById('tempValue');
        this.aiStatus = document.getElementById('aiStatus');
        this.modelInfo = document.getElementById('modelInfo');
    }
    
    bindEvents() {
        // Send message events
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Input validation
        this.userInput.addEventListener('input', () => {
            this.validateInput();
            this.autoResize();
        });
        
        // Settings events
        document.getElementById('openSettings').addEventListener('click', () => {
            this.settingsPanel.style.display = 'block';
        });
        
        document.getElementById('closeSettings').addEventListener('click', () => {
            this.settingsPanel.style.display = 'none';
        });
        
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });
        
        // Clear chat
        document.getElementById('clearChat').addEventListener('click', () => {
            this.clearChat();
        });
        
        // Temperature slider
        this.temperatureSlider.addEventListener('input', (e) => {
            this.tempValue.textContent = e.target.value;
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.currentTarget.dataset.prompt;
                this.userInput.value = prompt;
                this.validateInput();
                this.sendMessage();
            });
        });
        
        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.settingsPanel.contains(e.target) && 
                !document.getElementById('openSettings').contains(e.target)) {
                this.settingsPanel.style.display = 'none';
            }
        });
    }
    
    loadSettings() {
        this.apiKeyInput.value = this.apiKey;
        this.modelSelect.value = this.modelName;
        this.temperatureSlider.value = this.temperature;
        this.tempValue.textContent = this.temperature;
        this.modelInfo.textContent = this.modelName;
    }
    
    saveSettings() {
        this.apiKey = this.apiKeyInput.value.trim();
        this.modelName = this.modelSelect.value;
        this.temperature = parseFloat(this.temperatureSlider.value);
        
        // Save to localStorage
        localStorage.setItem('gemini_api_key', this.apiKey);
        localStorage.setItem('gemini_model', this.modelName);
        localStorage.setItem('gemini_temperature', this.temperature.toString());
        
        // Update UI
        this.modelInfo.textContent = this.modelName;
        this.updateStatus();
        this.settingsPanel.style.display = 'none';
        
        // Show success message
        this.showNotification('Settings saved successfully!', 'success');
    }
    
    updateStatus() {
        const statusIndicator = this.aiStatus.querySelector('.status-indicator');
        const statusText = this.aiStatus.querySelector('.status-text');
        
        if (this.apiKey) {
            statusIndicator.style.color = '#28a745';
            statusText.textContent = 'Ready';
        } else {
            statusIndicator.style.color = '#dc3545';
            statusText.textContent = 'Configure API';
        }
    }
    
    validateInput() {
        const hasText = this.userInput.value.trim().length > 0;
        const hasApiKey = this.apiKey.length > 0;
        this.sendButton.disabled = !hasText || !hasApiKey;
    }
    
    autoResize() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 120) + 'px';
    }
    
    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || !this.apiKey) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.userInput.value = '';
        this.validateInput();
        this.autoResize();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await this.callGeminiAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage(`Sorry, I encountered an error: ${error.message}`, 'ai', true);
        }
    }
    
    async callGeminiAPI(message) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
        
        // Build conversation context
        const conversationContext = this.buildContext();
        
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `${conversationContext}\n\nUser: ${message}\n\nAssistant:`
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: this.temperature,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from API');
        }
        
        return data.candidates[0].content.parts[0].text;
    }
    
    buildContext() {
        return `You are Hit Kalariya's AI Assistant, an expert in AI/ML, data science, and software development. 
        
Hit Kalariya is a passionate AI-ML Engineer and Data Analyst with 3+ years of experience developing intelligent solutions for real-world challenges. His expertise includes:

- Machine Learning & Deep Learning
- Computer Vision & Image Processing  
- Natural Language Processing
- Data Analytics & Visualization
- Python, TensorFlow, PyTorch, Scikit-learn
- Customer Segmentation, Predictive Analytics
- Cybersecurity AI, Healthcare AI

Key Projects:
- AI-Powered Customer Segmentation
- Computer Vision Object Detection (YOLO)
- Network Traffic Classification for DDoS Detection
- Stellar Classification using ML
- Customer Feedback Sentiment Analysis
- Fuel Efficiency Prediction for Automotive
- Indian Food Recipe Generator (NLP)
- Telecom Customer Churn Prediction

You should:
1. Be helpful, knowledgeable, and professional
2. Provide detailed technical insights when asked
3. Suggest relevant projects or solutions
4. Be enthusiastic about AI/ML topics
5. Offer to connect users with Hit for collaboration
6. Keep responses concise but informative
7. Use emojis sparingly and appropriately

Current conversation:`;
    }
    
    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (isError) {
            contentDiv.innerHTML = `<div class="error-message">${content}</div>`;
        } else {
            contentDiv.innerHTML = this.formatMessage(content);
        }
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Store in chat history
        this.chatHistory.push({ sender, content, timestamp: new Date() });
    }
    
    formatMessage(content) {
        // Convert markdown-like formatting to HTML
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
        
        // Handle code blocks
        formatted = formatted.replace(/```([\s\S]*?)```/g, '<div class="ai-code-block">$1</div>');
        
        // Handle lists
        formatted = formatted.replace(/^- (.*$)/gim, '<li>$1</li>');
        if (formatted.includes('<li>')) {
            formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        }
        
        return `<p>${formatted}</p>`;
    }
    
    showTypingIndicator() {
        if (this.isTyping) return;
        this.isTyping = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-content">
                <span>AI is thinking</span>
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    clearChat() {
        // Keep only the welcome message
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        this.chatMessages.innerHTML = '';
        if (welcomeMessage) {
            this.chatMessages.appendChild(welcomeMessage);
        }
        this.chatHistory = [];
        this.showNotification('Chat cleared successfully!', 'success');
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new AIAssistant();
});

// Add notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--white);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 15px 20px;
    box-shadow: 0 10px 30px var(--shadow);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 300px;
}

.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification.success {
    border-left: 4px solid #28a745;
}

.notification.error {
    border-left: 4px solid #dc3545;
}

.notification.info {
    border-left: 4px solid var(--primary);
}

.notification i {
    font-size: 1.2rem;
}

.notification.success i {
    color: #28a745;
}

.notification.error i {
    color: #dc3545;
}

.notification.info i {
    color: var(--primary);
}

.notification span {
    color: var(--text-primary);
    font-size: 0.9rem;
    font-weight: 500;
}

@media (max-width: 768px) {
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
        transform: translateY(-100px);
    }
    
    .notification.show {
        transform: translateY(0);
    }
}
</style>
`;

// Inject notification styles
document.head.insertAdjacentHTML('beforeend', notificationStyles);

// Add some sample conversation starters
const conversationStarters = [
    "What are the latest trends in AI and machine learning?",
    "How can I implement computer vision in my project?",
    "What's the difference between supervised and unsupervised learning?",
    "Can you explain how neural networks work?",
    "What are the best practices for data preprocessing?",
    "How do I choose the right machine learning algorithm?",
    "What are the applications of NLP in business?",
    "How can AI help in cybersecurity?",
    "What tools do you recommend for data visualization?",
    "How do I get started with deep learning?"
];

// Add conversation starter functionality
function addConversationStarters() {
    const startersContainer = document.createElement('div');
    startersContainer.className = 'conversation-starters';
    startersContainer.innerHTML = `
        <h6><i class="fas fa-lightbulb"></i> Try asking about:</h6>
        <div class="starters-grid">
            ${conversationStarters.slice(0, 6).map(starter => `
                <button class="starter-btn" data-prompt="${starter}">
                    ${starter}
                </button>
            `).join('')}
        </div>
    `;
    
    // Add event listeners to starter buttons
    startersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('starter-btn')) {
            const prompt = e.target.dataset.prompt;
            document.getElementById('userInput').value = prompt;
            window.aiAssistant.validateInput();
            window.aiAssistant.sendMessage();
        }
    });
    
    return startersContainer;
}

// Add starter styles
const starterStyles = `
<style>
.conversation-starters {
    margin: 20px 0;
    padding: 20px;
    background: var(--light-gray);
    border: 1px solid var(--border-color);
    border-radius: 15px;
}

.conversation-starters h6 {
    color: var(--text-primary);
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.conversation-starters i {
    color: var(--primary);
}

.starters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
}

.starter-btn {
    background: var(--white);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 12px 15px;
    border-radius: 10px;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    line-height: 1.4;
}

.starter-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

@media (max-width: 768px) {
    .starters-grid {
        grid-template-columns: 1fr;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', starterStyles);

// Add conversation starters to welcome message after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.appendChild(addConversationStarters());
        }
    }, 500);
});