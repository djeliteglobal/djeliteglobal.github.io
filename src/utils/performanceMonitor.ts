interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
    this.trackPageLoad();
  }

  private initializeObservers() {
    // Track navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart);
            this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart);
            this.recordMetric('first_paint', navEntry.loadEventStart - navEntry.fetchStart);
          }
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    }

    // Track resource loading
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.duration > 1000) { // Track slow resources
              this.recordMetric('slow_resource', resourceEntry.duration, {
                name: resourceEntry.name,
                type: resourceEntry.initiatorType
              });
            }
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  private trackPageLoad() {
    // Track initial page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.recordMetric('total_load_time', navigation.loadEventEnd - navigation.fetchStart);
          this.recordMetric('dns_lookup', navigation.domainLookupEnd - navigation.domainLookupStart);
          this.recordMetric('tcp_connect', navigation.connectEnd - navigation.connectStart);
          this.recordMetric('server_response', navigation.responseEnd - navigation.requestStart);
        }
      }, 0);
    });
  }

  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log critical performance issues
    if (this.isCriticalMetric(name, value)) {
      console.warn(`🐌 PERFORMANCE WARNING: ${name} = ${value}ms`, metadata);
    }

    // Send to analytics (in production)
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric);
    }
  }

  private isCriticalMetric(name: string, value: number): boolean {
    const thresholds = {
      page_load_time: 3000,
      dom_content_loaded: 2000,
      slow_resource: 2000,
      api_response: 1000,
      swipe_animation: 100
    };

    return value > (thresholds[name as keyof typeof thresholds] || 5000);
  }

  private async sendToAnalytics(metric: PerformanceMetric) {
    try {
      // Send to your analytics service
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      // Silently fail - don't impact user experience
    }
  }

  // Track custom user interactions
  trackUserAction(action: string, duration?: number, metadata?: Record<string, any>) {
    this.recordMetric(`user_action_${action}`, duration || 0, metadata);
  }

  // Track API calls
  trackApiCall(endpoint: string, duration: number, success: boolean) {
    this.recordMetric('api_response', duration, {
      endpoint,
      success,
      status: success ? 'success' : 'error'
    });
  }

  // Get performance summary
  getPerformanceSummary() {
    const summary = {
      totalMetrics: this.metrics.length,
      averagePageLoad: 0,
      slowestResource: 0,
      apiCallsCount: 0,
      errorRate: 0
    };

    const pageLoadMetrics = this.metrics.filter(m => m.name === 'page_load_time');
    if (pageLoadMetrics.length > 0) {
      summary.averagePageLoad = pageLoadMetrics.reduce((sum, m) => sum + m.value, 0) / pageLoadMetrics.length;
    }

    const resourceMetrics = this.metrics.filter(m => m.name === 'slow_resource');
    if (resourceMetrics.length > 0) {
      summary.slowestResource = Math.max(...resourceMetrics.map(m => m.value));
    }

    const apiMetrics = this.metrics.filter(m => m.name === 'api_response');
    summary.apiCallsCount = apiMetrics.length;
    
    if (apiMetrics.length > 0) {
      const errorCount = apiMetrics.filter(m => !m.metadata?.success).length;
      summary.errorRate = (errorCount / apiMetrics.length) * 100;
    }

    return summary;
  }

  // Clean up observers
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Helper function to measure function execution time
export function measurePerformance<T>(
  name: string, 
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start;
      performanceMonitor.recordMetric(name, duration);
    });
  } else {
    const duration = performance.now() - start;
    performanceMonitor.recordMetric(name, duration);
    return result;
  }
}
