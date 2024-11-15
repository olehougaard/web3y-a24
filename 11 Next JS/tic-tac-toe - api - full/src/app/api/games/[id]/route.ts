import { getGame, startGame } from "@/lib/server/persistence";
import { sendMessage, websocket } from "@/lib/server/websocket";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, {params}: { params: Promise<{id: string}>}) {
  const { id } = await params
  const game = await getGame(parseInt(id))
  if (!game)
    return new NextResponse('Not found', { status: 404 })
  return NextResponse.json(game)
}

export async function PATCH(request: NextRequest, {params}: { params: Promise<{id: string}>}) {
  const { id } = await params
  const game = await getGame(parseInt(id))
  if (!game)
    return new NextResponse('Not found', { status: 404 })
  const { ongoing } = await request.json()
  if (ongoing) {
    if (game.ongoing)
      return new NextResponse('Attempt to restart', { status: 403 })
    const started = await startGame(game)
    const ws = await websocket()
    sendMessage(ws, 'game_starting', started)
    sendMessage(ws, 'game_' + started?.gameNumber, started)
    return NextResponse.json(started)
  }
}
