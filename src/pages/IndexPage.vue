<template>
  <q-page class="q-pa-md bg-white col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
    <DetailSTI />
    <InputScanSTI />
    <ListScanned />
  </q-page>
</template>

<script lang="ts">
import DetailSTI from './update-sti/DetailSTI.vue'
import InputScanSTI from 'pages/update-sti/InputScanSTI.vue'
import ListScanned from 'pages/update-sti/ListScanned.vue'
import { defineComponent, onMounted } from 'vue'
import { useAuthStore } from 'stores/auth-store'

export default defineComponent({
  name: 'IndexPage',
  components: { DetailSTI, InputScanSTI, ListScanned },
  setup () {
    onMounted(() => {
      const { checkLogin } = useAuthStore()
      checkLogin()
    })
    return { }
  }
})
</script>
