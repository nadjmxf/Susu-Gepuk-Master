import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import authService from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.loginAdmin(username, password);
      
      if (response.success) {
        // Redirect ke admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Silakan cek username dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      extraContent={
        <img
          src="/Susuputih (1).webp"
          alt="Susu Gepuk"
          className="w-[300px] h-auto mx-7 -mt-59 drop-shadow-xl"
        />
      }
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-[#1e40af] rounded-lg flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
        </div>
        <h2 className="text-[#1e40af] font-bold text-xl mb-8">Susu Gepuk | Admin</h2>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Login Admin</h3>
        <p className="text-gray-500 font-body-md">Silakan masuk ke panel kontrol Susu Gepuk.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            <p className="text-sm text-red-800 font-body-md">{error}</p>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-bold text-[#1e40af] mb-2 font-label-bold">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none transition-all font-body-md disabled:bg-gray-100"
            placeholder="Masukkan username admin"
            disabled={loading}
            required
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-bold text-[#1e40af] font-label-bold">Password</label>
            <Link to="/admin/forgot" className="text-sm font-bold text-[#1e40af] hover:underline font-label-bold">Butuh bantuan?</Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none transition-all font-body-md disabled:bg-gray-100"
              placeholder="••••••••"
              disabled={loading}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-sm">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
          <span className="material-symbols-outlined text-[#1e40af] text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
          <p className="text-xs text-gray-600 leading-relaxed font-body-md">Akses terbatas hanya untuk staf berwenang. Semua aktivitas dipantau secara berkala.</p>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#0f172a] text-white font-bold py-3 px-4 rounded-lg hover:bg-black transition-colors shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && (
            <span className="inline-block animate-spin">
              <span className="material-symbols-outlined text-sm">hourglass_empty</span>
            </span>
          )}
          {loading ? 'Sedang masuk...' : 'Masuk ke Panel'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm font-body-md">
        <span className="text-gray-500">Bukan Admin? </span>
        <Link to="/" className="text-[#1e40af] font-bold hover:underline">Kembali ke halaman utama</Link>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col items-center gap-2 text-xs text-gray-400 font-body-md">
        <p>© 2026 Susu Gepuk Admin Portal.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-600">Security Policy</a>
          <a href="#" className="hover:text-gray-600">Help Center</a>
        </div>
      </div>
    </AuthLayout>
  );
}
