import { filter, map, Observable, share, take, tap } from 'rxjs'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { Game, Move, Player } from './model'

export type MoveMessage = 
    { type: 'move', move: Move, inTurn: Player, winState: { winner: Player, row?: any }, stalemate: boolean }
  | { type: 'conceded'} & Game

export default (url: string) => {
  const ws: WebSocketSubject<any> = webSocket(url)

  function gameSubscription(key: string): Observable<Game> {
    ws.next({type: 'subscribe', key})
    return ws.pipe(
      filter(({topic}) => topic === key),
      map(({message}) => message as Game),
      share()
    )
  }

  function subscribeToNewGames(): Observable<Game> {
    return gameSubscription('new_game')
  }

  function subscribeToPlayerJoining(game: Game): Observable<Game> {
    return gameSubscription('game_' + game.gameNumber)
      .pipe(
        filter(game => game.ongoing),
        take(1),
        share()
      )
  }

  function subscribeToMoves(game: Game, player: Player): Observable<MoveMessage> {
    const key = 'move_' + game.gameNumber
    ws.next({type: 'subscribe', key})
    return ws.pipe(
      filter(({topic}) => topic === key),
      map(({message}) => message as MoveMessage),
      filter(move => move.inTurn === player),
      share()
    )
  }

  return { subscribeToNewGames, subscribeToPlayerJoining, subscribeToMoves }
}