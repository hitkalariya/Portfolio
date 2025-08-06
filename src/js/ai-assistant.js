let aiConfig = {
    apiKey: '',
    model: 'gemini-pro',
    temperature: 0.7
};

let chatHistory = [];
let isTyping = false;

export function initializeAIAssistant() {
    console.log('🤖 Initializing AI Assistant...');
    
    loadAIConfig();
    setupAIEventListeners();
    updateAIStatus();
}

function loadAIConfig() {
    const stored = localStorage.getItem('ai-config');
    if (stored) {
        try {
            aiConfig = { ...aiConfig, ...JSON.parse(stored) };
            console.log('📁 AI config loaded from storage');
        } catch (error) {
            console.error('❌ Error loading AI config:', error);
        }
    }
}

function saveAIConfig() {
    try {
        localStorage.setItem('ai-config', JSON.stringify(aiConfig));
        console.log('💾 AI config saved to storage');
    } catch (error) {
        console.error('❌ Error saving AI config:', error);
    }
}

function setupAIEventListeners() {
    const aiToggle = document.getElementById('aiToggle');
    const aiClose = document.getElementById('aiClose');
    const aiChatContainer = document.getElementById('aiChatContainer');
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    
    // Toggle chat
    aiToggle.addEventListener('click', () => {
        aiChatContainer.classList.toggle('active');
    });
    
    // Close chat
    aiClose.addEventListener('click', () => {
        aiChatContainer.classList.remove('active');
    });
    
    // Input validation
    aiInput.addEventListener('input', () => {
        const hasText = aiInput.value.trim().length > 0;
        const hasApiKey = aiConfig.apiKey.length > 0;
        aiSendBtn.disabled = !hasText || !hasApiKey;
        
        // Auto-resize textarea
        aiInput.style.height = 'auto';
        aiInput.style.height = Math.min(aiInput.scrollHeight, 100) + 'px';
    });
    
    // Send message
    aiSendBtn.addEventListener('click', sendMessage);
    aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!aiChatContainer.contains(e.target) && !aiToggle.contains(e.target)) {
            aiChatContainer.classList.remove('active');
        }
    });
}

async function sendMessage() {
    const aiInput = document.getElementById('aiInput');
    const message = aiInput.value.trim();
    
    if (!message || !aiConfig.apiKey || isTyping) return;
    
    // Add user message
    addMessage(message, 'user');
    aiInput.value = '';
    aiInput.style.height = 'auto';
    document.getElementById('aiSendBtn').disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const response = await callGeminiAPI(message);
        hideTypingIndicator();
        addMessage(response, 'ai');
    } catch (error) {
        hideTypingIndicator();
        addMessage(`Sorry, I encountered an error: ${error.message}`, 'ai', true);
        console.error('❌ AI Assistant error:', error);
    }
}

async function callGeminiAPI(message) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.model}:generateContent?key=${aiConfig.apiKey}`;
    
    const context = buildConversationContext();
    
    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: `${context}\n\nUser: ${message}\n\nAssistant:`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: aiConfig.temperature,
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

function buildConversationContext() {
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

function addMessage(content, sender, isError = false) {
    const messagesContainer = document.getElementById('aiChatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? '👤' : '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (isError) {
        messageContent.innerHTML = `<p style="color: var(--error);">${content}</p>`;
    } else {
        messageContent.innerHTML = formatMessage(content);
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in chat history
    chatHistory.push({ sender, content, timestamp: new Date() });
}

function formatMessage(content) {
    // Convert markdown-like formatting to HTML
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code style="background: var(--bg-tertiary); padding: 2px 4px; border-radius: 4px;">$1</code>')
        .replace(/\n/g, '<br>');
    
    // Handle code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 0.5rem 0;"><code>$1</code></pre>');
    
    // Handle lists
    formatted = formatted.replace(/^- (.*$)/gim, '<li>$1</li>');
    if (formatted.includes('<li>')) {
        formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul style="margin: 0.5rem 0; padding-left: 1.5rem;">$1</ul>');
    }
    
    return `<p>${formatted}</p>`;
}

function showTypingIndicator() {
    if (isTyping) return;
    isTyping = true;
    
    const messagesContainer = document.getElementById('aiChatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-animation">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add typing animation styles
    const style = document.createElement('style');
    style.textContent = `
        .typing-animation {
            display: flex;
            gap: 4px;
            align-items: center;
        }
        .typing-animation span {
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
        }
        .typing-animation span:nth-child(1) { animation-delay: -0.32s; }
        .typing-animation span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function updateAIStatus() {
    const statusDot = document.querySelector('.ai-status-dot');
    const aiStatus = document.querySelector('.ai-status');
    
    if (aiConfig.apiKey) {
        statusDot.style.background = 'var(--success)';
        if (aiStatus) aiStatus.textContent = 'Ready to help';
    } else {
        statusDot.style.background = 'var(--warning)';
        if (aiStatus) aiStatus.textContent = 'Configure API key';
    }
}

export function updateAIConfig(newConfig) {
    aiConfig = { ...aiConfig, ...newConfig };
    saveAIConfig();
    updateAIStatus();
    
    console.log('🤖 AI config updated');
    showNotification('AI configuration updated!', 'success');
}

export function getAIConfig() {
    return { ...aiConfig };
}

export function clearChatHistory() {
    chatHistory = [];
    const messagesContainer = document.getElementById('aiChatMessages');
    
    // Keep only the welcome message
    const welcomeMessage = messagesContainer.querySelector('.ai-message');
    messagesContainer.innerHTML = '';
    if (welcomeMessage && !welcomeMessage.classList.contains('typing-indicator')) {
        messagesContainer.appendChild(welcomeMessage);
    }
    
    console.log('🧹 Chat history cleared');
    showNotification('Chat cleared!', 'success');
}

// Export for global access
window.clearAIChat = clearChatHistory;