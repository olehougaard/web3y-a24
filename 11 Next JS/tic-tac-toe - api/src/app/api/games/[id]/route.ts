import { endpoint, get, patch } from "@/lib/callserver";
import { Game } from "@/lib/model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, {params}: { params: Promise<{id: string}>}): Promise<NextResponse<Game>> {
  const { id } = await params
  return get<Game>(endpoint + '/' + id)
}

export async function PATCH(request: NextRequest, {params}: { params: Promise<{id: string}>}): Promise<NextResponse<Game>> {
  const { id } = await params
  const body = await request.json()
  return patch<Game, Game>(endpoint + '/' + id, body)
}
