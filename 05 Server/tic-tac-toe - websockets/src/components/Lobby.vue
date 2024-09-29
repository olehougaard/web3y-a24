<script setup lang="ts">
  import * as api from '@/api/api'
  import { ref, onMounted, onUnmounted } from 'vue'
  import { store } from '@/api/store'
  import type {Game} from '@/api/model'

  const model = store()

  onMounted(async () => { 
    model.games = await api.readGamesList()
    
    const ws = new WebSocket('ws://localhost:9090/publish')
    ws.onopen = () => {
      ws.send(JSON.stringify({type: 'subscribe', key: 'new_game'}))
      ws.send(JSON.stringify({type: 'subscribe', key: 'game_starting'}))
    }
    ws.onmessage = ({data}) => {
        console.log(data)
        const {topic, message: game} = JSON.parse(data)
        switch(topic) {
          case 'new_game':
            model.games.push(game)
            break
          case 'game_starting':
            model.games = model.games.filter(g => g.gameNumber != game.gameNumber)
        }
    }    

    onUnmounted(() => { 
      ws.send(JSON.stringify({type: 'unsubscribe', key: 'new_game'}))
      ws.close()
    })
  })

  const gameName = ref('game')

  async function newGame() {
    const game = await api.createGame(gameName.value)
    model.waitForPlayer('X', game)
  }

  async function join(gameNumber: number) {
    const game = await api.joinGame(gameNumber)
    model.startGame('O', game)
  }
</script>

<template>
  <div v-for="game in model.games">{{game.gameName}} <button @click="join(game.gameNumber)">Join</button></div>
  <input type="text" v-model="gameName"/> <button @click="newGame()">Create</button>
</template>
