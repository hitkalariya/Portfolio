
// === src/components/SkillChart.tsx ===
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface SkillChartProps {
  skill: {
    name: string
    level: number
  }
  delay?: number
}

export function SkillChart({ skill, delay = 0 }: SkillChartProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{skill.name}</span>
          <span className="text-xs text-muted-foreground">{skill.level}%</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ 
              duration: 1, 
              delay: delay,
              ease: "easeOut" 
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
