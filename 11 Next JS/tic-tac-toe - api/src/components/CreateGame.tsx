"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import * as api from "@/lib/api"

export const CreateGame = () => {
  const [ name, setName ] = useState('Name')
  const router = useRouter()
  const createGame = async () => {
    const game = await api.createGame(name)
    router.push(`/waiting/${game.gameNumber}?name=${name}`)
  }

  return (<div>
    <input type='text' onChange={e => setName(e.target.value)}/>
    <button id='new' onClick={createGame}>Create Game</button>
  </div>)
}
