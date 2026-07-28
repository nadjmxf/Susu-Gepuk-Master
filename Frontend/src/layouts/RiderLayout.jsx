import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import riderService from '../services/riderService';

const getFotoUrl = (fotoPath) => {
  if (!fotoPath) return null;
  if (fotoPath.startsWith('http')) return fotoPath;
  const storageBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '/storage');
  return `${storageBaseUrl}/${fotoPath}`;
};

export default function RiderLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [user, setUser] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.id_rider) {
        riderService.getRiderById(currentUser.id_rider)
          .then((res) => {
            if (res.success && res.data) {
              setUser((prev) => ({ ...prev, ...res.data }));
              localStorage.setItem('user', JSON.stringify({ ...currentUser, ...res.data }));
            }
          })
          .catch((err) => console.log('Gagal memperbarui data rider:', err));
      }
    }
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/rider/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/rider/dashboard', icon: 'dashboard' },
    { name: 'Laporan Penjualan', path: '/rider/Rekap', icon: 'receipt_long' },
    { name: 'Riwayat Penjualan', path: '/rider/riwayat', icon: 'history' },
  ];

  const renderSidebarContent = () => (
    <>
      {/* Profile Section */}
      <div className="p-6 border-b-2 border-gray-200 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#fdd835] rounded-2xl border-4 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex items-center justify-center mb-4 overflow-hidden relative">
          {user?.foto_rider && !imageError ? (
            <img 
              src={getFotoUrl(user.foto_rider)} 
              alt={user?.nama_rider || 'Rider'} 
              className="w-full h-full object-cover" 
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="material-symbols-outlined text-4xl text-gray-900">person</span>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user?.nama_rider || 'Rider'}</h2>
        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
          <span className="material-symbols-outlined text-sm">account_circle</span>
          <span>@{user?.username || 'username'}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-4 transition-all font-bold ${isActive
                ? 'bg-[#fdd835] border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] translate-x-1'
                : 'bg-white border-transparent hover:border-gray-900 hover:shadow-[4px_4px_0_0_rgba(17,24,39,1)] hover:-translate-y-0.5 text-gray-700'
                }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions & Footer */}
      <div className="p-4 border-t-2 border-gray-200 flex flex-col gap-4 mt-8 lg:mt-0">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#fdd835] border-4 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] rounded-xl font-bold hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(17,24,39,1)] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>

        <div className="text-[10px] text-blue-800 font-medium flex flex-col gap-1 mt-2 text-left">
          <p>© 2024 Susu Gepuk<br />Delivery System</p>
          <Link to="#" className="hover:underline">SUPPORT</Link>
          <Link to="#" className="hover:underline">PRIVACY POLICY</Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#1e3a8a] font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r-4 border-gray-900 flex-col z-10 sticky top-0 h-screen shrink-0 shadow-xl justify-between">
        {renderSidebarContent()}
      </aside>

      {/* Sidebar - Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[9999] flex lg:hidden bg-black/60 backdrop-blur-sm">
          <aside className="w-64 bg-white border-r-4 border-gray-900 flex flex-col h-full shadow-xl relative animate-fade-in z-50 justify-between">
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-gray-900 hover:text-blue-800 transition-colors p-1"
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
      <main className="flex-1 overflow-x-hidden flex flex-col">
        {/* Top bar with Logo & Hamburger */}
        <div className="h-16 flex justify-between lg:justify-end items-center px-6 lg:px-8 bg-white border-b-4 border-gray-900 shrink-0 z-10 shadow-sm">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden text-gray-900 flex items-center justify-center p-2 rounded-xl border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all cursor-pointer"
            aria-label="Open Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <img src="/susu.webp" alt="Susu Gepuk" className="h-14" />
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-8 md:p-10 max-w-6xl mx-auto w-full bg-[#1e3a8a] flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
