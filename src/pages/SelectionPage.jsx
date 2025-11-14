import { Link } from 'react-router-dom';

const GAMES = [
  {
    slug: 'sunrise-warmup',
    title: 'Sunrise Warmup',
    difficulty: 'Easy',
    author: 'Qing Wen',
    description: 'A gentle 6×6 board to stretch your logic muscles and practice fast singles.',
    path: '/games/easy',
  },
  {
    slug: 'meadow-mixer',
    title: 'Meadow Mixer',
    difficulty: 'Easy',
    author: 'Yuwei Ma',
    description: 'Playful patterns, light deductions, perfect for coffee breaks.',
    path: '/games/easy',
  },
  {
    slug: 'starlit-logic',
    title: 'Starlit Logic',
    difficulty: 'Normal',
    author: 'Qing Wen',
    description: 'Classic 9×9 challenge with crisp subgrid symmetry and satisfying chains.',
    path: '/games/normal',
  },
  {
    slug: 'nebula-night',
    title: 'Nebula Night',
    difficulty: 'Normal',
    author: 'Yuwei Ma',
    description: 'Tougher 9×9 grid featuring advanced hidden pairs and line interactions.',
    path: '/games/normal',
  },
];

export default function SelectionPage() {
  return (
    <section className="games-grid">
      {GAMES.map((game) => (
        <article key={game.slug} className="panel card-hover">
          <span className="pill">{game.difficulty}</span>
          <h2 className="mt-0">
            <Link to={game.path}>{game.title}</Link>
          </h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>By {game.author}</p>
          <p>{game.description}</p>
          <Link to={game.path} className="link" style={{ fontWeight: 700 }}>
            Play {game.difficulty.toLowerCase()} puzzle →
          </Link>
        </article>
      ))}
    </section>
  );
}
