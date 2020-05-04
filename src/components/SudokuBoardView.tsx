import { AvailableNumbers, SolverModels, Solver, Constraints } from "../sudoku-core"
import React from "react"
import * as R from "ramda"
import { Sudoku, SudokuModels } from "../sudoku-core"
import { makeStyles } from "@material-ui/core/styles"

const numbersColors = ["white", "#a5d6a7", "#f48fb1", "#42a5f5", "#2196f3", "#1e88e5", "#1976d2", "#1565c0", "#0d47a1"]

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
    border: "1pt solid black",
    padding: 4,
  },
  boxRow: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    display: "flex",
    borderLeft: "0.5pt solid black",
    borderBottom: "0.5pt solid black",
    width: 48,
    height: 48,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  numbersBox: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    borderLeft: "0.5pt solid black",
    borderBottom: "0.5pt solid black",
    width: 48,
    height: 48,
    fontSize: 9,
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
            const bordersStyle = {
              borderTop: r === 0 ? "0.5pt solid black" : undefined,
              borderRight: c === board.boxWidth - 1 ? "0.5pt solid black" : undefined,
            }

            const numbers = Solver.buildNumberListFromBitMask(availableNumbersMap[row][col])
            return Sudoku.cellIsEmpty(board)({ row, col }) ? (
              <CellNumbersView
                key={c}
                style={{ ...bordersStyle, backgroundColor: numbersColors[Math.min(8, numbers.length)] }}
                boxWidth={board.boxWidth}
                boxHeight={board.boxHeight}
                numbers={numbers}
              />
            ) : (
              <CellView
                key={c}
                style={{
                  ...bordersStyle,
                  backgroundColor: Sudoku.cellIsEmpty(startBoard)({ row, col }) ? "yellow" : "lightgrey",
                }}
                cell={Sudoku.cell(board)({ row, col })}
                cellPos={{ row, col }}
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
  style: {}
}

const CellView: React.FC<CellViewProps> = ({ cell, style }) => {
  const classes = useStyles()

  const cellString = cell === SudokuModels.emptyCell ? "" : cell.toString()
  return (
    <div style={style} className={classes.cell}>
      {cellString}
    </div>
  )
}

interface CellNumbersViewProps {
  boxWidth: number
  boxHeight: number
  numbers: number[]
  style: {}
}
const CellNumbersView: React.FC<CellNumbersViewProps> = ({ boxWidth, boxHeight, numbers, style }) => {
  const classes = useStyles()

  const cellBorderStyles = {
    cell: {
      display: "flex",
      width: 48 / boxWidth,
      height: 48 / boxHeight,
      alignItems: "center",
      justifyContent: "center",  
    },
  }

  return (
    <div style={style} className={classes.numbersBox}>
      {R.range(0, boxHeight).map((_, r) => (
        <div key={r} className={classes.numbersRow}>
          {R.range(0, boxWidth).map((_, c) => (
            <div key={c} style={cellBorderStyles.cell}>
              {numbers.find(n => n === r * boxWidth + c + 1) ? r * boxWidth + c + 1 : " "}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
