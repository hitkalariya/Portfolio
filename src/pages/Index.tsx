import { Navigation } from '@/components/ui/Navigation';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { AboutSection } from '@/components/portfolio/AboutSection';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { ContactSection } from '@/components/portfolio/ContactSection';

const Index = () => {
  return (
    <div className="relative">
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section id="home">
          <HeroSection />
        </section>
        
        {/* About Section */}
        <section id="about">
          <AboutSection />
        </section>
        
        {/* Projects Section */}
        <section id="projects">
          <ProjectsSection />
        </section>
        
        {/* Contact Section */}
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-primary/20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 Eid Kalaria. Built with React, Three.js, and ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
