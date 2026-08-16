import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StockDetailPage from './pages/StockDetailPage';
import ScreenerPage from './pages/ScreenerPage';
import WatchlistPage from './pages/WatchlistPage';
import PortfolioPage from './pages/PortfolioPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand">
            <Link to="/">⚡ EquiMind</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/screener">Screener</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/login">Login</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/stocks/:ticker" element={<StockDetailPage />} />
            <Route path="/screener" element={<ScreenerPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>EquiMind — AI-Enhanced Equity Research Platform</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
