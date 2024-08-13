function double(n: number | undefined) {
  if (n === undefined) {
    return undefined
  }
  return n * 2
}

// Problem with union of objects
type LoadingState = { percentComplete: number }
type FailedState = { statusCode : number }
type OkState = { payload: number[] }

type State = LoadingState | FailedState | OkState

function reportState(state: State) {
  if (state.percentComplete !== undefined) {
    console.log(`Loading ${state.percentComplete}% done`)
  } // And so on
}
