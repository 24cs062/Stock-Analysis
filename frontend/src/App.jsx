import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart2, PieChart, Activity, Settings, Search, Monitor, LogOut, Newspaper, ArrowLeftRight } from 'lucide-react';

import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StockDetailPage from './pages/StockDetailPage';
import ScreenerPage from './pages/ScreenerPage';
import WatchlistPage from './pages/WatchlistPage';
import PortfolioPage from './pages/PortfolioPage';
import MarketPage from './pages/MarketPage';
import NewsPage from './pages/NewsPage';
import ComparePage from './pages/ComparePage';
import './index.css';

const SidebarItem = ({ icon: Icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link to={path} className="block w-full mb-0.5">
      <div className={`flex items-center px-4 py-2 text-sm transition-colors border-l-2 ${isActive ? 'bg-[#edf4ff] border-[#1457d9] text-[#1457d9]' : 'border-transparent text-[#17324f] hover:bg-[#edf1f6] hover:text-[#10213b]'}`}>
        <Icon className="w-4 h-4 mr-3" strokeWidth={1.5} />
        <span className="font-medium tracking-tight">{label}</span>
      </div>
    </Link>
  );
};

 
const Topbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim() !== '') {
      navigate(`/stocks/${search.trim().toUpperCase()}`);
      setSearch('');
    }
  };

  return (
    <header className="h-12 border-b border-[#edf1f6] bg-white flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center">
        <Monitor className="w-4 h-4 text-[#2563eb] mr-2" />
        <span className="text-[#10213b] font-bold tracking-widest text-sm uppercase">EquiMind</span>
        <span className="text-[#e6ebf2] mx-4">|</span>
        <span className="text-[#91a0b4] text-xs font-mono">SYS.STAT: ONLINE</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#91a0b4]" />
          <input 
            type="text" 
            placeholder="Search symbol (e.g. AAPL)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="pl-8 pr-3 py-1 bg-[#fafcff] border border-[#e6ebf2] rounded text-xs text-[#10213b] focus:outline-none focus:border-[#2563eb] transition-all w-64 placeholder:text-[#91a0b4] font-mono"
          />
        </div>
        <div className="w-6 h-6 rounded bg-[#f7f9fc] flex items-center justify-center cursor-pointer border border-[#e6ebf2]">
          <Settings className="w-3.5 h-3.5 text-[#516174]" />
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#09090b] text-[#e4e4e7] font-sans selection:bg-[#2563eb]/20">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-56 bg-white border-r border-[#edf1f6] flex flex-col py-4 hidden md:flex">
            <div className="px-4 mb-2 text-[10px] font-bold text-[#52525b] uppercase tracking-wider">Trading</div>
            <SidebarItem icon={LayoutDashboard} label="Terminal" path="/" />
            <SidebarItem icon={Activity} label="Watchlist" path="/watchlist" />
            <SidebarItem icon={PieChart} label="Portfolio" path="/portfolio" />
            
            <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-[#52525b] uppercase tracking-wider">Analysis</div>
            <SidebarItem icon={BarChart2} label="Screener" path="/screener" />
            <SidebarItem icon={Monitor} label="Markets" path="/market" />
            <SidebarItem icon={Newspaper} label="News" path="/news" />
            <SidebarItem icon={ArrowLeftRight} label="Compare" path="/compare" />
            
            <div className="mt-auto px-4">
              <Link to="/login" className="flex items-center text-[#516174] hover:text-[#1457d9] text-sm py-2">
                <LogOut className="w-4 h-4 mr-3" strokeWidth={1.5} />
                Sign Out
              </Link>
            </div>
          </aside>
          
          <main className="flex-1 overflow-y-auto relative">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/stocks/:ticker" element={<StockDetailPage />} />
              <Route path="/screener" element={<ScreenerPage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/compare" element={<ComparePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
