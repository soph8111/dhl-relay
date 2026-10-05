import { useTheme } from '../context/ThemeContext';
import { MoonIcon, SunIcon } from '@dhl-relay/ui';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Light' : 'Dark'}
      className="p-2"
    >
      {theme === 'dark' ? (
        <MoonIcon className="w-4 h-4 hover:opacity-80 cursor-pointer transition-opacity ease-in-out duration-200" />
      ) : (
        <SunIcon className="w-4 h-4 hover:opacity-80 cursor-pointer transition-opacity ease-in-out duration-200" />
      )}
    </button>
  );
}
