import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useEffect } from 'react'; // import useEffect
import useGameTimer from '../hooks/useGameTimer.js';
import useLocalStorage from '../hooks/useLocalStorage.js';
import {
  collectConflicts,
  formatElapsed,
  generatePuzzleByMode,
  isBoardComplete,
  MODE_CONFIG,
  serializeKey,
} from '../lib/sudoku.js';
import { useUser } from './UserContext.jsx';

const GameContext = createContext(undefined);

export function GameProvider({ children }) {
  const { user } = useUser();
  const [mode, setMode] = useState('easy');
  const [config, setConfig] = useState(MODE_CONFIG.easy);
  const [board, setBoard] = useState([]);
  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [givenCells, setGivenCells] = useState(new Set());
  const [selectedCell, setSelectedCell] = useState(null);
  const [conflicts, setConflicts] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState('idle');
  const [hintCount, setHintCount] = useState(0);
  const [currentPuzzleId, setCurrentPuzzleId] = useState(null);
                                                            
  const { elapsed, restart, stop, pause, resume, start, isRunning  } = useGameTimer(false);
  const [bestTimes, setBestTimes] = useLocalStorage('kitten-sudoku-best-times', {
    easy: null,
    normal: null,
  });
  const [history, setHistory] = useLocalStorage('kitten-sudoku-history', []);

  const updateConflicts = useCallback(
    (nextBoard, nextConfig) => {
      const detected = collectConflicts(nextBoard, nextConfig.subgridHeight, nextConfig.subgridWidth);
      setConflicts(detected);
      return detected;
    },
    [],
  );

  const finalizeGame = useCallback(
    (finalBoard, forcedElapsed) => {
      const finalElapsed = typeof forcedElapsed === 'number' ? forcedElapsed : elapsed;
      stop();
      setStatus('completed');

      const finishedAt = new Date().toISOString();
      const player = user?.username ?? 'Guest';
      const historyEntry = {
        id: `${Date.now()}`,
        mode,
        elapsed: finalElapsed,
        mistakes,
        hints: hintCount,
        finishedAt,
        player,
        puzzleId: currentPuzzleId,
      };

      setHistory((prev) => [historyEntry, ...prev].slice(0, 20));
      setBestTimes((prev) => {
        const currentBest = prev[mode];
        if (!currentBest || finalElapsed < currentBest.elapsed) {
          return {
            ...prev,
            [mode]: {
              elapsed: finalElapsed,
              finishedAt,
              player,
              formatted: formatElapsed(finalElapsed),
            },
          };
        }
        return prev;
      });
    },
    [currentPuzzleId, elapsed, hintCount, mistakes, mode, setBestTimes, setHistory, stop, user],
  );

  const startNewGame = useCallback(
    (nextMode = mode) => {
      const { puzzle: nextPuzzle, solution: nextSolution, config: nextConfig } = generatePuzzleByMode(nextMode);
      const generatedId = `${nextMode}-${Date.now()}`;

      const nextBoard = nextPuzzle.map((row) => row.map((value) => value));
      const nextGiven = new Set();
      nextPuzzle.forEach((row, r) =>
        row.forEach((value, c) => {
          if (value) {
            nextGiven.add(serializeKey(r, c));
          }
        }),
      );

      setMode(nextMode);
      setConfig(nextConfig);
      setPuzzle(nextPuzzle);
      setSolution(nextSolution);
      setBoard(nextBoard);
      setGivenCells(nextGiven);
      setSelectedCell(null);
      setConflicts(new Set());
      setMistakes(0);
      setStatus('playing');
      setHintCount(0);
      setCurrentPuzzleId(generatedId);
      restart();
   
    },
    [mode, restart],
  );



  const resetCurrentBoard = useCallback(() => {
    if (!puzzle.length) {
      return;
    }
    const resetBoard = puzzle.map((row) => row.map((value) => value));
    setBoard(resetBoard);
    setConflicts(new Set());
    setMistakes(0);
    setHintCount(0);
    setSelectedCell(null);
    setStatus('playing');
    restart();
  
  }, [puzzle, restart]);

  const clearCell = useCallback(
    (row, col) => {
      const key = serializeKey(row, col);
      if (givenCells.has(key)) {
        return;
      }
      setBoard((prev) => {
        const next = prev.map((r, rIndex) =>
          r.map((value, cIndex) => (rIndex === row && cIndex === col ? null : value)),
        );
        updateConflicts(next, config);
        return next;
      });
    },
    [config, givenCells, updateConflicts],
  );

  const placeNumber = useCallback(
    (row, col, digit) => {
      const key = serializeKey(row, col);
      if (givenCells.has(key) || status !== 'playing') {
        return;
      }

      const value = digit ?? null;
      if (value !== null && (Number.isNaN(value) || value < 1 || value > config.size)) {
        return;
      }

      setBoard((prev) => {
        const next = prev.map((r, rIndex) =>
          r.map((cell, cIndex) => (rIndex === row && cIndex === col ? value : cell)),
        );

        const nextConflicts = updateConflicts(next, config);
        if (value !== null && value !== solution[row][col]) {
          setMistakes((prevMistakes) => prevMistakes + 1);
        }

        if (nextConflicts.size === 0 && isBoardComplete(next, config.subgridHeight, config.subgridWidth)) {
          finalizeGame(next);
        }
        return next;
      });
    },
    [config, finalizeGame, givenCells, solution, status, updateConflicts],
  );

  const provideHint = useCallback(() => {
    if (status !== 'playing') {
      return null;
    }

    let hintCell = null;
    setBoard((prev) => {
      for (let row = 0; row < prev.length; row += 1) {
        for (let col = 0; col < prev[row].length; col += 1) {
          const key = serializeKey(row, col);
          if (givenCells.has(key)) continue;
          if (prev[row][col] !== solution[row][col]) {
            hintCell = { row, col };
            break;
          }
        }
        if (hintCell) break;
      }

      if (!hintCell) {
        return prev;
      }

      const next = prev.map((r, rIndex) =>
        r.map((cell, cIndex) =>
          rIndex === hintCell.row && cIndex === hintCell.col ? solution[rIndex][cIndex] : cell,
        ),
      );
      setHintCount((prevHints) => prevHints + 1);
      updateConflicts(next, config);
      if (isBoardComplete(next, config.subgridHeight, config.subgridWidth)) {
        finalizeGame(next);
      }
      return next;
    });

    return hintCell;
  }, [config, finalizeGame, givenCells, solution, status, updateConflicts]);

  const solvePuzzle = useCallback(() => {
    if (!solution.length) {
      return;
    }
    setBoard(solution.map((row) => row.map((value) => value)));
    setConflicts(new Set());
    finalizeGame(solution, elapsed);
  }, [elapsed, finalizeGame, solution]);


  // save current to localStorage
  useEffect(() => {
    if (!board.length) return; // avoid saving if board is empty

    const currentGame = {
      mode,
      board,
      puzzle,
      solution,
      mistakes,
      hintCount,
      elapsed,
      status,
      givenCells: Array.from(givenCells),
    };

    try {
      // do not influence other modes' saved games
      localStorage.setItem(`kitten-sudoku-${mode}`, JSON.stringify(currentGame));
    } catch (error) {
      console.warn("Failed to save game state:", error);
    }
  }, [board, mistakes, hintCount, elapsed, status, givenCells, mode, puzzle, solution]);





  const value = useMemo(
    () => ({
      mode,
      config,
      board,
      puzzle,
      solution,
      givenCells,
      selectedCell,
      setSelectedCell,
      conflicts,
      mistakes,
      status,
      hintCount,
      bestTimes,
      history,
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
    }),
    [
      bestTimes,
      board,
      clearCell,
      config,
      conflicts,
      elapsed,
      givenCells,
      hintCount,
      history,
      isRunning,
      mistakes,
      mode,
      pause,
      placeNumber,
      provideHint,
      resetCurrentBoard,
      resume,
      selectedCell,
      setSelectedCell,
      solution,
      solvePuzzle,
      startNewGame,
      status,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within <GameProvider>');
  }
  return context;
}
