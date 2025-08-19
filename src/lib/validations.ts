/**
 * SETUP GUIDE (2 steps)
 * STEP 1: Install zod for validation
 * STEP 2: Use with react-hook-form for type-safe forms
 * NOTE: Centralized validation schemas for consistency
 * TODO: Add more specific validation rules for different content types
 */

import { z } from 'zod'

// BEGINNER: These schemas validate form data before submission

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().optional(), // Anti-spam field
})

export type ContactFormData = z.infer<typeof contactSchema>

// Project form validation
export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  image: z.string().url().optional(),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Blog post validation
export const blogPostSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z.string().max(200, 'Excerpt must be less than 200 characters').optional(),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  image: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
})

export type BlogPostFormData = z.infer<typeof blogPostSchema>

// Profile form validation
export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  title: z.string().min(2, 'Professional title is required'),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  avatar: z.string().url().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

// AI chat message validation
export const aiChatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  context: z.string().optional(),
})

export type AIChatData = z.infer<typeof aiChatSchema>

// Media upload validation
export const mediaSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  url: z.string().url('Invalid URL'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().positive('Size must be positive'),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  alt: z.string().optional(),
  folder: z.string().optional(),
})

export type MediaFormData = z.infer<typeof mediaSchema>