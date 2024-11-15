'use client'

import { Board } from "@/lib/model"

export const GameBoard = ({enabled, board, makeMove}: {enabled: boolean, board: Board, makeMove: (x: number, y:number) => Promise<void>}) => {
  return (
    <table>
      <tbody>
        { board.map((row, x) =>
            <tr key={x}>{ row.map((tile, y) => {
              if (tile)
                return <td key = {x + '' + y} className = { tile }/>
              else if (enabled)
                return <td key = {x + '' + y} className = {'blank'} onClick = {() => makeMove(x, y)}/>
              else
              return <td key = {x + '' + y} className = {'inert'}/>
            })
            }</tr>
        )}
      </tbody>
    </table>
  )
}
