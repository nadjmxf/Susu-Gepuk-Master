import React, { useState } from 'react';

export default function Reports() {
  // ----------------------------------------------------
  // 1. SELECT FILTER STATES
  // ----------------------------------------------------
  const [selectedMonth, setSelectedMonth] = useState('Mei');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [currentPage, setCurrentPage] = useState(1);

  // ----------------------------------------------------
  // 2. MOCK DATA BY PERIOD
  // ----------------------------------------------------
  const monthlyMetrics = {
    Mei: {
      terjual: '2.450 pcs',
      basi: '12 pcs',
      rusak: '5 pcs',
      pendapatan: 'Rp 40.000.000',
      data: [
        {
          id: 1,
          tanggal: '12 Mei 2026',
          waktu: '17:30 WIB',
          rider: 'Budi Santoso',
          unit: 'SOTR Unit-A1',
          gps: 'Jl. Sudirman No.5',
          bawa: 140,
          terjual: 21,
          basi: 0,
          rusak: 0,
          metode: 'QRIS',
          setoran: 246000
        },
        {
          id: 2,
          tanggal: '11 Mei 2026',
          waktu: '17:15 WIB',
          rider: 'Ahmad Kurniawan',
          unit: 'SOTR Unit-A2',
          gps: 'Jl. Arifin Ahmad',
          bawa: 100,
          terjual: 80,
          basi: 2,
          rusak: 1,
          metode: 'CASH',
          setoran: 1200000
        },
        {
          id: 3,
          tanggal: '10 Mei 2026',
          waktu: '17:20 WIB',
          rider: 'Siti Aminah',
          unit: 'SOTR Unit-B1',
          gps: 'Jl. Monas Timur',
          bawa: 120,
          terjual: 95,
          basi: 5,
          rusak: 0,
          metode: 'QRIS',
          setoran: 1140000
        },
        {
          id: 4,
          tanggal: '09 Mei 2026',
          waktu: '16:45 WIB',
          rider: 'Budi Santoso',
          unit: 'SOTR Unit-A1',
          gps: 'Jl. Sudirman',
          bawa: 140,
          terjual: 140,
          basi: 0,
          rusak: 0,
          metode: 'QRIS',
          setoran: 1680000
        },
        {
          id: 5,
          tanggal: '08 Mei 2026',
          waktu: '17:00 WIB',
          rider: 'Ahmad Kurniawan',
          unit: 'SOTR Unit-A2',
          gps: 'Jl. Thamrin',
          bawa: 100,
          terjual: 98,
          basi: 2,
          rusak: 0,
          metode: 'CASH',
          setoran: 1176000
        },
        {
          id: 6,
          tanggal: '07 Mei 2026',
          waktu: '17:10 WIB',
          rider: 'Siti Aminah',
          unit: 'SOTR Unit-B1',
          gps: 'Jl. Kota Tua',
          bawa: 120,
          terjual: 115,
          basi: 5,
          rusak: 0,
          metode: 'QRIS',
          setoran: 1380000
        },
        {
          id: 7,
          tanggal: '06 Mei 2026',
          waktu: '17:25 WIB',
          rider: 'Budi Santoso',
          unit: 'SOTR Unit-A1',
          gps: 'Jl. Senayan Park',
          bawa: 140,
          terjual: 130,
          basi: 10,
          rusak: 0,
          metode: 'QRIS',
          setoran: 1560000
        }
      ]
    },
    Juni: {
      terjual: '2.890 pcs',
      basi: '8 pcs',
      rusak: '2 pcs',
      pendapatan: 'Rp 46.500.000',
      data: [
        {
          id: 1,
          tanggal: '15 Juni 2026',
          waktu: '17:45 WIB',
          rider: 'Budi Santoso',
          unit: 'SOTR Unit-A1',
          gps: 'Jl. Sudirman No.5',
          bawa: 150,
          terjual: 145,
          basi: 3,
          rusak: 2,
          metode: 'QRIS',
          setoran: 1740000
        },
        {
          id: 2,
          tanggal: '14 Juni 2026',
          waktu: '17:10 WIB',
          rider: 'Ahmad Kurniawan',
          unit: 'SOTR Unit-A2',
          gps: 'Jl. Arifin Ahmad',
          bawa: 110,
          terjual: 108,
          basi: 2,
          rusak: 0,
          metode: 'CASH',
          setoran: 1296000
        },
        {
          id: 3,
          tanggal: '13 Juni 2026',
          waktu: '17:15 WIB',
          rider: 'Siti Aminah',
          unit: 'SOTR Unit-B1',
          gps: 'Jl. Monas Timur',
          bawa: 120,
          terjual: 118,
          basi: 2,
          rusak: 0,
          metode: 'QRIS',
          setoran: 1416000
        },
        {
          id: 4,
          tanggal: '12 Juni 2026',
          waktu: '17:30 WIB',
          rider: 'Reza Wijaya',
          unit: 'SOTR Unit-A3',
          gps: 'Jl. Bintaro Utama',
          bawa: 130,
          terjual: 128,
          basi: 1,
          rusak: 1,
          metode: 'QRIS',
          setoran: 1536000
        },
        {
          id: 5,
          tanggal: '11 Juni 2026',
          waktu: '17:00 WIB',
          rider: 'Budi Santoso',
          unit: 'SOTR Unit-A1',
          gps: 'Jl. Thamrin',
          bawa: 140,
          terjual: 140,
          basi: 0,
          rusak: 0,
          metode: 'CASH',
          setoran: 1680000
        },
        {
          id: 6,
          tanggal: '10 Juni 2026',
          waktu: '17:05 WIB',
          rider: 'Ahmad Kurniawan',
          unit: 'SOTR Unit-A2',
          gps: 'Jl. Kota Tua',
          bawa: 100,
          terjual: 95,
          basi: 5,
          rusak: 0,
          metode: 'QRIS',
          setoran: 1140000
        },
        {
          id: 7,
          tanggal: '09 Juni 2026',
          waktu: '17:10 WIB',
          rider: 'Siti Aminah',
          unit: 'SOTR Unit-B1',
          gps: 'Jl. Senayan Park',
          bawa: 120,
          terjual: 110,
          basi: 10,
          rusak: 0,
          metode: 'QRIS',
          setoran: 1320000
        }
      ]
    }
  };

  // Default fallback data if other month selected
  const defaultPeriodData = {
    terjual: '1.200 pcs',
    basi: '4 pcs',
    rusak: '1 pcs',
    pendapatan: 'Rp 18.000.000',
    data: [
      {
        id: 1,
        tanggal: '01 ' + selectedMonth + ' ' + selectedYear,
        waktu: '17:00 WIB',
        rider: 'Budi Santoso',
        unit: 'SOTR Unit-A1',
        gps: 'Jl. Sudirman',
        bawa: 120,
        terjual: 118,
        basi: 1,
        rusak: 1,
        metode: 'QRIS',
        setoran: 1416000
      },
      {
        id: 2,
        tanggal: '02 ' + selectedMonth + ' ' + selectedYear,
        waktu: '17:10 WIB',
        rider: 'Ahmad Kurniawan',
        unit: 'SOTR Unit-A2',
        gps: 'Jl. Thamrin',
        bawa: 100,
        terjual: 97,
        basi: 3,
        rusak: 0,
        metode: 'CASH',
        setoran: 1164000
      }
    ]
  };

  const activePeriod = monthlyMetrics[selectedMonth] || defaultPeriodData;

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
              {activePeriod.terjual}
            </span>
          </div>

          {/* Card 2: Total Susu Basi */}
          <div className="bg-white border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-28">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
              TOTAL SUSU BASI (SEBULAN)
            </span>
            <span className="text-xl font-black text-[#EF4444] leading-none mt-2">
              {activePeriod.basi}
            </span>
          </div>

          {/* Card 3: Total Kemasan Rusak */}
          <div className="bg-white border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-28">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
              TOTAL KEMASAN RUSAK (SEBULAN)
            </span>
            <span className="text-xl font-black text-[#EC4899] leading-none mt-2">
              {activePeriod.rusak}
            </span>
          </div>

          {/* Card 4: Total Pendapatan */}
          <div style={{ backgroundColor: '#16A34A' }} className="border-[3px] border-black text-white rounded-2xl p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-28">
            <span className="text-[9px] font-black text-slate-100 uppercase tracking-widest leading-none">
              TOTAL PENDAPATAN (SEBULAN)
            </span>
            <span className="text-xl font-black text-white leading-none mt-2">
              {activePeriod.pendapatan}
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
          <table className="w-full border-collapse bg-white text-left text-xs font-bold text-black min-w-[900px]">
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
              {activePeriod.data.map((report) => (
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
        </div>

        {/* Footer info pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <span className="text-xs text-gray-500 font-bold">
            Showing 1-{activePeriod.data.length} of 142 reports
          </span>
          <div className="flex gap-2">
            <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-sm cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
              &lt;
            </button>
            <button 
              onClick={() => setCurrentPage(1)}
              className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs cursor-pointer shadow-[2px_2px_0_0_#000] ${
                currentPage === 1 ? 'bg-[#FACC15]' : 'bg-white hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
              }`}
            >
              1
            </button>
            <button 
              onClick={() => setCurrentPage(2)}
              className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs cursor-pointer shadow-[2px_2px_0_0_#000] ${
                currentPage === 2 ? 'bg-[#FACC15]' : 'bg-white hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
              }`}
            >
              2
            </button>
            <button 
              onClick={() => setCurrentPage(3)}
              className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs cursor-pointer shadow-[2px_2px_0_0_#000] ${
                currentPage === 3 ? 'bg-[#FACC15]' : 'bg-white hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
              }`}
            >
              3
            </button>
            <button className="bg-white border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-black text-sm cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
              &gt;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
