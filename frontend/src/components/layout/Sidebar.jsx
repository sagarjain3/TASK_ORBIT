import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Layout, X, Orbit } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) lg:translate-x-0 lg:static lg:inset-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(180deg, #0b0f1a 0%, #161b2d 100%)' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <Link to="/dashboard" className="flex items-center gap-3.5 group" onClick={() => { if (window.innerWidth < 1024) onClose(); }}>
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Orbit className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-none">TaskOrbit</span>
                <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-[0.2em] mt-1">Workspace</span>
              </div>
            </Link>
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto dark-scrollbar">
            <p className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500/80">Main Menu</p>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                  className={`flex items-center gap-3.5 px-5 py-4 text-[14px] font-bold rounded-2xl transition-all duration-500 group relative overflow-hidden ${isActive
                      ? 'text-white bg-gradient-to-r from-indigo-600/20 to-violet-600/5 shadow-[inset_0_0_0_1px_rgba(79,70,229,0.2)]'
                      : 'text-slate-500 hover:text-slate-100 hover:bg-white/[0.04]'
                    }`}
                >
                  {isActive && (
                    <>
                      <span className="absolute left-0 w-1.5 h-7 bg-indigo-500 rounded-r-full shadow-[0_0_20px_rgba(79,70,229,1)]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent animate-pulse" />
                    </>
                  )}
                  <Icon className={`w-5 h-5 transition-all duration-500 ${isActive ? 'text-indigo-400 scale-110 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]' : 'text-slate-500 group-hover:text-indigo-400 group-hover:scale-110'}`} />
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <div className="ml-auto flex items-center gap-1">
                       <span className="w-1 h-1 rounded-full bg-indigo-500 animate-ping" />
                       <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Branding */}
          <div className="px-6 py-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-600">© 2026 TaskOrbit v2.0</p>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
