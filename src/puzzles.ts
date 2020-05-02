import { helpers, Constraints, Sudoku } from "./sudoku-core"

// const solverState = SudokuSolver.createBoard({ boxWidth: 3, boxHeight: 3 })
const cells1 = [
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

export const magicSquareboard = Sudoku.createBoard({ boxWidth: 3, boxHeight: 3, constraints }, helpers.buildBoardCells(cells1))


const cells2 = [
  ".8..47...",
  "36.....5.",
  "..7615..2",
  "7.1......",
  ".3.......",
  "24.......",
  ".........",
  ".........",
  ".........",
]

export const otherBoard = Sudoku.createBoard({ boxWidth: 3, boxHeight: 3 }, helpers.buildBoardCells(cells2))

const cellsBig4x4 = [
  ".7....3..C....A.",
  "G4....9..E....B6",
  "...3G.C..1.9F...",
  "..5..D.B3.7..4..",
  "..B..G.58.2..1..",
  "...91.F..6.A3...",
  "ACE..9....1..F74",
  "...76..AC..D5...",
  "...E9..G1..B4...",
  "D6A..C....3..B15",
  "...4F.7..5.G2...",
  "..3..E.6F.4..9..",
  "..2..A.F4.5..6..",
  "...GB.D..9.7A...",
  "4F....5..B....E2",
  ".9....8..3....5.",
]

export const big4x4 = Sudoku.createBoard({ boxWidth: 4, boxHeight: 4 }, helpers.buildBoardCells(cellsBig4x4))

