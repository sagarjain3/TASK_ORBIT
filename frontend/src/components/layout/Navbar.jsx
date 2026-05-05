import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, LogOut, User, ChevronDown } from 'lucide-react';
import ProjectSwitcher from './ProjectSwitcher';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const showProjectSwitcher = location.pathname === '/dashboard';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-20 px-8 bg-white/60 backdrop-blur-2xl border-b border-slate-200/50">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="p-2.5 -ml-2 text-slate-500 rounded-xl lg:hidden hover:bg-slate-100/80 hover:text-indigo-600 focus:outline-none transition-all duration-300"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          {showProjectSwitcher && <ProjectSwitcher />}
        </div>
      </div>

      <div className="relative flex items-center gap-4" ref={dropdownRef}>
        <div className="hidden md:flex flex-col items-end mr-1">
          <span className="text-sm font-bold text-slate-800 leading-none">{user?.name}</span>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">Member</span>
        </div>
        
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-1 focus:outline-none rounded-2xl hover:bg-slate-100/50 transition-all duration-300 group"
        >
          {user?.avatar ? (
            <div className="relative">
              <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-xl ring-2 ring-white shadow-md object-cover" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <span className="text-sm font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
          )}
          <div className="p-1 text-slate-400 group-hover:text-slate-600 transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 w-64 mt-3 origin-top-right bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200/60 top-full animate-fade-in-scale overflow-hidden">
            <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{user?.email}</p>
            </div>
            <div className="p-2">
              <button
                onClick={logout}
                className="flex items-center w-full gap-3 px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50/50 transition-all rounded-xl group"
              >
                <div className="p-1.5 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
