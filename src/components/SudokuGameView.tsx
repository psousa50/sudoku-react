import React from "react"
import { Sudoku, SudokuModels, Solver, SolverModels, utils, Constraints, helpers } from "../sudoku-core"
import { SudokuBoardView } from "./SudokuBoardView"
import { Button, Checkbox } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { magicSquareboard, big4x4 } from "../puzzles"

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

  const [startBoard, setStartBoard] = React.useState<SudokuModels.Board | undefined>()
  const [solverState, setSolverState] = React.useState<SolverModels.SolverState | undefined>()
  const [continuous, setContinuous] = React.useState(false)
  const [time, setTime] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (continuous && solverState && solverState.outcome === SolverModels.Outcomes.unknown) {
        setSolverState(s => (s ? Solver.nextStep(s) : s))
      }
    }, 10)
    return () => clearTimeout(timer)
  })

  const startGame = () => {
    // const puzzle = big4x4
    const board = Solver.createBoard({ boxWidth: 4, boxHeight: 3 }).board
    const allCells = Sudoku.allCellsPos(board)
    const cellsToRemove = utils.shuffle(allCells).slice(0, Math.max(1, allCells.length * 0.6))
    const puzzle = cellsToRemove.reduce((acc, cell) => Sudoku.clearCell(acc)(cell), board)

    setStartBoard(puzzle)
    setSolverState(Solver.startSolveBoard(puzzle))
  }

  const solve = () => {
    if (startBoard) {
      setSolverState(undefined)

      const t1 = Date.now()
      const result = Solver.solveBoard(startBoard)
      const t2 = Date.now()
      setTime(t2 - t1)

      setSolverState(result)
    }
  }

  const nextStep = () => {
    if (solverState) {
      setSolverState(Solver.nextStep(solverState))
    }
  }

  const undoStep = () => {
    if (solverState) {
      setSolverState(Solver.undoStep(solverState))
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
        <Button className={classes.button} variant="contained" color="secondary" onClick={nextStep}>
          {"NEXT STEP"}
        </Button>
        <Button className={classes.button} variant="contained" color="secondary" onClick={undoStep}>
          {"UNDO STEP"}
        </Button>
        <Checkbox value={continuous} onChange={event => setContinuous(event.target.checked)} />
      </div>
      {startBoard && solverState ? (
        <SudokuBoardView startBoard={startBoard} solverState={solverState} />
      ) : null}
      {solverState && <div>{time}</div>}
    </div>
  )
}
