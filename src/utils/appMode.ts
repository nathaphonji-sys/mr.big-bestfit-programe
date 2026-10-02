/** UI visibility only; /admin is not an authenticated or private route. */
export function isAdminLocation(location: Pick<Location, 'pathname' | 'search'>): boolean {
  return /^\/admin\/?$/.test(location.pathname) || new URLSearchParams(location.search).get('admin') === 'true'
}
