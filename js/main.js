// Main JavaScript functionality for cyberpunk portfolio

// ===== NAVIGATION FUNCTIONALITY =====

class Navigation {
  constructor() {
    this.header = document.querySelector('.header');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-menu a');
    this.scrollIndicator = document.querySelector('.nav-scroll-indicator');

    this.isMenuOpen = false;
    this.lastScrollY = window.scrollY;

    this.init();
  }

  init() {
    this.bindEvents();
    this.createScrollIndicator();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          this.closeMobileMenu();
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen &&
        !this.navMenu.contains(e.target) &&
        !this.navToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Scroll effects
    window.addEventListener('scroll', () => this.handleScroll());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.navToggle.classList.add('active');
    this.navMenu.classList.add('active');
    this.navToggle.setAttribute('aria-expanded', 'true');

    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';

    // Focus management for accessibility
    const firstLink = this.navMenu.querySelector('a');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.navToggle.classList.remove('active');
    this.navMenu.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');

    // Restore body scroll
    document.body.style.overflow = '';
  }

  handleScroll() {
    const currentScrollY = window.scrollY;

    // Add scrolled class for header styling
    if (currentScrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }

    // Update scroll indicator
    this.updateScrollIndicator();

    this.lastScrollY = currentScrollY;
  }

  createScrollIndicator() {
    if (!this.scrollIndicator) {
      const indicator = document.createElement('div');
      indicator.className = 'nav-scroll-indicator';
      this.header.appendChild(indicator);
      this.scrollIndicator = indicator;
    }
  }

  updateScrollIndicator() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (this.scrollIndicator) {
      this.scrollIndicator.style.width = `${scrollPercent}%`;
    }
  }
}

// ===== SMOOTH SCROLLING AND SCROLL SPY =====

class ScrollSpy {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    this.headerHeight = 70; // Fixed header height
    this.currentSection = '';

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveSection();
  }

  bindEvents() {
    // Smooth scrolling for navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });

    // Scroll spy
    window.addEventListener('scroll', () => this.handleScrollSpy());

    // Update on resize
    window.addEventListener('resize', () => this.updateActiveSection());
  }

  handleSmoothScroll(e) {
    e.preventDefault();

    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const targetPosition = targetSection.offsetTop - this.headerHeight - 20;

      // Smooth scroll with custom easing
      this.smoothScrollTo(targetPosition, 800);
    }
  }

  smoothScrollTo(targetPosition, duration) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  handleScrollSpy() {
    this.updateActiveSection();
  }

  updateActiveSection() {
    const scrollPosition = window.scrollY + this.headerHeight + 100;

    let currentSection = '';

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });

    // Handle edge case for the last section
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
      const lastSection = this.sections[this.sections.length - 1];
      if (lastSection) {
        currentSection = lastSection.getAttribute('id');
      }
    }

    // Update active navigation link
    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.updateActiveNavLink(currentSection);
    }
  }

  updateActiveNavLink(activeSection) {
    // Remove active class from all links
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to current section link
    if (activeSection) {
      const activeLink = document.querySelector(`.nav-menu a[href="#${activeSection}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }
}

// ===== CALL-TO-ACTION BUTTON FUNCTIONALITY =====

class CTAButtons {
  constructor() {
    this.ctaButtons = document.querySelectorAll('.btn[href^="#"]');
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleCTAClick(e));
    });
  }

  handleCTAClick(e) {
    e.preventDefault();

    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const headerHeight = 70;
      const targetPosition = targetSection.offsetTop - headerHeight - 20;

      // Use the same smooth scroll function
      const scrollSpy = new ScrollSpy();
      scrollSpy.smoothScrollTo(targetPosition, 800);
    }
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
  new ScrollSpy();
  new CTAButtons();
  new StatisticsCounter();
  new AboutAnimations();
  new SkillsAnimations();
  new EducationAnimations();
  new ProjectsManager();
  new ProjectInteractions();
  new ExperienceAnimations();
});

// ===== ANIMATED STATISTICS COUNTERS =====

class StatisticsCounter {
  constructor() {
    this.statNumbers = document.querySelectorAll('.stat-number');
    this.hasAnimated = new Set();
    this.observer = null;

    this.init();
  }

  init() {
    this.createIntersectionObserver();
    this.observeStatNumbers();
  }

  createIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px', // Trigger when element is 100px from bottom of viewport
      threshold: 0.3
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
          this.animateCounter(entry.target);
          this.hasAnimated.add(entry.target);
        }
      });
    }, options);
  }

  observeStatNumbers() {
    this.statNumbers.forEach(statNumber => {
      this.observer.observe(statNumber);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;

    // Add counting class for visual feedback
    element.classList.add('counting');

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 3);
      };

      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

      // Update the display
      element.textContent = this.formatNumber(currentValue);

      // Add pulse effect during counting
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Ensure we end with the exact target value
        element.textContent = this.formatNumber(target);
        element.classList.remove('counting');

        // Add completion effect
        this.addCompletionEffect(element);
      }
    };

    requestAnimationFrame(updateCounter);
  }

  formatNumber(num) {
    // Add formatting for larger numbers if needed
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  addCompletionEffect(element) {
    // Add a subtle glow effect when counter completes
    element.style.textShadow = '0 0 20px rgba(0, 255, 255, 0.8)';

    setTimeout(() => {
      element.style.textShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
    }, 500);
  }

  // Method to reset animations (useful for testing or re-triggering)
  reset() {
    this.hasAnimated.clear();
    this.statNumbers.forEach(element => {
      element.textContent = '0';
      element.classList.remove('counting');
      element.style.textShadow = '';
    });
  }
}

// ===== SCROLL ANIMATIONS FOR ABOUT SECTION =====

class AboutAnimations {
  constructor() {
    this.storyParagraphs = document.querySelectorAll('.story-paragraph');
    this.highlightItems = document.querySelectorAll('.highlight-item');
    this.aboutImage = document.querySelector('.image-container');
    this.hasAnimated = new Set();
    this.observer = null;

    this.init();
  }

  init() {
    this.createIntersectionObserver();
    this.observeElements();
  }

  createIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.2
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
          this.animateElement(entry.target);
          this.hasAnimated.add(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    // Observe story paragraphs
    this.storyParagraphs.forEach(paragraph => {
      this.observer.observe(paragraph);
    });

    // Observe highlight items
    this.highlightItems.forEach(item => {
      this.observer.observe(item);
    });

    // Observe about image
    if (this.aboutImage) {
      this.observer.observe(this.aboutImage);
    }
  }

  animateElement(element) {
    if (element.classList.contains('story-paragraph')) {
      this.animateStoryParagraph(element);
    } else if (element.classList.contains('highlight-item')) {
      this.animateHighlightItem(element);
    } else if (element.classList.contains('image-container')) {
      this.animateImage(element);
    }
  }

  animateStoryParagraph(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';

    // Get the delay from CSS or calculate based on index
    const delay = parseFloat(getComputedStyle(element).animationDelay) * 1000 || 0;

    setTimeout(() => {
      element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay);
  }

  animateHighlightItem(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px) scale(0.95)';

    setTimeout(() => {
      element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) scale(1)';
    }, 100);
  }

  animateImage(element) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.9) rotate(-2deg)';

    setTimeout(() => {
      element.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
      element.style.opacity = '1';
      element.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
  }
}


// ===== SKILLS SECTION FUNCTIONALITY =====

class SkillsAnimations {
  constructor() {
    this.skillCategories = document.querySelectorAll('.skill-category');
    this.skillItems = document.querySelectorAll('.skill-item');
    this.progressBars = document.querySelectorAll('.progress-bar');
    this.hasAnimated = new Set();
    this.observer = null;

    this.init();
  }

  init() {
    this.createIntersectionObserver();
    this.observeElements();
    this.bindHoverEvents();
  }

  createIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.2
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
          this.animateElement(entry.target);
          this.hasAnimated.add(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    // Observe skill categories for entrance animations
    this.skillCategories.forEach(category => {
      this.observer.observe(category);
    });

    // Observe individual skill items for progress bar animations
    this.skillItems.forEach(item => {
      this.observer.observe(item);
    });
  }

  animateElement(element) {
    if (element.classList.contains('skill-category')) {
      this.animateSkillCategory(element);
    } else if (element.classList.contains('skill-item')) {
      this.animateSkillItem(element);
    }
  }

  animateSkillCategory(category) {
    // Add entrance animation class
    category.classList.add('animate-in');

    // Animate skill items within this category with stagger
    const skillItems = category.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-in');
        this.animateProgressBar(item);
      }, index * 150); // 150ms stagger between items
    });
  }

  animateSkillItem(item) {
    // This handles individual skill items that might be observed separately
    if (!item.classList.contains('animate-in')) {
      item.classList.add('animate-in');
      this.animateProgressBar(item);
    }
  }

  animateProgressBar(skillItem) {
    const progressBar = skillItem.querySelector('.progress-bar');
    if (!progressBar) return;

    const level = parseInt(progressBar.getAttribute('data-level'));

    // Add animated class for shine effect
    progressBar.classList.add('animated');

    // Animate the width with a slight delay for better visual effect
    setTimeout(() => {
      progressBar.style.width = `${level}%`;
    }, 200);

    // Add completion effect when animation finishes
    setTimeout(() => {
      this.addProgressCompletionEffect(progressBar);
    }, 1700); // Match the CSS transition duration
  }

  addProgressCompletionEffect(progressBar) {
    // Add a subtle pulse effect when progress bar completes
    progressBar.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.6)';

    setTimeout(() => {
      progressBar.style.boxShadow = '';
    }, 1000);
  }

  bindHoverEvents() {
    this.skillItems.forEach(item => {
      item.addEventListener('mouseenter', () => this.handleSkillHover(item));
      item.addEventListener('mouseleave', () => this.handleSkillLeave(item));
    });
  }

  handleSkillHover(item) {
    // Add enhanced glow effect on hover
    const skillIcon = item.querySelector('.skill-icon');
    const progressBar = item.querySelector('.progress-bar');

    if (skillIcon) {
      skillIcon.style.animation = 'skill-glow 1.5s ease-in-out infinite alternate';
    }

    if (progressBar) {
      progressBar.style.filter = 'brightness(1.2) saturate(1.3)';
    }

    // Add subtle vibration effect
    item.style.animation = 'subtle-vibrate 0.3s ease-in-out';
  }

  handleSkillLeave(item) {
    // Remove hover effects
    const skillIcon = item.querySelector('.skill-icon');
    const progressBar = item.querySelector('.progress-bar');

    if (skillIcon) {
      skillIcon.style.animation = '';
    }

    if (progressBar) {
      progressBar.style.filter = '';
    }

    item.style.animation = '';
  }

  // Method to reset all animations (useful for testing)
  reset() {
    this.hasAnimated.clear();

    this.skillCategories.forEach(category => {
      category.classList.remove('animate-in');
    });

    this.skillItems.forEach(item => {
      item.classList.remove('animate-in');
      const progressBar = item.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.classList.remove('animated');
      }
    });
  }

  // Method to manually trigger animations (useful for testing)
  triggerAnimations() {
    this.skillCategories.forEach(category => {
      this.animateSkillCategory(category);
    });
  }
}

// ===== EDUCATION SECTION FUNCTIONALITY =====

class EducationAnimations {
  constructor() {
    this.educationItems = document.querySelectorAll('.education-item');
    this.educationTimeline = document.querySelector('.education-timeline');
    this.hasAnimated = new Set();
    this.observer = null;

    this.init();
  }

  init() {
    this.createIntersectionObserver();
    this.observeElements();
    this.bindHoverEvents();
    this.animateTimeline();
  }

  createIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.3
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
          this.animateEducationItem(entry.target);
          this.hasAnimated.add(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    // Observe education items for entrance animations
    this.educationItems.forEach(item => {
      this.observer.observe(item);
    });

    // Observe timeline for drawing animation
    if (this.educationTimeline) {
      this.observer.observe(this.educationTimeline);
    }
  }

  animateTimeline() {
    // Animate the timeline line drawing effect
    if (this.educationTimeline) {
      const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated.has('timeline')) {
            this.educationTimeline.classList.add('education-animate-timeline');
            this.hasAnimated.add('timeline');
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -200px 0px',
        threshold: 0.1
      });

      timelineObserver.observe(this.educationTimeline);
    }
  }

  animateEducationItem(item) {
    const index = Array.from(this.educationItems).indexOf(item);

    // Add entrance animation with stagger
    setTimeout(() => {
      item.classList.add('animate-in');

      // Animate the date badge
      const dateBadge = item.querySelector('.education-date');
      if (dateBadge) {
        setTimeout(() => {
          dateBadge.classList.add('education-pulse-badge');
        }, 300);
      }

      // Animate the content with reveal effect
      const content = item.querySelector('.education-content-item');
      if (content) {
        setTimeout(() => {
          content.classList.add('education-animate-content');
        }, 200);
      }

      // Animate highlight tags with wave effect
      const highlights = item.querySelector('.education-highlights');
      if (highlights) {
        setTimeout(() => {
          highlights.classList.add('education-wave-tags');
        }, 500);
      }

    }, index * 200); // Stagger animation by 200ms per item
  }

  bindHoverEvents() {
    this.educationItems.forEach(item => {
      item.addEventListener('mouseenter', () => this.handleEducationHover(item));
      item.addEventListener('mouseleave', () => this.handleEducationLeave(item));
    });
  }

  handleEducationHover(item) {
    // Enhanced hover effects
    const icon = item.querySelector('.education-icon');
    const dateDot = item.querySelector('.education-date::before');
    const contentItem = item.querySelector('.education-content-item');

    // Icon rotation and glow
    if (icon) {
      icon.style.animation = 'education-icon-rotate 0.3s ease-out forwards, education-glow 2s ease-in-out infinite alternate';
    }

    // Content glow effect
    if (contentItem) {
      contentItem.classList.add('education-glow-card');
    }

    // Animate highlight tags
    const tags = item.querySelectorAll('.highlight-tag');
    tags.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.transform = 'translateY(-3px) scale(1.05)';
        tag.style.boxShadow = '0 5px 15px rgba(0, 212, 255, 0.4)';
      }, index * 50);
    });

    // Add subtle parallax effect to the entire item
    item.style.transform = 'translateY(-8px)';
    item.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  handleEducationLeave(item) {
    // Remove hover effects
    const icon = item.querySelector('.education-icon');
    const contentItem = item.querySelector('.education-content-item');

    if (icon) {
      icon.style.animation = '';
    }

    if (contentItem) {
      contentItem.classList.remove('education-glow-card');
    }

    // Reset highlight tags
    const tags = item.querySelectorAll('.highlight-tag');
    tags.forEach(tag => {
      tag.style.transform = '';
      tag.style.boxShadow = '';
    });

    // Reset item position
    item.style.transform = '';
  }

  // Method to add dynamic content (useful for future enhancements)
  addEducationItem(educationData) {
    const newItem = this.createEducationItemHTML(educationData);
    if (this.educationTimeline) {
      this.educationTimeline.appendChild(newItem);
      this.observer.observe(newItem);
    }
  }

  createEducationItemHTML(data) {
    const item = document.createElement('div');
    item.className = 'education-item';
    item.setAttribute('data-year', data.year);

    item.innerHTML = `
      <div class="education-date">
        <span class="date-range">${data.dateRange}</span>
        <span class="date-status">${data.status}</span>
      </div>
      <div class="education-content-item">
        <div class="education-icon">
          <span class="icon">${data.icon}</span>
        </div>
        <div class="education-details">
          <h3 class="education-title">${data.title}</h3>
          <h4 class="education-institution">${data.institution}</h4>
          <p class="education-description">${data.description}</p>
          <div class="education-highlights">
            ${data.highlights.map(highlight =>
      `<span class="highlight-tag">${highlight}</span>`
    ).join('')}
          </div>
        </div>
      </div>
    `;

    return item;
  }

  // Method to reset animations (useful for testing)
  reset() {
    this.hasAnimated.clear();

    this.educationItems.forEach(item => {
      item.classList.remove('animate-in');

      const dateBadge = item.querySelector('.education-date');
      if (dateBadge) {
        dateBadge.classList.remove('education-pulse-badge');
      }

      const content = item.querySelector('.education-content-item');
      if (content) {
        content.classList.remove('education-animate-content', 'education-glow-card');
      }

      const highlights = item.querySelector('.education-highlights');
      if (highlights) {
        highlights.classList.remove('education-wave-tags');
      }
    });

    if (this.educationTimeline) {
      this.educationTimeline.classList.remove('education-animate-timeline');
    }
  }

  // Method to manually trigger animations (useful for testing)
  triggerAnimations() {
    this.educationItems.forEach(item => {
      this.animateEducationItem(item);
    });
  }

  // Method to highlight specific education item (useful for navigation)
  highlightEducationItem(year) {
    const targetItem = document.querySelector(`.education-item[data-year="${year}"]`);
    if (targetItem) {
      // Scroll to item
      const headerHeight = 70;
      const targetPosition = targetItem.offsetTop - headerHeight - 50;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Add highlight effect
      targetItem.style.animation = 'education-glow 1s ease-in-out 3';

      setTimeout(() => {
        targetItem.style.animation = '';
      }, 3000);
    }
  }
}



// ===== PROJECTS FUNCTIONALITY =====

class ProjectsManager {
  constructor() {
    this.projectsContainer = document.querySelector('.projects-grid');
    this.projects = this.getProjectsData();

    this.init();
  }

  init() {
    if (this.projectsContainer) {
      this.renderProjects();
    }
  }

  getProjectsData() {
    return [
      {
        id: 'ecommerce-platform',
        title: 'E-commerce Platform',
        description: 'Plataforma de comercio electrónico completa con React, Node.js y MongoDB. Incluye gestión de productos, carrito de compras, procesamiento de pagos y panel de administración.',
        detailedDescription: 'Una solución completa de e-commerce con arquitectura moderna, incluyendo autenticación JWT, integración con Stripe para pagos, y dashboard administrativo con métricas en tiempo real.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'JWT'],
        githubUrl: 'https://github.com/julianrubiano/ecommerce-platform',
        liveUrl: 'https://ecommerce-demo.julianrubiano.dev',
        imageUrl: 'assets/images/projects/ecommerce-platform.jpg',
        featured: true,
        category: 'Full Stack'
      },
      {
        id: 'task-management-app',
        title: 'Task Management App',
        description: 'Aplicación de gestión de tareas con funcionalidades avanzadas como colaboración en tiempo real, notificaciones push y sincronización offline.',
        detailedDescription: 'Sistema de gestión de proyectos inspirado en metodologías ágiles, con tableros Kanban, chat en tiempo real y métricas de productividad.',
        technologies: ['React', 'TypeScript', 'Socket.io', 'PostgreSQL', 'Redis'],
        githubUrl: 'https://github.com/julianrubiano/task-manager',
        liveUrl: 'https://tasks.julianrubiano.dev',
        imageUrl: 'assets/images/projects/task-manager.jpg',
        featured: false,
        category: 'Frontend'
      },
      {
        id: 'weather-dashboard',
        title: 'Weather Dashboard',
        description: 'Dashboard meteorológico interactivo con visualización de datos en tiempo real, pronósticos extendidos y mapas climáticos.',
        detailedDescription: 'Aplicación que consume múltiples APIs meteorológicas para mostrar datos precisos con gráficos interactivos y alertas personalizadas.',
        technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI', 'Chart.js'],
        githubUrl: 'https://github.com/julianrubiano/weather-dashboard',
        liveUrl: 'https://weather.julianrubiano.dev',
        imageUrl: 'assets/images/projects/weather-dashboard.jpg',
        featured: false,
        category: 'Data Visualization'
      },
      {
        id: 'social-media-analytics',
        title: 'Social Media Analytics',
        description: 'Herramienta de análisis de redes sociales que procesa grandes volúmenes de datos para generar insights y reportes automatizados.',
        detailedDescription: 'Plataforma de análisis que utiliza machine learning para identificar tendencias, sentimientos y métricas de engagement en redes sociales.',
        technologies: ['Python', 'Django', 'Pandas', 'Scikit-learn', 'Celery', 'Docker'],
        githubUrl: 'https://github.com/julianrubiano/social-analytics',
        liveUrl: null,
        imageUrl: 'assets/images/projects/social-analytics.jpg',
        featured: true,
        category: 'Data Science'
      },
      {
        id: 'portfolio-website',
        title: 'Portfolio Cyberpunk',
        description: 'Este mismo portafolio web con diseño cyberpunk, animaciones suaves y optimización SEO. Desarrollado con HTML5, CSS3 y JavaScript vanilla.',
        detailedDescription: 'Portafolio personal con estética cyberpunk anime, efectos neon sutiles, animaciones CSS avanzadas y optimización completa para rendimiento y SEO.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Intersection Observer'],
        githubUrl: 'https://github.com/julianrubiano/cyberpunk-portfolio',
        liveUrl: 'https://julianrubiano.dev',
        imageUrl: 'assets/images/projects/portfolio.jpg',
        featured: false,
        category: 'Frontend'
      },
      {
        id: 'api-gateway',
        title: 'Microservices API Gateway',
        description: 'Gateway de APIs para arquitectura de microservicios con autenticación, rate limiting, logging y monitoreo en tiempo real.',
        detailedDescription: 'Solución empresarial para gestión de microservicios con balanceador de carga, circuit breaker pattern y métricas detalladas.',
        technologies: ['Node.js', 'Express', 'Redis', 'Docker', 'Kubernetes', 'Prometheus'],
        githubUrl: 'https://github.com/julianrubiano/api-gateway',
        liveUrl: null,
        imageUrl: 'assets/images/projects/api-gateway.jpg',
        featured: false,
        category: 'Backend'
      }
    ];
  }

  renderProjects() {
    if (!this.projects || this.projects.length === 0) {
      this.renderEmptyState();
      return;
    }

    // Show loading state
    this.showLoadingState();

    // Simulate loading delay for better UX
    setTimeout(() => {
      this.projectsContainer.innerHTML = '';

      this.projects.forEach(project => {
        const projectCard = this.createProjectCard(project);
        this.projectsContainer.appendChild(projectCard);
      });

      // Add intersection observer for animations
      this.addScrollAnimations();
    }, 500);
  }

  createProjectCard(project) {
    const card = document.createElement('div');
    card.className = `project-card ${project.featured ? 'featured' : ''}`;
    card.setAttribute('data-category', project.category);

    const hasImage = project.imageUrl && project.imageUrl !== '';
    const previewContent = hasImage
      ? `<img src="${project.imageUrl}" alt="${project.title}" loading="lazy">`
      : `<div class="project-preview-placeholder">
           <span>${this.getProjectIcon(project.category)}</span>
         </div>`;

    const liveUrlButton = project.liveUrl
      ? `<a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="Ver demo en vivo de ${project.title}">
           <span class="project-link-icon">🚀</span>
           <span>Demo</span>
         </a>`
      : '';

    const overlayLiveButton = project.liveUrl
      ? `<a href="${project.liveUrl}" class="project-overlay-link" target="_blank" rel="noopener noreferrer">
           <span>🚀</span>
           <span>Ver Demo</span>
         </a>`
      : '';

    card.innerHTML = `
      <div class="project-preview">
        ${previewContent}
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech-stack">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="Ver código fuente de ${project.title} en GitHub">
            <span class="project-link-icon">📂</span>
            <span>GitHub</span>
          </a>
          ${liveUrlButton}
        </div>
      </div>
      <div class="project-overlay">
        <div class="project-overlay-content">
          <h4 class="project-overlay-title">${project.title}</h4>
          <p class="project-overlay-description">${project.detailedDescription}</p>
          <div class="project-overlay-links">
            <a href="${project.githubUrl}" class="project-overlay-link" target="_blank" rel="noopener noreferrer">
              <span>📂</span>
              <span>Código</span>
            </a>
            ${overlayLiveButton}
          </div>
        </div>
      </div>
    `;

    // Add click event for accessibility
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on links
      if (e.target.closest('a')) return;

      // Focus on the first link for keyboard users
      const firstLink = card.querySelector('.project-link');
      if (firstLink) {
        firstLink.focus();
      }
    });

    // Add keyboard navigation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const firstLink = card.querySelector('.project-link');
        if (firstLink) {
          firstLink.click();
        }
      }
    });

    return card;
  }

  getProjectIcon(category) {
    const icons = {
      'Full Stack': '🌐',
      'Frontend': '🎨',
      'Backend': '⚙️',
      'Data Science': '📊',
      'Data Visualization': '📈',
      'Mobile': '📱',
      'Desktop': '💻'
    };

    return icons[category] || '💼';
  }

  showLoadingState() {
    this.projectsContainer.innerHTML = `
      <div class="projects-loading">
        <div class="loading-spinner"></div>
        <span>Cargando proyectos...</span>
      </div>
    `;
  }

  renderEmptyState() {
    this.projectsContainer.innerHTML = `
      <div class="projects-empty">
        <div class="projects-empty-icon">📁</div>
        <h3 class="projects-empty-title">No hay proyectos disponibles</h3>
        <p class="projects-empty-description">Los proyectos se mostrarán aquí próximamente.</p>
      </div>
    `;
  }

  addScrollAnimations() {
    const projectCards = document.querySelectorAll('.project-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    projectCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  // Method to filter projects by category (for future enhancement)
  filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
}



// ===== ENHANCED PROJECT INTERACTIONS =====

class ProjectInteractions {
  constructor() {
    this.init();
  }

  init() {
    // Wait for projects to be rendered
    setTimeout(() => {
      this.addHoverEffects();
      this.addKeyboardNavigation();
      this.addTouchSupport();
    }, 600);
  }

  addHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      // Mouse enter effect
      card.addEventListener('mouseenter', (e) => {
        this.handleCardHover(e.target, true);
      });

      // Mouse leave effect
      card.addEventListener('mouseleave', (e) => {
        this.handleCardHover(e.target, false);
      });

      // Add parallax effect to card content
      card.addEventListener('mousemove', (e) => {
        this.handleCardParallax(e, card);
      });
    });
  }

  handleCardHover(card, isHovering) {
    const techTags = card.querySelectorAll('.tech-tag');
    const projectLinks = card.querySelectorAll('.project-link');

    if (isHovering) {
      // Stagger animation for tech tags
      techTags.forEach((tag, index) => {
        setTimeout(() => {
          tag.style.transform = 'translateY(-2px)';
          tag.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
        }, index * 50);
      });

      // Animate project links
      projectLinks.forEach((link, index) => {
        setTimeout(() => {
          link.style.transform = 'translateY(-2px)';
        }, index * 100);
      });

      // Add subtle card tilt
      card.style.transform = 'translateY(-8px) rotateX(2deg)';

    } else {
      // Reset animations
      techTags.forEach(tag => {
        tag.style.transform = '';
        tag.style.boxShadow = '';
      });

      projectLinks.forEach(link => {
        link.style.transform = '';
      });

      card.style.transform = '';
    }
  }

  handleCardParallax(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    const overlay = card.querySelector('.project-overlay');
    if (overlay && !overlay.matches(':hover')) {
      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  }

  addKeyboardNavigation() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Proyecto ${index + 1}: ${card.querySelector('.project-title').textContent}`);

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardActivation(card);
        }

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          this.focusNextCard(index, projectCards);
        }

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.focusPreviousCard(index, projectCards);
        }
      });

      card.addEventListener('focus', () => {
        card.style.outline = '2px solid var(--primary-blue)';
        card.style.outlineOffset = '4px';
      });

      card.addEventListener('blur', () => {
        card.style.outline = '';
        card.style.outlineOffset = '';
      });
    });
  }

  handleCardActivation(card) {
    // Simulate hover effect for keyboard users
    const overlay = card.querySelector('.project-overlay');
    if (overlay) {
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';

      // Focus on first overlay link
      const firstLink = overlay.querySelector('.project-overlay-link');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }

      // Add escape key listener to close overlay
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          overlay.style.opacity = '';
          overlay.style.visibility = '';
          card.focus();
          document.removeEventListener('keydown', handleEscape);
        }
      };

      document.addEventListener('keydown', handleEscape);
    }
  }

  focusNextCard(currentIndex, cards) {
    const nextIndex = (currentIndex + 1) % cards.length;
    cards[nextIndex].focus();
  }

  focusPreviousCard(currentIndex, cards) {
    const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
    cards[prevIndex].focus();
  }

  addTouchSupport() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      let touchStartTime = 0;

      card.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        card.classList.add('touch-active');
      });

      card.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        card.classList.remove('touch-active');

        // Long press to show overlay on mobile
        if (touchDuration > 500) {
          e.preventDefault();
          this.toggleMobileOverlay(card);
        }
      });

      // Prevent default touch behavior on overlay links
      const overlayLinks = card.querySelectorAll('.project-overlay-link');
      overlayLinks.forEach(link => {
        link.addEventListener('touchstart', (e) => {
          e.stopPropagation();
        });
      });
    });
  }

  toggleMobileOverlay(card) {
    const overlay = card.querySelector('.project-overlay');
    const isVisible = overlay.style.opacity === '1';

    // Close all other overlays first
    document.querySelectorAll('.project-overlay').forEach(o => {
      o.style.opacity = '';
      o.style.visibility = '';
    });

    if (!isVisible) {
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';

      // Add click outside listener to close
      const handleClickOutside = (e) => {
        if (!card.contains(e.target)) {
          overlay.style.opacity = '';
          overlay.style.visibility = '';
          document.removeEventListener('click', handleClickOutside);
        }
      };

      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
    }
  }
}


// ===== EXPERIENCE SECTION FUNCTIONALITY =====

class ExperienceAnimations {
  constructor() {
    this.experienceItems = document.querySelectorAll('.experience-item');
    this.experienceTimeline = document.querySelector('.experience-timeline');
    this.hasAnimated = new Set();
    this.observer = null;

    this.init();
  }

  init() {
    this.createIntersectionObserver();
    this.observeElements();
    this.bindHoverEvents();
    this.animateTimeline();
  }

  createIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.3
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
          this.animateExperienceItem(entry.target);
          this.hasAnimated.add(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    // Observe experience items for entrance animations
    this.experienceItems.forEach(item => {
      this.observer.observe(item);
    });

    // Observe timeline for drawing animation
    if (this.experienceTimeline) {
      this.observer.observe(this.experienceTimeline);
    }
  }

  animateTimeline() {
    // Animate the timeline line drawing effect
    if (this.experienceTimeline) {
      const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated.has('timeline')) {
            this.experienceTimeline.classList.add('experience-animate-timeline');
            this.hasAnimated.add('timeline');
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -200px 0px',
        threshold: 0.1
      });

      timelineObserver.observe(this.experienceTimeline);
    }
  }

  animateExperienceItem(item) {
    const index = Array.from(this.experienceItems).indexOf(item);

    // Add entrance animation with stagger
    setTimeout(() => {
      item.classList.add('animate-in');

      // Animate the timeline dot
      const timelineDot = item.querySelector('.timeline-dot');
      if (timelineDot) {
        setTimeout(() => {
          timelineDot.classList.add('experience-pulse-dot');
        }, 300);
      }

      // Animate the experience card with reveal effect
      const experienceCard = item.querySelector('.experience-card');
      if (experienceCard) {
        setTimeout(() => {
          experienceCard.classList.add('experience-animate-card');
        }, 200);
      }

      // Animate achievement items with wave effect
      const achievements = item.querySelectorAll('.achievements-list li');
      if (achievements.length > 0) {
        setTimeout(() => {
          achievements.forEach((achievement, achIndex) => {
            setTimeout(() => {
              achievement.classList.add('experience-wave-achievement');
            }, achIndex * 100);
          });
        }, 500);
      }

      // Animate technology tags with stagger
      const techTags = item.querySelectorAll('.tech-tag');
      if (techTags.length > 0) {
        setTimeout(() => {
          techTags.forEach((tag, tagIndex) => {
            setTimeout(() => {
              tag.classList.add('experience-animate-tag');
            }, tagIndex * 80);
          });
        }, 700);
      }

    }, index * 300); // Stagger animation by 300ms per item
  }

  bindHoverEvents() {
    this.experienceItems.forEach(item => {
      item.addEventListener('mouseenter', () => this.handleExperienceHover(item));
      item.addEventListener('mouseleave', () => this.handleExperienceLeave(item));
    });
  }

  handleExperienceHover(item) {
    // Enhanced hover effects
    const companyIcon = item.querySelector('.company-icon');
    const timelineDot = item.querySelector('.timeline-dot');
    const experienceCard = item.querySelector('.experience-card');

    // Company icon rotation and glow
    if (companyIcon) {
      companyIcon.style.animation = 'experience-icon-rotate 0.3s ease-out forwards, experience-glow 2s ease-in-out infinite alternate';
    }

    // Timeline dot pulse effect
    if (timelineDot) {
      timelineDot.style.animation = 'experience-dot-pulse 1.5s ease-in-out infinite';
    }

    // Card glow effect
    if (experienceCard) {
      experienceCard.classList.add('experience-glow-card');
    }

    // Animate achievement items
    const achievements = item.querySelectorAll('.achievements-list li');
    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        achievement.style.transform = 'translateX(5px)';
        achievement.style.color = 'var(--text-primary)';
      }, index * 50);
    });

    // Animate technology tags
    const techTags = item.querySelectorAll('.tech-tag');
    techTags.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.transform = 'translateY(-3px) scale(1.05)';
        tag.style.boxShadow = '0 5px 15px rgba(139, 92, 246, 0.4)';
      }, index * 30);
    });

    // Add subtle parallax effect to the entire item
    item.style.transform = 'translateY(-5px)';
    item.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  handleExperienceLeave(item) {
    // Remove hover effects
    const companyIcon = item.querySelector('.company-icon');
    const timelineDot = item.querySelector('.timeline-dot');
    const experienceCard = item.querySelector('.experience-card');

    if (companyIcon) {
      companyIcon.style.animation = '';
    }

    if (timelineDot) {
      timelineDot.style.animation = '';
    }

    if (experienceCard) {
      experienceCard.classList.remove('experience-glow-card');
    }

    // Reset achievement items
    const achievements = item.querySelectorAll('.achievements-list li');
    achievements.forEach(achievement => {
      achievement.style.transform = '';
      achievement.style.color = '';
    });

    // Reset technology tags
    const techTags = item.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
      tag.style.transform = '';
      tag.style.boxShadow = '';
    });

    // Reset item position
    item.style.transform = '';
  }

  // Method to add dynamic experience (useful for future enhancements)
  addExperienceItem(experienceData) {
    const newItem = this.createExperienceItemHTML(experienceData);
    if (this.experienceTimeline) {
      this.experienceTimeline.appendChild(newItem);
      this.observer.observe(newItem);
    }
  }

  createExperienceItemHTML(data) {
    const item = document.createElement('div');
    item.className = 'experience-item';
    item.setAttribute('data-year', data.year);

    item.innerHTML = `
      <div class="timeline-marker">
        <div class="timeline-dot"></div>
        <div class="timeline-line"></div>
      </div>
      <div class="experience-card">
        <div class="experience-header">
          <div class="experience-date">
            <span class="date-range">${data.dateRange}</span>
            <span class="date-duration">${data.duration}</span>
          </div>
          <div class="company-logo">
            <span class="company-icon">${data.icon}</span>
          </div>
        </div>
        <div class="experience-details">
          <h3 class="position-title">${data.position}</h3>
          <h4 class="company-name">${data.company}</h4>
          <p class="experience-description">${data.description}</p>
          <div class="experience-achievements">
            <h5>Logros principales:</h5>
            <ul class="achievements-list">
              ${data.achievements.map(achievement => 
                `<li>${achievement}</li>`
              ).join('')}
            </ul>
          </div>
          <div class="experience-technologies">
            ${data.technologies.map(tech => 
              `<span class="tech-tag">${tech}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    `;

    return item;
  }

  // Method to reset animations (useful for testing)
  reset() {
    this.hasAnimated.clear();

    this.experienceItems.forEach(item => {
      item.classList.remove('animate-in');

      const timelineDot = item.querySelector('.timeline-dot');
      if (timelineDot) {
        timelineDot.classList.remove('experience-pulse-dot');
      }

      const experienceCard = item.querySelector('.experience-card');
      if (experienceCard) {
        experienceCard.classList.remove('experience-animate-card', 'experience-glow-card');
      }

      const achievements = item.querySelectorAll('.achievements-list li');
      achievements.forEach(achievement => {
        achievement.classList.remove('experience-wave-achievement');
      });

      const techTags = item.querySelectorAll('.tech-tag');
      techTags.forEach(tag => {
        tag.classList.remove('experience-animate-tag');
      });
    });

    if (this.experienceTimeline) {
      this.experienceTimeline.classList.remove('experience-animate-timeline');
    }
  }

  // Method to manually trigger animations (useful for testing)
  triggerAnimations() {
    this.experienceItems.forEach(item => {
      this.animateExperienceItem(item);
    });
  }

  // Method to highlight specific experience item (useful for navigation)
  highlightExperienceItem(year) {
    const targetItem = document.querySelector(`.experience-item[data-year="${year}"]`);
    if (targetItem) {
      // Scroll to item
      const headerHeight = 70;
      const targetPosition = targetItem.offsetTop - headerHeight - 50;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Add highlight effect
      targetItem.style.animation = 'experience-highlight 1s ease-in-out 3';

      setTimeout(() => {
        targetItem.style.animation = '';
      }, 3000);
    }
  }
}