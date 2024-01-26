<template>
  <div class="text-grey-7 text-body1">
    {{ label }}
  </div>
  <div class="text-body1">
    {{ value }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    }
  }
})
</script>
