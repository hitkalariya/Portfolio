import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Github, Linkedin, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'eid@example.com',
    href: 'mailto:eid@example.com'
  },
  {
    icon: Github,
    label: 'GitHub',
    value: '@hitkalariya',
    href: 'https://github.com/hitkalariya'
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Eid Kalaria',
    href: 'https://linkedin.com/in/eidkalaria'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Remote',
    href: null
  }
];

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

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
            Let's <span className="text-gradient-primary">Connect</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to collaborate on your next AI/ML project? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient-secondary">
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="glass"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="glass"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="glass"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="glass resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-hero" 
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gradient-secondary">
                Get in Touch
              </h3>
              <p className="text-muted-foreground mb-8">
                I'm always open to discussing new opportunities, interesting projects, 
                or just having a chat about AI and technology. Feel free to reach out!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                const content = (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className={`glass border-primary/20 transition-all duration-300 hover:border-primary/40 ${info.href ? 'cursor-pointer hover:scale-105' : ''}`}>
                      <CardContent className="p-6 text-center">
                        <IconComponent className="w-8 h-8 mx-auto mb-3 text-primary" />
                        <div className="text-sm text-muted-foreground mb-1">
                          {info.label}
                        </div>
                        <div className="font-medium">{info.value}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );

                return info.href ? (
                  <a 
                    key={info.label} 
                    href={info.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={info.label}>
                    {content}
                  </div>
                );
              })}
            </div>

            {/* Additional CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-6 glass rounded-lg border border-primary/20"
            >
              <h4 className="font-semibold mb-2 text-gradient-primary">
                Looking for AI/ML Consultation?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                I offer consulting services for AI/ML projects, from strategy to implementation.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Schedule a Call
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};