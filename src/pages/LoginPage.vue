<template>
  <q-page class="q-pa-md bg-white col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
    <div class="column justify-center full-height">
      <img style="width: 10rem" src="../assets/logo-genesis.svg" />
      <q-input
        class="q-mt-lg"
        v-model="username"
        label="Masukkan email atau username"
        @keyup.enter="onLogin"
      />
      <q-input
        v-model="password"
        :type="isPwd ? 'password' : 'text'"
        label="Masukkan password anda"
        @keyup.enter="onLogin"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <q-btn label="Masuk" @click="onLogin" class="full-width q-mt-xl" :disable="!username || !password" no-caps color="primary" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'

export default defineComponent({
  name: 'LoginPage',
  setup () {
    const { login } = useAuthStore()
    const username = ref('')
    const password = ref('')
    const isPwd = ref(true)
    async function onLogin () {
      if (!username.value || !password.value) return
      await login(username.value, password.value)
    }
    return { onLogin, username, password, isPwd }
  }
})
</script>
