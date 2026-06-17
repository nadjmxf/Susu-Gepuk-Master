import React, { useState } from 'react';

const outletProducts = [
  { id: 1, name: 'Melon Frost', category: 'Susu Sapi', price: '12K', badge: 'BEST SELLER', badgeColor: 'bg-red-600', img: '/drive-download-20260512T105721Z-3-001/Susu Melon Frost-Photoroom.png',  },
  { id: 2, name: 'Susu Coklat Swiz', category: 'Susu Sapi', price: '12K', badge: 'NEW', badgeColor: 'bg-green-500 ', img: '/drive-download-20260512T105721Z-3-001/Susu Coklat Swiz-Photoroom.png' },
  { id: 3, name: 'Susu Kopi', category: 'Susu Sapi', price: '12K', badge: '', badgeColor: '', img: '/drive-download-20260512T105721Z-3-001/Susu Kopi-Photoroom.png' },
  { id: 4, name: 'Susu Matcha Kyoto', category: 'Susu Sapi', price: '12K', badge: 'BEST SELLER', badgeColor: 'bg-red-600', img: '/drive-download-20260512T105721Z-3-001/Susu Matcha Kyoto-Photoroom.png' },
  { id: 5, name: 'Susu Murni Botol', category: 'Susu Sapi', price: '15K', badge: '', badgeColor: '', img: '/drive-download-20260512T105721Z-3-001/Susu Murni Botol-Photoroom.png' },
  { id: 6, name: 'Susu Strawberry', category: 'Susu Sapi', price: '12K', badge: '', badgeColor: '', img: '/drive-download-20260512T105721Z-3-001/Susu Strawberry-Photoroom.png' },
  { id: 7, name: 'Susu Vanilla Sweet', category: 'Susu Sapi', price: '12K', badge: '', badgeColor: '', img: '/drive-download-20260512T105721Z-3-001/Susu Vanilla Sweet-Photoroom.png' },
];

const sotrProducts = [
  { id: 1, name: 'Melon Frost', category: 'Susu Sapi', price: '12K', badge: 'BEST SELLER', badgeColor: 'bg-red-600', img: '/drive-download-20260512T105721Z-3-001/Susu Melon Frost-Photoroom.png' },
  { id: 2, name: 'Susu Coklat Swiz', category: 'Susu Sapi', price: '12K', badge: '', badgeColor: '', img: '/drive-download-20260512T105721Z-3-001/Susu Coklat Swiz-Photoroom.png' },
  { id: 3, name: 'Susu Strawberry', category: 'Susu Sapi', price: '12K', badge: 'NEW', badgeColor: 'bg-green-500', img: '/drive-download-20260512T105721Z-3-001/Susu Strawberry-Photoroom.png' },
  { id: 4, name: 'Susu Vanilla Sweet', category: 'Susu Sapi', price: '12K', badge: '', badgeColor: '', img: '/drive-download-20260512T105721Z-3-001/Susu Vanilla Sweet-Photoroom.png' },
    { id: 5, name: 'Susu Murni Botol', category: 'Susu Sapi', price: '15K', badge: '', badgeColor: '', img: '/drive-download-20260512T105721Z-3-001/Susu Murni Botol-Photoroom.png' },

];

export default function Menu() {
  const [activeTab, setActiveTab] = useState('outlet');
  const products = activeTab === 'outlet' ? outletProducts : sotrProducts;

  return (
    <section className="py-24 px-8 bg-white max-w-[1400px] mx-auto" id="menu">
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-4xl font-bold text-[#1e40af] mb-2 font-display-lg uppercase tracking-wider">MENU</h2>
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
              <img src={product.img} alt={product.name} className="w-full h-full object-contain drop-shadow-xl" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4].map(star => (
                <span key={star} className="material-symbols-outlined text-yellow-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
              <span className="material-symbols-outlined text-gray-300 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>

            <p className="text-gray-400 text-xs font-medium mb-1 font-label-bold">{product.category}</p>
            <h3 className="text-[#0f2c7a] font-bold text-lg mb-6">{product.name}</h3>

            
          </div>
        ))}
      </div>
    </section>
  );
}
