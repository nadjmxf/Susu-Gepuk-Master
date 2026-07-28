import React, { useState, useEffect } from 'react';
import menuService from '../services/menuService';

export default function Menu() {
  const [activeTab, setActiveTab] = useState('outlet');
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await menuService.getAllMenus(true);
        if (response && response.data) {
          setMenus(response.data);
        } else {
          setMenus(response || []);
        }
      } catch (error) {
        console.error('Failed to fetch menus:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const getFotoUrl = (fotoPath) => {
    if (!fotoPath) return '/susu.webp';
    if (fotoPath.startsWith('http')) return fotoPath;
    if (fotoPath.includes('-Photoroom')) {
      const webpName = fotoPath.replace(/\.(png|jpe?g)$/i, '.webp');
      return `/drive-download-20260512T105721Z-3-001/${webpName}`;
    }
    const storageBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '/storage');
    return `${storageBaseUrl}/${fotoPath}`;
  };

  // Filter based on activeTab
  const products = menus.filter(m => {
    if (activeTab === 'outlet') return m.kategori_menu === 'Outlet' || m.kategori_menu === 'Keduanya';
    if (activeTab === 'sotr') return m.kategori_menu === 'SOTR' || m.kategori_menu === 'Keduanya';
    return false;
  }).map(m => {
    return {
      id: m.id_menu,
      name: m.nama_menu,
      category: 'Susu Sapi',
      price: Math.floor(m.harga / 1000) + 'K',
      badge: m.tag_menu === 'New' ? 'NEW' : (m.tag_menu === 'Best Seller' ? 'BEST SELLER' : ''),
      badgeColor: m.tag_menu === 'New' ? 'bg-green-500' : (m.tag_menu === 'Best Seller' ? 'bg-red-600' : ''),
      img: getFotoUrl(m.gambar_menu)
    };
  });

  return (
    <section className="py-24 px-8 bg-white max-w-[1400px] mx-auto" id="menu">
      <div className="flex flex-col items-center mb-16">
         <h2 className="text-4xl md:text-4xl text-[#0f2c7a] mb-2 font-rocko tracking-tight">MENU</h2>
        <div className="h-1.5 w-16 bg-[#eab308] rounded-full"></div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row justify-start items-center gap-4 mb-16 mt-8 relative">
        {/* Dashed Line */}
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-full border-b-2 border-dashed border-[#0f2c7a] z-0 opacity-40"></div>

        <button
          onClick={() => setActiveTab('outlet')}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all z-10 border-2 ${activeTab === 'outlet' ? 'bg-[#0f2c7a] text-white border-[#0f2c7a] shadow-[4px_4px_0_0_rgba(17,24,39,1)]' : 'bg-white text-[#0f2c7a] border-[#0f2c7a] hover:bg-blue-50'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          MENU OUTLET {activeTab === 'outlet' && '>'}
        </button>

        <button
          onClick={() => setActiveTab('sotr')}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all z-10 border-2 ${activeTab === 'sotr' ? 'bg-[#0f2c7a] text-white border-[#0f2c7a] shadow-[4px_4px_0_0_rgba(17,24,39,1)]' : 'bg-white text-[#0f2c7a] border-[#0f2c7a] hover:bg-blue-50'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>two_wheeler</span>
          MENU SOTR {activeTab === 'sotr' && '>'}
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f2c7a]"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-bold">
          Belum ada menu yang tersedia.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-[32px] border-2 border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 relative flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
            {/* Badges */}
            {product.badge && (
              <div className={`absolute top-4 left-4 ${product.badgeColor} text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm`}>
                {product.badge}
              </div>
            )}
            <div className="absolute top-4 right-4 bg-[#0f2c7a] text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.price}
            </div>

            {/* Product Image */}
            <div className="w-full h-56 mt-8 mb-4 flex items-center justify-center">
              <img src={product.img} alt={product.name} loading="lazy" className="w-full h-full object-contain drop-shadow-xl" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4].map(star => (
                <span key={star} className="material-symbols-outlined text-yellow-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
              <span className="material-symbols-outlined text-gray-300 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>

            <p className="text-gray-400 text-xs font-medium mb-1 font-label-bold">{product.category}</p>
            <h3 className="text-[#0f2c7a] font-bold text-lg mb-6 text-center">{product.name}</h3>

          </div>
        ))}
      </div>
      )}
    </section>
  );
}
