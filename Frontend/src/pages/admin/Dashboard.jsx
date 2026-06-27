import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const quickActions = [
    { name: 'Catat Absensi Rider', icon: 'assignment', color: 'bg-[#ffd600]', path: '/admin/absensi' },
    { name: 'Tambah Rider Baru', icon: 'person_add', color: 'bg-[#22d3ee]', path: '/admin/riders' },
    { name: 'Tambah Menu Baru', icon: 'add_circle', color: 'bg-[#ff4590]', path: '/admin/menu' },
    { name: 'Tambah Outlet / Gerobak', icon: 'storefront', color: 'bg-[#22c55e]', path: '/admin/outlets' },
  ];

  const fixedOutlets = [
    { id: 'out-1', name: 'Outlet Panam', top: '60%', left: '20%', desc: 'Kondisi Operasional Buka' },
    { id: 'out-2', name: 'Outlet Rumbai', top: '25%', left: '50%', desc: 'Kondisi Operasional Buka' },
    { id: 'out-3', name: 'Outlet Sudirman', top: '48%', left: '65%', desc: 'Kondisi Operasional Buka' },
  ];

  const sotrUnits = [
    { id: 'rider-1', name: 'Rider Budi (SOTR)', top: '40%', left: '42%', desc: 'Status: Berjualan' },
    { id: 'rider-2', name: 'Rider Santoso (SOTR)', top: '68%', left: '72%', desc: 'Status: Berjualan' },
    { id: 'rider-3', name: 'Rider Rafi (SOTR)', top: '32%', left: '78%', desc: 'Status: Standby' },
  ];

  const announcements = [
    { title: 'Promo Akhir Bulan: Rider Performance', desc: 'Detail promo khusus peningkatan penjualan rider.' },
    { title: 'Update SOP Kebersihan Outlet', desc: 'Panduan standar operasional kebersihan terbaru.' },
    { title: 'Jadwal Maintenance SOTR Pekanbaru', desc: 'Pemeliharaan armada bergerak pekan ini.' }
  ];

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Title */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-[#fdd835] inline-block border-b-[6px] border-[#fdd835] pb-2 tracking-wide uppercase">
          Dashboard
        </h1>
      </div>

      {/* Quick Actions Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickActions.map((action, i) => (
          <Link
            key={i}
            to={action.path}
            className={`${action.color} border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all flex flex-col items-center justify-center text-center group cursor-pointer w-full h-28`}
          >
            <span className="material-symbols-outlined text-black text-3xl mb-2 font-black transition-transform group-hover:scale-110">
              {action.icon}
            </span>
            <span className="text-black font-black text-sm leading-tight">
              {action.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Main Map & KPI Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Map Column (Left 2 cols on lg screens) */}
        <div className="lg:col-span-2 bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0_0_#000] overflow-hidden flex flex-col h-[410px]">
          {/* Header Map */}
          <div className="bg-[#fdd835] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-black text-black uppercase tracking-wider">LIVE MONITORING LOKASI</h2>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-full border-2 border-black">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Fixed Outlets
              </div>
              <div className="flex items-center gap-1.5 bg-[#fdd835] text-black text-[10px] font-black px-2.5 py-1 rounded-full border-2 border-black">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                SOTR Units
              </div>
            </div>
          </div>

          {/* Styled Map Image Container with absolutely positioned pins */}
          <div className="flex-1 relative overflow-hidden bg-[#e5e7eb] select-none">
            {/* Background Map Image */}
            <img 
              src="/pekanbaru_map.png" 
              alt="Pekanbaru Map" 
              className="w-full h-full object-cover opacity-90"
            />
            
            {/* Fixed Outlets pins */}
            {fixedOutlets.map((outlet) => (
              <div 
                key={outlet.id}
                style={{ top: outlet.top, left: outlet.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                onMouseEnter={() => setActiveTooltip(outlet)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div className="bg-[#0f172a] w-4 h-4 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.6)] group-hover:scale-125 transition-transform"></div>
                
                {/* Custom tooltip */}
                {activeTooltip?.id === outlet.id && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white border-[3px] border-black text-black text-xs font-black p-3 rounded-lg shadow-[3px_3px_0_0_#000] whitespace-nowrap z-50 flex flex-col gap-0.5 animate-fade-in">
                    <p className="text-sm font-black text-[#0f2c7a]">{outlet.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold">{outlet.desc}</p>
                  </div>
                )}
              </div>
            ))}

            {/* SOTR Rider pins */}
            {sotrUnits.map((rider) => (
              <div 
                key={rider.id}
                style={{ top: rider.top, left: rider.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                onMouseEnter={() => setActiveTooltip(rider)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div className="bg-[#fdd835] w-[26px] h-[26px] rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[14px] font-black text-black">two_wheeler</span>
                </div>
                
                {/* Custom tooltip */}
                {activeTooltip?.id === rider.id && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white border-[3px] border-black text-black text-xs font-black p-3 rounded-lg shadow-[3px_3px_0_0_#000] whitespace-nowrap z-50 flex flex-col gap-0.5 animate-fade-in">
                    <p className="text-sm font-black text-black">{rider.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold">{rider.desc}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5">
              <button className="bg-white hover:bg-gray-100 text-black font-black w-8 h-8 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center cursor-pointer select-none text-md">
                +
              </button>
              <button className="bg-white hover:bg-gray-100 text-black font-black w-8 h-8 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center cursor-pointer select-none text-md">
                -
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards Column (Right 1 col) */}
        <div className="flex flex-col justify-between gap-6 w-full">
          {/* Card 1 */}
          <div className="bg-white border-[3px] border-black rounded-2xl py-7 px-6 shadow-[6px_6px_0_0_#000] flex flex-col justify-center w-full h-auto">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">RIDER DI FIELD</p>
            <h3 className="text-4xl font-black text-black tracking-tight my-1">
              12 <span className="text-xl text-gray-400 font-bold">/ 16</span>
            </h3>
            <p className="text-xs text-gray-600 font-bold mt-1">3 Rider cuti/sakit</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border-[3px] border-black rounded-2xl py-7 px-6 shadow-[6px_6px_0_0_#000] flex flex-col justify-center w-full h-auto">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">OUTLET TETAP AKTIF</p>
            <h3 className="text-4xl font-black text-black tracking-tight my-1">
              6 <span className="text-xl text-gray-400 font-bold">Units</span>
            </h3>
            <p className="text-xs text-gray-600 font-bold mt-1">Semua unit dalam kondisi prima</p>
          </div>
        </div>
      </div>

      {/* Active Announcement Slider Container */}
      <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0_0_#000]">
        {/* Header and navigation buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-md font-black text-black uppercase tracking-wider">PENGUMUMAN AKTIF</h2>
          <div className="flex gap-2">
            <button className="bg-white hover:bg-gray-100 text-black border-2 border-black w-8 h-8 rounded-lg flex items-center justify-center shadow-[2px_2px_0_0_#000] cursor-pointer">
              <span className="material-symbols-outlined text-sm font-black">chevron_left</span>
            </button>
            <button className="bg-white hover:bg-gray-100 text-black border-2 border-black w-8 h-8 rounded-lg flex items-center justify-center shadow-[2px_2px_0_0_#000] cursor-pointer">
              <span className="material-symbols-outlined text-sm font-black">chevron_right</span>
            </button>
          </div>
        </div>

        {/* 3 Announcement cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {announcements.map((item, idx) => (
            <div key={idx} className="border-[3px] border-black rounded-2xl overflow-hidden shadow-[4px_4px_0_0_#000] w-full aspect-[3/4] flex flex-col justify-end bg-black relative">
              {/* Abstract Neo-brutalist Wave image cover */}
              <img 
                src="/announcement_bg.png" 
                alt="Announcement BG"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              {/* Bottom text banner */}
              <div className="bg-[#0b163f]/95 border-t-2 border-black p-4 relative z-10">
                <h4 className="text-white text-xs font-black leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-start">
          <Link
            to="/admin/announcement"
            className="bg-white hover:bg-gray-100 text-black border-[3px] border-black rounded-xl px-5 py-2.5 text-xs font-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all flex items-center gap-1 cursor-pointer"
          >
            Kelola Announcement
          </Link>
        </div>
      </div>
    </div>
  );
}
