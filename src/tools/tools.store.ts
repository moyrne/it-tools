import { type MaybeRef, get, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import _ from 'lodash';
import type { Tool, ToolCategory, ToolWithCategory } from './tools.types';
import { toolsWithCategory } from './index';
import { isAuthenticated } from '@/services/api';
import * as favoritesService from '@/services/favorites.service';
import { config } from '@/config';

export const useToolStore = defineStore('tools', () => {
  const favoriteToolsName = useStorage('favoriteToolsName', []) as Ref<string[]>;
  const { t } = useI18n();

  const tools = computed<ToolWithCategory[]>(() => toolsWithCategory.map((tool) => {
    const toolI18nKey = tool.path.replace(/\//g, '');

    return ({
      ...tool,
      path: tool.path,
      name: t(`tools.${toolI18nKey}.title`, tool.name),
      description: t(`tools.${toolI18nKey}.description`, tool.description),
      category: t(`tools.categories.${tool.category.toLowerCase()}`, tool.category),
    });
  }));

  const toolsByCategory = computed<ToolCategory[]>(() => {
    return _.chain(tools.value)
      .groupBy('category')
      .map((components, name, path) => ({
        name,
        path,
        components,
      }))
      .value();
  });

  const favoriteTools = computed(() => {
    return favoriteToolsName.value
      .map(favoriteName => tools.value.find(({ name, path }) => name === favoriteName || path === favoriteName))
      .filter(Boolean) as ToolWithCategory[];
  });

  async function syncToServer() {
    if (config.showAuth && isAuthenticated()) {
      try {
        await favoritesService.updateFavorites(favoriteToolsName.value);
      } catch {
        // silently fail - localStorage fallback still works
      }
    }
  }

  return {
    tools,
    favoriteTools,
    toolsByCategory,
    newTools: computed(() => tools.value.filter(({ isNew }) => isNew)),

    addToolToFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      const toolPath = get(tool).path;
      if (toolPath) {
        favoriteToolsName.value = [...favoriteToolsName.value, toolPath];
        syncToServer();
      }
    },

    removeToolFromFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      favoriteToolsName.value = favoriteToolsName.value.filter(name => get(tool).name !== name && get(tool).path !== name);
      syncToServer();
    },

    isToolFavorite({ tool }: { tool: MaybeRef<Tool> }) {
      return favoriteToolsName.value.includes(get(tool).name)
        || favoriteToolsName.value.includes(get(tool).path);
    },

    updateFavoriteTools(newOrder: ToolWithCategory[]) {
      favoriteToolsName.value = newOrder.map(tool => tool.path);
      syncToServer();
    },

    exportFavorites() {
      return JSON.stringify(favoriteToolsName.value, null, 2);
    },

    importFavorites(data: string[]) {
      if (!Array.isArray(data)) {
        throw new Error('Invalid format');
      }
      favoriteToolsName.value = data;
      syncToServer();
    },

    async mergeAfterLogin() {
      if (favoriteToolsName.value.length > 0) {
        try {
          const merged = await favoritesService.mergeFavorites(favoriteToolsName.value);
          favoriteToolsName.value = merged;
        } catch {
          // fall back to localStorage
        }
      } else {
        try {
          const serverFavorites = await favoritesService.getFavorites();
          favoriteToolsName.value = serverFavorites;
        } catch {
          // fall back to localStorage
        }
      }
    },
  };
});
