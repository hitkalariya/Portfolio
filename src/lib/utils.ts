import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date helper
export function formatDate(date: Date | string | null): string {
  if (!date) return 'Present'
  
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Calculate read time for blog posts
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const readTime = Math.ceil(words / wordsPerMinute)
  return readTime
}

// Truncate text helper
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength).trim() + '...'
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Card tilt utility with clamping
export function calculateTilt(
  mouseX: number, 
  mouseY: number, 
  rect: DOMRect,
  maxTilt: number = 8
) {
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const deltaX = (mouseX - centerX) / (rect.width / 2)
  const deltaY = (mouseY - centerY) / (rect.height / 2)
  
  // PERF: Clamp tilt to prevent excessive rotation
  const tiltX = Math.max(-maxTilt, Math.min(maxTilt, deltaY * maxTilt))
  const tiltY = Math.max(-maxTilt, Math.min(maxTilt, -deltaX * maxTilt))
  
  return { tiltX, tiltY }
}