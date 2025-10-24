// Enhanced Lazy Loading and Asset Optimization System

class LazyLoadingManager {
  constructor() {
    this.imageObserver = null;
    this.loadedImages = new Set();
    this.imageQueue = [];
    this.isSupported = 'IntersectionObserver' in window;
    
    this.init();
  }

  init() {
    if (this.isSupported) {
      this.createImageObserver();
      this.observeImages();
      this.preloadCriticalImages();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }

  createImageObserver() {
    const options = {
      root: null,
      rootMargin: '50px 0px', // Start loading 50px before image enters viewport
      threshold: 0.01
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeImages() {
    // Find all images with data-src attribute (lazy loading)
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      this.imageObserver.observe(img);
    });

    // Also observe images with loading="lazy" for enhanced control
    const lazyLoadingImages = document.querySelectorAll('img[loading="lazy"]');
    lazyLoadingImages.forEach(img => {
      if (!img.complete) {
        this.imageObserver.observe(img);
      }
    });
  }

  loadImage(img) {
    return new Promise((resolve, reject) => {
      const imageUrl = img.dataset.src || img.src;
      
      if (this.loadedImages.has(imageUrl)) {
        resolve(img);
        return;
      }

      // Create a new image element for preloading
      const imageLoader = new Image();
      
      imageLoader.onload = () => {
        // Apply loaded image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        // Add loaded class for animations
        img.classList.add('lazy-loaded');
        
        // Mark as loaded
        this.loadedImages.add(imageUrl);
        
        // Trigger custom event
        img.dispatchEvent(new CustomEvent('imageLoaded', {
          detail: { url: imageUrl }
        }));
        
        resolve(img);
      };
      
      imageLoader.onerror = () => {
        // Handle error - show placeholder or fallback
        this.handleImageError(img);
        reject(new Error(`Failed to load image: ${imageUrl}`));
      };
      
      // Start loading
      imageLoader.src = imageUrl;
    });
  }

  handleImageError(img) {
    // Add error class for styling
    img.classList.add('lazy-error');
    
    // Set fallback image or placeholder
    const fallbackSrc = img.dataset.fallback || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
    
    if (img.dataset.src) {
      img.src = fallbackSrc;
      img.removeAttribute('data-src');
    }
  }

  preloadCriticalImages() {
    // Preload hero section images and above-the-fold content
    const criticalImages = document.querySelectorAll('.hero-section img, .about-section img');
    
    criticalImages.forEach(img => {
      if (img.dataset.src || !img.complete) {
        this.loadImage(img);
      }
    });
  }

  loadAllImages() {
    // Fallback for browsers without IntersectionObserver
    const allLazyImages = document.querySelectorAll('img[data-src]');
    
    allLazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  }

  // Method to manually trigger loading of specific images
  loadImagesBySelector(selector) {
    const images = document.querySelectorAll(selector);
    const promises = Array.from(images).map(img => this.loadImage(img));
    return Promise.all(promises);
  }

  // Method to preload images for better UX
  preloadImages(urls) {
    return Promise.all(
      urls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            this.loadedImages.add(url);
            resolve(url);
          };
          img.onerror = () => reject(new Error(`Failed to preload: ${url}`));
          img.src = url;
        });
      })
    );
  }

  // Get loading statistics
  getStats() {
    const totalImages = document.querySelectorAll('img').length;
    const loadedCount = this.loadedImages.size;
    
    return {
      total: totalImages,
      loaded: loadedCount,
      percentage: totalImages > 0 ? Math.round((loadedCount / totalImages) * 100) : 0
    };
  }
}

// WebP Support Detection and Image Format Optimization
class ImageOptimizer {
  constructor() {
    this.supportsWebP = false;
    this.supportsAvif = false;
    this.init();
  }

  async init() {
    await this.detectFormatSupport();
    this.optimizeImageSources();
  }

  async detectFormatSupport() {
    // Test WebP support
    this.supportsWebP = await this.testImageFormat('data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA');
    
    // Test AVIF support
    this.supportsAvif = await this.testImageFormat('data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=');
  }

  testImageFormat(dataUri) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = dataUri;
    });
  }

  optimizeImageSources() {
    const images = document.querySelectorAll('img[data-src], img[src]');
    
    images.forEach(img => {
      const originalSrc = img.dataset.src || img.src;
      const optimizedSrc = this.getOptimizedImageUrl(originalSrc);
      
      if (img.dataset.src) {
        img.dataset.src = optimizedSrc;
      } else {
        img.src = optimizedSrc;
      }
    });
  }

  getOptimizedImageUrl(originalUrl) {
    // If it's already an optimized format or external URL, return as is
    if (!originalUrl || originalUrl.startsWith('http') || originalUrl.startsWith('data:')) {
      return originalUrl;
    }

    const urlParts = originalUrl.split('.');
    const extension = urlParts.pop();
    const basePath = urlParts.join('.');

    // Return the best supported format
    if (this.supportsAvif) {
      return `${basePath}.avif`;
    } else if (this.supportsWebP) {
      return `${basePath}.webp`;
    }
    
    return originalUrl; // Fallback to original
  }

  // Generate responsive image srcset
  generateSrcSet(basePath, sizes = [320, 640, 1024, 1440]) {
    const extension = this.supportsWebP ? 'webp' : 'jpg';
    
    return sizes.map(size => `${basePath}-${size}w.${extension} ${size}w`).join(', ');
  }
}

// Performance Monitoring for Images
class ImagePerformanceMonitor {
  constructor() {
    this.metrics = {
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0,
      averageLoadTime: 0,
      loadTimes: []
    };
    
    this.init();
  }

  init() {
    this.observeImageLoading();
    this.setupPerformanceObserver();
  }

  observeImageLoading() {
    // Monitor all images on the page
    const images = document.querySelectorAll('img');
    this.metrics.totalImages = images.length;

    images.forEach(img => {
      const startTime = performance.now();
      
      img.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        this.recordImageLoad(loadTime);
      });
      
      img.addEventListener('error', () => {
        this.recordImageError();
      });
    });
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.initiatorType === 'img') {
            this.recordImageLoad(entry.duration);
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  recordImageLoad(loadTime) {
    this.metrics.loadedImages++;
    this.metrics.loadTimes.push(loadTime);
    this.updateAverageLoadTime();
  }

  recordImageError() {
    this.metrics.failedImages++;
  }

  updateAverageLoadTime() {
    if (this.metrics.loadTimes.length > 0) {
      const sum = this.metrics.loadTimes.reduce((a, b) => a + b, 0);
      this.metrics.averageLoadTime = sum / this.metrics.loadTimes.length;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalImages > 0 
        ? ((this.metrics.loadedImages / this.metrics.totalImages) * 100).toFixed(2)
        : 0
    };
  }

  logPerformanceReport() {
    const metrics = this.getMetrics();
    console.group('🖼️ Image Performance Report');
    console.log(`Total Images: ${metrics.totalImages}`);
    console.log(`Loaded: ${metrics.loadedImages}`);
    console.log(`Failed: ${metrics.failedImages}`);
    console.log(`Success Rate: ${metrics.successRate}%`);
    console.log(`Average Load Time: ${metrics.averageLoadTime.toFixed(2)}ms`);
    console.groupEnd();
  }
}

// Initialize lazy loading system
document.addEventListener('DOMContentLoaded', () => {
  window.lazyLoadingManager = new LazyLoadingManager();
  window.imageOptimizer = new ImageOptimizer();
  window.imagePerformanceMonitor = new ImagePerformanceMonitor();
  
  // Log performance report after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.imagePerformanceMonitor.logPerformanceReport();
    }, 2000);
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LazyLoadingManager,
    ImageOptimizer,
    ImagePerformanceMonitor
  };
}