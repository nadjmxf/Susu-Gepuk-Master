import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import riderService from '../../../services/riderService';

export default function AbsensiRiderModal({ isOpen, onClose, enrichedRiders }) {
  const [absensiDate, setAbsensiDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [absensiRiderId, setAbsensiRiderId] = useState('');
  const [absensiStatus, setAbsensiStatus] = useState('');
  const [absensiKeterangan, setAbsensiKeterangan] = useState('');
  const [absensiError, setAbsensiError] = useState(null);
  const [absensiSuccess, setAbsensiSuccess] = useState(null);
  const [absensiLoading, setAbsensiLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setAbsensiDate(new Date().toISOString().split('T')[0]);
    setAbsensiRiderId('');
    setAbsensiStatus('');
    setAbsensiKeterangan('');
    setAbsensiError(null);
    setAbsensiSuccess(null);
    onClose();
  };

  const handleSaveAbsensi = async () => {
    setAbsensiError(null);
    setAbsensiSuccess(null);

    if (!absensiRiderId) {
      setAbsensiError('Pilih rider terlebih dahulu.');
      return;
    }
    if (!absensiStatus) {
      setAbsensiError('Pilih status absensi.');
      return;
    }

    setAbsensiLoading(true);
    try {
      if (absensiStatus === 'Berjualan') {
        setAbsensiError('Status "Hadir" diatur otomatis berdasarkan laporan penjualan rider. Pilih Sakit atau Izin.');
        setAbsensiLoading(false);
        return;
      }

      const payload = {
        tanggal_aktivitas: absensiDate,
        status_aktivitas: absensiStatus,
        keterangan: absensiKeterangan.trim() || null,
      };
      const response = await riderService.storeAbsensi(absensiRiderId, payload);
      if (response.success) {
        setAbsensiSuccess(response.message || 'Kehadiran berhasil disimpan!');
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setAbsensiError(response.message || 'Gagal menyimpan kehadiran.');
      }
    } catch (err) {
      setAbsensiError(err.message || 'Gagal menyimpan kehadiran. Periksa koneksi server.');
    } finally {
      setAbsensiLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-xl overflow-hidden flex flex-col my-8">
        <div className="bg-[#1d4ed8] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FACC15] rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
              <span className="material-symbols-outlined text-black font-black text-xl">event_available</span>
            </div>
            <h2 className="text-white font-black text-md uppercase tracking-wider">
              Form Absensi Rider
            </h2>
          </div>
          <button onClick={handleClose} className="text-white hover:text-gray-200 transition-colors cursor-pointer flex items-center">
            <span className="material-symbols-outlined text-2xl font-black">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1 overflow-y-auto text-left">
          <div>
            <label className="text-[10px] font-black text-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              Pilih Tanggal
            </label>
            <input
              type="date"
              value={absensiDate}
              onChange={(e) => setAbsensiDate(e.target.value)}
              className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">group</span>
              Pilih Rider
            </label>
            <select
              value={absensiRiderId}
              onChange={(e) => setAbsensiRiderId(e.target.value)}
              className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 shadow-[2px_2px_0_0_#000] cursor-pointer"
              required
            >
              <option value="">-- Pilih Rider --</option>
              {enrichedRiders.map(rider => (
                <option key={rider.id_rider} value={rider.id_rider}>
                  {rider.nama_rider} ({rider.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-black uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">tune</span>
              Status Absensi
            </label>

            <div className="mb-3 flex items-start gap-2.5 bg-blue-50 border-2 border-blue-300 rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-blue-500 text-base shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <div className="text-[10px] font-bold text-blue-700 leading-relaxed">
                <p className="font-black mb-0.5">Sistem Kehadiran Otomatis</p>
                <p>✅ <b>Hadir</b> — Otomatis terisi jika rider mengirim laporan penjualan hari itu.</p>
                <p>❌ <b>Absen</b> — Otomatis jika tidak ada laporan di hari tersebut.</p>
                <p>⚠️ Input manual di sini hanya untuk <b>Sakit</b> atau <b>Izin</b> (prioritas tertinggi).</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAbsensiStatus('Sakit')}
                className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-[3px] font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${absensiStatus === 'Sakit'
                    ? 'border-[#DC2626] bg-[#DC2626] text-white shadow-[4px_4px_0_0_#000]'
                    : 'border-black bg-gray-100 text-black hover:bg-gray-200 shadow-[2px_2px_0_0_#000]'
                  }`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
                Sakit
              </button>

              <button
                type="button"
                onClick={() => setAbsensiStatus('Izin')}
                className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-[3px] font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${absensiStatus === 'Izin'
                    ? 'border-[#1E40AF] bg-[#1E40AF] text-white shadow-[4px_4px_0_0_#000]'
                    : 'border-black bg-gray-100 text-black hover:bg-gray-200 shadow-[2px_2px_0_0_#000]'
                  }`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>event_busy</span>
                Izin
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">notes</span>
              Catatan / Keterangan (Opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Masukkan alasan jika Izin/Sakit..."
              value={absensiKeterangan}
              onChange={(e) => setAbsensiKeterangan(e.target.value)}
              className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-xl text-black font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400 resize-none"
            />
          </div>

          {absensiSuccess && (
            <div className="bg-green-50 border-[3px] border-black rounded-2xl p-4 flex gap-4 items-center">
              <div className="bg-[#22C55E] border-[2.5px] border-black rounded-lg w-12 h-12 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                <span className="material-symbols-outlined text-white font-black text-2xl">check_circle</span>
              </div>
              <div className="flex-1 flex flex-col justify-center text-left">
                <h4 className="text-[#1E293B] font-black text-sm uppercase tracking-wider leading-none mb-1">Berhasil</h4>
                <p className="text-gray-500 font-bold text-xs leading-tight">{absensiSuccess}</p>
              </div>
            </div>
          )}

          {absensiError && (
            <div className="bg-[#FFF0F3] border-[3px] border-black rounded-2xl p-4 flex gap-4 items-center">
              <div className="bg-[#E11D48] border-[2.5px] border-black rounded-lg w-12 h-12 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                <span className="material-symbols-outlined text-white font-black text-2xl">error</span>
              </div>
              <div className="flex-1 flex flex-col justify-center text-left">
                <h4 className="text-[#1E293B] font-black text-sm uppercase tracking-wider leading-none mb-1">Validasi Gagal</h4>
                <p className="text-gray-500 font-bold text-xs leading-tight">{absensiError}</p>
              </div>
            </div>
          )}
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
            type="button"
            onClick={handleSaveAbsensi}
            disabled={absensiLoading}
            className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined font-black text-[16px]">save</span>
            {absensiLoading ? 'Menyimpan...' : 'Simpan Kehadiran'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
