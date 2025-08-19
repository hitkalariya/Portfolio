
// === src/components/TestimonialSlider.tsx ===
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    content: "Hit's expertise in AI/ML is exceptional. He delivered a complex machine learning solution that exceeded our expectations and improved our business metrics significantly.",
    author: "Sarah Johnson",
    role: "CTO, TechCorp",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzY0NzQ4YiIvPjx0ZXh0IHg9IjIwIiB5PSIyNSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNKPC90ZXh0Pjwvc3ZnPg=="
  },
  {
    id: 2,
    content: "Working with Hit was a fantastic experience. His attention to detail and ability to translate complex AI concepts into practical solutions is remarkable.",
    author: "Michael Chen",
    role: "Product Manager, InnovateLab",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzc5N2E4ZCIvPjx0ZXh0IHg9IjIwIiB5PSIyNSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1DPC90ZXh0Pjwvc3ZnPg=="
  },
  {
    id: 3,
    content: "Hit's technical skills and problem-solving approach are outstanding. He consistently delivers high-quality code and innovative solutions.",
    author: "Emily Rodriguez",
    role: "Lead Developer, StartupXYZ",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzZkNzI4ZCIvPjx0ZXh0IHg9IjIwIiB5PSIyNSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVSPC90ZXh0Pjwvc3ZnPg=="
  }
]

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const next = () => {
    setCurrent(prev => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const previous = () => {
    setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardContent className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <Quote className="h-8 w-8 text-primary mx-auto" />
              
              <blockquote className="text-lg md:text-xl font-medium leading-relaxed">
                "{testimonials[current].content}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[current].avatar}
                  alt={testimonials[current].author}
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-left">
                  <div className="font-semibold">{testimonials[current].author}</div>
                  <div className="text-muted-foreground text-sm">{testimonials[current].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" size="sm" onClick={previous}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrent(index)
                setIsAutoPlaying(false)
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === current ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <Button variant="outline" size="sm" onClick={next}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
