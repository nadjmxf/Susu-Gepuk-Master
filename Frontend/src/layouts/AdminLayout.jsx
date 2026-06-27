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
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'grid_view' },
    { name: 'Kelola Rider', path: '/admin/riders', icon: 'group' },
    { name: 'Kelola Outlet', path: '/admin/outlets', icon: 'storefront' },
    { name: 'Laporan Penjualan', path: '/admin/reports', icon: 'description' },
  ];

  return (
    <div className="flex min-h-screen bg-[#0A1045] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r-[4px] border-[#3B82F6] flex flex-col z-10 sticky top-0 h-screen shrink-0 p-5 justify-between">
        <div>
          {/* Profile Section */}
          <div className="border-[3px] border-[#3B82F6] rounded-2xl p-4 flex flex-col items-center mb-6">
            <div className="w-[60px] h-[60px] bg-[#FACC15] rounded-xl border-[2.5px] border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-3xl text-black" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
            <h2 className="text-md font-black text-black leading-tight text-center">
              {user?.nama_admin || 'Budi Santoso'}
            </h2>
            <div className="flex items-center mt-1 text-gray-500 font-bold text-[10px]">
              <span className="material-symbols-outlined text-xs mr-0.5 text-red-500">location_on</span>
              <span>Bundaran HI (Pos 1)</span>
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
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#DC2626] text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] rounded-xl font-black text-xs uppercase hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
          
          <div className="text-[9px] text-[#0A1045] font-bold flex flex-col gap-1 px-1">
            <p>© 2024 Susu Gepuk<br/>Delivery System</p>
            <div className="flex gap-2 text-gray-500 font-bold">
              <Link to="#" className="hover:underline">SUPPORT</Link>
              <span>•</span>
              <Link to="#" className="hover:underline">PRIVACY POLICY</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden flex flex-col bg-[#0A1045]">
        {/* Top Floating Logo (Matches Photo) */}
        <div className="flex justify-end items-center px-8 py-5 shrink-0">
          <img src="/susu.png" alt="Susu Gepuk" className="h-10" />
        </div>
        
        {/* Page Content */}
        <div className="px-8 pb-8 flex-1">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
