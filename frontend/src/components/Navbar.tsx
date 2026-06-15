import { Link, useLocation } from 'react-router-dom';
import { Telescope, Settings, Star } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <nav className="relative z-10 border-b border-cosmos-800/50 bg-slate-900/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Telescope className="w-8 h-8 text-cosmos-400 group-hover:text-cosmos-300 transition-colors" />
              <Star className="w-4 h-4 text-starlight-400 absolute -top-1 -right-1 animate-twinkle" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold bg-gradient-to-r from-cosmos-300 via-starlight-300 to-cosmos-300 bg-clip-text text-transparent">
                星空天文台
              </h1>
              <p className="text-xs text-slate-400">Starlight Observatory</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                !isAdmin
                  ? 'bg-cosmos-600/30 text-cosmos-300 border border-cosmos-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Telescope className="w-4 h-4" />
              预约观星
            </Link>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isAdmin
                  ? 'bg-cosmos-600/30 text-cosmos-300 border border-cosmos-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              管理中心
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
