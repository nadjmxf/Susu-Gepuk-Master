import React from 'react';

export default function AuthLayout({ title, subtitle, description, extraContent, children }) {
  return (
    <div className="flex min-h-screen bg-surface font-body-lg">
      {/* Left Panel - Hidden on mobile, visible on lg screens */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1e40af] text-white p-12 flex-col justify-center items-center relative overflow-hidden">
        {/* Organic vector blobs (Gooey effect) to simulate sharp seamless cow print */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
            <g filter="url(#goo)" fill="#1e3a8a">
              {/* Top Left Blob */}
              <circle cx="5%" cy="5%" r="100" />
              <circle cx="15%" cy="-5%" r="80" />
              <circle cx="-5%" cy="15%" r="90" />
              <circle cx="10%" cy="20%" r="60" />

              {/* Top Right Blob */}
              <circle cx="90%" cy="10%" r="120" />
              <circle cx="100%" cy="25%" r="90" />
              <circle cx="75%" cy="5%" r="80" />

              {/* Bottom Left Blob */}
              <circle cx="15%" cy="85%" r="110" />
              <circle cx="5%" cy="70%" r="80" />
              <circle cx="25%" cy="95%" r="90" />

              {/* Bottom Right Blob */}
              <circle cx="85%" cy="90%" r="130" />
              <circle cx="95%" cy="75%" r="100" />
              <circle cx="75%" cy="100%" r="90" />
              
              {/* Center Right Blob */}
              <circle cx="95%" cy="50%" r="80" />
              <circle cx="85%" cy="45%" r="60" />

              {/* Center Left Blob */}
              <circle cx="-5%" cy="45%" r="70" />
              <circle cx="5%" cy="55%" r="50" />
            </g>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-md text-center flex flex-col items-center">
          <h1 className="font-display-xl text-5xl md:text-6xl uppercase mb-8 leading-tight drop-shadow-md">
          </h1>
          <h2 className="text-3xl font-bold mb-4 font-headline-md">{subtitle}</h2>
          <p className="text-blue-100 font-body-md text-center">{description}</p>
          
          {extraContent && (
            <div className="mt-8 w-full">
              {extraContent}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
