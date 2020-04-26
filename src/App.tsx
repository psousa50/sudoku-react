import React from "react"
import * as SudokuSolver from "./sudoku-core/Solver"
import { SudokuBoardView } from "./components/SudokuBoard"

function App() {
  const board = SudokuSolver.createBoard({ boxWidth: 3, boxHeight: 3 })

  return <SudokuBoardView board={board} />
}

export default App
