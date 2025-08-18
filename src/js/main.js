import { initializeAnimations } from './animations.js';
import { initializeTheme } from './theme.js';
import { initializeNavigation } from './navigation.js';
import { initializeProjects } from './projects.js';
import { initializeAIAssistant } from './ai-assistant.js';
import { initializeAdmin } from './admin.js';
import { initializeContact } from './contact.js';
import { initializeCursor } from './cursor.js';

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Hit\'s Modern Portfolio...');
    
    // Initialize core functionality
    initializeTheme();
    initializeNavigation();
    initializeCursor();
    
    // Initialize content modules
    initializeProjects();
    initializeAIAssistant();
    initializeAdmin();
    initializeContact();
    
    // Initialize animations last
    initializeAnimations();
    
    // Show initial section
    showSection('home');
    
    console.log('✅ Portfolio initialized successfully!');
});

// Global utility functions
window.scrollToSection = (sectionId) => {
    showSection(sectionId);
};

window.showSection = (sectionId) => {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeNavLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
        
        // Trigger section-specific animations
        triggerSectionAnimations(sectionId);
    }
};

window.showSection = showSection;

function triggerSectionAnimations(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Reset and trigger animations for the active section
    const animatedElements = section.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    animatedElements.forEach((element, index) => {
        element.classList.remove('visible');
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 100);
    });
    
    // Trigger specific animations based on section
    switch (sectionId) {
        case 'home':
            animateStats();
            break;
        case 'projects':
            animateProjectCards();
            break;
    }
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current);
        }, 50);
    });
}

function animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Global utility functions for other modules
window.downloadResume = () => {
    window.open('https://drive.google.com/file/d/1EW3MXkjnkvXxpp095uwUwICalkA9gkO2/view?usp=drive_link', '_blank');
};

window.copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy', 'error');
    }
};

window.showNotification = (message, type = 'success') => {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('.notification-icon');
    const messageEl = notification.querySelector('.notification-message');
    
    // Set content
    messageEl.textContent = message;
    icon.textContent = type === 'success' ? '✅' : '❌';
    
    // Set type
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
};

// Error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showNotification('An error occurred. Please try again.', 'error');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`⚡ Page loaded in ${Math.round(loadTime)}ms`);
    });
}