# Design Document

## Overview

El portafolio será una Single Page Application (SPA) construida con HTML5 semántico, CSS3 moderno y JavaScript vanilla. El diseño seguirá una estética cyberpunk anime inspirada en Lucy (Cyberpunk 2077) y Chisa (Wuthering Waves), utilizando una paleta de colores azules y morados con efectos neon sutiles y animaciones suaves.

## Architecture

### File Structure
```
cyberpunk-portfolio/
├── index.html
├── css/
│   ├── styles.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── animations.js
│   └── contact.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── cv/
└── README.md
```

### Technology Stack
- **HTML5**: Estructura semántica con tags como `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- **CSS3**: Flexbox, Grid, Custom Properties, Animations, Transforms
- **JavaScript ES6+**: Módulos, Intersection Observer API, Smooth Scrolling
- **No frameworks**: Vanilla JS para mantener el control total y optimizar performance

## Components and Interfaces

### 1. Navigation Component
- Fixed header con navegación horizontal
- Logo/nombre en la izquierda
- Menu items con hover effects neon
- Hamburger menu para móvil
- Scroll spy para highlighting de sección activa

### 2. Hero Section
```html
<section id="hero" class="hero-section">
  <div class="hero-content">
    <h1 class="glitch-text">Julián Rubiano Santofimio</h1>
    <p class="hero-subtitle">Desarrollador Full Stack & Ingeniero de Sistemas</p>
    <div class="hero-cta">
      <button class="neon-btn primary">Ver mis proyectos</button>
      <button class="neon-btn secondary">Descargar CV</button>
    </div>
  </div>
  <div class="hero-visual">
    <!-- Animated cyberpunk elements -->
  </div>
</section>
```

### 3. About Section
- Grid layout con imagen personal y texto
- Timeline de experiencia profesional
- Storytelling approach para engagement
- Animated counters para estadísticas

### 4. Skills & Technologies Section
- Grid de tecnologías con iconos
- Progress bars animadas para skill levels
- Categorización: Frontend, Backend, Tools, Soft Skills
- Hover effects con glow neon

### 5. Education Section
- Card design para universidad
- Timeline format
- Certificaciones destacadas (Scrum Master, etc.)

### 6. Projects Section
- Masonry/Grid layout responsive
- Project cards con:
  - Preview image/gif
  - Tech stack badges
  - GitHub y live demo links
  - Hover overlay con descripción

### 7. Experience Section
- Timeline vertical
- Company logos y descriptions
- Achievements highlights

### 8. Contact Section
- Contact form con validación
- Social media links (GitHub, LinkedIn)
- Animated background elements

## Data Models

### Project Object
```javascript
const project = {
  id: string,
  title: string,
  description: string,
  technologies: string[],
  githubUrl: string,
  liveUrl?: string,
  imageUrl: string,
  featured: boolean
}
```

### Skill Object
```javascript
const skill = {
  name: string,
  category: 'frontend' | 'backend' | 'tools' | 'soft',
  level: number, // 1-100
  icon: string
}
```

### Experience Object
```javascript
const experience = {
  company: string,
  position: string,
  startDate: Date,
  endDate?: Date,
  description: string,
  achievements: string[]
}
```

## Visual Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-blue: #00d4ff;
  --primary-purple: #8b5cf6;
  --dark-blue: #0f172a;
  --dark-purple: #1e1b4b;
  
  /* Neon Colors */
  --neon-cyan: #00ffff;
  --neon-pink: #ff00ff;
  --neon-blue: #0080ff;
  
  /* Neutral Colors */
  --bg-dark: #0a0a0f;
  --bg-card: #1a1a2e;
  --text-primary: #ffffff;
  --text-secondary: #a0a9c0;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, var(--primary-blue), var(--primary-purple));
  --gradient-neon: linear-gradient(90deg, var(--neon-cyan), var(--neon-pink));
}
```

### Typography
- **Primary Font**: 'Inter' o 'Poppins' para legibilidad
- **Accent Font**: 'Orbitron' para títulos cyberpunk
- **Code Font**: 'Fira Code' para snippets técnicos

### Animation Principles
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` para suavidad
- **Duration**: 300-600ms para micro-interactions
- **Stagger**: 100ms delay entre elementos similares
- **Scroll Animations**: Intersection Observer para performance

## Error Handling

### Form Validation
- Real-time validation con feedback visual
- Error messages en español
- Success states con animaciones

### Fallbacks
- Graceful degradation para animaciones
- Alternative text para todas las imágenes
- Fallback fonts para compatibilidad

### Performance
- Lazy loading para imágenes
- CSS animations con `will-change` property
- Debounced scroll events

## Testing Strategy

### Manual Testing
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Device testing (móvil, tablet, desktop)
- Accessibility testing con screen readers
- Performance testing con Lighthouse

### Validation
- HTML validation con W3C Validator
- CSS validation
- SEO validation con herramientas como SEMrush

### User Testing
- Navigation flow testing
- Contact form functionality
- Responsive behavior verification
- Loading speed optimization

## SEO Implementation

### Meta Tags
```html
<meta name="description" content="Julián Rubiano Santofimio - Desarrollador Full Stack e Ingeniero de Sistemas especializado en React, Node.js, Python. Portafolio de proyectos y experiencia profesional.">
<meta name="keywords" content="Julián Rubiano, desarrollador web, full stack developer, React, Node.js, Python, Ibagué, ingeniero sistemas">
<meta property="og:title" content="Julián Rubiano - Desarrollador Full Stack">
<meta property="og:description" content="Portafolio profesional de Julián Rubiano Santofimio, desarrollador especializado en tecnologías modernas web.">
```

### Structured Data
- JSON-LD para Person schema
- Organization markup para información profesional
- WebSite schema para navegación

### Performance Optimization
- Minificación de CSS/JS
- Optimización de imágenes (WebP con fallbacks)
- Critical CSS inline
- Preload de recursos importantes

## Accessibility Features

- Semantic HTML structure
- ARIA labels donde sea necesario
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly content
- Focus indicators visibles

## Responsive Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 480px) { /* Large mobile */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large desktop */ }
```

## Animation Effects

### Scroll Animations
- Fade in from bottom para secciones
- Stagger animations para listas
- Parallax sutil en hero section

### Hover Effects
- Glow effects en botones y cards
- Scale transforms en project cards
- Color transitions en navigation

### Loading Animations
- Skeleton screens para contenido
- Progress indicators para forms
- Smooth page transitions