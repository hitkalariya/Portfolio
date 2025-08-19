import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AIAssistant } from '@/components/AIAssistant'
import { CursorTrail } from '@/components/CursorTrail'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Hit Kalariya | AI/ML Developer',
    template: '%s | Hit Kalariya',
  },
  description: 'Passionate AI/ML Developer building intelligent systems and modern web applications. Expertise in machine learning, deep learning, and full-stack development.',
  keywords: ['AI', 'ML', 'Machine Learning', 'Deep Learning', 'Web Development', 'React', 'Python', 'TensorFlow'],
  authors: [{ name: 'Hit Kalariya', url: 'https://hitkalariya.dev' }],
  creator: 'Hit Kalariya',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Hit Kalariya Portfolio',
    title: 'Hit Kalariya | AI/ML Developer',
    description: 'Passionate AI/ML Developer building intelligent systems and modern web applications.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hit Kalariya Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hit Kalariya | AI/ML Developer',
    description: 'Passionate AI/ML Developer building intelligent systems and modern web applications.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          
          {/* AI Assistant */}
          <AIAssistant />
          
          {/* Cursor Effects */}
          {process.env.NEXT_PUBLIC_ENABLE_CURSOR_EFFECTS === 'true' && (
            <CursorTrail />
          )}
        </Providers>
      </body>
    </html>
  )
}