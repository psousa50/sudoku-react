import React from "react"
import * as SudokuSolver from "../sudoku-core/Solver"
import * as Sudoku from "../sudoku-core/Sudoku"
import { SudokuBoardView } from "./SudokuBoard"
import { shuffle } from "../sudoku-core/utils"
import { Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "30%",
    marginRight: "30%",
    alignItems: "center",
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    display: "flex",
    margin: 20,
    justifyContent: "space-between",
  },
  button: {
    margin: 10,
  },
})

export const SudokuGameView = () => {
  const classes = useStyles()
  
  const [board, setBoard] = React.useState<Sudoku.Board | undefined>()
  const [startBoard, setStartBoard] = React.useState<Sudoku.Board | undefined>()

  const startGame = () => {
    const validBoard = SudokuSolver.createBoard({ boxWidth: 4, boxHeight: 4 })
    const allCells = Sudoku.allCellsPos(validBoard)
    const cellsToRemove = shuffle(allCells).slice(0, Math.max(1, allCells.length * .5))
    const puzzle = cellsToRemove.reduce((acc, cell) => Sudoku.clearCell(acc)(cell), validBoard)

    setBoard(puzzle)
    setStartBoard(puzzle)
  }

  const notifications = async (solverState: SudokuSolver.SolverState) => {
    setBoard(solverState.board)
  }

  const solve = () => {
    if (board) {
      const result = SudokuSolver.solveBoard(board, { notifications })

      setBoard(result.board)
    }
  }

  return (
    <div className={classes.container}>
      <h2>Sudoku</h2>
      <div className={classes.buttons}>
        <Button className={classes.button} variant="contained" color="primary" onClick={startGame}>
          {"START"}
        </Button>
        <Button className={classes.button} variant="contained" color="secondary" onClick={solve}>
          {"SOLVE"}
        </Button>
      </div>
      {board && startBoard ? <SudokuBoardView board={board} startBoard={startBoard} /> : null}
    </div>
  )
}
