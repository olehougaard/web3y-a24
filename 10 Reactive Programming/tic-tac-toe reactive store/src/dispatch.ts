import { Action } from "@reduxjs/toolkit";
import { createContext } from "react";
import { Observable, of, Subject } from "rxjs";
import { State } from "./store";

export type Thunk = () => Observable<Action>

export const actionSource = new Subject<Thunk | Action>()

export const dispatch = (actionThunk: Thunk | Action) => actionSource.next(actionThunk)

export const dispatchThunk = (actionThunk: Action | Thunk): Observable<Action> => {
  if (typeof actionThunk === 'function')
    return actionThunk()
  else
    return of(actionThunk)
}

export const DispatchContext = createContext<typeof dispatch>(dispatch)
export const SelectorContext = createContext<<T>(f: (s: State) => T) => T>(null)
