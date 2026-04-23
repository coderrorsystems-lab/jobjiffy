/**
 * Centralized Color System
 * Defines all color tokens for Light and Dark modes
 * Single source of truth for all theme colors
 */

const lightMode = {
  // Background colors
  'bg-primary': '#FFFFFF',
  'bg-secondary': '#F8F9FA',
  'bg-tertiary': '#F1F3F5',
  'bg-card': '#FFFFFF',
  'bg-hover': '#F0F2F5',
  'bg-active': '#E9ECEF',

  // Text colors
  'text-primary': '#1C1E23',
  'text-secondary': '#6C757D',
  'text-tertiary': '#999DAA',
  'text-muted': '#AEAFB2',
  'text-inverse': '#FFFFFF',

  // Border colors
  'border-primary': '#E9ECEF',
  'border-secondary': '#DEE2E6',
  'border-focus': '#495057',

  // Brand colors
  'primary': '#007BFF',
  'primary-dark': '#0056B3',
  'primary-light': '#E7F1FF',

  'secondary': '#6C757D',
  'secondary-dark': '#545B62',
  'secondary-light': '#E8EAED',

  // Semantic colors
  'success': '#28A745',
  'success-light': '#D4EDDA',
  'warning': '#FFC107',
  'warning-light': '#FFF3CD',
  'error': '#DC3545',
  'error-light': '#F8D7DA',
  'info': '#17A2B8',
  'info-light': '#D1ECF1',

  // Accent colors
  'accent': '#FF6B35',
  'accent-light': '#FFE5D9',

  // Neutral shades
  'neutral-0': '#FFFFFF',
  'neutral-50': '#F9FAFB',
  'neutral-100': '#F3F4F6',
  'neutral-200': '#E5E7EB',
  'neutral-300': '#D1D5DB',
  'neutral-400': '#9CA3AF',
  'neutral-500': '#6B7280',
  'neutral-600': '#4B5563',
  'neutral-700': '#374151',
  'neutral-800': '#1F2937',
  'neutral-900': '#111827',

  // Shadow for light mode
  'shadow-sm': 'rgba(0, 0, 0, 0.05)',
  'shadow-md': 'rgba(0, 0, 0, 0.1)',
  'shadow-lg': 'rgba(0, 0, 0, 0.15)',

  // Overlay
  'overlay': 'rgba(0, 0, 0, 0.5)',
};

const darkMode = {
  // Background colors
  'bg-primary': '#0F1419',
  'bg-secondary': '#1A1F2E',
  'bg-tertiary': '#252B3B',
  'bg-card': '#1A1F2E',
  'bg-hover': '#252B3B',
  'bg-active': '#2F3647',

  // Text colors
  'text-primary': '#F5F6F8',
  'text-secondary': '#C5C7CC',
  'text-tertiary': '#9498A1',
  'text-muted': '#7B8087',
  'text-inverse': '#1C1E23',

  // Border colors
  'border-primary': '#252B3B',
  'border-secondary': '#2F3647',
  'border-focus': '#E9ECEF',

  // Brand colors
  'primary': '#4A9EFF',
  'primary-dark': '#2A7EE0',
  'primary-light': '#1E3A4D',

  'secondary': '#9BA3AF',
  'secondary-dark': '#6B7280',
  'secondary-light': '#2F3647',

  // Semantic colors
  'success': '#34D399',
  'success-light': '#1F3A2F',
  'warning': '#FBBF24',
  'warning-light': '#3F3019',
  'error': '#F87171',
  'error-light': '#3E1F1F',
  'info': '#38BDF8',
  'info-light': '#1E3A4D',

  // Accent colors
  'accent': '#FF8C61',
  'accent-light': '#3F2419',

  // Neutral shades (inverted from light mode)
  'neutral-0': '#0F1419',
  'neutral-50': '#1A1F2E',
  'neutral-100': '#252B3B',
  'neutral-200': '#2F3647',
  'neutral-300': '#3F4655',
  'neutral-400': '#6B7280',
  'neutral-500': '#9BA3AF',
  'neutral-600': '#C5C7CC',
  'neutral-700': '#D9DDE3',
  'neutral-800': '#E9ECEF',
  'neutral-900': '#F5F6F8',

  // Shadow for dark mode
  'shadow-sm': 'rgba(0, 0, 0, 0.3)',
  'shadow-md': 'rgba(0, 0, 0, 0.5)',
  'shadow-lg': 'rgba(0, 0, 0, 0.7)',

  // Overlay
  'overlay': 'rgba(0, 0, 0, 0.8)',
};

export { lightMode, darkMode };

/**
 * Color Token Reference for usage in components:
 *
 * Background:
 *   - bg-primary: Main page background
 *   - bg-secondary: Secondary background for sections
 *   - bg-tertiary: Tertiary background for subsections
 *   - bg-card: Card/container background
 *   - bg-hover: Hover state background
 *   - bg-active: Active/selected state background
 *
 * Text:
 *   - text-primary: Main body text
 *   - text-secondary: Secondary text
 *   - text-tertiary: Tertiary text
 *   - text-muted: Muted/disabled text
 *   - text-inverse: Inverse text color
 *
 * Borders:
 *   - border-primary: Main border color
 *   - border-secondary: Secondary border
 *   - border-focus: Focus/highlight border
 *
 * Brand:
 *   - primary / primary-dark / primary-light: Primary brand colors
 *   - secondary / secondary-dark / secondary-light: Secondary brand colors
 *
 * Semantic:
 *   - success/warning/error/info: Status colors
 *   - *-light: Light variants for backgrounds
 *
 * Accent:
 *   - accent / accent-light: Accent colors for highlights
 */
