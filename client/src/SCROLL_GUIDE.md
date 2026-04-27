# Scroll Management System - Complete Guide

## Overview
Production-ready scroll management system for React + React Router + Tailwind CSS MERN applications.

**Features:**
- ✅ Global auto-scroll on route changes
- ✅ Modal/drawer scroll reset
- ✅ Prevent body scroll with modals
- ✅ Smooth scroll animations
- ✅ Nested overflow container fixes
- ✅ Mobile-friendly
- ✅ No jumpy behavior
- ✅ TypeScript-ready (JS implementation provided)

---

## Components & Hooks

### 1. ScrollToTop Component
**File:** `src/utils/ScrollToTop.jsx`

Automatically scrolls window to top when route changes.

**Already integrated in** `App.jsx` ✅

```jsx
// App.jsx - automatically included
import ScrollToTop from "./utils/ScrollToTop";

<Router>
  <ScrollToTop /> {/* Place inside Router */}
  <Routes>...</Routes>
</Router>
```

**What it does:**
- Scrolls window to (0, 0) on every route change
- Scrolls main content container if found
- Disables browser scroll restoration
- Works with nested scrollable containers

---

### 2. useResetScroll Hook
**File:** `src/hooks/useScroll.js`

Resets scroll on any scrollable element (modal, drawer, container).

**Usage:**

#### Option A: Attach to modal element
```jsx
import { useResetScroll } from '@/hooks';

export function MyModal() {
  const modalRef = useResetScroll();
  
  return (
    <div ref={modalRef} className="overflow-y-auto h-screen">
      Modal content...
    </div>
  );
}
```

#### Option B: Use with your own ref
```jsx
import { useResetScroll } from '@/hooks';
import { useRef } from 'react';

export function MyDrawer() {
  const drawerRef = useRef(null);
  useResetScroll(drawerRef);
  
  return (
    <div ref={drawerRef} className="overflow-y-auto">
      Drawer content...
    </div>
  );
}
```

#### Option C: Trigger on dependency change
```jsx
const { isOpen } = props;
useResetScroll(null, true, [isOpen]); // Reset when isOpen changes
```

---

### 3. useWindowScroll Hook
**File:** `src/hooks/useScroll.js`

Scroll window to top on mount or on condition change.

```jsx
import { useWindowScroll } from '@/hooks';
import { useEffect } from 'react';

export function ProfilePage() {
  // Scroll to top on mount
  useWindowScroll(true);
  
  return <div>Profile content...</div>;
}

// OR with condition
export function UserDashboard({ userId }) {
  // Scroll when userId changes
  useWindowScroll(true, [userId]);
  
  return <div>Dashboard content...</div>;
}
```

---

### 4. useModalScroll Hook
**File:** `src/hooks/useScroll.js`

Prevents body scroll when modal is open, restores on close.

```jsx
import { useModalScroll } from '@/hooks';
import { useState } from 'react';

export function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Manages body scroll lock/unlock
  useModalScroll(isOpen);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg overflow-y-auto max-h-96">
            Modal content...
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
```

---

### 5. useSmoothScroll Hook
**File:** `src/hooks/useScroll.js`

Smooth scroll to elements or specific locations.

```jsx
import { useSmoothScroll } from '@/hooks';

export function PageWithAnchors() {
  const scroll = useSmoothScroll();
  
  return (
    <>
      <button onClick={() => scroll.scrollToId('features')}>
        Jump to Features
      </button>
      
      <button onClick={() => scroll.scrollToTop()}>
        Back to Top
      </button>
      
      <section id="features">Features section...</section>
    </>
  );
}
```

---

### 6. usePreventAutoFocus Hook
**File:** `src/hooks/useScroll.js`

Prevents auto-focused inputs from causing unwanted scroll.

```jsx
import { usePreventAutoFocus } from '@/hooks';

export function FormPage() {
  // Automatically prevents autoFocus from causing scroll
  usePreventAutoFocus();
  
  return (
    <form>
      <input autoFocus type="text" /> {/* Won't scroll */}
      {/* form fields... */}
    </form>
  );
}
```

---

## Scroll Utilities
**File:** `src/utils/scrollUtils.js`

Reusable functions for scroll management.

### Common Functions

```jsx
import {
  scrollToTop,          // Scroll window to top
  scrollElementToTop,   // Scroll element to top
  scrollToElement,      // Scroll to element by ID
  lockScroll,          // Lock body scroll (returns unlock function)
  isElementInViewport, // Check if element is visible
  getScrollPosition,   // Get current scroll X, Y
  saveScrollPosition,  // Save position for later
  restoreScrollPosition, // Restore saved position
  scrollToBottom,      // Scroll to bottom of container
  preventScroll,       // Event handler to prevent scroll
  getScrollDirection,  // Get scroll direction (up/down)
  fixNestedScroll,     // Fix overflow-y issues
  resetContainerScroll, // Reset all scrolls in container
} from '@/utils/scrollUtils';
```

### Usage Examples

```jsx
// Scroll window to top
scrollToTop();

// Smooth scroll to element
scrollToElement('my-section', true, 80); // offset 80px

// Lock scroll on modal open
const unlock = lockScroll();
// ... modal is open ...
unlock(); // Restore scroll on close

// Check if element is visible
if (isElementInViewport(element)) {
  console.log('Element is visible');
}

// Save position before navigation
saveScrollPosition('product-list');
// ... navigate away ...
// Then restore
restoreScrollPosition('product-list');

// Get current scroll position
const { x, y } = getScrollPosition();

// Detect scroll direction
window.addEventListener('scroll', () => {
  const direction = getScrollDirection();
  console.log('Scrolling:', direction); // 'up' or 'down'
});

// Fix nested scroll issues
fixNestedScroll(modalElement);
```

---

## Applying to Your Components

### Modal/Dialog Example
```jsx
// Before: Scrolls from middle
// <div className="modal">Content...</div>

// After: Scrolls from top
import { useResetScroll, useModalScroll } from '@/hooks';

export function Modal({ isOpen, onClose }) {
  const modalRef = useResetScroll();
  useModalScroll(isOpen);
  
  return (
    <div ref={modalRef} className="overflow-y-auto max-h-screen">
      {/* content */}
    </div>
  );
}
```

### Drawer/Sidebar Example
```jsx
import { useResetScroll, useModalScroll } from '@/hooks';

export function MobileMenu({ isOpen, onClose }) {
  const drawerRef = useResetScroll();
  useModalScroll(isOpen);
  
  return (
    <div
      ref={drawerRef}
      className={`fixed top-0 left-0 h-screen w-64 overflow-y-auto
        transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* menu items */}
    </div>
  );
}
```

### Page Component Example
```jsx
import { useWindowScroll } from '@/hooks';

export function ProductPage({ productId }) {
  // Reset scroll when product changes
  useWindowScroll(true, [productId]);
  
  return <div>Product details...</div>;
}
```

### Form Example
```jsx
import { usePreventAutoFocus } from '@/hooks';

export function CheckoutForm() {
  usePreventAutoFocus(); // Prevent auto-focus scroll
  
  return (
    <form>
      <input autoFocus placeholder="Card number" /> {/* Won't jump */}
      {/* more fields... */}
    </form>
  );
}
```

---

## Tailwind CSS Classes to Use

### Scrollable Containers
```html
<!-- Main scrollable container -->
<div class="overflow-y-auto h-screen">Content...</div>

<!-- Modal content -->
<div class="overflow-y-auto max-h-[calc(100vh-80px)]">Content...</div>

<!-- Small scrollable section -->
<div class="overflow-y-auto h-96">Content...</div>

<!-- Drawer/Sidebar -->
<div class="overflow-y-auto h-screen w-64">Content...</div>
```

### No-scroll (paired with hooks)
```html
<!-- Body lock happens via hook -->
<body class="overflow-hidden"> <!-- Set by useModalScroll -->
```

---

## Common Issues & Solutions

### Issue: Scroll still jumps on route change
**Solution:** Ensure ScrollToTop is inside `<Router>` but outside `<Routes>`
```jsx
<Router>
  <ScrollToTop /> ✅ Correct
  <Routes>...</Routes>
</Router>
```

### Issue: Modal content scrolls middle
**Solution:** Use `useResetScroll` hook on modal
```jsx
const modalRef = useResetScroll();
<div ref={modalRef} className="overflow-y-auto">...</div>
```

### Issue: Body scroll not locked with modal
**Solution:** Use `useModalScroll` hook
```jsx
useModalScroll(isOpen); // Automatically locks body
```

### Issue: Input auto-focus causes scroll
**Solution:** Use `usePreventAutoFocus` hook
```jsx
usePreventAutoFocus(); // Automatically prevents
```

### Issue: Scrollable container has overflow issues
**Solution:** Use utility function
```jsx
fixNestedScroll(containerElement);
```

---

## Testing Checklist

- [ ] Route changes scroll to top
- [ ] Modals open at top
- [ ] Drawers/sidebars open at top
- [ ] Body scroll locks with modal
- [ ] Manual scroll works normally
- [ ] Back button doesn't restore scroll position
- [ ] Mobile works smoothly
- [ ] No console errors
- [ ] No jumpy behavior
- [ ] AutoFocus inputs don't cause scroll

---

## Performance Notes

✅ **Optimized:**
- Uses native `scrollTop` and `window.scrollTo()`
- Minimal DOM queries
- Cleanup in useEffect returns
- No library dependencies

✅ **Best Practices:**
- ScrollToTop only runs on route change (pathname dependency)
- useResetScroll uses timeouts to ensure DOM ready
- Modal scroll lock cleans up on unmount
- No memory leaks

---

## API Reference

### Components
- **ScrollToTop** - Auto-scroll on route changes

### Hooks
- **useResetScroll(ref?, resetOnMount?, dependencies?)** - Reset element scroll
- **useWindowScroll(shouldScroll?, dependencies?)** - Scroll window to top
- **useModalScroll(isOpen)** - Lock body scroll
- **useSmoothScroll()** - Object with scroll methods
- **usePreventAutoFocus()** - Prevent auto-focus scroll

### Utils
- **scrollToTop(smooth?)** - Scroll window to top
- **scrollElementToTop(element, smooth?)** - Scroll element to top
- **scrollToElement(id, smooth?, offset?)** - Scroll to element by ID
- **lockScroll()** - Returns unlock function
- **isElementInViewport(element)** - Check visibility
- **getScrollPosition()** - Get x, y position
- **saveScrollPosition(key)** - Save position
- **restoreScrollPosition(key, smooth?)** - Restore position
- **scrollToBottom(element, smooth?)** - Scroll to bottom
- **getScrollDirection()** - Get up/down direction
- **fixNestedScroll(element)** - Fix overflow issues
- **resetContainerScroll(selector)** - Reset all container scrolls

---

## Files Created

✅ `src/utils/ScrollToTop.jsx` - Global scroll component
✅ `src/hooks/useScroll.js` - All scroll hooks
✅ `src/utils/scrollUtils.js` - Utility functions
✅ `SCROLL_GUIDE.md` - This guide

**Integration Point:** `src/App.jsx` - Already using ScrollToTop

---

## Next Steps

1. ✅ Global ScrollToTop working (App.jsx)
2. 🔄 Apply `useResetScroll` to existing modals/drawers
3. 🔄 Apply `useModalScroll` to overlay components
4. 🔄 Apply `usePreventAutoFocus` to form pages
5. Test on all pages and mobile

**Recommended:** Use `useResetScroll` on any modal/drawer that opens, and `useModalScroll` when it has a backdrop/overlay.

---

Generated: $(date)
For: JobJiffy MERN App
