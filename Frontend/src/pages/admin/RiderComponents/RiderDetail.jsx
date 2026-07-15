import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon for leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
  return null;
}

export default function RiderDetail({
  selectedRider,
  setSelectedRider,
  statusAkunRider,
  handleOpenEditModal,
  handleToggleStatusSwitch,
  getFotoUrl,
  activityMonth,
  setActivityMonth,
  activityYear,
  setActivityYear,
  activities,
  loadingActivities,
  activityPage,
  setActivityPage,
  startRow,
  endRow,
  totalActivityPages,
  currentActivities
}) {
  return (
    <div className="space-y-8">
      {/* Top Header Row with Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedRider(null)}
            className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl p-2.5 font-black text-xs uppercase flex items-center justify-center cursor-pointer"
            title="Kembali ke Daftar"
          >
            <span className="material-symbols-outlined font-black text-lg">arrow_back</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-[#FACC15] inline-block border-b-[6px] border-[#FACC15] pb-2 tracking-wide uppercase">
            Kelola Data Rider
          </h1>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-transparent mt-4">
        {/* Edit Akun Button */}
        <button
          onClick={handleOpenEditModal}
          className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined font-black text-sm">edit</span>
          EDIT AKUN
        </button>

        {/* Status Akun Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-white uppercase tracking-wider">Status Akun</span>
          <button
            onClick={handleToggleStatusSwitch}
            className={`w-12 h-6.5 rounded-full border-[3px] border-black flex items-center p-0.5 transition-colors cursor-pointer ${statusAkunRider ? 'bg-[#22C55E] justify-end' : 'bg-gray-400 justify-start'}`}
          >
            <div className="w-4 h-4 rounded-full bg-white border-2 border-black"></div>
          </button>
        </div>
      </div>

      {/* Two-Column Grid: Profile & Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Profile Card */}
        <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0_0_#000] flex flex-col sm:flex-row gap-6 items-center sm:items-start text-left">
          {/* Avatar Photo */}
          <div className="w-32 h-32 rounded-2xl border-[3px] border-black overflow-hidden shrink-0 shadow-[3px_3px_0_0_#000] bg-white flex items-center justify-center">
            {selectedRider.foto_rider ? (
              <img
                src={getFotoUrl(selectedRider.foto_rider)}
                alt={selectedRider.nama_rider}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/susu.png';
                  e.target.className = 'w-full h-full object-contain p-4 bg-white';
                }}
              />
            ) : (
              <img
                src="/susu.png"
                alt="Logo Susu Gepuk"
                className="w-full h-full object-contain p-4 bg-white"
              />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <h2 className="text-xl font-black text-black leading-none">{selectedRider.nama_rider}</h2>
                <span className="text-xs font-bold text-gray-400">
                  @{selectedRider.username || selectedRider.nama_rider.toLowerCase().replace(/[^a-z0-9]/g, '') + '_susu99'}
                </span>
              </div>
              <div className={`border-2 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${statusAkunRider
                  ? 'border-[#22C55E] bg-green-50 text-[#22C55E]'
                  : 'border-gray-400 bg-gray-50 text-gray-500'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusAkunRider ? 'bg-[#22C55E]' : 'bg-gray-400'}`}></span>
                {statusAkunRider ? 'Akun aktif' : 'Nonaktif'}
              </div>
            </div>

            {/* Profile attributes with Grid */}
            <div className="grid grid-cols-[20px_110px_10px_1fr] items-center text-xs font-bold text-gray-700 gap-y-2">
              <span className="material-symbols-outlined text-sm text-gray-500">phone</span>
              <span>Phone</span>
              <span>:</span>
              <span>{selectedRider.no_hp}</span>

              <span className="material-symbols-outlined text-sm text-gray-500">calendar_month</span>
              <span>Tanggal Bergabung</span>
              <span>:</span>
              <span>{selectedRider.created_at ? new Date(selectedRider.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>

              <span className="material-symbols-outlined text-sm text-gray-500">calendar_month</span>
              <span>Tanggal Berhenti</span>
              <span>:</span>
              <span>-</span>
            </div>
          </div>
        </div>

        {/* Right Card: Performance Summary */}
        <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0_0_#000] flex flex-col justify-between text-left">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-black uppercase tracking-wider">Ringkasan Performa</h3>
            <span className="bg-black text-white font-black px-4 py-1.5 rounded-lg border-2 border-black text-xs uppercase flex items-center gap-1">
              Bulan Ini
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Produk Terjual */}
            <div className="border-[3px] border-black rounded-xl p-4 bg-white shadow-[4px_4px_0_0_#000] text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">PRODUK TERJUAL</span>
              <span className="text-3xl font-black text-black">
                {String(selectedRider.performance?.produk_terjual || 0).padStart(3, '0')}
              </span>
            </div>

            {/* Total Pendapatan */}
            <div className="border-[3px] border-black rounded-xl p-4 bg-white shadow-[4px_4px_0_0_#000] text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">TOTAL PENDAPATAN</span>
              <span className="text-3xl font-black text-black block">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedRider.performance?.total_pendapatan || 0)}
              </span>
              <span className="text-[10px] font-bold text-gray-500 mt-1 block">
                Target: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedRider.performance?.target_pendapatan || 15000000)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Card: Outlet & Lokasi */}
      <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0_0_#000] flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-black font-black text-xl">storefront</span>
          <h3 className="text-sm font-black text-black uppercase tracking-wider">Outlet & Lokasi</h3>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-center">
          {/* Map Box */}
          <div className="border-[3px] border-black rounded-xl h-64 w-full relative overflow-hidden shadow-[4px_4px_0_0_#000] flex items-center justify-center z-10">
            {selectedRider.location?.latitude && selectedRider.location?.longitude ? (
              <MapContainer
                center={[selectedRider.location.latitude, selectedRider.location.longitude]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapResizer />
                <Marker position={[selectedRider.location.latitude, selectedRider.location.longitude]}>
                  <Popup>
                    <div className="text-center font-bold text-xs">
                      <p>{selectedRider.nama_rider}</p>
                      <p className="text-gray-500 font-mono mt-1">
                        {selectedRider.location.latitude.toFixed(4)}, {selectedRider.location.longitude.toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="absolute inset-0 bg-[#E5E9F0] bg-[radial-gradient(#A3B1C9_1.5px,transparent_1.5px)] [background-size:24px_24px] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">location_off</span>
                <p className="text-xs font-bold text-gray-500">LOKASI RIDER TIDAK TERSEDIA</p>
              </div>
            )}

            {/* Map Preview Badge */}
            <div className="absolute top-4 left-4 bg-black border-2 border-black text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-[2px_2px_0_0_#000] z-[1000]">
              LIVE LOCATION
            </div>
          </div>

          {/* Info Box */}
          <div className="space-y-4 lg:pl-4 text-left">
            <div>
              <h4 className="text-2xl font-black text-black tracking-tight">{`SOTR-${String(selectedRider.id_rider).padStart(2, '0')}`}</h4>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full animate-pulse ${selectedRider.status_jualan === 'Tersedia' ? 'bg-[#22C55E]' : 'bg-red-500'}`}></span>
              <span className="text-sm font-black text-black">
                {selectedRider.status_jualan === 'Tersedia' ? 'Sedang Berjualan' : 'Selesai Berjualan / Stok Habis'}
              </span>
            </div>

            <p className="text-xs text-gray-700 font-bold max-w-xs leading-relaxed">
              <span className="font-black">Alamat: </span>
              {selectedRider.location?.alamat || 'Lokasi tidak tersedia'}
            </p>

            <p className="text-xs text-gray-500 font-bold">
              Terakhir diperbarui: {selectedRider.location?.waktu_update ? new Date(selectedRider.location.waktu_update).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Belum diperbarui'}
            </p>
          </div>
        </div>
      </div>

      {/* Full-width Card: Riwayat Aktivitas */}
      <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0_0_#000] flex flex-col text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black font-black text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>event_note</span>
            <h3 className="text-sm font-black text-black uppercase tracking-wider">Riwayat Aktivitas</h3>
          </div>

          {/* Dropdowns */}
          <div className="flex gap-2">
            <select
              value={activityMonth}
              onChange={(e) => setActivityMonth(e.target.value)}
              className="bg-white border-[3px] border-black rounded-xl px-4 py-1.5 text-xs font-black text-black focus:outline-none focus:ring-0 cursor-pointer shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_#000] transition-all"
            >
              <option value="Januari">Januari</option>
              <option value="Februari">Februari</option>
              <option value="Maret">Maret</option>
              <option value="April">April</option>
              <option value="Mei">Mei</option>
              <option value="Juni">Juni</option>
              <option value="Juli">Juli</option>
              <option value="Agustus">Agustus</option>
              <option value="September">September</option>
              <option value="Oktober">Oktober</option>
              <option value="November">November</option>
              <option value="Desember">Desember</option>
            </select>
            <select
              value={activityYear}
              onChange={(e) => setActivityYear(e.target.value)}
              className="bg-white border-[3px] border-black rounded-xl px-4 py-1.5 text-xs font-black text-black focus:outline-none focus:ring-0 cursor-pointer shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_#000] transition-all"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>

        {/* Summary Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="border-[3px] border-black rounded-xl p-4 bg-white shadow-[4px_4px_0_0_#000] text-center">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">TOTAL HADIR</span>
            <div className="text-xl font-black text-black">
              {activities.filter(a => a.status_aktivitas === 'Berjualan').length} <span className="text-xs font-bold text-gray-500">hari</span>
            </div>
          </div>
          <div className="border-[3px] border-black rounded-xl p-4 bg-white shadow-[4px_4px_0_0_#000] text-center">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">IZIN</span>
            <div className="text-xl font-black text-black">
              {activities.filter(a => a.status_aktivitas === 'Izin').length} <span className="text-xs font-bold text-gray-500">hari</span>
            </div>
          </div>
          <div className="border-[3px] border-black rounded-xl p-4 bg-white shadow-[4px_4px_0_0_#000] text-center">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">SAKIT</span>
            <div className="text-xl font-black text-black">
              {activities.filter(a => a.status_aktivitas === 'Sakit').length} <span className="text-xs font-bold text-gray-500">hari</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000] mb-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="hidden md:table w-full border-collapse bg-white text-left text-xs font-bold text-black">
              <thead>
                <tr className="bg-[#F1F5F9] border-b-[3px] border-black text-[10px] uppercase tracking-wider font-black">
                  <th className="px-6 py-3 border-r-2 border-gray-200">TANGGAL</th>
                  <th className="px-6 py-3 border-r-2 border-gray-200">STATUS</th>
                  <th className="px-6 py-3">KETERANGAN</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {loadingActivities ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500 font-bold">
                      Memuat riwayat aktivitas...
                    </td>
                  </tr>
                ) : activities.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-400 font-bold">
                      Tidak ada riwayat aktivitas pada bulan ini.
                    </td>
                  </tr>
                ) : (
                  currentActivities.map((act) => {
                    let statusBadge = null;
                    if (act.status_aktivitas === 'Berjualan') {
                      statusBadge = (
                        <span className="border-2 border-[#22C55E] bg-green-50 text-[#22C55E] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                          Hadir
                        </span>
                      );
                    } else if (act.status_aktivitas === 'Sakit') {
                      statusBadge = (
                        <span className="border-2 border-[#DC2626] bg-red-50 text-[#DC2626] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
                          Sakit
                        </span>
                      );
                    } else if (act.status_aktivitas === 'Izin') {
                      statusBadge = (
                        <span className="border-2 border-[#1E40AF] bg-blue-50 text-[#1E40AF] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF]"></span>
                          Izin
                        </span>
                      );
                    } else {
                      statusBadge = (
                        <span className="border-2 border-gray-400 bg-gray-50 text-gray-500 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Tidak ada aktivitas
                        </span>
                      );
                    }

                    return (
                      <tr key={act.id_aktivitas} className={`hover:bg-gray-50 transition-colors ${act.status_aktivitas === 'Sakit' ? 'bg-[#FFF0F3]' : act.status_aktivitas === 'Izin' ? 'bg-[#F8FAFC]' : ''}`}>
                        <td className="px-6 py-4 border-r-2 border-gray-100 font-black">
                          {new Date(act.tanggal_aktivitas).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 border-r-2 border-gray-100">
                          {statusBadge}
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">
                          {act.keterangan || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Card Content - Mobile */}
          <div className="block md:hidden divide-y-[2px] divide-gray-100 bg-white">
            {loadingActivities ? (
              <div className="p-6 text-center text-gray-500 font-bold">
                Memuat riwayat aktivitas...
              </div>
            ) : activities.length === 0 ? (
              <div className="p-6 text-center text-gray-400 font-bold">
                Tidak ada riwayat aktivitas pada bulan ini.
              </div>
            ) : (
              currentActivities.map((act) => {
                let statusBadge = null;
                if (act.status_aktivitas === 'Berjualan') {
                  statusBadge = (
                    <span className="border-2 border-[#22C55E] bg-green-50 text-[#22C55E] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                      Hadir
                    </span>
                  );
                } else if (act.status_aktivitas === 'Sakit') {
                  statusBadge = (
                    <span className="border-2 border-[#DC2626] bg-red-50 text-[#DC2626] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
                      Sakit
                    </span>
                  );
                } else if (act.status_aktivitas === 'Izin') {
                  statusBadge = (
                    <span className="border-2 border-[#1E40AF] bg-blue-50 text-[#1E40AF] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF]"></span>
                      Izin
                    </span>
                  );
                } else {
                  statusBadge = (
                    <span className="border-2 border-gray-400 bg-gray-50 text-gray-500 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      Tidak ada aktivitas
                    </span>
                  );
                }

                return (
                  <div key={act.id_aktivitas} className={`p-4 flex flex-col gap-2 relative text-left ${act.status_aktivitas === 'Sakit' ? 'bg-[#FFF0F3]' : act.status_aktivitas === 'Izin' ? 'bg-[#F8FAFC]' : ''}`}>
                    <div className="flex justify-between items-start">
                      <span className="font-black text-black">
                        {new Date(act.tanggal_aktivitas).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <div>{statusBadge}</div>
                    </div>
                    <div className="text-gray-500 font-medium text-xs">
                      {act.keterangan || '-'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Table Footer / Pagination */}
        {activities.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-gray-500 font-bold">
              Menampilkan {startRow} - {endRow} dari {activities.length} baris
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setActivityPage(prev => Math.max(1, prev - 1))}
                disabled={activityPage === 1}
                className={`bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-sm shadow-[2px_2px_0_0_#000] ${activityPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'}`}
              >
                &lt;
              </button>
              
              {Array.from({ length: totalActivityPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setActivityPage(page)}
                  className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs shadow-[2px_2px_0_0_#000] cursor-pointer ${activityPage === page ? 'bg-[#FACC15]' : 'bg-white hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'}`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setActivityPage(prev => Math.min(totalActivityPages, prev + 1))}
                disabled={activityPage === totalActivityPages}
                className={`bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-sm shadow-[2px_2px_0_0_#000] ${activityPage === totalActivityPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'}`}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
