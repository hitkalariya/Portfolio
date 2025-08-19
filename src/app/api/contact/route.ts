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
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Send email to admin
    const contactEmailResult = await sendEmail({
      to: process.env.CONTACT_EMAIL!,
      subject: `Portfolio Contact: ${subject}`,
      html: createContactEmailHTML({ name, email, subject, message }),
      replyTo: email,
    })

    if (!contactEmailResult.success) {
      throw new Error(contactEmailResult.error)
    }

    // Send auto-reply to user
    await sendEmail({
      to: email,
      subject: 'Thank you for your message!',
      html: createAutoReplyHTML(name),
    })

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}