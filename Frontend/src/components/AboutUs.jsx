import React from 'react';

export default function AboutUs() {
  return (
    <section className="py-24 px-8 bg-blue-50" id="about-us">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl font-bold text-[#0f2c7a] mb-4 font-display-lg uppercase tracking-wider">KENAPA KAMI?</h2>
          <div className="h-1.5 w-16 bg-[#eab308] rounded-full mb-6"></div>
          <p className="text-gray-500 max-w-2xl font-body-md text-lg">
            Kami berkomitmen memberikan kualitas susu sapi premium terbaik setiap harinya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#0f2c7a] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-3xl">🐄</span>
            </div>
            <h3 className="font-bold text-[#0f2c7a] text-xl mb-3 font-headline-md uppercase">100% Asli</h3>
            <p className="text-gray-500 font-body-md">Diperah langsung setiap pagi untuk menjamin kualitas dan nutrisi terbaik.</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#eab308] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="font-bold text-[#0f2c7a] text-xl mb-3 font-headline-md uppercase">Halal</h3>
            <p className="text-gray-500 font-body-md">Proses higienis dan terjamin halal untuk ketenangan hati Anda saat mengonsumsi.</p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#0f2c7a] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-3xl">🛵</span>
            </div>
            <h3 className="font-bold text-[#0f2c7a] text-xl mb-3 font-headline-md uppercase">Ngebut</h3>
            <p className="text-gray-500 font-body-md">Armada kami siap mengantar kesegaran langsung ke lokasi Anda setiap hari.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
