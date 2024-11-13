'use client'

import { Game } from "@/lib/model"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const Waiting = ({id, name}: {id: number, name: string}) => {
  const router = useRouter()

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9090/publish')
    ws.onopen = () => {
      ws.send(JSON.stringify({type: 'subscribe', key: 'game_' + id}))
    }
    ws.onmessage = ({data}) => {
      const {message: game}: { message: Game} = JSON.parse(data)
      if (game.ongoing) {
        router.replace(`/play/${id}?player=X`)
      }
    }    
    return () => ws.close()
  })

return <div>
    <h2>Waiting on opponent for game {name}</h2>
  </div>
}
