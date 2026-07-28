import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [user, setUser] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'grid_view' },
    { name: 'Kelola Rider', path: '/admin/riders', icon: 'group' },
    { name: 'Kelola Outlet', path: '/admin/outlets', icon: 'storefront' },
    { name: 'Laporan Penjualan', path: '/admin/reports', icon: 'description' },
  ];

  const renderSidebarContent = () => (
    <>
      <div>
        {/* Profile Section */}
        <div className=" rounded-2xl p-4 flex flex-col items-center mb-6">
          <div className="w-[60px] h-[60px] bg-[#FACC15] rounded-xl border-[2.5px] border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-3xl text-black" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <h2 className="text-md font-black text-black leading-tight text-center">
            {user?.nama_admin || user?.nama || user?.name || 'Administrator'}
          </h2>
          <div className="flex items-center mt-1 text-gray-500 font-bold text-[10px]">
            <span className="material-symbols-outlined text-xs mr-0.5 text-red-500">location_on</span>
            <span>{user?.area || 'Pusat (Headquarters)'}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-[3px] border-black font-black text-xs transition-all shadow-[4px_4px_0_0_#000] ${
                  isActive
                    ? 'bg-[#FACC15] text-black translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0_0_#000]'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] shrink-0" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className="leading-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout & Footer */}
      <div className="flex flex-col gap-4 mt-8 lg:mt-0">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#DC2626] text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] rounded-xl font-black text-xs uppercase hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
        
        <div className="text-[9px] text-[#0A1045] font-bold flex flex-col gap-1 px-1 text-left">
          <p>© 2024 Susu Gepuk<br/>Delivery System</p>
          <div className="flex gap-2 text-gray-500 font-bold">
            <Link to="#" className="hover:underline">SUPPORT</Link>
            <span>•</span>
            <Link to="#" className="hover:underline">PRIVACY POLICY</Link>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#1e3a8a] font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r-[4px] border-[#3B82F6] flex-col z-10 sticky top-0 h-screen shrink-0 p-5 justify-between">
        {renderSidebarContent()}
      </aside>

      {/* Sidebar - Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[9999] flex lg:hidden bg-black/60 backdrop-blur-sm">
          <aside className="w-64 bg-white border-r-[4px] border-[#3B82F6] flex flex-col h-full p-5 justify-between relative animate-fade-in z-50">
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-black hover:text-[#3B82F6] transition-colors p-1"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-2xl font-bold">close</span>
            </button>
            {renderSidebarContent()}
          </aside>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden flex flex-col bg-[#1e3a8a]">
        {/* Top Header Logo & Hamburger */}
        <div className="flex justify-between lg:justify-end items-center px-6 py-4 lg:px-8 lg:py-5 shrink-0 bg-[#1e3a8a] lg:bg-transparent border-b-[3px] border-[#3B82F6] lg:border-none shadow-md lg:shadow-none">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden text-white flex items-center justify-center p-2 rounded-xl border-2 border-white hover:bg-white hover:text-[#1e3a8a] transition-all cursor-pointer"
            aria-label="Open Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <img src="/Susuputih (1).webp" alt="Susu Gepuk" className="h-8 lg:h-10" />
        </div>
        
        {/* Page Content */}
        <div className="px-4 py-4 md:px-8 md:pb-8 flex-1">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
