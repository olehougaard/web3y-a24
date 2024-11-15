import { getGame, updateGame } from "@/lib/server/persistence"
import { sendMessage, websocket } from "@/lib/server/websocket"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, {params}: { params: Promise<{id: string}>}): Promise<NextResponse<unknown>> {
  const { id } = await params
  const game = await getGame(parseInt(id))
  if (!game)
    return new NextResponse('Not found', { status: 404 })
  if (!game.ongoing)
    return new NextResponse('Not ready', { status: 403 })
  const body = await request.json()
  const ws = await websocket()
  if (body.conceded) {
    const { player } = body
    const conceded = await updateGame(game.gameNumber, game.conceded())
    sendMessage(ws, 'move_' + game.gameNumber, { type: 'conceded', move: { player }, ...conceded})
    return NextResponse.json(conceded)
  } else {
    const { x, y, player } = body
    if (player !== game.inTurn || !game.legalMove(x, y))
      return new NextResponse('Not legal', { status: 403 })
    const afterMove = await updateGame(game.gameNumber, game.makeMove(x, y))
    if (!afterMove)
      return new NextResponse('Internal Server Error', { status: 500 })
    const {inTurn, winState, stalemate} = afterMove
    sendMessage(ws, 'move_' + game.gameNumber, {type: 'move', move: body, inTurn, winState, stalemate})
    return NextResponse.json({ move: body, inTurn, winState, stalemate })
  }
}
