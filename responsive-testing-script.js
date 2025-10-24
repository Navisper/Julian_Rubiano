// Responsive Design Testing Script for Cyberpunk Portfolio
// Run this script in browser console to test responsive functionality

class ResponsiveTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      currentViewport: this.getCurrentViewport(),
      tests: {},
      issues: [],
      warnings: [],
      deviceCategory: this.getDeviceCategory()
    };
    
    console.log(`📱 Starting responsive design tests for ${this.results.deviceCategory}`);
    console.log(`Current viewport: ${window.innerWidth}x${window.innerHeight}`);
    this.runAllTests();
  }

  getCurrentViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1
    };
  }

  getDeviceCategory() {
    const width = window.innerWidth;
    
    if (width < 480) return 'Small Mobile';
    if (width < 768) return 'Large Mobile';
    if (width < 1024) return 'Tablet';
    if (width < 1440) return 'Desktop';
    return 'Large Desktop';
  }

  runAllTests() {
    console.log('📋 Running responsive design tests...\n');
    
    // Layout Tests
    this.testViewportMeta();
    this.testNavigationResponsiveness();
    this.testHeroSectionLayout();
    this.testSkillsGridLayout();
    this.testProjectsLayout();
    this.testContactFormLayout();
    
    // Touch and Interaction Tests
    this.testTouchTargets();
    this.testMobileMenuFunctionality();
    this.testFormUsability();
    
    // Typography and Readability Tests
    this.testTypographyScaling();
    this.testContentReadability();
    
    // Performance Tests
    this.testAnimationPerformance();
    this.testImageResponsiveness();
    
    // Accessibility Tests
    this.testKeyboardNavigation();
    this.testScreenReaderCompatibility();
    
    this.displayResults();
  }

  testViewportMeta() {
    const testName = 'Viewport Meta Tag';
    try {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const hasViewport = !!viewportMeta;
      const content = viewportMeta ? viewportMeta.getAttribute('content') : '';
      
      const hasWidthDevice = content.includes('width=device-width');
      const hasInitialScale = content.includes('initial-scale=1');
      
      const isValid = hasViewport && hasWidthDevice && hasInitialScale;
      
      this.results.tests[testName] = {
        status: isValid ? 'PASS' : 'FAIL',
        message: isValid ? 'Viewport meta tag properly configured' : 'Viewport meta tag missing or misconfigured',
        details: { content }
      };
      
      if (!isValid) {
        this.results.issues.push('Viewport meta tag not properly configured - responsive behavior may be broken');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing viewport meta: ${error.message}`
      };
    }
  }

  testNavigationResponsiveness() {
    const testName = 'Navigation Responsiveness';
    try {
      const navToggle = document.querySelector('.nav-toggle');
      const navMenu = document.querySelector('.nav-menu');
      const isMobile = window.innerWidth < 768;
      
      let status = 'PASS';
      let message = 'Navigation responsive behavior correct';
      
      if (isMobile) {
        if (!navToggle) {
          status = 'FAIL';
          message = 'Mobile navigation toggle not found';
          this.results.issues.push('Mobile navigation toggle missing');
        } else {
          const toggleVisible = window.getComputedStyle(navToggle).display !== 'none';
          if (!toggleVisible) {
            status = 'WARN';
            message = 'Mobile navigation toggle not visible';
            this.results.warnings.push('Mobile navigation toggle may not be visible');
          }
        }
      } else {
        const menuVisible = navMenu && window.getComputedStyle(navMenu).display !== 'none';
        if (!menuVisible) {
          status = 'WARN';
          message = 'Desktop navigation menu not visible';
          this.results.warnings.push('Desktop navigation menu may not be visible');
        }
      }
      
      this.results.tests[testName] = { status, message };
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing navigation: ${error.message}`
      };
    }
  }

  testHeroSectionLayout() {
    const testName = 'Hero Section Layout';
    try {
      const heroSection = document.querySelector('.hero-section');
      const heroContent = document.querySelector('.hero-content');
      const heroTitle = document.querySelector('.hero-name');
      
      if (!heroSection || !heroContent || !heroTitle) {
        this.results.tests[testName] = {
          status: 'FAIL',
          message: 'Hero section elements not found'
        };
        this.results.issues.push('Hero section elements missing');
        return;
      }
      
      const titleFontSize = parseFloat(window.getComputedStyle(heroTitle).fontSize);
      const contentWidth = heroContent.offsetWidth;
      const sectionHeight = heroSection.offsetHeight;
      
      let status = 'PASS';
      let message = 'Hero section layout appropriate for current viewport';
      
      // Check if title is readable (not too small)
      if (titleFontSize < 24 && window.innerWidth < 480) {
        status = 'WARN';
        message = 'Hero title may be too small on very small screens';
        this.results.warnings.push('Hero title font size may need adjustment for small screens');
      }
      
      // Check if content fits properly
      if (contentWidth > window.innerWidth * 0.95) {
        status = 'WARN';
        message = 'Hero content may be too wide for viewport';
        this.results.warnings.push('Hero content width may cause horizontal scrolling');
      }
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          titleFontSize: `${titleFontSize}px`,
          contentWidth: `${contentWidth}px`,
          sectionHeight: `${sectionHeight}px`
        }
      };
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing hero section: ${error.message}`
      };
    }
  }

  testSkillsGridLayout() {
    const testName = 'Skills Grid Layout';
    try {
      const skillsGrid = document.querySelector('.skills-grid');
      const skillItems = document.querySelectorAll('.skill-item');
      
      if (!skillsGrid || skillItems.length === 0) {
        this.results.tests[testName] = {
          status: 'FAIL',
          message: 'Skills grid or items not found'
        };
        this.results.issues.push('Skills section elements missing');
        return;
      }
      
      const gridStyle = window.getComputedStyle(skillsGrid);
      const gridColumns = gridStyle.gridTemplateColumns;
      const expectedColumns = this.getExpectedGridColumns();
      
      let status = 'PASS';
      let message = `Skills grid layout appropriate (${skillItems.length} items)`;
      
      // Check if grid adapts to viewport
      if (window.innerWidth < 768 && gridColumns.includes('1fr 1fr 1fr')) {
        status = 'WARN';
        message = 'Skills grid may have too many columns for mobile';
        this.results.warnings.push('Skills grid should use fewer columns on mobile');
      }
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          itemCount: skillItems.length,
          gridColumns: gridColumns || 'Not using CSS Grid',
          expectedColumns
        }
      };
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing skills grid: ${error.message}`
      };
    }
  }

  getExpectedGridColumns() {
    const width = window.innerWidth;
    if (width < 480) return '1 column';
    if (width < 768) return '1-2 columns';
    if (width < 1024) return '2-3 columns';
    return '3+ columns';
  }

  testProjectsLayout() {
    const testName = 'Projects Layout';
    try {
      const projectsGrid = document.querySelector('.projects-grid');
      const projectCards = document.querySelectorAll('.project-card');
      
      if (!projectsGrid) {
        this.results.tests[testName] = {
          status: 'WARN',
          message: 'Projects grid not found (may be dynamically generated)'
        };
        return;
      }
      
      const gridStyle = window.getComputedStyle(projectsGrid);
      
      this.results.tests[testName] = {
        status: 'PASS',
        message: `Projects layout configured (${projectCards.length} cards found)`,
        details: {
          cardCount: projectCards.length,
          gridDisplay: gridStyle.display
        }
      };
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing projects layout: ${error.message}`
      };
    }
  }

  testContactFormLayout() {
    const testName = 'Contact Form Layout';
    try {
      const contactForm = document.querySelector('.contact-form');
      const formInputs = contactForm ? contactForm.querySelectorAll('input, textarea') : [];
      
      if (!contactForm) {
        this.results.tests[testName] = {
          status: 'FAIL',
          message: 'Contact form not found'
        };
        this.results.issues.push('Contact form missing');
        return;
      }
      
      let status = 'PASS';
      let message = 'Contact form layout appropriate';
      
      // Check input widths
      formInputs.forEach((input, index) => {
        const inputWidth = input.offsetWidth;
        const containerWidth = contactForm.offsetWidth;
        
        if (inputWidth > containerWidth * 1.1) {
          status = 'WARN';
          message = 'Some form inputs may be too wide';
          this.results.warnings.push('Form inputs may cause horizontal scrolling');
        }
      });
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          inputCount: formInputs.length,
          formWidth: `${contactForm.offsetWidth}px`
        }
      };
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing contact form: ${error.message}`
      };
    }
  }

  testTouchTargets() {
    const testName = 'Touch Target Sizes';
    try {
      const touchElements = document.querySelectorAll('button, a, input, .skill-item, .project-card');
      const minTouchSize = 44; // 44px minimum recommended
      let smallTargets = 0;
      
      touchElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const minDimension = Math.min(rect.width, rect.height);
        
        if (minDimension < minTouchSize && minDimension > 0) {
          smallTargets++;
        }
      });
      
      const status = smallTargets === 0 ? 'PASS' : smallTargets < 3 ? 'WARN' : 'FAIL';
      const message = smallTargets === 0 
        ? 'All touch targets meet minimum size requirements'
        : `${smallTargets} touch targets may be too small (< ${minTouchSize}px)`;
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          totalElements: touchElements.length,
          smallTargets,
          minRequiredSize: `${minTouchSize}px`
        }
      };
      
      if (smallTargets > 0) {
        this.results.warnings.push(`${smallTargets} touch targets are smaller than recommended ${minTouchSize}px`);
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing touch targets: ${error.message}`
      };
    }
  }

  testMobileMenuFunctionality() {
    const testName = 'Mobile Menu Functionality';
    try {
      const navToggle = document.querySelector('.nav-toggle');
      const navMenu = document.querySelector('.nav-menu');
      
      if (window.innerWidth >= 768) {
        this.results.tests[testName] = {
          status: 'SKIP',
          message: 'Mobile menu test skipped (desktop viewport)'
        };
        return;
      }
      
      if (!navToggle || !navMenu) {
        this.results.tests[testName] = {
          status: 'FAIL',
          message: 'Mobile menu elements not found'
        };
        this.results.issues.push('Mobile menu elements missing');
        return;
      }
      
      // Test if menu can be toggled
      const initialMenuState = navMenu.classList.contains('active');
      
      // Simulate click
      navToggle.click();
      
      setTimeout(() => {
        const newMenuState = navMenu.classList.contains('active');
        const menuToggled = initialMenuState !== newMenuState;
        
        // Reset menu state
        if (newMenuState) navToggle.click();
        
        this.results.tests[testName] = {
          status: menuToggled ? 'PASS' : 'FAIL',
          message: menuToggled ? 'Mobile menu toggles correctly' : 'Mobile menu toggle not working'
        };
        
        if (!menuToggled) {
          this.results.issues.push('Mobile menu toggle functionality not working');
        }
      }, 100);
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing mobile menu: ${error.message}`
      };
    }
  }

  testFormUsability() {
    const testName = 'Form Usability';
    try {
      const formInputs = document.querySelectorAll('input, textarea, select');
      let usabilityIssues = 0;
      
      formInputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        const hasLabel = !!label;
        const hasPlaceholder = !!input.placeholder;
        const inputHeight = input.offsetHeight;
        
        if (!hasLabel && !hasPlaceholder) {
          usabilityIssues++;
        }
        
        if (inputHeight < 44 && window.innerWidth < 768) {
          usabilityIssues++;
        }
      });
      
      const status = usabilityIssues === 0 ? 'PASS' : usabilityIssues < 3 ? 'WARN' : 'FAIL';
      const message = usabilityIssues === 0 
        ? 'Form usability is good'
        : `${usabilityIssues} form usability issues detected`;
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          totalInputs: formInputs.length,
          usabilityIssues
        }
      };
      
      if (usabilityIssues > 0) {
        this.results.warnings.push(`Form has ${usabilityIssues} usability issues`);
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing form usability: ${error.message}`
      };
    }
  }

  testTypographyScaling() {
    const testName = 'Typography Scaling';
    try {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const bodyText = document.querySelectorAll('p, span, div');
      
      let typographyIssues = 0;
      
      headings.forEach(heading => {
        const fontSize = parseFloat(window.getComputedStyle(heading).fontSize);
        const minSize = window.innerWidth < 480 ? 18 : 20;
        
        if (fontSize < minSize) {
          typographyIssues++;
        }
      });
      
      const status = typographyIssues === 0 ? 'PASS' : typographyIssues < 3 ? 'WARN' : 'FAIL';
      const message = typographyIssues === 0 
        ? 'Typography scales appropriately'
        : `${typographyIssues} typography scaling issues detected`;
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          headingCount: headings.length,
          bodyTextCount: bodyText.length,
          typographyIssues
        }
      };
      
      if (typographyIssues > 0) {
        this.results.warnings.push(`Typography has ${typographyIssues} scaling issues`);
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing typography: ${error.message}`
      };
    }
  }

  testContentReadability() {
    const testName = 'Content Readability';
    try {
      const textElements = document.querySelectorAll('p, span, li');
      let readabilityIssues = 0;
      
      textElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const fontSize = parseFloat(style.fontSize);
        const lineHeight = parseFloat(style.lineHeight);
        const color = style.color;
        
        // Check minimum font size
        if (fontSize < 14) {
          readabilityIssues++;
        }
        
        // Check line height
        if (lineHeight < fontSize * 1.2) {
          readabilityIssues++;
        }
      });
      
      const status = readabilityIssues === 0 ? 'PASS' : readabilityIssues < 5 ? 'WARN' : 'FAIL';
      const message = readabilityIssues === 0 
        ? 'Content readability is good'
        : `${readabilityIssues} readability issues detected`;
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          textElementCount: textElements.length,
          readabilityIssues
        }
      };
      
      if (readabilityIssues > 0) {
        this.results.warnings.push(`Content has ${readabilityIssues} readability issues`);
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing readability: ${error.message}`
      };
    }
  }

  testAnimationPerformance() {
    const testName = 'Animation Performance';
    try {
      const animatedElements = document.querySelectorAll('[class*="animate"], .glitch-text, *[style*="animation"]');
      
      // Check if reduced motion is preferred
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      let status = 'PASS';
      let message = `Found ${animatedElements.length} animated elements`;
      
      if (prefersReducedMotion) {
        status = 'INFO';
        message += ' (reduced motion preferred by user)';
      }
      
      // Check for performance-heavy animations
      animatedElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const willChange = style.willChange;
        
        if (!willChange || willChange === 'auto') {
          status = 'WARN';
          message = 'Some animations may not be GPU accelerated';
          this.results.warnings.push('Consider adding will-change property to animated elements');
        }
      });
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          animatedElementCount: animatedElements.length,
          prefersReducedMotion
        }
      };
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing animations: ${error.message}`
      };
    }
  }

  testImageResponsiveness() {
    const testName = 'Image Responsiveness';
    try {
      const images = document.querySelectorAll('img');
      let imageIssues = 0;
      
      images.forEach(img => {
        const hasAlt = !!img.alt;
        const hasLazyLoading = img.loading === 'lazy' || img.hasAttribute('data-src');
        const isResponsive = img.style.maxWidth === '100%' || 
                           window.getComputedStyle(img).maxWidth === '100%';
        
        if (!hasAlt) imageIssues++;
        if (!isResponsive && img.offsetWidth > img.parentElement.offsetWidth) imageIssues++;
      });
      
      const status = imageIssues === 0 ? 'PASS' : imageIssues < 3 ? 'WARN' : 'FAIL';
      const message = imageIssues === 0 
        ? 'Images are properly responsive'
        : `${imageIssues} image responsiveness issues detected`;
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          imageCount: images.length,
          imageIssues
        }
      };
      
      if (imageIssues > 0) {
        this.results.warnings.push(`Images have ${imageIssues} responsiveness issues`);
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing images: ${error.message}`
      };
    }
  }

  testKeyboardNavigation() {
    const testName = 'Keyboard Navigation';
    try {
      const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      
      let keyboardIssues = 0;
      
      focusableElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const outline = style.outline;
        const outlineWidth = style.outlineWidth;
        
        // Check if element has visible focus indicator
        if (outline === 'none' && outlineWidth === '0px') {
          keyboardIssues++;
        }
      });
      
      const status = keyboardIssues === 0 ? 'PASS' : keyboardIssues < 5 ? 'WARN' : 'FAIL';
      const message = keyboardIssues === 0 
        ? 'Keyboard navigation properly supported'
        : `${keyboardIssues} keyboard navigation issues detected`;
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          focusableElementCount: focusableElements.length,
          keyboardIssues
        }
      };
      
      if (keyboardIssues > 0) {
        this.results.warnings.push(`Keyboard navigation has ${keyboardIssues} issues`);
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing keyboard navigation: ${error.message}`
      };
    }
  }

  testScreenReaderCompatibility() {
    const testName = 'Screen Reader Compatibility';
    try {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const images = document.querySelectorAll('img');
      const forms = document.querySelectorAll('form');
      const landmarks = document.querySelectorAll('main, nav, header, footer, section, article, aside');
      
      let accessibilityIssues = 0;
      
      // Check heading hierarchy
      let lastHeadingLevel = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastHeadingLevel + 1) {
          accessibilityIssues++;
        }
        lastHeadingLevel = level;
      });
      
      // Check images for alt text
      images.forEach(img => {
        if (!img.alt && !img.hasAttribute('aria-label')) {
          accessibilityIssues++;
        }
      });
      
      // Check form labels
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          const hasLabel = document.querySelector(`label[for="${input.id}"]`) || 
                          input.hasAttribute('aria-label') || 
                          input.hasAttribute('aria-labelledby');
          if (!hasLabel) {
            accessibilityIssues++;
          }
        });
      });
      
      const status = accessibilityIssues === 0 ? 'PASS' : accessibilityIssues < 5 ? 'WARN' : 'FAIL';
      const message = accessibilityIssues === 0 
        ? 'Screen reader compatibility is good'
        : `${accessibilityIssues} accessibility issues detected`;
      
      this.results.tests[testName] = {
        status,
        message,
        details: {
          headingCount: headings.length,
          imageCount: images.length,
          formCount: forms.length,
          landmarkCount: landmarks.length,
          accessibilityIssues
        }
      };
      
      if (accessibilityIssues > 0) {
        this.results.warnings.push(`Screen reader compatibility has ${accessibilityIssues} issues`);
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing screen reader compatibility: ${error.message}`
      };
    }
  }

  displayResults() {
    console.log('\n📱 RESPONSIVE DESIGN TEST RESULTS');
    console.log('==================================');
    console.log(`Device Category: ${this.results.deviceCategory}`);
    console.log(`Viewport: ${this.results.currentViewport.width}x${this.results.currentViewport.height}`);
    console.log(`Device Pixel Ratio: ${this.results.currentViewport.devicePixelRatio}`);
    console.log(`Timestamp: ${this.results.timestamp}\n`);
    
    // Display test results
    Object.entries(this.results.tests).forEach(([testName, result]) => {
      const icon = result.status === 'PASS' ? '✅' : 
                   result.status === 'WARN' ? '⚠️' : 
                   result.status === 'FAIL' ? '❌' : 
                   result.status === 'SKIP' ? '⏭️' : 
                   result.status === 'INFO' ? 'ℹ️' : '🔥';
      console.log(`${icon} ${testName}: ${result.message}`);
      
      if (result.details) {
        console.log(`   Details:`, result.details);
      }
    });
    
    // Display issues
    if (this.results.issues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      this.results.issues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    // Display warnings
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      this.results.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    // Calculate responsive score
    const totalTests = Object.keys(this.results.tests).length;
    const passedTests = Object.values(this.results.tests).filter(test => test.status === 'PASS').length;
    const responsiveScore = Math.round((passedTests / totalTests) * 100);
    
    console.log(`\n📊 RESPONSIVE DESIGN SCORE: ${responsiveScore}%`);
    
    // Device-specific recommendations
    this.displayDeviceRecommendations();
    
    return this.results;
  }

  displayDeviceRecommendations() {
    const category = this.results.deviceCategory;
    
    console.log(`\n💡 RECOMMENDATIONS FOR ${category.toUpperCase()}:`);
    
    switch (category) {
      case 'Small Mobile':
        console.log('   • Ensure text is at least 16px for readability');
        console.log('   • Use single-column layouts');
        console.log('   • Make touch targets at least 44px');
        console.log('   • Test with one-handed usage in mind');
        break;
        
      case 'Large Mobile':
        console.log('   • Consider 2-column layouts for some content');
        console.log('   • Optimize for thumb navigation');
        console.log('   • Test in both portrait and landscape');
        break;
        
      case 'Tablet':
        console.log('   • Utilize available screen space with multi-column layouts');
        console.log('   • Support both touch and mouse interactions');
        console.log('   • Test orientation changes');
        break;
        
      case 'Desktop':
      case 'Large Desktop':
        console.log('   • Implement hover states for better UX');
        console.log('   • Use keyboard shortcuts where appropriate');
        console.log('   • Ensure content doesn\'t become too wide');
        break;
    }
  }
}

// Auto-run the tests when script is loaded
if (typeof window !== 'undefined') {
  window.responsiveTester = new ResponsiveTester();
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponsiveTester;
}