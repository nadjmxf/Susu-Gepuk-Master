import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import menuService from '../../../services/menuService';

const itemsPerPage = 5;

const mapKategoriMenuToDb = (kategoriFe) => {
  const hasTetap = kategoriFe.includes('Tetap');
  const hasSotr = kategoriFe.includes('SOTR');
  if (hasTetap && hasSotr) return 'Keduanya';
  if (hasTetap) return 'Outlet';
  if (hasSotr) return 'SOTR';
  return 'Outlet';
};

const mapTagToDb = (tagFe) => {
  if (tagFe === 'BARU') return 'New';
  if (tagFe === 'BEST SELLER') return 'Best Seller';
  return null;
};

export default function ProductMenuSection({ menus, onRefresh }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('Semua');
  const [menuPage, setMenuPage] = useState(1);

  // Form State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuEditMode, setMenuEditMode] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    nama: '',
    harga: 0,
    kategori: ['Tetap'],
    label: '',
    foto: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=150',
    deskripsi: ''
  });
  const [menuImageFile, setMenuImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Filtering
  const filteredProducts = menus.filter((product) => {
    const matchesSearch = product.nama.toLowerCase().includes(productSearch.toLowerCase());
    if (productCategory === 'Semua') return matchesSearch;
    return matchesSearch && product.kategori.includes(productCategory);
  });

  const menuTotalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((menuPage - 1) * itemsPerPage, menuPage * itemsPerPage);

  useEffect(() => {
    if (menuPage > menuTotalPages) {
      setMenuPage(menuTotalPages);
    }
  }, [filteredProducts.length, menuPage, menuTotalPages]);

  const openAddMenu = () => {
    setMenuEditMode(false);
    setMenuImageFile(null);
    setMenuFormData({
      nama: '',
      harga: 0,
      kategori: ['Tetap'],
      label: '',
      foto: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=150',
      deskripsi: ''
    });
    setIsMenuModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('openAddMenu') === 'true') {
      openAddMenu();

      // Clear parameter silently from URL without triggering React Router re-render
      const url = new URL(window.location);
      url.searchParams.delete('openAddMenu');
      window.history.replaceState(null, '', url.pathname + url.search);

      // Scroll to Product Menu section smoothly
      setTimeout(() => {
        const element = document.getElementById('product-menu-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [searchParams]);

  const openEditMenu = (menu) => {
    setMenuEditMode(true);
    setMenuImageFile(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMenuImageFile(file);
      setMenuFormData(prev => ({ ...prev, foto: URL.createObjectURL(file) }));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await menuService.deleteMenu(id);
      onRefresh();
    } catch (error) {
      alert('Gagal menghapus produk');
    }
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    if (!menuFormData.nama.trim()) return;

    try {
      const formData = new FormData();
      formData.append('id_admin', 1);
      formData.append('nama_menu', menuFormData.nama);
      formData.append('harga', menuFormData.harga);
      formData.append('deskripsi', menuFormData.deskripsi || '');
      formData.append('kategori_menu', mapKategoriMenuToDb(menuFormData.kategori));
      if (menuFormData.label) {
        formData.append('tag_menu', mapTagToDb(menuFormData.label));
      }
      if (menuImageFile) {
        formData.append('gambar_menu', menuImageFile);
      }

      if (menuEditMode) {
        await menuService.updateMenu(selectedMenuId, formData);
      } else {
        await menuService.createMenu(formData);
      }
      setIsMenuModalOpen(false);
      setMenuImageFile(null);
      onRefresh();
    } catch (error) {
      alert(error.message || 'Gagal menyimpan menu produk');
    }
  };

  return (
    <>
      {/* ----------------------------------------------------
          SECTION 2: PRODUCT MENU MASTER (WHITE BOX)
          ---------------------------------------------------- */}
      <div id="product-menu-section" className="space-y-4">

        {/* Header Row with Add Button */}
        <div className="flex justify-end">
          <button
            onClick={openAddMenu}
            className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined font-black text-sm">add</span>
            TAMBAH PRODUK
          </button>
        </div>

        {/* Section Title Pill Line */}
        <div className="flex items-center gap-4 w-full">
          <div className="bg-[#3B82F6] border-[3px] border-black text-white font-black text-xs uppercase px-5 py-2.5 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-[3px_3px_0_0_#000] tracking-wider whitespace-nowrap">
            <span className="material-symbols-outlined text-sm font-black">restaurant_menu</span>
            PRODUCT MENU MASTER
          </div>
          <div className="h-0.5 flex-1 bg-blue-200 opacity-40"></div>
          <span className="material-symbols-outlined text-white opacity-40">chevron_right</span>
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
              placeholder="Cari nama produk..."
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
              {['Semua', 'Tetap', 'SOTR'].map((cat) => {
                const displayCat = cat === 'Tetap' ? 'Outlet Tetap' : cat;
                const isActive = productCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setProductCategory(cat)}
                    className={`px-4 py-2 text-xs font-black cursor-pointer border-r-2 last:border-r-0 border-black transition-colors ${isActive ? 'bg-[#1d4ed8] text-[#FACC15]' : 'bg-white text-black hover:bg-gray-50'
                      }`}
                  >
                    {displayCat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000] p-4 md:p-6">
          <div className="overflow-x-auto">
            <table className="hidden md:table w-full text-left text-xs font-bold text-black border-separate border-spacing-0">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider font-black text-white">
                  <th className="px-4 py-3 text-center w-12 bg-[#0D1B5E] rounded-l-xl">NO</th>
                  <th className="px-4 py-3 text-center w-20 bg-[#0D1B5E]">FOTO</th>
                  <th className="px-6 py-3 bg-[#0D1B5E]">NAMA PRODUK</th>
                  <th className="px-4 py-3 bg-[#0D1B5E]">HARGA</th>
                  <th className="px-4 py-3 bg-[#0D1B5E]">KATEGORI OUTLET</th>
                  <th className="px-4 py-3 text-center bg-[#0D1B5E]">LABEL MENU</th>
                  <th className="px-4 py-3 text-center bg-[#0D1B5E] rounded-r-xl">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {/* Spacing Row */}
                <tr className="h-3">
                  <td colSpan="7"></td>
                </tr>
                {paginatedProducts.map((product, idx) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* No */}
                    <td className="px-4 py-3 border-r-2 border-gray-100 text-center font-black text-gray-500">
                      {String((menuPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}
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
                            className={`px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0_0_#000] ${k === 'Tetap' ? 'bg-[#EEF2FF] text-[#1E40AF]' : 'bg-amber-50 text-amber-800'
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
                        <span className={`inline-block px-2.5 py-0.5 border border-black rounded text-[8px] font-black tracking-wider uppercase shadow-[1px_1px_0_0_#000] ${product.label === 'BEST SELLER'
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

          {/* Card Content - Mobile */}
          <div className="block md:hidden divide-y-[3px] divide-gray-900 bg-white">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="p-4 flex flex-col gap-3 text-left relative">
                {/* Kategori Badge at top right */}
                <div className="absolute top-4 right-4 flex gap-1">
                  {product.kategori.map((k) => (
                    <span
                      key={k}
                      className={`px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0_0_#000] text-[8px] font-black uppercase tracking-wider ${k === 'Tetap' ? 'bg-[#EEF2FF] text-[#1E40AF]' : 'bg-amber-50 text-amber-800'
                        }`}
                    >
                      {k === 'Tetap' ? 'Tetap' : 'SOTR'}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 shrink-0 rounded-lg border-[2px] border-black overflow-hidden bg-white shadow-[2px_2px_0_0_#000]">
                    <img
                      src={product.foto}
                      alt={product.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pr-12">
                    <h3 className="font-black text-black text-sm">{product.nama}</h3>
                    <p className="text-gray-400 font-medium text-[10px] mt-0.5 line-clamp-2">{product.deskripsi}</p>
                    <div className="mt-2 font-black text-green-700 text-sm">
                      Rp {product.harga.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div>
                    {product.label && (
                      <span className={`inline-block px-2 py-1 border border-black rounded text-[9px] font-black tracking-wider uppercase shadow-[2px_2px_0_0_#000] ${product.label === 'BEST SELLER'
                          ? 'bg-[#EF4444] text-white'
                          : product.label === 'BARU'
                            ? 'bg-[#10B981] text-white'
                            : 'bg-[#FACC15] text-black'
                        }`}>
                        {product.label}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditMenu(product)}
                      className="w-8 h-8 rounded-lg border-[2px] border-black bg-white flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]"
                    >
                      <span className="material-symbols-outlined text-sm text-gray-700">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-8 h-8 rounded-lg border-[2px] border-[#EF4444] bg-white flex items-center justify-center shadow-[2px_2px_0_0_#EF4444] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#EF4444]"
                    >
                      <span className="material-symbols-outlined text-sm text-[#EF4444]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-bold">
                Produk tidak ditemukan.
              </div>
            )}
          </div>

          <div className="border-t-2 border-gray-100 my-4"></div>

          {/* Table Pagination Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-gray-500 font-bold">
              Menampilkan {filteredProducts.length > 0 ? (menuPage - 1) * itemsPerPage + 1 : 0}-{Math.min(menuPage * itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} produk
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setMenuPage(prev => Math.max(prev - 1, 1))}
                disabled={menuPage === 1}
                className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-sm transition-all ${menuPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-white hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
                  }`}
              >
                &lt;
              </button>
              {Array.from({ length: menuTotalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setMenuPage(p)}
                  className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs transition-all ${p === menuPage
                      ? 'bg-[#FACC15] cursor-default shadow-[2px_2px_0_0_#000]'
                      : 'bg-white hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setMenuPage(prev => Math.min(prev + 1, menuTotalPages))}
                disabled={menuPage === menuTotalPages}
                className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-sm transition-all ${menuPage === menuTotalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-white hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
                  }`}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Menu */}
      {isMenuModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-lg overflow-hidden flex flex-col my-8">

            {/* Header */}
            <div className="bg-[#EEF2FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-[#0A1045] font-black text-sm uppercase tracking-widest">
                {menuEditMode ? 'EDIT DATA MENU PRODUK' : 'TAMBAH PRODUK BARU'}
              </span>
              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-gray-50 flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-black">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMenu} className="flex flex-col flex-1 text-left">
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">

                {/* Nama Produk */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    NAMA MENU PRODUK
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Susu Gepuk Coklat"
                    value={menuFormData.nama}
                    onChange={(e) => setMenuFormData({ ...menuFormData, nama: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                    required
                  />
                </div>

                {/* Harga & Upload Foto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Harga */}
                  <div>
                    <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                      HARGA SATUAN (RP)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 12000"
                      value={menuFormData.harga || ''}
                      onChange={(e) => setMenuFormData({ ...menuFormData, harga: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                      required
                    />
                  </div>
                  {/* Upload Foto */}
                  <div>
                    <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                      FOTO PRODUK
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 border-[2px] border-black rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center shadow-[1px_1px_0_0_#000] shrink-0">
                        {menuFormData.foto ? (
                          <img src={menuFormData.foto} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-gray-400 text-xl font-black">image</span>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-wider cursor-pointer"
                      >
                        UPLOAD
                      </button>
                    </div>
                  </div>
                </div>

                {/* Kategori Menu Checkboxes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest block">
                    KATEGORI PENJUALAN
                  </label>
                  <div className="bg-[#F1F5F9] border-2 border-dashed border-gray-300 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-6">
                      {['Tetap', 'SOTR'].map((cat) => {
                        const hasCat = menuFormData.kategori.includes(cat);
                        return (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer font-black text-xs text-[#0A1045]">
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

                {/* Deskripsi */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    DESKRIPSI PRODUK
                  </label>
                  <textarea
                    placeholder="Tulis deskripsi atau varian produk..."
                    value={menuFormData.deskripsi}
                    onChange={(e) => setMenuFormData({ ...menuFormData, deskripsi: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                  />
                </div>

                {/* Label Menu Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest block">
                    LABEL MENU
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['BEST SELLER', 'BARU'].map((lbl) => {
                      const isSelected = menuFormData.label === lbl;
                      return (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setMenuFormData({ ...menuFormData, label: isSelected ? '' : lbl })}
                          className={`px-3 py-1.5 border-2 border-black rounded-lg font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer flex items-center gap-1 ${isSelected ? 'bg-[#FACC15] text-black' : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {lbl === 'BEST SELLER' ? 'grade' : 'check'}
                          </span>
                          {lbl}
                        </button>
                      );
                    })}
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
    </>
  );
}
