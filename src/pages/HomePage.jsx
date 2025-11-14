import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { formatElapsed } from '../lib/sudoku.js';

export default function HomePage() {
  const { bestTimes, history } = useGame();
  const recentGames = history.slice(0, 3);

  return (
    <section className="grid-2">
      <div className="panel card-hover">
        <span className="pill">Welcome</span>
        <img src="/kitten.png" alt="Cute kitten mascot" className="kitten-img" />
        <h1 className="page-title">Kitten Sudoku</h1>
        <p>Build logic, not bugs. This edition uses React, the Context API, and local storage for a fully interactive experience.</p>
        <p>
          Ready for a challenge? Warm up with the
          <Link to="/games/easy"> 6×6 easy mode </Link>
          and then conquer the
          <Link to="/games/normal"> 9×9 normal mode</Link>!
        </p>
        
        <ul className="clean mt-18" style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li><Link to="/games/normal">Try: Normal mode</Link></li>
          <li><Link to="/games/easy">Try: Easy mode</Link></li>
          <li><Link to="/games">Pick a new puzzle</Link></li>
        </ul> 


      </div>

      <aside className="panel">
        <h2 className="mt-0">Best Times</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
          {['easy', 'normal'].map((mode) => {
            const record = bestTimes[mode];
            return (
              <li key={mode} className="card-hover" style={{ padding: '12px', borderRadius: '12px', background: 'rgba(148,163,184,.08)' }}>
                <strong>{mode === 'easy' ? 'Easy mode' : 'Normal mode'}</strong>
                <div className="muted" style={{ marginTop: 6 }}>
                  {record
                    ? `Best time: ${formatElapsed(record.elapsed)} · Player: ${record.player}`
                    : 'No completed runs yet—start playing!'}
                </div>
              </li>
            );
          })}
        </ul>

        <h3 style={{ marginTop: 24 }}>Recent Runs</h3>
        {recentGames.length === 0 ? (
          <p className="muted">No history yet. Start your first puzzle!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
            {recentGames.map((game) => {
              const label = game.mode === 'easy' ? 'Easy' : 'Normal';
              return (
                <li key={game.id} style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(14,23,41,.8)' }}>
                  <div>
                    <strong>{label}</strong>
                    <span className="muted" style={{ marginLeft: 8 }}>{formatElapsed(game.elapsed)}</span>
                  </div>
                  <div className="muted" style={{ fontSize: '.85rem' }}>
                    {new Date(game.finishedAt).toLocaleString()} · Mistakes {game.mistakes} · Hints {game.hints}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </section>
  );
}
