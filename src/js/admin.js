import { addProject, deleteProject, getLocalProjects } from './projects.js';
import { updateAIConfig, getAIConfig } from './ai-assistant.js';
import { showModal, hideModal } from './animations.js';

export function initializeAdmin() {
    console.log('⚙️ Initializing admin panel...');
    
    setupAdminTabs();
    setupProjectManagement();
    setupAIConfiguration();
    renderAdminProjects();
}

function setupAdminTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab panel
            tabPanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(`${targetTab}-panel`).classList.add('active');
        });
    });
}

function setupProjectManagement() {
    const projectForm = document.getElementById('projectForm');
    
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(projectForm);
        const imageFile = formData.get('projectImage');
        
        let imageUrl = '';
        if (imageFile && imageFile.size > 0) {
            imageUrl = await handleImageUpload(imageFile);
        }
        
        const projectData = {
            title: formData.get('projectTitle'),
            description: formData.get('projectDescription'),
            category: formData.get('projectCategory'),
            technologies: formData.get('projectTechnologies').split(',').map(t => t.trim()).filter(t => t),
            githubUrl: formData.get('projectGithub'),
            image: imageUrl,
            featured: true // New projects are featured by default
        };
        
        // Validate required fields
        if (!projectData.title || !projectData.description || !projectData.category) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Add project
        addProject(projectData);
        
        // Reset form and close modal
        projectForm.reset();
        closeAddProjectModal();
        renderAdminProjects();
    });
}

async function handleImageUpload(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

function setupAIConfiguration() {
    const apiKeyInput = document.getElementById('geminiApiKey');
    const modelSelect = document.getElementById('aiModel');
    const temperatureSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('tempValue');
    
    // Load current config
    const config = getAIConfig();
    apiKeyInput.value = config.apiKey;
    modelSelect.value = config.model;
    temperatureSlider.value = config.temperature;
    tempValue.textContent = config.temperature;
    
    // Temperature slider
    temperatureSlider.addEventListener('input', (e) => {
        tempValue.textContent = e.target.value;
    });
    
    // Save configuration
    window.saveAIConfig = () => {
        const newConfig = {
            apiKey: apiKeyInput.value.trim(),
            model: modelSelect.value,
            temperature: parseFloat(temperatureSlider.value)
        };
        
        updateAIConfig(newConfig);
    };
}

function renderAdminProjects() {
    const projectsList = document.getElementById('adminProjectsList');
    const localProjects = getLocalProjects();
    
    if (localProjects.length === 0) {
        projectsList.innerHTML = `
            <div class="empty-state">
                <p>No custom projects yet. Add your first project!</p>
            </div>
        `;
        return;
    }
    
    projectsList.innerHTML = localProjects.map(project => `
        <div class="admin-project-item">
            <div class="project-info">
                <h4>${project.title}</h4>
                <p>${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
                <div class="project-meta">
                    <span class="category-badge">${project.category}</span>
                    <span class="date-badge">${new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="project-actions">
                <button class="btn btn-small btn-outline" onclick="editProject('${project.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                </button>
                <button class="btn btn-small" style="background: var(--error); color: white;" onclick="confirmDeleteProject('${project.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Global functions for admin actions
window.openAddProjectModal = () => {
    const modal = document.getElementById('addProjectModal');
    showModal(modal);
};

window.closeAddProjectModal = () => {
    const modal = document.getElementById('addProjectModal');
    hideModal(modal);
};

window.editProject = (projectId) => {
    // This would open the edit modal with pre-filled data
    showNotification('Edit functionality coming soon!', 'info');
};

window.confirmDeleteProject = (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
        deleteProject(projectId);
        renderAdminProjects();
    }
};

// Admin authentication (simple password protection)
let isAdminAuthenticated = sessionStorage.getItem('admin-auth') === 'true';

export function requireAdminAuth() {
    if (!isAdminAuthenticated) {
        const password = prompt('Enter admin password:');
        if (password === 'admin123') { // Change this to a secure password
            isAdminAuthenticated = true;
            sessionStorage.setItem('admin-auth', 'true');
            return true;
        } else {
            showNotification('Invalid password', 'error');
            return false;
        }
    }
    return true;
}

// Check admin auth when accessing admin section
document.addEventListener('DOMContentLoaded', () => {
    const adminNavLink = document.querySelector('[data-section="admin"]');
    if (adminNavLink) {
        adminNavLink.addEventListener('click', (e) => {
            if (!requireAdminAuth()) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
});

// Export admin functions
window.adminFunctions = {
    renderAdminProjects,
    requireAdminAuth
};