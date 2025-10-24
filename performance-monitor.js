// Performance Monitoring Script for Cyberpunk Portfolio
// This script monitors Core Web Vitals and other performance metrics

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.thresholds = {
      LCP: 2500, // 2.5s
      FID: 100,  // 100ms
      CLS: 0.1,  // 0.1
      FCP: 1800, // 1.8s
      TTFB: 600  // 600ms
    };
    
    this.init();
  }

  init() {
    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
    
    // Monitor resource loading
    this.observeResourceTiming();
    
    // Monitor long tasks
    this.observeLongTasks();
    
    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => this.reportMetrics(), 1000);
    });
  }

  observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.LCP = {
          value: lastEntry.startTime,
          rating: this.getRating(lastEntry.startTime, 'LCP'),
          element: lastEntry.element?.tagName || 'Unknown'
        };
        
        this.logMetric('LCP', this.metrics.LCP);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          const fidValue = entry.processingStart - entry.startTime;
          
          this.metrics.FID = {
            value: fidValue,
            rating: this.getRating(fidValue, 'FID'),
            eventType: entry.name
          };
          
          this.logMetric('FID', this.metrics.FID);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      let clsEntries = [];
      
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });
        
        this.metrics.CLS = {
          value: clsValue,
          rating: this.getRating(clsValue, 'CLS'),
          entries: clsEntries.length
        };
        
        this.logMetric('CLS', this.metrics.CLS);
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = {
              value: entry.startTime,
              rating: this.getRating(entry.startTime, 'FCP')
            };
            
            this.logMetric('FCP', this.metrics.FCP);
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  observeTTFB() {
    if ('performance' in window && 'timing' in performance) {
      const navigationTiming = performance.timing;
      const ttfb = navigationTiming.responseStart - navigationTiming.navigationStart;
      
      this.metrics.TTFB = {
        value: ttfb,
        rating: this.getRating(ttfb, 'TTFB')
      };
      
      this.logMetric('TTFB', this.metrics.TTFB);
    }
  }

  observeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach(entry => {
          if (entry.initiatorType === 'img' && entry.duration > 1000) {
            console.warn(`🐌 Slow image loading: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
          }
          
          if (entry.initiatorType === 'script' && entry.duration > 500) {
            console.warn(`🐌 Slow script loading: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
          }
          
          if (entry.initiatorType === 'css' && entry.duration > 300) {
            console.warn(`🐌 Slow CSS loading: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach(entry => {
          console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
          
          if (!this.metrics.longTasks) {
            this.metrics.longTasks = [];
          }
          
          this.metrics.longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime
          });
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  getRating(value, metric) {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 600, poor: 1500 }
    };
    
    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  logMetric(name, metric) {
    const icon = metric.rating === 'good' ? '✅' : 
                 metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    
    console.log(`${icon} ${name}: ${metric.value.toFixed(2)}${name === 'CLS' ? '' : 'ms'} (${metric.rating})`);
  }

  reportMetrics() {
    console.log('\n🚀 PERFORMANCE METRICS REPORT');
    console.log('==============================');
    
    // Core Web Vitals Summary
    console.log('\n📊 Core Web Vitals:');
    if (this.metrics.LCP) {
      console.log(`   LCP: ${this.metrics.LCP.value.toFixed(2)}ms (${this.metrics.LCP.rating})`);
    }
    if (this.metrics.FID) {
      console.log(`   FID: ${this.metrics.FID.value.toFixed(2)}ms (${this.metrics.FID.rating})`);
    }
    if (this.metrics.CLS) {
      console.log(`   CLS: ${this.metrics.CLS.value.toFixed(3)} (${this.metrics.CLS.rating})`);
    }
    
    // Other Metrics
    console.log('\n📈 Other Metrics:');
    if (this.metrics.FCP) {
      console.log(`   FCP: ${this.metrics.FCP.value.toFixed(2)}ms (${this.metrics.FCP.rating})`);
    }
    if (this.metrics.TTFB) {
      console.log(`   TTFB: ${this.metrics.TTFB.value.toFixed(2)}ms (${this.metrics.TTFB.rating})`);
    }
    
    // Performance Issues
    if (this.metrics.longTasks && this.metrics.longTasks.length > 0) {
      console.log(`\n⚠️ Long Tasks Detected: ${this.metrics.longTasks.length}`);
      this.metrics.longTasks.forEach((task, index) => {
        console.log(`   Task ${index + 1}: ${task.duration.toFixed(2)}ms`);
      });
    }
    
    // Overall Assessment
    this.assessOverallPerformance();
    
    // Recommendations
    this.provideRecommendations();
  }

  assessOverallPerformance() {
    const coreVitals = [this.metrics.LCP, this.metrics.FID, this.metrics.CLS].filter(Boolean);
    const goodVitals = coreVitals.filter(vital => vital.rating === 'good').length;
    const totalVitals = coreVitals.length;
    
    console.log('\n🎯 Overall Assessment:');
    
    if (goodVitals === totalVitals && totalVitals === 3) {
      console.log('   🎉 Excellent! All Core Web Vitals are in the "good" range.');
    } else if (goodVitals >= totalVitals * 0.75) {
      console.log('   👍 Good performance with room for improvement.');
    } else if (goodVitals >= totalVitals * 0.5) {
      console.log('   ⚠️ Fair performance - several metrics need attention.');
    } else {
      console.log('   ❌ Poor performance - significant optimization needed.');
    }
  }

  provideRecommendations() {
    console.log('\n💡 Performance Recommendations:');
    
    if (this.metrics.LCP && this.metrics.LCP.rating !== 'good') {
      console.log('   • Optimize Largest Contentful Paint:');
      console.log('     - Optimize images and use modern formats (WebP/AVIF)');
      console.log('     - Implement critical CSS inlining');
      console.log('     - Use CDN for faster resource delivery');
    }
    
    if (this.metrics.FID && this.metrics.FID.rating !== 'good') {
      console.log('   • Improve First Input Delay:');
      console.log('     - Reduce JavaScript execution time');
      console.log('     - Use code splitting and lazy loading');
      console.log('     - Defer non-critical JavaScript');
    }
    
    if (this.metrics.CLS && this.metrics.CLS.rating !== 'good') {
      console.log('   • Reduce Cumulative Layout Shift:');
      console.log('     - Set explicit dimensions for images and videos');
      console.log('     - Reserve space for dynamic content');
      console.log('     - Avoid inserting content above existing content');
    }
    
    if (this.metrics.FCP && this.metrics.FCP.rating !== 'good') {
      console.log('   • Improve First Contentful Paint:');
      console.log('     - Optimize critical rendering path');
      console.log('     - Minimize render-blocking resources');
      console.log('     - Use resource hints (preload, prefetch)');
    }
    
    if (this.metrics.longTasks && this.metrics.longTasks.length > 0) {
      console.log('   • Address Long Tasks:');
      console.log('     - Break up long-running JavaScript tasks');
      console.log('     - Use requestIdleCallback for non-critical work');
      console.log('     - Consider web workers for heavy computations');
    }
  }

  // Method to get current metrics for external use
  getMetrics() {
    return this.metrics;
  }

  // Method to export metrics for analytics
  exportMetrics() {
    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink
      } : null,
      metrics: this.metrics
    };
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  window.performanceMonitor = new PerformanceMonitor();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitor;
}