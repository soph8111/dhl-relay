import { useTheme } from '../hooks/useTheme';
import MoonIcon from '../icons/Moon';
import SunIcon from '../icons/Sun';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Light' : 'Dark'}
      className="p-2"
    >
      {theme === 'dark' ? (
        <MoonIcon className="w-4 h-4" />
      ) : (
        <SunIcon className="w-4 h-4" />
      )}
    </button>
  );
}
