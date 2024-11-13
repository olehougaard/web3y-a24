'use client'

import { Game, Player } from "@/lib/model"
import { useEffect, useState } from "react"
import { GameBoard } from "./GameBoard"
import * as api from "@/lib/api"
import * as model from "@/lib/model"
import { useRouter } from "next/navigation"

type MoveMessage = {move: model.Move} & Partial<Game>

export const GameArea = ({game: game_, player}: {game: Game, player: Player}) => {
  const [game, setGame] = useState(game_)
  const router = useRouter()

  function applyMoveMessage({ move, ...props }: MoveMessage) {
    const newGame = {...model.makeMove(game, move), ...props}
    setGame(newGame)
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9090/publish')
    ws.onopen = () => {
      ws.send(JSON.stringify({type: 'subscribe', key: 'move_' + game.gameNumber}))
    }
    ws.onmessage = ({data}) => {
      const {message}: { message: MoveMessage} = JSON.parse(data)
      applyMoveMessage(message)
    }    
    return () => ws.close()
  })

  async function makeMove(x: number, y:number) {
    const message = await api.createMove(game.gameNumber, {x, y, player})
    applyMoveMessage(message)
  }

  async function concede() {
    console.log('concede')
    const newGame = await api.concede(game.gameNumber)
    console.log(newGame)
    setGame(newGame)
  }

  function returnToLobby() {
    router.push("/")

  }

  const gameOver = Boolean(game.winState) || game.stalemate
  const inTurn = !gameOver && game.inTurn === player

  const title = gameOver? `${game.gameName} finished` : `Playing ${game.gameName}`
  const message = inTurn? `Your turn, ${player}` : 'Waiting for other player'
  const gameOverMessage = game.winState? `${game.winState.winner} won` : `Stalemate`

  return <div>
    <h2>{title}</h2>
    {!gameOver && <h2>{ message }</h2>}
    {gameOver && <h2>{ gameOverMessage }</h2>}
    <div>
      <GameBoard enabled = {inTurn} board={game.board} makeMove={makeMove}/>
    </div>
    {inTurn && <button onClick = {concede}>Concede game</button>}
    {gameOver && <button onClick={returnToLobby}>Return to Lobby</button>}
  </div>
}