import { Route, Routes } from 'react-router-dom';
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

import { useLocation } from 'react-router-dom'; // import useLocation

export default function App() {
  // useLocation to get current path
  const location = useLocation();

  return (
    <UserProvider>
      <GameProvider>
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
