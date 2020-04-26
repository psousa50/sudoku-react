import React from "react"
import * as Sudoku from "../sudoku-core/Sudoku"
import * as R from "ramda"
import { makeStyles } from "@material-ui/core/styles"
import classes from "*.module.css"

const useStyles = makeStyles({
  cell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "0.10pt solid black",
    height: 48,
    width: 48,
    padding: 0,
    margin: 0,
  },
  table: {
    borderSpacing: 0,
    padding: 0,
  },
  td: {
    padding: 0,
  },
  tr: {
    padding: 0,
  },
})

interface SudokuBoardViewProps {
  board: Sudoku.Board
}

export const SudokuBoardView: React.FC<SudokuBoardViewProps> = ({ board }) => {
  const nc = Sudoku.numberCount(board)

  const classes = useStyles()

  return (
    <table className={classes.table}>
      <tbody>
        {R.range(0, nc).map((row) => (
          <tr key={row} className={classes.tr}>
            {R.range(0, nc).map((col) => (
              <td key={col} className={classes.td}>
                <CellView cell={Sudoku.cell(board)({ row, col })} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface CellViewProps {
  cell: Sudoku.Cell
}
const CellView: React.FC<CellViewProps> = ({ cell }) => {
  const classes = useStyles()

  const cellString = cell === Sudoku.emptyCell ? " " : cell.toString()
  return <div className={classes.cell}>{cellString}</div>
}
