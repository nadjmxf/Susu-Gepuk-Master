import React from 'react';
import { createPortal } from 'react-dom';
import riderService from '../../../services/riderService';

export default function StatusRiderModal({ isOpen, onClose, onSuccess, selectedRider, pendingStatusValue }) {
  if (!isOpen || !selectedRider) return null;

  const handleConfirmStatusChange = async () => {
    try {
      const response = await riderService.updateRider(selectedRider.id_rider, {
        status_akun: pendingStatusValue ? 'Aktif' : 'Nonaktif'
      });
      if (response.success) {
        onSuccess(pendingStatusValue);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-lg overflow-hidden flex flex-col my-8">
        <div className="bg-[#EEF2FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
          <span className="text-[#0A1045] font-black text-xs uppercase tracking-widest">
            PERHATIAN DIPERLUKAN
          </span>
          <button
            onClick={onClose}
            className="text-[#0A1045] hover:text-red-600 transition-colors cursor-pointer flex items-center"
          >
            <span className="material-symbols-outlined text-2xl font-black">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6 text-left">
          <div className="flex gap-4 items-start">
            {pendingStatusValue ? (
              <div className="w-14 h-14 rounded-xl border-[3px] border-[#10B981] bg-green-50 text-[#10B981] flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                <span className="material-symbols-outlined text-3xl font-black">check_circle</span>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl border-[3px] border-[#EF4444] bg-red-50 text-[#EF4444] flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
                <span className="material-symbols-outlined text-3xl font-black">block</span>
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-lg font-black text-black leading-tight">
                {pendingStatusValue ? (
                  <>Konfirmasi: Aktifkan akun <span className="underline">{selectedRider.nama_rider}</span>?</>
                ) : (
                  <>Konfirmasi: Nonaktifkan akun {selectedRider.nama_rider}?</>
                )}
              </h3>
              <p className="text-xs text-gray-500 font-bold leading-relaxed mt-2">
                {pendingStatusValue
                  ? "Akun yang diaktifkan akan kembali mendapatkan akses ke portal rider dan dapat mulai melakukan pengiriman kembali."
                  : "Akun yang dinonaktifkan tidak akan bisa mengakses portal rider. Semua sesi aktif akan segera diputus."}
              </p>
            </div>
          </div>

          <div className="bg-[#F1F5F9] border-l-[4px] border-l-[#0A1045] rounded-r-xl p-4 flex gap-3 items-start">
            <span className="material-symbols-outlined text-gray-700 text-sm mt-0.5">info</span>
            <p className="text-[10px] text-gray-700 font-bold font-mono leading-relaxed">
              {pendingStatusValue
                ? "Tindakan ini akan mencatat riwayat pengaktifan kembali di log sistem."
                : "Tindakan ini akan mencatat riwayat penonaktifan secara permanen di log sistem."}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 flex justify-end items-center gap-6 bg-white shrink-0">
          <button
            onClick={onClose}
            className="text-xs font-black text-gray-500 hover:text-black transition-colors cursor-pointer uppercase"
          >
            Batal
          </button>
          {pendingStatusValue ? (
            <button
              onClick={handleConfirmStatusChange}
              className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined font-black text-sm">check_circle</span>
              Ya, Aktifkan
            </button>
          ) : (
            <button
              onClick={handleConfirmStatusChange}
              className="bg-[#EF4444] hover:bg-red-600 text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined font-black text-sm">cancel</span>
              Ya, Nonaktifkan
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
