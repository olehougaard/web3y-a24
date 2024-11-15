import { createGame, getGames } from '@/lib/server/persistence'
import { sendMessage, websocket } from '@/lib/server/websocket'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const games = await getGames()
  return NextResponse.json(games.filter(g => !g.ongoing))
}

export async function POST(req: NextRequest) {
  const {gameName} = await req.json()
  const game = await createGame(gameName)
  const ws = await websocket()
  sendMessage(ws, 'new_game', game)
  return NextResponse.json(game)
}
