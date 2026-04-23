# Theme System Quick Reference

## Import Theme Utilities

```javascript
// Option 1: Import from theme index
import { ThemeProvider, useTheme } from './theme';

// Option 2: Import individual exports
import { ThemeProvider } from './theme/ThemeContext';
import { useTheme } from './theme/useTheme';
import { lightMode, darkMode } from './theme/colors';
```

## Most Common Uses

### Access Theme State
```jsx
const { theme, isDark, isLight, toggleTheme } = useTheme();
```

### Use Color Tokens in Tailwind
```jsx
<div className="bg-bg-primary text-text-primary border border-border-primary">
  <h1 className="text-primary font-bold">Title</h1>
  <p className="text-text-secondary">Subtitle</p>
  <button className="bg-primary hover:bg-primary-dark text-white">
    Action
  </button>
</div>
```

### Use Color Tokens as CSS Variables
```jsx
<div style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-card)' }}>
  Content
</div>
```

### Create a Theme-Aware Component
```jsx
import { useTheme } from '../theme';

export default function MyComponent() {
  const { isDark, theme } = useTheme();
  
  return (
    <div className={`bg-bg-card p-4 rounded-lg ${isDark ? 'shadow-lg' : 'shadow-sm'}`}>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

## Color Token Categories

| Category | Examples | Use Case |
|----------|----------|----------|
| **Background** | `bg-primary`, `bg-card`, `bg-hover` | Container & page backgrounds |
| **Text** | `text-primary`, `text-secondary`, `text-muted` | Body, labels, disabled text |
| **Border** | `border-primary`, `border-focus` | Dividers, input borders |
| **Brand** | `primary`, `secondary`, `accent` | CTA buttons, highlights |
| **Semantic** | `success`, `warning`, `error`, `info` | Status indicators |
| **Neutral** | `neutral-0` to `neutral-900` | Grayscale fallback |

## File Locations

- **Colors defined:** `src/theme/colors.js`
- **Theme logic:** `src/theme/ThemeContext.jsx`
- **Theme hook:** `src/theme/useTheme.js`
- **Toggle UI:** `src/components/ThemeToggle.jsx`
- **CSS variables:** `src/index.css`
- **Tailwind config:** `tailwind.config.cjs`

## Persistence

✓ Theme choice saved to `localStorage` (key: `app-theme`)  
✓ Respects system preference on first visit  
✓ Restores preference on return visit  

## Adding New Colors

Edit `src/theme/colors.js`:

```javascript
const lightMode = {
  'your-new-color': '#HEXCODE',
};

const darkMode = {
  'your-new-color': '#HEXCODE',
};
```

Then use:
```jsx
<div className="bg-your-new-color">...</div>
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Colors not changing | Check ThemeProvider wraps app in main.jsx |
| useTheme error | Ensure component is inside ThemeProvider |
| Tailwind classes invalid | Restart dev server after editing colors.js |
| CSS variables undefined | Check index.css is imported in main.jsx |

---

**Full documentation:** See `THEME_SYSTEM.md` for complete guide.
