import { createApp } from 'vue'
import * as VueRouter from 'vue-router'
import App from './App.vue'
import * as api from '@/api/api'
import {useRouter} from 'vue-router'

import LobbyView from '@/components/Lobby.vue'
import WaitingView from '@/components/Waiting.vue'
import GameView from '@/components/Game.vue'

const routes = [
  { path: '/', component: LobbyView },
  { path: '/waiting/:gameNumber', component: WaitingView },
  { path: '/playing/:gameNumber', component: GameView}
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})
  
const app = createApp(App)
app.use(router)
app.provide('api', api)
app.provide('useRouter', useRouter)
app.mount('#app')
