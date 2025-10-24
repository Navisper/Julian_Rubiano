// SEO Optimization and Analytics Enhancement

class SEOOptimizer {
  constructor() {
    this.currentUrl = window.location.href;
    this.baseUrl = window.location.origin;
    this.isProduction = this.currentUrl.includes('julianrubiano.dev');
    
    this.init();
  }

  init() {
    this.optimizeMetaTags();
    this.addStructuredData();
    this.setupAnalytics();
    this.optimizeImages();
    this.addSitemapReference();
    this.setupPerformanceMonitoring();
    this.enhanceInternalLinking();
  }

  optimizeMetaTags() {
    // Dynamic meta tag optimization based on current section
    this.updateMetaTagsOnScroll();
    this.addViewportOptimization();
    this.optimizeForMobileSearch();
  }

  updateMetaTagsOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          this.updateMetaForSection(entry.target.id);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-100px 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  updateMetaForSection(sectionId) {
    const sectionMeta = {
      hero: {
        title: 'Julián Rubiano - Desarrollador Full Stack | Inicio',
        description: 'Bienvenido al portafolio de Julián Rubiano, desarrollador Full Stack especializado en React, Node.js y Python.',
        keywords: 'desarrollador full stack, React, Node.js, Python, portfolio'
      },
      about: {
        title: 'Sobre Mí - Julián Rubiano | Desarrollador Full Stack',
        description: 'Conoce la historia profesional de Julián Rubiano, su experiencia en desarrollo web y pasión por crear soluciones innovadoras.',
        keywords: 'sobre mi, experiencia, desarrollador, historia profesional, Ibagué'
      },
      skills: {
        title: 'Habilidades Técnicas - Julián Rubiano | React, Node.js, Python',
        description: 'Explora las habilidades técnicas de Julián: React, Node.js, Python, TypeScript, MongoDB, PostgreSQL y más tecnologías modernas.',
        keywords: 'habilidades, React, Node.js, Python, TypeScript, MongoDB, PostgreSQL, skills'
      },
      projects: {
        title: 'Proyectos - Julián Rubiano | Portafolio de Desarrollo Web',
        description: 'Descubre los proyectos de desarrollo web de Julián Rubiano: aplicaciones React, APIs Node.js, sistemas Python y más.',
        keywords: 'proyectos, portfolio, aplicaciones web, React projects, Node.js APIs'
      },
      experience: {
        title: 'Experiencia Profesional - Julián Rubiano | Desarrollador Senior',
        description: 'Conoce la experiencia profesional de Julián Rubiano como desarrollador Full Stack en empresas tecnológicas.',
        keywords: 'experiencia profesional, desarrollador senior, full stack, carrera'
      },
      contact: {
        title: 'Contacto - Julián Rubiano | Desarrollador Full Stack Disponible',
        description: 'Contacta a Julián Rubiano para proyectos de desarrollo web, consultoría técnica o colaboraciones profesionales.',
        keywords: 'contacto, desarrollador disponible, freelance, consultoría, proyectos'
      }
    };

    const meta = sectionMeta[sectionId];
    if (meta) {
      // Update page title
      document.title = meta.title;
      
      // Update meta description
      this.updateMetaTag('description', meta.description);
      
      // Update meta keywords
      this.updateMetaTag('keywords', meta.keywords);
      
      // Update Open Graph tags
      this.updateMetaProperty('og:title', meta.title);
      this.updateMetaProperty('og:description', meta.description);
      this.updateMetaProperty('og:url', `${this.baseUrl}/#${sectionId}`);
      
      // Update Twitter Card tags
      this.updateMetaTag('twitter:title', meta.title);
      this.updateMetaTag('twitter:description', meta.description);
      
      // Update canonical URL
      this.updateCanonicalUrl(`${this.baseUrl}/#${sectionId}`);
    }
  }

  updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  updateMetaProperty(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  updateCanonicalUrl(url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }

  addViewportOptimization() {
    // Ensure optimal viewport settings
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    }
  }

  optimizeForMobileSearch() {
    // Add mobile-specific optimizations
    const mobileOptimizations = [
      { name: 'format-detection', content: 'telephone=yes' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-touch-fullscreen', content: 'yes' }
    ];

    mobileOptimizations.forEach(opt => {
      if (!document.querySelector(`meta[name="${opt.name}"]`)) {
        const meta = document.createElement('meta');
        meta.setAttribute('name', opt.name);
        meta.setAttribute('content', opt.content);
        document.head.appendChild(meta);
      }
    });
  }

  addStructuredData() {
    // Add FAQ structured data
    this.addFAQStructuredData();
    
    // Add Organization structured data
    this.addOrganizationData();
    
    // Add Skills structured data
    this.addSkillsStructuredData();
  }

  addFAQStructuredData() {
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué tecnologías domina Julián Rubiano?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Julián Rubiano es especialista en React, Node.js, Python, TypeScript, JavaScript, MongoDB, PostgreSQL, AWS, Docker y metodologías ágiles como Scrum."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuánta experiencia tiene como desarrollador Full Stack?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Julián tiene más de 3 años de experiencia profesional como desarrollador Full Stack, trabajando en proyectos desde startups hasta empresas establecidas."
          }
        },
        {
          "@type": "Question",
          "name": "¿Está disponible para proyectos freelance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, Julián está disponible para proyectos de desarrollo web, consultoría técnica y colaboraciones profesionales. Puedes contactarlo a través de su portafolio."
          }
        },
        {
          "@type": "Question",
          "name": "¿En qué ciudad está ubicado?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Julián Rubiano está ubicado en Ibagué, Tolima, Colombia, pero trabaja con clientes de forma remota en toda Latinoamérica."
          }
        }
      ]
    };

    this.addJSONLD(faqData);
  }

  addOrganizationData() {
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Julián Rubiano - Desarrollo Web",
      "url": "https://julianrubiano.dev",
      "logo": "https://julianrubiano.dev/assets/images/logo.png",
      "description": "Servicios profesionales de desarrollo web Full Stack",
      "founder": {
        "@type": "Person",
        "name": "Julián Rubiano Santofimio"
      },
      "foundingDate": "2021",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ibagué",
        "addressRegion": "Tolima",
        "addressCountry": "Colombia"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+57-300-123-4567",
        "contactType": "customer service",
        "availableLanguage": ["Spanish", "English"]
      },
      "sameAs": [
        "https://github.com/julianrubiano",
        "https://linkedin.com/in/julianrubiano"
      ]
    };

    this.addJSONLD(organizationData);
  }

  addSkillsStructuredData() {
    const skillsData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Habilidades Técnicas de Julián Rubiano",
      "description": "Lista completa de tecnologías y habilidades técnicas",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Thing",
            "name": "React",
            "description": "Biblioteca de JavaScript para interfaces de usuario - Nivel Avanzado (90%)"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "Thing",
            "name": "Node.js",
            "description": "Entorno de ejecución de JavaScript - Nivel Avanzado (88%)"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "Thing",
            "name": "Python",
            "description": "Lenguaje de programación de alto nivel - Nivel Intermedio-Avanzado (85%)"
          }
        }
      ]
    };

    this.addJSONLD(skillsData);
  }

  addJSONLD(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  setupAnalytics() {
    if (this.isProduction) {
      this.initializeGoogleAnalytics();
      this.initializeGoogleTagManager();
      this.setupCustomEvents();
    }
  }

  initializeGoogleAnalytics() {
    // Google Analytics 4 implementation
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: document.title,
      page_location: window.location.href
    });

    // Make gtag available globally
    window.gtag = gtag;
  }

  initializeGoogleTagManager() {
    // Google Tag Manager implementation
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXXXX');
  }

  setupCustomEvents() {
    // Track section views
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.trackEvent('section_view', {
            section_name: entry.target.id,
            section_title: entry.target.querySelector('h2')?.textContent || entry.target.id
          });
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => sectionObserver.observe(section));

    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn, .social-link, .contact-link')) {
        this.trackEvent('button_click', {
          button_text: e.target.textContent.trim(),
          button_type: e.target.className,
          target_url: e.target.href || 'internal'
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.matches('.contact-form')) {
        this.trackEvent('form_submit', {
          form_name: 'contact_form'
        });
      }
    });

    // Track scroll depth
    this.trackScrollDepth();
  }

  trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
    
    // Also log to console in development
    if (!this.isProduction) {
      console.log('Analytics Event:', eventName, parameters);
    }
  }

  trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 90, 100];
    const tracked = new Set();

    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && !tracked.has(milestone)) {
            tracked.add(milestone);
            this.trackEvent('scroll_depth', {
              percent: milestone
            });
          }
        });
      }
    });
  }

  optimizeImages() {
    // Add alt text optimization
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.alt) {
        // Generate alt text based on context
        const context = this.getImageContext(img);
        img.alt = context;
      }
    });
  }

  getImageContext(img) {
    // Try to determine context from surrounding elements
    const parent = img.closest('section');
    const sectionTitle = parent?.querySelector('h2, h3')?.textContent;
    const figcaption = img.closest('figure')?.querySelector('figcaption')?.textContent;
    
    if (figcaption) return figcaption;
    if (sectionTitle) return `Imagen relacionada con ${sectionTitle}`;
    return 'Imagen del portafolio de Julián Rubiano';
  }

  addSitemapReference() {
    // Add sitemap reference
    const sitemap = document.createElement('link');
    sitemap.rel = 'sitemap';
    sitemap.type = 'application/xml';
    sitemap.href = '/sitemap.xml';
    document.head.appendChild(sitemap);
  }

  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(this.sendToAnalytics);
        getFID(this.sendToAnalytics);
        getFCP(this.sendToAnalytics);
        getLCP(this.sendToAnalytics);
        getTTFB(this.sendToAnalytics);
      });
    }
  }

  sendToAnalytics(metric) {
    this.trackEvent('web_vital', {
      metric_name: metric.name,
      metric_value: Math.round(metric.value),
      metric_id: metric.id
    });
  }

  enhanceInternalLinking() {
    // Add breadcrumb navigation
    this.addBreadcrumbNavigation();
    
    // Enhance anchor links
    this.enhanceAnchorLinks();
  }

  addBreadcrumbNavigation() {
    const breadcrumb = document.createElement('nav');
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    breadcrumb.innerHTML = `
      <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a itemprop="item" href="#hero">
            <span itemprop="name">Inicio</span>
          </a>
          <meta itemprop="position" content="1" />
        </li>
      </ol>
    `;
    
    // Insert after header
    const header = document.querySelector('.header');
    if (header) {
      header.insertAdjacentElement('afterend', breadcrumb);
    }
  }

  enhanceAnchorLinks() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Update URL without page reload
          history.pushState(null, null, `#${targetId}`);
          
          // Track internal navigation
          this.trackEvent('internal_navigation', {
            from_section: this.getCurrentSection(),
            to_section: targetId
          });
        }
      });
    });
  }

  getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    for (let section of sections) {
      if (scrollPosition >= section.offsetTop && 
          scrollPosition < section.offsetTop + section.offsetHeight) {
        return section.id;
      }
    }
    return 'hero';
  }

  // Method to get SEO performance metrics
  getSEOMetrics() {
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      structuredData: document.querySelectorAll('script[type="application/ld+json"]').length,
      images: document.querySelectorAll('img').length,
      imagesWithAlt: document.querySelectorAll('img[alt]').length,
      internalLinks: document.querySelectorAll('a[href^="#"]').length,
      externalLinks: document.querySelectorAll('a[href^="http"]').length
    };
  }
}

// Initialize SEO optimizer
document.addEventListener('DOMContentLoaded', () => {
  window.seoOptimizer = new SEOOptimizer();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEOOptimizer;
}