import { endpoint, get, post } from '@/lib/callserver'
import { Game } from '@/lib/model'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<Game[]>> {
  return get<Game[]>(endpoint)
}

export async function POST(req: NextRequest) {
  const game = await req.json()
  return post<Game, Game>(endpoint, game)
}
