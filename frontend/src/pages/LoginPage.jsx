import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend auth
  };

  return (
    <div className="min-h-[calc(100vh-48px)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white text-xl font-bold mb-2">
            <Activity className="w-5 h-5 text-[#3b82f6]" />
            EquiMind
          </div>
          <p className="text-[#52525b] text-xs font-mono">SECURE TERMINAL ACCESS</p>
        </div>

        <form onSubmit={handleSubmit} className="term-panel p-6 space-y-4">
          <div className="term-panel-header -m-6 mb-4 rounded-t">
            <span className="term-panel-title">Sign In</span>
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase tracking-wider font-semibold mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@equimind.io"
              className="term-input w-full py-2"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase tracking-wider font-semibold mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="term-input w-full py-2 pr-10"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="w-3 h-3 rounded border-[#27272a] bg-[#18181b] text-[#3b82f6] focus:ring-0 focus:ring-offset-0" />
              <span className="text-xs text-[#a1a1aa]">Remember me</span>
            </label>
            <a href="#" className="text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors">Forgot password?</a>
          </div>

          <button type="submit" className="term-btn-primary w-full py-2.5 mt-2">
            Sign In
          </button>

          <div className="text-center pt-2 border-t border-[#27272a]">
            <p className="text-xs text-[#52525b]">
              No account? <Link to="/register" className="text-[#3b82f6] hover:text-[#60a5fa] font-semibold transition-colors">Create one</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
