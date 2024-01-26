<template>
  <q-dialog v-model="scannerOpen" seamless position="top">
    <q-card bordered style="min-width: 350px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Scanner</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="toggleScanner" v-close-popup />
      </q-card-section>
      <q-card-section>
        <ScanditScanner @scan="onProcessByScan" v-if="scannerOpen" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-input
    :autofocus="true"
    v-model="valueInput"
    @keydown.enter="onProcessByInput(valueInput)"
    label="Masukkan No. STT / Scan Barcode"
  >
    <template v-slot:prepend>
      <q-icon @click="toggleScanner" name="qr_code_scanner" />
    </template>
  </q-input>
</template>

<script lang="ts">
import {
  defineComponent, ref
} from 'vue'
import { useStiStore } from 'stores/sti-store'
import ScanditScanner from 'components/ScanditScanner.vue'

export default defineComponent({
  name: 'InputScanSTI',
  components: {
    ScanditScanner
  },
  setup () {
    const valueInput = ref('')
    const { scanShipment } = useStiStore()
    const scannerOpen = ref(false)
    function toggleScanner () {
      scannerOpen.value = !scannerOpen.value
    }
    async function onProcessByScan (value: string) {
      await scanShipment(value, true)
      valueInput.value = ''
    }
    async function onProcessByInput (value: string) {
      await scanShipment(value)
      valueInput.value = ''
    }
    return { valueInput, onProcessByScan, onProcessByInput, toggleScanner, scannerOpen }
  }
})
</script>
