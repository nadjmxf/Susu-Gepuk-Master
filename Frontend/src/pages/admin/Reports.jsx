import React, { useState, useEffect } from 'react';
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
      <div className="bg-[#0A1045] border-[3px] border-black rounded-2xl p-6 md:p-8 space-y-6 shadow-[6px_6px_0_0_#000]">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-[#FACC15] tracking-wide uppercase border-b-2 border-slate-700 pb-5">
          Laporan Penjualan Rider
        </h1>

        {/* Filter Period Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-white font-black text-xs uppercase tracking-widest text-slate-300">
              LAPORAN REKAP PENJUALAN RIDER
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
        <div className="overflow-x-auto border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000]">
          {loading ? (
            <div className="w-full py-20 flex flex-col items-center justify-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#0A1045] animate-spin">sync</span>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Memuat Laporan Rekap...</p>
            </div>
          ) : reportsData.length > 0 ? (
            <table className="w-full border-collapse bg-white text-left text-xs font-bold text-black min-w-[900px]" style={{ contentVisibility: 'auto' }}>
              <thead>
                <tr className="bg-[#F1F5F9] border-b-[3px] border-black text-[10px] uppercase tracking-wider font-black text-slate-800">
                  <th className="px-5 py-4 border-r-2 border-gray-200 text-center w-28">TANGGAL & WAKTU</th>
                  <th className="px-5 py-4 border-r-2 border-gray-200 w-44">NAMA RIDER (UNIT)</th>
                  <th className="px-5 py-4 border-r-2 border-gray-200">LOKASI LAST GPS</th>
                  <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">BAWA</th>
                  <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">TERJUAL</th>
                  <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">BASI</th>
                  <th className="px-3 py-4 border-r-2 border-gray-200 text-center w-16">RUSAK</th>
                  <th className="px-4 py-4 border-r-2 border-gray-200 text-center w-24">METODE</th>
                  <th className="px-5 py-4 text-right w-36">TOTAL SETORAN</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {reportsData.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Tanggal & Waktu */}
                    <td className="px-5 py-4 border-r-2 border-gray-100 text-center">
                      <div className="font-black text-black">{report.tanggal}</div>
                      <div className="text-gray-400 font-bold text-[9px] mt-0.5">{report.waktu}</div>
                    </td>
                    {/* Nama Rider */}
                    <td className="px-5 py-4 border-r-2 border-gray-100 text-left">
                      <div className="font-black text-black">{report.rider}</div>
                      <div className="text-gray-400 font-bold text-[9px] mt-0.5">{report.unit}</div>
                    </td>
                    {/* Lokasi */}
                    <td className="px-5 py-4 border-r-2 border-gray-100 text-left">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-red-500 shrink-0">location_on</span>
                        <span className="text-gray-700 truncate font-bold text-[11px]">{report.gps}</span>
                      </div>
                    </td>
                    {/* Bawa */}
                    <td className="px-3 py-4 border-r-2 border-gray-100 text-center text-gray-500 font-black">
                      {report.bawa}
                    </td>
                    {/* Terjual */}
                    <td className="px-3 py-4 border-r-2 border-gray-100 text-center font-black text-black">
                      {report.terjual}
                    </td>
                    {/* Basi */}
                    <td className={`px-3 py-4 border-r-2 border-gray-100 text-center font-black ${
                      report.basi > 0 ? 'text-[#EF4444]' : 'text-gray-400'
                    }`}>
                      {report.basi}
                    </td>
                    {/* Rusak */}
                    <td className={`px-3 py-4 border-r-2 border-gray-100 text-center font-black ${
                      report.rusak > 0 ? 'text-[#EC4899]' : 'text-gray-400'
                    }`}>
                      {report.rusak}
                    </td>
                    {/* Metode */}
                    <td className="px-4 py-4 border-r-2 border-gray-100 text-center">
                      <span className="inline-block px-2.5 py-0.5 border border-black rounded text-[9px] font-black tracking-wider uppercase bg-[#F1F5F9] shadow-[1px_1px_0_0_#000]">
                        {report.metode}
                      </span>
                    </td>
                    {/* Total Setoran */}
                    <td className="px-5 py-4 text-right font-black text-black text-sm">
                      Rp {report.setoran.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs cursor-pointer shadow-[2px_2px_0_0_#000] ${
                    currentPage === pageNum ? 'bg-[#FACC15]' : 'bg-white hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
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

    </div>
  );
}
