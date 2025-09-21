import type { NavigationItem } from '../types';

// Pure functions for navigation logic

/**
 * Creates a navigation item
 * @param name - Display name
 * @param path - Route path
 * @param current - Whether this item is currently active
 * @returns NavigationItem object
 */
export const createNavigationItem = (
  name: string,
  path: string,
  current = false
): NavigationItem => ({
  name,
  path,
  current,
});

/**
 * Updates the current state of navigation items based on active path
 * @param items - Array of navigation items
 * @param activePath - Currently active path
 * @returns Updated navigation items with correct current state
 */
export const updateNavigationCurrent = (
  items: readonly NavigationItem[],
  activePath: string
): readonly NavigationItem[] =>
  items.map((item) => ({
    ...item,
    current: item.path === activePath,
  }));

/**
 * Gets the CSS classes for a navigation link
 * @param isActive - Whether the link is currently active
 * @param baseClasses - Base CSS classes
 * @param activeClasses - Additional classes for active state
 * @param inactiveClasses - Additional classes for inactive state
 * @returns Complete CSS class string
 */
export const getNavigationLinkClasses = (
  isActive: boolean,
  baseClasses = 'text-base font-medium',
  activeClasses = 'text-blue-600',
  inactiveClasses = 'text-gray-500 hover:text-gray-900'
): string => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

/**
 * Checks if a path matches the current location
 * @param itemPath - Navigation item path
 * @param currentPath - Current location path
 * @returns True if paths match
 */
export const isPathActive = (itemPath: string, currentPath: string): boolean =>
  itemPath === currentPath;

/**
 * Creates the default navigation items for the site
 * @param currentPath - Current active path
 * @returns Array of navigation items with correct active state
 */
export const createDefaultNavigation = (currentPath: string): readonly NavigationItem[] => {
  const defaultItems = [
    createNavigationItem('Home', '/'),
    createNavigationItem('About', '/about'),
    createNavigationItem('Contact', '/contact'),
  ];

  return updateNavigationCurrent(defaultItems, currentPath);
};

/**
 * Filters navigation items based on visibility rules
 * @param items - Navigation items to filter
 * @param shouldShow - Predicate function to determine visibility
 * @returns Filtered navigation items
 */
export const filterVisibleNavigation = (
  items: readonly NavigationItem[],
  shouldShow: (item: NavigationItem) => boolean = () => true
): readonly NavigationItem[] => items.filter(shouldShow);

/**
 * Finds a navigation item by path
 * @param items - Navigation items to search
 * @param path - Path to find
 * @returns Navigation item or null if not found
 */
export const findNavigationByPath = (
  items: readonly NavigationItem[],
  path: string
): NavigationItem | null => {
  const found = items.find((item) => item.path === path);
  return found || null;
};

/**
 * Gets the display name for a path from navigation items
 * @param items - Navigation items
 * @param path - Path to get name for
 * @param fallback - Fallback name if path not found
 * @returns Display name
 */
export const getNavigationDisplayName = (
  items: readonly NavigationItem[],
  path: string,
  fallback = 'Page'
): string => {
  const item = findNavigationByPath(items, path);
  return item?.name || fallback;
};
