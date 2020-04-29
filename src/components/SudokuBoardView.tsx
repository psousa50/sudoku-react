import React from "react"
import * as R from "ramda"
import { Sudoku, SudokuModels } from "../sudoku-core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  container: {
  },
  table: {
    border: "5pt solid black",
    borderCollapse: "collapse",
    flex: 1,
    borderSpacing: 0,
    padding: 0,
  },
  tr: {
    padding: 0,
  },
  cell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "0.10pt solid black",
    padding: 0,
    margin: 0,
    width: 48,
    height: 48,
  },
})

interface SudokuBoardViewProps {
  board: SudokuModels.Board
  startBoard: SudokuModels.Board
}

export const SudokuBoardView: React.FC<SudokuBoardViewProps> = ({ board, startBoard }) => {

  const nc = SudokuModels.numberCount(board)

  const classes = useStyles({ boxWidth: 3 })

  const boxCellRightBorder = `& td:nth-child(${board.boxWidth}n)`
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
    cell: {
    },
    originalCell: {
      backgroundColor: "lightgrey"
    }
  
  })
  const cellClasses = cellBorderStyles()


  return (
    <div className={classes.container}>
      <table className={classes.table}>
        <tbody className={cellClasses.rowBorder}>
          {R.range(0, nc).map((row) => (
            <tr key={row} className={`${classes.tr} ${cellClasses.cellBorder}`}>
              {R.range(0, nc).map((col) => (
                <td key={col} className={Sudoku.cellIsEmpty(startBoard)({row, col}) ? cellClasses.cell : cellClasses.originalCell}>
                  <CellView cell={Sudoku.cell(board)({ row, col })} />
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
}
const CellView: React.FC<CellViewProps> = ({ cell }) => {
  const classes = useStyles()

  const cellString = cell === SudokuModels.emptyCell ? " " : cell.toString()
  return <div className={classes.cell}>{cellString}</div>
}
