import { Link, useLocation } from 'react-router-dom';
import {
  createDefaultNavigation,
  getNavigationLinkClasses,
  isPathActive,
} from '../utils/navigation';
import type { NavigationItem } from '../types';

// Pure component for rendering a single navigation link
interface NavigationLinkProps {
  readonly item: NavigationItem;
  readonly currentPath: string;
}

const NavigationLink = ({ item, currentPath }: NavigationLinkProps) => {
  const isActive = isPathActive(item.path, currentPath);
  const linkClasses = getNavigationLinkClasses(isActive);

  return (
    <Link to={item.path} className={linkClasses}>
      {item.name}
    </Link>
  );
};

// Pure component for rendering navigation links list
interface NavigationLinksProps {
  readonly items: readonly NavigationItem[];
  readonly currentPath: string;
  readonly className?: string;
}

const NavigationLinks = ({ items, currentPath, className = '' }: NavigationLinksProps) => (
  <div className={className}>
    {items.map((item) => (
      <NavigationLink key={item.path} item={item} currentPath={currentPath} />
    ))}
  </div>
);

// Pure component for site logo
interface SiteLogoProps {
  readonly title?: string;
  readonly className?: string;
}

const SiteLogo = ({ title = 'React Static Site', className = '' }: SiteLogoProps) => (
  <div className={`flex justify-start lg:w-0 lg:flex-1 ${className}`}>
    <Link to="/" className="text-2xl font-bold text-gray-900">
      {title}
    </Link>
  </div>
);

// Pure component for mobile menu button
interface MobileMenuButtonProps {
  readonly isOpen?: boolean;
  readonly onToggle?: () => void;
  readonly className?: string;
}

const MobileMenuButton = ({ isOpen = false, onToggle, className = '' }: MobileMenuButtonProps) => (
  <div className={`md:hidden ${className}`}>
    <button
      type="button"
      onClick={onToggle}
      className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100"
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
    >
      <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        {isOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  </div>
);

// Main Header component
const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigationItems = createDefaultNavigation(currentPath);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <SiteLogo />

          <NavigationLinks
            items={navigationItems}
            currentPath={currentPath}
            className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-8"
          />

          <MobileMenuButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
