<template>
  <q-layout class="bg-grey-2" view="lHh Lpr lFf">
    <template v-if="currentRoute !== 'login'">
      <q-header elevated class="bg-white row justify-center">
        <q-toolbar class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
          <q-toolbar-title class="text-black text-medium">
            Update STI <span class="text-caption">v1.0.0</span>
          </q-toolbar-title>
          <q-btn flat round dense color="primary" icon="logout" @click="logout" />
        </q-toolbar>
      </q-header>

      <q-footer bordered class="q-pa-md bg-white row justify-center">
        <q-btn :disable="!stiStore.listShipmentReadyToSti.length" @click="stiStore.submitUpdateSti" label="Proses" color="primary" class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4" />
      </q-footer>
    </template>

    <q-page-container class="row justify-center">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStiStore } from 'stores/sti-store'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
    const stiStore = useStiStore()
    const { logout } = useAuthStore()
    const router = useRouter()
    const currentRoute = computed(() => router.currentRoute.value.name)
    return {
      stiStore,
      currentRoute,
      logout
    }
  }
})
</script>
