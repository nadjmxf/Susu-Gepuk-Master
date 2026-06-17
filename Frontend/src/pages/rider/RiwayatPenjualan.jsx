import React, { useState, useEffect } from 'react';
import penjualanService from '../../services/penjualanService';

export default function RiwayatPenjualan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riwayatData, setRiwayatData] = useState([]);
  const [pagination, setPagination] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const riderId = user.id_rider || 1;

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, riderId]);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      setError(null);

      const response = await penjualanService.getHistoryByRider(riderId, page);

      if (response.success) {
        setRiwayatData(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || 'Gagal memuat riwayat');
      }
    } catch (err) {
      setError(err.message || 'Gagal mengambil data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (item) => {
    // Determine status based on data
    if (item.jumlah_produk_terjual > 0) {
      return { icon: 'shopping_cart', status: 'Berjualan', color: 'bg-green-50 text-green-700 border-green-700' };
    }
    return { icon: 'remove_circle_outline', status: 'Tidak Ada Aktivitas', color: 'bg-gray-100 text-gray-700 border-gray-700' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.last_page || 1;

  if (loading && riwayatData.length === 0) {
    return (
      <div className="animate-fade-in w-full pb-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fdd835] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat riwayat penjualan...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="animate-fade-in w-full pb-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-[#fdd835] font-display-lg inline-block tracking-wide">
          <span className="border-b-4 border-[#fdd835] pb-1 shadow-[0_6px_0_0_rgba(17,24,39,1)]">
            Riwayat
          </span>
          <span>
            &nbsp; Aktivitas
          </span>
        </h1>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-[#ffbaba] text-[#630000] rounded-[20px] px-6 py-4 flex items-center gap-4 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#630000] flex items-center justify-center shrink-0">
            <span className="text-[#ffbaba] font-black text-xl leading-none">!</span>
          </div>
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* Info Pill */}
      <div className="bg-[#1d4ed8] border-4 border-gray-900 rounded-xl px-6 py-4 shadow-[6px_6px_0_0_rgba(17,24,39,1)] mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[#fdd835] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
        <h2 className="text-white font-bold text-xl tracking-wide">Riwayat Penjualan • {totalItems} transaksi</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[6px_6px_0_0_rgba(17,24,39,1)] flex flex-col justify-between">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">TOTAL TRANSAKSI</h3>
          <div className="flex items-baseline gap-1.5 mt-auto">
            <span className="text-4xl font-black text-gray-900 tracking-tight">{totalItems}</span>
            <span className="text-sm font-bold text-gray-500">kali</span>
          </div>
        </div>
        
        <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[6px_6px_0_0_rgba(17,24,39,1)] flex flex-col justify-between">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">TOTAL PRODUK</h3>
          <div className="flex items-baseline gap-1.5 mt-auto">
            <span className="text-4xl font-black text-gray-900 tracking-tight">{riwayatData.reduce((sum, item) => sum + (item.jumlah_produk_terjual || 0), 0)}</span>
            <span className="text-sm font-bold text-gray-500">pcs</span>
          </div>
        </div>

        <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[6px_6px_0_0_rgba(17,24,39,1)] flex flex-col justify-between">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">TOTAL SUSU BASI</h3>
          <div className="flex items-baseline gap-1.5 mt-auto">
            <span className="text-4xl font-black text-gray-900 tracking-tight">{riwayatData.reduce((sum, item) => sum + (item.jumlah_susu_basi || 0), 0)}</span>
            <span className="text-sm font-bold text-gray-500">pcs</span>
          </div>
        </div>

        <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[6px_6px_0_0_rgba(17,24,39,1)] flex flex-col justify-between">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">KEMASAN RUSAK</h3>
          <div className="flex items-baseline gap-1.5 mt-auto">
            <span className="text-4xl font-black text-gray-900 tracking-tight">{riwayatData.reduce((sum, item) => sum + (item.jumlah_susu_rusak || 0), 0)}</span>
            <span className="text-sm font-bold text-gray-500">pcs</span>
          </div>
        </div>

        <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[6px_6px_0_0_rgba(17,24,39,1)] flex flex-col justify-between col-span-2 lg:col-span-1">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">TOTAL PENDAPATAN</h3>
          <div className="flex items-baseline gap-1.5 mt-auto">
            <span className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">Rp {riwayatData.reduce((sum, item) => sum + (item.total_pendapatan || 0), 0).toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-50 border-4 border-gray-900 rounded-2xl shadow-[6px_6px_0_0_rgba(17,24,39,1)] overflow-hidden">
        {/* Table Header */}
        <div className="bg-white px-6 py-5 flex items-center justify-between border-b-[3px] border-gray-900">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1d4ed8] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span>
            <h2 className="text-gray-900 font-black text-xl tracking-wide">Daftar Penjualan</h2>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto bg-white">
          <div className="min-w-[800px]">
            {/* Columns */}
            <div className="grid grid-cols-12 gap-4 p-5 border-b-[3px] border-gray-900 bg-white">
              <div className="col-span-2 font-bold text-xs uppercase tracking-wider text-gray-900 text-center">TANGGAL</div>
              <div className="col-span-2 font-bold text-xs uppercase tracking-wider text-gray-900 text-center">PRODUK</div>
              <div className="col-span-2 font-bold text-xs uppercase tracking-wider text-gray-900 text-center">BASI</div>
              <div className="col-span-2 font-bold text-xs uppercase tracking-wider text-gray-900 text-center">RUSAK</div>
              <div className="col-span-2 font-bold text-xs uppercase tracking-wider text-gray-900 text-center">SISA STOK</div>
              <div className="col-span-2 font-bold text-xs uppercase tracking-wider text-gray-900 text-center">PENDAPATAN</div>
            </div>
            
            {/* Rows */}
            {riwayatData.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p className="font-bold">Belum ada riwayat penjualan</p>
              </div>
            ) : (
              <div className="divide-y-[2px] divide-gray-200">
                {riwayatData.map((item) => (
                  <div key={item.id_penjualan} className="grid grid-cols-12 gap-4 p-5 items-center bg-white hover:bg-gray-50 transition-colors">
                    <div className="col-span-2 text-gray-900 font-medium text-center text-sm">{formatDate(item.tanggal_penjualan)}</div>
                    <div className="col-span-2 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        <span className="material-symbols-outlined text-[14px]">shopping_cart</span>
                        {item.jumlah_produk_terjual} pcs
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      {item.jumlah_susu_basi > 0 ? (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-bold">{item.jumlah_susu_basi} pcs</span>
                      ) : (
                        <span className="text-gray-400 text-xs font-bold">-</span>
                      )}
                    </div>
                    <div className="col-span-2 text-center">
                      {item.jumlah_susu_rusak > 0 ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold">{item.jumlah_susu_rusak} pcs</span>
                      ) : (
                        <span className="text-gray-400 text-xs font-bold">-</span>
                      )}
                    </div>
                    <div className="col-span-2 text-center text-gray-900 font-bold text-sm">{item.sisa_stok} pcs</div>
                    <div className="col-span-2 text-center">
                      <span className="font-black text-green-700">Rp {(item.total_pendapatan || 0).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-t-[3px] border-gray-900">
          <p className="text-xs font-bold text-gray-600">
            Menampilkan halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className={`w-8 h-8 flex items-center justify-center rounded border-2 transition-all ${currentPage === 1 || loading ? 'bg-white border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-900 text-gray-900 hover:bg-gray-50 hover:shadow-[2px_2px_0_0_rgba(17,24,39,1)] cursor-pointer'}`}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={loading}
                className={`w-8 h-8 flex items-center justify-center rounded border-2 border-gray-900 font-bold transition-all ${currentPage === page ? 'bg-[#fdd835] text-gray-900 shadow-[2px_2px_0_0_rgba(17,24,39,1)]' : 'bg-white text-gray-900 hover:bg-gray-50 hover:shadow-[2px_2px_0_0_rgba(17,24,39,1)] cursor-pointer'}`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
              className={`w-8 h-8 flex items-center justify-center rounded border-2 transition-all ${currentPage === totalPages || loading ? 'bg-white border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-900 text-gray-900 hover:bg-gray-50 hover:shadow-[2px_2px_0_0_rgba(17,24,39,1)] cursor-pointer'}`}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}