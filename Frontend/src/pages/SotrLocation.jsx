import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import riderService from '../services/riderService';

const getFotoUrl = (fotoPath) => {
  if (!fotoPath) return null;
  if (fotoPath.startsWith('http')) return fotoPath;
  const storageBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '/storage');
  return `${storageBaseUrl}/${fotoPath}`;
};

export default function SotrLocations() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState('Semua');

  // Fetch riders from API
  useEffect(() => {
    const fetchRiders = async () => {
      try {
        setLoading(true);
        const response = await riderService.getAllRiders();
        
        if (response.success && response.data) {
          // Filter out inactive riders
          const activeRiders = response.data.filter(rider => rider.status_akun === 'Aktif');

          // Map API response to component format
          const mappedRiders = activeRiders.map((rider) => ({
            id: rider.id_rider,
            area: rider.area,
            name: rider.nama_rider,
            status: rider.status_jualan,
            liveLocationStatus: rider.status_live_location,
            location: rider.current_location,
            foto_rider: rider.foto_rider,
            latitude: rider.latitude,
            longitude: rider.longitude,
            mapsUrl: rider.latitude && rider.longitude
              ? `https://www.google.com/maps?q=${rider.latitude},${rider.longitude}`
              : null,
          }));
          setRiders(mappedRiders);
        } else {
          setError('Gagal mengambil data rider');
        }
      } catch (err) {
        setError('Gagal mengambil data rider');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();
  }, []);

  // Get unique areas from riders
  const areas = ['Semua', ...new Set(riders.map((rider) => rider.area))];

  // Filter rider berdasarkan area yang dipilih
  const displayedRiders = riders.filter(rider => {
    if (selectedArea === 'Semua') return true;
    return rider.area === selectedArea;
  });

  return (
    <>
      <Header />
      <main className="pt-[80px] min-h-screen flex flex-col bg-[#1e3a8a]">
        <div className="flex-1 max-w-7xl mx-auto w-full px-8 pt-24 pb-24">

          {/* HEADER SECTION: Judul, Garis, dan Tombol Area */}
          <div className="flex flex-col gap-4 mb-16">
            {/* Bagian Judul & Garis */}
            <div className="flex items-center gap-4 w-full">
              <div className="bg-[#0f2c7a] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold z-10 border-2 border-transparent whitespace-nowrap">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                LOKASI SOTR
              </div>
              <div className="h-0.5 flex-1 bg-blue-200 opacity-40"></div>
            </div>

            {/* Bagian Tombol Custom Dropdown */}
            <div className="relative self-end w-full md:w-[240px] z-20">

              {/* Tombol Utama (Kuning) */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#fde047] text-gray-900 font-bold px-6 py-2.5 rounded-xl border-2 border-gray-900 shadow-[3px_3px_0_0_rgba(17,24,39,1)] hover:bg-yellow-400 transition-all cursor-pointer flex items-center justify-between text-sm outline-none"
              >
                <span className="flex-1 text-left">{selectedArea === 'Semua' ? 'Pilih Area' : selectedArea}</span>
                <span className={`material-symbols-outlined transition-transform duration-200 text-base ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Menu List Isi Dropdown (Biru) */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-[#0f2c7a] border-2 border-white rounded-xl shadow-[4px_4px_0_0_rgba(17,24,39,1)] overflow-hidden flex flex-col max-h-64 overflow-y-auto">
                  {areas.map((area, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedArea(area);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left text-white font-bold px-6 py-3 text-sm transition-colors hover:bg-blue-800 outline-none ${index !== areas.length - 1 ? 'border-b border-white/20' : ''
                        }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* GRID CARD SOTR */}
          {loading ? (
            <div className="col-span-full text-center py-8 text-white font-bold">
              Memuat data rider...
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 inline-block">
                <p className="text-red-700 font-bold">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 mt-8">
              {displayedRiders.length > 0 ? displayedRiders.map((rider) => (
                <div key={rider.id} className="bg-white rounded-3xl pt-14 pb-8 px-6 relative flex flex-col items-center border-4 border-gray-900 shadow-[6px_6px_0_0_rgba(17,24,39,1)]">
                  {/* Avatar Circle */}
                  <div 
                    className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#d9d9d9] shrink-0 border-[4px] border-gray-900 flex items-center justify-center overflow-hidden shadow-xl"
                    style={{ borderRadius: '60%' }}
                  >
                    {rider.foto_rider ? (
                      <img 
                        src={getFotoUrl(rider.foto_rider)} 
                        alt={rider.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/susu.webp';
                          e.target.className = 'w-full h-full object-contain p-2 bg-white';
                        }}
                      />
                    ) : (
                      <img 
                        src="/susu.webp" 
                        alt="Logo Susu Gepuk" 
                        className="w-full h-full object-contain p-2 bg-white"
                      />
                    )}
                  </div>

                  {/* Rider Name (Centered) */}
                  <h4 className="font-bold text-gray-900 mb-6 font-headline-md text-center">{rider.name || 'NAMA'}</h4>

                  <div className="w-full h-1 bg-gray-900 mb-6"></div>

                  {/* Location Detail block */}
                  <div className="flex items-start gap-3 w-full mb-8">
                    <div className="w-8 h-8 bg-[#0f2c7a] rounded-full flex items-center justify-center shrink-0 mt-1">
                      <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-gray-500 mb-1 font-label-bold uppercase tracking-wider">LOKASI SAAT INI</p>
                      <p className="font-bold text-gray-900 text-sm">
                        {rider.liveLocationStatus === 'Aktif' ? (rider.location || 'Lokasi tidak tersedia') : 'LOKASI TIDAK DIBAGIKAN'}
                      </p>
                    </div>
                  </div>

                  {rider.liveLocationStatus === 'Aktif' && (rider.mapsUrl || (rider.latitude && rider.longitude) || rider.location) ? (
                    <a
                      href={rider.mapsUrl || (rider.latitude && rider.longitude 
                        ? `https://www.google.com/maps?q=${rider.latitude},${rider.longitude}` 
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rider.location)}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#b91c1c] text-white font-bold px-6 py-3 rounded-full border-[3px] border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex items-center gap-2 hover:bg-red-800 hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(17,24,39,1)] transition-all text-[11px] uppercase tracking-wide"
                    >
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                      LIHAT LIVE LOCATION
                    </a>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-400 text-white font-bold px-6 py-3 rounded-full border-[3px] border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex items-center gap-2 text-[11px] uppercase tracking-wide cursor-not-allowed opacity-60"
                    >
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      LOKASI TIDAK DIBAGIKAN
                    </button>
                  )}
                </div>
            )) : (
              <div className="col-span-full text-center py-8 text-white font-bold">
                Tidak ada rider di area ini.
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
              src="/footersapi.webp"
              alt="Susu Gepuk Farm"
              className="w-full h-auto object-cover block"
            />
          </div>

          {/* Footer Content */}
          <div className="bg-[#0f2c7a] pt-12 pb-8 px-8 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-white border-4 border-gray-900 rounded-[40px] px-11 py-2 shadow-[4px_4px_0_0_rgba(17,24,39,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(17,24,39,1)] transition-all cursor-pointer flex items-center justify-center">
                <img src="/susu.webp" alt="Susu Gepuk" className="h-14 md:h-16" />
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