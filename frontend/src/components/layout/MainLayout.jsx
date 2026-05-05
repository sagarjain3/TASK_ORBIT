import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden relative">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none custom-scrollbar bg-slate-50/30">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
