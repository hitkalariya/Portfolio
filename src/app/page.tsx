/**
 * SETUP GUIDE (3 steps)
 * STEP 1: Ensure 3D hero is enabled with NEXT_PUBLIC_ENABLE_3D="true"
 * STEP 2: Configure featured projects in database
 * STEP 3: Test responsive design on different screen sizes
 * NOTE: Split hero layout with 3D canvas and content
 * TODO: Add testimonials and latest blog posts sections
 */

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProjectCard } from '@/components/ProjectCard'
import { TestimonialSlider } from '@/components/TestimonialSlider'
import { SkillChart } from '@/components/SkillChart'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { prisma } from '@/lib/db'
import { pageVariants, staggerContainer, fadeInUp } from '@/lib/motion'
import { ArrowRight, Download, Mail, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

// BEGINNER: Set NEXT_PUBLIC_ENABLE_3D="true" in .env.local to enable 3D hero
const Hero3D = dynamic(() => import('@/components/three/Hero3D'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary animate-pulse rounded-lg" />,
})

async function getFeaturedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        featured: true,
        status: 'PUBLISHED',
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 6,
    })
    return projects
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
}

async function getProfile() {
  try {
    const profile = await prisma.profile.findFirst({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
    return profile
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export default async function HomePage() {
  const [featuredProjects, profile] = await Promise.all([
    getFeaturedProjects(),
    getProfile(),
  ])

  const skills = profile?.skills ? JSON.parse(profile.skills) : []
  const enable3D = process.env.NEXT_PUBLIC_ENABLE_3D === 'true'

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={fadeInUp}
              className="space-y-8 text-center lg:text-left"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                >
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                    👋 Welcome to my portfolio
                  </span>
                </motion.div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="block">Hi, I'm</span>
                  <span className="block gradient-shift bg-clip-text text-transparent">
                    {profile?.firstName || 'Hit'} {profile?.lastName || 'Kalariya'}
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                  {profile?.title || 'AI/ML Developer'}
                </p>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {profile?.bio?.slice(0, 200) || 'Passionate about building intelligent systems and creating amazing user experiences with cutting-edge technology.'}
                  {profile?.bio && profile.bio.length > 200 && '...'}
                </p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                variants={staggerContainer}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.div variants={fadeInUp}>
                  <Button asChild size="lg" className="group">
                    <Link href="/projects">
                      View My Work
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/contact">
                      <Mail className="mr-2 h-5 w-5" />
                      Get In Touch
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={fadeInUp}
                className="flex gap-4 justify-center lg:justify-start"
              >
                {profile?.githubUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </Button>
                )}
                
                {profile?.linkedinUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </Button>
                )}
                
                {profile?.resumeUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-5 w-5" />
                      <span className="sr-only">Resume</span>
                    </a>
                  </Button>
                )}
              </motion.div>
            </motion.div>

            {/* Right 3D Canvas */}
            <motion.div
              variants={fadeInUp}
              className="relative h-[500px] lg:h-[600px] rounded-lg overflow-hidden"
            >
              {enable3D ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <Hero3D />
                </Suspense>
              ) : (
                // ACCESSIBILITY: Fallback animated SVG when 3D is disabled
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse" />
                    <p className="text-lg font-medium text-muted-foreground">
                      AI/ML Developer
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/20 blur-3xl animate-pulse" />
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
                Skills & Expertise
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Technologies and tools I use to bring ideas to life
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {skills.slice(0, 6).map((skill: any, index: number) => (
                <motion.div key={skill.name} variants={fadeInUp}>
                  <SkillChart skill={skill} delay={index * 0.1} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/about">View All Skills</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
                Featured Projects
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A showcase of my recent work in AI/ML and web development
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {featuredProjects.map((project, index) => (
                <motion.div key={project.id} variants={fadeInUp}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <Button asChild size="lg">
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              What People Say
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Feedback from colleagues, clients, and collaborators
            </motion.p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <TestimonialSlider />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Let's Build Something Amazing Together
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you have a question or just want to say hello, I'd love to hear from you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      Start a Conversation
                      <Mail className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/about">Learn More About Me</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
/*
# Hit Kalariya Portfolio - Complete Next.js 14 Repository

## Project Structure
hit-kalariya-portfolio/
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── CHECKLIST.txt
├── Dockerfile
├── GETTING_STARTED.txt
├── README.md
├── docker-compose.yml
├── next.config.js
├── package.json
├── playwright.config.ts
├── postcss.config.js
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── scripts/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx
│   │   │       ├── projects/
│   │   │       │   ├── create/
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── edit/
│   │   │       │   │   └── [id]/
│   │   │       │   │       └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── blog/
│   │   │       │   ├── create/
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── edit/
│   │   │       │   │   └── [id]/
│   │   │       │   │       └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── media/
│   │   │       │   └── page.tsx
│   │   │       ├── profile/
│   │   │       │   └── page.tsx
│   │   │       ├── settings/
│   │   │       │   └── page.tsx
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   └── chat/
│   │   │   │       └── route.ts
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── contact/
│   │   │   │   └── route.ts
│   │   │   ├── github/
│   │   │   │   └── repos/
│   │   │   │       └── route.ts
│   │   │   └── uploads/
│   │   │       └── cloudinary-sign/
│   │   │           └── route.ts
│   │   ├── blog/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   └── projects/
│   │       ├── [slug]/
│   │       │   └── page.tsx
│   │       └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── BlogForm.tsx
│   │   │   ├── MediaUpload.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   └── ProjectForm.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Navigation.tsx
│   │   ├── three/
│   │   │   └── Hero3D.tsx
│   │   ├── ui/
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── toast.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── ContactForm.tsx
│   │   ├── CursorTrail.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── SkillChart.tsx
│   │   ├── TestimonialSlider.tsx
│   │   └── Timeline.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── cloudinary.ts
│   │   ├── db.ts
│   │   ├── email.ts
│   │   ├── gemini.ts
│   │   ├── github.ts
│   │   ├── motion.ts
│   │   ├── rate-limit.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── middleware.ts
│   └── types/
│       └── index.ts
├── tailwind.config.js
├── tsconfig.json
└── vitest.config.ts

## File Contents

### .env.example
```env
# Database
DATABASE_URL="file:./dev.db"
# For production: DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# Authentication
AUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Site Configuration
NEXT_PUBLIC_SITE_NAME="Hit Kalariya Portfolio"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Feature Flags
NEXT_PUBLIC_ENABLE_3D="true"
NEXT_PUBLIC_ENABLE_CURSOR_EFFECTS="true"
NEXT_PUBLIC_REDUCED_MOTION="false"
ENABLE_BLOG="true"
MOCK_MODE="true"

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# GitHub Integration
GITHUB_TOKEN="github_pat_your_personal_access_token"
GITHUB_USERNAME="hitkalariya"

# AI Assistant (Gemini)
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash-lite"
AI_RATE_LIMIT="10"

# Email
RESEND_API_KEY="re_your_resend_api_key"
CONTACT_EMAIL="contact@hitkalariya.dev"
*/
