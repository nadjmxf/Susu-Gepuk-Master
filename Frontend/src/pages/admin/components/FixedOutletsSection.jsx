import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import outletService from '../../../services/outletService';

const itemsPerPage = 5;

// Helper to determine if open based on current local time and manual toggle
const isCurrentlyOpen = (jamBuka, jamTutup, manualStatus) => {
  if (manualStatus === 'Tutup' || manualStatus === 'TUTUP') {
    return false;
  }

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const currentHHMM = `${hh}:${mm}`;

  if (jamBuka <= jamTutup) {
    return currentHHMM >= jamBuka && currentHHMM <= jamTutup;
  } else {
    // Over midnight (e.g. 22:00 to 02:00)
    return currentHHMM >= jamBuka || currentHHMM <= jamTutup;
  }
};

export default function FixedOutletsSection({ fixedOutlets, onRefresh, handleToggleOutletStatus }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fixedPage, setFixedPage] = useState(1);
  const [isFixedModalOpen, setIsFixedModalOpen] = useState(false);
  const [fixedEditMode, setFixedEditMode] = useState(false);
  const [selectedFixedId, setSelectedFixedId] = useState(null);
  const [fixedFormData, setFixedFormData] = useState({
    nama: '',
    lokasi: '',
    link_lokasi: '',
    status_outlet: 'Aktif',
    status_operasional: 'BUKA',
    latitude: 0.4578,
    longitude: 101.4589,
    jam_buka: '08:00',
    jam_tutup: '22:00'
  });

  const fixedTotalPages = Math.max(1, Math.ceil(fixedOutlets.length / itemsPerPage));
  const paginatedFixedOutlets = fixedOutlets.slice((fixedPage - 1) * itemsPerPage, fixedPage * itemsPerPage);

  // Auto-adjust page if current page exceeds total pages (e.g. after deletion)
  useEffect(() => {
    if (fixedPage > fixedTotalPages) {
      setFixedPage(fixedTotalPages);
    }
  }, [fixedOutlets.length, fixedPage, fixedTotalPages]);

  const openAddFixed = () => {
    setFixedEditMode(false);
    setFixedFormData({
      nama: '',
      lokasi: '',
      link_lokasi: '',
      status_outlet: 'Aktif',
      status_operasional: 'BUKA',
      latitude: 0.4578,
      longitude: 101.4589,
      jam_buka: '08:00',
      jam_tutup: '22:00'
    });
    setIsFixedModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('openAddOutlet') === 'true') {
      // Clear parameter silently from URL without triggering React Router re-render
      const url = new URL(window.location);
      url.searchParams.delete('openAddOutlet');
      window.history.replaceState(null, '', url.pathname + url.search);

      // Scroll to Fixed Outlets section smoothly
      setTimeout(() => {
        const element = document.getElementById('fixed-outlets-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [searchParams]);

  const openEditFixed = (outlet) => {
    setFixedEditMode(true);
    setSelectedFixedId(outlet.id);
    setFixedFormData({
      nama: outlet.nama,
      lokasi: outlet.lokasi || '',
      link_lokasi: outlet.link_lokasi,
      status_outlet: outlet.status_outlet,
      status_operasional: outlet.status_operasional,
      latitude: outlet.latitude || 0.4578,
      longitude: outlet.longitude || 101.4589,
      jam_buka: outlet.jam_buka || '08:00',
      jam_tutup: outlet.jam_tutup || '22:00'
    });
    setIsFixedModalOpen(true);
  };

  const handleDeleteFixedOutlet = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus outlet tetap ini?')) return;
    try {
      await outletService.deleteOutlet(id);
      onRefresh();
    } catch (error) {
      alert('Gagal menghapus outlet tetap');
    }
  };

  const handleSaveFixedOutlet = async (e) => {
    e.preventDefault();
    if (!fixedFormData.nama.trim()) return;

    const formattedKeterangan = `[${fixedFormData.jam_buka}-${fixedFormData.jam_tutup}]`;

    const payload = {
      id_admin: 1,
      nama_outlet: fixedFormData.nama,
      area: 'Pekanbaru', // Default area
      keterangan_lokasi: formattedKeterangan,
      link_lokasi: fixedFormData.link_lokasi,
      jenis_outlet: 'Outlet Tetap',
      status_operasional: fixedFormData.status_outlet === 'Aktif' ? 'Buka' : 'Tutup',
      latitude: fixedFormData.latitude || 0.4578,
      longitude: fixedFormData.longitude || 101.4589
    };

    try {
      if (fixedEditMode) {
        await outletService.updateOutlet(selectedFixedId, payload);
      } else {
        await outletService.createOutlet(payload);
      }
      setIsFixedModalOpen(false);
      onRefresh();
    } catch (error) {
      alert('Gagal menyimpan outlet tetap');
    }
  };

  return (
    <>
      {/* ----------------------------------------------------
          SECTION 3: OUTLET TETAP (BLUE / INDIGO BG)
          ---------------------------------------------------- */}
      <div id="fixed-outlets-section" className="space-y-4">

        {/* Section Title Pill Line */}
        <div className="flex items-center gap-4 w-full">
          <div className="bg-[#3B82F6] border-[3px] border-black text-white font-black text-xs uppercase px-5 py-2.5 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-[3px_3px_0_0_#000] tracking-wider whitespace-nowrap">
            <span className="material-symbols-outlined text-sm font-black">storefront</span>
            OUTLET TETAP
          </div>
          <div className="h-0.5 flex-1 bg-blue-200 opacity-40"></div>
          <span className="material-symbols-outlined text-white opacity-40">chevron_right</span>
        </div>

        {/* Outlet Tetap Table */}
        <div className="bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000] p-4 md:p-6">
          <div className="overflow-x-auto">
            <table className="hidden md:table w-full text-left text-xs font-bold text-black border-separate border-spacing-0">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider font-black text-white">
                  <th className="px-4 py-3 text-center w-12 bg-[#0D1B5E] rounded-l-xl">NO</th>
                  <th className="px-6 py-3 bg-[#0D1B5E]">LOKASI OUTLET</th>
                  <th className="px-4 py-3 bg-[#0D1B5E]">DETAIL LOKASI</th>
                  <th className="px-4 py-3 text-center bg-[#0D1B5E]">STATUS OUTLET</th>
                  <th className="px-4 py-3 text-center bg-[#0D1B5E]">JAM OPERASIONAL</th>
                  <th className="px-4 py-3 text-center bg-[#0D1B5E] rounded-r-xl">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {/* Spacing Row */}
                <tr className="h-3">
                  <td colSpan="6"></td>
                </tr>
                {paginatedFixedOutlets.map((outlet, idx) => {
                  const isAktif = outlet.status_outlet === 'Aktif';
                  return (
                    <tr key={outlet.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* No */}
                      <td className="px-4 py-3 border-r-2 border-gray-100 text-center font-black text-gray-500">
                        {String((fixedPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}
                      </td>
                      {/* Lokasi Outlet (Nama Outlet) */}
                      <td className="px-6 py-3 border-r-2 border-gray-100 text-left font-black text-sm text-black">
                        {outlet.nama}
                      </td>
                      {/* Detail Lokasi (Google Maps Link) */}
                      <td className="px-4 py-3 border-r-2 border-gray-100 text-left font-bold text-[11px]">
                        {outlet.link_lokasi ? (
                          <a
                            href={outlet.link_lokasi}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#3B82F6] hover:underline inline-flex items-center font-black gap-1 uppercase text-[10px]"
                          >
                            <span className="material-symbols-outlined text-xs">location_on</span>
                            Google Maps
                          </a>
                        ) : (
                          <span className="text-gray-400 font-bold">—</span>
                        )}
                      </td>
                      {/* Status Outlet Toggle */}
                      <td className="px-4 py-3 border-r-2 border-gray-100 text-center">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleToggleOutletStatus(outlet, 'fixed')}
                            className={`w-10 h-5.5 rounded-full border-2 border-black flex items-center p-0.5 transition-colors cursor-pointer ${isAktif ? 'bg-[#22C55E] justify-end' : 'bg-gray-300 justify-start'
                              }`}
                          >
                            <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-black"></div>
                          </button>
                        </div>
                      </td>
                      {/* Jam Operasional */}
                      <td className="px-4 py-3 border-r-2 border-gray-100 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-gray-700 font-black text-[11px] font-mono">
                            {outlet.jam_buka} - {outlet.jam_tutup}
                          </span>
                          {isCurrentlyOpen(outlet.jam_buka, outlet.jam_tutup, outlet.status_operasional) ? (
                            <span className="inline-block px-2 py-0.5 border border-black rounded text-[9px] font-black tracking-widest shadow-[1px_1px_0_0_#000] border-[#22C55E] bg-green-50 text-[#22C55E]">
                              BUKA
                            </span>
                          ) : (
                            <span className={`inline-block px-2 py-0.5 border border-black rounded text-[9px] font-black tracking-widest shadow-[1px_1px_0_0_#000] ${
                              outlet.status_operasional === 'BUKA' || outlet.status_operasional === 'Buka'
                                ? 'border-amber-500 bg-amber-50 text-amber-600'
                                : 'border-gray-400 bg-gray-50 text-gray-500'
                            }`}>
                              {outlet.status_operasional === 'BUKA' || outlet.status_operasional === 'Buka' ? 'TUTUP (DI LUAR JAM)' : 'TUTUP'}
                            </span>
                          )}
                        </div>
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

          {/* Card Content - Mobile */}
          <div className="block md:hidden divide-y-[3px] divide-gray-900 bg-white">
            {paginatedFixedOutlets.map((outlet) => {
              const isAktif = outlet.status_outlet === 'Aktif';
              return (
                <div key={outlet.id} className="p-4 flex flex-col gap-3 text-left relative">
                  {/* Status Outlet Toggle at top right */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleToggleOutletStatus(outlet, 'fixed')}
                      className={`w-10 h-5.5 rounded-full border-[2px] border-black flex items-center p-0.5 transition-colors cursor-pointer ${isAktif ? 'bg-[#22C55E] justify-end' : 'bg-gray-300 justify-start'
                        }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-black"></div>
                    </button>
                  </div>

                  <div className="pr-14">
                    <h3 className="font-black text-black text-sm">{outlet.nama}</h3>
                    {outlet.lokasi && <div className="text-gray-500 font-bold text-[10px] mt-1">{outlet.lokasi}</div>}
                    <div className="text-gray-400 font-bold text-[9px] mt-0.5">⏱ {outlet.jam_buka} - {outlet.jam_tutup}</div>
                    {outlet.link_lokasi && (
                      <a
                        href={outlet.link_lokasi}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#3B82F6] hover:underline inline-flex items-center font-black gap-1 uppercase text-[9px] mt-1"
                      >
                        <span className="material-symbols-outlined text-[10px]">location_on</span>
                        Google Maps
                      </a>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t-[2px] border-gray-100">
                    {isCurrentlyOpen(outlet.jam_buka, outlet.jam_tutup, outlet.status_operasional) ? (
                      <span className="inline-block px-3 py-1 border-[2px] border-black rounded text-[9px] font-black tracking-widest uppercase shadow-[2px_2px_0_0_#000] border-[#22C55E] bg-green-50 text-[#22C55E]">
                        BUKA
                      </span>
                    ) : (
                      <span className={`inline-block px-3 py-1 border-[2px] border-black rounded text-[9px] font-black tracking-widest uppercase shadow-[2px_2px_0_0_#000] ${
                        outlet.status_operasional === 'BUKA' || outlet.status_operasional === 'Buka'
                          ? 'border-amber-500 bg-amber-50 text-amber-600'
                          : 'border-gray-400 bg-gray-50 text-gray-500'
                      }`}>
                        {outlet.status_operasional === 'BUKA' || outlet.status_operasional === 'Buka' ? 'TUTUP (DI LUAR JAM)' : 'TUTUP'}
                      </span>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditFixed(outlet)}
                        className="w-8 h-8 rounded-lg border-[2px] border-black bg-white flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]"
                      >
                        <span className="material-symbols-outlined text-sm text-gray-700">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteFixedOutlet(outlet.id)}
                        className="w-8 h-8 rounded-lg border-[2px] border-[#EF4444] bg-white flex items-center justify-center shadow-[2px_2px_0_0_#EF4444] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#EF4444]"
                      >
                        <span className="material-symbols-outlined text-sm text-[#EF4444]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {fixedOutlets.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-bold">
                Outlet tetap tidak ditemukan.
              </div>
            )}
          </div>

          <div className="border-t-2 border-gray-100 my-4"></div>

          {/* Footer info pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-gray-500 font-bold">
              Menampilkan {fixedOutlets.length > 0 ? (fixedPage - 1) * itemsPerPage + 1 : 0}-{Math.min(fixedPage * itemsPerPage, fixedOutlets.length)} dari {fixedOutlets.length} outlet
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setFixedPage(prev => Math.max(prev - 1, 1))}
                disabled={fixedPage === 1}
                className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-sm transition-all ${fixedPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-white hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
                  }`}
              >
                &lt;
              </button>
              {Array.from({ length: fixedTotalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setFixedPage(p)}
                  className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs transition-all ${p === fixedPage
                      ? 'bg-[#FACC15] cursor-default shadow-[2px_2px_0_0_#000]'
                      : 'bg-white hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setFixedPage(prev => Math.min(prev + 1, fixedTotalPages))}
                disabled={fixedPage === fixedTotalPages}
                className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-sm transition-all ${fixedPage === fixedTotalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-white hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
                  }`}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Footer Row with Add Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={openAddFixed}
            className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined font-black text-sm">add</span>
            TAMBAH OUTLET
          </button>
        </div>
      </div>

      {/* Modal Tambah/Edit Fixed Outlet */}
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
                className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-gray-50 flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-black">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveFixedOutlet} className="flex-1 overflow-y-auto flex flex-col min-h-0">
              <div className="p-6 space-y-4 flex-1">

                {/* Lokasi Outlet */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    LOKASI OUTLET
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Contoh: Susu Gepuk - Outlet Panam"
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

                {/* URL Google Maps */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    URL GOOGLE MAPS
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="url"
                      placeholder="Contoh: https://maps.google.com/..."
                      value={fixedFormData.link_lokasi}
                      onChange={(e) => setFixedFormData({ ...fixedFormData, link_lokasi: e.target.value })}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                    />
                    <span className="material-symbols-outlined absolute left-4 text-gray-500 font-bold text-sm">
                      link
                    </span>
                  </div>
                </div>

                {/* Jam Operasional */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                      JAM BUKA
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="time"
                        value={fixedFormData.jam_buka}
                        onChange={(e) => setFixedFormData({ ...fixedFormData, jam_buka: e.target.value })}
                        className="w-full pl-12 pr-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 shadow-[2px_2px_0_0_#000]"
                        required
                      />
                      <span className="material-symbols-outlined absolute left-4 text-gray-500 font-bold text-sm">
                        schedule
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                      JAM TUTUP
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="time"
                        value={fixedFormData.jam_tutup}
                        onChange={(e) => setFixedFormData({ ...fixedFormData, jam_tutup: e.target.value })}
                        className="w-full pl-12 pr-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 shadow-[2px_2px_0_0_#000]"
                        required
                      />
                      <span className="material-symbols-outlined absolute left-4 text-gray-500 font-bold text-sm">
                        schedule
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Operasional */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest block">
                    STATUS OPERASIONAL
                  </label>
                  <div className="bg-[#F1F5F9] border-2 border-dashed border-gray-300 rounded-xl p-3 flex gap-6 items-center">
                    <label className="flex items-center gap-2 cursor-pointer font-black text-xs text-[#10B981]">
                      <input
                        type="radio"
                        name="fixed_status"
                        checked={fixedFormData.status_operasional === 'BUKA' || fixedFormData.status_operasional === 'Buka'}
                        onChange={() => setFixedFormData({ ...fixedFormData, status_operasional: 'BUKA', status_outlet: 'Aktif' })}
                        className="w-4 h-4 border-2 border-black focus:ring-0 text-[#10B981]"
                      />
                      <span>● BUKA</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-black text-xs text-[#EF4444]">
                      <input
                        type="radio"
                        name="fixed_status"
                        checked={fixedFormData.status_operasional === 'TUTUP' || fixedFormData.status_operasional === 'Tutup'}
                        onChange={() => setFixedFormData({ ...fixedFormData, status_operasional: 'TUTUP', status_outlet: 'Nonaktif' })}
                        className="w-4 h-4 border-2 border-black focus:ring-0 text-[#EF4444]"
                      />
                      <span>● TUTUP</span>
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
    </>
  );
}
