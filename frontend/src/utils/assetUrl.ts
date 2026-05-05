/**
 * Helper utility to get the correct URL for assets in the public folder.
 * This ensures that when deployed to a subpath (like GitHub Pages),
 * the base URL is properly prefixed.
 *
 * @param path The path to the asset (e.g. '/hero-fleet.png')
 * @returns The absolute path prefixed with the base URL
 */
export const getPublicUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  
  // Remove trailing slash from base if present
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${cleanBase}/${cleanPath}`;
};
