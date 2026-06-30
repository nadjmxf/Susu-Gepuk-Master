import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import riderService from '../../services/riderService';

const getFotoUrl = (fotoPath) => {
  if (!fotoPath) return null;
  if (fotoPath.startsWith('http')) return fotoPath;
  const storageBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '/storage');
  return `${storageBaseUrl}/${fotoPath}`;
};

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detail View State
  const [selectedRider, setSelectedRider] = useState(null);
  const [statusAkunRider, setStatusAkunRider] = useState(true);
  const [activityMonth, setActivityMonth] = useState('Juni');
  const [activityYear, setActivityYear] = useState('2026');
  
  // Activities state
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const handleViewDetail = async (rider) => {
    try {
      setLoading(true);
      const response = await riderService.getRiderById(rider.id_rider);
      if (response.success && response.data) {
        setSelectedRider(response.data);
        setStatusAkunRider(response.data.status_akun === 'Aktif');
      } else {
        setSelectedRider(rider);
        setStatusAkunRider(rider.status_akun === 'Aktif');
      }
    } catch (err) {
      console.error('Error fetching detail, fallback to list item:', err);
      setSelectedRider(rider);
      setStatusAkunRider(rider.status_akun === 'Aktif');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    if (!selectedRider) return;
    try {
      setLoadingActivities(true);
      const response = await riderService.getRiderActivity(selectedRider.id_rider, activityMonth, activityYear);
      if (response.success && response.data) {
        setActivities(response.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data aktivitas:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedRider?.id_rider, activityMonth, activityYear]);

  // Modal & Add Account Form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama_rider: '',
    no_hp: '',
    password: '',
    foto_rider: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Edit Account Form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nama_rider: '',
    no_hp: '',
    password: '',
    foto_rider: null
  });
  const [editPhotoPreview, setEditPhotoPreview] = useState(null);
  const [editFormError, setEditFormError] = useState(null);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Confirmation Modal states for status changes
  const [isConfirmStatusModalOpen, setIsConfirmStatusModalOpen] = useState(false);
  const [pendingStatusValue, setPendingStatusValue] = useState(true);

  const handleToggleStatusSwitch = () => {
    setPendingStatusValue(!statusAkunRider);
    setIsConfirmStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedRider) return;
    try {
      const response = await riderService.updateRider(selectedRider.id_rider, {
        status_akun: pendingStatusValue ? 'Aktif' : 'Nonaktif'
      });
      if (response.success) {
        setStatusAkunRider(pendingStatusValue);
        const updatedRider = {
          ...selectedRider,
          status_akun: pendingStatusValue ? 'Aktif' : 'Nonaktif'
        };
        setSelectedRider(updatedRider);
        setRiders(prevRiders => prevRiders.map(r => r.id_rider === selectedRider.id_rider ? updatedRider : r));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
    setIsConfirmStatusModalOpen(false);
  };

  const handleOpenEditModal = () => {
    if (selectedRider) {
      setEditFormData({
        nama_rider: selectedRider.nama_rider,
        no_hp: selectedRider.no_hp ? selectedRider.no_hp.replace('+62 ', '') : '',
        password: '',
        foto_rider: null
      });
      setEditPhotoPreview(getFotoUrl(selectedRider.foto_rider));
      setEditFormError(null);
      setShowEditPassword(false);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateRider = async (e) => {
    e.preventDefault();
    setEditFormError(null);

    if (!editFormData.nama_rider.trim()) {
      setEditFormError('Nama lengkap rider tidak boleh kosong.');
      return;
    }
    if (!editFormData.no_hp.trim()) {
      setEditFormError('Nomor HP tidak boleh kosong.');
      return;
    }

    let formattedPhone = editFormData.no_hp.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+62 ' + formattedPhone.replace(/^0/, '');
    }

    try {
      const data = new FormData();
      data.append('nama_rider', editFormData.nama_rider.trim());
      data.append('no_hp', formattedPhone);
      if (editFormData.password) {
        data.append('password', editFormData.password);
      }
      if (editFormData.foto_rider) {
        data.append('foto_rider', editFormData.foto_rider);
      }

      const response = await riderService.updateRider(selectedRider.id_rider, data);
      if (response.success && response.data) {
        setIsEditModalOpen(false);
        
        // Refresh detail view data
        const updated = await riderService.getRiderById(selectedRider.id_rider);
        if (updated.success && updated.data) {
          setSelectedRider(updated.data);
          setStatusAkunRider(updated.data.status_akun === 'Aktif');
        }
        
        fetchRiders();
      } else {
        setEditFormError(response.message || 'Gagal memperbarui akun.');
      }
    } catch (err) {
      console.error('Error updating rider:', err);
      setEditFormError(err.message || 'Gagal memperbarui akun.');
    }
  };

  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await riderService.getAllRiders();
      if (response.success && response.data) {
        setRiders(response.data);
      } else {
        setError('Gagal mengambil data rider dari database.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Gagal mengambil data rider dari database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const handleSaveRider = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Front-end validations matching the screenshot criteria
    if (!formData.nama_rider.trim()) {
      setFormError('Nama lengkap rider tidak boleh kosong.');
      return;
    }
    if (!formData.no_hp.trim()) {
      setFormError('Nomor HP tidak boleh kosong.');
      return;
    }
    if (!/^\d+$/.test(formData.no_hp.trim())) {
      setFormError('Format nomor telepon tidak valid. Pastikan hanya menggunakan angka.');
      return;
    }
    if (!formData.password) {
      setFormError('Password tidak boleh kosong.');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('Password harus minimal 6 karakter.');
      return;
    }

    try {
      const username = formData.nama_rider.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.floor(100 + Math.random() * 900);
      const data = new FormData();
      data.append('nama_rider', formData.nama_rider.trim());
      data.append('no_hp', '+62 ' + formData.no_hp.trim());
      data.append('username', username);
      data.append('password', formData.password);
      if (formData.foto_rider) {
        data.append('foto_rider', formData.foto_rider);
      }

      const response = await riderService.createRider(data);
      if (response && response.success) {
        setIsAddModalOpen(false);
        setFormData({ nama_rider: '', no_hp: '', password: '', foto_rider: null });
        setPhotoPreview(null);
        fetchRiders();
      } else {
        setFormError(response?.message || 'Gagal menambahkan akun rider.');
      }
    } catch (err) {
      console.error('Error creating rider:', err);
      setFormError(err.message || 'Gagal menyambungkan ke server atau username telah digunakan.');
    }
  };

  // Enrich database riders with visual states (status kehadiran, code, location) if fetched from API
  const enrichedRiders = riders.map((rider, idx) => {
    // Formatting phone number
    let formattedPhone = rider.no_hp;
    if (formattedPhone && !formattedPhone.startsWith('+')) {
      formattedPhone = `+62 ${formattedPhone.replace(/^0/, '')}`;
    }

    return {
      ...rider,
      id_rider: rider.id_rider,
      nama_rider: rider.nama_rider,
      no_hp: formattedPhone,
      area: rider.area || 'Daerah Sudirman - Senayan',
      status_akun: rider.status_akun || 'Aktif',
      status_kehadiran: rider.status_kehadiran || 'TIDAK ADA AKTIVITAS',
      code: `SOTR-${String(rider.id_rider).padStart(2, '0')}`
    };
  });

  // Filter riders by search query
  const filteredRiders = enrichedRiders.filter((rider) =>
    rider.nama_rider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status kehadiran visual mappings
  const getStatusDetails = (status) => {
    switch (status) {
      case 'HADIR':
        return { color: 'text-[#22C55E]', dot: 'bg-[#22C55E]' };
      case 'SAKIT':
        return { color: 'text-[#DC2626]', dot: 'bg-[#DC2626]' };
      case 'IZIN':
        return { color: 'text-[#FACC15]', dot: 'bg-[#FACC15]' };
      default:
        return { color: 'text-gray-400', dot: 'bg-gray-400' };
    }
  };

  return (
    <div className="w-full space-y-8 pb-10">
      {selectedRider ? (
        /* DETAIL VIEW SECTION */
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
              <div className="w-32 h-32 rounded-2xl border-[3px] border-black overflow-hidden shrink-0 shadow-[3px_3px_0_0_#000] bg-gray-100 flex items-center justify-center">
                {selectedRider.foto_rider ? (
                  <img 
                    src={getFotoUrl(selectedRider.foto_rider)}
                    alt={selectedRider.nama_rider}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-gray-400">person</span>
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
                  <div className={`border-2 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    statusAkunRider 
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
              <div className="border-[3px] border-black rounded-xl h-64 relative overflow-hidden shadow-[4px_4px_0_0_#000] flex items-center justify-center">
                {/* Stylized Neobrutalist Grid Map */}
                <div className="absolute inset-0 bg-[#E5E9F0] bg-[radial-gradient(#A3B1C9_1.5px,transparent_1.5px)] [background-size:24px_24px] flex items-center justify-center">
                  <div className="absolute w-full h-[6px] bg-white top-1/3 shadow-inner"></div>
                  <div className="absolute w-full h-[6px] bg-white top-2/3 shadow-inner"></div>
                  <div className="absolute h-full w-[6px] bg-white left-1/3 shadow-inner"></div>
                  <div className="absolute h-full w-[6px] bg-white left-2/3 shadow-inner"></div>
                  <div className="absolute w-24 h-24 rounded-full bg-[#D8E2DC]/80 -top-8 -left-8"></div>
                  <div className="absolute w-32 h-16 rounded-3xl bg-[#D8E2DC]/80 bottom-4 -right-8"></div>
                </div>
                
                {/* Map center marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="material-symbols-outlined text-red-600 text-5xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  <div className="w-3 h-3 bg-red-600/30 rounded-full blur-[2px] -mt-1"></div>
                  {/* Coordinates Badge */}
                  {selectedRider.location?.latitude && selectedRider.location?.longitude && (
                    <div className="bg-black text-white text-[8px] font-mono px-2 py-0.5 rounded mt-1 border border-black shadow-[1px_1px_0_0_#000]">
                      {selectedRider.location.latitude.toFixed(4)}, {selectedRider.location.longitude.toFixed(4)}
                    </div>
                  )}
                </div>
                
                {/* Map Preview Badge */}
                <div className="absolute top-4 left-4 bg-black border-2 border-black text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-[2px_2px_0_0_#000] z-20">
                  MAP PREVIEW
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
                  {selectedRider.attendance_summary?.hadir || 0} <span className="text-xs font-bold text-gray-500">hari</span>
                </div>
              </div>
              <div className="border-[3px] border-black rounded-xl p-4 bg-white shadow-[4px_4px_0_0_#000] text-center">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">IZIN</span>
                <div className="text-xl font-black text-black">
                  {selectedRider.attendance_summary?.izin || 0} <span className="text-xs font-bold text-gray-500">hari</span>
                </div>
              </div>
              <div className="border-[3px] border-black rounded-xl p-4 bg-white shadow-[4px_4px_0_0_#000] text-center">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">SAKIT</span>
                <div className="text-xl font-black text-black">
                  {selectedRider.attendance_summary?.sakit || 0} <span className="text-xs font-bold text-gray-500">hari</span>
                </div>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000] mb-6">
              <table className="w-full border-collapse bg-white text-left text-xs font-bold text-black">
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
                    activities.map((act) => {
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
            
            {/* Table Footer / Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-gray-500 font-bold">
                Menampilkan 5 dari 25 baris
              </span>
              <div className="flex gap-2">
                <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-sm cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
                  &lt;
                </button>
                <button className="bg-[#FACC15] border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs cursor-pointer shadow-[2px_2px_0_0_#000]">
                  1
                </button>
                <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
                  2
                </button>
                <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-sm cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW SECTION */
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
              <button className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-3 font-black text-xs uppercase flex items-center gap-2 cursor-pointer">
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
                        />
                      ) : (
                        <span className="material-symbols-outlined text-3xl text-gray-400">person</span>
                      )}
                    </div>

                    {/* Status Akun Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`border-2 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isAktif 
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
      )}

      {/* Modal Tambah Akun Rider */}
      {isAddModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-xl overflow-hidden flex flex-col my-8">
            {/* Header */}
            <div className="bg-[#0B56C5] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FACC15] rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
                  <span className="material-symbols-outlined text-black font-black text-xl">person_add</span>
                </div>
                <h2 className="text-[#FACC15] font-black text-md uppercase tracking-wider">
                  Tambah Akun Rider
                </h2>
              </div>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormError(null);
                  setFormData({ nama_rider: '', no_hp: '', password: '', foto_rider: null });
                }}
                className="text-white hover:text-gray-200 transition-colors cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-2xl font-black">close</span>
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveRider} className="flex flex-col flex-1">
              <div className="p-6 space-y-5 flex-1 overflow-y-auto text-left">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black text-black uppercase tracking-widest mb-2 block">
                      Nama Lengkap Rider *
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.nama_rider}
                      onChange={(e) => setFormData({ ...formData, nama_rider: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-black uppercase tracking-widest mb-2 block">
                      Nomor HP (Whatsapp) *
                    </label>
                    <div className="flex items-center bg-white border-[3px] border-black rounded-xl px-4 py-0">
                      <span className="font-black text-black text-sm mr-2 select-none">+62</span>
                      <input
                        type="text"
                        placeholder="8123456789"
                        value={formData.no_hp}
                        onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                        className="w-full py-3 bg-transparent text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="w-full md:w-1/2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest mb-2 block">
                    Password Awal *
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-4 pr-12 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-black focus:outline-none cursor-pointer flex items-center"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Validation Error Banner */}
                {formError && (
                  <div className="bg-[#FFF0F3] border-[3px] border-black rounded-2xl p-4 flex gap-4 items-center">
                    <div className="bg-[#E11D48] border-[2.5px] border-black rounded-lg w-12 h-12 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                      <span className="material-symbols-outlined text-white font-black text-2xl">error</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center text-left">
                      <h4 className="text-[#1E293B] font-black text-sm uppercase tracking-wider leading-none mb-1">
                        Validasi Gagal
                      </h4>
                      <p className="text-gray-500 font-bold text-xs leading-tight">
                        {formError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Photo Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block">
                    Foto Profil Rider
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file"
                      id="foto-rider-add"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({ ...formData, foto_rider: file });
                          setPhotoPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <label 
                      htmlFor="foto-rider-add"
                      className="border-2 border-dashed border-black rounded-xl w-24 h-24 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative shadow-[2px_2px_0_0_#000]"
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-black font-black text-2xl">photo_camera</span>
                          <span className="text-[9px] font-black text-black uppercase tracking-widest mt-1">Upload</span>
                        </>
                      )}
                    </label>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-normal">
                      Format JPG/PNG, Maks 2MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#F1F5F9] border-t-2 border-black px-6 py-4 flex justify-end gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormError(null);
                    setFormData({ nama_rider: '', no_hp: '', password: '', foto_rider: null });
                  }}
                  className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-[16px]">save</span>
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Edit Akun Rider */}
      {isEditModalOpen && selectedRider && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-xl overflow-hidden flex flex-col my-8">
            {/* Header */}
            <div className="bg-[#0B56C5] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FACC15] rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
                  <span className="material-symbols-outlined text-black font-black text-xl">edit</span>
                </div>
                <h2 className="text-[#FACC15] font-black text-md uppercase tracking-wider">
                  EDIT AKUN RIDER
                </h2>
              </div>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditFormError(null);
                }}
                className="text-white hover:text-gray-200 transition-colors cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-2xl font-black">close</span>
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleUpdateRider} className="flex flex-col flex-1 text-left">
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Photo Upload Section */}
                <div className="flex items-center gap-6 mb-2">
                  <input 
                    type="file"
                    id="foto-rider-edit"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditFormData({ ...editFormData, foto_rider: file });
                        setEditPhotoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <div className="relative w-24 h-24 shrink-0">
                    <div className="w-full h-full border-[3px] border-black bg-white overflow-hidden shadow-[3px_3px_0_0_#000] rounded-lg flex items-center justify-center">
                      {editPhotoPreview ? (
                        <img 
                          src={editPhotoPreview}
                          alt={editFormData.nama_rider}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-3xl text-gray-400">person</span>
                      )}
                    </div>
                    <label 
                      htmlFor="foto-rider-edit"
                      className="absolute -bottom-2 -right-2 bg-[#FACC15] hover:bg-yellow-400 border-2 border-black rounded-lg p-1.5 shadow-[2px_2px_0_0_#000] cursor-pointer flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-black font-black text-xs">edit</span>
                    </label>
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-[#0A1045] text-md">Foto Profil Rider</h3>
                    <p className="text-gray-400 font-bold text-xs mt-1">Format JPG/PNG, Maks. 2MB</p>
                  </div>
                </div>

                {/* Nama Lengkap Input */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    NAMA LENGKAP RIDER
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Nama Lengkap Rider"
                      value={editFormData.nama_rider}
                      onChange={(e) => setEditFormData({ ...editFormData, nama_rider: e.target.value })}
                      className="w-full pl-4 pr-12 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                    />
                    <span className="material-symbols-outlined absolute right-4 text-gray-500 font-bold">
                      badge
                    </span>
                  </div>
                </div>

                {/* Nomor HP Input */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    NOMOR HP (WHATSAPP)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="+62 81234567890"
                      value={editFormData.no_hp}
                      onChange={(e) => setEditFormData({ ...editFormData, no_hp: e.target.value })}
                      className="w-full pl-4 pr-12 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                    />
                    <span className="material-symbols-outlined absolute right-4 text-gray-500 font-bold">
                      phone
                    </span>
                  </div>
                </div>

                {/* Password Awal Input */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    PASSWORD AWAL
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={editFormData.password}
                      onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                      className="w-full pl-4 pr-12 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-4 text-black focus:outline-none cursor-pointer flex items-center"
                    >
                      <span className="material-symbols-outlined text-[20px] text-gray-500">
                        {showEditPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono italic mt-2 block">
                    * Kosongkan jika tidak ingin mengubah password
                  </span>
                </div>

                {/* Validation Error Banner */}
                {editFormError && (
                  <div className="bg-[#FFF0F3] border-[3px] border-black rounded-2xl p-4 flex gap-4 items-center">
                    <div className="bg-[#E11D48] border-[2.5px] border-black rounded-lg w-12 h-12 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                      <span className="material-symbols-outlined text-white font-black text-2xl">error</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center text-left">
                      <h4 className="text-[#1E293B] font-black text-sm uppercase tracking-wider leading-none mb-1">
                        Validasi Gagal
                      </h4>
                      <p className="text-gray-500 font-bold text-xs leading-tight">
                        {editFormError}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-[#F1F5F9] border-t-2 border-black px-6 py-4 flex justify-end gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditFormError(null);
                  }}
                  className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-8 py-2.5 font-black text-xs uppercase cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-8 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-[16px]">save</span>
                  SIMPAN
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Konfirmasi Ubah Status Akun */}
      {isConfirmStatusModalOpen && selectedRider && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-lg overflow-hidden flex flex-col my-8">
            {/* Header */}
            <div className="bg-[#EEF2FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-[#0A1045] font-black text-xs uppercase tracking-widest">
                PERHATIAN DIPERLUKAN
              </span>
              <button 
                onClick={() => setIsConfirmStatusModalOpen(false)}
                className="text-[#0A1045] hover:text-red-600 transition-colors cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-2xl font-black">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 text-left">
              <div className="flex gap-4 items-start">
                {/* Icon Status */}
                {pendingStatusValue ? (
                  <div className="w-14 h-14 rounded-xl border-[3px] border-[#10B981] bg-green-50 text-[#10B981] flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                    <span className="material-symbols-outlined text-3xl font-black">check_circle</span>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl border-[3px] border-[#EF4444] bg-red-50 text-[#EF4444] flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                    <span className="material-symbols-outlined text-3xl font-black">block</span>
                  </div>
                )}

                {/* Title and message */}
                <div className="flex-1">
                  <h3 className="text-lg font-black text-black leading-tight">
                    {pendingStatusValue ? (
                      <>Konfirmasi: Aktifkan akun <span className="underline">{selectedRider.nama_rider}</span>?</>
                    ) : (
                      <>Konfirmasi: Nonaktifkan akun {selectedRider.nama_rider}?</>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed mt-2">
                    {pendingStatusValue 
                      ? "Akun yang diaktifkan akan kembali mendapatkan akses ke portal rider dan dapat mulai melakukan pengiriman kembali."
                      : "Akun yang dinonaktifkan tidak akan bisa mengakses portal rider. Semua sesi aktif akan segera diputus."}
                  </p>
                </div>
              </div>

              {/* Warning/Log info box */}
              <div className="bg-[#F1F5F9] border-l-[4px] border-l-[#0A1045] rounded-r-xl p-4 flex gap-3 items-start">
                <span className="material-symbols-outlined text-gray-700 text-sm mt-0.5">info</span>
                <p className="text-[10px] text-gray-700 font-bold font-mono leading-relaxed">
                  {pendingStatusValue 
                    ? "Tindakan ini akan mencatat riwayat pengaktifan kembali di log sistem."
                    : "Tindakan ini akan mencatat riwayat penonaktifan secara permanen di log sistem."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2 flex justify-end items-center gap-6 bg-white shrink-0">
              <button
                onClick={() => setIsConfirmStatusModalOpen(false)}
                className="text-xs font-black text-gray-500 hover:text-black transition-colors cursor-pointer uppercase"
              >
                Batal
              </button>
              {pendingStatusValue ? (
                <button
                  onClick={handleConfirmStatusChange}
                  className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-sm">check_circle</span>
                  Ya, Aktifkan
                </button>
              ) : (
                <button
                  onClick={handleConfirmStatusChange}
                  className="bg-[#EF4444] hover:bg-red-600 text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-sm">cancel</span>
                  Ya, Nonaktifkan
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
