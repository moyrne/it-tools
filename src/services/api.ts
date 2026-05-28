import pb from './pocketbase';

export function setTokens(_access: string, _refresh?: string) {
  // PocketBase SDK handles token storage internally via pb.authStore
}

export function clearTokens() {
  pb.authStore.clear();
}

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

export function getToken(): string | null {
  return pb.authStore.token || null;
}
