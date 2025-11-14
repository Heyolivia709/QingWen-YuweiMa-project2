import { useEffect, useMemo, useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { formatElapsed, serializeKey } from '../lib/sudoku.js';

const MODE_TITLE = {
  easy: 'Easy • 6×6',
  normal: 'Normal • 9×9',
};

export default function GamePage({ mode }) {
  const {
    mode: currentMode,
    config,
    board,
    givenCells,
    conflicts,
    selectedCell,
    setSelectedCell,
    status,
    mistakes,
    hintCount,
    elapsed,
    isRunning,
    startNewGame,
    resetCurrentBoard,
    placeNumber,
    clearCell,
    provideHint,
    solvePuzzle,
    pause,
    resume,
  } = useGame();

  const [lastHintCell, setLastHintCell] = useState(null);

  // Initialize game when mode changes or board is empty
  useEffect(() => {
    if (currentMode !== mode || !board.length) {
      startNewGame(mode);
      setLastHintCell(null);
    }
  }, [board.length, currentMode, mode, startNewGame]);
  



  useEffect(() => {
    const handler = (event) => {
      if (!selectedCell) return;
      const { row, col } = selectedCell;
      if (event.key >= '1' && event.key <= String(config.size)) {
        event.preventDefault();
        const digit = Number(event.key);
        placeNumber(row, col, digit);
        return;
      }
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        clearCell(row, col);
        return;
      }

      const navigate = {
        ArrowUp: { row: Math.max(row - 1, 0), col },
        ArrowDown: { row: Math.min(row + 1, config.size - 1), col },
        ArrowLeft: { row, col: Math.max(col - 1, 0) },
        ArrowRight: { row, col: Math.min(col + 1, config.size - 1) },
      };
      if (navigate[event.key]) {
        event.preventDefault();
        setSelectedCell(navigate[event.key]);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [clearCell, config.size, placeNumber, selectedCell, setSelectedCell]);




  useEffect(() => {
    if (!lastHintCell) {
      return undefined;
    }
    const timeout = setTimeout(() => setLastHintCell(null), 1800);
    return () => clearTimeout(timeout);
  }, [lastHintCell]);



  // Auto pause when leaving the page
  useEffect(() => {
    return () => {
      pause();
    };
  }, [pause]);

  // Auto resume when returning to the page if game was playing
  useEffect(() => {
    if (status === "playing") {
      resume();
    }
  }, [status, resume]);




  const boardClassName = useMemo(() => `board ${config.size === 9 ? 'n9' : 'n6'}`, [config.size]);

  const handleInput = (row, col, value) => {
    const sanitized = value.replace(/[^0-9]/g, '').slice(0, 2);
    if (!sanitized) {
      clearCell(row, col);
      return;
    }
    const digit = Number(sanitized[0]);
    placeNumber(row, col, digit);
  };

  const handleHint = () => {
    const hint = provideHint();
    if (hint) {
      setLastHintCell(serializeKey(hint.row, hint.col));
    }
  };

  const handleCellFocus = (row, col) => {
    setSelectedCell({ row, col });
  };

  const statusText = {
    idle: 'Ready to start a new puzzle!',
    playing: 'Game in progress—keep going!',
    completed: '🎉 Congratulations, puzzle solved! ',
  }[status];

  return (
    <div>
      <h1 className="page-title">{MODE_TITLE[mode]}</h1>
      <div className="grid-2 game-wrapper">
        <section className="panel">
          <div className={boardClassName} role="grid" aria-label={`${config.size} by ${config.size} Sudoku board`}>
            {board.map((row, rowIndex) =>
              row.map((cellValue, colIndex) => {
                const key = serializeKey(rowIndex, colIndex);
                const isGiven = givenCells.has(key);
                const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;
                const hasConflict = conflicts.has(key);
                const isHinted = lastHintCell === key;
                const classes = ['cell'];
                if (isGiven) classes.push('cell--given');
                if (isSelected) classes.push('cell--selected');
                if (hasConflict) classes.push('cell--conflict');
                if (!isGiven && cellValue) classes.push('cell--filled');
                if (isHinted) classes.push('cell--hint');

                return (
                  <div 
                    key={key} 
                    className={classes.join(' ')} 
                    role="gridcell" 
                    aria-selected={isSelected}
                    onClick={() => !isGiven && handleCellFocus(rowIndex, colIndex)}
                  >
                    {isGiven ? (
                      <span>{cellValue}</span>
                    ) : (
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                        value={cellValue ?? ''}
                        onChange={(event) => handleInput(rowIndex, colIndex, event.target.value)}
                        onFocus={() => handleCellFocus(rowIndex, colIndex)}
                        aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1}`}
                      />
                    )}
                  </div>
                );
              }),
            )}
          </div>
          <p className="muted mt-12">Enter digits 1-{config.size} to complete every row, column, and subgrid.</p>
        </section>

        <aside className="panel details">
          <h2 className="mt-0">Match Details</h2>
          <p>
            <strong>Timer:</strong> <span className="pill">{formatElapsed(elapsed)}</span>
          </p>
          <div className="button-group">
            <button type="button" onClick={isRunning ? pause : resume}>
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button type="button" onClick={() => startNewGame(mode)}>
              New Game
            </button>
            <button type="button" onClick={resetCurrentBoard}>
              Reset Board
            </button>
          </div>
          <div className="button-group">
            <button type="button" onClick={handleHint}>
              Hint
            </button>
            <button type="button" onClick={solvePuzzle}>
              Solve Puzzle
            </button>
          </div>
          <ul className="game-stats">
            <li>Status: {statusText}</li>
            <li>Mistakes: {mistakes}</li>
            <li>Hints used: {hintCount}</li>
            <li>Cells in conflict: {conflicts.size}</li>
          </ul>
          <p className="muted pro-tip">
            Pro tip: Use hints sparingly and watch for repeated numbers in rows, columns, and subgrids.
          </p>
        </aside>
      </div>
    </div>
  );
}
