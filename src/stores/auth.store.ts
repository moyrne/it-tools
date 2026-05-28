import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAuthenticated } from '@/services/api';
import * as authService from '@/services/auth.service';
import * as preferencesService from '@/services/preferences.service';
import type { UserProfile } from '@/services/auth.service';
import { useToolStore } from '@/tools/tools.store';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null);
  const isLoggedIn = ref(isAuthenticated());

  async function login(username: string, password: string) {
    const data = await authService.login(username, password);
    isLoggedIn.value = true;
    user.value = await authService.getMe();
    await syncAfterLogin();
    return data;
  }

  async function register(username: string, password: string) {
    const data = await authService.register(username, password);
    isLoggedIn.value = true;
    user.value = await authService.getMe();
    await syncAfterLogin();
    return data;
  }

  function logout() {
    authService.logout();
    isLoggedIn.value = false;
    user.value = null;
  }

  async function fetchProfile() {
    if (isLoggedIn.value) {
      try {
        user.value = await authService.getMe();
      } catch {
        logout();
      }
    }
  }

  async function syncAfterLogin() {
    const toolStore = useToolStore();
    await toolStore.mergeAfterLogin();
    try {
      const prefs = await preferencesService.getPreferences();
      if (prefs.language) {
        const { locale } = useI18n();
        locale.value = prefs.language;
      }
    } catch {
      // preferences sync is best-effort
    }
  }

  return { user, isLoggedIn, login, register, logout, fetchProfile };
});
