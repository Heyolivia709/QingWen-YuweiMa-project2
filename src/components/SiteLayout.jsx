import { NavLink, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/games', label: 'Selection', end: true },
  { to: '/games/normal', label: 'Normal' },
  { to: '/games/easy', label: 'Easy' },
  { to: '/rules', label: 'Rules' },
  { to: '/scores', label: 'Scores' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
];

export default function SiteLayout() {
  const { user, logout, isAuthenticated } = useUser();

  return (
    <div className="app-shell">
      <header className="nav">
        <div className="inner">
          <NavLink className="brand" to="/" aria-label="Kitten Sudoku Home">
            <span className="logo" aria-hidden="true" />
            <span className="title">Kitten Sudoku</span>
          </NavLink>
          <nav aria-label="Primary">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) => `link${isActive ? ' active' : ''}`}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container">
        {isAuthenticated && (
          <div className="panel user-welcome">
            <div className="user-welcome-content">
              <div>
                <strong>Welcome back, {user.username}</strong>
                <span className="muted user-welcome-message">Good luck and have fun!</span>
              </div>
              <button type="button" onClick={logout} className="user-welcome-button">
                Sign out
              </button>
            </div>
          </div>
        )}
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="row">
            <div>© {new Date().getFullYear()} Kitten Sudoku — React Edition</div>
            <div>
              <NavLink to="/rules">Credits</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
