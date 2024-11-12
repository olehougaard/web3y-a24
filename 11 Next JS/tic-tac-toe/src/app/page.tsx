import { CreateGame } from "@/components/CreateGame";

export default function Home() {
  return (
    <div>
      <h1>Tic-tac-toe Lobby</h1>
      <h2>Available Games</h2>
      <CreateGame/>
    </div>
  )
}
