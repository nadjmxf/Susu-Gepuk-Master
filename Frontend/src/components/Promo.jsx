import React, { useState, useEffect } from 'react';
import announcementService from '../services/announcementService';

const promos = [
  { id: 1, img: '/promo/HimbauanPenting.jpg', alt: 'Himbauan Penting' },
  { id: 2, img: '/promo/PelangganWajibBaca.jpg', alt: 'Pelanggan Wajib Baca' },
  { id: 3, img: '/promo/Jam&HariBuka.jpg', alt: 'Jam & Hari Buka' },
];

export default function Promo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementService.getAllAnnouncements();
        if (response.success && response.data) {
          const activeAnns = response.data
            .filter(ann => ann.status === 'Aktif')
            .map(ann => {
              let imgUrl = '/promo/PelangganWajibBaca.jpg';
              if (ann.gambar_announcement) {
                if (ann.gambar_announcement.startsWith('http')) {
                  imgUrl = ann.gambar_announcement;
                } else {
                  const storageBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '/storage');
                  imgUrl = `${storageBaseUrl}/${ann.gambar_announcement}`;
                }
              }
              return {
                id: ann.id_announcement,
                img: imgUrl,
                alt: ann.judul
              };
            });
          setAnnouncements(activeAnns);
        }
      } catch (error) {
        console.error('Gagal mengambil data pengumuman:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  const displayPromos = announcements.length > 0 ? announcements : promos;
  const itemsToShow = isMobile ? 1 : 3;

  const handlePrev = () => {
    if (displayPromos.length <= itemsToShow) return;
    setActiveIndex(prev => (prev === 0 ? displayPromos.length - itemsToShow : prev - 1));
  };

  const handleNext = () => {
    if (displayPromos.length <= itemsToShow) return;
    setActiveIndex(prev => (prev >= displayPromos.length - itemsToShow ? 0 : prev + 1));
  };

  const translationValue = activeIndex * (100 / itemsToShow);

  return (
    <section className="w-[95%] max-w-[1450px] mx-auto relative mt-4">
      {displayPromos.length > itemsToShow && (
        <button 
          onClick={handlePrev}
          className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1e40af] border-[3px] border-[#1e40af] hover:bg-blue-50 shadow-md transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined font-bold">chevron_left</span>
        </button>
      )}

      <div className="overflow-hidden py-4">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${translationValue}%)` }}
        >
          {displayPromos.map((promo, idx) => (
            <div 
              key={idx} 
              className="w-full md:w-[33.3333%] shrink-0 px-2 md:px-4"
            >
              <div className="w-full h-full rounded-[30px] md:rounded-[40px] border-4 border-gray-900 shadow-[6px_6px_0_0_rgba(17,24,39,1)] md:shadow-[8px_8px_0_0_rgba(17,24,39,1)] overflow-hidden bg-white">
                <img 
                  src={promo.img} 
                  alt={promo.alt} 
                  className="w-full h-full object-cover block"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {displayPromos.length > itemsToShow && (
        <button 
          onClick={handleNext}
          className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1e40af] border-[3px] border-[#1e40af] hover:bg-blue-50 shadow-md transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined font-bold">chevron_right</span>
        </button>
      )}
    </section>
  );
}
