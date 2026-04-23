# Theme System Documentation

## Overview

The Jobjiffy project now includes a **production-ready centralized theme system** with support for Light and Dark modes, CSS variables, and Tailwind CSS integration.

All colors are managed from a **single source of truth**, making it easy to maintain consistent branding across the entire application and support future themes.

---

## File Structure

```
src/
├── theme/
│   ├── index.js              # Central export point for all theme utilities
│   ├── colors.js             # Color token definitions (light & dark modes)
│   ├── ThemeContext.jsx      # React Context for theme state management
│   └── useTheme.js           # Custom hook to access theme in components
├── components/
│   └── ThemeToggle.jsx       # UI button to switch between themes
├── App.jsx                   # Main app component (updated with theme support)
├── main.jsx                  # Entry point (wrapped with ThemeProvider)
└── index.css                 # Global styles with CSS variables
```

---

## Color Tokens

All colors are defined in `src/theme/colors.js` with two complete palettes: **Light Mode** and **Dark Mode**.

### Available Color Tokens

#### Background Colors
- `bg-primary` - Main page background
- `bg-secondary` - Secondary background sections
- `bg-tertiary` - Tertiary background subsections
- `bg-card` - Card/container background
- `bg-hover` - Hover state background
- `bg-active` - Active/selected state background

#### Text Colors
- `text-primary` - Main body text
- `text-secondary` - Secondary text
- `text-tertiary` - Tertiary text
- `text-muted` - Muted/disabled text
- `text-inverse` - Inverse text color

#### Border Colors
- `border-primary` - Main border color
- `border-secondary` - Secondary border
- `border-focus` - Focus/highlight border

#### Brand Colors
- `primary` / `primary-dark` / `primary-light` - Primary brand
- `secondary` / `secondary-dark` / `secondary-light` - Secondary brand

#### Semantic Colors
- `success` / `success-light` - Success states
- `warning` / `warning-light` - Warning states
- `error` / `error-light` - Error/danger states
- `info` / `info-light` - Info states

#### Accent & Neutral
- `accent` / `accent-light` - Accent colors
- `neutral-0` through `neutral-900` - Full grayscale

---

## Usage Guide

### 1. Using Theme Colors in Components

#### With Tailwind CSS Classes
```jsx
import React from 'react';

export default function Card() {
  return (
    <div className="bg-bg-card text-text-primary border border-border-primary p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Title</h2>
      <p className="text-text-secondary">Description text</p>
      <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded">
        Action
      </button>
    </div>
  );
}
```

#### With CSS Variables (for inline styles)
```jsx
export default function CustomComponent() {
  return (
    <div style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
      Custom styled content
    </div>
  );
}
```

### 2. Using the useTheme Hook

Access theme state and toggle functionality:

```jsx
import { useTheme } from '../theme';

export default function Header() {
  const { theme, isDark, isLight, toggleTheme } = useTheme();

  return (
    <header className="bg-bg-secondary">
      <div className="flex justify-between items-center">
        <h1>My App</h1>
        <p>Current theme: {theme}</p>
        <button onClick={toggleTheme}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
}
```

### 3. Adding Theme Toggle Component

```jsx
import { ThemeToggle } from './components/ThemeToggle';

export default function App() {
  return (
    <div>
      <header>
        <ThemeToggle />
      </header>
    </div>
  );
}
```

---

## How It Works

### Architecture Flow

1. **colors.js** → Defines all light & dark color tokens
2. **ThemeContext.jsx** → Provides theme state & functions globally
3. **useTheme Hook** → Exposes theme to any component
4. **index.css** → Applies CSS variables based on theme
5. **tailwind.config.cjs** → Maps color tokens for Tailwind classes

### Theme Switching Process

1. User clicks theme toggle
2. `toggleTheme()` updates React Context state
3. `ThemeProvider` updates:
   - `localStorage` (persists choice)
   - Document class: adds/removes `dark`
   - Document attribute: sets `data-theme`
4. CSS variables in `:root` (light) or `:root.dark` (dark) update
5. All colors transition smoothly (300ms)
6. Tailwind utility classes respond to CSS variable changes

---

## Key Features

✅ **Centralized Colors** - Single source of truth (colors.js)  
✅ **Light & Dark Modes** - Full support with smooth transitions  
✅ **CSS Variables** - Dynamic color switching at runtime  
✅ **Tailwind Integration** - Use theme colors as Tailwind classes  
✅ **Persistence** - Theme choice saved to localStorage  
✅ **System Preference** - Respects `prefers-color-scheme` on first load  
✅ **Smooth Transitions** - 300ms CSS transitions for theme changes  
✅ **Production Ready** - Clean code, proper error handling  
✅ **Scalable** - Easy to add new themes or customize colors  

---

## Customizing Colors

To modify colors, edit `src/theme/colors.js`:

```javascript
const lightMode = {
  'bg-primary': '#FFFFFF',    // Change this
  'primary': '#007BFF',       // Or this
  'success': '#28A745',       // Or this
  // ... etc
};

const darkMode = {
  'bg-primary': '#0F1419',    // Dark mode equivalent
  // ... etc
};
```

Then restart the dev server. Tailwind will pick up the new colors automatically.

---

## Adding a New Color Token

1. Add to both `lightMode` and `darkMode` in `colors.js`:
   ```javascript
   const lightMode = {
     'brand-gradient': '#FF6B6B',
     // ...
   };
   
   const darkMode = {
     'brand-gradient': '#FF9999',
     // ...
   };
   ```

2. Use in components:
   ```jsx
   <div className="bg-brand-gradient">Content</div>
   ```

3. Or as CSS variable:
   ```jsx
   <div style={{ color: 'var(--brand-gradient)' }}>Text</div>
   ```

---

## Creating a New Theme

To add support for additional themes (e.g., "sepia", "high-contrast"):

1. Create a new mode object in `colors.js`:
   ```javascript
   const sepiaMode = {
     'bg-primary': '#F4EBD9',
     'text-primary': '#5C4033',
     // ... all color tokens
   };
   ```

2. Export it from `colors.js`

3. Update `ThemeProvider` to support the new theme:
   ```javascript
   const [theme, setTheme] = useState('light'); // or 'dark' or 'sepia'
   ```

4. Add CSS variables for the new theme in `index.css`:
   ```css
   :root[data-theme="sepia"] {
     --bg-primary: #F4EBD9;
     --text-primary: #5C4033;
     /* ... etc */
   }
   ```

---

## Best Practices

### Do's ✅
- Use color token names: `bg-primary`, `text-secondary`
- Rely on CSS variables for runtime flexibility
- Use `useTheme` hook to access theme state
- Add theme support to new components
- Test both light and dark modes

### Don'ts ❌
- Don't hardcode colors like `bg-red-500`, use `bg-error`
- Don't use inline colors in style props; use CSS variables
- Don't create duplicate color systems
- Don't forget to update both light AND dark mode colors
- Don't skip testing theme toggle

---

## Troubleshooting

### Colors not changing on theme switch?
- Make sure component is using theme color tokens, not hardcoded values
- Check that `ThemeProvider` wraps your app in `main.jsx`
- Verify `useTheme` is only called inside a component wrapped by `ThemeProvider`

### CSS variables not working?
- Ensure `index.css` is imported in `main.jsx`
- Check browser DevTools: right-click → Inspect → look for `:root` styles
- Restart dev server if you modified `colors.js`

### Tailwind classes not recognized?
- Clear `.next` or `node_modules/.vite` cache: `npm run dev` should rebuild
- Check `tailwind.config.cjs` imports `colors.js` correctly
- Verify color token names match exactly in usage

---

## Integration Checklist

- [x] ThemeProvider wraps entire app in main.jsx
- [x] index.css includes Tailwind directives and CSS variables
- [x] tailwind.config.cjs imports and uses color tokens
- [x] Components use theme color tokens instead of hardcoded colors
- [x] ThemeToggle component added to UI
- [x] localStorage persistence working
- [x] Light and dark mode styles defined
- [x] Smooth transitions configured

---

## Performance Notes

- **CSS Variables** are resolved at render-time (minimal overhead)
- **Tailwind Classes** are pre-compiled (zero runtime cost)
- **Theme Toggle** uses Context (minimal re-renders due to React.memo if needed)
- **Transitions** use GPU-accelerated CSS (smooth, 60fps)

---

## Support & Maintenance

The theme system is designed to be:
- **Easy to update** - Edit `colors.js` once, updates everywhere
- **Easy to extend** - Add new tokens, create new themes
- **Easy to debug** - Clear file structure, well-commented
- **Production-ready** - Tested, performant, accessible

For questions or improvements, refer to the component code files which include detailed comments.
