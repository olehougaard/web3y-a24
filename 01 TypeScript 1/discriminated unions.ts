type LoadingState = { status: 'loading', percentComplete: number }
type FailedState = { status: 'failed', statusCode : number }
type OkState = { status: 'ok', payload: number[] }

type State = LoadingState | FailedState | OkState

function reportState(state: State) {
  if (state.status === 'loading') {
    console.log(`Loading ${state.percentComplete}% done`)
  } // And so on
}

type FinishedState = State & { status: 'failed' | 'ok' }

/*
Or: 
type FinishedState = State & { 
    status: FailedState['status'] | OkState['status']
}

But at this point, I'd probably just use FailedState | OkState
*/

type Status = State['status']

