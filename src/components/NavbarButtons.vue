<script setup lang="ts">
import { IconBrandGithub, IconBrandX, IconFileExport, IconFileImport, IconInfoCircle, IconMoon, IconSun } from '@tabler/icons-vue';
import { useStyleStore } from '@/stores/style.store';
import { useToolStore } from '@/tools/tools.store';

const styleStore = useStyleStore();
const { isDarkTheme } = toRefs(styleStore);
const toolStore = useToolStore();
const importInput = ref<HTMLInputElement | null>(null);

function handleExport() {
  const json = toolStore.exportFavorites();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'favorites.json';
  a.click();
  URL.revokeObjectURL(url);
}

function handleImport(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string);
      toolStore.importFavorites(data);
    } catch {
      window.alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
  input.value = '';
}
</script>

<template>
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

  <c-tooltip :tooltip="$t('home.nav.exportFavorites')" position="bottom">
    <c-button circle variant="text" :aria-label="$t('home.nav.exportFavorites')" @click="handleExport">
      <n-icon size="25" :component="IconFileExport" />
    </c-button>
  </c-tooltip>

  <c-tooltip :tooltip="$t('home.nav.importFavorites')" position="bottom">
    <c-button circle variant="text" :aria-label="$t('home.nav.importFavorites')" @click="importInput?.click()">
      <n-icon size="25" :component="IconFileImport" />
    </c-button>
  </c-tooltip>
  <input ref="importInput" type="file" accept=".json" hidden @change="handleImport" />
</template>

<style lang="less" scoped>
.n-button {
  &:not(:last-child) {
    margin-right: 5px;
  }
}
</style>
