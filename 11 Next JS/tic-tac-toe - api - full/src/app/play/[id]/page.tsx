import { GameArea } from "@/components/GameArea"
import * as api from "@/lib/api"
import { Player } from "@/lib/model"

export default async function Page({params, searchParams}: {params: any, searchParams: Promise<{player: Player}>}) {
  const {id} = await params
  if (isNaN(parseInt(id))) return <div></div>
  const game = await api.readGame(parseInt(id))
  const player = (await searchParams).player
  return <GameArea game={game} player={player}/>
}
