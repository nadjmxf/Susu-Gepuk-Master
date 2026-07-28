import React from 'react';

export default function RiderList({
  searchQuery,
  setSearchQuery,
  loading,
  filteredRiders,
  getStatusDetails,
  getFotoUrl,
  handleViewDetail,
  handleOpenAbsensiModal,
  setIsAddModalOpen
}) {
  return (
    <>
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-[#FACC15] inline-block border-b-[6px] border-[#FACC15] pb-2 tracking-wide uppercase">
            Kelola Data Rider
          </h1>
        </div>
      </div>

      {/* Search and Action Buttons Row */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
            search
          </span>
          <input
            type="text"
            placeholder="Cari nama rider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-[3px] border-black rounded-xl focus:ring-0 focus:outline-none font-bold text-black text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleOpenAbsensiModal}
            className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-3 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined font-black text-sm">calendar_month</span>
            Catat Absensi
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-3 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined font-black text-sm">person_add</span>
            Tambah Akun
          </button>
        </div>
      </div>

      {/* Grid Kartu Rider */}
      {loading ? (
        <div className="text-center py-10 text-white font-bold text-lg">
          Memuat data rider...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 pt-12">
          {filteredRiders.map((rider) => {
            const isLive = rider.status_live_location === 'Aktif';
            const isAktif = rider.status_akun === 'Aktif';
            const locationText = isLive 
              ? (rider.location?.alamat || (rider.area ? `Area ${rider.area}` : 'Lokasi tidak tersedia')) 
              : 'Lokasi tidak tersedia';

            return (
              <div
                key={rider.id_rider}
                className="bg-white rounded-3xl pt-14 pb-8 px-6 relative flex flex-col items-center border-[4px] border-black shadow-[6px_6px_0_0_#000]"
              >
                {/* Status Akun Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className={`border-2 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${isAktif
                      ? 'border-[#22C55E] bg-green-50 text-[#22C55E]'
                      : 'border-gray-400 bg-gray-50 text-gray-500'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isAktif ? 'bg-[#22C55E]' : 'bg-gray-400'}`}></span>
                    {isAktif ? 'AKTIF' : 'NONAKTIF'}
                  </div>
                </div>

                {/* Overlapping Avatar Image (Circle Shape) */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#d9d9d9] shrink-0 border-[4px] border-black rounded-full flex items-center justify-center overflow-hidden shadow-xl z-10">
                  {rider.foto_rider ? (
                    <img
                      src={getFotoUrl(rider.foto_rider)}
                      alt={rider.nama_rider}
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
                <h4 className="font-black text-black text-xl mb-6 text-center tracking-tight">
                  {rider.nama_rider}
                </h4>

                {/* Horizontal Divider Line */}
                <div className="w-full h-1 bg-black mb-6"></div>

                {/* Location Detail Row */}
                <div className="flex items-start gap-3 w-full mb-8">
                  <div className="w-8 h-8 bg-[#0f2c7a] rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      location_on
                    </span>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5">
                      LOKASI SAAT INI
                    </p>
                    <p className="font-black text-black text-sm leading-snug break-words">
                      {locationText}
                    </p>
                  </div>
                </div>

                {/* Action Pill Button */}
                {isLive ? (
                  <button
                    onClick={() => handleViewDetail(rider)}
                    className="w-full bg-[#b91c1c] hover:bg-red-800 text-white font-black px-6 py-3 rounded-2xl border-[3px] border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all text-[11px] uppercase tracking-wide cursor-pointer"
                  >
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                    LIHAT LIVE LOCATION
                  </button>
                ) : (
                  <button
                    onClick={() => handleViewDetail(rider)}
                    className="w-full bg-[#64748b] hover:bg-slate-600 text-white font-black px-6 py-3 rounded-2xl border-[3px] border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all text-[11px] uppercase tracking-wide cursor-pointer"
                  >
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    LOKASI TIDAK TERSEDIA
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
