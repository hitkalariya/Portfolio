export function initializeTheme() {
    console.log('🎨 Initializing theme system...');
    
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
    
    // Apply initial theme
    setTheme(initialTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    const lightIcon = themeToggle.querySelector('.light-icon');
    const darkIcon = themeToggle.querySelector('.dark-icon');
    
    if (theme === 'dark') {
        lightIcon.style.opacity = '1';
        lightIcon.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        darkIcon.style.opacity = '0';
        darkIcon.style.transform = 'translate(-50%, -50%) rotate(-180deg)';
    } else {
        lightIcon.style.opacity = '0';
        lightIcon.style.transform = 'translate(-50%, -50%) rotate(180deg)';
        darkIcon.style.opacity = '1';
        darkIcon.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    }
    
    // Trigger theme change event for other modules
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    
    console.log(`🎨 Theme changed to: ${theme}`);
}

// Utility function to get current theme
export function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

// Utility function to check if dark mode is active
export function isDarkMode() {
    return getCurrentTheme() === 'dark';
}