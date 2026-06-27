import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function Outlets() {
  // ----------------------------------------------------
  // 1. DATA MOCK AWAL (STATE)
  // ----------------------------------------------------

  // Slider Banner States
  const [sliders, setSliders] = useState([
    {
      id: 1,
      title: 'Promo Ramadhan Berkah',
      status: true,
      image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&q=80&w=300'
    },
    {
      id: 2,
      title: 'Grand Opening Outlet Bekasi',
      status: false,
      image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=300'
    }
  ]);

  // Product Menu States
  const [menus, setMenus] = useState([
    {
      id: 1,
      nama: 'Susu Segar Original',
      deskripsi: 'Varian Murni Tanpa Perisa',
      harga: 10000,
      foto: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=150',
      kategori: ['Tetap', 'SOTR'],
      label: 'BEST SELLER'
    },
    {
      id: 2,
      nama: 'Susu Cokelat Premium',
      deskripsi: 'Kakao Belgia 70%',
      harga: 12000,
      foto: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=150',
      kategori: ['SOTR'],
      label: 'BARU'
    },
    {
      id: 3,
      nama: 'Susu Matcha Latte',
      deskripsi: 'Premium Uji Matcha Powder',
      harga: 15000,
      foto: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=150',
      kategori: ['Tetap', 'SOTR'],
      label: ''
    }
  ]);

  // Outlet Tetap States
  const [fixedOutlets, setFixedOutlets] = useState([
    {
      id: 1,
      nama: 'Pasar Kebon Jeruk',
      lokasi: 'Jl. Raya Kebon Jeruk No.12',
      status_outlet: 'Aktif', // Toggle status
      status_operasional: 'BUKA' // BUKA / TUTUP badge
    },
    {
      id: 2,
      nama: 'Cabang BSD Plaza',
      lokasi: 'BSD Plaza, Sektor IV',
      status_outlet: 'Aktif',
      status_operasional: 'BUKA'
    },
    {
      id: 3,
      nama: 'Cabang Bintaro Xchange',
      lokasi: 'Bintaro Jaya Xchange Mall',
      status_outlet: 'Nonaktif',
      status_operasional: 'TUTUP'
    }
  ]);

  // SOTR (Mobile Outlet) States
  const [sotrUnits, setSotrUnits] = useState([
    {
      id: 1,
      unit: 'SOTR Unit-A1',
      rider: 'Budi Santoso',
      foto_rider: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      status_sotr: 'Aktif',
      status_operasional: 'BUKA',
      area: 'Marpoyan - Simpang Tiga'
    },
    {
      id: 2,
      unit: 'SOTR Unit-A3',
      rider: 'Agus Prasetyo',
      foto_rider: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      status_sotr: 'Aktif',
      status_operasional: 'BUKA',
      area: 'Panam'
    },
    {
      id: 3,
      unit: 'SOTR Unit-D1',
      rider: 'Belum Ditugaskan',
      foto_rider: '',
      status_sotr: 'Aktif',
      status_operasional: 'TUTUP',
      area: 'Arifin Ahmad'
    }
  ]);

  // Available Riders for Dropdowns
  const ridersList = [
    { nama: 'Budi Santoso', foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' },
    { nama: 'Agus Prasetyo', foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
    { nama: 'Ahmad Pratama', foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
    { nama: 'Reza Wijaya', foto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100' }
  ];

  // ----------------------------------------------------
  // 2. SEARCH & FILTERING STATE
  // ----------------------------------------------------
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('Semua'); // Semua | Outlet Tetap | SOTR

  // ----------------------------------------------------
  // 3. CONFIRMATION POPUP STATES (Outlet Switch)
  // ----------------------------------------------------
  const [isConfirmStatusOpen, setIsConfirmStatusOpen] = useState(false);
  const [statusConfirmType, setStatusConfirmType] = useState('fixed'); // fixed | sotr
  const [pendingConfirmItem, setPendingConfirmItem] = useState(null); // outlet object
  const [pendingConfirmValue, setPendingConfirmValue] = useState(''); // Aktif | Nonaktif

  // ----------------------------------------------------
  // 4. ADD / EDIT FORM MODAL STATES
  // ----------------------------------------------------
  
  // Menu Modal Form
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuEditMode, setMenuEditMode] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    nama: '',
    harga: 0,
    kategori: [], // Tetap, SOTR
    label: '', // BEST SELLER, BARU, TERLARIS
    foto: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=150',
    deskripsi: ''
  });

  // Fixed Outlet Modal Form
  const [isFixedModalOpen, setIsFixedModalOpen] = useState(false);
  const [fixedEditMode, setFixedEditMode] = useState(false);
  const [selectedFixedId, setSelectedFixedId] = useState(null);
  const [fixedFormData, setFixedFormData] = useState({
    nama: '',
    lokasi: '',
    status_outlet: 'Aktif',
    status_operasional: 'BUKA'
  });

  // SOTR Unit Modal Form
  const [isSotrModalOpen, setIsSotrModalOpen] = useState(false);
  const [sotrEditMode, setSotrEditMode] = useState(false);
  const [selectedSotrId, setSelectedSotrId] = useState(null);
  const [sotrFormData, setSotrFormData] = useState({
    unit: '',
    rider: 'Belum Ditugaskan',
    area: 'Marpoyan - Simpang Tiga',
    status_sotr: 'Aktif',
    status_operasional: 'BUKA'
  });

  // ----------------------------------------------------
  // 5. EVENT HANDLERS
  // ----------------------------------------------------

  // Slider Toggle Status
  const handleToggleSlider = (sliderId) => {
    setSliders(prev => prev.map(s => s.id === sliderId ? { ...s, status: !s.status } : s));
  };

  // Slider Deletion
  const handleDeleteSlider = (sliderId) => {
    setSliders(prev => prev.filter(s => s.id !== sliderId));
  };

  // Add new slider (Mock)
  const handleAddSlider = () => {
    const newSlider = {
      id: Date.now(),
      title: 'Promo Diskon Akhir Pekan',
      status: true,
      image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=300'
    };
    setSliders([...sliders, newSlider]);
  };

  // Toggle Switch for Outlet Status (Fixed & SOTR) - Triggers Confirmation Pop-up
  const handleToggleOutletStatus = (item, type) => {
    setStatusConfirmType(type);
    setPendingConfirmItem(item);
    const currentValue = type === 'fixed' ? item.status_outlet : item.status_sotr;
    const targetValue = currentValue === 'Aktif' ? 'Nonaktif' : 'Aktif';
    setPendingConfirmValue(targetValue);
    setIsConfirmStatusOpen(true);
  };

  // Confirmed Status Change
  const handleConfirmStatusChange = () => {
    if (!pendingConfirmItem) return;

    if (statusConfirmType === 'fixed') {
      setFixedOutlets(prev => prev.map(o => {
        if (o.id === pendingConfirmItem.id) {
          return {
            ...o,
            status_outlet: pendingConfirmValue,
            status_operasional: pendingConfirmValue === 'Aktif' ? 'BUKA' : 'TUTUP'
          };
        }
        return o;
      }));
    } else {
      setSotrUnits(prev => prev.map(u => {
        if (u.id === pendingConfirmItem.id) {
          return {
            ...u,
            status_sotr: pendingConfirmValue,
            status_operasional: pendingConfirmValue === 'Aktif' ? 'BUKA' : 'TUTUP',
            // If deactivated, reset rider
            rider: pendingConfirmValue === 'Nonaktif' ? 'Belum Ditugaskan' : u.rider,
            foto_rider: pendingConfirmValue === 'Nonaktif' ? '' : u.foto_rider
          };
        }
        return u;
      }));
    }
    setIsConfirmStatusOpen(false);
    setPendingConfirmItem(null);
  };

  // delete operations
  const handleDeleteProduct = (id) => {
    setMenus(prev => prev.filter(m => m.id !== id));
  };

  const handleDeleteFixedOutlet = (id) => {
    setFixedOutlets(prev => prev.filter(o => o.id !== id));
  };

  const handleDeleteSotrUnit = (id) => {
    setSotrUnits(prev => prev.filter(u => u.id !== id));
  };

  // ----------------------------------------------------
  // 6. FORM SAVE ACTION HANDLERS
  // ----------------------------------------------------

  // Save Menu
  const handleSaveMenu = (e) => {
    e.preventDefault();
    if (!menuFormData.nama.trim()) return;

    if (menuEditMode) {
      setMenus(prev => prev.map(m => m.id === selectedMenuId ? { ...m, ...menuFormData } : m));
    } else {
      const newMenu = {
        id: Date.now(),
        ...menuFormData
      };
      setMenus([...menus, newMenu]);
    }
    setIsMenuModalOpen(false);
  };

  // Open Menu Add/Edit Modals
  const openAddMenu = () => {
    setMenuEditMode(false);
    setMenuFormData({
      nama: '',
      harga: 0,
      kategori: ['Tetap'],
      label: 'BEST SELLER',
      foto: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=150',
      deskripsi: 'Varian Susu Gepuk Segar'
    });
    setIsMenuModalOpen(true);
  };

  const openEditMenu = (menu) => {
    setMenuEditMode(true);
    setSelectedMenuId(menu.id);
    setMenuFormData({
      nama: menu.nama,
      harga: menu.harga,
      kategori: menu.kategori || [],
      label: menu.label || '',
      foto: menu.foto,
      deskripsi: menu.deskripsi || ''
    });
    setIsMenuModalOpen(true);
  };

  // Save Fixed Outlet
  const handleSaveFixedOutlet = (e) => {
    e.preventDefault();
    if (!fixedFormData.nama.trim()) return;

    if (fixedEditMode) {
      setFixedOutlets(prev => prev.map(o => o.id === selectedFixedId ? { ...o, ...fixedFormData } : o));
    } else {
      const newOutlet = {
        id: Date.now(),
        ...fixedFormData
      };
      setFixedOutlets([...fixedOutlets, newOutlet]);
    }
    setIsFixedModalOpen(false);
  };

  // Open Fixed Outlet Add/Edit Modals
  const openAddFixed = () => {
    setFixedEditMode(false);
    setFixedFormData({
      nama: '',
      lokasi: '',
      status_outlet: 'Aktif',
      status_operasional: 'BUKA'
    });
    setIsFixedModalOpen(true);
  };

  const openEditFixed = (outlet) => {
    setFixedEditMode(true);
    setSelectedFixedId(outlet.id);
    setFixedFormData({
      nama: outlet.nama,
      lokasi: outlet.lokasi,
      status_outlet: outlet.status_outlet,
      status_operasional: outlet.status_operasional
    });
    setIsFixedModalOpen(true);
  };

  // Save SOTR Unit
  const handleSaveSotrUnit = (e) => {
    e.preventDefault();
    if (!sotrFormData.unit.trim()) return;

    const matchedRider = ridersList.find(r => r.nama === sotrFormData.rider);

    if (sotrEditMode) {
      setSotrUnits(prev => prev.map(u => u.id === selectedSotrId ? {
        ...u,
        ...sotrFormData,
        foto_rider: matchedRider ? matchedRider.foto : ''
      } : u));
    } else {
      const newUnit = {
        id: Date.now(),
        ...sotrFormData,
        foto_rider: matchedRider ? matchedRider.foto : ''
      };
      setSotrUnits([...sotrUnits, newUnit]);
    }
    setIsSotrModalOpen(false);
  };

  // Open SOTR Add/Edit Modals
  const openAddSotr = () => {
    setSotrEditMode(false);
    setSotrFormData({
      unit: '',
      rider: 'Belum Ditugaskan',
      area: 'Marpoyan - Simpang Tiga',
      status_sotr: 'Aktif',
      status_operasional: 'BUKA'
    });
    setIsSotrModalOpen(true);
  };

  const openEditSotr = (unit) => {
    setSotrEditMode(true);
    setSelectedSotrId(unit.id);
    setSotrFormData({
      unit: unit.unit,
      rider: unit.rider,
      area: unit.area,
      status_sotr: unit.status_sotr,
      status_operasional: unit.status_operasional
    });
    setIsSotrModalOpen(true);
  };

  // ----------------------------------------------------
  // 7. FILTER PRODUCTS LOGIC
  // ----------------------------------------------------
  const filteredProducts = menus.filter(product => {
    const matchesSearch = product.nama.toLowerCase().includes(productSearch.toLowerCase());
    
    if (productCategory === 'Semua') {
      return matchesSearch;
    } else if (productCategory === 'Outlet Tetap') {
      return matchesSearch && product.kategori.includes('Tetap');
    } else if (productCategory === 'SOTR') {
      return matchesSearch && product.kategori.includes('SOTR');
    }
    return matchesSearch;
  });

  return (
    <div className="w-full space-y-8 pb-10 text-left">
      {/* ----------------------------------------------------
          SECTION 1: TOP BANNER AND CAROUSEL SLIDER (BLUE BOX)
          ---------------------------------------------------- */}
      <div className="bg-[#0A1045] border-[3px] border-black rounded-2xl p-6 md:p-8 space-y-8 shadow-[6px_6px_0_0_#000]">
        
        {/* Header Title Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-slate-700 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-[#FACC15] tracking-wide uppercase">
              Kelola Data Outlet
            </h1>
            <p className="text-gray-400 font-bold text-xs">
              Atur konten banner dan informasi terbaru untuk aplikasi pelanggan.
            </p>
          </div>
          <button className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer shrink-0">
            <span className="material-symbols-outlined font-black text-sm">campaign</span>
            Unggah Pengumuman Baru
          </button>
        </div>

        {/* Carousel Visual Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-[#FACC15] text-lg">visibility</span>
              Urutan Visual Slider
            </div>
            {/* Page Arrow indicators */}
            <div className="flex gap-2">
              <button className="bg-white border-2 border-black rounded-lg w-7 h-7 flex items-center justify-center hover:bg-gray-100 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
                <span className="material-symbols-outlined text-xs font-black">chevron_left</span>
              </button>
              <button className="bg-white border-2 border-black rounded-lg w-7 h-7 flex items-center justify-center hover:bg-gray-100 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
                <span className="material-symbols-outlined text-xs font-black">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sliders.map((slide, idx) => (
              <div 
                key={slide.id}
                className="bg-white border-[3px] border-black rounded-2xl overflow-hidden shadow-[4px_4px_0_0_#000] flex flex-col justify-between"
              >
                {/* Visual Image & Toggle */}
                <div className="p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      SLIDE {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleSlider(slide.id)}
                        className={`w-10 h-5.5 rounded-full border-2 border-black flex items-center p-0.5 transition-colors cursor-pointer ${slide.status ? 'bg-[#22C55E] justify-end' : 'bg-gray-300 justify-start'}`}
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-black"></div>
                      </button>
                      <span className="text-[9px] font-black text-gray-500 uppercase">{slide.status ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>

                  {/* Banner Image Mock */}
                  <div className="border-[3px] border-black rounded-xl w-full bg-gray-100 overflow-hidden shadow-[2px_2px_0_0_#000]" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover block"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>

                {/* Info and delete action */}
                <div className="bg-gray-50 border-t-2 border-black px-3 py-2.5 flex justify-between items-center">
                  <span className="text-xs font-black text-black truncate pr-2">
                    {slide.title}
                  </span>
                  <button 
                    onClick={() => handleDeleteSlider(slide.id)}
                    className="text-[#EF4444] hover:text-red-700 cursor-pointer flex items-center"
                    title="Hapus Slide"
                  >
                    <span className="material-symbols-outlined text-sm font-black">delete</span>
                    <span className="text-[9px] font-black uppercase ml-0.5">hapus</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Dotted Add Banner Card */}
            <button 
              onClick={handleAddSlider}
              className="border-[3px] border-dashed border-white rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center p-6 space-y-2 group cursor-pointer w-full h-full min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#FACC15] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-black font-black text-xl">add</span>
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Tambah Slide Baru
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* ----------------------------------------------------
          SECTION 2: PRODUCT MENU MASTER (WHITE BOX)
          ---------------------------------------------------- */}
      <div className="bg-white border-[3px] border-black rounded-2xl p-6 md:p-8 space-y-6 shadow-[6px_6px_0_0_#000]">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-black text-black uppercase tracking-wider border-b-4 border-[#FACC15] pb-1">
            Kelola Menu Produk (Master)
          </h2>
          <button 
            onClick={openAddMenu}
            className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined font-black text-sm">add</span>
            Tambah Produk Baru
          </button>
        </div>

        {/* Search & Category Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
              search
            </span>
            <input
              type="text"
              placeholder="Cari nama produk atau kategori..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-[3px] border-black rounded-xl focus:outline-none focus:ring-0 font-bold text-black text-xs shadow-[2px_2px_0_0_#000]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">
              Filter Kategori:
            </span>
            <div className="border-[3px] border-black rounded-xl overflow-hidden flex shadow-[2px_2px_0_0_#000]">
              {['Semua', 'Outlet Tetap', 'SOTR'].map((cat) => {
                const isActive = productCategory === (cat === 'Outlet Tetap' ? 'Outlet Tetap' : cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setProductCategory(cat === 'Outlet Tetap' ? 'Outlet Tetap' : cat)}
                    className={`px-4 py-2 text-xs font-black cursor-pointer border-r-2 last:border-r-0 border-black transition-colors ${
                      isActive ? 'bg-[#0A1045] text-[#FACC15]' : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000]">
          <table className="w-full border-collapse bg-white text-left text-xs font-bold text-black">
            <thead>
              <tr className="bg-[#F1F5F9] border-b-[3px] border-black text-[10px] uppercase tracking-wider font-black">
                <th className="px-4 py-3 border-r-2 border-gray-200 text-center w-12">NO</th>
                <th className="px-4 py-3 border-r-2 border-gray-200 text-center w-20">FOTO</th>
                <th className="px-6 py-3 border-r-2 border-gray-200">NAMA PRODUK</th>
                <th className="px-4 py-3 border-r-2 border-gray-200">HARGA</th>
                <th className="px-4 py-3 border-r-2 border-gray-200">KATEGORI OUTLET</th>
                <th className="px-4 py-3 border-r-2 border-gray-200 text-center">LABEL MENU</th>
                <th className="px-4 py-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {filteredProducts.map((product, idx) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* No */}
                  <td className="px-4 py-3 border-r-2 border-gray-100 text-center font-black text-gray-500">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  {/* Foto */}
                  <td className="px-4 py-3 border-r-2 border-gray-100 text-center">
                    <div className="w-12 h-12 rounded-lg border-2 border-black overflow-hidden bg-white mx-auto shadow-[1px_1px_0_0_#000]">
                      <img 
                        src={product.foto} 
                        alt={product.nama} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  {/* Nama */}
                  <td className="px-6 py-3 border-r-2 border-gray-100 text-left">
                    <div className="font-black text-black text-sm leading-tight">{product.nama}</div>
                    <div className="text-gray-400 font-medium text-[10px] mt-0.5">{product.deskripsi}</div>
                  </td>
                  {/* Harga */}
                  <td className="px-4 py-3 border-r-2 border-gray-100 text-left font-black">
                    Rp {product.harga.toLocaleString('id-ID')}
                  </td>
                  {/* Kategori */}
                  <td className="px-4 py-3 border-r-2 border-gray-100">
                    <div className="flex flex-col gap-1 items-start text-[8px] font-black uppercase tracking-wider">
                      {product.kategori.map((k) => (
                        <span 
                          key={k} 
                          className={`px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0_0_#000] ${
                            k === 'Tetap' ? 'bg-[#EEF2FF] text-[#1E40AF]' : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {k === 'Tetap' ? '✓ Tetap' : '✏ SOTR'}
                        </span>
                      ))}
                    </div>
                  </td>
                  {/* Label */}
                  <td className="px-4 py-3 border-r-2 border-gray-100 text-center">
                    {product.label ? (
                      <span className={`inline-block px-2.5 py-0.5 border border-black rounded text-[8px] font-black tracking-wider uppercase shadow-[1px_1px_0_0_#000] ${
                        product.label === 'BEST SELLER' 
                          ? 'bg-[#EF4444] text-white' 
                          : product.label === 'BARU' 
                          ? 'bg-[#10B981] text-white' 
                          : 'bg-[#FACC15] text-black'
                      }`}>
                        {product.label}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  {/* Aksi */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => openEditMenu(product)}
                        className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-gray-50 flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer"
                        title="Edit Produk"
                      >
                        <span className="material-symbols-outlined text-sm text-gray-700">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="w-8 h-8 rounded-lg border-2 border-[#EF4444] bg-white hover:bg-red-50 flex items-center justify-center shadow-[2px_2px_0_0_#EF4444] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#EF4444] cursor-pointer"
                        title="Hapus Produk"
                      >
                        <span className="material-symbols-outlined text-sm text-[#EF4444]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <span className="text-xs text-gray-500 font-bold">
            Menampilkan {filteredProducts.length} dari {menus.length} produk
          </span>
          <div className="flex gap-2">
            <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-sm cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
              &lt;
            </button>
            <button className="bg-[#FACC15] border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs cursor-pointer shadow-[2px_2px_0_0_#000]">
              1
            </button>
            <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
              2
            </button>
            <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
              3
            </button>
            <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-sm cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
              &gt;
            </button>
          </div>
        </div>

      </div>

      {/* ----------------------------------------------------
          SECTION 3: OUTLET TETAP (BLUE / INDIGO BG)
          ---------------------------------------------------- */}
      <div className="bg-[#0A1045] border-[3px] border-black rounded-2xl p-6 md:p-8 space-y-6 shadow-[6px_6px_0_0_#000]">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-700 pb-4">
          <div className="bg-[#3B82F6] hover:bg-blue-600 border-[3.5px] border-black text-[#FACC15] font-black text-xs uppercase px-5 py-2.5 rounded-full inline-flex items-center gap-1 cursor-pointer shadow-[3px_3px_0_0_#000] tracking-wider">
            OUTLET TETAP
            <span className="material-symbols-outlined text-sm font-black">chevron_right</span>
          </div>
          <button 
            onClick={openAddFixed}
            className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined font-black text-sm">add</span>
            TAMBAH OUTLET
          </button>
        </div>

        {/* Outlet Tetap Table */}
        <div className="overflow-x-auto border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000]">
          <table className="w-full border-collapse bg-white text-left text-xs font-bold text-black">
            <thead>
              <tr className="bg-[#F1F5F9] border-b-[3px] border-black text-[10px] uppercase tracking-wider font-black">
                <th className="px-4 py-3 border-r-2 border-gray-200 text-center w-12">NO</th>
                <th className="px-6 py-3 border-r-2 border-gray-200">NAMA OUTLET</th>
                <th className="px-4 py-3 border-r-2 border-gray-200">LOKASI</th>
                <th className="px-4 py-3 border-r-2 border-gray-200 text-center">STATUS OUTLET</th>
                <th className="px-4 py-3 border-r-2 border-gray-200 text-center">STATUS OPERASIONAL</th>
                <th className="px-4 py-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {fixedOutlets.map((outlet, idx) => {
                const isAktif = outlet.status_outlet === 'Aktif';
                return (
                  <tr key={outlet.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* No */}
                    <td className="px-4 py-3 border-r-2 border-gray-100 text-center font-black text-gray-500">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    {/* Nama Outlet */}
                    <td className="px-6 py-3 border-r-2 border-gray-100 text-left font-black text-sm text-black">
                      {outlet.nama}
                    </td>
                    {/* Lokasi */}
                    <td className="px-4 py-3 border-r-2 border-gray-100">
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(outlet.nama)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#3B82F6] hover:underline flex items-center font-black gap-1 uppercase text-[10px]"
                      >
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        Google Maps
                      </a>
                    </td>
                    {/* Status Outlet Toggle */}
                    <td className="px-4 py-3 border-r-2 border-gray-100 text-center">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleToggleOutletStatus(outlet, 'fixed')}
                          className={`w-10 h-5.5 rounded-full border-2 border-black flex items-center p-0.5 transition-colors cursor-pointer ${
                            isAktif ? 'bg-[#22C55E] justify-end' : 'bg-gray-300 justify-start'
                          }`}
                        >
                          <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-black"></div>
                        </button>
                      </div>
                    </td>
                    {/* Status Operasional */}
                    <td className="px-4 py-3 border-r-2 border-gray-100 text-center">
                      <span className={`inline-block px-3 py-0.5 border border-black rounded text-[9px] font-black tracking-widest shadow-[1px_1px_0_0_#000] ${
                        outlet.status_operasional === 'BUKA' 
                          ? 'border-[#22C55E] bg-green-50 text-[#22C55E]' 
                          : 'border-gray-400 bg-gray-50 text-gray-500'
                      }`}>
                        {outlet.status_operasional}
                      </span>
                    </td>
                    {/* Aksi */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => openEditFixed(outlet)}
                          className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-gray-50 flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer"
                          title="Edit Outlet"
                        >
                          <span className="material-symbols-outlined text-sm text-gray-700">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteFixedOutlet(outlet.id)}
                          className="w-8 h-8 rounded-lg border-2 border-[#EF4444] bg-white hover:bg-red-50 flex items-center justify-center shadow-[2px_2px_0_0_#EF4444] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#EF4444] cursor-pointer"
                          title="Hapus Outlet"
                        >
                          <span className="material-symbols-outlined text-sm text-[#EF4444]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <span className="text-xs text-slate-400 font-bold">
            Menampilkan 1-{fixedOutlets.length} dari {fixedOutlets.length} outlet
          </span>
          <div className="flex gap-2">
            <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-sm cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
              &lt;
            </button>
            <button className="bg-[#FACC15] border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs cursor-pointer shadow-[2px_2px_0_0_#000]">
              1
            </button>
            <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
              &gt;
            </button>
          </div>
        </div>

      </div>

      {/* ----------------------------------------------------
          SECTION 4: OUTLET BERGERAK / SOTR (BLUE / INDIGO BG)
          ---------------------------------------------------- */}
      <div className="bg-[#0A1045] border-[3px] border-black rounded-2xl p-6 md:p-8 space-y-6 shadow-[6px_6px_0_0_#000]">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-700 pb-4">
          <div className="bg-[#3B82F6] hover:bg-blue-600 border-[3.5px] border-black text-[#FACC15] font-black text-xs uppercase px-5 py-2.5 rounded-full inline-flex items-center gap-1 cursor-pointer shadow-[3px_3px_0_0_#000] tracking-wider">
            OUTLET BERGERAK / SOTR
            <span className="material-symbols-outlined text-sm font-black">chevron_right</span>
          </div>
          <button 
            onClick={openAddSotr}
            className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined font-black text-sm">add</span>
            TAMBAH OUTLET SOTR
          </button>
        </div>

        {/* SOTR Table */}
        <div className="overflow-x-auto border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000]">
          <table className="w-full border-collapse bg-white text-left text-xs font-bold text-black">
            <thead>
              <tr className="bg-[#F1F5F9] border-b-[3px] border-black text-[10px] uppercase tracking-wider font-black">
                <th className="px-4 py-3 border-r-2 border-gray-200 text-center w-12">NO</th>
                <th className="px-6 py-3 border-r-2 border-gray-200">UNIT OUTLET</th>
                <th className="px-6 py-3 border-r-2 border-gray-200">RIDER DITUGASKAN</th>
                <th className="px-4 py-3 border-r-2 border-gray-200 text-center">STATUS SOTR</th>
                <th className="px-4 py-3 border-r-2 border-gray-200 text-center">STATUS OPERASIONAL</th>
                <th className="px-4 py-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {sotrUnits.map((unit, idx) => {
                const isAktif = unit.status_sotr === 'Aktif';
                const hasRider = unit.rider !== 'Belum Ditugaskan';
                return (
                  <tr key={unit.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* No */}
                    <td className="px-4 py-3 border-r-2 border-gray-100 text-center font-black text-gray-500">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    {/* Unit SOTR */}
                    <td className="px-6 py-3 border-r-2 border-gray-100 text-left font-black text-sm text-black">
                      {unit.unit}
                    </td>
                    {/* Rider Ditugaskan */}
                    <td className="px-6 py-3 border-r-2 border-gray-100 text-left">
                      {hasRider ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full border-2 border-black overflow-hidden shadow-[1px_1px_0_0_#000]">
                            <img src={unit.foto_rider} alt={unit.rider} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-black font-black text-xs leading-none">{unit.rider}</span>
                        </div>
                      ) : (
                        <div className="bg-[#FFFBEB] border border-amber-300 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 w-max shadow-[1px_1px_0_0_#FCD34D]">
                          <span className="material-symbols-outlined text-xs">warning</span>
                          BELUM DITUGASKAN
                        </div>
                      )}
                    </td>
                    {/* Status SOTR Toggle */}
                    <td className="px-4 py-3 border-r-2 border-gray-100 text-center">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleToggleOutletStatus(unit, 'sotr')}
                          className={`w-10 h-5.5 rounded-full border-2 border-black flex items-center p-0.5 transition-colors cursor-pointer ${
                            isAktif ? 'bg-[#22C55E] justify-end' : 'bg-gray-300 justify-start'
                          }`}
                        >
                          <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-black"></div>
                        </button>
                      </div>
                    </td>
                    {/* Status Operasional */}
                    <td className="px-4 py-3 border-r-2 border-gray-100 text-center">
                      <span className={`inline-block px-3 py-0.5 border border-black rounded text-[9px] font-black tracking-widest shadow-[1px_1px_0_0_#000] ${
                        unit.status_operasional === 'BUKA' 
                          ? 'border-[#22C55E] bg-green-50 text-[#22C55E]' 
                          : 'border-gray-400 bg-gray-50 text-gray-500'
                      }`}>
                        {unit.status_operasional}
                      </span>
                    </td>
                    {/* Aksi */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => openEditSotr(unit)}
                          className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-gray-50 flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer"
                          title="Edit Unit SOTR"
                        >
                          <span className="material-symbols-outlined text-sm text-gray-700">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteSotrUnit(unit.id)}
                          className="w-8 h-8 rounded-lg border-2 border-[#EF4444] bg-white hover:bg-red-50 flex items-center justify-center shadow-[2px_2px_0_0_#EF4444] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#EF4444] cursor-pointer"
                          title="Hapus Unit SOTR"
                        >
                          <span className="material-symbols-outlined text-sm text-[#EF4444]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <span className="text-xs text-slate-400 font-bold">
            Menampilkan 1-{sotrUnits.length} dari {sotrUnits.length} unit
          </span>
          <div className="flex gap-2">
            <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-sm cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
              &lt;
            </button>
            <button className="bg-[#FACC15] border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs cursor-pointer shadow-[2px_2px_0_0_#000]">
              1
            </button>
            <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-xs cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
              &gt;
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MODALS & DIALOG OVERLAYS (RENDERED VIA REACT PORTALS TO document.body)
          ========================================================================= */}

      {/* ----------------------------------------------------
          1. MODAL KONFIRMASI UBAH STATUS OPERASIONAL OUTLET
          ---------------------------------------------------- */}
      {isConfirmStatusOpen && pendingConfirmItem && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-md overflow-hidden flex flex-col my-8">
            
            {/* Header */}
            <div className="bg-[#EEF2FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-[#0A1045] font-black text-xs uppercase tracking-widest">
                {pendingConfirmValue === 'Nonaktif' ? 'Nonaktifkan Outlet?' : 'Aktifkan Outlet?'}
              </span>
              <button 
                onClick={() => setIsConfirmStatusOpen(false)}
                className="text-[#0A1045] hover:text-red-600 transition-colors cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-2xl font-black">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-left">
              <div className="flex gap-4 items-start">
                {pendingConfirmValue === 'Nonaktif' ? (
                  /* Red Alert Box */
                  <div className="w-14 h-14 rounded-xl border-[3px] border-[#EF4444] bg-red-50 text-[#EF4444] flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                    <span className="material-symbols-outlined text-3xl font-black">warning</span>
                  </div>
                ) : (
                  /* Green Bolt Box */
                  <div className="w-14 h-14 rounded-xl border-[3px] border-[#10B981] bg-green-50 text-[#10B981] flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                    <span className="material-symbols-outlined text-3xl font-black">bolt</span>
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <h3 className="text-md font-black text-black leading-tight">
                    {pendingConfirmValue === 'Nonaktif' ? (
                      <>Menonaktifkan outlet ini akan membuat statusnya menjadi <span className="text-red-600">Tutup</span>.</>
                    ) : (
                      <>Mengaktifkan outlet ini akan membuat statusnya menjadi <span className="text-[#10B981]">Buka</span> dan dapat dilihat oleh pelanggan di aplikasi.</>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">
                    {pendingConfirmValue === 'Nonaktif' 
                      ? "Rider yang ditugaskan akan otomatis dilepaskan dari penugasan outlet ini. Pastikan Anda sudah memberitahu tim terkait sebelum melanjutkan."
                      : "Pastikan ketersediaan stok dan staf sebelum mengaktifkan outlet."}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 pb-6 pt-2 flex justify-end gap-4 bg-white shrink-0">
              <button
                onClick={() => setIsConfirmStatusOpen(false)}
                className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2 font-black text-xs uppercase cursor-pointer"
              >
                BATAL
              </button>
              {pendingConfirmValue === 'Nonaktif' ? (
                <button
                  onClick={handleConfirmStatusChange}
                  className="bg-[#EF4444] hover:bg-red-600 text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2 font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-sm">notifications_off</span>
                  YA, NONAKTIFKAN
                </button>
              ) : (
                <button
                  onClick={handleConfirmStatusChange}
                  className="bg-[#10B981] hover:bg-green-600 text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2 font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-sm">check_circle</span>
                  AKTIFKAN
                </button>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ----------------------------------------------------
          2. MODAL TAMBAH / EDIT MENU PRODUK MASTER
          ---------------------------------------------------- */}
      {isMenuModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-lg overflow-hidden flex flex-col my-8">
            
            {/* Header */}
            <div className="bg-[#EEF2FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-[#0A1045] font-black text-sm uppercase tracking-widest">
                {menuEditMode ? 'EDIT MENU BARU' : 'TAMBAH MENU BARU'}
              </span>
              <button 
                onClick={() => setIsMenuModalOpen(false)}
                className="text-[#0A1045] hover:text-red-600 transition-colors cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-2xl font-black">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMenu} className="flex flex-col flex-1 text-left">
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                {/* Upload Photo Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest block">
                    UNGGAH FOTO PRODUK
                  </label>
                  <div className="flex items-center gap-4">
                    {menuEditMode && menuFormData.foto ? (
                      <div className="relative w-24 h-24 shrink-0 border-[3px] border-black rounded-lg overflow-hidden shadow-[2px_2px_0_0_#000]">
                        <img src={menuFormData.foto} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" className="absolute -bottom-1 -right-1 bg-[#FACC15] border-2 border-black rounded-md p-1 cursor-pointer flex items-center justify-center shadow-[1px_1px_0_0_#000]">
                          <span className="material-symbols-outlined text-[10px] font-black">edit</span>
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-black rounded-xl w-24 h-24 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-black font-black text-xl">cloud_upload</span>
                        <span className="text-[8px] font-black text-black uppercase tracking-widest mt-1">Unggah Foto</span>
                      </div>
                    )}
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-normal">
                      Format JPG/PNG, Maks 2MB
                    </span>
                  </div>
                </div>

                {/* Nama Produk Input */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    NAMA PRODUK
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Susu Cokelat Premium"
                    value={menuFormData.nama}
                    onChange={(e) => setMenuFormData({ ...menuFormData, nama: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                    required
                  />
                </div>

                {/* Harga & Kategori Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                      HARGA PRODUK
                    </label>
                    <div className="flex items-center bg-white border-[3px] border-black rounded-xl px-4 py-0 shadow-[2px_2px_0_0_#000]">
                      <span className="font-black text-black text-xs mr-2 select-none">Rp</span>
                      <input
                        type="number"
                        placeholder="10000"
                        value={menuFormData.harga}
                        onChange={(e) => setMenuFormData({ ...menuFormData, harga: parseInt(e.target.value) || 0 })}
                        className="w-full py-2.5 bg-transparent text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                      KATEGORI OUTLET
                    </label>
                    <div className="space-y-2 pt-1">
                      {['Tetap', 'SOTR'].map(cat => {
                        const hasCat = menuFormData.kategori.includes(cat);
                        return (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                            <input 
                              type="checkbox"
                              checked={hasCat}
                              onChange={() => {
                                const newKategori = hasCat 
                                  ? menuFormData.kategori.filter(k => k !== cat) 
                                  : [...menuFormData.kategori, cat];
                                setMenuFormData({ ...menuFormData, kategori: newKategori });
                              }}
                              className="w-4 h-4 border-2 border-black rounded focus:ring-0 text-[#0A1045]"
                            />
                            <span>{cat === 'Tetap' ? 'Outlet Tetap' : 'SOTR (Mobile Unit)'}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Label Menu Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest block">
                    LABEL MENU
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['BEST SELLER', 'BARU', 'TERLARIS'].map((lbl) => {
                      const isSelected = menuFormData.label === lbl;
                      return (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setMenuFormData({ ...menuFormData, label: isSelected ? '' : lbl })}
                          className={`px-3 py-1.5 border-2 border-black rounded-lg font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer flex items-center gap-1 ${
                            isSelected ? 'bg-[#FACC15] text-black' : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {lbl === 'BEST SELLER' ? 'grade' : lbl === 'BARU' ? 'check' : 'local_fire_department'}
                          </span>
                          {lbl}
                        </button>
                      );
                    })}
                    <button type="button" className="border-2 border-dashed border-gray-400 px-3 py-1.5 rounded-lg text-gray-400 font-black text-[9px] uppercase hover:bg-gray-50 cursor-pointer">
                      + Add Label
                    </button>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-[#F1F5F9] border-t-2 border-black px-6 py-4 flex justify-end gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-[16px]">save</span>
                  SIMPAN DATA
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ----------------------------------------------------
          3. MODAL TAMBAH / EDIT OUTLET TETAP
          ---------------------------------------------------- */}
      {isFixedModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-lg overflow-hidden flex flex-col my-8">
            
            {/* Header */}
            <div className="bg-[#EEF2FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-[#0A1045] font-black text-sm uppercase tracking-widest">
                {fixedEditMode ? 'EDIT DATA OUTLET TETAP' : 'TAMBAH OUTLET TETAP'}
              </span>
              <button 
                onClick={() => setIsFixedModalOpen(false)}
                className="text-[#0A1045] hover:text-red-600 transition-colors cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-2xl font-black">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveFixedOutlet} className="flex flex-col flex-1 text-left">
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                {/* Nama Outlet */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    NAMA OUTLET
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Contoh: Susu Gepuk - Antapani"
                      value={fixedFormData.nama}
                      onChange={(e) => setFixedFormData({ ...fixedFormData, nama: e.target.value })}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                      required
                    />
                    <span className="material-symbols-outlined absolute left-4 text-gray-500 font-bold text-sm">
                      storefront
                    </span>
                  </div>
                </div>

                {/* Detail Lokasi */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    DETAIL LOKASI
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Jl. Air Dingin No.17 Dekat Kampus UIR"
                      value={fixedFormData.lokasi}
                      onChange={(e) => setFixedFormData({ ...fixedFormData, lokasi: e.target.value })}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                      required
                    />
                    <span className="material-symbols-outlined absolute left-4 text-gray-500 font-bold text-sm">
                      location_on
                    </span>
                  </div>
                </div>

                {/* URL Google Maps */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    URL GOOGLE MAPS
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full pl-12 pr-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                    />
                    <span className="material-symbols-outlined absolute left-4 text-gray-500 font-bold text-sm">
                      link
                    </span>
                  </div>
                </div>

                {/* Status Awal */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest block">
                    STATUS AWAL
                  </label>
                  <div className="bg-[#F1F5F9] border-2 border-dashed border-gray-300 rounded-xl p-3 flex gap-6 items-center">
                    <label className="flex items-center gap-2 cursor-pointer font-black text-xs text-[#10B981]">
                      <input 
                        type="radio"
                        name="fixed_status"
                        checked={fixedFormData.status_outlet === 'Aktif'}
                        onChange={() => setFixedFormData({ ...fixedFormData, status_outlet: 'Aktif', status_operasional: 'BUKA' })}
                        className="w-4 h-4 border-2 border-black focus:ring-0 text-[#10B981]"
                      />
                      <span>● AKTIF</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-black text-xs text-[#EF4444]">
                      <input 
                        type="radio"
                        name="fixed_status"
                        checked={fixedFormData.status_outlet === 'Nonaktif'}
                        onChange={() => setFixedFormData({ ...fixedFormData, status_outlet: 'Nonaktif', status_operasional: 'TUTUP' })}
                        className="w-4 h-4 border-2 border-black focus:ring-0 text-[#EF4444]"
                      />
                      <span>● NON-AKTIF</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-[#F1F5F9] border-t-2 border-black px-6 py-4 flex justify-end gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFixedModalOpen(false)}
                  className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-[16px]">save</span>
                  SIMPAN DATA
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ----------------------------------------------------
          4. MODAL TAMBAH / EDIT SOTR (MOBILE OUTLET)
          ---------------------------------------------------- */}
      {isSotrModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-lg overflow-hidden flex flex-col my-8">
            
            {/* Header */}
            <div className="bg-[#EEF2FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-[#0A1045] font-black text-sm uppercase tracking-widest">
                {sotrEditMode ? 'EDIT DATA OUTLET SOTR' : 'TAMBAH OUTLET SOTR'}
              </span>
              <button 
                onClick={() => setIsSotrModalOpen(false)}
                className="text-[#0A1045] hover:text-red-600 transition-colors cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-2xl font-black">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSotrUnit} className="flex flex-col flex-1 text-left">
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                {/* Nama Unit SOTR */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    NAMA UNIT SOTR
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: SOTR Unit-A4"
                    value={sotrFormData.unit}
                    onChange={(e) => setSotrFormData({ ...sotrFormData, unit: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                    required
                  />
                </div>

                {/* Rider Penangung Jawab Select */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    RIDER PENANGGUNG JAWAB
                  </label>
                  <select
                    value={sotrFormData.rider}
                    onChange={(e) => setSotrFormData({ ...sotrFormData, rider: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 shadow-[2px_2px_0_0_#000] cursor-pointer"
                  >
                    <option value="Belum Ditugaskan">Belum Ditugaskan</option>
                    {ridersList.map(r => (
                      <option key={r.nama} value={r.nama}>{r.nama}</option>
                    ))}
                  </select>
                </div>

                {/* Area Input */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    AREA
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Marpoyan - Simpang Tiga"
                      value={sotrFormData.area}
                      onChange={(e) => setSotrFormData({ ...sotrFormData, area: e.target.value })}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                      required
                    />
                    <span className="material-symbols-outlined absolute left-4 text-gray-500 font-bold text-sm">
                      location_on
                    </span>
                  </div>
                </div>

                {/* Status Operasional Switch */}
                <div className="bg-[#F1F5F9] border-2 border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-[1px_1px_0_0_#000]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest block">
                      STATUS OPERASIONAL
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold">Status awal unit saat didaftarkan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSotrFormData({ 
                        ...sotrFormData, 
                        status_sotr: sotrFormData.status_sotr === 'Aktif' ? 'Nonaktif' : 'Aktif',
                        status_operasional: sotrFormData.status_sotr === 'Aktif' ? 'TUTUP' : 'BUKA'
                      })}
                      className={`w-10 h-5.5 rounded-full border-2 border-black flex items-center p-0.5 transition-colors cursor-pointer ${
                        sotrFormData.status_sotr === 'Aktif' ? 'bg-[#22C55E] justify-end' : 'bg-gray-400 justify-start'
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-black"></div>
                    </button>
                    <span className="text-[10px] font-black text-gray-700 font-mono">
                      {sotrFormData.status_sotr === 'Aktif' ? 'AKTIF' : 'NON-AKTIF'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-[#F1F5F9] border-t-2 border-black px-6 py-4 flex justify-end gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSotrModalOpen(false)}
                  className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-[16px]">save</span>
                  SIMPAN DATA
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
