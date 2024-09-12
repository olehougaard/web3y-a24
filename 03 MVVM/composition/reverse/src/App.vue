<script setup lang="ts">
  import { ref, computed } from 'vue'

  const reverse = (s: string) => s.split("").reverse().join("")

  const s = ref("reverse")
  const reversed = computed({ 
    get(): string { return reverse(s.value)},
    set(v: string): void { s.value = reverse(v) }
  })
</script>

<template>
  <div id='base'>
    <input v-model='s' id='normal'>
    <input v-model='reversed' id='reversed'>
  </div>
</template>
