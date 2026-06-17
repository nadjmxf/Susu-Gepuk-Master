import React from 'react';
import { Link } from 'react-router-dom';

export default function Location() {
  return (
    <section className="bg-[#1e3a8a] pt-24 border-t-8 border-gray-900 w-full overflow-hidden flex flex-col" id="lokasi">
      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-2 font-display-lg uppercase tracking-wider">LOCATION</h2>
          <div className="h-1.5 w-16 bg-[#eab308] rounded-full"></div>
        </div>

        {/* LOKASI OUTLET */}
        <div className="mb-20" id="lokasi-outlet">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[#0f2c7a] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold z-10 border-2 border-transparent">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              LOKASI OUTLET
            </div>
            <div className="h-0.5 flex-1 bg-blue-200 opacity-40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Open Outlet */}
            {[1, 2].map((item) => (
              <div key={`open-${item}`} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-[4px_4px_0_0_rgba(17,24,39,1)] border-4 border-white hover:-translate-y-1 hover:border-gray-900 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-gray-900" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#0f2c7a] text-[13px]">GEPUK PUSAT SUDIRMAN</h4>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-wide">BUKA SEKARANG • 08:00 - 22:00</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </div>
            ))}
            {/* Closed Outlet */}
            <div className="bg-gray-400 rounded-2xl p-4 flex items-center gap-4 shadow-[4px_4px_0_0_rgba(17,24,39,1)] border-4 border-gray-900 opacity-90 cursor-not-allowed">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-gray-900" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-[13px]">GEPUK TEBET POINT</h4>
                <p className="text-[10px] text-gray-700 font-bold uppercase tracking-wide">TUTUP • BUKA BESOK 09:00</p>
              </div>
              <span className="material-symbols-outlined text-gray-700">chevron_right</span>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Link 
              to="/outlets"
              className="bg-[#fde047] text-gray-900 px-8 py-2.5 rounded-full font-bold border-2 border-gray-900 shadow-[3px_3px_0_0_rgba(17,24,39,1)] hover:bg-yellow-400 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_rgba(17,24,39,1)] transition-all inline-block"
            >
              Others
            </Link>
          </div>
        </div>

        {/* LOKASI SOTR */}
        <div className="mb-24" id="lokasi-sotr">
          <div className="flex items-center gap-4 mb-16">
            <div className="bg-[#0f2c7a] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold z-10 border-2 border-transparent">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              LOKASI SOTR
            </div>
            <div className="h-0.5 flex-1 bg-blue-200 opacity-40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            {[1, 2, 3].map((item) => (
              <div key={`sotr-${item}`} className="bg-white rounded-3xl pt-14 pb-8 px-6 relative flex flex-col items-center border-4 border-gray-900 shadow-[6px_6px_0_0_rgba(17,24,39,1)]">
                {/* Avatar Circle */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gray-200 rounded-full shrink-0 border-4 border-gray-900 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-gray-400">person</span>
                </div>

                <h4 className="font-bold text-gray-900 mb-6 font-headline-md">NAMA</h4>
                <div className="w-full h-1 bg-gray-900 mb-6"></div>

                <div className="flex items-start gap-3 w-full mb-8">
                  <div className="w-8 h-8 bg-[#0f2c7a] rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 font-label-bold uppercase tracking-wider">LOKASI SAAT INI</p>
                    <p className="font-bold text-gray-900 text-sm">Jl. Sudirman (Dekat Bundaran)</p>
                  </div>
                </div>

                <button className="bg-[#b91c1c] text-white font-bold px-6 py-3 rounded-full border-[3px] border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] flex items-center gap-2 hover:bg-red-800 hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(17,24,39,1)] transition-all text-[11px] uppercase tracking-wide">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                  LIHAT LIVE LOCATION
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-12">
            <Link 
              to="/sotr"
              className="bg-[#fde047] text-gray-900 px-9 py-2.5 mb-4 rounded-full font-bold border-2 border-gray-900 shadow-[3px_3px_0_0_rgba(17,24,39,1)] hover:bg-yellow-400 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_rgba(17,24,39,1)] transition-all inline-block"
            >
              Others
            </Link>
          </div>
        </div>
      </div>


      {/* NEW FULL WIDTH FOOTER BAR */}
      <div className="w-full mt-8 bg-[#1e3a8a]">
        {/* Illustration */}
        <div className="w-full">
          <img src="/footersapi.png" alt="Susu Gepuk Farm" className="w-full h-auto block" />
        </div>

        {/* Footer Content */}
        <div className="bg-[#0f2c7a] pt-12 pb-8 px-8 relative">
          
          {/* Logo pill (centered absolute overlapping) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-white border-4 border-gray-900 rounded-[40px] px-8 py-3 shadow-[4px_4px_0_0_rgba(17,24,39,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(17,24,39,1)] transition-all cursor-pointer flex items-center justify-center">
              <img src="/susu.png" alt="Susu Gepuk" className="h-8 md:h-10 object-contain" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mt-2">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-white font-bold tracking-wide uppercase text-sm md:text-base mb-1">
                SUSU SEGAR TIAP HARI
              </h3>
              <p className="text-blue-300 text-xs font-medium">
                © 2021 Susu Gepuk Indonesia. All rights reserved.
              </p>
            </div>

            <div className="flex-1 text-center md:text-right">
              <h3 className="text-white font-bold tracking-wide uppercase text-sm md:text-base mb-1">
                KAYA VITAMIN, SEHAT & BERKALSIUM
              </h3>
              <p className="text-blue-300 text-xs font-medium">
                @susugepuk
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


