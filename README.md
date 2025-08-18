# 🚀 Eid Kalaria - AI/ML Developer Portfolio

A modern, interactive portfolio website built with React, Three.js, and cutting-edge web technologies. Features stunning 3D animations, custom cursor effects, and a responsive design optimized for showcasing AI/ML projects.

## ✨ Features

- **3D Background Animations** - Interactive Three.js scenes with particle effects
- **Custom Cursor** - Intelligent cursor that reacts to hover states
- **Responsive Design** - Mobile-first approach with elegant transitions
- **Project Showcase** - Interactive project cards with tilt effects
- **Contact Form** - Functional contact form with validation
- **Performance Optimized** - Configurable settings for different device capabilities
- **SEO Optimized** - Proper meta tags and semantic HTML

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + CSS Custom Properties
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eid-kalaria-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your preferences
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:8080
   ```

## ⚙️ Configuration

### 3D Animations Setup

The portfolio includes configurable 3D effects. Edit `.env` to control:

```env
# Enable/disable features
VITE_ENABLE_3D=true
VITE_ENABLE_PARTICLES=true
VITE_ENABLE_CURSOR_EFFECTS=true

# Performance settings
VITE_HIGH_PERFORMANCE=false
```

### Customizing 3D Elements

#### Background Sphere
Location: `src/components/3d/BackgroundSphere.tsx`

```typescript
// Customize sphere properties
<Sphere
  args={[radius, widthSegments, heightSegments]} // [8, 64, 32]
  position={[x, y, z]} // [0, 0, -10]
>
  <meshStandardMaterial
    color="#8b5cf6" // Change color
    wireframe={true} // Toggle wireframe
    opacity={0.1} // Adjust transparency
  />
</Sphere>
```

#### Particle Field
Location: `src/components/3d/ParticleField.tsx`

```typescript
// Adjust particle count for performance
<ParticleField 
  count={100} // Reduce for better performance
  mousePosition={mousePosition}
/>

// Customize colors in the component
const colorPalette = [
  new THREE.Color('#8b5cf6'), // Primary purple
  new THREE.Color('#06b6d4'), // Secondary cyan
  new THREE.Color('#10b981'), // Accent green
];
```

#### Floating Geometry
Location: `src/components/3d/FloatingGeometry.tsx`

Add new shapes by importing from `@react-three/drei`:

```typescript
import { Box, Sphere, Cylinder, Cone, Octahedron, Torus } from '@react-three/drei';

// Add to component JSX
<Cylinder
  ref={cylinderRef}
  args={[1, 1, 2, 8]}
  position={[x, y, z]}
>
  <meshStandardMaterial color="#your-color" />
</Cylinder>
```

### Performance Optimization

For better performance on lower-end devices:

1. **Reduce particle count**:
   ```typescript
   const count = highPerformance ? 50 : 100;
   ```

2. **Lower geometry detail**:
   ```typescript
   <Sphere args={[8, 32, 16]} /> // Reduced from [8, 64, 32]
   ```

3. **Disable shadows**:
   ```typescript
   <Canvas gl={{ antialias: false }}>
   ```

4. **Enable high performance mode**:
   ```env
   VITE_HIGH_PERFORMANCE=true
   ```

## 🎨 Customization

### Design System

The design system is defined in `src/index.css` and `tailwind.config.ts`. All colors use HSL values:

```css
:root {
  --primary: 280 100% 70%;        /* Purple */
  --secondary: 200 100% 60%;      /* Cyan */
  --accent: 120 100% 50%;         /* Green */
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
}
```

### Adding New Sections

1. Create component in `src/components/portfolio/`
2. Import and add to `src/pages/Index.tsx`
3. Update navigation in `src/components/ui/Navigation.tsx`

### Updating Content

#### Personal Information
- Update `src/components/portfolio/HeroSection.tsx`
- Change GitHub profile image URL
- Modify name, title, and description

#### Projects
- Edit `src/components/portfolio/ProjectsSection.tsx`
- Update projects array with your projects
- Add project images and links

#### Skills & Experience
- Modify `src/components/portfolio/AboutSection.tsx`
- Update skills arrays and timeline

## 📱 Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile**: Optimized with reduced effects

### WebGL Fallback

If WebGL is not supported, the site gracefully degrades to a static gradient background.

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── components/
│   ├── 3d/                    # Three.js components
│   │   ├── Scene3D.tsx
│   │   ├── BackgroundSphere.tsx
│   │   ├── ParticleField.tsx
│   │   └── FloatingGeometry.tsx
│   ├── portfolio/             # Portfolio sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── ContactSection.tsx
│   └── ui/                    # UI components
│       ├── Navigation.tsx
│       ├── CustomCursor.tsx
│       └── ...
├── hooks/                     # Custom hooks
├── lib/                       # Utilities
└── pages/                     # Page components
```

## 🚀 Deployment

The project is optimized for modern hosting platforms:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting platform

### Recommended Platforms
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 📄 License

MIT License - feel free to use this as a template for your own portfolio!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ by Eid Kalaria