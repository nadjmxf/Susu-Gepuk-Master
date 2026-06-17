import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import outletService from '../services/outletService';

export default function OutletLocations() {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState('Semua');

  // Fetch outlets from API
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        setLoading(true);
        const response = await outletService.getAllOutlets();
        
        if (response.success && response.data) {
          // Map API response to component format
          const mappedOutlets = response.data.map((outlet) => ({
            id: outlet.id_outlet,
            area: outlet.area,
            name: outlet.nama_outlet,
            status: outlet.status_operasional === 'Buka' 
              ? `BUKA SEKARANG • ${outlet.keterangan_lokasi}`
              : `TUTUP • BUKA BESOK ${outlet.keterangan_lokasi}`,
            isOpen: outlet.status_operasional === 'Buka',
            mapsUrl: outlet.link_lokasi,
          }));
          setOutlets(mappedOutlets);
        } else {
          setError('Gagal mengambil data outlet');
        }
      } catch (err) {
        setError('Gagal mengambil data outlet');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOutlets();
  }, []);

  // Get unique areas from outlets
  const areas = ['Semua', ...new Set(outlets.map((outlet) => outlet.area))];

  const displayedOutlets = outlets.filter((outlet) => {
    if (selectedArea === 'Semua') return true;
    return outlet.area === selectedArea;
  });

  return (
    <>
      <Header />
      <main className="pt-[80px] min-h-screen flex flex-col bg-[#1e3a8a]">
        <div className="flex-1 max-w-7xl mx-auto w-full px-8 pt-24 pb-24">
          
          
          <div className="flex flex-col gap-4 mb-10">
            {/* Bagian Judul & Garis */}
            <div className="flex items-center gap-4 w-full">
              <div className="bg-[#0f2c7a] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold z-10 border-2 border-transparent whitespace-nowrap">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                LOKASI OUTLET
              </div>
              <div className="h-0.5 flex-1 bg-blue-200 opacity-40"></div>
            </div>

            {/* Bagian Tombol Custom Dropdown */}
            <div className="relative self-end w-full md:w-[240px] z-20">
              
              {/* Tombol Utama*/}
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#fde047] text-gray-900 font-bold px-6 py-2.5 rounded-xl border-2 border-gray-900 shadow-[3px_3px_0_0_rgba(17,24,39,1)] hover:bg-yellow-400 transition-all cursor-pointer flex items-center justify-between text-sm outline-none"
              >
                <span className="flex-1 text-center">{selectedArea}</span>
                <span className={`material-symbols-outlined transition-transform duration-200 text-base ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Menu List Isi Dropdown */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-[#0f2c7a] border-2 border-white rounded-xl shadow-[4px_4px_0_0_rgba(17,24,39,1)] overflow-hidden flex flex-col">
                  {areas.map((area, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedArea(area);
                        setIsDropdownOpen(false);
                                        }}
                      className={`w-full text-left text-white font-bold px-6 py-3 text-sm transition-colors hover:bg-blue-800 outline-none ${
                        index !== areas.length - 1 ? 'border-b border-white/20' : ''
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* GRID CARD OUTLET */}
          {loading ? (
            <div className="col-span-full text-center py-8 text-white font-bold">
              Memuat data outlet...
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 inline-block">
                <p className="text-red-700 font-bold">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedOutlets.length > 0 ? displayedOutlets.map((outlet) => {
              const CardWrapper = outlet.isOpen ? 'a' : 'div';
              return (
                <CardWrapper
                  key={outlet.id}
                  {...(outlet.isOpen ? {
                    href: outlet.mapsUrl,
                    target: "_blank",
                    rel: "noopener noreferrer"
                  } : {})}
                  className={`rounded-2xl p-4 flex items-center gap-4 border-4 transition-all ${
                    outlet.isOpen
                      ? 'bg-white shadow-[4px_4px_0_0_rgba(17,24,39,1)] border-white hover:-translate-y-1 hover:border-gray-900 cursor-pointer'
                      : 'bg-gray-400 shadow-[4px_4px_0_0_rgba(17,24,39,1)] border-gray-900 opacity-90 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${outlet.isOpen ? 'bg-yellow-400' : 'bg-white'}`}>
                    <span className="material-symbols-outlined text-gray-900" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-[13px] ${outlet.isOpen ? 'text-[#0f2c7a]' : 'text-gray-900'}`}>{outlet.name}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-wide ${outlet.isOpen ? 'text-green-600' : 'text-gray-700'}`}>{outlet.status}</p>
                  </div>
                  <span className={`material-symbols-outlined ${outlet.isOpen ? 'text-gray-400' : 'text-gray-700'}`}>chevron_right</span>
                </CardWrapper>
              );
            }) : (
                <div className="col-span-full text-center py-8 text-white font-bold">
                  Tidak ada outlet di area ini.
                </div>
              )}
            </div>
          )}
        </div>

        {/* DYNAMIC FOOTER IMAGE & BAR */}
        <div className="w-full bg-[#1e3a8a] mt-auto">
          {/* Responsive Illustration */}
          <div className="w-full relative overflow-hidden">
            <img
              src="/footersapi.png"
              alt="Susu Gepuk Farm"
              className="w-full h-auto object-cover block"
            />
          </div>

          {/* Footer Content */}
          <div className="bg-[#0f2c7a] pt-12 pb-8 px-8 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-white border-4 border-gray-900 rounded-[40px] px-11 py-2 shadow-[4px_4px_0_0_rgba(17,24,39,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(17,24,39,1)] transition-all cursor-pointer flex items-center justify-center">
                <img src="/susu.png" alt="Susu Gepuk" className="h-14 md:h-16" />
              </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mt-2">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-white font-bold tracking-wide uppercase text-sm md:text-base mb-1">
                  SUSU SEGAR TIAP HARI
                </h3>
                <p className="text-blue-300 text-xs font-medium">
                  © 2021 Susu Gepuk Indonesia. All rights reserved.
                </p>
              </div>

              <div className="flex-1 text-center md:text-right">
                <h3 className="text-white font-bold tracking-wide uppercase text-sm md:text-base mb-1">
                  KAYA VITAMIN, SEHAT & BERKALSIUM
                </h3>
                <p className="text-blue-300 text-xs font-medium">
                  @susugepuk
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}