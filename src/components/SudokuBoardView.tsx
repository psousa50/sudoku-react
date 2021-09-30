import { AvailableNumbers, SolverModels, Solver } from "../sudoku-core"
import React from "react"
import * as R from "ramda"
import { Sudoku, SudokuModels } from "../sudoku-core"
import { makeStyles } from "@material-ui/core/styles"
import { DeepPartial } from "../sudoku-core/types"

export type BoardState = BoardCellState[][]

export interface BoardCellState {
  selected: boolean
}

export interface OnCellActions {
  down: (cellPos: SudokuModels.CellPos) => void
  move: (cellPos: SudokuModels.CellPos) => void
  up: (cellPos: SudokuModels.CellPos) => void
}

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
    cursor: "pointer",
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

export interface SudokuBoardViewOptions {
  showSmallNumbers: boolean
}

export const sudokuBoardViewOptionsDefault: SudokuBoardViewOptions = {
  showSmallNumbers: true,
}

interface SudokuBoardViewProps {
  boardState: BoardState
  startBoard: SudokuModels.Board
  solverState: SolverModels.SolverState
  onCellActions: OnCellActions
  options?: DeepPartial<SudokuBoardViewOptions>
}

export const SudokuBoardView: React.FC<SudokuBoardViewProps> = ({
  boardState,
  startBoard,
  solverState,
  onCellActions,
  options: partialOptions,
}) => {
  const { board } = solverState
  const nc = SudokuModels.numberCount(board)

  const classes = useStyles()

  const options = { ...sudokuBoardViewOptionsDefault, ...partialOptions }

  // const constrainedCells: SudokuModels.CellPos[] = [] // Constraints.build(board.constraints)(board)({row:4, col:5})
  const availableNumbersMap =
    solverState.nodes.length > 0 ? solverState.nodes[solverState.nodes.length - 1].availableNumbersMap : []

  return (
    <div className={classes.board}>
      {R.range(0, nc / board.boxHeight).map(row => (
        <div key={row} className={classes.boxRow}>
          {R.range(0, nc / board.boxWidth).map(col => (
            <BoxView
              key={col}
              onCellActions={onCellActions}
              startBoard={startBoard}
              boardState={boardState}
              board={board}
              boxRow={row}
              boxCol={col}
              availableNumbersMap={availableNumbersMap}
              options={options}
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
  boardState: BoardState
  startBoard: SudokuModels.Board
  board: SudokuModels.Board
  availableNumbersMap: AvailableNumbers.AvailableNumbersMap
  onCellActions: OnCellActions
  options: SudokuBoardViewOptions
}

const BoxView: React.FC<BoxViewProps> = ({
  boardState,
  startBoard,
  board,
  boxRow,
  boxCol,
  availableNumbersMap,
  onCellActions,
  options,
}) => {
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

            const numbers =
              availableNumbersMap.length > 0 ? Solver.buildNumberListFromBitMask(availableNumbersMap[row][col]) : []

            return options.showSmallNumbers && Sudoku.cellIsEmpty(board)({ row, col }) ? (
              <CellNumbersView
                key={c}
                cellPos={{ row, col }}
                onCellActions={onCellActions}
                style={{
                  ...bordersStyle,
                  backgroundColor: boardState[row][col].selected
                    ? "yellow"
                    : numbersColors[Math.min(8, numbers.length)],
                }}
                boxWidth={board.boxWidth}
                boxHeight={board.boxHeight}
                numbers={numbers}
              />
            ) : (
              <CellView
                key={c}
                onCellActions={onCellActions}
                style={{
                  ...bordersStyle,
                  backgroundColor: boardState[row][col].selected
                    ? " yellow"
                    : !Sudoku.cellIsEmpty(startBoard)({ row, col })
                    ? "grey"
                    : !Sudoku.cellIsEmpty(board)({ row, col })
                    ? "lightgrey"
                    : undefined,
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
  onCellActions: OnCellActions
}

const CellView: React.FC<CellViewProps> = ({ cell, style, cellPos, onCellActions }) => {
  const classes = useStyles()

  const cellString = cell === SudokuModels.emptyCell ? "" : cell.toString()

  return (
    <div
      style={{ ...style, userSelect: "none" }}
      className={classes.cell}
      onMouseUp={() => onCellActions.up(cellPos)}
      onMouseDown={() => onCellActions.down(cellPos)}
      onMouseMove={() => onCellActions.move(cellPos)}
    >
      {cellString}
    </div>
  )
}

interface CellNumbersViewProps {
  boxWidth: number
  boxHeight: number
  cellPos: SudokuModels.CellPos
  numbers: number[]
  style: {}
  onCellActions: OnCellActions
}
const CellNumbersView: React.FC<CellNumbersViewProps> = ({
  boxWidth,
  boxHeight,
  numbers,
  cellPos,
  style,
  onCellActions,
}) => {
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
    <div
      style={style}
      className={classes.numbersBox}
      onMouseUp={() => onCellActions.up(cellPos)}
      onMouseDown={() => onCellActions.down(cellPos)}
      onMouseMove={() => onCellActions.move(cellPos)}
    >
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
