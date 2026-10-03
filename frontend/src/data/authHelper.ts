export interface UserProfile {
  isLoggedIn: boolean;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  memberSince?: string;
}

const AUTH_STORAGE_KEY = 'novamart_user_auth_v1';

export const DEFAULT_USER: UserProfile = {
  isLoggedIn: true,
  name: 'Tarak S.',
  phone: '+91 98765 43210',
  email: 'tarak.desai@novamart.in',
  avatar: 'TS',
  memberSince: 'Oct 2026',
};

export function getAuthState(): UserProfile {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read auth state', e);
  }
  return { ...DEFAULT_USER, isLoggedIn: false };
}

export function setAuthState(user: Partial<UserProfile> & { isLoggedIn: boolean }): void {
  try {
    const current = getAuthState();
    const updated = { ...current, ...user };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('novamart_auth_updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to set auth state', e);
  }
}

export function logoutUser(): void {
  try {
    const current = getAuthState();
    const updated: UserProfile = { ...current, isLoggedIn: false };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('novamart_auth_updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to logout user', e);
  }
}
