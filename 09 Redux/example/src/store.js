import { configureStore } from '@reduxjs/toolkit'

const initState = {
  sum: 0
}

function reduce({sum} = initState, action) {
  switch(action.type) {
    case 'add':
      const addend = action.payload
      return { sum: sum + addend}
    case 'reset':
      return initState
    default:
      return {sum}
  }
}

export const store = configureStore({reducer: reduce})
