'use client'

import { Game } from "@/lib/model"
import { useEffect, useState } from "react"
import * as api from "@/lib/api"
import { useRouter } from "next/navigation"


export const GamesList = ({games: games_}: {games: Game[]}) => {
  const [games, setGames] = useState(games_)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9090/publish')
    ws.onopen = () => {
      ws.send(JSON.stringify({type: 'subscribe', key: 'new_game'}))
    }
    ws.onmessage = ({data}) => {
      const {message: newGame}: { message: Game} = JSON.parse(data)
      setGames([...games, newGame])
    }    
    return () => ws.close()
  })

  const router = useRouter()

  const join = async (gameNumber: number) => {
    await api.joinGame(gameNumber)
    router.push(`/play/${gameNumber}?player=O`)
  }

  return (<div>
    {
      games.map(({gameNumber, gameName}) => 
        <div key={gameNumber}>
          <button className = 'join' onClick = {() => {join(gameNumber)}}>
            Join
          </button>
          {gameName}
        </div>)
    }
  </div>)
}