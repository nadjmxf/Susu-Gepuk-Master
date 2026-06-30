import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import outletService from '../../services/outletService';
import riderService from '../../services/riderService';
import announcementService from '../../services/announcementService';

// Fix Leaflet marker icons in Vite
const outletIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const riderIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  
  // States for dynamic data
  const [fixedOutlets, setFixedOutlets] = useState([]);
  const [sotrUnits, setSotrUnits] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  // KPI Stats
  const [riderStats, setRiderStats] = useState({ active: 0, total: 0, off: 0 });
  const [outletStats, setOutletStats] = useState({ active: 0, total: 0 });

  const quickActions = [
    { name: 'Catat Absensi Rider', icon: 'assignment', color: 'bg-[#ffd600]', path: '/admin/absensi' },
    { name: 'Tambah Rider Baru', icon: 'person_add', color: 'bg-[#22d3ee]', path: '/admin/riders' },
    { name: 'Tambah Menu Baru', icon: 'add_circle', color: 'bg-[#ff4590]', path: '/admin/outlets' }, // routes to Outlets page menu section
    { name: 'Tambah Outlet / Gerobak', icon: 'storefront', color: 'bg-[#22c55e]', path: '/admin/outlets' },
  ];

  // Load dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch outlets
      const resOutlet = await outletService.getAllOutlets();
      const outlets = resOutlet.data;
      
      const fixed = outlets.filter(o => o.jenis_outlet === 'Outlet Tetap').map(o => ({
        id: o.id_outlet,
        name: o.nama_outlet,
        latitude: o.latitude ? parseFloat(o.latitude) : 0.4578,
        longitude: o.longitude ? parseFloat(o.longitude) : 101.4589,
        desc: `Status: ${o.status_operasional === 'Buka' ? 'Operasional Buka' : 'Tutup'}`,
        status: o.status_operasional
      }));
      setFixedOutlets(fixed);

      // Calculate Fixed Outlet stats
      const activeOutletsCount = fixed.filter(o => o.status === 'Buka').length;
      setOutletStats({
        active: activeOutletsCount,
        total: fixed.length
      });

      // 2. Fetch SOTR locations
      const resSotr = await riderService.getSotrLocations();
      const sotr = resSotr.data.map(s => ({
        id: s.id,
        name: s.name,
        latitude: parseFloat(s.latitude),
        longitude: parseFloat(s.longitude),
        desc: s.desc
      }));
      setSotrUnits(sotr);

      // 3. Fetch Riders count and status
      const resRiders = await riderService.getAllRiders();
      const riders = resRiders.data;
      const totalRiders = riders.length;
      const activeRiders = riders.filter(r => r.status_kehadiran === 'HADIR').length;
      const offRiders = riders.filter(r => r.status_kehadiran === 'IZIN' || r.status_kehadiran === 'SAKIT').length;
      
      setRiderStats({
        active: activeRiders,
        total: totalRiders,
        off: offRiders
      });

      // 4. Fetch Active Announcements
      const resAnn = await announcementService.getAllAnnouncements();
      const activeAnn = resAnn.data.filter(a => a.status === 'Aktif').map(a => ({
        title: a.judul,
        desc: a.isi
      }));
      setAnnouncements(activeAnn);

    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-[#0A1045] animate-spin">sync</span>
        <div className="text-[#0A1045] font-black text-sm uppercase tracking-widest animate-pulse">Memuat Live Monitoring...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-10 text-left">
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
        {/* Map Column */}
        <div className="lg:col-span-2 bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0_0_#000] overflow-hidden flex flex-col h-[450px]">
          {/* Header Map */}
          <div className="bg-[#fdd835] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-black text-black uppercase tracking-wider">LIVE MONITORING LOKASI PEKANBARU</h2>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 bg-[#3B82F6] text-white text-[10px] font-black px-2.5 py-1 rounded-full border-2 border-black">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Fixed Outlets
              </div>
              <div className="flex items-center gap-1.5 bg-[#F59E0B] text-black text-[10px] font-black px-2.5 py-1 rounded-full border-2 border-black">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                SOTR Units
              </div>
            </div>
          </div>

          {/* OpenStreetMap MapContainer */}
          <div className="flex-1 relative overflow-hidden bg-[#e5e7eb] select-none h-full w-full z-0">
            <MapContainer 
              center={[0.5074, 101.4478]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Fixed Outlets Marker */}
              {fixedOutlets.map((outlet) => (
                <Marker 
                  key={`outlet-${outlet.id}`} 
                  position={[outlet.latitude, outlet.longitude]} 
                  icon={outletIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <h4 className="font-black text-sm text-[#0f2c7a]">{outlet.name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">{outlet.desc}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* SOTR Rider Marker */}
              {sotrUnits.map((rider) => (
                <Marker 
                  key={`rider-${rider.id}`} 
                  position={[rider.latitude, rider.longitude]} 
                  icon={riderIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <h4 className="font-black text-sm text-[#F59E0B]">{rider.name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold mt-1">{rider.desc}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* KPI Cards Column */}
        <div className="flex flex-col justify-between gap-6 w-full h-full min-h-[450px]">
          {/* Card 1 */}
          <div className="bg-white border-[3px] border-black rounded-2xl py-7 px-6 shadow-[6px_6px_0_0_#000] flex flex-col justify-center flex-1 w-full">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">RIDER DI FIELD</p>
            <h3 className="text-4xl font-black text-black tracking-tight my-1">
              {riderStats.active} <span className="text-xl text-gray-400 font-bold">/ {riderStats.total}</span>
            </h3>
            <p className="text-xs text-gray-600 font-bold mt-1">
              {riderStats.off > 0 ? `${riderStats.off} Rider cuti/sakit` : 'Semua rider aktif & sehat'}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border-[3px] border-black rounded-2xl py-7 px-6 shadow-[6px_6px_0_0_#000] flex flex-col justify-center flex-1 w-full">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">OUTLET TETAP AKTIF</p>
            <h3 className="text-4xl font-black text-black tracking-tight my-1">
              {outletStats.active} <span className="text-xl text-gray-400 font-bold">Units / {outletStats.total}</span>
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

        {/* Announcement cards */}
        {announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {announcements.slice(0, 3).map((item, idx) => (
              <div key={idx} className="border-[3px] border-black rounded-2xl overflow-hidden shadow-[4px_4px_0_0_#000] w-full aspect-[3/4] flex flex-col justify-end bg-black relative">
                {/* Abstract Neo-brutalist Wave image cover */}
                <img 
                  src="/announcement_bg.png" 
                  alt="Announcement BG"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                {/* Bottom text banner */}
                <div className="bg-[#0b163f]/95 border-t-2 border-black p-4 relative z-10 w-full">
                  <p className="text-[10px] text-[#fdd835] font-black uppercase mb-1">Pengumuman</p>
                  <h4 className="text-white text-xs font-black leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-[3px] border-dashed border-gray-400 rounded-2xl p-8 text-center text-gray-500 font-black text-sm uppercase tracking-wider my-6">
            Tidak ada pengumuman aktif saat ini.
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-start">
          <Link
            to="/admin/outlets"
            className="bg-white hover:bg-gray-100 text-black border-[3px] border-black rounded-xl px-5 py-2.5 text-xs font-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all flex items-center gap-1 cursor-pointer"
          >
            Kelola Announcement
          </Link>
        </div>
      </div>
    </div>
  );
}
