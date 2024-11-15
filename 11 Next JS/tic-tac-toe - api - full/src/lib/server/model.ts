export type Player = 'X' | 'O'
export type Tile = Player | null
export type Board = Tile[][]

export type Move = {
    conceded: false
    x: number
    y: number
    player: Player
  }
  | {
    conceded: true
    player: Player
  }

const array = <T>(length: number, init: (index: number) => T) => Array.from(new Array(length), (_, i) => init(i))

const updateArray = <T>(a: T[], i: number, f: (e: T, i: number) => T) => a.map((e, j) => (i === j) ? f(e, j) : e)

export type WinState = {
    winner: Player
    row?: {
        x: number
        y: number
    }[]
}

export type GameConfig = {
  board: Board
  inTurn: Player
  gameNumber: number
  gameName: string
  moves: Move[]
  winState?: WinState
}

export type GameDTO = GameConfig & {
    stalemate: boolean
}    

export type Game = GameDTO & {
    legalMove: (x: number, y: number) => boolean
    makeMove: (x: number, y: number) => any
    conceded: () => Game
    data: () => GameConfig
}    

export function createModel({board, inTurn, gameNumber, gameName, moves, winState: preWin}: GameConfig): Game {
    const setTile = (board: Board, x: number, y: number, value: Tile) => updateArray(board, x, row => updateArray(row, y, _ => value))
    
    type Position = {x: number, y: number}

    const row = (x: number, y: number, dx: number, dy: number): Position[] => array(board.length, i => ({x: x + i * dx, y: y + i * dy}))
    const verticalRows = array(board.length, i => row(0, i, 1, 0))
    const horizontalRows = array(board.length, i => row(i, 0, 0, 1))
    const diagonalRows = [row(0, 0, 1, 1), row(0, 2, 1, -1)]
    const allRows = verticalRows.concat(horizontalRows).concat(diagonalRows)
    const plateFull = board.every(row => row.every(x => x))
    
    const hasWon = (theRow: Position[], candidate: Player) =>  theRow.every(({x, y}) => board[x][y] === candidate)
    const winningRow = (candidate: Player) => allRows.find(x => hasWon(x, candidate))
    const getWinner = (candidate: Player) => {
        const w = winningRow(candidate)
        return w && { winner: candidate, row : w }
    }
    const winState = preWin || getWinner('X') || getWinner('O')
    const stalemate = plateFull && !winState
    
    const legalMove = (x: number, y: number) => {
        if (x < 0 || y < 0 || x > 2 || y > 2) return false
        if (board[x][y]) return false
        if (winState || stalemate) return false
        return true
    }
    
    const makeMove = (x: number, y: number) => {
        if (!legalMove(x, y)) throw 'Illegal move'
        return createModel({board: setTile(board, x, y, inTurn), inTurn: (inTurn === 'X') ? 'O' : 'X', gameNumber, gameName, moves: [...moves, {conceded: false, x, y, player: inTurn}]})
    }
    
    const data = () => ({board, inTurn, gameNumber, gameName, moves})

    const conceded = (): Game => {
        const winner: Player = inTurn === 'X'? 'O' : 'X'
        const winState: WinState = { winner, row: undefined}
        const conceded_state: Game = { 
            winState, 
            stalemate: false, 
            inTurn: winner, 
            legalMove: () => false, 
            makeMove: () => conceded_state,
            conceded: () => conceded_state, 
            board, 
            data: () => ({board, inTurn, gameNumber, gameName, moves}), 
            gameNumber, 
            gameName,
            moves: [...moves, { conceded: true, player: inTurn }]
        }
        return conceded_state
    }
    
    return { 
        winState, 
        stalemate, 
        inTurn, 
        legalMove, 
        makeMove,
        conceded, 
        board, 
        data, 
        gameNumber,
        gameName, 
        moves 
    }
}

export const model = (gameNumber: number, gameName: string) => createModel({ 
  board: array(3, _ => array<Tile>(3, _ => null)), 
  inTurn: 'X', 
  gameNumber, 
  gameName, 
  moves: []
})
