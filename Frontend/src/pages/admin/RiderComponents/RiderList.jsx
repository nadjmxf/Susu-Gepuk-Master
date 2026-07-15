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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-6 pt-10">
          {filteredRiders.map((rider) => {
            const statusStyle = getStatusDetails(rider.status_kehadiran);
            const isAktif = rider.status_akun === 'Aktif';
            return (
              <div
                key={rider.id_rider}
                className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0_0_#000] relative flex flex-col pt-12"
              >
                {/* Overlapping Avatar Image */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-[3px] border-black bg-white overflow-hidden shadow-[2px_2px_0_0_#000] flex items-center justify-center">
                  {rider.foto_rider ? (
                    <img
                      src={getFotoUrl(rider.foto_rider)}
                      alt={rider.nama_rider}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/susu.png';
                        e.target.className = 'w-full h-full object-contain p-2 bg-white';
                      }}
                    />
                  ) : (
                    <img
                      src="/susu.png"
                      alt="Logo Susu Gepuk"
                      className="w-full h-full object-contain p-2 bg-white"
                    />
                  )}
                </div>

                {/* Status Akun Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`border-2 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${isAktif
                      ? 'border-[#22C55E] bg-green-50 text-[#22C55E]'
                      : 'border-gray-400 bg-gray-50 text-gray-500'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isAktif ? 'bg-[#22C55E]' : 'bg-gray-400'}`}></span>
                    {isAktif ? 'AKTIF' : 'NONAKTIF'}
                  </div>
                </div>

                {/* Card Content */}
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-black text-black tracking-tight">{rider.nama_rider}</h3>
                  <p className="text-sm font-bold text-gray-500">{rider.no_hp}</p>
                </div>

                <hr className="border-t-2 border-gray-100 my-4" />

                {/* Attendance Status */}
                <div className="flex justify-center items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Status Kehadiran:</span>
                  <div className="flex items-center gap-1 ml-1">
                    <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                    <span className={`font-black ${statusStyle.color}`}>{rider.status_kehadiran}</span>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gray-50 border-2 border-gray-100 rounded-xl p-3 flex flex-col gap-1 mt-5 text-left">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{rider.code}</span>
                  <div className="flex items-center text-xs font-bold text-gray-700 mt-0.5">
                    <span className="material-symbols-outlined text-sm mr-1 text-red-500">location_on</span>
                    <span className="truncate">{rider.area}</span>
                  </div>
                </div>

                {/* Button CTA */}
                <button
                  onClick={() => handleViewDetail(rider)}
                  className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-black py-2.5 px-4 rounded-xl border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all text-xs tracking-wider uppercase mt-5 cursor-pointer"
                >
                  Lihat Profil Selengkapnya
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
