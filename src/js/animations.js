import anime from 'animejs/lib/anime.es.js';

let animationInstances = [];

export function initializeAnimations() {
    console.log('🎨 Initializing animations...');
    
    // Initialize entrance animations
    initializeEntranceAnimations();
    
    // Initialize scroll-triggered animations
    initializeScrollAnimations();
    
    // Initialize interactive animations
    initializeInteractiveAnimations();
    
    // Initialize background animations
    initializeBackgroundAnimations();
}

function initializeEntranceAnimations() {
    // Hero section entrance
    const heroTimeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    });

    heroTimeline
        .add({
            targets: '.hero-greeting',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800
        })
        .add({
            targets: '.hero-title .title-line',
            opacity: [0, 1],
            translateY: [50, 0],
            delay: anime.stagger(200)
        }, '-=600')
        .add({
            targets: '.hero-description',
            opacity: [0, 1],
            translateY: [30, 0]
        }, '-=400')
        .add({
            targets: '.freelance-statement',
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 600
        }, '-=200')
        .add({
            targets: '.hero-actions .btn',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100)
        }, '-=400');

    // Profile image entrance
    anime({
        targets: '.profile-image',
        scale: [0, 1],
        rotate: [180, 0],
        opacity: [0, 1],
        duration: 1200,
        easing: 'easeOutElastic(1, .8)',
        delay: 500
    });

    // Floating elements
    anime({
        targets: '.floating-element',
        opacity: [0, 1],
        scale: [0, 1],
        rotate: [0, 360],
        delay: anime.stagger(200, {start: 1000}),
        duration: 800,
        easing: 'easeOutBack'
    });

    animationInstances.push(heroTimeline);
}

function initializeScrollAnimations() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Trigger different animations based on element class
                if (element.classList.contains('expertise-card')) {
                    animateExpertiseCard(element);
                } else if (element.classList.contains('project-card')) {
                    animateProjectCard(element);
                } else if (element.classList.contains('stat-item')) {
                    animateStatItem(element);
                } else if (element.classList.contains('contact-card')) {
                    animateContactCard(element);
                }
                
                // Generic fade-in animation
                if (element.classList.contains('fade-in')) {
                    element.classList.add('visible');
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.expertise-card, .project-card, .stat-item, .contact-card, .fade-in').forEach(el => {
        observer.observe(el);
    });
}

function animateExpertiseCard(card) {
    const timeline = anime.timeline({
        easing: 'easeOutExpo'
    });

    timeline
        .add({
            targets: card,
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.8, 1],
            duration: 800
        })
        .add({
            targets: card.querySelector('.expertise-icon'),
            scale: [0, 1],
            rotate: [180, 0],
            duration: 600
        }, '-=600')
        .add({
            targets: [card.querySelector('h4'), card.querySelector('p')],
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100),
            duration: 400
        }, '-=400');

    animationInstances.push(timeline);
}

function animateProjectCard(card) {
    const timeline = anime.timeline({
        easing: 'easeOutExpo'
    });

    timeline
        .add({
            targets: card,
            opacity: [0, 1],
            translateY: [60, 0],
            rotateX: [45, 0],
            duration: 800
        })
        .add({
            targets: card.querySelector('.project-image'),
            scale: [1.2, 1],
            duration: 600
        }, '-=600')
        .add({
            targets: card.querySelectorAll('.tech-tag'),
            opacity: [0, 1],
            scale: [0, 1],
            delay: anime.stagger(50),
            duration: 300
        }, '-=200');

    animationInstances.push(timeline);
}

function animateStatItem(stat) {
    const number = stat.querySelector('.stat-number');
    const target = parseInt(number.dataset.count);
    
    anime({
        targets: stat,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.8, 1],
        duration: 800,
        easing: 'easeOutExpo'
    });

    // Animate number counting
    anime({
        targets: { count: 0 },
        count: target,
        duration: 2000,
        easing: 'easeOutExpo',
        update: function(anim) {
            number.textContent = Math.floor(anim.animatables[0].target.count);
        },
        delay: 400
    });
}

function animateContactCard(card) {
    anime({
        targets: card,
        opacity: [0, 1],
        translateY: [40, 0],
        rotateY: [45, 0],
        duration: 800,
        easing: 'easeOutExpo'
    });
}

function initializeInteractiveAnimations() {
    // Button hover animations
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            anime({
                targets: btn,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });

        btn.addEventListener('mouseleave', () => {
            anime({
                targets: btn,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });

    // Card hover animations
    document.querySelectorAll('.project-card, .expertise-card, .contact-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                translateY: -10,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });

        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                translateY: 0,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });

    // Skill tag animations
    document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            anime({
                targets: tag,
                scale: 1.1,
                rotate: '1deg',
                duration: 200,
                easing: 'easeOutQuad'
            });
        });

        tag.addEventListener('mouseleave', () => {
            anime({
                targets: tag,
                scale: 1,
                rotate: '0deg',
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
}

function initializeBackgroundAnimations() {
    // Floating orbs animation
    anime({
        targets: '.gradient-orb',
        translateX: () => anime.random(-50, 50),
        translateY: () => anime.random(-50, 50),
        scale: [1, 1.2, 1],
        duration: 8000,
        easing: 'easeInOutSine',
        loop: true,
        delay: anime.stagger(2000)
    });

    // Continuous floating animation for profile elements
    anime({
        targets: '.floating-element',
        translateY: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        duration: 4000,
        easing: 'easeInOutSine',
        loop: true,
        delay: anime.stagger(1000)
    });

    // Profile glow animation
    anime({
        targets: '.profile-glow',
        scale: [0.8, 1.2, 0.8],
        opacity: [0.3, 0.1, 0.3],
        duration: 3000,
        easing: 'easeInOutSine',
        loop: true
    });
}

// Section transition animations
export function animateSectionTransition(fromSection, toSection) {
    const timeline = anime.timeline({
        easing: 'easeInOutQuart',
        complete: () => {
            fromSection.classList.remove('active');
            toSection.classList.add('active');
        }
    });

    timeline
        .add({
            targets: fromSection,
            opacity: [1, 0],
            translateY: [0, -30],
            duration: 300
        })
        .add({
            targets: toSection,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 500
        }, '-=100');

    return timeline;
}

// Loading animation
export function showLoadingAnimation(element) {
    return anime({
        targets: element,
        opacity: [1, 0.6, 1],
        scale: [1, 0.98, 1],
        duration: 1000,
        easing: 'easeInOutSine',
        loop: true
    });
}

export function hideLoadingAnimation(animationInstance) {
    if (animationInstance) {
        animationInstance.pause();
    }
}

// Success animation
export function showSuccessAnimation(element) {
    return anime({
        targets: element,
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        duration: 600,
        easing: 'easeOutElastic(1, .8)'
    });
}

// Error shake animation
export function showErrorAnimation(element) {
    return anime({
        targets: element,
        translateX: [0, -10, 10, -10, 10, 0],
        duration: 500,
        easing: 'easeInOutSine'
    });
}

// Modal animations
export function showModal(modal) {
    modal.classList.add('active');
    
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutExpo'
    });
}

export function hideModal(modal) {
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInExpo',
        complete: () => {
            modal.classList.remove('active');
        }
    });
}

// Cleanup function
export function cleanupAnimations() {
    animationInstances.forEach(instance => {
        if (instance && typeof instance.pause === 'function') {
            instance.pause();
        }
    });
    animationInstances = [];
}

// Page visibility handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        animationInstances.forEach(instance => {
            if (instance && typeof instance.pause === 'function') {
                instance.pause();
            }
        });
    } else {
        // Resume animations when page becomes visible
        animationInstances.forEach(instance => {
            if (instance && typeof instance.play === 'function') {
                instance.play();
            }
        });
    }
});