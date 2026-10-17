import '@testing-library/jest-dom';

// Global mocks for browser environment (Leaflet, ResizeObserver, etc.)
if (typeof window !== 'undefined') {
  // Mock ResizeObserver
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = window.ResizeObserver || ResizeObserver;

  // Mock matchMedia
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {}
    };
  };

  // Mock window.scrollTo
  window.scrollTo = typeof vi !== 'undefined' ? vi.fn() : () => {};

  // Leaflet container element mocks
  if (window.HTMLDivElement) {
    if (!window.HTMLDivElement.prototype.getBoundingClientRect) {
      window.HTMLDivElement.prototype.getBoundingClientRect = () => ({
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        bottom: 600,
        right: 800
      });
    }
  }
}
