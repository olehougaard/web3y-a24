import { Game, otherPlayer, Player } from "./model";
import { Dispatch, GetState, lobbySlice, gameSlice } from "./store"
import { NavigateFunction } from 'react-router'
import * as api from "./api";
import subscriber from "./subscriber"
import { filter, map, tap } from "rxjs";

type Thunk = (dispatch: Dispatch, getState: GetState) => Promise<void>

const sub = subscriber('ws://localhost:9090/publish')

export function initThunk(dispatch: Dispatch, _: GetState) {
    api.readGamesList()
        .then(lobbySlice.actions.init)
        .then(dispatch)
        .catch(console.error)
}

export function leaveGameThunk(navigate: NavigateFunction) {
    return async function (dispatch: Dispatch, _: GetState) {
        navigate("/")
        dispatch(gameSlice.actions.leaveGame())
        const games = await api.readGamesList()
        dispatch(lobbySlice.actions.init(games))
    }
}

export async function gamesListenerThunk(dispatch: Dispatch, getState: GetState) {
  sub.subscribeToNewGames().pipe(
    map(newGame => [...getState().lobby, newGame]),
    map(lobbySlice.actions.init)
  ).subscribe(dispatch)
}    

function waitForOtherPlayer(game: Game, dispatch: Dispatch, getState: GetState, navigate: NavigateFunction) {
  sub.subscribeToPlayerJoining(game).pipe(
    map(game => ({player: getState().game.player, game})),
    map(gameSlice.actions.setGame)
  ).subscribe( action => {
    dispatch(action)
    waitForMove(game, action.payload.player, dispatch, getState)
    navigate("/playing")
  })
}

export function newGameThunk(navigate: NavigateFunction, name?: string) {
    return async function(dispatch: Dispatch, getState: GetState) {
        const game = await api.createGame(name)
        dispatch(gameSlice.actions.newGame({player: 'X', game}))
        waitForOtherPlayer(game, dispatch, getState, navigate)
        navigate('/waiting')
    }
}

function waitForMove(game: Game, expectedPlayer: Player, dispatch: Dispatch, getState: GetState) {
  sub.subscribeToMoves(game, expectedPlayer).pipe(
    filter(({type}) => type === 'move'),
    filter(({inTurn}) => inTurn === expectedPlayer),
    map(m => gameSlice.actions.makeMove(m as any))
  ).subscribe(dispatch)
  sub.subscribeToMoves(game, expectedPlayer).pipe(
    filter(({type}) => type === 'conceded'),
    map(m => gameSlice.actions.setGame({player:getState().game.player, game: m as Game}))
  ).subscribe(dispatch)
}


export function joinGameThunk(gameNumber: number, navigate: NavigateFunction): Thunk {
    return async function(dispatch: Dispatch, getState: GetState) {
        const game: Game = await api.joinGame(gameNumber)
        dispatch(gameSlice.actions.setGame({player: 'O', game}))
        waitForMove(game, 'O', dispatch, getState)
        navigate('/playing')
    }
}

export function makeMoveThunk(x: number, y: number): Thunk {
    return async function(dispatch: Dispatch, getState: GetState) {
        const state = getState()
        const {mode, game: { gameNumber }, player} = state.game
        if (mode === 'playing') {
            const payload = await api.createMove(gameNumber, {x, y, player})
            dispatch(gameSlice.actions.makeMove(payload))
        }
    }
}

export const concedeThunk: Thunk = async (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const {mode, player, game: {gameNumber}} = state.game
  if (mode === 'playing') {
      const game = await api.concede(gameNumber)
      dispatch(gameSlice.actions.setGame({player, game}))
  }
}
