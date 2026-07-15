import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import penjualanService from '../../services/penjualanService';

export default function Reports() {
  // ----------------------------------------------------
  // 1. SELECT FILTER & PAGINATION STATES
  // ----------------------------------------------------
  const [selectedMonth, setSelectedMonth] = useState('Juni');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Loaded data state
  const [metrics, setMetrics] = useState({
    terjual: '0 pcs',
    basi: '0 pcs',
    rusak: '0 pcs',
    pendapatan: 'Rp 0'
  });
  const [reportsData, setReportsData] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1
  });

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRiderName, setSelectedRiderName] = useState('');
  const [dailyDetails, setDailyDetails] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  const openDetailModal = async (riderId, riderName) => {
    setSelectedRiderName(riderName);
    setIsDetailModalOpen(true);
    setLoadingDetail(true);
    try {
      const response = await penjualanService.getDailyReportByRider(riderId, selectedMonth, selectedYear);
      if (response.success) {
        setDailyDetails(response.data);
      } else {
        setDailyDetails([]);
      }
    } catch (error) {
      console.error('Gagal memuat rincian harian:', error);
      setDailyDetails([]);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setDailyDetails([]);
  };

  // ----------------------------------------------------
  // 2. FETCH DATA FROM BACKEND API
  // ----------------------------------------------------
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await penjualanService.getReportsSummary(selectedMonth, selectedYear, currentPage);
      if (response.success) {
        setMetrics(response.metrics);
        setReportsData(response.data);
        setPaginationInfo(response.pagination);
      }
    } catch (error) {
      console.error('Gagal memuat data laporan:', error);
      // Reset on error
      setReportsData([]);
      setMetrics({
        terjual: '0 pcs',
        basi: '0 pcs',
        rusak: '0 pcs',
        pendapatan: 'Rp 0'
      });
      setPaginationInfo({
        current_page: 1,
        total: 0,
        per_page: 10,
        last_page: 1
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedMonth, selectedYear, currentPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= paginationInfo.last_page) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full space-y-8 pb-10 text-left">
      {/* ----------------------------------------------------
          SECTION 1: TITLE & FILTER BAR
          ---------------------------------------------------- */}
      <div className="bg-[#1d4ed8] border-[3px] border-black rounded-2xl p-6 md:p-8 space-y-6 shadow-[6px_6px_0_0_#000]">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-[#FACC15] tracking-wide uppercase border-b-2 border-slate-700 pb-5">
          Laporan Penjualan Rider
        </h1>

        {/* Filter Period Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-white font-black text-xs uppercase tracking-widest text-slate-300">
              LAPORAN PENJUALAN RIDER
            </h2>
            <p className="text-gray-400 font-bold text-[11px] leading-relaxed">
              Monitoring audit harian operasional unit SOTR (Susu On The Road).
            </p>
          </div>

          {/* Period Dropdowns */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Month Select */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white border-[3px] border-black rounded-xl pl-4 pr-10 py-2.5 font-black text-xs text-black shadow-[3px_3px_0_0_#000] focus:outline-none focus:ring-0 cursor-pointer min-w-[100px]"
              >
                {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                  <option key={m} value={m}>{m.slice(0, 3)}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-black font-black text-sm pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>

            {/* Year Select */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white border-[3px] border-black rounded-xl pl-4 pr-10 py-2.5 font-black text-xs text-black shadow-[3px_3px_0_0_#000] focus:outline-none focus:ring-0 cursor-pointer min-w-[90px]"
              >
                {['2026', '2025', '2024'].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-black font-black text-sm pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------
            SECTION 2: METRIC CARDS ROW
            ---------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Card 1: Total Terjual */}
          <div className="bg-white border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-28">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
              TOTAL TERJUAL (SEBULAN)
            </span>
            <span className="text-xl font-black text-black leading-none mt-2">
              {metrics.terjual}
            </span>
          </div>

          {/* Card 2: Total Susu Basi */}
          <div className="bg-white border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-28">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
              TOTAL SUSU BASI (SEBULAN)
            </span>
            <span className="text-xl font-black text-[#EF4444] leading-none mt-2">
              {metrics.basi}
            </span>
          </div>

          {/* Card 3: Total Kemasan Rusak */}
          <div className="bg-white border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-28">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
              TOTAL KEMASAN RUSAK (SEBULAN)
            </span>
            <span className="text-xl font-black text-[#EC4899] leading-none mt-2">
              {metrics.rusak}
            </span>
          </div>

          {/* Card 4: Total Pendapatan */}
          <div style={{ backgroundColor: '#16A34A' }} className="border-[3px] border-black text-white rounded-2xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-28">
            <span className="text-[9px] font-black text-slate-100 uppercase tracking-widest leading-none">
              TOTAL PENDAPATAN (SEBULAN)
            </span>
            <span className="text-xl font-black text-white leading-none mt-2">
              {metrics.pendapatan}
            </span>
          </div>
        </div>

      </div>

      {/* ----------------------------------------------------
          SECTION 3: DAILY SOTR REPORT TABLE (WHITE CONTAINER)
          ---------------------------------------------------- */}
      <div className="bg-white border-[3px] border-black rounded-2xl p-6 md:p-8 space-y-6 shadow-[6px_6px_0_0_#000]">

        {/* Daily Reports Table */}
        <div className="border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000] overflow-hidden">
          {loading ? (
            <div className="w-full py-20 flex flex-col items-center justify-center space-y-3 bg-white">
              <span className="material-symbols-outlined text-4xl text-[#0A1045] animate-spin">sync</span>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Memuat Laporan Rekap...</p>
            </div>
          ) : reportsData.length > 0 ? (
            <>
            <div className="overflow-x-auto">
              <table className="hidden md:table w-full border-collapse bg-white text-left text-xs font-bold text-black min-w-[900px]" style={{ contentVisibility: 'auto' }}>
              <thead>
                <tr className="bg-[#F1F5F9] border-b-[3px] border-black text-[10px] uppercase tracking-wider font-black text-slate-800">
                  <th className="px-5 py-4 border-r-2 border-gray-200 text-center w-12">NO</th>
                  <th className="px-5 py-4 border-r-2 border-gray-200 w-44">NAMA RIDER</th>
                  <th className="px-5 py-4 border-r-2 border-gray-200">LOKASI / UNIT</th>
                  <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">TOTAL BAWA</th>
                  <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">TERJUAL</th>
                  <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">BASI</th>
                  <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">RUSAK</th>
                  <th className="px-5 py-4 border-r-2 border-gray-200 text-right w-36">TOTAL PENDAPATAN</th>
                  <th className="px-3 py-4 text-center w-16">DETAIL</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {reportsData.map((report, idx) => (
                  <tr key={report.id_rider} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 border-r-2 border-gray-100 text-center font-black text-gray-500">
                      {idx + 1 + (currentPage - 1) * paginationInfo.per_page}
                    </td>
                    <td className="px-5 py-4 border-r-2 border-gray-100 text-left font-black text-black">
                      {report.rider}
                    </td>
                    <td className="px-5 py-4 border-r-2 border-gray-100 text-left">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-red-500 shrink-0">location_on</span>
                        <span className="text-gray-700 font-bold text-[11px] truncate">{report.unit} | {report.gps}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 border-r-2 border-gray-100 text-center text-gray-500 font-black">
                      {report.bawa}
                    </td>
                    <td className="px-3 py-4 border-r-2 border-gray-100 text-center font-black text-green-700">
                      {report.terjual}
                    </td>
                    <td className={`px-3 py-4 border-r-2 border-gray-100 text-center font-black ${report.basi > 0 ? 'text-[#EF4444]' : 'text-gray-400'}`}>
                      {report.basi}
                    </td>
                    <td className={`px-3 py-4 border-r-2 border-gray-100 text-center font-black ${report.rusak > 0 ? 'text-[#EC4899]' : 'text-gray-400'}`}>
                      {report.rusak}
                    </td>
                    <td className="px-5 py-4 border-r-2 border-gray-100 text-right font-black text-black text-sm">
                      Rp {report.setoran.toLocaleString('id-ID')}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <button
                        onClick={() => openDetailModal(report.id_rider, report.rider)}
                        className="w-8 h-8 mx-auto rounded-lg border-[2px] border-black bg-[#FACC15] flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]"
                        title="Lihat Detail Harian"
                      >
                        <span className="material-symbols-outlined text-sm font-black text-black">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Card Content - Mobile */}
            <div className="block md:hidden divide-y-[3px] divide-gray-900 bg-white border-t-[3px] border-black">
              {reportsData.map((report) => (
                <div key={report.id_rider} className="p-4 flex flex-col gap-3 text-left relative">
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => openDetailModal(report.id_rider, report.rider)}
                      className="w-8 h-8 rounded-lg border-[2px] border-black bg-[#FACC15] flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]"
                    >
                      <span className="material-symbols-outlined text-sm font-black text-black">visibility</span>
                    </button>
                  </div>
                  
                  <div className="pr-14">
                    <h3 className="font-black text-black text-sm">{report.rider}</h3>
                    <p className="text-gray-500 font-bold text-[10px] mt-0.5 truncate flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px] text-red-500">location_on</span>
                      {report.unit} | {report.gps}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] mt-2">
                    <div className="bg-gray-100 border-[2px] border-black rounded px-1 py-1.5 shadow-[2px_2px_0_0_#000]">
                      <span className="text-[8px] text-gray-500 font-bold uppercase block mb-0.5">Bawa</span>
                      <span className="font-black text-black">{report.bawa}</span>
                    </div>
                    <div className="bg-green-100 border-[2px] border-black rounded px-1 py-1.5 shadow-[2px_2px_0_0_#000]">
                      <span className="text-[8px] text-green-700 font-bold uppercase block mb-0.5">Terjual</span>
                      <span className="font-black text-green-700">{report.terjual}</span>
                    </div>
                    <div className="bg-red-100 border-[2px] border-black rounded px-1 py-1.5 shadow-[2px_2px_0_0_#000]">
                      <span className="text-[8px] text-red-700 font-bold uppercase block mb-0.5">Basi</span>
                      <span className="font-black text-red-700">{report.basi}</span>
                    </div>
                    <div className="bg-pink-100 border-[2px] border-black rounded px-1 py-1.5 shadow-[2px_2px_0_0_#000]">
                      <span className="text-[8px] text-pink-700 font-bold uppercase block mb-0.5">Rusak</span>
                      <span className="font-black text-pink-700">{report.rusak}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center bg-[#F1F5F9] border-[2px] border-black rounded-lg p-2.5 shadow-[2px_2px_0_0_#000]">
                    <span className="font-bold text-[10px] uppercase tracking-wider">Total Pendapatan</span>
                    <span className="font-black text-green-700 text-sm">Rp {report.setoran.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
            </>
          ) : (
            <div className="w-full py-16 text-center text-gray-400 font-black text-xs uppercase tracking-wider">
              Tidak ada data laporan pada periode {selectedMonth} {selectedYear}
            </div>
          )}
        </div>

        {/* Footer info pagination */}
        {!loading && reportsData.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <span className="text-xs text-gray-500 font-bold">
              Menampilkan {reportsData.length} laporan (Total {paginationInfo.total} entri)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-sm disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]"
              >
                &lt;
              </button>

              {Array.from({ length: paginationInfo.last_page }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs cursor-pointer shadow-[2px_2px_0_0_#000] ${currentPage === pageNum ? 'bg-[#FACC15]' : 'bg-white hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === paginationInfo.last_page}
                className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-sm disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]"
              >
                &gt;
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ----------------------------------------------------
          SECTION 4: DAILY DETAIL MODAL
          ---------------------------------------------------- */}
      {isDetailModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[8px_8px_0_0_#000] relative my-auto">
            
            {/* Modal Header */}
            <div className="p-5 md:p-6 border-b-[3px] border-black flex justify-between items-center bg-[#FACC15] rounded-t-xl">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-wide">
                  Detail Harian: {selectedRiderName}
                </h2>
                <p className="text-black font-bold text-xs mt-1">
                  Periode {selectedMonth} {selectedYear}
                </p>
              </div>
              <button 
                onClick={closeDetailModal}
                className="w-10 h-10 rounded-xl border-[3px] border-black bg-white flex items-center justify-center hover:bg-gray-100 hover:-translate-y-0.5 shadow-[4px_4px_0_0_#000] active:translate-y-0 active:shadow-[0px_0px_0_0_#000] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined font-black">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 md:p-6 overflow-y-auto bg-gray-50 flex-1">
              {loadingDetail ? (
                <div className="w-full py-20 flex flex-col items-center justify-center space-y-3">
                  <span className="material-symbols-outlined text-4xl text-black animate-spin">sync</span>
                  <p className="text-xs font-black text-black uppercase tracking-wider">Memuat Rincian...</p>
                </div>
              ) : dailyDetails.length > 0 ? (
                <div className="border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000] overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs font-bold text-black min-w-[700px]">
                      <thead>
                        <tr className="bg-[#F1F5F9] border-b-[3px] border-black text-[10px] uppercase tracking-wider font-black">
                          <th className="px-5 py-4 border-r-2 border-gray-200 text-center w-28">TANGGAL</th>
                          <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">BAWA</th>
                          <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">TERJUAL</th>
                          <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">BASI</th>
                          <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">RUSAK</th>
                          <th className="px-4 py-4 border-r-2 border-gray-200 text-center w-24">METODE</th>
                          <th className="px-5 py-4 border-r-2 border-gray-200 text-right w-36">SETORAN</th>
                          <th className="px-5 py-4 text-right w-40 bg-[#fef9c3]">PENDAPATAN (SISTEM)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-gray-100">
                        {dailyDetails.map((detail) => (
                          <tr key={detail.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 border-r-2 border-gray-100 text-center">
                              <div className="font-black text-black">{detail.tanggal}</div>
                              <div className="text-gray-400 font-bold text-[9px] mt-0.5">{detail.waktu}</div>
                            </td>
                            <td className="px-3 py-4 border-r-2 border-gray-100 text-center text-gray-500 font-black">{detail.bawa}</td>
                            <td className="px-3 py-4 border-r-2 border-gray-100 text-center font-black text-black">{detail.terjual}</td>
                            <td className={`px-3 py-4 border-r-2 border-gray-100 text-center font-black ${detail.basi > 0 ? 'text-[#EF4444]' : 'text-gray-400'}`}>{detail.basi}</td>
                            <td className={`px-3 py-4 border-r-2 border-gray-100 text-center font-black ${detail.rusak > 0 ? 'text-[#EC4899]' : 'text-gray-400'}`}>{detail.rusak}</td>
                            <td className="px-4 py-4 border-r-2 border-gray-100 text-center">
                              <span className="inline-block px-2.5 py-0.5 border border-black rounded text-[9px] font-black tracking-wider uppercase bg-[#F1F5F9] shadow-[1px_1px_0_0_#000]">
                                {detail.metode}
                              </span>
                            </td>
                            <td className="px-5 py-4 border-r-2 border-gray-100 text-right font-black text-black text-sm">
                              Rp {detail.setoran.toLocaleString('id-ID')}
                            </td>
                            <td className="px-5 py-4 text-right bg-[#fefce8]">
                              <div className="font-black text-sm"
                                style={{
                                  color: detail.pendapatan_sistem === detail.setoran
                                    ? '#15803d'
                                    : detail.pendapatan_sistem > detail.setoran
                                      ? '#b45309'
                                      : '#dc2626'
                                }}
                              >
                                Rp {(detail.pendapatan_sistem || 0).toLocaleString('id-ID')}
                              </div>
                              {detail.pendapatan_sistem !== detail.setoran && (
                                <div className="text-[9px] font-black mt-0.5"
                                  style={{
                                    color: detail.pendapatan_sistem > detail.setoran ? '#b45309' : '#dc2626'
                                  }}
                                >
                                  {detail.pendapatan_sistem > detail.setoran ? '▲' : '▼'} selisih Rp {Math.abs((detail.pendapatan_sistem || 0) - detail.setoran).toLocaleString('id-ID')}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="w-full py-16 text-center text-gray-400 font-black text-xs uppercase tracking-wider">
                  Tidak ada rincian harian untuk rider ini.
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
