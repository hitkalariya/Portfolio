import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const skills = [
  { category: 'AI/ML', items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'Hugging Face'] },
  { category: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'Go', 'SQL'] },
  { category: 'Frontend', items: ['React', 'Next.js', 'Three.js', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend', items: ['Node.js', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis'] },
  { category: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Terraform'] },
  { category: 'Tools', items: ['Jupyter', 'VSCode', 'Git', 'Figma', 'Postman'] }
];

const timeline = [
  {
    year: '2024',
    title: 'Senior AI/ML Developer',
    company: 'Tech Innovation Labs',
    description: 'Leading AI initiatives and developing cutting-edge machine learning solutions.'
  },
  {
    year: '2023',
    title: 'ML Engineer',
    company: 'DataFlow Systems',
    description: 'Built end-to-end ML pipelines and deployed models at scale.'
  },
  {
    year: '2022',
    title: 'AI Developer',
    company: 'StartupAI',
    description: 'Developed computer vision and NLP solutions for emerging technologies.'
  },
  {
    year: '2021',
    title: 'Junior Developer',
    company: 'TechCorp',
    description: 'Started journey in software development with focus on data science.'
  }
];

export const AboutSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            About <span className="text-gradient-primary">Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate AI/ML developer with expertise in building intelligent systems 
            that solve real-world problems through innovative technology solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gradient-secondary">My Journey</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I'm a dedicated AI/ML developer with a passion for creating intelligent systems 
                that push the boundaries of what's possible. My journey in technology began with 
                a fascination for how machines can learn and adapt.
              </p>
              <p>
                Over the years, I've specialized in developing end-to-end machine learning solutions, 
                from data preprocessing and model training to deployment and monitoring. I believe 
                in the power of AI to transform industries and improve lives.
              </p>
              <p>
                When I'm not coding, you'll find me exploring the latest research papers, 
                contributing to open-source projects, or mentoring aspiring developers in the 
                AI/ML community.
              </p>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gradient-secondary">Experience</h3>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-8"
                >
                  {/* Timeline line */}
                  <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-primary to-transparent" />
                  <div className="absolute left-[-4px] top-2 w-2 h-2 bg-primary rounded-full" />
                  
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{item.year}</Badge>
                      <span className="text-sm font-semibold text-gradient-primary">{item.company}</span>
                    </div>
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center text-gradient-secondary">
            Skills & Technologies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass border-primary/20 h-full">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4 text-gradient-primary">
                      {skillGroup.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};