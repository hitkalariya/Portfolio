
// === src/app/api/auth/[...nextauth]/route.ts ===
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// === src/app/api/contact/route.ts ===
/**
 * SETUP GUIDE (4 steps)
 * STEP 1: Configure RESEND_API_KEY in .env.local
 * STEP 2: Set CONTACT_EMAIL for receiving messages
 * STEP 3: Test contact form functionality
 * STEP 4: Set up email templates and auto-replies
 * NOTE: Server action for contact form with validation
 * TODO: Add spam protection and rate limiting
 */

import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { sendEmail, createContactEmailHTML, createAutoReplyHTML } from '@/lib/email'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

// BEGINNER: Set RESEND_API_KEY and CONTACT_EMAIL in .env.local

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, honeypot } = contactSchema.parse(body)

    // Honeypot spam protection
    if (honeypot) {
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      )
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 3, 60 * 1000) // 3 requests per minute
    
    if (!rateLimit.allowed) {
      return NextResponse.json(// Missing critical files for the portfolio project
