import { showSuccessAnimation, showErrorAnimation } from './animations.js';

export function initializeContact() {
    console.log('📧 Initializing contact form...');
    
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.submit-btn');
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            <span>Sending...</span>
        `;
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateFormSubmission(formData);
            
            // Success
            showSuccessAnimation(submitBtn);
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
        } catch (error) {
            // Error
            showErrorAnimation(submitBtn);
            showNotification('Failed to send message. Please try again.', 'error');
            console.error('❌ Contact form error:', error);
        } finally {
            // Reset button
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });
    
    // Form validation
    setupFormValidation();
}

async function simulateFormSubmission(formData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log form data (in real implementation, send to your backend)
    const data = Object.fromEntries(formData);
    console.log('📧 Contact form submission:', data);
    
    // Store in localStorage for demo purposes
    const submissions = JSON.parse(localStorage.getItem('contact-submissions') || '[]');
    submissions.push({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });
    localStorage.setItem('contact-submissions', JSON.stringify(submissions));
    
    // Simulate random success/failure for demo
    if (Math.random() > 0.1) { // 90% success rate
        return { success: true };
    } else {
        throw new Error('Network error');
    }
}

function setupFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // URL validation
    if (field.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
        }
    }
    
    // Show/hide error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--error)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--error);
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: slideDown 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorDiv);
    
    // Add slideDown animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Copy email functionality
window.copyEmail = async () => {
    try {
        await navigator.clipboard.writeText('hitkalariya88@gmail.com');
        showNotification('Email copied to clipboard!', 'success');
    } catch (error) {
        console.error('❌ Failed to copy email:', error);
        showNotification('Failed to copy email', 'error');
    }
};

// Social media links
window.openLinkedIn = () => {
    window.open('https://www.linkedin.com/in/hitkalariya/', '_blank');
};

window.openGitHub = () => {
    window.open('https://github.com/hitkalariya', '_blank');
};

window.openInstagram = () => {
    window.open('https://www.instagram.com/hitkalariya_/', '_blank');
};

// Contact form analytics
function trackFormInteraction(action, field = null) {
    const event = {
        action,
        field,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // Store analytics data
    const analytics = JSON.parse(localStorage.getItem('form-analytics') || '[]');
    analytics.push(event);
    
    // Keep only last 100 events
    if (analytics.length > 100) {
        analytics.splice(0, analytics.length - 100);
    }
    
    localStorage.setItem('form-analytics', JSON.stringify(analytics));
}

// Track form interactions
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('focus', (e) => {
            trackFormInteraction('field_focus', e.target.name);
        }, true);
        
        form.addEventListener('submit', () => {
            trackFormInteraction('form_submit');
        });
    }
});