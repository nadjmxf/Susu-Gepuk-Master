import React, { useState } from 'react';

const riderData = [
  { name: 'Budi', lokasi: 'Jl. Sudirman', terjual: 48, progress: 2, aksi: 0, status: 'LENGKAP' },
  { name: 'Santoso', lokasi: 'Jl. Yos Sudarso', terjual: 55, progress: 2, aksi: 3, status: 'ADA BASI' },
  { name: 'Rafi', lokasi: 'Jl. Diponegoro', terjual: 45, progress: 0, aksi: 0, status: 'LENGKAP' },
];

const stats = [
  { label: 'ACTIVE RIDERS', value: 21 },
  { label: 'OFFLINE RIDERS', value: 5 },
  { label: 'TOTAL OUTLET', value: 7 },
  { label: 'TOTAL PRODUCT', value: 40 },
];

export default function AdminDashboard() {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="w-full pb-10">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#fdd835] inline-block border-b-4 border-[#fdd835] pb-1 tracking-wide">
          Dashboard
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border-4 border-gray-900 rounded-2xl p-5 shadow-[6px_6px_0_0_rgba(17,24,39,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(17,24,39,1)] transition-all">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-4xl font-black text-gray-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Live Location Rider */}
      <div className="bg-white border-4 border-gray-900 rounded-2xl shadow-[8px_8px_0_0_rgba(17,24,39,1)] overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-[#fdd835] border-b-4 border-gray-900 px-6 py-4">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">LIVE LOCATION RIDER</h2>
        </div>

        {/* Map + Badges */}
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Left: Badges */}
          <div className="lg:w-48 shrink-0 bg-white p-6 flex flex-col gap-3 border-r-4 border-gray-200">
            <div className="flex items-center gap-2 bg-green-500 text-white text-xs font-black px-4 py-2 rounded-full border-2 border-gray-900 shadow-[2px_2px_0_0_rgba(17,24,39,1)] w-fit">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              + 10 AVAILABLE
            </div>
            <div className="flex items-center gap-2 bg-gray-400 text-white text-xs font-black px-4 py-2 rounded-full border-2 border-gray-900 shadow-[2px_2px_0_0_rgba(17,24,39,1)] w-fit">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              + 5 OFFLINE
            </div>
          </div>

          {/* Right: Map */}
          <div className="flex-1 relative min-h-[260px] bg-slate-900 flex items-center justify-center overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            {/* Map lines */}
            <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,25 L100,55 M0,75 L100,35 M25,0 L55,100 M65,0 L45,100 M10,0 L30,100 M80,0 L60,100" stroke="#94a3b8" strokeWidth="0.4" fill="none"/>
            </svg>
            {/* Rider Pins */}
            <div className="relative z-10 bg-[#fdd835] w-12 h-12 rounded-full border-4 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-900 text-xl">two_wheeler</span>
              <div className="absolute inset-0 border-4 border-[#fdd835] rounded-full animate-ping opacity-50"></div>
            </div>
            {/* Other dots */}
            {[
              { top: '20%', left: '25%', color: 'bg-blue-400' },
              { top: '35%', left: '60%', color: 'bg-blue-400' },
              { top: '65%', left: '40%', color: 'bg-orange-400' },
              { top: '50%', left: '78%', color: 'bg-blue-400' },
              { top: '25%', left: '80%', color: 'bg-blue-400' },
              { top: '75%', left: '70%', color: 'bg-blue-400' },
              { top: '80%', left: '20%', color: 'bg-gray-400' },
              { top: '15%', left: '50%', color: 'bg-blue-400' },
            ].map((dot, i) => (
              <div key={i} className={`absolute ${dot.color} w-3.5 h-3.5 rounded-full border-2 border-white shadow-md`} style={{ top: dot.top, left: dot.left }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Rekap Kinerja Rider */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#fdd835] text-xl">bar_chart</span>
          <h2 className="text-white font-black text-lg uppercase tracking-wide">REKAP KINERJA RIDER</h2>
        </div>

        <div className="bg-[#111827] border-4 border-gray-700 rounded-2xl overflow-hidden shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]">
          {/* Table Header */}
          <div className="grid grid-cols-6 px-6 py-3 border-b-2 border-gray-700 text-gray-400 text-[11px] font-black uppercase tracking-widest">
            <span>NAMA RIDER</span>
            <span>LOKASI TERAKHIR</span>
            <span>TERJUAL</span>
            <span>PROGRESS</span>
            <span>AKSI</span>
            <span>STATUS</span>
          </div>

          {/* Table Rows */}
          {riderData.map((rider, i) => (
            <div key={i} className={`grid grid-cols-6 px-6 py-4 items-center border-b border-gray-800 hover:bg-gray-800 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-900/30'}`}>
              <span className="text-white font-bold text-sm">{rider.name}</span>
              <span className="text-gray-300 text-sm">{rider.lokasi}</span>
              <span className="text-white font-black text-lg">{rider.terjual}</span>
              <span className="text-white font-black text-lg">{rider.progress}</span>
              <span className={`font-black text-lg ${rider.aksi > 0 ? 'text-red-400' : 'text-white'}`}>{rider.aksi}</span>
              <span>
                <span className={`text-xs font-black px-3 py-1.5 rounded-full border-2 border-gray-900 ${
                  rider.status === 'LENGKAP'
                    ? 'bg-green-500 text-white'
                    : 'bg-[#fdd835] text-gray-900'
                }`}>
                  {rider.status}
                </span>
              </span>
            </div>
          ))}

          {/* Footer */}
          <div className="flex items-center justify-center py-4 border-t border-gray-700">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-[#fdd835] font-bold text-sm hover:underline flex items-center gap-1"
            >
              Lihat Semua Kinerja
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
