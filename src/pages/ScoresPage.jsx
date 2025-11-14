const SCORE_ROWS = [
  { rank: 1, username: 'LogicLion', completed: 152, favoriteMode: 'Normal' },
  { rank: 2, username: 'GridGuru', completed: 140, favoriteMode: 'Easy' },
  { rank: 3, username: 'PencilQueen', completed: 133, favoriteMode: 'Normal' },
  { rank: 4, username: 'MatrixFox', completed: 120, favoriteMode: 'Normal' },
  { rank: 5, username: 'SilentSolver', completed: 118, favoriteMode: 'Easy' },
  { rank: 6, username: 'NineByNine', completed: 112, favoriteMode: 'Normal' },
  { rank: 7, username: 'JoyfulDigits', completed: 101, favoriteMode: 'Easy' },
  { rank: 8, username: 'PuzzleTide', completed: 98, favoriteMode: 'Normal' },
  { rank: 9, username: 'HintHunter', completed: 92, favoriteMode: 'Easy' },
  { rank: 10, username: 'NeonKnight', completed: 87, favoriteMode: 'Normal' },
];

export default function ScoresPage() {
  return (
    <div className="panel">
      <h1 className="page-title">High Scores</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        Mock leaderboard featuring our top playtesters and the number of Sudoku boards they have completed.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>#</th>
              <th style={{ textAlign: 'left' }}>Username</th>
              <th style={{ width: '150px', textAlign: 'right' }}>Completed</th>
            </tr>
          </thead>
          <tbody>
            {SCORE_ROWS.map((row) => (
              <tr key={row.rank}>
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>{row.rank}</td>
                <td style={{ fontWeight: 600 }}>{row.username}</td>
                <td style={{ textAlign: 'right', color: 'var(--muted)' }}>{row.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
