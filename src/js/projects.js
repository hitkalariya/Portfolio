import { showLoadingAnimation, hideLoadingAnimation } from './animations.js';

let projects = [];
let githubProjects = [];

export function initializeProjects() {
    console.log('🚀 Initializing projects...');
    
    // Load projects from localStorage
    loadProjectsFromStorage();
    
    // Fetch GitHub repositories
    fetchGitHubRepositories();
    
    // Render initial projects
    renderProjects();
}

async function fetchGitHubRepositories() {
    try {
        console.log('📡 Fetching GitHub repositories...');
        
        const response = await fetch('https://api.github.com/users/hitkalariya/repos?sort=updated&per_page=50');
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Filter and process repositories
        githubProjects = repos
            .filter(repo => !repo.fork && !repo.archived && repo.description)
            .map(repo => ({
                id: `github-${repo.id}`,
                title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                description: repo.description,
                category: detectCategory(repo.name, repo.description, repo.topics || []),
                technologies: detectTechnologies(repo.language, repo.topics || []),
                githubUrl: repo.html_url,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                lastUpdated: repo.updated_at,
                isGitHub: true,
                featured: repo.stargazers_count > 0 || (repo.topics && repo.topics.length > 0)
            }))
            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        
        console.log(`✅ Loaded ${githubProjects.length} GitHub repositories`);
        
        // Merge with local projects and render
        mergeAndRenderProjects();
        
    } catch (error) {
        console.error('❌ Error fetching GitHub repositories:', error);
        showNotification('Failed to load GitHub projects', 'error');
    }
}

function detectCategory(name, description, topics) {
    const text = `${name} ${description} ${topics.join(' ')}`.toLowerCase();
    
    if (text.includes('computer vision') || text.includes('opencv') || text.includes('image') || text.includes('vision')) {
        return 'Computer Vision';
    } else if (text.includes('nlp') || text.includes('natural language') || text.includes('text') || text.includes('sentiment')) {
        return 'NLP';
    } else if (text.includes('deep learning') || text.includes('neural') || text.includes('tensorflow') || text.includes('pytorch')) {
        return 'Deep Learning';
    } else if (text.includes('machine learning') || text.includes('ml') || text.includes('classification') || text.includes('regression')) {
        return 'Machine Learning';
    } else if (text.includes('data') || text.includes('analytics') || text.includes('visualization')) {
        return 'Data Science';
    } else if (text.includes('ai') || text.includes('artificial intelligence')) {
        return 'AI Research';
    } else {
        return 'Other';
    }
}

function detectTechnologies(language, topics) {
    const technologies = [];
    
    if (language) {
        technologies.push(language);
    }
    
    // Add common AI/ML technologies based on topics
    const techMap = {
        'python': 'Python',
        'tensorflow': 'TensorFlow',
        'pytorch': 'PyTorch',
        'scikit-learn': 'Scikit-learn',
        'opencv': 'OpenCV',
        'pandas': 'Pandas',
        'numpy': 'NumPy',
        'jupyter': 'Jupyter',
        'machine-learning': 'Machine Learning',
        'deep-learning': 'Deep Learning',
        'computer-vision': 'Computer Vision',
        'nlp': 'NLP',
        'data-science': 'Data Science'
    };
    
    topics.forEach(topic => {
        if (techMap[topic]) {
            technologies.push(techMap[topic]);
        }
    });
    
    return [...new Set(technologies)]; // Remove duplicates
}

function loadProjectsFromStorage() {
    const stored = localStorage.getItem('portfolio-projects');
    if (stored) {
        try {
            projects = JSON.parse(stored);
            console.log(`📁 Loaded ${projects.length} projects from storage`);
        } catch (error) {
            console.error('❌ Error loading projects from storage:', error);
            projects = [];
        }
    }
}

function saveProjectsToStorage() {
    try {
        localStorage.setItem('portfolio-projects', JSON.stringify(projects));
        console.log('💾 Projects saved to storage');
    } catch (error) {
        console.error('❌ Error saving projects to storage:', error);
    }
}

function mergeAndRenderProjects() {
    // Combine local projects with GitHub projects
    const allProjects = [...projects, ...githubProjects];
    
    // Sort by featured status and last updated
    allProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.lastUpdated || b.createdAt || 0) - new Date(a.lastUpdated || a.createdAt || 0);
    });
    
    renderProjects(allProjects);
}

function renderProjects(projectsToRender = null) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    const allProjects = projectsToRender || [...projects, ...githubProjects];
    const featuredProjects = allProjects.filter(p => p.featured).slice(0, 6);
    const displayProjects = featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 6);
    
    projectsGrid.innerHTML = displayProjects.map(project => `
        <div class="project-card fade-in" data-project-id="${project.id}">
            <div class="project-image">
                <img src="${project.image || getDefaultProjectImage(project.category)}" 
                     alt="${project.title}" 
                     loading="lazy">
                <div class="project-category ${project.featured ? 'featured' : ''}">${project.category}</div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.githubUrl ? `
                        <a href="${project.githubUrl}" target="_blank" class="project-btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            View Code
                        </a>
                    ` : ''}
                    ${project.stars !== undefined ? `
                        <div class="project-stats">
                            <span class="stat">⭐ ${project.stars}</span>
                            <span class="stat">🍴 ${project.forks}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for project cards
    addProjectCardHandlers();
    
    console.log(`✅ Rendered ${displayProjects.length} projects`);
}

function getDefaultProjectImage(category) {
    const imageMap = {
        'Machine Learning': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
        'Computer Vision': 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400',
        'NLP': 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
        'Data Science': 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
        'Deep Learning': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
        'AI Research': 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=400',
        'Other': 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    return imageMap[category] || imageMap['Other'];
}

function addProjectCardHandlers() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on a link
            if (e.target.closest('a')) return;
            
            const projectId = card.dataset.projectId;
            const project = [...projects, ...githubProjects].find(p => p.id === projectId);
            
            if (project && project.githubUrl) {
                window.open(project.githubUrl, '_blank');
            }
        });
    });
}

export function addProject(projectData) {
    const newProject = {
        id: `local-${Date.now()}`,
        ...projectData,
        createdAt: new Date().toISOString(),
        isLocal: true
    };
    
    projects.unshift(newProject); // Add to beginning
    saveProjectsToStorage();
    mergeAndRenderProjects();
    
    console.log('✅ Project added successfully');
    showNotification('Project added successfully!', 'success');
    
    return newProject;
}

export function deleteProject(projectId) {
    const index = projects.findIndex(p => p.id === projectId);
    if (index > -1) {
        projects.splice(index, 1);
        saveProjectsToStorage();
        mergeAndRenderProjects();
        
        console.log('🗑️ Project deleted successfully');
        showNotification('Project deleted successfully!', 'success');
    }
}

export function updateProject(projectId, updates) {
    const index = projects.findIndex(p => p.id === projectId);
    if (index > -1) {
        projects[index] = { ...projects[index], ...updates };
        saveProjectsToStorage();
        mergeAndRenderProjects();
        
        console.log('✅ Project updated successfully');
        showNotification('Project updated successfully!', 'success');
    }
}

export function getProjects() {
    return [...projects, ...githubProjects];
}

export function getLocalProjects() {
    return projects;
}

window.loadMoreProjects = () => {
    // This could open a modal with all projects or navigate to a dedicated projects page
    showNotification('Feature coming soon: View all projects page', 'info');
};

// Auto-refresh GitHub projects every 30 minutes
setInterval(() => {
    if (document.visibilityState === 'visible') {
        fetchGitHubRepositories();
    }
}, 30 * 60 * 1000);