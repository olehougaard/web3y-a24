import { game_state, apply_move, pre_game_state } from './model'

export function reduce(state, action) {
    console.log(action)
    switch (action.type) {
        case 'new':
            return { ...state, player: 'X' }
        case 'join':
            return { ...state, player: 'O' }
        case 'new-games': 
            return state.accept({ visit_pre_game : () => pre_game_state(action), visit_game : s => game_state(s) })
        case 'make-moves': {
            const {moves, inTurn, winner, stalemate} = action
            const { game, player } = state
            return game_state({ 
                game: Object.assign(moves.reduce(apply_move, game), 
                                    {inTurn, winner, stalemate}), 
                player })
        }
        case 'reset':
            const { player } = state
            const { game } = action
            return game_state({player, game})
        default:
            return state
    }
}
