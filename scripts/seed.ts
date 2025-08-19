/**
 * SETUP GUIDE (4 steps)
 * STEP 1: Ensure DATABASE_URL is set in .env.local
 * STEP 2: Run `pnpm db:push` to create database schema
 * STEP 3: Run `pnpm db:seed` to populate with sample data
 * STEP 4: Login with admin@portfolio.dev / ChangeMe!123
 * NOTE: This creates admin user + sample content for development
 * TODO: Add more realistic sample projects and blog posts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // BEGINNER: Ensure NEXT_PUBLIC_SITE_NAME="Hit Kalariya Portfolio" in .env.local
  const hashedPassword = await bcrypt.hash('ChangeMe!123', 12)

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@portfolio.dev' },
    update: {},
    create: {
      email: 'admin@portfolio.dev',
      name: 'Hit Kalariya',
      role: 'ADMIN',
      password: hashedPassword,
    },
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create profile
  const profile = await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      firstName: 'Hit',
      lastName: 'Kalariya',
      title: 'AI/ML Developer',
      bio: `Passionate AI/ML Developer with expertise in machine learning, deep learning, and modern web technologies. I build intelligent systems that solve real-world problems and create seamless user experiences.

I specialize in developing end-to-end AI solutions, from data preprocessing and model training to deployment and monitoring. My work spans computer vision, natural language processing, and predictive analytics.

When I'm not coding, you'll find me exploring the latest research papers, contributing to open-source projects, or sharing knowledge through technical writing and mentoring.`,
      location: 'Surat, Gujarat, India',
      website: 'https://hitkalariya.dev',
      githubUrl: 'https://github.com/hitkalariya',
      linkedinUrl: 'https://linkedin.com/in/hitkalariya',
      skills: JSON.stringify([
        { name: 'Python', level: 95 },
        { name: 'Machine Learning', level: 90 },
        { name: 'TensorFlow/PyTorch', level: 85 },
        { name: 'JavaScript/TypeScript', level: 88 },
        { name: 'React/Next.js', level: 82 },
        { name: 'Node.js', level: 80 },
        { name: 'Docker', level: 75 },
        { name: 'AWS/Cloud', level: 70 },
      ]),
      experience: JSON.stringify([
        {
          title: 'Senior AI/ML Developer',
          company: 'TechCorp Solutions',
          location: 'Remote',
          startDate: '2022-03-01',
          endDate: null,
          description: 'Leading AI initiatives, building ML pipelines, and mentoring junior developers.',
          current: true,
        },
        {
          title: 'Full Stack Developer',
          company: 'StartupXYZ',
          location: 'Surat, Gujarat',
          startDate: '2020-06-01',
          endDate: '2022-02-28',
          description: 'Developed web applications and integrated ML models into production systems.',
          current: false,
        },
      ]),
      education: JSON.stringify([
        {
          degree: 'Master of Technology',
          field: 'Computer Science & Engineering',
          school: 'Indian Institute of Technology',
          location: 'Mumbai, India',
          startDate: '2018-08-01',
          endDate: '2020-05-31',
          gpa: '8.9/10',
        },
        {
          degree: 'Bachelor of Engineering',
          field: 'Computer Engineering',
          school: 'Gujarat Technological University',
          location: 'Surat, Gujarat',
          startDate: '2014-08-01',
          endDate: '2018-05-31',
          gpa: '8.7/10',
        },
      ]),
    },
  })

  console.log('✅ Created profile for:', profile.firstName, profile.lastName)

  // Create sample projects
  const projects = [
    {
      title: 'Intelligent Document Analysis System',
      slug: 'intelligent-document-analysis',
      description: 'AI-powered system for extracting and analyzing information from complex documents using computer vision and NLP.',
      content: `# Intelligent Document Analysis System

A comprehensive AI solution that processes various document types including PDFs, images, and scanned documents to extract meaningful information and insights.

## Key Features

- **Multi-format Support**: Handles PDFs, images, Word documents, and scanned files
- **OCR Integration**: Advanced text extraction with 99%+ accuracy
- **NLP Processing**: Entity recognition, sentiment analysis, and classification
- **Real-time Processing**: Processes documents in under 30 seconds
- **API Integration**: RESTful API for seamless integration

## Technical Implementation

### Architecture
The system follows a microservices architecture with the following components:
- Document ingestion service
- OCR processing pipeline
- NLP analysis engine
- Results aggregation API

### Technologies Used
- **Backend**: Python, FastAPI, Celery
- **ML/AI**: TensorFlow, OpenCV, spaCy, Transformers
- **Database**: PostgreSQL, Redis
- **Infrastructure**: Docker, Kubernetes, AWS

## Results
- Reduced document processing time by 80%
- Achieved 98% accuracy in data extraction
- Processed over 100K documents in production`,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4YjVjZjYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RG9jdW1lbnQgQUk8L3RleHQ+PC9zdmc+',
      technologies: JSON.stringify(['Python', 'TensorFlow', 'OpenCV', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS']),
      githubUrl: 'https://github.com/hitkalariya/document-ai',
      liveUrl: 'https://document-ai-demo.vercel.app',
      category: 'AI/ML',
      featured: true,
      status: 'PUBLISHED',
      startDate: new Date('2023-01-15'),
      endDate: new Date('2023-06-30'),
    },
    {
      title: 'Real-time Chat Application with AI Moderation',
      slug: 'ai-moderated-chat',
      description: 'Modern chat application with real-time messaging and AI-powered content moderation for safe communication.',
      content: `# Real-time Chat Application with AI Moderation

A scalable chat application built with modern web technologies, featuring real-time messaging and intelligent content moderation powered by machine learning.

## Features

- **Real-time Messaging**: Instant message delivery using WebSockets
- **AI Content Moderation**: Automatic detection and filtering of inappropriate content
- **Multi-room Support**: Create and join different chat rooms
- **User Authentication**: Secure login with JWT tokens
- **Mobile Responsive**: Works seamlessly on all devices

## AI Moderation System

The AI moderation system uses natural language processing to:
- Detect toxic language and harassment
- Filter spam and promotional content  
- Identify and blur inappropriate images
- Provide real-time feedback to users

## Technical Stack

- **Frontend**: React, TypeScript, Socket.io Client
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB with Mongoose
- **AI/ML**: Python, scikit-learn, NLTK
- **Deployment**: Docker, Nginx, PM2

## Performance Metrics

- Handles 10K+ concurrent users
- <100ms message latency
- 99.5% uptime in production
- 95% accuracy in content moderation`,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwZjc3MmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxNmE1NGIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2hhdCBBST48L3RleHQ+PC9zdmc+',
      technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Socket.io', 'MongoDB', 'Python', 'scikit-learn']),
      githubUrl: 'https://github.com/hitkalariya/ai-chat',
      liveUrl: 'https://ai-chat-demo.vercel.app',
      category: 'Full Stack',
      featured: true,
      status: 'PUBLISHED',
      startDate: new Date('2023-08-01'),
      endDate: new Date('2023-11-15'),
    },
  ]

  for (const projectData of projects) {
    const project = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {},
      create: projectData,
    })
    console.log('✅ Created project:', project.title)
  }

  // Create sample blog posts (if ENABLE_BLOG is true)
  const blogPosts = [
    {
      title: 'Building Scalable AI Systems: Lessons Learned',
      slug: 'building-scalable-ai-systems',
      excerpt: 'Key insights and best practices from deploying machine learning models at scale in production environments.',
      content: `# Building Scalable AI Systems: Lessons Learned

After deploying numerous AI systems in production, I've learned valuable lessons about building scalable, maintainable AI solutions. Here are the key insights that can help you avoid common pitfalls.

## 1. Start with the Data Pipeline

The foundation of any successful AI system is a robust data pipeline. Poor data quality leads to poor model performance, no matter how sophisticated your algorithms are.

### Key Principles:
- **Data Validation**: Implement comprehensive validation at every stage
- **Version Control**: Track data changes and lineage
- **Monitoring**: Set up alerts for data drift and anomalies
- **Backup Strategy**: Always have a recovery plan

## 2. Model Lifecycle Management

Managing models in production requires a systematic approach:

### Development Phase
- Use reproducible environments (Docker, conda)
- Track experiments with tools like MLflow or Weights & Biases
- Implement proper version control for code and models

### Deployment Phase
- A/B testing for gradual rollouts
- Canary deployments to minimize risk
- Automated rollback mechanisms

### Monitoring Phase
- Performance metrics tracking
- Data drift detection
- Model degradation alerts

## 3. Infrastructure Considerations

### Scalability
- Use container orchestration (Kubernetes)
- Implement horizontal scaling
- Consider serverless options for variable workloads

### Cost Optimization
- Right-size your compute resources
- Use spot instances for training
- Implement auto-scaling policies

## 4. Security and Compliance

- Encrypt data at rest and in transit
- Implement proper access controls
- Maintain audit logs
- Ensure GDPR/privacy compliance

## Conclusion

Building scalable AI systems is challenging but rewarding. Focus on fundamentals: quality data, robust pipelines, and comprehensive monitoring. Start simple and iterate based on real-world feedback.`,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmMzY4ZTciLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlZjQ0NDQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNjKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QUkgU3lzdGVtczwvdGV4dD48L3N2Zz4=',
      tags: JSON.stringify(['AI/ML', 'Scalability', 'Production', 'Best Practices']),
      status: 'PUBLISHED',
      published: true,
      publishedAt: new Date('2024-01-15'),
      readTime: 8,
      views: 1250,
    },
    {
      title: 'The Future of AI in Web Development',
      slug: 'future-of-ai-web-development',
      excerpt: 'Exploring how artificial intelligence is transforming web development and what developers need to know.',
      content: `# The Future of AI in Web Development

Artificial Intelligence is revolutionizing how we build and interact with web applications. From automated code generation to intelligent user interfaces, AI is becoming an integral part of the web development ecosystem.

## Current AI Applications in Web Development

### 1. Code Generation and Assistance
- **GitHub Copilot**: AI-powered code completion
- **ChatGPT/Claude**: Code explanation and debugging
- **Tabnine**: Intelligent code suggestions

### 2. Design and UX
- **Figma AI**: Automated design generation
- **Adobe Sensei**: Intelligent image editing
- **Personalization engines**: Dynamic content adaptation

### 3. Testing and Quality Assurance
- **Automated testing**: AI-generated test cases
- **Bug detection**: Intelligent code analysis
- **Performance optimization**: AI-driven improvements

## Emerging Trends

### Natural Language Interfaces
Web applications are increasingly incorporating conversational AI:
- Chatbots for customer support
- Voice-controlled interfaces
- Natural language queries for data

### Predictive User Experience
AI helps create more intuitive interfaces:
- Predictive search and suggestions
- Dynamic content prioritization
- Behavioral pattern recognition

### Automated Development Workflows
AI is streamlining development processes:
- Automated code reviews
- Intelligent deployment strategies
- Performance monitoring and optimization

## Challenges and Considerations

### Technical Challenges
- **Model accuracy and bias**
- **Data privacy and security**
- **Integration complexity**
- **Performance overhead**

### Ethical Considerations
- **Transparency in AI decisions**
- **User consent and privacy**
- **Algorithmic fairness**
- **Job displacement concerns**

## Preparing for the AI-Driven Future

### Skills to Develop
1. **Understanding AI fundamentals**
2. **Working with AI APIs and services**
3. **Data analysis and interpretation**
4. **Ethical AI practices**

### Tools to Learn
- Machine learning frameworks (TensorFlow.js, PyTorch)
- AI service integrations (OpenAI, Google AI, AWS AI)
- Data visualization libraries
- Natural language processing tools

## Conclusion

AI is not replacing web developers; it's augmenting our capabilities. The future belongs to developers who can effectively leverage AI tools while maintaining focus on user experience, ethical considerations, and technical excellence.

Stay curious, keep learning, and embrace the AI revolution in web development.`,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNkKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QUkgJiBXZWI8L3RleHQ+PC9zdmc+',
      tags: JSON.stringify(['AI', 'Web Development', 'Future Tech', 'Trends']),
      status: 'PUBLISHED',
      published: true,
      publishedAt: new Date('2024-02-01'),
      readTime: 12,
      views: 2100,
    },
  ]

  for (const postData of blogPosts) {
    const post = await prisma.blogPost.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData,
    })
    console.log('✅ Created blog post:', post.title)
  }

  // Create sample media files
  const mediaFiles = [
    {
      filename: 'hero-background.jpg',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Imhlcm8iIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxZTI5M2IiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyZDNkNDgiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjaGVybykiLz48L3N2Zz4=',
      mimeType: 'image/svg+xml',
      size: 1024,
      width: 1200,
      height: 600,
      alt: 'Hero background gradient',
      folder: 'backgrounds',
    },
    {
      filename: 'profile-avatar.jpg',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImF2YXRhciIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNjM2NmYxIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOGI1Y2Y2Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMDAiIGZpbGw9InVybCgjYXZhdGFyKSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SEo8L3RleHQ+PC9zdmc+',
      mimeType: 'image/svg+xml',
      size: 512,
      width: 200,
      height: 200,
      alt: 'Hit Kalariya profile avatar',
      folder: 'profile',
    },
  ]

  for (const mediaData of mediaFiles) {
    const media = await prisma.media.upsert({
      where: { filename: mediaData.filename },
      update: {},
      create: mediaData,
    })
    console.log('✅ Created media file:', media.filename)
  }

  console.log('🎉 Database seeded successfully!')
  console.log('👤 Admin login: admin@portfolio.dev / ChangeMe!123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })