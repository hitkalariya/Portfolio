
// === src/app/api/ai/chat/route.ts ===
/**
 * SETUP GUIDE (5 steps)
 * STEP 1: Install @google/generative-ai package
 * STEP 2: Get API key from Google AI Studio
 * STEP 3: Set GEMINI_API_KEY and GEMINI_MODEL in .env.local
 * STEP 4: Configure AI_RATE_LIMIT for request throttling
 * STEP 5: Test with frontend chat component
 * NOTE: Streaming AI responses with rate limiting
 * TODO: Add conversation memory and context retention
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse, getMockAIResponse } from '@/lib/gemini'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { aiChatSchema } from '@/lib/validations'

// BEGINNER: Set GEMINI_API_KEY="your-gemini-api-key" in .env.local

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { message } = aiChatSchema.parse(body)

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Use mock response in development or when API key is missing
    if (process.env.MOCK_MODE === 'true' || !process.env.GEMINI_API_KEY) {
      const mockStream = getMockAIResponse(message)
      return new NextResponse(mockStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
      })
    }

    // Generate AI response
    const responseStream = await generateAIResponse(message)
    
    return new NextResponse(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      },
    })
  } catch (error) {
    console.error('AI Chat API error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
