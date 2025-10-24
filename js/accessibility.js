// Comprehensive Accessibility Enhancement System

class AccessibilityManager {
  constructor() {
    this.focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    this.currentFocusIndex = -1;
    this.focusableElementsList = [];
    this.isHighContrastMode = false;
    this.isReducedMotion = false;
    
    this.init();
  }

  init() {
    this.detectUserPreferences();
    this.enhanceKeyboardNavigation();
    this.addSkipLinks();
    this.enhanceFormAccessibility();
    this.addLiveRegions();
    this.setupFocusManagement();
    this.addAccessibilityControls();
    this.enhanceAnimationAccessibility();
  }

  detectUserPreferences() {
    // Detect reduced motion preference
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detect high contrast preference
    this.isHighContrastMode = window.matchMedia('(prefers-contrast: high)').matches;
    
    // Apply preferences
    if (this.isReducedMotion) {
      document.body.classList.add('reduce-motion');
    }
    
    if (this.isHighContrastMode) {
      document.body.classList.add('high-contrast');
    }
  }

  enhanceKeyboardNavigation() {
    // Add keyboard navigation for custom interactive elements
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Enhance focus visibility
    document.addEventListener('focusin', (e) => {
      this.enhanceFocusVisibility(e.target);
    });

    document.addEventListener('focusout', (e) => {
      this.removeFocusEnhancement(e.target);
    });
  }

  handleKeyboardNavigation(e) {
    switch (e.key) {
      case 'Tab':
        this.handleTabNavigation(e);
        break;
      case 'Escape':
        this.handleEscapeKey(e);
        break;
      case 'Enter':
      case ' ':
        this.handleActivation(e);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.handleArrowNavigation(e);
        break;
    }
  }

  handleTabNavigation(e) {
    this.updateFocusableElements();
    
    // Trap focus in modals or mobile menu
    const activeModal = document.querySelector('.modal.active, .nav-menu.active');
    if (activeModal) {
      this.trapFocus(e, activeModal);
    }
  }

  handleEscapeKey(e) {
    // Close mobile menu
    const mobileMenu = document.querySelector('.nav-menu.active');
    if (mobileMenu) {
      const navToggle = document.querySelector('.nav-toggle');
      if (navToggle) {
        navToggle.click();
        navToggle.focus();
      }
    }

    // Close any open modals or dropdowns
    const openModals = document.querySelectorAll('.modal.active, .dropdown.active');
    openModals.forEach(modal => {
      modal.classList.remove('active');
    });
  }

  handleActivation(e) {
    const target = e.target;
    
    // Handle custom button-like elements
    if (target.hasAttribute('role') && target.getAttribute('role') === 'button') {
      e.preventDefault();
      target.click();
    }
  }

  handleArrowNavigation(e) {
    const target = e.target;
    
    // Handle navigation menu arrow keys
    if (target.closest('.nav-menu')) {
      this.handleMenuArrowNavigation(e);
    }
    
    // Handle skill items navigation
    if (target.closest('.skills-grid')) {
      this.handleSkillsNavigation(e);
    }
  }

  handleMenuArrowNavigation(e) {
    const menuItems = Array.from(document.querySelectorAll('.nav-menu a'));
    const currentIndex = menuItems.indexOf(e.target);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        break;
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        break;
      default:
        return;
    }
    
    menuItems[nextIndex].focus();
  }

  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(this.focusableElements);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  enhanceFocusVisibility(element) {
    element.classList.add('keyboard-focused');
    
    // Add enhanced focus ring for better visibility
    element.style.outline = '3px solid var(--neon-cyan)';
    element.style.outlineOffset = '2px';
    element.style.boxShadow = '0 0 0 1px var(--bg-dark), 0 0 15px var(--neon-cyan)';
  }

  removeFocusEnhancement(element) {
    element.classList.remove('keyboard-focused');
    element.style.outline = '';
    element.style.outlineOffset = '';
    element.style.boxShadow = '';
  }

  addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
      <a href="#navigation" class="skip-link">Saltar a la navegación</a>
      <a href="#contact" class="skip-link">Saltar al contacto</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
    
    // Add main content landmark
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.id = 'main-content';
    }
    
    // Add navigation landmark
    const navElement = document.querySelector('nav');
    if (navElement) {
      navElement.id = 'navigation';
    }
  }

  enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      this.enhanceFormElement(form);
    });
  }

  enhanceFormElement(form) {
    // Add form landmarks
    if (!form.hasAttribute('role')) {
      form.setAttribute('role', 'form');
    }
    
    // Enhance form fields
    const formFields = form.querySelectorAll('input, textarea, select');
    
    formFields.forEach(field => {
      this.enhanceFormField(field);
    });
    
    // Add form validation announcements
    form.addEventListener('submit', (e) => {
      this.announceFormValidation(form);
    });
  }

  enhanceFormField(field) {
    const fieldContainer = field.closest('.form-group');
    const label = fieldContainer?.querySelector('label');
    const errorElement = fieldContainer?.querySelector('.error-message');
    
    // Ensure proper labeling
    if (label && !field.hasAttribute('aria-labelledby')) {
      if (!label.id) {
        label.id = `label-${field.name || field.id || Math.random().toString(36).substr(2, 9)}`;
      }
      field.setAttribute('aria-labelledby', label.id);
    }
    
    // Connect error messages
    if (errorElement) {
      if (!errorElement.id) {
        errorElement.id = `error-${field.name || field.id || Math.random().toString(36).substr(2, 9)}`;
      }
      field.setAttribute('aria-describedby', errorElement.id);
    }
    
    // Add validation states
    field.addEventListener('invalid', () => {
      field.setAttribute('aria-invalid', 'true');
      this.announceFieldError(field);
    });
    
    field.addEventListener('input', () => {
      if (field.checkValidity()) {
        field.setAttribute('aria-invalid', 'false');
      }
    });
  }

  announceFieldError(field) {
    const errorElement = document.getElementById(field.getAttribute('aria-describedby'));
    if (errorElement && errorElement.textContent) {
      this.announce(errorElement.textContent, 'assertive');
    }
  }

  announceFormValidation(form) {
    const invalidFields = form.querySelectorAll(':invalid');
    
    if (invalidFields.length > 0) {
      this.announce(`Formulario contiene ${invalidFields.length} errores. Por favor, revisa los campos marcados.`, 'assertive');
    } else {
      this.announce('Formulario enviado correctamente', 'polite');
    }
  }

  addLiveRegions() {
    // Create live regions for announcements
    const liveRegions = document.createElement('div');
    liveRegions.innerHTML = `
      <div id="live-region-polite" aria-live="polite" aria-atomic="true" class="sr-only"></div>
      <div id="live-region-assertive" aria-live="assertive" aria-atomic="true" class="sr-only"></div>
    `;
    
    document.body.appendChild(liveRegions);
  }

  announce(message, priority = 'polite') {
    const liveRegion = document.getElementById(`live-region-${priority}`);
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  setupFocusManagement() {
    // Manage focus for single-page navigation
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Make target focusable temporarily
          const originalTabIndex = targetElement.getAttribute('tabindex');
          targetElement.setAttribute('tabindex', '-1');
          
          // Focus the target
          setTimeout(() => {
            targetElement.focus();
            
            // Announce navigation
            this.announce(`Navegando a la sección ${targetElement.querySelector('h2, h1')?.textContent || targetId}`, 'polite');
            
            // Restore original tabindex
            setTimeout(() => {
              if (originalTabIndex !== null) {
                targetElement.setAttribute('tabindex', originalTabIndex);
              } else {
                targetElement.removeAttribute('tabindex');
              }
            }, 100);
          }, 100);
        }
      });
    });
  }

  addAccessibilityControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'accessibility-controls';
    controlsContainer.innerHTML = `
      <button type="button" class="accessibility-toggle" aria-label="Abrir controles de accesibilidad" aria-expanded="false">
        <span class="accessibility-icon">♿</span>
      </button>
      <div class="accessibility-panel" role="dialog" aria-labelledby="accessibility-title" aria-hidden="true">
        <h3 id="accessibility-title">Opciones de Accesibilidad</h3>
        <div class="accessibility-options">
          <button type="button" class="accessibility-option" data-action="toggle-high-contrast">
            <span>Alto Contraste</span>
          </button>
          <button type="button" class="accessibility-option" data-action="toggle-large-text">
            <span>Texto Grande</span>
          </button>
          <button type="button" class="accessibility-option" data-action="toggle-reduced-motion">
            <span>Reducir Animaciones</span>
          </button>
          <button type="button" class="accessibility-option" data-action="focus-outline">
            <span>Resaltar Enlaces</span>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(controlsContainer);
    
    this.bindAccessibilityControls(controlsContainer);
  }

  bindAccessibilityControls(container) {
    const toggle = container.querySelector('.accessibility-toggle');
    const panel = container.querySelector('.accessibility-panel');
    const options = container.querySelectorAll('.accessibility-option');
    
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      
      toggle.setAttribute('aria-expanded', !isExpanded);
      panel.setAttribute('aria-hidden', isExpanded);
      panel.classList.toggle('active');
      
      if (!isExpanded) {
        // Focus first option when opening
        options[0]?.focus();
      }
    });
    
    options.forEach(option => {
      option.addEventListener('click', () => {
        const action = option.getAttribute('data-action');
        this.handleAccessibilityAction(action, option);
      });
    });
    
    // Close panel on escape
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggle.click();
        toggle.focus();
      }
    });
  }

  handleAccessibilityAction(action, button) {
    const isActive = button.classList.contains('active');
    
    switch (action) {
      case 'toggle-high-contrast':
        document.body.classList.toggle('high-contrast-mode', !isActive);
        button.classList.toggle('active');
        this.announce(isActive ? 'Alto contraste desactivado' : 'Alto contraste activado', 'polite');
        break;
        
      case 'toggle-large-text':
        document.body.classList.toggle('large-text-mode', !isActive);
        button.classList.toggle('active');
        this.announce(isActive ? 'Texto grande desactivado' : 'Texto grande activado', 'polite');
        break;
        
      case 'toggle-reduced-motion':
        document.body.classList.toggle('reduce-motion', !isActive);
        button.classList.toggle('active');
        this.announce(isActive ? 'Animaciones restauradas' : 'Animaciones reducidas', 'polite');
        break;
        
      case 'focus-outline':
        document.body.classList.toggle('enhanced-focus', !isActive);
        button.classList.toggle('active');
        this.announce(isActive ? 'Resaltado de enlaces desactivado' : 'Resaltado de enlaces activado', 'polite');
        break;
    }
  }

  enhanceAnimationAccessibility() {
    // Respect user's motion preferences
    if (this.isReducedMotion) {
      document.body.classList.add('reduce-motion');
    }
    
    // Add play/pause controls for animations
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    animatedElements.forEach(element => {
      this.addAnimationControls(element);
    });
  }

  addAnimationControls(element) {
    const controlButton = document.createElement('button');
    controlButton.className = 'animation-control';
    controlButton.setAttribute('aria-label', 'Pausar/reanudar animación');
    controlButton.innerHTML = '⏸️';
    
    let isPaused = false;
    
    controlButton.addEventListener('click', () => {
      isPaused = !isPaused;
      
      if (isPaused) {
        element.style.animationPlayState = 'paused';
        controlButton.innerHTML = '▶️';
        controlButton.setAttribute('aria-label', 'Reanudar animación');
      } else {
        element.style.animationPlayState = 'running';
        controlButton.innerHTML = '⏸️';
        controlButton.setAttribute('aria-label', 'Pausar animación');
      }
    });
    
    element.appendChild(controlButton);
  }

  updateFocusableElements() {
    this.focusableElementsList = Array.from(document.querySelectorAll(this.focusableElements))
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  // Method to programmatically announce messages
  announceMessage(message, priority = 'polite') {
    this.announce(message, priority);
  }

  // Method to get accessibility status
  getAccessibilityStatus() {
    return {
      reducedMotion: this.isReducedMotion,
      highContrast: this.isHighContrastMode,
      focusableElements: this.focusableElementsList.length,
      hasSkipLinks: document.querySelectorAll('.skip-link').length > 0,
      hasLiveRegions: document.querySelectorAll('[aria-live]').length > 0
    };
  }
}

// Initialize accessibility manager
document.addEventListener('DOMContentLoaded', () => {
  window.accessibilityManager = new AccessibilityManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityManager;
}