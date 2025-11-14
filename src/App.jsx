import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { GameProvider } from './context/GameContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import SiteLayout from './components/SiteLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import GamePage from './pages/GamePage.jsx';
import SelectionPage from './pages/SelectionPage.jsx';
import RulesPage from './pages/RulesPage.jsx';
import ScoresPage from './pages/ScoresPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Component to handle GitHub Pages 404 redirect
function GitHubPagesRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle GitHub Pages redirect format: /?/path
    if (location.search.startsWith('?/')) {
      const path = location.search.slice(2).replace(/~and~/g, '&');
      navigate(path + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <UserProvider>
      <GameProvider>
        <GitHubPagesRedirect />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="games" element={<SelectionPage />} />

                                                        
            <Route path="games/easy" element={<GamePage  key={location.pathname} mode="easy" />} />
            <Route path="games/normal" element={<GamePage key={location.pathname}  mode="normal" />} />

            
            <Route path="rules" element={<RulesPage />} />
            <Route path="scores" element={<ScoresPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </GameProvider>
    </UserProvider>
  );
}
