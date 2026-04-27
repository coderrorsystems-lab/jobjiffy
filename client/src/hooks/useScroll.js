import { useEffect, useRef } from 'react';

/**
 * useResetScroll Hook
 * Resets scroll position on element or window
 * 
 * Usage:
 * const modalRef = useResetScroll(); // Returns ref to attach to modal
 * <div ref={modalRef} className="overflow-y-auto h-screen">...</div>
 * 
 * OR with dependency array:
 * useResetScroll(null, true); // Scroll to top when component mounts
 * 
 * OR with custom ref:
 * const customRef = useRef(null);
 * useResetScroll(customRef);
 */
export function useResetScroll(ref = null, resetOnMount = false, dependencies = []) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = ref?.current || elementRef.current;

    if (element && element.scrollHeight > 0) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [ref, resetOnMount, ...dependencies]);

  return elementRef;
}

/**
 * useWindowScroll Hook
 * Scroll window to top immediately on mount and route changes
 */
export function useWindowScroll(shouldScroll = true, dependencies = []) {
  useEffect(() => {
    if (shouldScroll) {
      // Disable scroll restoration first
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      
      // Immediate scroll to top
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Also try with setTimeout to ensure it works
      const timeoutId = setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [shouldScroll, ...dependencies]);
}

/**
 * useModalScroll Hook
 * Prevents body scroll when modal is open
 * Resets scroll when modal closes
 */
export function useModalScroll(isOpen) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Store current scroll position
      const scrollTop = window.scrollY;
      
      return () => {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        // Don't restore scroll position - let ScrollToTop handle it
      };
    }
  }, [isOpen]);
}

/**
 * useSmoothScroll Hook
 * Smooth scroll to element by ID or ref
 */
export function useSmoothScroll() {
  return {
    scrollToId: (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    scrollToElement: (element) => {
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    scrollToTop: (element) => {
      const target = element || window;
      if (target === window) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        target.scrollTop = 0;
      }
    },
  };
}

/**
 * usePreventAutoFocus Hook
 * Prevents input autoFocus from causing unwanted scroll
 */
export function usePreventAutoFocus() {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.tagName === 'INPUT') {
            if (node.autoFocus) {
              // Store scroll position, remove autoFocus, restore scroll
              const scrollPos = window.scrollY;
              node.autoFocus = false;
              setTimeout(() => {
                window.scrollTo(0, scrollPos);
              }, 0);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);
}
