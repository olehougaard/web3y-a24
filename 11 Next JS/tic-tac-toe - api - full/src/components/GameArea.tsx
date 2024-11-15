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

  const applyMoveMessage = ({ move, ...props }: MoveMessage, game: Game) => {
    return {...model.makeMove(game, move), ...props}
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9090/publish')
      
    ws.onopen = () => {
      ws.send(JSON.stringify({type: 'subscribe', key: 'move_' + game.gameNumber}))
      ws.onmessage = ({data}) => {
        const {message}: {message: MoveMessage} = JSON.parse(data)
        setGame((game: Game) => applyMoveMessage(message, game))
      }
    }

    return () => { 
      if (ws.readyState === WebSocket.OPEN) 
        ws.close() 
    }

  }, [game.gameNumber])

  async function makeMove(x: number, y:number) {
    await api.createMove(game.gameNumber, {x, y, player})
  }

  async function concede() {
    const newGame = await api.concede(game.gameNumber)
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