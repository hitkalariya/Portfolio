
// src/components/ProjectCard.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    slug: string
    description: string
    image: string | null
    technologies: string
    githubUrl: string | null
    liveUrl: string | null
    category: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const technologies = JSON.parse(project.technologies) as string[]
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {project.image && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold line-clamp-2">{project.title}</h3>
          <Badge variant="secondary">{project.category}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3">{project.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {technologies.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{technologies.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/projects/${project.slug}`}>
              View Details
            </Link>
          </Button>
          
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          
          {project.liveUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}