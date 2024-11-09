export function pre_game_state({ games }) {
    return { games, 
             accept: ({ visit_pre_game }) => { if (visit_pre_game) return visit_pre_game({ games }) }
    }
}

export function game_state({ player, game }) {
    return { player, game,
             accept: ({ visit_game }) => { if (visit_game) return visit_game({ player, game }) }
    }
}

export function apply_move(game, {x, y, player}) {
    if (x === undefined && y === undefined)
        return game
    else {
        const board = game.board.slice()
        board[x] = board[x].slice()
        board[x][y] = player
        return Object.assign({}, game, { board })
    }
}

