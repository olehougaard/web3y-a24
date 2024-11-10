import { Game, GameState, Player } from "./model";
import { lobbySlice, gameSlice, MakeMovePayload } from "./store"
import { NavigateFunction } from 'react-router'
import * as api from "./api";
import subscriber from "./subscriber"
import { catchError, concat, filter, from, map, merge, mergeMap, Observable, of, tap } from "rxjs";
import { Thunk } from "./dispatch";
import { Action } from "@reduxjs/toolkit";

const sub = subscriber('ws://localhost:9090/publish')

export const initThunk: Thunk = () => {
  return from(api.readGamesList()).pipe(
    catchError(() => of([]).pipe(tap(console.error))),
    map(lobbySlice.actions.init)
  )
}

export function leaveGameThunk(navigate: NavigateFunction): Thunk {
  return () => {
    navigate("/")
    const leaveGame = of(gameSlice.actions.leaveGame())
    const initLobby = from(api.readGamesList()).pipe(map(lobbySlice.actions.init))
    return merge(leaveGame, initLobby)
  }
}

export const gamesListenerThunk: Thunk = () => {
  return sub.subscribeToNewGames().pipe(
    map(lobbySlice.actions.newGame)
  )
}    

function waitForOtherPlayer(game: Game): Observable<Action> {
  return sub.subscribeToPlayerJoining(game).pipe(
    map(game => ({player: game.inTurn, game})),
    map(gameSlice.actions.setGame)
  )
}

export function newGameThunk(navigate: NavigateFunction, name?: string): Thunk {
  return function() {
    return from(api.createGame(name)).pipe(
      mergeMap(game => 
        concat(
          of({player: 'X', game}).pipe(map(gameSlice.actions.newGame), tap(() => navigate("/waiting"))),
          waitForOtherPlayer(game).pipe(tap(() => navigate("/playing"))),
          listenForMoves(game, 'O')
        )
      )
    )
  }
}

function listenForMoves(game: Game, expectedPlayer: Player): Observable<Action> {
  const moveObserver = sub.subscribeToMoves(game, expectedPlayer).pipe(
    filter(({type}) => type === 'move'),
    map(m => gameSlice.actions.makeMove(m as MakeMovePayload))
  )
  const concedeObserver = sub.subscribeToMoves(game, expectedPlayer).pipe(
    filter(({type}) => type === 'conceded'),
    map(m => gameSlice.actions.setGame({player: expectedPlayer, game: m as Game}))
  )
  return merge(moveObserver, concedeObserver)
}

export function joinGameThunk(gameNumber: number, navigate: NavigateFunction): Thunk {
  return () => {
    return from(api.joinGame(gameNumber)).pipe(
      mergeMap(game => 
        concat(
          of({player: 'O', game}).pipe(map(gameSlice.actions.setGame), tap(()=>navigate('/playing'))),
          listenForMoves(game, 'X')
        )
      )
    )
  }
}

export function makeMoveThunk(x: number, y: number, game: GameState): Thunk {
  return (): Observable<Action> => {
    const {mode, game: { gameNumber }, player} = game
    if (mode === 'playing') {
      return from(api.createMove(gameNumber, {x, y, player})).pipe(map(gameSlice.actions.makeMove))
    } else {
      return of()
    }
  }
}

export const concedeThunk = (gameState: GameState) => () => {
  const {mode, player, game: {gameNumber}} = gameState
  if (mode === 'playing') {
      return from(api.concede(gameNumber, player)).pipe(map(game => gameSlice.actions.setGame({player, game})))
  } else {
    return of()
  }
}
