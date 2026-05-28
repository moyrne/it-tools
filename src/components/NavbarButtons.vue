<script setup lang="ts">
import { IconBrandGithub, IconBrandX, IconInfoCircle, IconMoon, IconSun, IconUser, IconLogout } from '@tabler/icons-vue';
import { useStyleStore } from '@/stores/style.store';
import { useAuthStore } from '@/stores/auth.store';
import { config } from '@/config';

const styleStore = useStyleStore();
const { isDarkTheme } = toRefs(styleStore);
const authStore = useAuthStore();
</script>

<template>
  <div class="navbar-buttons">
    <template v-if="config.showAuth">
      <div class="button-group">
        <template v-if="authStore.isLoggedIn">
          <c-tooltip :tooltip="authStore.user?.username" position="bottom">
            <c-button circle variant="text" :aria-label="$t('auth.profile')">
              <n-icon size="25" :component="IconUser" />
            </c-button>
          </c-tooltip>
          <c-tooltip :tooltip="$t('auth.logout')" position="bottom">
            <c-button circle variant="text" :aria-label="$t('auth.logout')" @click="authStore.logout()">
              <n-icon size="25" :component="IconLogout" />
            </c-button>
          </c-tooltip>
        </template>
        <template v-else>
          <AuthModal />
        </template>
      </div>

      <div class="group-divider" />
    </template>

    <div class="button-group">
      <c-tooltip :tooltip="$t('home.nav.github')" position="bottom">
        <c-button
          circle
          variant="text"
          href="https://github.com/CorentinTh/it-tools"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="$t('home.nav.githubRepository')"
        >
          <n-icon size="25" :component="IconBrandGithub" />
        </c-button>
      </c-tooltip>

      <c-tooltip :tooltip="$t('home.nav.twitterX')" position="bottom">
        <c-button
          circle
          variant="text"
          href="https://x.com/ittoolsdottech"
          rel="noopener"
          target="_blank"
          :aria-label="$t('home.nav.twitterXAccount')"
        >
          <n-icon size="25" :component="IconBrandX" />
        </c-button>
      </c-tooltip>

      <c-tooltip :tooltip="$t('home.nav.about')" position="bottom">
        <c-button circle variant="text" to="/about" :aria-label="$t('home.nav.aboutLabel')">
          <n-icon size="25" :component="IconInfoCircle" />
        </c-button>
      </c-tooltip>

      <c-tooltip :tooltip="isDarkTheme ? $t('home.nav.lightMode') : $t('home.nav.darkMode')" position="bottom">
        <c-button circle variant="text" :aria-label="$t('home.nav.mode')" @click="() => styleStore.toggleDark()">
          <n-icon v-if="isDarkTheme" size="25" :component="IconSun" />
          <n-icon v-else size="25" :component="IconMoon" />
        </c-button>
      </c-tooltip>
    </div>

  </div>
</template>

<style lang="less" scoped>
.navbar-buttons {
  display: inline-flex;
  align-items: center;
}

.button-group {
  display: inline-flex;
  align-items: center;
}

.group-divider {
  width: 1px;
  height: 24px;
  background-color: rgba(128, 128, 128, 0.3);
  margin: 0 4px;
}
</style>
