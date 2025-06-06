const SIZE = 8;
let board = [], selected = null, legalMoves = [], turn = 'white';

const unicodeMap = {
  white: { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙' },
  black: { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' }
};

function createInitialBoard() {
  board = Array.from({ length: SIZE }, () => Array.from(() => []));
  const back = ['R','N','B','Q','K','B','N','R'];
  for (let x = 0; x < SIZE; x++) {
    board[1][x] = [{ type: 'P', color: 'black' }];
    board[6][x] = [{ type: 'P', color: 'white' }];
    board[0][x] = [{ type: back[x], color: 'black' }];
    board[7][x] = [{ type: back[x], color: 'white' }];
  }
}

function drawBoard() {
  const boardDiv = document.getElementById('chessboard');
  boardDiv.innerHTML = '';
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const sq = document.createElement('div');
      sq.className = 'square ' + ((x + y) % 2 === 0 ? 'light' : 'dark');
      const stack = board[y][x] || [];
      sq.innerHTML = stack.map(p => `<span class='piece-icon'>${unicodeMap[p.color][p.type]}</span>`).join('<br>');
      if (legalMoves.some(([mx, my]) => mx === x && my === y)) sq.classList.add('highlight');
      sq.onclick = () => handleClick(x, y);
      boardDiv.appendChild(sq);
    }
  }
  document.getElementById('info').textContent = `Beurt: ${turn}`;
}

function handleClick(x, y) {
  if (selected) {
    const [sx, sy] = selected;
    if (legalMoves.some(([mx, my]) => mx === x && my === y)) {
      const movedPiece = board[sy][sx].pop();
      if (!board[y][x]) board[y][x] = [];
      board[y][x].push(movedPiece);
      turn = turn === 'white' ? 'black' : 'white';
      setTimeout(() => { if (turn === 'black') aiMove(); }, 300);
    }
    selected = null; legalMoves = [];
    drawBoard();
  } else if (board[y][x]?.some(p => p.color === turn)) {
    selected = [x, y];
    legalMoves = getBasicMoves(x, y);
    drawBoard();
  }
}

function getBasicMoves(x, y) {
  const moves = [];
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  for (let [dx, dy] of dirs) {
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) moves.push([nx, ny]);
  }
  return moves;
}

function aiMove() {
  const allMoves = [];
  for (let sy = 0; sy < 8; sy++) {
    for (let sx = 0; sx < 8; sx++) {
      if (!board[sy][sx]?.some(p => p.color === 'black')) continue;
      const moves = getBasicMoves(sx, sy);
      for (let [tx, ty] of moves) {
        allMoves.push({ sx, sy, tx, ty });
      }
    }
  }
  if (allMoves.length) {
    const move = allMoves[Math.floor(Math.random() * allMoves.length)];
    const movedPiece = board[move.sy][move.sx].pop();
    if (!board[move.ty][move.tx]) board[move.ty][move.tx] = [];
    board[move.ty][move.tx].push(movedPiece);
    turn = 'white';
    drawBoard();
  }
}

createInitialBoard();
drawBoard();