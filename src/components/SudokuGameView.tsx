import { Button, Checkbox, FormControlLabel } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { hardPuzzle15 } from "../puzzles"
import { Solver, SolverModels, Sudoku, SudokuModels, utils } from "../sudoku-core"
import {
  BoardCellState,
  BoardState,
  OnCellActions,
  SudokuBoardView,
  SudokuBoardViewOptions,
  sudokuBoardViewOptionsDefault,
} from "./SudokuBoardView"

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

const boxWidth = 3
const boxHeight = 3

const createEmptyBoard = () => Sudoku.createBoard({ boxWidth, boxHeight })

const createBoardState = (board: SudokuModels.Board) => {
  const nc = SudokuModels.numberCount(board)
  return new Array(nc).fill(undefined).map(() => new Array(nc).fill({ selected: false }))
}

const createGameViewState = (board: SudokuModels.Board) => ({
  startBoard: board,
  boardState: createBoardState(board),
  solverState: Solver.startSolveBoard(board),
})

interface GameViewState {
  boardState: BoardState
  startBoard: SudokuModels.Board
  solverState: SolverModels.SolverState
}

export const SudokuGameView = () => {
  const classes = useStyles()

  const [selected, setSelected] = React.useState(false)
  const [selecting, setSelecting] = React.useState(false)
  const [options, setOptions] = React.useState<SudokuBoardViewOptions>(sudokuBoardViewOptionsDefault)
  const [gameBoardState, setGameBoardState] = React.useState<GameViewState>(createGameViewState(createEmptyBoard()))
  const [continuous, setContinuous] = React.useState(false)
  const [time, setTime] = React.useState(0)

  const mergeOptions = (partialOptions: Partial<SudokuBoardViewOptions>) => {
    setOptions(o => ({ ...o, ...partialOptions }))
  }

  const mergeGameViewState = (f: (_: GameViewState) => Partial<GameViewState>) => {
    setGameBoardState(gbs => ({ ...gbs, ...f(gbs) }))
  }

  const mergeSolverState = (f: (_: SolverModels.SolverState) => SolverModels.SolverState) => {
    mergeGameViewState(s => ({ ...s, solverState: f(s.solverState) }))
  }

  const mergeBorderState = (f: (_: BoardState) => BoardState) => {
    mergeGameViewState(s => ({ ...s, boardState: f(s.boardState) }))
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (continuous && gameBoardState.solverState.outcome === SolverModels.Outcomes.unknown) {
        mergeGameViewState(s => ({ solverState: Solver.nextStep(s.solverState) }))
      }
    }, 10)
    return () => clearTimeout(timer)
  })

  const startGame = () => {
    const puzzle = hardPuzzle15
    // const board = Solver.createBoard({ boxWidth: 4, boxHeight: 4, useRandomCells: false }).board
    // const allCells = Sudoku.allCellsPos(board)
    // const cellsToRemove = utils.shuffle(allCells).slice(0, Math.max(1, allCells.length * 0.6))
    // const puzzle = cellsToRemove.reduce((acc, cell) => Sudoku.clearCell(acc)(cell), board)
    // // const puzzle = board

    setGameBoardState(createGameViewState(puzzle))
  }

  const unselectAllCells = () => {
    mergeGameViewState(s => ({ boardState: createBoardState(s.solverState.board) }))
  }

  const solve = () => {
    const t1 = Date.now()
    const solverState = Solver.solveBoard(gameBoardState.solverState.board)
    const t2 = Date.now()
    setTime(t2 - t1)

    mergeGameViewState(s => ({ solverState }))
  }

  const nextStep = () => {
    mergeSolverState(s => Solver.nextStep(s))
  }

  const undoStep = () => {
    mergeSolverState(s => Solver.undoStep(s))
  }

  const clearCell = (board: SudokuModels.Board, boardCellState: BoardCellState, row: number, col: number) =>
    boardCellState.selected ? Sudoku.clearCell(board)({ row, col }) : board

  const clearCells = () => {
    const b = utils.reduce2d<SudokuModels.Board, BoardCellState>(gameBoardState.boardState)(
      clearCell,
      gameBoardState.solverState.board,
    )
    setGameBoardState(createGameViewState(b))
  }

  const onCellUp = ({ row, col }: SudokuModels.CellPos) => {
    mergeBorderState(bs => utils.update2dCell(bs)(c => ({ ...c, selected }), row, col))
    setSelecting(false)
  }

  const onCellMove = ({ row, col }: SudokuModels.CellPos) => {
    if (selecting) {
      mergeBorderState(bs => utils.update2dCell(bs)(c => ({ ...c, selected }), row, col))
    }
  }

  const onCellDown = ({ row, col }: SudokuModels.CellPos) => {
    unselectAllCells()
    setSelecting(true)
    setSelected(!gameBoardState.boardState[row][col].selected)
  }

  const keyToNumber = (key: string) =>
    key >= "1" && key <= "9" ? key.charCodeAt(0) - "1".charCodeAt(0) + 1 : key.charCodeAt(0) - "A".charCodeAt(0) + 10

  const updateSelectedCell = (key: string) => (
    board: SudokuModels.Board,
    _: SudokuModels.Cell,
    row: number,
    col: number,
  ) => (gameBoardState.boardState[row][col].selected ? Sudoku.setCell(board)(keyToNumber(key), { row, col }) : board)

  const onKeyPressed = (key: string) => {
    const upKey = key.toUpperCase()
    if ((key >= "1" && key <= "9") || (upKey >= "A" && upKey <= "G")) {
      const b = utils.reduce2d<SudokuModels.Board, SudokuModels.Cell>(gameBoardState.solverState.board.cells)(
        updateSelectedCell(upKey),
        gameBoardState.solverState.board,
      )
      setGameBoardState(createGameViewState(b))
    }
  }

  const onCellActions: OnCellActions = {
    up: onCellUp,
    move: onCellMove,
    down: onCellDown,
  }

  return (
    <div
      className={classes.container}
      onClick={() => {
        console.log("=====>CLICK")
        unselectAllCells()
      }}
      onKeyPress={event => {
        onKeyPressed(event.key)
      }}
      tabIndex={0}
    >
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
        <Button className={classes.button} variant="contained" color="secondary" onClick={clearCells}>
          {"CLEAR CELLS"}
        </Button>
      </div>
      <div>
        <FormControlLabel
          control={<Checkbox checked={continuous} onChange={event => setContinuous(event.target.checked)} />}
          label="Continuous"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={options.showSmallNumbers}
              onChange={event => mergeOptions({ showSmallNumbers: event.target.checked })}
            />
          }
          label="Show small numbers"
        />
      </div>
      <div onClick={event => event.stopPropagation()}>
        <SudokuBoardView
          boardState={gameBoardState.boardState}
          startBoard={gameBoardState.startBoard}
          solverState={gameBoardState.solverState}
          onCellActions={onCellActions}
          options={options}
        />
      </div>
      {gameBoardState.solverState.outcome === SolverModels.Outcomes.valid && <div>{`Done in ${time}`}</div>}
    </div>
  )
}
