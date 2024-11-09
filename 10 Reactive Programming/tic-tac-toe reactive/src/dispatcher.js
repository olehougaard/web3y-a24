export const server_dispatch = action => {
  switch(action.type) {
    case 'concede': {
      const winner  = action.player === 'X' ? 'O' : 'X'
      return { ...action, winner }
    }
    default:
      return action
  }
}

export const create_action = server_msg => {
  if (server_msg.games)
    return { type: 'new-games', ...server_msg }
  else if (server_msg.moves)
    return { type: 'make-moves', ...server_msg }
  else
    return { type: 'reset', game: server_msg }
}
