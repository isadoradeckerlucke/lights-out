import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = .25 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let y = 0; y < nrows; y++){
      let row = [];
      for(let x = 0; x < ncols; x++){
        // in each column, push in either t or false. true if the randomly generated number is less than the chance that light starts on, false if it's greater.
        row.push(Math.random() < chanceLightStartsOn)
      }
      initialBoard.push(row)
    }
    return initialBoard;
  }

  function hasWon() {
    // someone wins if all the lights on the board are set to false (off)
    return board.every(row => row.every(cell => !cell))
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // copy the old clipboard
      const boardCopy = oldBoard.map(row => [...row])

      // flip the cell and the cells that touch it. 
      flipCell(y, x, boardCopy)
      flipCell(y, x-1, boardCopy)
      flipCell(y, x+1, boardCopy)
      flipCell(y-1, x, boardCopy)
      flipCell(y+1, x, boardCopy)

      // return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div>you win!</div>
  }

  // make table board
  let tblBoard = [];

  for(let y = 0; y < nrows; y++){
    let row = [];
    for (let x = 0; x < ncols; x++){
      // set a coordinate of each so we can access cells by coordinate
      let coord = `${y}-${x}`;
      row.push(
        <Cell 
          key = {coord}
          isLit = {board[y][x]}
          flipCellsAroundMe = {() => flipCellsAround(coord)}
        />
      )
    }
    tblBoard.push(<tr key = {y}>{row}</tr>)
  }

  return (
    <table className = 'Board'>
      <tbody>{tblBoard}</tbody>
    </table>
  )

}

export default Board;
