import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import outletService from '../../services/outletService';
import menuService from '../../services/menuService';
import announcementService from '../../services/announcementService';
import riderService from '../../services/riderService';
import FixedOutletsSection from './components/FixedOutletsSection';
import AnnouncementsSection from './components/AnnouncementsSection';
import ProductMenuSection from './components/ProductMenuSection';
import SotrSection from './components/SotrSection';

// Helper to parse keterangan_lokasi to extract hours and real location
export const parseLokasi = (keterangan) => {
  if (!keterangan) return { jam_buka: '08:00', jam_tutup: '22:00', lokasi_detail: '' };
  
  // Format: [HH:MM-HH:MM] Detail Lokasi
  const match = keterangan.match(/^\[(\d{2}:\d{2})-(\d{2}:\d{2})\]\s*(.*)/);
  if (match) {
    return {
      jam_buka: match[1],
      jam_tutup: match[2],
      lokasi_detail: match[3]
    };
  }
  
  return {
    jam_buka: '08:00',
    jam_tutup: '22:00',
    lokasi_detail: keterangan
  };
};

// Helper to determine if open based on current local time and manual toggle
export const isCurrentlyOpen = (jamBuka, jamTutup, manualStatus) => {
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

export default function Outlets() {
  // ----------------------------------------------------
  // 1. DATA STATE & CONFIGS
  // ----------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [sliders, setSliders] = useState([]);
  const [menus, setMenus] = useState([]);
  const [fixedOutlets, setFixedOutlets] = useState([]);
  const [sotrUnits, setSotrUnits] = useState([]);
  const [ridersList, setRidersList] = useState([]);

  // ----------------------------------------------------
  // CONFIRMATION POPUP STATES (Outlet Switch)
  // ----------------------------------------------------
  const [isConfirmStatusOpen, setIsConfirmStatusOpen] = useState(false);
  const [statusConfirmType, setStatusConfirmType] = useState('fixed'); // fixed | sotr
  const [pendingConfirmItem, setPendingConfirmItem] = useState(null);
  const [pendingConfirmValue, setPendingConfirmValue] = useState('');

  // ----------------------------------------------------
  // DATA MAPPING HELPERS
  // ----------------------------------------------------
  const mapAnnouncementToSlide = (ann) => {
    let fotoUrl = '/promo/PelangganWajibBaca.jpg';
    if (ann.gambar_announcement) {
      if (ann.gambar_announcement.startsWith('http')) {
        fotoUrl = ann.gambar_announcement;
      } else {
        const storageBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '/storage');
        fotoUrl = `${storageBaseUrl}/${ann.gambar_announcement}`;
      }
    }
    return {
      id: ann.id_announcement,
      title: ann.judul,
      status: ann.status === 'Aktif',
      image: fotoUrl,
      isi: ann.isi,
      tanggal_mulai: ann.tanggal_mulai,
      tanggal_selesai: ann.tanggal_selesai,
      gambar_raw: ann.gambar_announcement
    };
  };

  const mapMenuToFrontend = (item) => {
    let fotoUrl = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=150';
    if (item.gambar_menu) {
      if (item.gambar_menu.startsWith('http')) {
        fotoUrl = item.gambar_menu;
      } else if (item.gambar_menu.includes('-Photoroom')) {
        // Default seeder images are stored in frontend public assets folder
        const webpName = item.gambar_menu.replace(/\.(png|jpe?g)$/i, '.webp');
        fotoUrl = `/drive-download-20260512T105721Z-3-001/${webpName}`;
      } else {
        // User uploaded new menu images from admin panel
        fotoUrl = `http://localhost:8000/storage/${item.gambar_menu}`;
      }
    }

    return {
      id: item.id_menu,
      nama: item.nama_menu,
      deskripsi: item.deskripsi || '',
      harga: item.harga,
      foto: fotoUrl,
      kategori: item.kategori_menu === 'Keduanya' ? ['Tetap', 'SOTR'] : (item.kategori_menu === 'Outlet' ? ['Tetap'] : ['SOTR']),
      label: item.tag_menu === 'New' ? 'BARU' : (item.tag_menu === 'Best Seller' ? 'BEST SELLER' : '')
    };
  };



  // ----------------------------------------------------
  // FETCH & LOAD DATA
  // ----------------------------------------------------
  const loadData = async () => {
    try {
      // 1. Fetch announcements
      const resAnn = await announcementService.getAllAnnouncements();
      setSliders(resAnn.data.map(mapAnnouncementToSlide));

      // 2. Fetch menus
      const resMenu = await menuService.getAllMenus(true);
      setMenus(resMenu.data.map(mapMenuToFrontend));

      // 3. Fetch outlets
      const resOutlet = await outletService.getAllOutlets();
      const outlets = resOutlet.data;

      // Fixed Outlets
      const fixed = outlets.filter(o => o.jenis_outlet === 'Outlet Tetap').map(o => {
        const { jam_buka, jam_tutup, lokasi_detail } = parseLokasi(o.keterangan_lokasi);
        return {
          id: o.id_outlet,
          nama: o.nama_outlet,
          lokasi: lokasi_detail,
          link_lokasi: o.link_lokasi || '',
          status_outlet: o.status_operasional === 'Buka' ? 'Aktif' : 'Nonaktif',
          status_operasional: o.status_operasional === 'Buka' ? 'BUKA' : 'TUTUP',
          latitude: o.latitude ? parseFloat(o.latitude) : 0.4578,
          longitude: o.longitude ? parseFloat(o.longitude) : 101.4589,
          jam_buka,
          jam_tutup
        };
      });
      setFixedOutlets(fixed);

const getFotoUrl = (fotoPath) => {
  if (!fotoPath) return null;
  if (fotoPath.startsWith('http')) return fotoPath;
  const storageBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '/storage');
  return `${storageBaseUrl}/${fotoPath}`;
};

      // SOTR Units
      const sotr = outlets.filter(o => o.jenis_outlet === 'Outlet Bergerak').map(o => ({
        id: o.id_outlet,
        unit: o.nama_outlet,
        rider: o.rider ? o.rider.nama_rider : 'Belum Ditugaskan',
        foto_rider: o.rider && o.rider.foto_rider ? getFotoUrl(o.rider.foto_rider) : '',
        status_sotr: o.status_operasional === 'Buka' ? 'Aktif' : 'Nonaktif',
        status_operasional: o.status_operasional === 'Buka' ? 'BUKA' : 'TUTUP',
        area: o.area || '',
        id_rider: o.id_rider,
        latitude: o.latitude ? parseFloat(o.latitude) : 0.5074,
        longitude: o.longitude ? parseFloat(o.longitude) : 101.4478
      }));
      setSotrUnits(sotr);

      // 4. Fetch riders list
      const resRiders = await riderService.getAllRiders();
      setRidersList(resRiders.data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ----------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------



  // Toggle Switch for Outlet Status (Fixed & SOTR) - Triggers Confirmation Pop-up
  const handleToggleOutletStatus = (item, type) => {
    setStatusConfirmType(type);
    setPendingConfirmItem(item);
    const currentValue = type === 'fixed' ? item.status_outlet : item.status_sotr;
    const targetValue = currentValue === 'Aktif' ? 'Nonaktif' : 'Aktif';
    setPendingConfirmValue(targetValue);
    setIsConfirmStatusOpen(true);
  };

  // Confirmed Status Change
  const handleConfirmStatusChange = async () => {
    if (!pendingConfirmItem) return;

    try {
      const targetOperasional = pendingConfirmValue === 'Aktif' ? 'Buka' : 'Tutup';

      const payload = {
        status_operasional: targetOperasional
      };

      if (statusConfirmType === 'sotr' && pendingConfirmValue === 'Nonaktif') {
        payload.id_rider = null;
      }

      await outletService.updateOutlet(pendingConfirmItem.id, payload);
      setIsConfirmStatusOpen(false);
      setPendingConfirmItem(null);
      await loadData();
    } catch (error) {
      alert('Gagal menyimpan perubahan status outlet');
    }
  };



  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-[#0A1045] animate-spin">sync</span>
        <div className="text-[#0A1045] font-black text-sm uppercase tracking-widest animate-pulse">Memuat Data Outlet...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-10 text-left">
      <AnnouncementsSection sliders={sliders} onRefresh={loadData} />
      
      <ProductMenuSection menus={menus} onRefresh={loadData} />

      <FixedOutletsSection
        fixedOutlets={fixedOutlets}
        onRefresh={loadData}
        handleToggleOutletStatus={handleToggleOutletStatus}
      />

      <SotrSection
        sotrUnits={sotrUnits}
        ridersList={ridersList}
        onRefresh={loadData}
        handleToggleOutletStatus={handleToggleOutletStatus}
      />

      {/* =========================================================================
          MODALS & DIALOG OVERLAYS (RENDERED VIA REACT PORTALS TO document.body)
          ========================================================================= */}

      {/* ----------------------------------------------------
          1. MODAL KONFIRMASI UBAH STATUS OPERASIONAL OUTLET
          ---------------------------------------------------- */}
      {isConfirmStatusOpen && pendingConfirmItem && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-md overflow-hidden flex flex-col my-8">

            {/* Header */}
            <div className="bg-[#EEF2FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-[#0A1045] font-black text-xs uppercase tracking-widest">
                {pendingConfirmValue === 'Nonaktif' ? 'Nonaktifkan Outlet?' : 'Aktifkan Outlet?'}
              </span>
              <button
                onClick={() => setIsConfirmStatusOpen(false)}
                className="text-[#0A1045] hover:text-red-600 transition-colors cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-2xl font-black">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-left">
              <div className="flex gap-4 items-start">
                {pendingConfirmValue === 'Nonaktif' ? (
                  /* Red Alert Box */
                  <div className="w-14 h-14 rounded-xl border-[3px] border-[#EF4444] bg-red-50 text-[#EF4444] flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                    <span className="material-symbols-outlined text-3xl font-black">warning</span>
                  </div>
                ) : (
                  /* Green Bolt Box */
                  <div className="w-14 h-14 rounded-xl border-[3px] border-[#10B981] bg-green-50 text-[#10B981] flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                    <span className="material-symbols-outlined text-3xl font-black">bolt</span>
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <h3 className="text-md font-black text-black leading-tight">
                    {pendingConfirmValue === 'Nonaktif' ? (
                      <>Menonaktifkan outlet ini akan membuat statusnya menjadi <span className="text-red-600">Tutup</span> dan tidak dapat dilihat di halaman pelanggan.</>
                    ) : (
                      <>Mengaktifkan outlet ini akan membuat statusnya menjadi <span className="text-[#10B981]">Buka</span> dan dapat dilihat di halaman pelanggan.</>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">
                    {pendingConfirmValue === 'Nonaktif'
                      ? "Operasional di lokasi ini akan dihentikan otomatis. Pastikan tim lapangan telah diinformasikan."
                      : "Pastikan ketersediaan stok dan staf sebelum mengaktifkan outlet."}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 pb-6 pt-2 flex justify-end gap-4 bg-white shrink-0">
              <button
                onClick={() => setIsConfirmStatusOpen(false)}
                className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2 font-black text-xs uppercase cursor-pointer"
              >
                BATAL
              </button>
              {pendingConfirmValue === 'Nonaktif' ? (
                <button
                  onClick={handleConfirmStatusChange}
                  className="bg-[#EF4444] hover:bg-red-600 text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2 font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-sm">notifications_off</span>
                  YA, NONAKTIFKAN
                </button>
              ) : (
                <button
                  onClick={handleConfirmStatusChange}
                  className="bg-[#10B981] hover:bg-green-600 text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2 font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-sm">check_circle</span>
                  AKTIFKAN
                </button>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
