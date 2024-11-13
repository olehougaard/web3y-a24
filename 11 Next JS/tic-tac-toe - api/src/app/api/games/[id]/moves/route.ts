import { endpoint, post } from "@/lib/callserver"
import { Move } from "@/lib/model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, {params}: { params: Promise<{id: string}>}): Promise<NextResponse<unknown>> {
  const { id } = await params
  const body = await request.json()
  return post<Move, unknown>(endpoint + '/' + id + '/moves', body)
}
