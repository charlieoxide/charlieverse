import React from 'react';
import { useTheme } from '../context/ThemeContext';

export function ThemeDebug() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Switching theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  const handleSystem = () => {
    setTheme('system');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-background border border-border rounded-lg shadow-lg">
      <p className="text-sm text-foreground mb-2">Current: {theme}</p>
      <div className="flex gap-2">
        <button 
          onClick={handleToggle}
          className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-xs"
        >
          Toggle
        </button>
        <button 
          onClick={handleSystem}
          className="px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 text-xs"
        >
          System
        </button>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        HTML classes: {document.documentElement.className}
      </div>
    </div>
  );
}