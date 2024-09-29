<script setup lang="ts">
  import type { Game } from '@/api/model'
  import { computed, defineEmits, onMounted, onUnmounted } from 'vue'
  import * as api from '@/api/api'
  import BoardView from '@/components/Board.vue'
  import { store } from '@/api/store'
  const model = store()

  console.log(model.player)
  
  const enabled = computed(() => model.player === model.game.inTurn)

  let emit = defineEmits({
    gameFinished(game: Game) {
      return game.stalemate || game.winState
    }
  })

  const board = computed(() => model.game.board ?? [[]])


  async function makeMove(x: number, y: number) {
    if (enabled.value) {
      await api.createMove(model.game.gameNumber!, {x, y, player: model.player!})
    }
  }

  const ws = new WebSocket('ws://localhost:9090/publish')

  onMounted(() => { 
    ws.onopen = () => ws.send(JSON.stringify({type: 'subscribe', key: 'move_' + model.game.gameNumber}))
    ws.onmessage = ({data}) => {
      const {message: response} = JSON.parse(data)
      if (response.type === 'conceded') {
        const {type, ...game_data} = response
        model.applyGameProperties(game_data)
      } else {
        const {type, move, ...game_data} = response
        model.makeMove(move)
        model.applyGameProperties(game_data)
      } 
    }    
  })
  onUnmounted(() => { 
    ws.send(JSON.stringify({type: 'unsubscribe'}))
    ws.close()
  })

  async function concede() {
    const {winState} = await api.concede(model.game.gameNumber!)
    model.applyGameProperties({winState})
  }

</script>

<template>
  <div id = 'game'>
    <p id = 'messages' v-if='enabled'>Your turn, {{ model.player }}</p>
    <p id = 'messages' v-else='enabled'>Waiting for other player to move...</p>
    <board-view :enabled='enabled' :board='board' @click='makeMove'/>
    <button v-if="enabled" @click="concede">Concede</button>
  </div>
</template>
