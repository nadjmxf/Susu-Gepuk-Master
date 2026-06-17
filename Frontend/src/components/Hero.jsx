import React from 'react';

export default function Hero() {
  return (
    <section className="w-[95%] max-w-[1450px] mx-auto mb-16 mt-16 opacity-0 animate-fade-in-up" id="home" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      <div className="bg-white rounded-[45px] flex flex-col md:flex-row overflow-hidden border-4 border-gray-900 shadow-[12px_12px_0_0_rgba(17,24,39,1)] relative min-h-[400px] md:min-h-[500px]">
        
        {/* Full-width Background Illustration */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/hero-illustration.png')",
            backgroundSize: "cover",
            backgroundPosition: "left ",
            backgroundRepeat: "no-repeat"
          }}
        >
          {/* Gradient fade on the left side to ensure the text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-full md:w-2/3"></div>
        </div>

        {/* Left Content (Text and Buttons) */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-[#1e40af] mb-6 font-display-xl tracking-tight">
            SUSU GEPUK
          </h1>
          <p className="text-gray-800 font-body-lg text-lg mb-10 max-w-md leading-relaxed">
            Rasakan kemurnian susu premium yang diproses dengan cinta. Segar dari peternakan terbaik untuk menemani harimu yang penuh energi.
          </p>
          <div className="flex gap-4">
            <button className="bg-[#0f2c7a] text-white px-8 py-3 rounded-full font-bold border-4 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(17,24,39,1)] transition-all font-label-bold">
              Outlet
            </button>
            <button className="bg-[#0f2c7a] text-white px-8 py-3 rounded-full font-bold border-4 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(17,24,39,1)] transition-all font-label-bold">
              SOTR
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
