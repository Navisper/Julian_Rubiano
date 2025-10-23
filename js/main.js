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
});