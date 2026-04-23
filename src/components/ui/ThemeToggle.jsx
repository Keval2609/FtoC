import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-all duration-300 cursor-pointer"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span
        className="material-symbols-outlined text-on-surface-variant transition-transform duration-300"
        style={{
          transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
}
