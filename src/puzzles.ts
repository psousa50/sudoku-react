import { Constraints, helpers, Sudoku } from "./sudoku-core"

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
const allConstraints = [
  ...Constraints.classicalConstraints,
  Constraints.diagonalConstraint,
  Constraints.knightMoveConstraint,
]

const diagonalConstraints = [...Constraints.classicalConstraints, Constraints.diagonalConstraint]

export const magicSquareboard = Sudoku.createBoard(
  { boxWidth: 3, boxHeight: 3, constraints: allConstraints },
  helpers.buildBoardCells(cells1),
)

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

const cellsMedium4x4 = [
  "4.G..9.7F.6..2.B",
  ".1.EC.A..5.49.7.",
  "C..5F..D2..18..3",
  ".36...B..9...45.",
  ".43...F..1...E8.",
  "D......2G......4",
  ".B.18......CD.F.",
  "5.F..6....B..3.A",
  "9.2..B....4..D.F",
  ".8.FG......EB.6.",
  "6......97......2",
  ".5D...7..B...CA.",
  ".CE...6..F...52.",
  "B..63..FE..8G..9",
  ".G.D7.8..4.5F.1.",
  "8.7..4.A3.C..B.E",
]

export const medium4x4 = Sudoku.createBoard({ boxWidth: 4, boxHeight: 4 }, helpers.buildBoardCells(cellsMedium4x4))

const cellsHard4x4 = [
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

export const hard4x4 = Sudoku.createBoard({ boxWidth: 4, boxHeight: 4 }, helpers.buildBoardCells(cellsHard4x4))

const cellsHardPuzzle15 = [
  ".5..4..93",
  "3.......1",
  "...53...4",
  "..93.....",
  "731...4.2",
  "......3.9",
  "...812.3.",
  "6.......8",
  ".8..6..4.",
]

export const hardPuzzle15 = Sudoku.createBoard(
  { boxWidth: 3, boxHeight: 3, constraints: diagonalConstraints },
  helpers.buildBoardCells(cellsHardPuzzle15),
)
