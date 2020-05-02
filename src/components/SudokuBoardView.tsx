import { SolverModels, Solver, Constraints } from "../sudoku-core"
import React from "react"
import * as R from "ramda"
import { Sudoku, SudokuModels } from "../sudoku-core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  container: {},
  board: {
    border: "5pt solid black",
    borderCollapse: "collapse",
    flex: 1,
    borderSpacing: 0,
    padding: 0,
  },
  boardRow: {
    padding: 0,
  },
  boardCell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "0.10pt solid black",
    padding: 0,
    margin: 0,
    width: 48,
    height: 48,
  },
  numbers: {
    flex: 1,
    borderSpacing: 0,
    padding: 0,
  },
  numbersCell: {
    fontSize: 8,
  },
})

interface SudokuBoardViewProps {
  board: SudokuModels.Board
  startBoard: SudokuModels.Board
}

export const SudokuBoardView: React.FC<SudokuBoardViewProps> = ({ board, startBoard }) => {
  const nc = SudokuModels.numberCount(board)

  const classes = useStyles({ boxWidth: 3 })

  const boxCellRightBorder = `& td1:nth-child(${board.boxWidth}n)`
  const boxRowBottomBorder = `& tr:nth-child(${board.boxHeight}n)`
  const cellBorderStyles = makeStyles({
    cellBorder: {
      padding: 0,
      [boxCellRightBorder]: {
        borderRight: "3pt solid black",
      },
    },
    rowBorder: {
      padding: 0,
      [boxRowBottomBorder]: {
        borderBottom: "3pt solid black",
      },
    },
    cell: {},
    originalCell: {
      backgroundColor: "lightgrey",
    },
  })
  const cellClasses = cellBorderStyles()

  const constrainedCells: SudokuModels.CellPos[] = [] // Constraints.build(board.constraints)(board)({row:4, col:5})
  const solverState = Solver.startSolveBoard(startBoard)

  return (
    <div className={classes.container}>
      <table className={classes.board}>
        <tbody className={cellClasses.rowBorder}>
          {R.range(0, nc).map((row) => (
            <tr key={row} className={`${classes.boardRow} ${cellClasses.cellBorder}`}>
              {R.range(0, nc).map((col) => (
                <td
                  key={col}
                  className={Sudoku.cellIsEmpty(startBoard)({ row, col }) ? cellClasses.cell : cellClasses.originalCell}
                >
                  <CellNumbersView
                    boxWidth={board.boxWidth}
                    boxHeight={board.boxHeight}
                    numbers={
                      Sudoku.cellIsEmpty(startBoard)({ row, col })
                        ?  Solver.buildNumberListFromBitMask(solverState.nodes[0].availableNumbersMap[row][col])
                        : []
                    }
                  />
                  {false && (
                    <CellView
                      cell={Sudoku.cell(board)({ row, col })}
                      cellPos={{ row, col }}
                      backgroundColor={
                        constrainedCells.find(SudokuModels.cellPosIsEqual({ row, col })) ? "green" : undefined
                      }
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
    <div style={{ backgroundColor }} className={classes.boardCell}>
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

  return (
    <div className={classes.container}>
      <table className={classes.numbers}>
        <tbody>
          {R.range(0, boxHeight).map((_, r) => (
            <tr key={r}>
              {R.range(0, boxWidth).map((_, c) => (
                <td key={c} className={classes.numbersCell}>
                  {numbers.find((n) => n === r * boxWidth + c) ? r * boxWidth + c : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
