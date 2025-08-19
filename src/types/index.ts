export interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  id: string
  userId: string
  firstName: string
  lastName: string
  title: string
  bio: string
  location: string | null
  website: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  resumeUrl: string | null
  avatar: string | null
  skills: string
  experience: string
  education: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image: string | null
  gallery: string | null
  technologies: string
  githubUrl: string | null
  liveUrl: string | null
  category: string
  featured: boolean
  status: string
  startDate: Date | null
  endDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
  tags: string | null
  status: string
  published: boolean
  publishedAt: Date | null
  readTime: number | null
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface Media {
  id: string
  filename: string
  url: string
  publicId: string | null
  mimeType: string
  size: number
  width: number | null
  height: number | null
  alt: string | null
  folder: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Skill {
  name: string
  level: number
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  description: string
  current: boolean
}

export interface Education {
  degree: string
  field: string
  school: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
}

// Next.js specific types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }

  interface User {
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
  }
}