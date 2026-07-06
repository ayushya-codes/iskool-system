import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Aegis Prism (Light)' : 'Switch to Aether Flow (Dark)'}
      title={isDark ? 'Aegis Prism' : 'Aether Flow'}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 hover:scale-110"
      style={{
        background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(14, 165, 233, 0.1)',
        border: isDark ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(14, 165, 233, 0.2)',
      }}
    >
      {isDark ? (
        <Moon
          className="w-[18px] h-[18px] transition-transform duration-500 rotate-0"
          style={{ color: 'var(--accent-primary)', filter: 'drop-shadow(0 0 4px var(--accent-primary))' }}
        />
      ) : (
        <Sun
          className="w-[18px] h-[18px] transition-transform duration-500"
          style={{ color: 'var(--accent-primary)' }}
        />
      )}
    </button>
  );
}
