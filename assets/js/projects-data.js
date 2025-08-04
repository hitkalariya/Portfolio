// Projects data - Add new projects here and they will automatically appear in Recent Projects
const projectsData = [
    {
        id: 1,
        title: "AI-Powered Customer Segmentation",
        category: "ML Projects",
        image: "assets/img/project-image/Project_thumbnail.png",
        description: "Advanced machine learning model for customer segmentation using clustering algorithms and behavioral analysis.",
        detailsUrl: "portfolio-details.html?project=customer-segmentation",
        githubUrl: "https://github.com/hitkalariya/customer-segmentation-ml",
        technologies: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
        priority: 1, // Higher priority = appears first in Recent Projects
        featured: true,
        date: "2024-01-15"
    },
    {
        id: 2,
        title: "Computer Vision Object Detection",
        category: "ML Projects", 
        image: "assets/img/project-image/Project_thumbnail_2.png",
        description: "Real-time object detection system using YOLO algorithm for autonomous vehicle applications.",
        detailsUrl: "portfolio-details.html?project=object-detection",
        githubUrl: "https://github.com/hitkalariya/yolo-object-detection",
        technologies: ["Python", "OpenCV", "TensorFlow", "YOLO"],
        priority: 2,
        featured: true,
        date: "2024-02-20"
    },
    {
        id: 3,
        title: "Natural Language Processing Chatbot",
        category: "AI Projects",
        image: "assets/img/project-image/Project_thumbnail.png",
        description: "Intelligent chatbot using transformer models for customer service automation.",
        detailsUrl: "portfolio-details.html?project=nlp-chatbot",
        githubUrl: "https://github.com/hitkalariya/nlp-chatbot-ai",
        technologies: ["Python", "Transformers", "Flask", "React"],
        priority: 3,
        featured: true,
        date: "2024-03-10"
    },
    {
        id: 4,
        title: "Predictive Analytics Dashboard",
        category: "Data Science",
        image: "assets/img/project-image/Project_thumbnail_2.png",
        description: "Interactive dashboard for sales forecasting and business intelligence.",
        detailsUrl: "portfolio-details.html?project=predictive-analytics",
        technologies: ["Python", "Plotly", "Streamlit", "SQL"],
        priority: 4,
        featured: false,
        date: "2024-01-05"
    },
    {
        id: 5,
        title: "Deep Learning Image Classification",
        category: "Deep Learning",
        image: "assets/img/project-image/Project_thumbnail.png",
        description: "CNN-based image classification system with 95% accuracy on custom dataset.",
        detailsUrl: "portfolio-details.html?project=image-classification",
        technologies: ["Python", "TensorFlow", "Keras", "CNN"],
        priority: 5,
        featured: false,
        date: "2023-12-15"
    }
];

// Function to get top N projects sorted by priority
function getTopProjects(n = 3) {
    return projectsData
        .filter(project => project.featured)
        .sort((a, b) => a.priority - b.priority)
        .slice(0, n);
}

// Function to get all projects
function getAllProjects() {
    return projectsData.sort((a, b) => a.priority - b.priority);
}

// Function to get project by ID
function getProjectById(id) {
    return projectsData.find(project => project.id === id);
}

// Function to add a new project (for future use)
function addProject(projectData) {
    const newId = Math.max(...projectsData.map(p => p.id)) + 1;
    const newProject = {
        id: newId,
        ...projectData,
        priority: projectData.priority || projectsData.length + 1
    };
    projectsData.push(newProject);
    return newProject;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { projectsData, getTopProjects, getAllProjects, getProjectById, addProject };
}
