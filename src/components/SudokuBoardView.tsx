import { AvailableNumbers, SolverModels, Solver, Constraints } from "../sudoku-core"
import React from "react"
import * as R from "ramda"
import { Sudoku, SudokuModels } from "../sudoku-core"
import { makeStyles } from "@material-ui/core/styles"

const numbersColors = [
  "#bbdefb",
  "#a5d6a7",
  "#64b5f6",
  "#42a5f5",
  "#2196f3",
  "#1e88e5",
  "#1976d2",
  "#1565c0",
  "#0d47a1",
]

const useStyles = makeStyles({
  container: {},
  board: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    border: "3pt solid black",
  },
  boardRow: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
  },
  box: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    border: "1.5pt solid black",
  },
  boxRow: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    display: "flex",
    border: "1pt solid black",
    width: 48,
    height: 48,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "yellow",
  },
  numbersBox: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    border: "1pt solid black",
    width: 48,
    height: 48,
    fontSize: 9,
    padding: 0,
    margin: 0,
  },
  numbersRow: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
  },
})

interface SudokuBoardViewProps {
  startBoard: SudokuModels.Board
  solverState: SolverModels.SolverState
}

export const SudokuBoardView: React.FC<SudokuBoardViewProps> = props => {
  const { startBoard, solverState } = props
  const { board } = solverState
  const nc = SudokuModels.numberCount(board)

  const classes = useStyles()

  // const constrainedCells: SudokuModels.CellPos[] = [] // Constraints.build(board.constraints)(board)({row:4, col:5})

  return (
    <div className={classes.board}>
      {R.range(0, nc / board.boxHeight).map(row => (
        <div key={row} className={classes.boxRow}>
          {R.range(0, nc / board.boxWidth).map(col => (
            <BoxView
              key={col}
              startBoard={startBoard}
              board={board}
              boxRow={row}
              boxCol={col}
              availableNumbersMap={solverState.nodes[solverState.nodes.length - 1].availableNumbersMap}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface BoxViewProps {
  boxRow: number
  boxCol: number
  startBoard: SudokuModels.Board
  board: SudokuModels.Board
  availableNumbersMap: AvailableNumbers.AvailableNumbersMap
}

const BoxView: React.FC<BoxViewProps> = ({ startBoard, board, boxRow, boxCol, availableNumbersMap }) => {
  const classes = useStyles()

  return (
    <div className={classes.box}>
      {R.range(0, board.boxHeight).map(r => (
        <div key={r} className={classes.boxRow}>
          {R.range(0, board.boxWidth).map(c => {
            const row = boxRow * board.boxHeight + r
            const col = boxCol * board.boxWidth + c
            return Sudoku.cellIsEmpty(board)({ row, col }) ? (
              <CellNumbersView
                key={c}
                boxWidth={board.boxWidth}
                boxHeight={board.boxHeight}
                numbers={Solver.buildNumberListFromBitMask(availableNumbersMap[row][col])}
              />
            ) : (
              <CellView
                key={c}
                cell={Sudoku.cell(board)({ row, col })}
                cellPos={{ row, col }}
                backgroundColor={Sudoku.cellIsEmpty(startBoard)({ row, col }) ? undefined : "lightgrey"}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

interface CellViewProps {
  cell: SudokuModels.Cell
  cellPos: SudokuModels.CellPos
  backgroundColor?: string
}
const CellView: React.FC<CellViewProps> = ({ cell, backgroundColor }) => {
  const classes = useStyles()

  const cellString = cell === SudokuModels.emptyCell ? "" : cell.toString()
  return (
    <div style={{ backgroundColor }} className={classes.cell}>
      {cellString}
    </div>
  )
}

interface CellNumbersViewProps {
  boxWidth: number
  boxHeight: number
  numbers: number[]
}
const CellNumbersView: React.FC<CellNumbersViewProps> = ({ boxWidth, boxHeight, numbers }) => {
  const classes = useStyles()

  const cellBorderStyles = makeStyles({
    cell: {
      width: 48 / boxWidth,
      height: 48 / boxHeight,
      backgroundColor: numbersColors[Math.min(8, numbers.length)],
    },
  })
  const cellClasses = cellBorderStyles()

  return (
    <div className={classes.numbersBox}>
      {R.range(0, boxHeight).map((_, r) => (
        <div key={r} className={classes.numbersRow}>
          {R.range(0, boxWidth).map((_, c) => (
            <div key={c} className={cellClasses.cell}>
              {numbers.find(n => n === r * boxWidth + c + 1) ? r * boxWidth + c + 1 : " "}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
