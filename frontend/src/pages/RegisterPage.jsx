import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [terms, setTerms] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const pwMatch = form.password === form.confirm || form.confirm === '';

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
          <p className="text-[#52525b] text-xs font-mono">CREATE TERMINAL ACCOUNT</p>
        </div>

        <form onSubmit={handleSubmit} className="term-panel p-6 space-y-4">
          <div className="term-panel-header -m-6 mb-4 rounded-t">
            <span className="term-panel-title">Register</span>
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase tracking-wider font-semibold mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Doe" className="term-input w-full py-2" required />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase tracking-wider font-semibold mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="analyst@equimind.io" className="term-input w-full py-2" required />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase tracking-wider font-semibold mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 8 characters" className="term-input w-full py-2 pr-10" required minLength={8} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase tracking-wider font-semibold mb-1.5">Confirm Password</label>
            <input type="password" value={form.confirm} onChange={(e) => update('confirm', e.target.value)} placeholder="Re-enter password" className={`term-input w-full py-2 ${!pwMatch ? 'border-[#ef4444]/50' : ''}`} required />
            {!pwMatch && <p className="text-[10px] text-[#ef4444] mt-1 font-mono">Passwords do not match</p>}
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={terms} onChange={() => setTerms(!terms)} className="w-3 h-3 rounded border-[#27272a] bg-[#18181b] text-[#3b82f6] focus:ring-0 focus:ring-offset-0 mt-0.5" />
            <span className="text-xs text-[#a1a1aa]">I agree to the <a href="#" className="text-[#3b82f6]">Terms of Service</a> and <a href="#" className="text-[#3b82f6]">Privacy Policy</a></span>
          </label>

          <button type="submit" disabled={!terms || !pwMatch} className="term-btn-primary w-full py-2.5 mt-2 disabled:opacity-40 disabled:cursor-not-allowed">
            Create Account
          </button>

          <div className="text-center pt-2 border-t border-[#27272a]">
            <p className="text-xs text-[#52525b]">
              Already have an account? <Link to="/login" className="text-[#3b82f6] hover:text-[#60a5fa] font-semibold transition-colors">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
