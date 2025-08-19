/**
 * SETUP GUIDE (4 steps)
 * STEP 1: Sign up for Resend account
 * STEP 2: Set RESEND_API_KEY in .env.local
 * STEP 3: Set CONTACT_EMAIL for receiving messages
 * STEP 4: Test with contact form
 * NOTE: Resend integration with Nodemailer fallback
 * TODO: Add email templates and attachments support
 */

import { Resend } from 'resend'
import nodemailer from 'nodemailer'

// BEGINNER: Set RESEND_API_KEY="re_your_resend_api_key" in .env.local
const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailData {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Try Resend first
    if (process.env.RESEND_API_KEY) {
      const response = await resend.emails.send({
        from: data.from || 'portfolio@hitkalariya.dev',
        to: data.to,
        subject: data.subject,
        html: data.html,
        replyTo: data.replyTo,
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      return { success: true }
    }

    // Fallback to Nodemailer (configure SMTP settings)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: data.from || process.env.SMTP_FROM,
      to: data.to,
      subject: data.subject,
      html: data.html,
      replyTo: data.replyTo,
    })

    return { success: true }
  } catch (error) {
    console.error('Email sending failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Contact form email template
export function createContactEmailHTML(data: {
  name: string
  email: string
  subject: string
  message: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Message</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #495057; }
          .value { margin-top: 5px; }
          .message { background: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Message</h2>
            <p>You received a new message through your portfolio contact form.</p>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${data.name} (${data.email})</div>
            </div>
            
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${data.subject}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="message">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

// Auto-reply email template
export function createAutoReplyHTML(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for your message</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .content { background: white; padding: 30px; border-radius: 8px; }
          .signature { margin-top: 30px; border-top: 1px solid #e9ecef; padding-top: 20px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Thank you for reaching out!</h2>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            
            <p>Thank you for your message! I've received your inquiry and will get back to you as soon as possible, typically within 24-48 hours.</p>
            
            <p>In the meantime, feel free to:</p>
            <ul>
              <li>Explore my <a href="${process.env.NEXT_PUBLIC_SITE_URL}/projects">projects</a></li>
              <li>Check out my <a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog">blog posts</a></li>
              <li>Connect with me on <a href="https://github.com/hitkalariya">GitHub</a></li>
            </ul>
            
            <p>Best regards,</p>
            
            <div class="signature">
              <strong>Hit Kalariya</strong><br>
              AI/ML Developer<br>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}">${process.env.NEXT_PUBLIC_SITE_URL}</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}