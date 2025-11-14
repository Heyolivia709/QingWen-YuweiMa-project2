# Kitten Sudoku — React Edition
A lightweight Sudoku web app built with React + Vite, based on the static HTML/CSS version from Project 1.
This version adds real game logic: puzzle generation, rule validation, page routing, a timer, and basic local storage persistence.

##  Highlights

- **Two Game Modes**: 6×6 (Easy) and 9×9 (Hard) boards generated on the fly.
- **Smart Validation**: Instant conflict detection for rows, columns, and subgrids.
- **Assist Tools**: In-browser solver, hint system, pause/resume timer.
- **Run History & Leaderboard**: Best times and recent games stored locally via `localStorage`.
- **Responsive UI**: Reuses the dark, neon-styled design and adapts smoothly to mobile.

##  Tech Stack

- Frontend: React 19, React Router 7
- State: Context API + custom hooks
- Build: Vite 7
- Styling: Hand-crafted CSS (ported from the original project)

##  Project Structure

```
sudoku-project/
├── public/             # static assets (kitten.png)
├── src/
│   ├── components/     # layout components
│   ├── context/        # GameContext + UserContext (mock only)
│   ├── hooks/          # useGameTimer, useLocalStorage
│   ├── lib/            # sudoku generation + validation logic
│   ├── pages/          # all route pages
│   └── styles/         # shared CSS
├── index.html
├── package.json
└── vite.config.js
```

##  Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` by default.

Production build:

```bash
npm run build
```

##  State Management

- `UserContext`:  Placeholder for future user state (login/register pages are mock-only for this assignment).
- `GameContext`: Centralizes the board state, timer, hints, history, leaderboards, and mode selection.
- `useGameTimer`: Lightweight timer built on `requestAnimationFrame` with pause/resume support.
- `useLocalStorage`: JSON-backed read/write helper for persistent data.

##  Sudoku Logic

- `generatePuzzleByMode`: Produces valid solved boards and carves puzzles per difficulty.
- `collectConflicts`: Scans rows, columns, and subgrids to highlight duplicates.
- `solveBoard`: Backtracking solver used by hints and the auto-solve action.

##  Page Overview

- `Home`: Welcome card, best times, and recent runs.
- `Game/Easy` & `Game/Hard`: Playable boards with tools, notes, and timer controls.
- `Selection`: Mode descriptions and quick-start buttons.
- `High Scores`: Filterable leaderboard with personal best summary.
- `Rules`: How-to-play guide and project highlights.
- `Login` / `Register`: Local account management mock.

##  Write-up Notes

Write-up Notes Included separately
