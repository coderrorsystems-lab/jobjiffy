const { lightMode } = require('./src/theme/colors.js');

// Convert color tokens to Tailwind-compatible format
const tailwindColors = Object.fromEntries(
  Object.entries(lightMode).map(([key, value]) => [key, value])
);

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: tailwindColors,
    },
  },
  plugins: [],
}
