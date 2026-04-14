export const ADMIN_EMAIL = 'aayushsah64919@gmail.com';
export const ADMIN_PASSWORD = '12345678';
export const ADMIN_AUTH_KEY = 'admin-session';

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function setAdminLoggedIn(value: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_AUTH_KEY, value ? 'true' : 'false');
}
