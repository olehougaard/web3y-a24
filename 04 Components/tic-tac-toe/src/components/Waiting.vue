<script setup lang="ts">
  import type { Game, Player } from '@/api/model'
  import * as api from '@/api/api'
  import type { PropType } from 'vue'
  import { defineProps, defineEmits, onMounted } from 'vue'

  const props = defineProps<{
    player: Player,
    game: Game
  }>()

  const emit = defineEmits(['gameStarted'])

  async function waitForPlayer() {
    const game = await api.readGame(props.game.gameNumber)
    if (game.ongoing)
      emit('gameStarted')
    else 
      setTimeout(waitForPlayer, 100)
  }

  onMounted(waitForPlayer)
</script>

<template>
  <h1>Waiting for other player...</h1>
</template>
