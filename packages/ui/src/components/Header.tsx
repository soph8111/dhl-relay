import { ThemeToggle } from './ThemeToggle';
import DhlLogo from '../icons/DhlLogo';

export function Header() {
  return (
    <header className="relative flex justify-center pt-14 pb-8 md:pt-8 md:justify-start">
      <DhlLogo className="text-dark-100 dark:text-light-100 w-50 md:w-55" />
      <div className="absolute top-0 right-0">
        <ThemeToggle />
      </div>
    </header>
  );
}
