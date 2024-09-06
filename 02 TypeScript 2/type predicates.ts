// Problem with union of objects
type LoadingState = { percentComplete: number }
type FailedState = { statusCode : number }
type OkState = { payload: number[] }

type State = LoadingState | FailedState | OkState


function reportStateError(state: State) {
  if ((state as LoadingState).percentComplete !== undefined) {
    
    // The narrowing doesn't work - it's too complex:
    console.log(`Loading ${state.percentComplete}% done`)
  } // And so on
}

function isLoading(state: State): state is LoadingState {
  return (state as LoadingState).percentComplete !== undefined
}

function isFailed(state: State): state is FailedState {
  return (state as FailedState).statusCode !== undefined
}

function isOk(state: State): state is OkState {
  return (state as OkState).payload !== undefined
}

function reportState(state: State) {
  if (isLoading(state)) {
    console.log(`Loading ${state.percentComplete}% done`)
  } // And so on
}
