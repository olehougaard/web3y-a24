import { Game, Move, Player } from "./model"

const endpoint = 'http://localhost:3000/api/games'

const callApi = async <Return>(url: string, init: RequestInit = {}): Promise<Return> => {
  try {
    const response = await fetch(url, { ...init, headers: {...init.headers, 'Accept': 'application/json', 'Content-Type': 'application/json'}})
    if (response.ok) {
      return response.json()
    } else {
      return Promise.reject<Return>(response.statusText)
    }
  } catch (e: any) {
    console.error(e.stack)
    throw e
  }
}

const read = async <Return>(url: string): Promise<Return> => callApi<Return>(url)
const create = async <Body,Return>(url: string, body: Body): Promise<Return> => callApi<Return>(url, {method: 'POST', body: JSON.stringify(body)})
const patchGame = async (gameNumber: number, body: Partial<Game>): Promise<Game> => callApi<Game>(`${endpoint}/${gameNumber}`, {method: 'PATCH', body: JSON.stringify(body)})

export type GetMoveResponse = { moves: Move[], inTurn: Player, winState: { winner: Player, row?: any }, stalemate: boolean }

export const readGamesList = () => read<Game[]>(endpoint)
export const readGame = (gameNumber: number) => read<Game>(endpoint + '/' + gameNumber)

export const createGame = (gameName: string) => create<{gameName: string}, Game>(endpoint, { gameName })
export const createMove = (gameNumber: number, move: Move) => create<Move, {move: Move} & Partial<Game>>(`${endpoint}/${gameNumber}/moves`, move)

export const joinGame = (gameNumber: number) => patchGame(gameNumber, {ongoing: true})
export const concede = (gameNumber: number) => create<{conceded: boolean}, Game>(`${endpoint}/${gameNumber}/moves`, { conceded: true})
