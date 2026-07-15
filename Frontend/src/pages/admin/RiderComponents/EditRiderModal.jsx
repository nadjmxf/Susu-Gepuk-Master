import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import riderService from '../../../services/riderService';

export default function EditRiderModal({ isOpen, onClose, onSuccess, selectedRider, getFotoUrl }) {
  const [editFormData, setEditFormData] = useState({
    nama_rider: '',
    username: '',
    no_hp: '',
    password: '',
    foto_rider: null
  });
  const [editPhotoPreview, setEditPhotoPreview] = useState(null);
  const [editFormError, setEditFormError] = useState(null);
  const [showEditPassword, setShowEditPassword] = useState(false);

  useEffect(() => {
    if (isOpen && selectedRider) {
      setEditFormData({
        nama_rider: selectedRider.nama_rider,
        username: selectedRider.username || '',
        no_hp: selectedRider.no_hp ? selectedRider.no_hp.replace('+62 ', '') : '',
        password: '',
        foto_rider: null
      });
      setEditPhotoPreview(getFotoUrl(selectedRider.foto_rider));
      setEditFormError(null);
      setShowEditPassword(false);
    }
  }, [isOpen, selectedRider, getFotoUrl]);

  if (!isOpen || !selectedRider) return null;

  const handleUpdateRider = async (e) => {
    e.preventDefault();
    setEditFormError(null);

    if (!editFormData.nama_rider.trim()) {
      setEditFormError('Nama lengkap rider tidak boleh kosong.');
      return;
    }
    if (!editFormData.no_hp.trim()) {
      setEditFormError('Nomor HP tidak boleh kosong.');
      return;
    }

    let formattedPhone = editFormData.no_hp.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+62 ' + formattedPhone.replace(/^0/, '');
    }

    try {
      const data = new FormData();
      data.append('nama_rider', editFormData.nama_rider.trim());
      if (editFormData.username.trim()) {
        data.append('username', editFormData.username.trim());
      }
      data.append('no_hp', formattedPhone);
      if (editFormData.password) {
        data.append('password', editFormData.password);
      }
      if (editFormData.foto_rider) {
        data.append('foto_rider', editFormData.foto_rider);
      }

      const response = await riderService.updateRider(selectedRider.id_rider, data);
      if (response.success && response.data) {
        onSuccess();
      } else {
        setEditFormError(response.message || 'Gagal memperbarui akun.');
      }
    } catch (err) {
      console.error('Error updating rider:', err);
      setEditFormError(err.message || 'Gagal memperbarui akun.');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-xl overflow-hidden flex flex-col my-8">
        <div className="bg-[#1d4ed8] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FACC15] rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
              <span className="material-symbols-outlined text-black font-black text-xl">edit</span>
            </div>
            <h2 className="text-[#FACC15] font-black text-md uppercase tracking-wider">
              EDIT AKUN RIDER
            </h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors cursor-pointer flex items-center">
            <span className="material-symbols-outlined text-2xl font-black">close</span>
          </button>
        </div>

        <form onSubmit={handleUpdateRider} className="flex flex-col flex-1 text-left">
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div className="flex items-center gap-6 mb-2">
              <input
                type="file"
                id="foto-rider-edit"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditFormData({ ...editFormData, foto_rider: file });
                    setEditPhotoPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <div className="relative w-24 h-24 shrink-0">
                <div className="w-full h-full border-[3px] border-black bg-white overflow-hidden shadow-[3px_3px_0_0_#000] rounded-lg flex items-center justify-center">
                  {editPhotoPreview ? (
                    <img src={editPhotoPreview} alt={editFormData.nama_rider} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-gray-400">person</span>
                  )}
                </div>
                <label
                  htmlFor="foto-rider-edit"
                  className="absolute -bottom-2 -right-2 bg-[#FACC15] hover:bg-yellow-400 border-2 border-black rounded-lg p-1.5 shadow-[2px_2px_0_0_#000] cursor-pointer flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-black font-black text-xs">edit</span>
                </label>
              </div>
              <div className="text-left">
                <h3 className="font-black text-[#0A1045] text-md">Foto Profil Rider</h3>
                <p className="text-gray-400 font-bold text-xs mt-1">Format JPG/PNG, Maks. 2MB</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                NAMA LENGKAP RIDER
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Nama Lengkap Rider"
                  value={editFormData.nama_rider}
                  onChange={(e) => setEditFormData({ ...editFormData, nama_rider: e.target.value })}
                  className="w-full pl-4 pr-12 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                />
                <span className="material-symbols-outlined absolute right-4 text-gray-500 font-bold">
                  badge
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                NOMOR HP (WHATSAPP)
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="+62 81234567890"
                  value={editFormData.no_hp}
                  onChange={(e) => setEditFormData({ ...editFormData, no_hp: e.target.value })}
                  className="w-full pl-4 pr-12 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                />
                <span className="material-symbols-outlined absolute right-4 text-gray-500 font-bold">
                  phone
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                USERNAME LOGIN
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Username Login"
                  value={editFormData.username}
                  onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  className="w-full pl-4 pr-12 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                />
                <span className="material-symbols-outlined absolute right-4 text-gray-500 font-bold">
                  account_circle
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                PASSWORD AWAL
              </label>
              <div className="relative flex items-center">
                <input
                  type={showEditPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  className="w-full pl-4 pr-12 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-4 text-black focus:outline-none cursor-pointer flex items-center"
                >
                  <span className="material-symbols-outlined text-[20px] text-gray-500">
                    {showEditPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <span className="text-[10px] text-gray-500 font-mono italic mt-2 block">
                * Kosongkan jika tidak ingin mengubah password
              </span>
            </div>

            {editFormError && (
              <div className="bg-[#FFF0F3] border-[3px] border-black rounded-2xl p-4 flex gap-4 items-center">
                <div className="bg-[#E11D48] border-[2.5px] border-black rounded-lg w-12 h-12 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                  <span className="material-symbols-outlined text-white font-black text-2xl">error</span>
                </div>
                <div className="flex-1 flex flex-col justify-center text-left">
                  <h4 className="text-[#1E293B] font-black text-sm uppercase tracking-wider leading-none mb-1">
                    Validasi Gagal
                  </h4>
                  <p className="text-gray-500 font-bold text-xs leading-tight">
                    {editFormError}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#F1F5F9] border-t-2 border-black px-6 py-4 flex justify-end gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-8 py-2.5 font-black text-xs uppercase cursor-pointer"
            >
              BATAL
            </button>
            <button
              type="submit"
              className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-8 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined font-black text-[16px]">save</span>
              SIMPAN
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
