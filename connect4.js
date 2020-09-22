/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// ********************************************************//
//  REFACTOR REFACTOR REFACTOR REFACTOR REFACTOR REFACTOR  //
// ********************************************************//

class Player {
  constructor(color, name) {
    this.playerColor = color;
    this.playerName = name;
  }
}

class Game {
  constructor(WIDTH, HEIGHT) {

    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.makeBoard();
    this.makeHtmlBoard();
    this.makeColorForm();
    this.p1 = new Player(document.getElementById("p1Input").value, "Player 1");
    this.p2 = new Player(document.getElementById("p2Input").value, "Player 2");
    this.currPlayer = this.p1; // active player: 1 or 2
    this.updatePlayerColor();
  }



  /** makeBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  */
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  updatePlayerColor() {
    this.p1.playerColor = document.getElementById("p1Input").value;
    this.p2.playerColor = document.getElementById("p2Input").value;
  }

  makeColorForm() {
    const form = document.createElement("form");

    const p1Input = document.createElement("input");
    p1Input.defaultValue = "red";
    p1Input.setAttribute("id", "p1Input");
    const p1Label = document.createElement("label");
    p1Label.textContent = "Player 1";

    const p2Input = document.createElement("input");
    p2Input.defaultValue = "yellow";
    p2Input.setAttribute("id", "p2Input");
    const p2Label = document.createElement("label");
    p2Label.textContent = "Player 2";

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Choose Color";


    const boundHandleColorSubmit = this.handleColorSubmit.bind(Game);
    form.addEventListener("submit", boundHandleColorSubmit);
    form.appendChild(p1Label);
    form.appendChild(p1Input);
    form.appendChild(document.createElement("br"));
    form.appendChild(p2Label);
    form.appendChild(p2Input);
    form.appendChild(document.createElement("br"));
    form.appendChild(submitBtn);
    document.getElementById("game").appendChild(form);

  }


  handleColorSubmit(evt) {
    evt.preventDefault();
    console.log(Game); // Game object
    console.log(this); // Game object
    console.log(Game === this); // True
    console.log(this.p1); // Undefined?
    this.updatePlayerColor(); // <--- Ultiamtely want to do this
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    // piece.classList.add(`p${this.currPlayer}`);
    piece.style.backgroundColor = this.currPlayer.playerColor;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.playerName} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

new Game(6, 7);