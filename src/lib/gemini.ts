/**
 * SETUP GUIDE (4 steps)
 * STEP 1: Get Gemini API key from Google AI Studio
 * STEP 2: Set GEMINI_API_KEY in .env.local
 * STEP 3: Set GEMINI_MODEL="gemini-2.5-flash-lite" in .env.local
 * STEP 4: Configure AI_RATE_LIMIT for request throttling
 * NOTE: Streaming AI responses with context from database
 * TODO: Add conversation history and memory
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/db'

// BEGINNER: Set GEMINI_API_KEY="your-gemini-api-key" in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function buildAIContext(): Promise<string> {
  try {
    // Get profile data
    const profile = await prisma.profile.findFirst({
      include: { user: true },
    })

    // Get featured projects
    const projects = await prisma.project.findMany({
      where: { featured: true, status: 'PUBLISHED' },
      select: {
        title: true,
        description: true,
        technologies: true,
        category: true,
      },
      take: 5,
    })

    // Get recent blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        title: true,
        excerpt: true,
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    })

    // Build context string
    let context = `You are an AI assistant for Hit Kalariya's portfolio website.`

    if (profile) {
      context += `\n\nABOUT HIT KALARIYA:
- Name: ${profile.firstName} ${profile.lastName}
- Title: ${profile.title}
- Location: ${profile.location || 'Not specified'}
- Bio: ${profile.bio}
- GitHub: ${profile.githubUrl || 'Not provided'}
- Website: ${profile.website || 'Not provided'}`

      // Parse and add skills
      try {
        const skills = JSON.parse(profile.skills)
        if (Array.isArray(skills)) {
          context += `\n- Skills: ${skills.map((s: any) => s.name).join(', ')}`
        }
      } catch (e) {
        // Skip skills if parsing fails
      }
    }

    if (projects.length > 0) {
      context += `\n\nFEATURED PROJECTS:`
      projects.forEach((project) => {
        context += `\n- ${project.title}: ${project.description}`
        try {
          const techs = JSON.parse(project.technologies)
          if (Array.isArray(techs)) {
            context += ` (Technologies: ${techs.join(', ')})`
          }
        } catch (e) {
          // Skip technologies if parsing fails
        }
      })
    }

    if (blogPosts.length > 0) {
      context += `\n\nRECENT BLOG POSTS:`
      blogPosts.forEach((post) => {
        context += `\n- ${post.title}`
        if (post.excerpt) {
          context += `: ${post.excerpt}`
        }
      })
    }

    context += `\n\nYour role is to help visitors learn about Hit's work, skills, and experience. Be helpful, professional, and knowledgeable about AI/ML and web development topics. Keep responses concise and relevant.`

    return context
  } catch (error) {
    console.error('Error building AI context:', error)
    return 'You are an AI assistant for Hit Kalariya, an AI/ML Developer. Help visitors learn about his work and expertise.'
  }
}

export async function generateAIResponse(
  message: string,
  context?: string
): Promise<ReadableStream<Uint8Array>> {
  // PERF: Use streaming for better UX with long responses
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  })

  const systemContext = context || await buildAIContext()
  const fullPrompt = `${systemContext}\n\nUser question: ${message}\n\nProvide a helpful and informative response:`

  try {
    const result = await model.generateContentStream(fullPrompt)
    
    // Convert the async generator to a ReadableStream
    const encoder = new TextEncoder()
    
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            controller.enqueue(encoder.encode(text))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate AI response')
  }
}

// Mock response for development
export function getMockAIResponse(message: string): ReadableStream<Uint8Array> {
  const mockResponses = [
    "Thanks for your question! Hit Kalariya is an experienced AI/ML Developer specializing in building intelligent systems and modern web applications.",
    "That's a great question about Hit's work! He focuses on machine learning, deep learning, and creating production-ready AI solutions.",
    "I'd be happy to help you learn more about Hit's expertise in AI/ML development and his various projects.",
    "Hit has extensive experience in Python, TensorFlow, React, and modern web technologies. Would you like to know more about any specific area?",
  ]

  const response = mockResponses[Math.floor(Math.random() * mockResponses.length)]
  
  return new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      // Simulate streaming by sending chunks
      const words = response.split(' ')
      let i = 0
      
      const sendChunk = () => {
        if (i < words.length) {
          const chunk = words[i] + ' '
          controller.enqueue(encoder.encode(chunk))
          i++
          setTimeout(sendChunk, 50) // Simulate typing delay
        } else {
          controller.close()
        }
      }
      
      sendChunk()
    },
  })
}