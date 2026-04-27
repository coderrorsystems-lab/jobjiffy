/**
 * Scroll Utilities
 * Production-ready scroll management helper functions
 */

/**
 * Disable scroll restoration to prevent browser from restoring scroll position
 * on back button press. Useful for SPA where ScrollToTop handles routing.
 */
export function disableScrollRestoration() {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
}

/**
 * Scroll window to top with optional smooth behavior
 */
export function scrollToTop(smooth = false) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

/**
 * Scroll element to top
 */
export function scrollElementToTop(element, smooth = false) {
  if (!element) return;
  
  element.scrollTo({
    top: 0,
    left: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

/**
 * Scroll to specific element by ID
 */
export function scrollToElement(elementId, smooth = true, offset = 0) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID "${elementId}" not found`);
    return;
  }

  const offsetTop = element.offsetTop - offset;
  window.scrollTo({
    top: offsetTop,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

/**
 * Lock scroll on body (useful for modals/overlays)
 * Returns unlock function
 */
export function lockScroll() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const scrollTop = window.scrollY;

  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;

  return function unlock() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };
}

/**
 * Check if element is in viewport
 */
export function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get scroll position (window)
 */
export function getScrollPosition() {
  return {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset,
  };
}

/**
 * Save scroll position (useful for back navigation)
 */
const scrollPositionMap = new Map();

export function saveScrollPosition(key) {
  const position = getScrollPosition();
  scrollPositionMap.set(key, position);
}

export function restoreScrollPosition(key, smooth = false) {
  const position = scrollPositionMap.get(key);
  if (position) {
    window.scrollTo({
      top: position.y,
      left: position.x,
      behavior: smooth ? 'smooth' : 'auto',
    });
    scrollPositionMap.delete(key);
  }
}

/**
 * Smooth scroll to bottom of scrollable container
 */
export function scrollToBottom(element, smooth = true) {
  if (!element) return;
  
  element.scrollTo({
    top: element.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

/**
 * Prevent scroll on specific elements
 */
export function preventScroll(event) {
  event.preventDefault();
}

/**
 * Get scroll direction (up or down)
 */
let lastScrollTop = 0;
export function getScrollDirection() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const direction = scrollTop > lastScrollTop ? 'down' : 'up';
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  return direction;
}

/**
 * Fix common scroll issues with nested containers
 * Call this after modals/drawers open
 */
export function fixNestedScroll(containerElement) {
  if (!containerElement) return;

  // Ensure container is scrollable
  const styles = window.getComputedStyle(containerElement);
  const overflowY = styles.overflowY;
  
  if (overflowY !== 'auto' && overflowY !== 'scroll') {
    containerElement.style.overflowY = 'auto';
  }

  // Ensure scrollable content
  const hasContent = containerElement.scrollHeight > containerElement.clientHeight;
  if (!hasContent && containerElement.children.length > 0) {
    containerElement.style.overflowY = 'auto';
  }

  // Reset scroll to top
  containerElement.scrollTop = 0;
}

/**
 * Reset scroll for all elements in container
 */
export function resetContainerScroll(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Reset main container
  container.scrollTop = 0;

  // Reset all scrollable children
  const scrollableChildren = container.querySelectorAll('[class*="overflow-y"]');
  scrollableChildren.forEach((child) => {
    child.scrollTop = 0;
  });
}
