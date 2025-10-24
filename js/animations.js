// Animation JavaScript for cyberpunk portfolio
// This file contains scroll-triggered animations and visual effects

// ===== SCROLL ANIMATIONS MANAGER =====

class ScrollAnimationsManager {
  constructor() {
    this.animatedElements = new Set();
    this.observers = new Map();
    this.init();
  }

  init() {
    this.createIntersectionObservers();
    this.observeElements();
  }

  createIntersectionObservers() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback to scroll event listener for older browsers
      this.setupScrollFallback();
      return;
    }

    // Main scroll observer for fade-in and slide-up animations
    const mainObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.triggerAnimation(entry.target);
          this.animatedElements.add(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    this.observers.set('main', mainObserver);

    // Stagger observer for list items and cards
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.triggerStaggerAnimation(entry.target);
          this.animatedElements.add(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.2
    });

    this.observers.set('stagger', staggerObserver);
  }

  setupScrollFallback() {
    // Fallback for browsers without Intersection Observer support
    let ticking = false;

    const checkElementsInView = () => {
      const elements = document.querySelectorAll('section:not(#hero), .section-header, .skill-item, .education-item, .project-card, .experience-item, .highlight-item, .about-stats .stat-item, .story-paragraph, .section-subtitle, .about-description');
      
      elements.forEach(element => {
        if (!this.animatedElements.has(element) && this.isElementInViewport(element)) {
          if (element.matches('.skill-item, .education-item, .project-card, .experience-item, .highlight-item, .about-stats .stat-item')) {
            this.triggerStaggerAnimation(element);
          } else {
            this.triggerAnimation(element);
          }
          this.animatedElements.add(element);
        }
      });
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkElementsInView);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    // Initial check
    checkElementsInView();
  }

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
      rect.top >= 0 &&
      rect.top <= windowHeight * 0.8 // Element is 80% visible
    );
  }

  observeElements() {
    // Observe sections for fade-in animations
    const sections = document.querySelectorAll('section:not(#hero)');
    sections.forEach(section => {
      this.observers.get('main').observe(section);
    });

    // Observe section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      this.observers.get('main').observe(header);
    });

    // Observe cards and items for stagger animations
    const staggerElements = document.querySelectorAll(
      '.skill-item, .education-item, .project-card, .experience-item, .highlight-item, .about-stats .stat-item'
    );
    staggerElements.forEach(element => {
      this.observers.get('stagger').observe(element);
    });

    // Observe text content for slide-up animations
    const textElements = document.querySelectorAll(
      '.story-paragraph, .section-subtitle, .about-description'
    );
    textElements.forEach(element => {
      this.observers.get('main').observe(element);
    });
  }

  triggerAnimation(element) {
    const animationType = this.getAnimationType(element);
    
    switch (animationType) {
      case 'fadeIn':
        this.animateFadeIn(element);
        break;
      case 'slideUp':
        this.animateSlideUp(element);
        break;
      case 'slideInLeft':
        this.animateSlideInLeft(element);
        break;
      case 'slideInRight':
        this.animateSlideInRight(element);
        break;
      case 'scaleIn':
        this.animateScaleIn(element);
        break;
      default:
        this.animateSlideUp(element);
    }
  }

  triggerStaggerAnimation(element) {
    const container = element.closest('.skills-list, .education-timeline, .projects-grid, .experience-timeline, .about-highlights, .about-stats');
    if (!container) {
      this.triggerAnimation(element);
      return;
    }

    const siblings = Array.from(container.children);
    const index = siblings.indexOf(element);
    
    // Apply stagger delay
    setTimeout(() => {
      this.triggerAnimation(element);
    }, index * 150);
  }

  getAnimationType(element) {
    if (element.matches('section')) return 'fadeIn';
    if (element.matches('.section-header')) return 'slideUp';
    if (element.matches('.story-paragraph')) return 'slideUp';
    if (element.matches('.skill-item, .project-card')) return 'scaleIn';
    if (element.matches('.education-item:nth-child(odd), .experience-item:nth-child(odd)')) return 'slideInLeft';
    if (element.matches('.education-item:nth-child(even), .experience-item:nth-child(even)')) return 'slideInRight';
    if (element.matches('.highlight-item, .stat-item')) return 'slideUp';
    
    return 'slideUp';
  }

  animateFadeIn(element) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.8s ease-out';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  animateSlideUp(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  animateSlideInLeft(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(-50px) translateY(20px)';
    element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0) translateY(0)';
    });
  }

  animateSlideInRight(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(50px) translateY(20px)';
    element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0) translateY(0)';
    });
  }

  animateScaleIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.9) translateY(20px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1) translateY(0)';
    });
  }

  // Method to reset all animations (useful for testing)
  reset() {
    this.animatedElements.clear();
    
    const allElements = document.querySelectorAll('section, .section-header, .skill-item, .education-item, .project-card, .experience-item, .highlight-item, .stat-item, .story-paragraph');
    allElements.forEach(element => {
      element.style.opacity = '';
      element.style.transform = '';
      element.style.transition = '';
    });
  }

  // Method to manually trigger animations (useful for testing)
  triggerAll() {
    const allElements = document.querySelectorAll('section, .section-header, .skill-item, .education-item, .project-card, .experience-item, .highlight-item, .stat-item, .story-paragraph');
    allElements.forEach((element, index) => {
      setTimeout(() => {
        this.triggerAnimation(element);
      }, index * 100);
    });
  }
}

// ===== PARALLAX EFFECTS MANAGER =====

class ParallaxManager {
  constructor() {
    this.parallaxElements = [];
    this.isScrolling = false;
    this.init();
  }

  init() {
    this.createParallaxElements();
    this.bindScrollEvents();
  }

  createParallaxElements() {
    // Hero section parallax elements
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
      // Create background layers for parallax effect
      this.createBackgroundLayers(heroSection);
      
      // Add parallax to existing hero content
      const heroContent = heroSection.querySelector('.hero-content');
      const heroVisual = heroSection.querySelector('.hero-visual');
      
      if (heroContent) {
        this.parallaxElements.push({
          element: heroContent,
          speed: 0.5,
          type: 'translateY'
        });
      }
      
      if (heroVisual) {
        this.parallaxElements.push({
          element: heroVisual,
          speed: 0.3,
          type: 'translateY'
        });
      }
    }

    // Add subtle parallax to section backgrounds
    const sections = document.querySelectorAll('section:not(#hero)');
    sections.forEach((section, index) => {
      if (index % 2 === 0) { // Every other section
        this.parallaxElements.push({
          element: section,
          speed: 0.1,
          type: 'translateY'
        });
      }
    });
  }

  createBackgroundLayers(heroSection) {
    // Create parallax background layers
    const backgroundLayers = document.createElement('div');
    backgroundLayers.className = 'parallax-background';
    backgroundLayers.innerHTML = `
      <div class="parallax-layer parallax-layer-1"></div>
      <div class="parallax-layer parallax-layer-2"></div>
      <div class="parallax-layer parallax-layer-3"></div>
    `;
    
    heroSection.insertBefore(backgroundLayers, heroSection.firstChild);

    // Add parallax elements for background layers
    const layers = backgroundLayers.querySelectorAll('.parallax-layer');
    layers.forEach((layer, index) => {
      this.parallaxElements.push({
        element: layer,
        speed: 0.2 + (index * 0.1),
        type: 'translateY'
      });
    });
  }

  bindScrollEvents() {
    // Use requestAnimationFrame for smooth performance
    window.addEventListener('scroll', () => {
      if (!this.isScrolling) {
        requestAnimationFrame(() => {
          this.updateParallax();
          this.isScrolling = false;
        });
        this.isScrolling = true;
      }
    }, { passive: true });

    // Initial parallax update
    this.updateParallax();
  }

  updateParallax() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    this.parallaxElements.forEach(item => {
      const { element, speed, type } = item;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;

      // Check if element is in viewport
      if (elementTop < scrollTop + windowHeight && elementTop + elementHeight > scrollTop) {
        const yPos = -(scrollTop - elementTop) * speed;
        
        switch (type) {
          case 'translateY':
            element.style.transform = `translateY(${yPos}px)`;
            break;
          case 'translateX':
            element.style.transform = `translateX(${yPos}px)`;
            break;
          case 'scale':
            const scale = 1 + (yPos * 0.001);
            element.style.transform = `scale(${Math.max(0.8, Math.min(1.2, scale))})`;
            break;
        }
      }
    });
  }

  // Method to add custom parallax element
  addParallaxElement(element, speed = 0.5, type = 'translateY') {
    this.parallaxElements.push({ element, speed, type });
  }

  // Method to remove parallax element
  removeParallaxElement(element) {
    this.parallaxElements = this.parallaxElements.filter(item => item.element !== element);
  }

  // Method to disable parallax (for performance or accessibility)
  disable() {
    this.parallaxElements.forEach(item => {
      item.element.style.transform = '';
    });
  }

  // Method to enable parallax
  enable() {
    this.updateParallax();
  }
}

// ===== STAGGER ANIMATIONS MANAGER =====

class StaggerAnimationsManager {
  constructor() {
    this.staggerGroups = new Map();
    this.animatedGroups = new Set();
    this.init();
  }

  init() {
    this.identifyStaggerGroups();
    this.createStaggerObserver();
  }

  identifyStaggerGroups() {
    // Skills section stagger groups
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
      const skillItems = category.querySelectorAll('.skill-item');
      if (skillItems.length > 0) {
        this.staggerGroups.set(`skills-${index}`, {
          container: category,
          items: Array.from(skillItems),
          delay: 100,
          animationType: 'slideInUp'
        });
      }
    });

    // Projects section stagger group
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      const projectCards = projectsGrid.querySelectorAll('.project-card');
      if (projectCards.length > 0) {
        this.staggerGroups.set('projects', {
          container: projectsGrid,
          items: Array.from(projectCards),
          delay: 150,
          animationType: 'scaleInBounce'
        });
      }
    }

    // Experience section stagger group
    const experienceTimeline = document.querySelector('.experience-timeline');
    if (experienceTimeline) {
      const experienceItems = experienceTimeline.querySelectorAll('.experience-item');
      if (experienceItems.length > 0) {
        this.staggerGroups.set('experience', {
          container: experienceTimeline,
          items: Array.from(experienceItems),
          delay: 200,
          animationType: 'slideInAlternate'
        });
      }
    }

    // Education section stagger group
    const educationTimeline = document.querySelector('.education-timeline');
    if (educationTimeline) {
      const educationItems = educationTimeline.querySelectorAll('.education-item');
      if (educationItems.length > 0) {
        this.staggerGroups.set('education', {
          container: educationTimeline,
          items: Array.from(educationItems),
          delay: 180,
          animationType: 'slideInAlternate'
        });
      }
    }

    // About highlights stagger group
    const aboutHighlights = document.querySelector('.about-highlights');
    if (aboutHighlights) {
      const highlightItems = aboutHighlights.querySelectorAll('.highlight-item');
      if (highlightItems.length > 0) {
        this.staggerGroups.set('highlights', {
          container: aboutHighlights,
          items: Array.from(highlightItems),
          delay: 120,
          animationType: 'slideInUp'
        });
      }
    }

    // About stats stagger group
    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
      const statItems = aboutStats.querySelectorAll('.stat-item');
      if (statItems.length > 0) {
        this.staggerGroups.set('stats', {
          container: aboutStats,
          items: Array.from(statItems),
          delay: 100,
          animationType: 'scaleIn'
        });
      }
    }

    // Tech tags in various sections
    const techTagContainers = document.querySelectorAll('.project-tech-stack, .experience-technologies, .education-highlights');
    techTagContainers.forEach((container, index) => {
      const techTags = container.querySelectorAll('.tech-tag, .highlight-tag');
      if (techTags.length > 0) {
        this.staggerGroups.set(`tech-tags-${index}`, {
          container: container,
          items: Array.from(techTags),
          delay: 50,
          animationType: 'slideInUp'
        });
      }
    });
  }

  createStaggerObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Find the stagger group for this container
          for (const [groupId, group] of this.staggerGroups) {
            if (group.container === entry.target && !this.animatedGroups.has(groupId)) {
              this.triggerStaggerAnimation(groupId, group);
              this.animatedGroups.add(groupId);
              break;
            }
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.2
    });

    // Observe all stagger group containers
    this.staggerGroups.forEach(group => {
      observer.observe(group.container);
    });
  }

  triggerStaggerAnimation(groupId, group) {
    const { items, delay, animationType } = group;

    items.forEach((item, index) => {
      // Set initial state
      this.setInitialState(item, animationType);

      // Trigger animation with stagger delay
      setTimeout(() => {
        this.animateItem(item, animationType);
      }, index * delay);
    });
  }

  setInitialState(item, animationType) {
    switch (animationType) {
      case 'slideInUp':
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        break;
      case 'slideInDown':
        item.style.opacity = '0';
        item.style.transform = 'translateY(-30px)';
        break;
      case 'slideInLeft':
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        break;
      case 'slideInRight':
        item.style.opacity = '0';
        item.style.transform = 'translateX(30px)';
        break;
      case 'scaleIn':
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        break;
      case 'scaleInBounce':
        item.style.opacity = '0';
        item.style.transform = 'scale(0.3)';
        break;
      case 'slideInAlternate':
        const isEven = Array.from(item.parentNode.children).indexOf(item) % 2 === 0;
        item.style.opacity = '0';
        item.style.transform = isEven ? 'translateX(-50px)' : 'translateX(50px)';
        break;
      case 'rotateIn':
        item.style.opacity = '0';
        item.style.transform = 'rotate(-180deg) scale(0.8)';
        break;
    }
  }

  animateItem(item, animationType) {
    const duration = this.getAnimationDuration(animationType);
    const easing = this.getAnimationEasing(animationType);

    item.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;

    requestAnimationFrame(() => {
      switch (animationType) {
        case 'slideInUp':
        case 'slideInDown':
        case 'slideInLeft':
        case 'slideInRight':
        case 'slideInAlternate':
          item.style.opacity = '1';
          item.style.transform = 'translateY(0) translateX(0)';
          break;
        case 'scaleIn':
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          break;
        case 'scaleInBounce':
          item.style.opacity = '1';
          // Bounce effect with multiple keyframes
          item.style.transform = 'scale(1.05)';
          setTimeout(() => {
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.transform = 'scale(1)';
            }, 100);
          }, 200);
          break;
        case 'rotateIn':
          item.style.opacity = '1';
          item.style.transform = 'rotate(0deg) scale(1)';
          break;
      }
    });
  }

  getAnimationDuration(animationType) {
    const durations = {
      'slideInUp': 600,
      'slideInDown': 600,
      'slideInLeft': 600,
      'slideInRight': 600,
      'slideInAlternate': 800,
      'scaleIn': 500,
      'scaleInBounce': 800,
      'rotateIn': 700
    };
    return durations[animationType] || 600;
  }

  getAnimationEasing(animationType) {
    const easings = {
      'slideInUp': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'slideInDown': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'slideInLeft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'slideInRight': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'slideInAlternate': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'scaleIn': 'ease-out',
      'scaleInBounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      'rotateIn': 'cubic-bezier(0.4, 0, 0.2, 1)'
    };
    return easings[animationType] || 'ease-out';
  }

  // Method to manually trigger stagger animation for a specific group
  triggerGroup(groupId) {
    const group = this.staggerGroups.get(groupId);
    if (group && !this.animatedGroups.has(groupId)) {
      this.triggerStaggerAnimation(groupId, group);
      this.animatedGroups.add(groupId);
    }
  }

  // Method to reset all stagger animations
  reset() {
    this.animatedGroups.clear();
    this.staggerGroups.forEach(group => {
      group.items.forEach(item => {
        item.style.opacity = '';
        item.style.transform = '';
        item.style.transition = '';
      });
    });
  }

  // Method to add custom stagger group
  addStaggerGroup(groupId, container, items, delay = 100, animationType = 'slideInUp') {
    this.staggerGroups.set(groupId, {
      container,
      items: Array.from(items),
      delay,
      animationType
    });

    // Create observer for the new group
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target === container && !this.animatedGroups.has(groupId)) {
          this.triggerStaggerAnimation(groupId, this.staggerGroups.get(groupId));
          this.animatedGroups.add(groupId);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.2
    });

    observer.observe(container);
  }
}

// ===== ANIMATION SYSTEM INITIALIZATION =====

class AnimationSystem {
  constructor() {
    this.scrollAnimations = null;
    this.parallaxManager = null;
    this.staggerAnimations = null;
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeAnimations());
    } else {
      this.initializeAnimations();
    }
  }

  initializeAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      console.log('Reduced motion preference detected, skipping complex animations');
      return;
    }

    // Initialize animation managers
    try {
      this.scrollAnimations = new ScrollAnimationsManager();
      this.parallaxManager = new ParallaxManager();
      this.staggerAnimations = new StaggerAnimationsManager();
      
      this.isInitialized = true;
      console.log('Animation system initialized successfully');
      
      // Dispatch custom event for other scripts
      window.dispatchEvent(new CustomEvent('animationSystemReady', {
        detail: { animationSystem: this }
      }));
      
    } catch (error) {
      console.error('Error initializing animation system:', error);
    }
  }

  // Method to disable all animations
  disableAnimations() {
    if (this.scrollAnimations) this.scrollAnimations.reset();
    if (this.parallaxManager) this.parallaxManager.disable();
    if (this.staggerAnimations) this.staggerAnimations.reset();
  }

  // Method to enable all animations
  enableAnimations() {
    if (this.parallaxManager) this.parallaxManager.enable();
    // Scroll and stagger animations will re-trigger naturally
  }

  // Method to reset all animations
  resetAnimations() {
    if (this.scrollAnimations) this.scrollAnimations.reset();
    if (this.staggerAnimations) this.staggerAnimations.reset();
  }

  // Method to manually trigger all animations (useful for testing)
  triggerAllAnimations() {
    if (this.scrollAnimations) this.scrollAnimations.triggerAll();
  }

  // Getter methods for accessing individual managers
  getScrollAnimations() {
    return this.scrollAnimations;
  }

  getParallaxManager() {
    return this.parallaxManager;
  }

  getStaggerAnimations() {
    return this.staggerAnimations;
  }
}

// Initialize the animation system
const animationSystem = new AnimationSystem();

// Export for use in other scripts
window.AnimationSystem = animationSystem;