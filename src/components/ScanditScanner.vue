<template>
  <div id="scandit-barcode-picker" style="max-width: 1280px; max-height: 80%;"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import * as ScanditSDK from 'scandit-sdk'

export default defineComponent({
  name: 'ScanditScanner',
  emits: ['scan'],
  setup (props, { emit }) {
    const barcodePickerComponent = ref(null as any)
    onMounted(async () => {
      await ScanditSDK.configure(import.meta.env.VITE_APP_SCANDIT_LICENSE_KEY, {
        engineLocation: 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/'
      })
      ScanditSDK.BarcodePicker.create(document.getElementById('scandit-barcode-picker') || new HTMLElement(), {
        playSoundOnScan: true,
        vibrateOnScan: true,
        enableCameraSwitcher: false
      }).then((barcodePicker) => {
        barcodePickerComponent.value = barcodePicker
        const scanSettings = new ScanditSDK.ScanSettings({
          enabledSymbologies: [
            ScanditSDK.Barcode.Symbology.CODE128,
            ScanditSDK.Barcode.Symbology.EAN13,
            ScanditSDK.Barcode.Symbology.EAN8
          ],
          codeDuplicateFilter: 1000, // Minimum delay between duplicate results
          blurryRecognition: true,
          gpuAcceleration: true,
          maxNumberOfCodesPerFrame: 5
        })
        barcodePicker.applyScanSettings(scanSettings)
        barcodePicker.on('scan', (scanResult) => {
          for (let i = 0; i < scanResult.barcodes.length; i++) {
            const result = scanResult.barcodes[i].data
            emit('scan', result)
          }
        })
      }).catch((err) => {
        console.log(err)
      })
    })
    onUnmounted(() => {
      try {
        barcodePickerComponent.value.accessCamera = false
        barcodePickerComponent.value.destroy()
      } catch (err) {
        console.log(err)
      }
    })
  }
})
</script>
