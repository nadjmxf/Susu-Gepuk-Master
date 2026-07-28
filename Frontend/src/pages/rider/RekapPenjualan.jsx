import React, { useState, useEffect } from 'react';
import penjualanService from '../../services/penjualanService';

export default function RekapPenjualan() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');

  // Today submitted state
  const [todaySubmitted, setTodaySubmitted] = useState(false);
  const [todayData, setTodayData] = useState(null);

  // Form data
  const [paymentMethod, setPaymentMethod] = useState('Transfer QRIS');
  const [riderInfo, setRiderInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [lastRecap, setLastRecap] = useState(null);
  const [transferFile, setTransferFile] = useState(null);
  const [formData, setFormData] = useState({});

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const riderId = user.id_rider || 1; // Default to 1 for testing

  // Initialize form data
  const initializeFormData = (menuItems) => {
    const initial = {
      setoran_cash: '',
      setoran_qris: '',
      nominal: '',
    };
    menuItems.forEach(product => {
      initial[`stok_bawa_${product.id}`] = product.stokBawa ?? 20;
      initial[`terjual_${product.id}`] = 0;
      initial[`basi_${product.id}`] = 0;
      initial[`rusak_${product.id}`] = 0;
    });
    return initial;
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await penjualanService.getRiderDataForRecap(riderId);

        if (response.success) {
          const data = response.data;
          setRiderInfo(data.rider);
          setProducts(data.menus);
          setLastRecap(data.lastRecap);
          setFormData(initializeFormData(data.menus));
        } else {
          throw new Error(response.message || 'Gagal mendapatkan data');
        }

        // Check if rider already submitted today
        try {
          const todayResponse = await penjualanService.getTodayByRider(riderId);
          if (todayResponse.success && todayResponse.data) {
            setTodaySubmitted(true);
            setTodayData(todayResponse.data);
          }
        } catch (_) {
          // No submission today — form is available
        }
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [riderId]);

  // Handle form input change
  const handleInputChange = (e) => {
    let { name, value } = e.target;

    // Remove leading zeros when typing (e.g., '05' becomes '5')
    if (value !== '') {
      value = value.replace(/^0+(?=\d)/, '');
    } else if (name.startsWith('stok_bawa_') || name.startsWith('terjual_') || name.startsWith('basi_') || name.startsWith('rusak_')) {
      // Return to 0 if the input is completely cleared
      value = 0;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2048 * 1024) { // 2MB
        showAlertMessage('File terlalu besar. Maksimal 2MB', 'error');
        return;
      }
      setTransferFile(file);
    }
  };

  // Show alert
  const showAlertMessage = (message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalTerjual = 0;
    let totalBasi = 0;
    let totalRusak = 0;
    let totalPendapatan = 0;
    let totalSisaStok = 0;

    products.forEach(product => {
      const stokBawa = parseInt(formData[`stok_bawa_${product.id}`] ?? product.stokBawa ?? 20) || 0;
      const terjual = parseInt(formData[`terjual_${product.id}`] || 0);
      const basi = parseInt(formData[`basi_${product.id}`] || 0);
      const rusak = parseInt(formData[`rusak_${product.id}`] || 0);

      totalTerjual += terjual;
      totalBasi += basi;
      totalRusak += rusak;
      totalPendapatan += terjual * product.price;
      totalSisaStok += (stokBawa - terjual - basi - rusak);
    });

    return {
      totalTerjual,
      totalBasi,
      totalRusak,
      totalPendapatan,
      totalSisaStok,
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const totals = calculateTotals();
      const setoranCash = parseInt(formData.setoran_cash || 0);
      const setoranQris = parseInt(formData.setoran_qris || 0);

      // Validation
      if (setoranCash === 0 && setoranQris === 0) {
        showAlertMessage('Nominal setoran harus diisi (minimal Cash atau QRIS)', 'error');
        setSubmitting(false);
        return;
      }

      if (paymentMethod === 'Transfer QRIS' && setoranQris > 0 && !transferFile) {
        showAlertMessage('Bukti transfer QRIS harus diunggah untuk pembayaran via Transfer QRIS', 'error');
        setSubmitting(false);
        return;
      }

      // Validation: per product stock limit check
      for (const product of products) {
        const stokBawa = parseInt(formData[`stok_bawa_${product.id}`] ?? product.stokBawa ?? 20) || 0;
        const terjual = parseInt(formData[`terjual_${product.id}`] || 0);
        const basi = parseInt(formData[`basi_${product.id}`] || 0);
        const rusak = parseInt(formData[`rusak_${product.id}`] || 0);

        if (terjual + basi + rusak > stokBawa) {
          showAlertMessage(
            `Total (Terjual + Basi + Rusak) untuk ${product.name} (${terjual + basi + rusak} pcs) melebihi stok bawa (${stokBawa} pcs)`,
            'error'
          );
          setSubmitting(false);
          return;
        }
      }

      // Validate that at least one product was sold
      if (totals.totalTerjual === 0) {
        showAlertMessage('Minimal harus ada 1 produk yang terjual', 'error');
        setSubmitting(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      const submitData = new FormData();
      submitData.append('id_rider', riderId);
      submitData.append('tanggal_penjualan', today);
      submitData.append('jumlah_produk_terjual', totals.totalTerjual);
      submitData.append('jumlah_susu_basi', totals.totalBasi);
      submitData.append('jumlah_susu_rusak', totals.totalRusak);
      submitData.append('sisa_stok', totals.totalSisaStok);
      submitData.append('setoran_cash', setoranCash);
      submitData.append('setoran_qris', setoranQris);
      submitData.append('total_pendapatan', totals.totalPendapatan);

      if (transferFile) {
        submitData.append('bukti_transfer', transferFile);
      }

      console.log('Submitting form data:', {
        id_rider: riderId,
        tanggal_penjualan: today,
        jumlah_produk_terjual: totals.totalTerjual,
        jumlah_susu_basi: totals.totalBasi,
        jumlah_susu_rusak: totals.totalRusak,
        sisa_stok: totals.totalSisaStok,
        setoran_cash: setoranCash,
        setoran_qris: setoranQris,
        total_pendapatan: totals.totalPendapatan,
        bukti_transfer: transferFile ? transferFile.name : 'No file',
      });

      const response = await penjualanService.createPenjualanWithFile(submitData);

      if (response.success) {
        showAlertMessage('Data penjualan berhasil disimpan!', 'success');
        setTodaySubmitted(true);
        setTodayData(response.data);
        // Reload data after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (response.already_submitted) {
        // Duplicate detected from backend
        setTodaySubmitted(true);
        setTodayData(response.data);
        showAlertMessage(response.message, 'error');
      } else {
        showAlertMessage(response.message || 'Gagal menyimpan data ke database', 'error');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      showAlertMessage(err.message || 'Terjadi kesalahan saat menyimpan data', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fdd835] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full pb-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-[#fdd835] font-display-lg inline-block tracking-wide">
          <span className='border-b-4 border-[#fdd835] pb-1 shadow-[0_6px_0_0_rgba(17,24,39,1)]'>
            Laporan
          </span>
          <span>
            &nbsp; Penjualan
          </span>
        </h1>
      </div>

      {/* Info Header */}
      <div className="bg-[#1d4ed8] border-4 border-gray-900 rounded-2xl p-6 md:px-12 md:py-8 shadow-[6px_6px_0_0_rgba(17,24,39,1)] mb-8 flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-start md:items-center">
        <div>
          <p className="text-xs text-yellow-300 font-bold mb-1">Tanggal & waktu</p>
          <p className="text-white font-medium">
            {new Date().toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-yellow-300 font-bold mb-1">Lokasi GPS</p>
          <p className="text-white font-medium">
            {riderInfo?.status_live_location === 'Aktif' ? 'Lokasi Aktif' : 'Lokasi Nonaktif'}
          </p>
        </div>
        <div>
          <p className="text-xs text-yellow-300 font-bold mb-1">Nama rider</p>
          <p className="text-white font-medium">{riderInfo?.name || 'Loading...'}</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-[#ffbaba] text-[#630000] rounded-[20px] px-6 py-4 flex items-center gap-4 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#630000] flex items-center justify-center shrink-0">
            <span className="text-[#ffbaba] font-black text-xl leading-none">!</span>
          </div>
          <p className="font-bold text-lg">{error}</p>
        </div>
      )}

      {/* ── ALREADY SUBMITTED TODAY BANNER ── */}
      {todaySubmitted ? (
        <div className="space-y-8">
          {/* Banner sudah submit */}
          <div className="bg-[#003d00] border-4 border-gray-900 rounded-2xl p-8 shadow-[6px_6px_0_0_rgba(17,24,39,1)] flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-green-500 border-4 border-gray-900 flex items-center justify-center shrink-0 shadow-[3px_3px_0_0_rgba(17,24,39,1)]">
              <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#fdd835] mb-1">Laporan Hari Ini Sudah Dikirim</h2>
              <p className="text-green-200 font-medium text-sm">
                Kamu sudah mengisi laporan penjualan hari ini.
                Laporan hanya bisa diisi <span className="font-black text-white">1 kali per hari</span>.
              </p>
            </div>
          </div>

          {/* Ringkasan data yang sudah disubmit */}
          {todayData && (
            <div className="bg-[#1d4ed8] border-4 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_0_rgba(17,24,39,1)]">
              <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2 border-b-2 border-blue-500 pb-4">
                <span className="text-[#fdd835] material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                Ringkasan Laporan Hari Ini
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex flex-col">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Terjual</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">{todayData.jumlah_produk_terjual || 0}</span>
                    <span className="text-xs font-bold text-gray-500">pcs</span>
                  </div>
                </div>
                <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex flex-col">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Sisa Stok</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">{todayData.sisa_stok || 0}</span>
                    <span className="text-xs font-bold text-gray-500">pcs</span>
                  </div>
                </div>
                <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex flex-col">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Susu Basi</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">{todayData.jumlah_susu_basi || 0}</span>
                    <span className="text-xs font-bold text-gray-500">pcs</span>
                  </div>
                </div>
                <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex flex-col">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Kemasan Rusak</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">{todayData.jumlah_susu_rusak || 0}</span>
                    <span className="text-xs font-bold text-gray-500">pcs</span>
                  </div>
                </div>
                <div className="bg-[#fdd835] border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex flex-col col-span-2 lg:col-span-1">
                  <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-2">Total Pendapatan</h3>
                  <div className="flex items-baseline gap-1 mt-auto">
                    <span className="text-xl font-black text-gray-900">Rp {(todayData.total_pendapatan || 0).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-6">
                <div className="bg-white/10 border border-blue-400 rounded-xl px-4 py-3">
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1">Setoran Cash</p>
                  <p className="text-white font-black">Rp {(todayData.setoran_cash || 0).toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/10 border border-blue-400 rounded-xl px-4 py-3">
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1">Setoran QRIS</p>
                  <p className="text-white font-black">Rp {(todayData.setoran_qris || 0).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
      {/* Stok Bawa Hari Ini */}
      <div className="bg-[#1d4ed8] border-4 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_0_rgba(17,24,39,1)] mb-8">
        <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <span className="text-[#fdd835] material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>water_bottle</span>
          Stok Bawa Hari Ini
        </h2>
        <div className="mb-6 h-0.5 flex-1 border-b-2 border-black-600"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {products.map(product => (
            <div key={product.id} className="flex flex-col gap-2">
              <p className="text-[10px] text-white font-bold uppercase tracking-wider">{product.name}</p>
              <p className="text-[10px] text-blue-200 mb-1">Rp {product.price.toLocaleString('id-ID')}</p>
              <input
                type="number"
                name={`stok_bawa_${product.id}`}
                value={formData[`stok_bawa_${product.id}`] ?? product.stokBawa ?? 20}
                onChange={handleInputChange}
                min={0}
                className="bg-white border-2 border-gray-900 rounded p-2 text-center text-blue-600 font-bold text-lg shadow-[2px_2px_0_0_rgba(17,24,39,1)] focus:outline-none focus:ring-2 focus:ring-[#fdd835]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Data Penjualan Per Menu */}
      <form onSubmit={handleSubmit}>
        <div className="bg-[#1d4ed8] border-4 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_0_rgba(17,24,39,1)] mb-8">
          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <span className="text-[#fdd835] material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span>
            Data Penjualan Per Menu
          </h2>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border-2 border-gray-900 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 border-b-2 border-gray-900">
              <div className="font-bold text-xs uppercase tracking-wider text-gray-800">MENU & HARGA</div>
              <div className="font-bold text-xs uppercase tracking-wider text-gray-800 text-center">JUMLAH TERJUAL</div>
              <div className="font-bold text-xs uppercase tracking-wider text-gray-800 text-center">SUSU BASI</div>
              <div className="font-bold text-xs uppercase tracking-wider text-gray-800 text-center">KEMASAN RUSAK</div>
            </div>

            <div className="divide-y-2 divide-gray-900">
              {products.map(product => {
                const stokBawaVal = parseInt(formData[`stok_bawa_${product.id}`] ?? product.stokBawa ?? 20) || 0;
                return (
                  <div key={product.id} className="grid grid-cols-4 gap-4 p-4 items-center">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="number"
                        name={`terjual_${product.id}`}
                        value={formData[`terjual_${product.id}`] ?? ''}
                        onChange={handleInputChange}
                        min={0}
                        max={stokBawaVal}
                        required
                        className="w-20 bg-white border-2 border-gray-900 rounded p-2 text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fdd835]"
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="number"
                        name={`basi_${product.id}`}
                        value={formData[`basi_${product.id}`] ?? ''}
                        onChange={handleInputChange}
                        min={0}
                        max={stokBawaVal}
                        className="w-20 bg-white border-2 border-gray-900 rounded p-2 text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fdd835]"
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="number"
                        name={`rusak_${product.id}`}
                        value={formData[`rusak_${product.id}`] ?? ''}
                        onChange={handleInputChange}
                        min={0}
                        max={stokBawaVal}
                        className="w-20 bg-white border-2 border-gray-900 rounded p-2 text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fdd835]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {products.map(product => {
              const stokBawaVal = parseInt(formData[`stok_bawa_${product.id}`] ?? product.stokBawa ?? 20) || 0;
              return (
                <div key={product.id} className="bg-white border-2 border-gray-900 rounded-xl p-4 flex flex-col gap-3 shadow-[2px_2px_0_0_rgba(17,24,39,1)] text-left">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-blue-300">
                      Bawa: {stokBawaVal} pcs
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col">
                      <label className="text-[9px] font-black text-gray-500 uppercase mb-1 text-center">Terjual</label>
                      <input
                        type="number"
                        name={`terjual_${product.id}`}
                        value={formData[`terjual_${product.id}`] ?? ''}
                        onChange={handleInputChange}
                        min={0}
                        max={stokBawaVal}
                        required
                        className="w-full bg-white border-2 border-gray-900 rounded p-1.5 text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fdd835]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[9px] font-black text-gray-500 uppercase mb-1 text-center">Basi</label>
                      <input
                        type="number"
                        name={`basi_${product.id}`}
                        value={formData[`basi_${product.id}`] ?? ''}
                        onChange={handleInputChange}
                        min={0}
                        max={stokBawaVal}
                        className="w-full bg-white border-2 border-gray-900 rounded p-1.5 text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fdd835]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[9px] font-black text-gray-500 uppercase mb-1 text-center">Rusak</label>
                      <input
                        type="number"
                        name={`rusak_${product.id}`}
                        value={formData[`rusak_${product.id}`] ?? ''}
                        onChange={handleInputChange}
                        min={0}
                        max={stokBawaVal}
                        className="w-full bg-white border-2 border-gray-900 rounded p-1.5 text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fdd835]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Setoran */}
        <div className="bg-[#1d4ed8] border-4 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_0_rgba(17,24,39,1)] mb-8">
          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2 border-b-2 border-blue-600 pb-4">
            <span className="text-[#fdd835] material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            Setoran
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <p className="text-blue-100 text-sm mb-3">Metode Pembayaran</p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash')}
                    className={`flex-1 py-3 px-4 rounded border-2 border-gray-900 font-bold transition-all ${paymentMethod === 'Cash' ? 'bg-[#fdd835] text-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)]' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Transfer QRIS')}
                    className={`flex-1 py-3 px-4 rounded border-2 border-gray-900 font-bold transition-all ${paymentMethod === 'Transfer QRIS' ? 'bg-[#fdd835] text-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)]' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Transfer QRIS
                  </button>
                </div>
              </div>

              <div>
                <p className="text-blue-100 text-sm mb-3">Nominal (Rp)</p>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    name={paymentMethod === 'Cash' ? 'setoran_cash' : 'setoran_qris'}
                    value={paymentMethod === 'Cash' ? (formData.setoran_cash || '') : (formData.setoran_qris || '')}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="1000"
                    className="flex-1 bg-[#0f2c7a] border-2 border-gray-400 rounded p-4 text-white font-bold focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                  />
                  <span className="text-white font-bold text-sm">Rp</span>
                </div>
              </div>
            </div>

            {paymentMethod === 'Transfer QRIS' && (
              <div className="flex-1">
                <p className="text-blue-100 text-sm mb-3">Unggah Bukti Transfer <span className="text-red-400">*</span></p>
                <label className={`block border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-40 cursor-pointer transition-colors ${transferFile
                  ? 'border-green-400 bg-green-900 hover:bg-green-800'
                  : 'border-gray-400 bg-[#0f2c7a] hover:bg-blue-900'
                  }`}>
                  <span className="material-symbols-outlined text-white text-3xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {transferFile ? 'check_circle' : 'upload_file'}
                  </span>
                  <p className={`text-sm ${transferFile
                    ? 'text-green-200 font-bold'
                    : 'text-blue-200'
                    }`}>
                    {transferFile ? `✓ ${transferFile.name}` : 'Klik atau drag file ke sini'}
                  </p>
                  <p className="text-xs text-gray-300 mt-1">Max 2MB (JPG, PNG)</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Alert */}
        {showAlert && (
          <div className={`rounded-[20px] px-6 py-4 flex items-center gap-4 animate-fade-in w-full md:w-auto mb-8 ${alertType === 'success' ? 'bg-[#a8e6a1] text-[#003d00]' : 'bg-[#ffbaba] text-[#630000]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${alertType === 'success' ? 'bg-[#003d00]' : 'bg-[#630000]'}`}>
              <span className={`font-black text-xl leading-none ${alertType === 'success' ? 'text-[#a8e6a1]' : 'text-[#ffbaba]'}`}>
                {alertType === 'success' ? '✓' : '!'}
              </span>
            </div>
            <p className="font-bold text-lg">{alertMessage}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-8">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#fdd835] border-4 border-gray-900 px-20 py-3 rounded-[20px] font-bold text-lg shadow-[4px_4px_0_0_rgba(17,24,39,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(17,24,39,1)] active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(17,24,39,1)] transition-all shrink-0 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Mengirim...' : 'Kirim'}
          </button>
        </div>
      </form>
        </>
      )}

      {/* Rekap Penjualan Terakhir dari Database — hanya tampil kalau belum submit hari ini */}
      {!todaySubmitted && (
        <div className="mb-8">
          {lastRecap && (
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-[#1d4ed8] border-2 border-gray-900 rounded-lg px-4 py-2 text-white font-bold shadow-[3px_3px_0_0_rgba(17,24,39,1)] text-sm">
                  <span className="material-symbols-outlined text-lg">receipt_long</span>
                  Rekap Penjualan Terakhir - {lastRecap.tanggal}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-[#e8f5e9] border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex flex-col justify-between">
                  <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">TOTAL TERJUAL</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">{lastRecap.totalTerjual || 0}</span>
                    <span className="text-xs font-bold text-gray-500">pcs</span>
                  </div>
                </div>

                <div className="bg-[#e8f5e9] border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex flex-col justify-between">
                  <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">SISA STOK</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">{lastRecap.sisaStok || 0}</span>
                    <span className="text-xs font-bold text-gray-500">pcs</span>
                  </div>
                </div>

                <div className="bg-[#e8f5e9] border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex flex-col justify-between">
                  <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">TOTAL SUSU BASI</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">{lastRecap.susuBasi || 0}</span>
                    <span className="text-xs font-bold text-gray-500">pcs</span>
                  </div>
                </div>

                <div className="bg-[#e8f5e9] border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex flex-col justify-between">
                  <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">KEMASAN RUSAK</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">{lastRecap.kemasanRusak || 0}</span>
                    <span className="text-xs font-bold text-gray-500">pcs</span>
                  </div>
                </div>

                <div className="bg-[#e8f5e9] border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex flex-col justify-between col-span-2 lg:col-span-1">
                  <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">TOTAL PENDAPATAN</h3>
                  <div className="flex items-baseline gap-1.5 mt-auto">
                    <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                      Rp {(lastRecap.totalPendapatan || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}