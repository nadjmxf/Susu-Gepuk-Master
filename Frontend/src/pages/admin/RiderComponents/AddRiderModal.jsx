import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import riderService from '../../../services/riderService';

export default function AddRiderModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nama_rider: '',
    username: '',
    no_hp: '',
    password: '',
    foto_rider: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormError(null);
    setFormData({ nama_rider: '', username: '', no_hp: '', password: '', foto_rider: null });
    setPhotoPreview(null);
    onClose();
  };

  const handleSaveRider = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.nama_rider.trim()) {
      setFormError('Nama lengkap rider tidak boleh kosong.');
      return;
    }
    if (!formData.username.trim()) {
      setFormError('Username tidak boleh kosong.');
      return;
    }
    if (!formData.no_hp.trim()) {
      setFormError('Nomor HP tidak boleh kosong.');
      return;
    }
    if (!/^\d+$/.test(formData.no_hp.trim())) {
      setFormError('Format nomor telepon tidak valid. Pastikan hanya menggunakan angka.');
      return;
    }
    if (!formData.password) {
      setFormError('Password tidak boleh kosong.');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('Password harus minimal 6 karakter.');
      return;
    }

    try {
      const data = new FormData();
      data.append('nama_rider', formData.nama_rider.trim());
      data.append('no_hp', '+62 ' + formData.no_hp.trim());
      data.append('username', formData.username.trim());
      data.append('password', formData.password);
      if (formData.foto_rider) {
        data.append('foto_rider', formData.foto_rider);
      }

      const response = await riderService.createRider(data);
      if (response && response.success) {
        handleClose();
        if (onSuccess) onSuccess();
      } else {
        setFormError(response?.message || 'Gagal menambahkan akun rider.');
      }
    } catch (err) {
      console.error('Error creating rider:', err);
      setFormError(err.message || 'Gagal menyambungkan ke server atau username telah digunakan.');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-xl overflow-hidden flex flex-col my-8">
        <div className="bg-[#1d4ed8] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FACC15] rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
              <span className="material-symbols-outlined text-black font-black text-xl">person_add</span>
            </div>
            <h2 className="text-[#FACC15] font-black text-md uppercase tracking-wider">
              Tambah Akun Rider
            </h2>
          </div>
          <button onClick={handleClose} className="text-white hover:text-gray-200 transition-colors cursor-pointer flex items-center">
            <span className="material-symbols-outlined text-2xl font-black">close</span>
          </button>
        </div>

        <form onSubmit={handleSaveRider} className="flex flex-col flex-1">
          <div className="p-6 space-y-5 flex-1 overflow-y-auto text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black text-black uppercase tracking-widest mb-2 block">
                  Nama Lengkap Rider *
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama_rider}
                  onChange={(e) => setFormData({ ...formData, nama_rider: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-black uppercase tracking-widest mb-2 block">
                  Nomor HP (Whatsapp) *
                </label>
                <div className="flex items-center bg-white border-[3px] border-black rounded-xl px-4 py-0">
                  <span className="font-black text-black text-sm mr-2 select-none">+62</span>
                  <input
                    type="text"
                    placeholder="8123456789"
                    value={formData.no_hp}
                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    className="w-full py-3 bg-transparent text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="text-[10px] font-black text-black uppercase tracking-widest mb-2 block">
                  Username Login *
                </label>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-black uppercase tracking-widest mb-2 block">
                  Password Awal *
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-4 pr-12 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-black focus:outline-none cursor-pointer flex items-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {formError && (
              <div className="bg-[#FFF0F3] border-[3px] border-black rounded-2xl p-4 flex gap-4 items-center">
                <div className="bg-[#E11D48] border-[2.5px] border-black rounded-lg w-12 h-12 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                  <span className="material-symbols-outlined text-white font-black text-2xl">error</span>
                </div>
                <div className="flex-1 flex flex-col justify-center text-left">
                  <h4 className="text-[#1E293B] font-black text-sm uppercase tracking-wider leading-none mb-1">
                    Validasi Gagal
                  </h4>
                  <p className="text-gray-500 font-bold text-xs leading-tight">
                    {formError}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest block">
                Foto Profil Rider
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="foto-rider-add"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({ ...formData, foto_rider: file });
                      setPhotoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <label
                  htmlFor="foto-rider-add"
                  className="border-2 border-dashed border-black rounded-xl w-24 h-24 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative shadow-[2px_2px_0_0_#000]"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-black font-black text-2xl">photo_camera</span>
                      <span className="text-[9px] font-black text-black uppercase tracking-widest mt-1">Upload</span>
                    </>
                  )}
                </label>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-normal">
                  Format JPG/PNG, Maks 2MB
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#F1F5F9] border-t-2 border-black px-6 py-4 flex justify-end gap-4 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined font-black text-[16px]">save</span>
              Simpan Akun
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
