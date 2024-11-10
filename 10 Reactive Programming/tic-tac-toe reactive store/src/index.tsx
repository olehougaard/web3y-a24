import './index.css';
import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { View } from './view'
import { init_state, reducer, State } from './store'
import { map, mergeMap, scan } from 'rxjs';
import { actionSource, dispatch, dispatchThunk } from './dispatch';
import { gamesListenerThunk, initThunk } from './thunks';

const view = (state: State) => <View state={state}/>

const render = (elm: JSX.Element) => ReactDOM.render(elm, document.getElementById('root'))

actionSource.pipe(
  mergeMap(dispatchThunk),
  scan(reducer, init_state),
  map(view),
).subscribe(render)

render(view(init_state))
dispatch(initThunk)
dispatch(gamesListenerThunk)
