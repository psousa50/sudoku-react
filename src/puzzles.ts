import { helpers, Constraints, Sudoku } from "./sudoku-core"

// const solverState = SudokuSolver.createBoard({ boxWidth: 3, boxHeight: 3 })
const cells = [
  ".........",
  ".........",
  ".........",
  "384672...",
  "...159...",
  "...834...",
  ".........",
  ".........",
  "........2",
]
const constraints = [
  ...Constraints.classicalConstraints,
  Constraints.diagonalConstraint,
  Constraints.knightMoveConstraint,
]

export const magicSquareboard = Sudoku.createBoard({ boxWidth: 3, boxHeight: 3, constraints }, helpers.buildBoardCells(cells))
