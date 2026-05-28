<script setup lang="ts">
import { IconLogin } from '@tabler/icons-vue';
import { NIcon } from 'naive-ui';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const show = ref(false);
const isLogin = ref(true);
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    if (isLogin.value) {
      await authStore.login(username.value, password.value);
    } else {
      await authStore.register(username.value, password.value);
    }
    show.value = false;
    username.value = '';
    password.value = '';
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

function switchMode() {
  isLogin.value = !isLogin.value;
  error.value = '';
}
</script>

<template>
  <c-tooltip :tooltip="$t('auth.login')" position="bottom">
    <c-button circle variant="text" :aria-label="$t('auth.login')" @click="show = true">
      <NIcon size="25" :component="IconLogin" />
    </c-button>
  </c-tooltip>

  <n-modal v-model:show="show" preset="card" :title="isLogin ? $t('auth.login') : $t('auth.register')" style="width: 400px;">
    <n-form @submit.prevent="handleSubmit">
      <n-form-item :label="$t('auth.username')">
        <n-input v-model:value="username" type="text" :placeholder="$t('auth.usernamePlaceholder')" />
      </n-form-item>
      <n-form-item :label="$t('auth.password')">
        <n-input v-model:value="password" type="password" placeholder="********" />
      </n-form-item>

      <n-alert v-if="error" type="error" :title="error" closable style="margin-bottom: 12px;" />

      <n-button type="primary" block attr-type="submit" :loading="loading" :disabled="loading">
        {{ isLogin ? $t('auth.login') : $t('auth.register') }}
      </n-button>
    </n-form>

    <template #footer>
      <n-button text @click="switchMode">
        {{ isLogin ? $t('auth.switchToRegister') : $t('auth.switchToLogin') }}
      </n-button>
    </template>
  </n-modal>
</template>
