import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

export default function Register() {
  const extraContent = (
    <div className="flex gap-4 text-left">
      <div className="bg-[#ffffff10] border border-[#ffffff20] rounded-xl p-4 flex-1 backdrop-blur-sm">
        <span className="material-symbols-outlined text-yellow-400 mb-2">inventory_2</span>
        <h4 className="font-bold text-sm mb-1 font-label-bold">Manajemen Stok</h4>
        <p className="text-xs text-blue-200 font-body-md">Pantau ketersediaan susu segar setiap saat.</p>
      </div>
      <div className="bg-[#ffffff10] border border-[#ffffff20] rounded-xl p-4 flex-1 backdrop-blur-sm">
        <span className="material-symbols-outlined text-yellow-400 mb-2">monitoring</span>
        <h4 className="font-bold text-sm mb-1 font-label-bold">Data Real-time</h4>
        <p className="text-xs text-blue-200 font-body-md">Akses laporan penjualan dan distribusi harian.</p>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Susu Gepuk"
      subtitle="Pendaftaran Staff Baru"
      description="Bergabunglah dalam mengelola kesegaran Susu Gepuk. Jadilah bagian dari tim yang menjaga kualitas dari peternakan hingga ke tangan pelanggan."
      extraContent={extraContent}
    >
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#1e40af] mb-2 font-headline-md">Buat Akun Admin Baru</h3>
        <p className="text-gray-500 font-body-md text-sm">Lengkapi data di bawah untuk akses dasbor admin.</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#1e40af] mb-1 font-label-bold">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none transition-all font-body-md text-sm"
            placeholder="Masukkan nama lengkap"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1e40af] mb-1 font-label-bold">Staff ID/Email</label>
          <input
            type="text"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none transition-all font-body-md text-sm"
            placeholder="Contoh: SG-12345 atau email@susu.com"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-[#1e40af] mb-1 font-label-bold">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none transition-all font-body-md text-sm"
              placeholder="••••••••"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-[#1e40af] mb-1 font-label-bold">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none transition-all font-body-md text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4 mb-6">
          <input type="checkbox" className="mt-1 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400" />
          <p className="text-xs text-gray-500 font-body-md">Saya menyetujui kebijakan internal perusahaan dan kerahasiaan data Susu Gepuk.</p>
        </div>

        <button type="submit" className="w-full bg-[#eab308] text-[#1e40af] font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-100">
          Daftar Staff
        </button>
      </form>

      <div className="mt-8 text-center text-sm font-body-md">
        <span className="text-gray-500">Sudah memiliki akun? </span>
        <Link to="/admin/login" className="text-[#1e40af] font-bold hover:underline">Masuk di sini</Link>
      </div>
    </AuthLayout>
  );
}
