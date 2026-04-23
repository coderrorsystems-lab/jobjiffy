import React from 'react'
import { useTheme } from './theme'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  const { theme, isDark } = useTheme()

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      {/* Header with Theme Toggle */}
      <header className="bg-bg-secondary border-b border-border-primary px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Jobjiffy</h1>
          <div className="flex items-center gap-4">
            <span className="text-text-secondary text-sm">
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-bg-card rounded-lg shadow-md border border-border-primary p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-semibold text-text-primary mb-4">
            Welcome to Jobjiffy — Client
          </h2>
          <p className="text-text-secondary mb-6">
            A modern, theme-aware React application with centralized color management.
          </p>

          {/* Theme Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Primary Color Card */}
            <div className="bg-primary-light rounded-lg p-4 border-l-4 border-primary">
              <h3 className="font-semibold text-text-primary mb-2">Primary</h3>
              <p className="text-text-secondary text-sm">
                Brand colors for actions and highlights
              </p>
            </div>

            {/* Success Card */}
            <div className="bg-success-light rounded-lg p-4 border-l-4 border-success">
              <h3 className="font-semibold text-text-primary mb-2">Success</h3>
              <p className="text-text-secondary text-sm">
                For positive actions and confirmations
              </p>
            </div>

            {/* Error Card */}
            <div className="bg-error-light rounded-lg p-4 border-l-4 border-error">
              <h3 className="font-semibold text-text-primary mb-2">Error</h3>
              <p className="text-text-secondary text-sm">
                For alerts and important warnings
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border-primary">
            <h3 className="text-lg font-semibold text-text-primary mb-4">✨ Features</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-success font-bold mt-0.5">✓</span>
                <span>Centralized color theme system</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success font-bold mt-0.5">✓</span>
                <span>Light and Dark mode support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success font-bold mt-0.5">✓</span>
                <span>CSS variables and Tailwind integration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success font-bold mt-0.5">✓</span>
                <span>Theme preference persisted to localStorage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success font-bold mt-0.5">✓</span>
                <span>Smooth theme transitions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success font-bold mt-0.5">✓</span>
                <span>Production-ready and scalable</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-bg-secondary border-t border-border-primary px-6 py-6 text-center text-text-secondary text-sm">
        <p>
          Current theme: <span className="font-semibold text-text-primary">{theme}</span> •
          Built with React, Vite, and Tailwind CSS
        </p>
      </footer>
    </div>
  )
}
