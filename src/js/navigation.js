export function initializeNavigation() {
    console.log('🧭 Initializing navigation...');
    
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileMenuToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            // Reset hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            
            // Show section
            showSection(sectionId);
        });
    });
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background blur when scrolled
        if (currentScrollY > 50) {
            navbar.style.background = getCurrentTheme() === 'dark' 
                ? 'rgba(15, 23, 42, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.background = getCurrentTheme() === 'dark' 
                ? 'rgba(15, 23, 42, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.altKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    showSection('home');
                    break;
                case '2':
                    e.preventDefault();
                    showSection('about');
                    break;
                case '3':
                    e.preventDefault();
                    showSection('projects');
                    break;
                case '4':
                    e.preventDefault();
                    showSection('contact');
                    break;
                case '5':
                    e.preventDefault();
                    showSection('admin');
                    break;
            }
        }
    });
}

function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

// Update navbar theme when theme changes
document.addEventListener('themeChanged', (e) => {
    const navbar = document.getElementById('navbar');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        navbar.style.background = e.detail.theme === 'dark' 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.background = e.detail.theme === 'dark' 
            ? 'rgba(15, 23, 42, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)';
    }
});