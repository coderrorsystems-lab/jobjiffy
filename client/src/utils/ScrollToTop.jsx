import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Automatically scrolls to top when route changes
 * Place this component inside <BrowserRouter> but outside <Routes>
 * 
 * Usage:
 * <BrowserRouter>
 *   <ScrollToTop />
 *   <Routes>...</Routes>
 * </BrowserRouter>
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to top
    window.scrollTo(0, 0);

    // Also scroll main content if it has overflow-y
    const mainContent = document.querySelector('[data-scrollable="main"]') || 
                        document.querySelector('main') ||
                        document.querySelector('.main-content');
    
    if (mainContent) {
      mainContent.scrollTop = 0;
    }

    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, [pathname]);

  return null;
}
