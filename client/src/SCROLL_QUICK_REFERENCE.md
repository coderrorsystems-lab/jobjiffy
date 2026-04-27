# Scroll Management - Quick Reference

## Import Statements

```jsx
// Hooks
import { 
  useResetScroll, 
  useWindowScroll, 
  useModalScroll, 
  useSmoothScroll,
  usePreventAutoFocus 
} from '@/hooks';

// Utilities
import {
  scrollToTop,
  scrollElementToTop,
  scrollToElement,
  lockScroll,
  isElementInViewport,
  getScrollPosition,
  saveScrollPosition,
  restoreScrollPosition,
  scrollToBottom,
  getScrollDirection,
  fixNestedScroll,
  resetContainerScroll,
} from '@/utils/scrollUtils';

// Component
import ScrollToTop from '@/utils/ScrollToTop';
import Modal from '@/components/shared/Modal';
```

---

## Common Patterns

### 1. Modal with Scroll Management
```jsx
import { useResetScroll, useModalScroll } from '@/hooks';

function MyModal({ isOpen, onClose }) {
  const modalRef = useResetScroll();
  useModalScroll(isOpen);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-white rounded-lg overflow-y-auto max-h-[90vh]">
        {/* content */}
      </div>
    </div>
  );
}
```

### 2. Scrollable Drawer
```jsx
import { useResetScroll, useModalScroll } from '@/hooks';

function Drawer({ isOpen, onClose }) {
  const drawerRef = useResetScroll();
  useModalScroll(isOpen);
  
  return (
    <div 
      ref={drawerRef}
      className={`fixed top-0 left-0 h-screen w-64 overflow-y-auto
        transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* content */}
    </div>
  );
}
```

### 3. Page with Auto Scroll
```jsx
import { useWindowScroll } from '@/hooks';

function ProductPage({ productId }) {
  // Scroll to top when productId changes
  useWindowScroll(true, [productId]);
  
  return <div>Product content...</div>;
}
```

### 4. Smooth Scroll to Section
```jsx
import { useSmoothScroll } from '@/hooks';

function PageWithAnchors() {
  const scroll = useSmoothScroll();
  
  return (
    <>
      <button onClick={() => scroll.scrollToId('features')}>
        Jump to Features
      </button>
      <section id="features">Features...</section>
    </>
  );
}
```

### 5. Prevent Form Auto-Focus Scroll
```jsx
import { usePreventAutoFocus } from '@/hooks';

function CheckoutForm() {
  usePreventAutoFocus(); // Automatic!
  
  return (
    <form>
      <input autoFocus placeholder="Card number" /> {/* Won't scroll */}
    </form>
  );
}
```

### 6. Utility: Check Element Visible
```jsx
import { isElementInViewport } from '@/utils/scrollUtils';

function AnimatedSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(() => {
      if (isElementInViewport(sectionRef.current)) {
        setIsVisible(true);
      }
    });
    
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  
  return <div ref={sectionRef}>Content...</div>;
}
```

---

## API Reference

### Hooks

#### useResetScroll
```jsx
const modalRef = useResetScroll();
// OR
useResetScroll(myRef); // Provide custom ref
// OR
useResetScroll(null, true, [isOpen]); // Trigger on dependency
```

#### useWindowScroll
```jsx
useWindowScroll(true); // Scroll on mount
// OR
useWindowScroll(true, [userId]); // Scroll when userId changes
```

#### useModalScroll
```jsx
useModalScroll(isOpen); // Auto lock/unlock body
```

#### useSmoothScroll
```jsx
const { scrollToId, scrollToElement, scrollToTop } = useSmoothScroll();
scrollToId('section1');
scrollToElement(element);
scrollToTop();
```

#### usePreventAutoFocus
```jsx
usePreventAutoFocus(); // Just call it, automatic!
```

---

### Utilities

#### scrollToTop
```jsx
scrollToTop(); // Auto scroll
scrollToTop(true); // Smooth scroll
```

#### scrollElementToTop
```jsx
scrollElementToTop(element); // Auto
scrollElementToTop(element, true); // Smooth
```

#### scrollToElement
```jsx
scrollToElement('my-section'); // Auto, no offset
scrollToElement('my-section', true, 80); // Smooth, 80px offset
```

#### lockScroll
```jsx
const unlock = lockScroll(); // Body scroll locked
// ... do something ...
unlock(); // Restore scroll
```

#### getScrollPosition
```jsx
const { x, y } = getScrollPosition();
```

#### saveScrollPosition
```jsx
saveScrollPosition('page-key');
// ... navigate away ...
restoreScrollPosition('page-key'); // Smooth restore
```

#### scrollToBottom
```jsx
scrollToBottom(chatElement); // Auto
scrollToBottom(chatElement, true); // Smooth
```

#### getScrollDirection
```jsx
window.addEventListener('scroll', () => {
  const direction = getScrollDirection(); // 'up' or 'down'
});
```

#### fixNestedScroll
```jsx
fixNestedScroll(containerElement); // Fixes overflow issues
```

#### resetContainerScroll
```jsx
resetContainerScroll('.modal-content'); // Reset all scrolls
```

---

## Tailwind Classes for Scrollable Containers

```html
<!-- Basic scrollable div -->
<div class="overflow-y-auto h-screen">Content...</div>

<!-- Modal with limited height -->
<div class="overflow-y-auto max-h-[calc(100vh-100px)]">Content...</div>

<!-- Drawer/sidebar -->
<div class="overflow-y-auto h-screen w-64">Content...</div>

<!-- Small scrollable section -->
<div class="overflow-y-auto h-96">Content...</div>

<!-- Horizontal scroll -->
<div class="overflow-x-auto">Content...</div>

<!-- No scroll (used with hooks) -->
<body class="overflow-hidden">Content...</body>
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Page scrolls to middle | Add `useWindowScroll(true)` to page |
| Modal scrolls to middle | Add `useResetScroll()` to modal |
| Body scrolls behind modal | Add `useModalScroll(isOpen)` |
| Input autofocus causes scroll | Add `usePreventAutoFocus()` |
| Container scroll issues | Call `fixNestedScroll(el)` |
| Need smooth scrolling | Use `useSmoothScroll()` hook |
| Want to save position | Use `saveScrollPosition()` |

---

## Testing

```jsx
// Test auto-scroll on route change
- Navigate between pages
- ✅ Each page should start at top

// Test modal scroll
- Open any modal
- ✅ Modal should open at top
- ✅ Body should not scroll

// Test drawer/menu
- Open mobile menu
- ✅ Menu should open at top
- ✅ Body should not scroll

// Test form focus
- Click input with autofocus
- ✅ Page should not jump
```

---

## Performance Tips

✅ **Good:**
- Use hooks at component top level
- Let useEffect handle cleanup
- Cache refs with useRef
- Use conditional rendering for modals

❌ **Avoid:**
- Calling scroll functions in loops
- Multiple simultaneous scrolls
- Excessive DOM queries
- Lock/unlock scroll repeatedly

---

## File Locations

| File | Purpose |
|------|---------|
| `src/utils/ScrollToTop.jsx` | Global route scroll |
| `src/hooks/useScroll.js` | All scroll hooks |
| `src/utils/scrollUtils.js` | Utility functions |
| `src/components/shared/Modal.jsx` | Modal template |
| `src/SCROLL_GUIDE.md` | Full documentation |
| `src/SCROLL_IMPLEMENTATION_COMPLETE.md` | Setup summary |

---

## Examples in Codebase

- **BookingDashboard:** `src/features/booking/pages/BookingDashboard.jsx`
- **Settings Modal:** `src/pages/Settings.jsx`
- **Navbar Menu:** `src/components/layout/Navbar.jsx`

---

## Need Help?

1. Check `SCROLL_GUIDE.md` for detailed docs
2. Look at examples in BookingDashboard/Settings/Navbar
3. Use code snippets above as templates
4. Refer to this quick reference for common patterns

---

**Last Updated:** April 27, 2026
**Status:** Production Ready ✅
