<template>
  <div class="row q-col-gutter-md">
    <div class="col-12">
      <div class="text-bold text-body1">Hi, {{ authStore.name }}</div>
    </div>
    <div class="col-12">
      <FieldWrapper label="Tanggal" :value="formattedDateToday" />
    </div>
    <div class="col-6">
      <FieldWrapper label="Total STT" :value="stiStore.totalStt" />
    </div>
    <div class="col-6">
      <FieldWrapper label="Total Koli" :value="stiStore.totalPieces" />
    </div>
  </div>
</template>

<script lang="ts">
import FieldWrapper from 'components/FieldWrapper.vue'
import {
  defineComponent
} from 'vue'
import { useStiStore } from 'stores/sti-store'
import { date } from 'quasar'
import { useAuthStore } from 'stores/auth-store'

export default defineComponent({
  name: 'DetailSTI',
  components: { FieldWrapper },
  setup () {
    const stiStore = useStiStore()
    const authStore = useAuthStore()
    const formattedDateToday = date.formatDate(Date.now(), 'DD MMMM YYYY')
    return {
      stiStore,
      formattedDateToday,
      authStore
    }
  }
})
</script>
