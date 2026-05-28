import pb from './pocketbase';
import { setTokens } from './api';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface UserProfile {
  id: string;
  username: string;
  created: string;
  updated: string;
}

function toEmail(username: string): string {
  return `${username}@it-tools.local`;
}

export async function register(username: string, password: string): Promise<AuthResponse> {
  await pb.collection('users').create({
    username,
    email: toEmail(username),
    emailVisibility: false,
    password,
    passwordConfirm: password,
  });
  return login(username, password);
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const result = await pb.collection('users').authWithPassword(
    toEmail(username),
    password,
  );
  const token = pb.authStore.token || '';
  setTokens(token);
  return { access_token: token, refresh_token: token };
}

export async function getMe(): Promise<UserProfile> {
  if (!pb.authStore.model) {
    throw new Error('Not authenticated');
  }
  const m = pb.authStore.model as Record<string, unknown>;
  return {
    id: m.id as string,
    username: (m.username as string) || (m.email as string),
    created: m.created as string,
    updated: m.updated as string,
  };
}

export function logout() {
  pb.authStore.clear();
}
