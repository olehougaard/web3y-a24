<script lang="ts">
  import { defineComponent } from 'vue'

  const reverse = (s: string) => s.split("").reverse().join("")

  export default defineComponent({ 
    data() {
      return {
        s: "reverse"
      }
    },
    computed: {
      reversed: { 
        get(): string { return reverse(this.s)},
        set(v: string): void { this.s = reverse(v) }
      }
    }
  })
</script>

<template>
  <div id='base'>
    <input v-model='s' id='normal'>
    <input v-model='reversed' id='reversed'>
  </div>
</template>
