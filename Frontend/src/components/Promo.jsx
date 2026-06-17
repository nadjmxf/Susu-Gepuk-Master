import React, { useState } from 'react';

const promos = [
  { id: 1, img: '/promo/HimbauanPenting.jpg', alt: 'Himbauan Penting' },
  { id: 2, img: '/promo/PelangganWajibBaca.jpg', alt: 'Pelanggan Wajib Baca' },
  { id: 3, img: '/promo/Jam&HariBuka.jpg', alt: 'Jam & Hari Buka' },

  
];

export default function Promo() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    const itemsToShow = window.innerWidth < 768 ? 1 : 3;
    setActiveIndex(prev => (prev === 0 ? promos.length - itemsToShow : prev - 1));
  };

  const handleNext = () => {
    const itemsToShow = window.innerWidth < 768 ? 1 : 3;
    setActiveIndex(prev => (prev >= promos.length - itemsToShow ? 0 : prev + 1));
  };

  return (
    <section className="w-[95%] max-w-[1450px] mx-auto relative mt-4">
      <button 
        onClick={handlePrev}
        className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1e40af] border-[3px] border-[#1e40af] hover:bg-blue-50 shadow-md transition-transform active:scale-95"
      >
        <span className="material-symbols-outlined font-bold">chevron_left</span>
      </button>

      <div className="overflow-hidden py-4">
        <div 
          className="flex gap-4 md:gap-8 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * (100 / 3)}%)` }}
        >
          {promos.map((promo, idx) => (
            <div key={idx} className="min-w-[100%] md:min-w-[calc(33.333%-1rem)] lg:min-w-[calc(33.333%-1.33rem)] rounded-[40px] border-4 border-gray-900 shadow-[8px_8px_0_0_rgba(17,24,39,1)] overflow-hidden bg-gray-100">
              <img 
                src={promo.img} 
                alt={promo.alt} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleNext}
        className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1e40af] border-[3px] border-[#1e40af] hover:bg-blue-50 shadow-md transition-transform active:scale-95"
      >
        <span className="material-symbols-outlined font-bold">chevron_right</span>
      </button>
    </section>
  );
}
