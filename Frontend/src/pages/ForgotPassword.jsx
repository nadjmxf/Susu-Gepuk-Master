import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

export default function ForgotPassword() {
  const extraContent = (
    <div className="mt-12 flex items-center justify-center gap-2 text-blue-200 border-t border-blue-800 pt-6">
      <span className="material-symbols-outlined text-sm">verified_user</span>
      <span className="text-xs font-label-bold">Sistem Keamanan Terenkripsi</span>
    </div>
  );

  return (
    <AuthLayout
      subtitle="Keamanan Akses Admin"
      description="Kami akan membantu memulihkan akses Anda ke panel kontrol. Pastikan Anda memiliki akses ke email terdaftar Anda."
      extraContent={extraContent}
    >
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-[#1e40af] mb-4 font-headline-md leading-tight">Lupa Password<br/>Admin?</h3>
        <p className="text-gray-500 font-body-md text-sm">Masukkan alamat email admin Anda yang terdaftar untuk menerima tautan pemulihan kata sandi.</p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-[#1e40af] mb-2 font-label-bold">Email Admin</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-sm">mail</span>
            <input
              type="email"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none transition-all font-body-md text-sm"
              placeholder="admin@susugepuk.com"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-[#eab308] text-[#1e40af] font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-100 flex items-center justify-center gap-2">
          Kirim Link Reset
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </form>

      <div className="mt-8 text-center text-sm font-body-md">
        <Link to="/admin/login" className="text-[#1e40af] font-bold hover:underline flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Kembali ke Login
        </Link>
      </div>

      <div className="mt-16 text-center text-xs text-gray-400 font-body-md">
        <p>© 2026 Susu Gepuk. All rights reserved.</p>
      </div>
    </AuthLayout>
  );
}
