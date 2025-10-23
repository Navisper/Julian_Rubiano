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