export const ADMIN_EMAILS = new Set([
  'aayushsah64919@gmail.com',
  'aayushhhsahh@gmail.com',
  'gauravtimalsena70@gmail.com',
]);

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase());
}
