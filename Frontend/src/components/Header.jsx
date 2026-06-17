import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [activeItem, setActiveItem] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const activeElement = navRefs.current[activeItem];
      if (activeElement) {
        setIndicatorStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
        });
      }
    };
    
    // Slight delay to ensure DOM is fully rendered before calculating
    setTimeout(updateIndicator, 0);
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeItem]);

  const menuItems = [
    { label: 'Home', id: 'home' },
    { label: 'Menu', id: 'menu' },
    { label: 'Lokasi', id: 'lokasi', isDropdown: true, subItems: [
        { label: 'SOTR', id: 'lokasi-sotr' },
        { label: 'Outlet', id: 'lokasi-outlet' }
      ]
    },
    { label: 'About Us', id: 'about-us' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 px-8 md:px-11 flex justify-between items-center transition-all duration-300 bg-white opacity-0 animate-fade-in ${isScrolled ? 'py-3 shadow-md border-b border-gray-100' : 'py-5'}`} style={{ animationFillMode: 'forwards' }}>
      <div className="flex flex-col leading-none font-bold text-[#0f2c7a] text-xl font-display-xl uppercase tracking-tighter hover:scale-105 transition-transform duration-300 cursor-pointer">
        <img src="/susu.png" alt="Susu Gepuk" className="w-48" />
      </div>
      
      <nav className="hidden md:flex bg-[#0f2c7a] rounded-full p-1.5 shadow-[0_4px_14px_0_rgba(15,44,122,0.39)] relative">
        {/* Sliding Indicator Pill */}
        <div 
          className="absolute top-1.5 bottom-1.5 bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-sm"
          style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }}
        />

        {menuItems.map((item) => (
          <div key={item.label} className="group relative" ref={(el) => (navRefs.current[item.label] = el)}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveItem(item.label);
                const targetElement = document.getElementById(item.id);
                if (targetElement) {
                  const headerOffset = 100;
                  const elementPosition = targetElement.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - headerOffset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`relative z-10 px-4 py-2 rounded-full font-bold text-sm transition-colors duration-300 font-label-bold flex items-center justify-center gap-1.5 ${
                activeItem === item.label 
                  ? 'text-[#0f2c7a]' 
                  : 'text-white hover:text-blue-200'
              }`}
            >
              {item.label}
              {(item.label === 'Lokasi' || item.label === 'About Us') && (
                <span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${activeItem === item.label ? (item.isDropdown ? 'rotate-180' : 'rotate-90') : 'rotate-0'}`}>
                  {/* {item.isDropdown ? 'keyboard_arrow_down' : 'chevron_right'} */}
                </span>
              )}
            </a>

            {/* Dropdown Menu */}
            {item.isDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-40 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 z-50 overflow-hidden">
                <div className="py-2">
                  {item.subItems.map(sub => (
                    <a
                      key={sub.label}
                      href={`#${sub.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveItem(item.label);
                        const targetElement = document.getElementById(sub.id);
                        if (targetElement) {
                          const headerOffset = 100;
                          const elementPosition = targetElement.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.scrollY - headerOffset;
                          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        }
                      }}
                      className="block px-5 py-3 text-sm font-bold text-[#0f2c7a] hover:bg-blue-50 transition-all border-b border-gray-50 last:border-0 hover:pl-6"
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-[#0f2c7a] p-2 hover:bg-blue-50 rounded-full transition-colors active:scale-95">
        <span className="material-symbols-outlined text-3xl">menu</span>
      </button>

      {/* Login Buttons */}
      <div className="flex items-center gap-3">
        <Link 
          to="/admin/login"
          className="hidden sm:inline-block px-4 py-2 text-sm font-bold text-[#0f2c7a] bg-white hover:bg-gray-100 border-2 border-[#0f2c7a] rounded-lg transition-all"
        >
          Admin Login
        </Link>
        <Link 
          to="/rider/login"
          className="px-4 py-2 text-sm font-bold text-white bg-[#0f2c7a] hover:bg-[#0a1a4d] border-2 border-[#0f2c7a] rounded-lg transition-all"
        >
          Rider Login
        </Link>
      </div>
    </header>
  );
}
