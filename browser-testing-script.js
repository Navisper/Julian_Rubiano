// Browser Testing Script for Cyberpunk Portfolio
// Run this script in browser console to test functionality

class BrowserTester {
  constructor() {
    this.results = {
      browser: this.detectBrowser(),
      tests: {},
      issues: [],
      warnings: []
    };
    
    console.log(`🚀 Starting browser compatibility tests for ${this.results.browser}`);
    this.runAllTests();
  }

  detectBrowser() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
      return 'Chrome';
    } else if (userAgent.includes('Firefox')) {
      return 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      return 'Safari';
    } else if (userAgent.includes('Edge')) {
      return 'Edge';
    } else {
      return 'Unknown';
    }
  }

  runAllTests() {
    console.log('📋 Running compatibility tests...\n');
    
    // CSS Feature Tests
    this.testCSSCustomProperties();
    this.testCSSGrid();
    this.testCSSFlexbox();
    this.testCSSBackgroundClip();
    this.testCSSAnimations();
    this.testSmoothScrolling();
    
    // JavaScript Feature Tests
    this.testES6Features();
    this.testIntersectionObserver();
    this.testFormValidation();
    
    // Functionality Tests
    this.testNavigation();
    this.testResponsiveDesign();
    this.testAnimations();
    
    // Performance Tests
    this.testLoadingPerformance();
    
    this.displayResults();
  }

  testCSSCustomProperties() {
    const testName = 'CSS Custom Properties';
    try {
      const supported = CSS.supports('color', 'var(--test-color)');
      this.results.tests[testName] = {
        status: supported ? 'PASS' : 'FAIL',
        message: supported ? 'CSS custom properties supported' : 'CSS custom properties not supported'
      };
      
      if (!supported) {
        this.results.issues.push('CSS custom properties not supported - colors may not display correctly');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing CSS custom properties: ${error.message}`
      };
    }
  }

  testCSSGrid() {
    const testName = 'CSS Grid Layout';
    try {
      const supported = CSS.supports('display', 'grid');
      this.results.tests[testName] = {
        status: supported ? 'PASS' : 'FAIL',
        message: supported ? 'CSS Grid supported' : 'CSS Grid not supported'
      };
      
      if (!supported) {
        this.results.issues.push('CSS Grid not supported - layout may be broken');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing CSS Grid: ${error.message}`
      };
    }
  }

  testCSSFlexbox() {
    const testName = 'CSS Flexbox';
    try {
      const supported = CSS.supports('display', 'flex');
      this.results.tests[testName] = {
        status: supported ? 'PASS' : 'FAIL',
        message: supported ? 'CSS Flexbox supported' : 'CSS Flexbox not supported'
      };
      
      if (!supported) {
        this.results.issues.push('CSS Flexbox not supported - layout may be broken');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing CSS Flexbox: ${error.message}`
      };
    }
  }

  testCSSBackgroundClip() {
    const testName = 'CSS Background Clip Text';
    try {
      const supported = CSS.supports('-webkit-background-clip', 'text') || CSS.supports('background-clip', 'text');
      this.results.tests[testName] = {
        status: supported ? 'PASS' : 'WARN',
        message: supported ? 'Background-clip text supported' : 'Background-clip text not supported - using fallback'
      };
      
      if (!supported) {
        this.results.warnings.push('Background-clip text not supported - gradient text will show as solid color');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing background-clip: ${error.message}`
      };
    }
  }

  testCSSAnimations() {
    const testName = 'CSS Animations';
    try {
      const supported = CSS.supports('animation', 'test 1s ease');
      this.results.tests[testName] = {
        status: supported ? 'PASS' : 'FAIL',
        message: supported ? 'CSS animations supported' : 'CSS animations not supported'
      };
      
      if (!supported) {
        this.results.issues.push('CSS animations not supported - visual effects may not work');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing CSS animations: ${error.message}`
      };
    }
  }

  testSmoothScrolling() {
    const testName = 'Smooth Scrolling';
    try {
      const cssSupported = CSS.supports('scroll-behavior', 'smooth');
      const jsImplemented = typeof SmoothScroll !== 'undefined';
      
      const status = cssSupported || jsImplemented ? 'PASS' : 'FAIL';
      const method = cssSupported ? 'CSS' : jsImplemented ? 'JavaScript fallback' : 'Not available';
      
      this.results.tests[testName] = {
        status: status,
        message: `Smooth scrolling: ${method}`
      };
      
      if (!cssSupported && !jsImplemented) {
        this.results.issues.push('Smooth scrolling not available - navigation will use instant scrolling');
      } else if (!cssSupported && jsImplemented) {
        this.results.warnings.push('Using JavaScript fallback for smooth scrolling');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing smooth scrolling: ${error.message}`
      };
    }
  }

  testES6Features() {
    const testName = 'ES6+ JavaScript Features';
    try {
      // Test arrow functions, classes, const/let
      const arrowFunctions = (() => true)();
      const classes = typeof class {} === 'function';
      const constLet = (() => { const test = true; let test2 = true; return test && test2; })();
      
      const supported = arrowFunctions && classes && constLet;
      
      this.results.tests[testName] = {
        status: supported ? 'PASS' : 'FAIL',
        message: supported ? 'ES6+ features supported' : 'ES6+ features not fully supported'
      };
      
      if (!supported) {
        this.results.issues.push('ES6+ features not supported - JavaScript functionality may be limited');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing ES6 features: ${error.message}`
      };
    }
  }

  testIntersectionObserver() {
    const testName = 'Intersection Observer API';
    try {
      const supported = 'IntersectionObserver' in window;
      this.results.tests[testName] = {
        status: supported ? 'PASS' : 'WARN',
        message: supported ? 'Intersection Observer supported' : 'Using scroll event fallback'
      };
      
      if (!supported) {
        this.results.warnings.push('Intersection Observer not supported - using scroll event fallback for animations');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing Intersection Observer: ${error.message}`
      };
    }
  }

  testFormValidation() {
    const testName = 'HTML5 Form Validation';
    try {
      const input = document.createElement('input');
      input.type = 'email';
      input.required = true;
      
      const supported = typeof input.checkValidity === 'function';
      
      this.results.tests[testName] = {
        status: supported ? 'PASS' : 'FAIL',
        message: supported ? 'HTML5 form validation supported' : 'HTML5 form validation not supported'
      };
      
      if (!supported) {
        this.results.issues.push('HTML5 form validation not supported - custom validation required');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing form validation: ${error.message}`
      };
    }
  }

  testNavigation() {
    const testName = 'Navigation Functionality';
    try {
      const navToggle = document.querySelector('.nav-toggle');
      const navMenu = document.querySelector('.nav-menu');
      const navLinks = document.querySelectorAll('.nav-menu a');
      
      const elementsExist = navToggle && navMenu && navLinks.length > 0;
      
      this.results.tests[testName] = {
        status: elementsExist ? 'PASS' : 'FAIL',
        message: elementsExist ? 'Navigation elements found' : 'Navigation elements missing'
      };
      
      if (!elementsExist) {
        this.results.issues.push('Navigation elements not found - menu functionality may not work');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing navigation: ${error.message}`
      };
    }
  }

  testResponsiveDesign() {
    const testName = 'Responsive Design';
    try {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const mediaQueries = this.checkMediaQueries();
      
      const responsive = viewportMeta && mediaQueries;
      
      this.results.tests[testName] = {
        status: responsive ? 'PASS' : 'WARN',
        message: responsive ? 'Responsive design implemented' : 'Responsive design may have issues'
      };
      
      if (!responsive) {
        this.results.warnings.push('Responsive design implementation may have issues');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing responsive design: ${error.message}`
      };
    }
  }

  checkMediaQueries() {
    const breakpoints = [
      '(min-width: 480px)',
      '(min-width: 768px)',
      '(min-width: 1024px)',
      '(min-width: 1440px)'
    ];
    
    return breakpoints.every(bp => window.matchMedia(bp));
  }

  testAnimations() {
    const testName = 'Animation Elements';
    try {
      const animatedElements = document.querySelectorAll('[class*="animate"], .glitch-text, .skill-item, .project-card');
      
      this.results.tests[testName] = {
        status: animatedElements.length > 0 ? 'PASS' : 'WARN',
        message: `Found ${animatedElements.length} animated elements`
      };
      
      if (animatedElements.length === 0) {
        this.results.warnings.push('No animated elements found - animations may not be working');
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing animations: ${error.message}`
      };
    }
  }

  testLoadingPerformance() {
    const testName = 'Loading Performance';
    try {
      if ('performance' in window && 'timing' in performance) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        let status = 'PASS';
        let message = `Page loaded in ${loadTime}ms`;
        
        if (loadTime > 3000) {
          status = 'WARN';
          message += ' (slow loading)';
          this.results.warnings.push('Page loading time is over 3 seconds');
        } else if (loadTime > 5000) {
          status = 'FAIL';
          message += ' (very slow loading)';
          this.results.issues.push('Page loading time is over 5 seconds');
        }
        
        this.results.tests[testName] = { status, message };
      } else {
        this.results.tests[testName] = {
          status: 'WARN',
          message: 'Performance API not available'
        };
      }
    } catch (error) {
      this.results.tests[testName] = {
        status: 'ERROR',
        message: `Error testing performance: ${error.message}`
      };
    }
  }

  displayResults() {
    console.log('\n📊 BROWSER COMPATIBILITY TEST RESULTS');
    console.log('=====================================');
    console.log(`Browser: ${this.results.browser}`);
    console.log(`Timestamp: ${new Date().toISOString()}\n`);
    
    // Display test results
    Object.entries(this.results.tests).forEach(([testName, result]) => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : result.status === 'FAIL' ? '❌' : '🔥';
      console.log(`${icon} ${testName}: ${result.message}`);
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
    
    // Overall compatibility score
    const totalTests = Object.keys(this.results.tests).length;
    const passedTests = Object.values(this.results.tests).filter(test => test.status === 'PASS').length;
    const compatibilityScore = Math.round((passedTests / totalTests) * 100);
    
    console.log(`\n🎯 COMPATIBILITY SCORE: ${compatibilityScore}%`);
    
    if (compatibilityScore >= 90) {
      console.log('🎉 Excellent compatibility!');
    } else if (compatibilityScore >= 75) {
      console.log('👍 Good compatibility with minor issues');
    } else if (compatibilityScore >= 60) {
      console.log('⚠️ Fair compatibility - some features may not work');
    } else {
      console.log('❌ Poor compatibility - significant issues detected');
    }
    
    return this.results;
  }
}

// Auto-run the tests when script is loaded
if (typeof window !== 'undefined') {
  window.browserTester = new BrowserTester();
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BrowserTester;
}