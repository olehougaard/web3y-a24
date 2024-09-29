<script setup lang="ts">
  import * as api from '@/api/api'
  import { defineProps, onMounted, onUnmounted } from 'vue'
  import { store } from '@/api/store';
  const model = store()

  const props = defineProps<{gameNumber: number}>()

  const ws = new WebSocket('ws://localhost:9090/publish')

  onMounted(() => { 
    ws.onopen = () => ws.send(JSON.stringify({type: 'subscribe', key: 'game_' + props.gameNumber}))
    ws.onmessage = ({data}) => {
      const {message: {ongoing, ...game}} = data
      if (ongoing) model.startGame('X', game)
    }    
  })
  onUnmounted(() => { 
    ws.send(JSON.stringify({type: 'unsubscribe'}))
    ws.close()
  })

  async function waitForPlayer() {
    const game = await api.readGame(props.gameNumber)
    if (game.ongoing)
      model.startGame('X', game)
    else 
      setTimeout(waitForPlayer, 100)
  }

  onMounted(waitForPlayer)
</script>

<template>
  <h1>Waiting for other player...</h1>
</template>
