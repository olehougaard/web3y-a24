import { GamesList } from "@/components/GamesList";
import { CreateGame } from "@/components/CreateGame";
import * as api from "@/lib/api"

export default async function Home() {
  const games = await api.readGamesList()
  return <div>
    <h2>Lobby</h2>
    <h3>Available Games</h3>
    <GamesList games={games}/>
    <CreateGame/>
  </div>
}
