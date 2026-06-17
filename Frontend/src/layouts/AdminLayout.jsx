import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Kelola Data Rider', path: '/admin/riders', icon: 'manage_accounts' },
    { name: 'Monitor Lokasi Rider', path: '/admin/monitor', icon: 'location_on' },
    { name: 'Kelola Data Outlet', path: '/admin/outlets', icon: 'storefront' },
    { name: 'Kelola Announcement', path: '/admin/announcement', icon: 'campaign' },
  ];

  return (
    <div className="flex min-h-screen bg-[#1e3a8a] font-sans">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r-4 border-gray-900 flex flex-col z-10 sticky top-0 h-screen shrink-0 shadow-xl">
        
        {/* Profile Section */}
        <div className="p-5 border-b-2 border-gray-200 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#fdd835] rounded-2xl border-4 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <h2 className="text-lg font-black text-gray-900">{user?.nama_admin || 'Admin'}</h2>
          <p className="text-xs text-gray-600 mt-1">@{user?.username}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-4 transition-all font-bold text-sm ${
                  isActive
                    ? 'bg-[#fdd835] border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)]'
                    : 'bg-white border-transparent hover:border-gray-900 hover:shadow-[4px_4px_0_0_rgba(17,24,39,1)] text-gray-700'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] shrink-0" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                <span className="leading-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout & Footer */}
        <div className="p-3 border-t-2 border-gray-200 flex flex-col gap-3">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-[#fdd835] border-4 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] rounded-xl font-bold text-sm hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(17,24,39,1)] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
          <div className="text-[10px] text-blue-800 font-medium flex flex-col gap-1 px-1">
            <p>© 2024 Susu Gepuk<br/>Delivery System</p>
            <Link to="#" className="hover:underline">SUPPORT</Link>
            <Link to="#" className="hover:underline">PRIVACY POLICY</Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden flex flex-col">
        {/* Top bar */}
        <div className="h-14 flex justify-end items-center px-8 bg-white border-b-4 border-gray-900 shrink-0 shadow-sm">
          <img src="/susu.png" alt="Susu Gepuk" className="h-7" />
        </div>
        {/* Page Content */}
        <div className="p-8 flex-1 bg-[#1e3a8a]">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
