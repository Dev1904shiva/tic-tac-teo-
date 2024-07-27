document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('gameBoard');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restartBtn');
    const singlePlayerBtn = document.getElementById('singlePlayerBtn');
    const multiPlayerBtn = document.getElementById('multiPlayerBtn');
    const difficultyOptions = document.getElementById('difficultyOptions');
    let cells, currentPlayer, gameActive, gameMode, aiDifficulty;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function startGame() {
        cells = Array(9).fill(null);
        currentPlayer = 'X';
        gameActive = true;
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
        status.textContent = `${currentPlayer}'s turn`;
        restartBtn.style.display = 'none';
        difficultyOptions.style.display = 'none';
    }

    function handleCellClick(e) {
        const index = Array.from(board.children).indexOf(e.target);
        if (!gameActive || cells[index]) return;
        makeMove(index, currentPlayer);
        if (checkWin(currentPlayer)) {
            endGame(`${currentPlayer} wins!`);
        } else if (cells.every(cell => cell)) {
            endGame('Draw!');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `${currentPlayer}'s turn`;
            if (gameMode === 'single' && currentPlayer === 'O') {
                aiMove();
            }
        }
    }

    function makeMove(index, player) {
        cells[index] = player;
        board.children[index].textContent = player;
        board.children[index].classList.add('disabled');
    }

    function checkWin(player) {
        return winningConditions.some(condition =>
            condition.every(index => cells[index] === player)
        );
    }

    function endGame(message) {
        gameActive = false;
        status.textContent = message;
        restartBtn.style.display = 'block';
    }

    function aiMove() {
        const emptyCells = cells.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        let index;
        if (aiDifficulty === 'hard') {
            index = findBestMove();
        } else if (aiDifficulty === 'medium') {
            index = emptyCells.length > 1 && Math.random() > 0.5 ? findBestMove() : randomMove(emptyCells);
        } else {
            index = randomMove(emptyCells);
        }
        makeMove(index, 'O');
        if (checkWin('O')) {
            endGame('O wins!');
        } else if (cells.every(cell => cell)) {
            endGame('Draw!');
        } else {
            currentPlayer = 'X';
            status.textContent = `${currentPlayer}'s turn`;
        }
    }

    function randomMove(emptyCells) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function findBestMove() {
        let bestMove;
        let bestScore = -Infinity;
        for (const index of cells.map((cell, i) => cell === null ? i : null).filter(i => i !== null)) {
            cells[index] = 'O';
            let score = minimax(cells, false);
            cells[index] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
        return bestMove;
    }

    function minimax(newCells, isMaximizing) {
        if (checkWin('O')) return 1;
        if (checkWin('X')) return -1;
        if (newCells.every(cell => cell)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (const index of newCells.map((cell, i) => cell === null ? i : null).filter(i => i !== null)) {
                newCells[index] = 'O';
                let score = minimax(newCells, false);
                newCells[index] = null;
                bestScore = Math.max(score, bestScore);
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (const index of newCells.map((cell, i) => cell === null ? i : null).filter(i => i !== null)) {
                newCells[index] = 'X';
                let score = minimax(newCells, true);
                newCells[index] = null;
                bestScore = Math.min(score, bestScore);
            }
            return bestScore;
        }
    }

    restartBtn.addEventListener('click', startGame);

    singlePlayerBtn.addEventListener('click', () => {
        gameMode = 'single';
        difficultyOptions.style.display = 'block';
    });

    multiPlayerBtn.addEventListener('click', () => {
        gameMode = 'multi';
        startGame();
    });

    difficultyOptions.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            aiDifficulty = e.target.getAttribute('data-difficulty');
            startGame();
        }
    });

    startGame();
});
