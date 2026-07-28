import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import outletService from '../../../services/outletService';

const itemsPerPage = 5;

export default function SotrSection({ sotrUnits, ridersList, onRefresh, handleToggleOutletStatus }) {
  const [sotrPage, setSotrPage] = useState(1);
  const [isSotrModalOpen, setIsSotrModalOpen] = useState(false);
  const [sotrEditMode, setSotrEditMode] = useState(false);
  const [selectedSotrId, setSelectedSotrId] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [sotrFormData, setSotrFormData] = useState({
    unit: '',
    rider: 'Belum Ditugaskan',
    area: 'Marpoyan - Simpang Tiga',
    status_sotr: 'Aktif',
    status_operasional: 'BUKA',
    latitude: 0.5074,
    longitude: 101.4478
  });

  const sotrTotalPages = Math.max(1, Math.ceil(sotrUnits.length / itemsPerPage));
  const paginatedSotrUnits = sotrUnits.slice((sotrPage - 1) * itemsPerPage, sotrPage * itemsPerPage);

  // Kumpulkan id_rider yang sudah dipakai di unit SOTR lain (selain yang sedang diedit)
  const assignedRiderIds = new Set(
    sotrUnits
      .filter(u => u.id !== selectedSotrId && u.rider !== 'Belum Ditugaskan')
      .map(u => {
        const matched = ridersList.find(r => r.nama_rider === u.rider);
        return matched ? matched.id_rider : null;
      })
      .filter(Boolean)
  );

  useEffect(() => {
    if (sotrPage > sotrTotalPages) {
      setSotrPage(sotrTotalPages);
    }
  }, [sotrUnits.length, sotrPage, sotrTotalPages]);

  const openAddSotr = () => {
    setSotrEditMode(false);
    setSaveError(null);
    setSotrFormData({
      unit: '',
      rider: 'Belum Ditugaskan',
      area: 'Marpoyan - Simpang Tiga',
      status_sotr: 'Aktif',
      status_operasional: 'BUKA',
      latitude: 0.5074,
      longitude: 101.4478
    });
    setIsSotrModalOpen(true);
  };

  const openEditSotr = (unit) => {
    setSotrEditMode(true);
    setSelectedSotrId(unit.id);
    setSaveError(null);
    setSotrFormData({
      unit: unit.unit,
      rider: unit.rider,
      area: unit.area,
      status_sotr: unit.status_sotr,
      status_operasional: unit.status_operasional,
      latitude: unit.latitude || 0.5074,
      longitude: unit.longitude || 101.4478
    });
    setIsSotrModalOpen(true);
  };

  const handleDeleteSotrUnit = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus unit SOTR ini?')) return;
    try {
      await outletService.deleteOutlet(id);
      onRefresh();
    } catch (error) {
      alert('Gagal menghapus unit SOTR');
    }
  };

  const handleSaveSotrUnit = async (e) => {
    e.preventDefault();
    setSaveError(null);
    if (!sotrFormData.unit.trim()) return;

    const matchedRiderObj = ridersList.find(r => r.nama_rider === sotrFormData.rider);
    const id_rider = matchedRiderObj ? matchedRiderObj.id_rider : null;

    // Guard: jangan izinkan pilih rider yang sudah ditugaskan di SOTR lain
    if (id_rider && assignedRiderIds.has(id_rider)) {
      setSaveError('Rider ini sudah ditugaskan di unit SOTR lain. Pilih rider yang berbeda.');
      return;
    }

    const payload = {
      id_admin: 1,
      nama_outlet: sotrFormData.unit,
      id_rider: id_rider,
      area: sotrFormData.area,
      jenis_outlet: 'Outlet Bergerak',
      status_operasional: sotrFormData.status_sotr === 'Aktif' ? 'Buka' : 'Tutup',
      latitude: sotrFormData.latitude || 0.5074,
      longitude: sotrFormData.longitude || 101.4478
    };

    try {
      if (sotrEditMode) {
        await outletService.updateOutlet(selectedSotrId, payload);
      } else {
        await outletService.createOutlet(payload);
      }
      setIsSotrModalOpen(false);
      onRefresh();
    } catch (error) {
      // Tangani error 409 dari backend (rider sudah ditugaskan)
      if (error?.response?.status === 409 || error?.already_assigned) {
        setSaveError('Rider ini sudah ditugaskan di unit SOTR lain. Satu rider hanya bisa ditugaskan ke satu unit SOTR.');
      } else {
        setSaveError('Gagal menyimpan unit SOTR. Periksa kembali data yang diisi.');
      }
    }
  };

  return (
    <>
      {/* ----------------------------------------------------
          SECTION 4: OUTLET BERGERAK / SOTR (BLUE / INDIGO BG)
          ---------------------------------------------------- */}
      <div className="space-y-4">

        {/* Section Title Pill Line */}
        <div className="flex items-center gap-4 w-full">
          <div className="bg-[#3B82F6] border-[3px] border-black text-white font-black text-xs uppercase px-5 py-2.5 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-[3px_3px_0_0_#000] tracking-wider whitespace-nowrap">
            <span className="material-symbols-outlined text-sm font-black">local_shipping</span>
            OUTLET BERGERAK / SOTR
          </div>
          <div className="h-0.5 flex-1 bg-blue-200 opacity-40"></div>
          <span className="material-symbols-outlined text-white opacity-40">chevron_right</span>
        </div>

        {/* SOTR Table */}
        <div className="bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000] p-4 md:p-6">
          <div className="overflow-x-auto">
            <table className="hidden md:table w-full text-left text-xs font-bold text-black border-separate border-spacing-0">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider font-black text-white">
                  <th className="px-4 py-3 text-center w-12 bg-[#0D1B5E] rounded-l-xl">NO</th>
                  <th className="px-6 py-3 bg-[#0D1B5E]">UNIT OUTLET</th>
                  <th className="px-6 py-3 bg-[#0D1B5E]">RIDER DITUGASKAN</th>
                  <th className="px-4 py-3 text-center bg-[#0D1B5E]">STATUS SOTR</th>
                  <th className="px-4 py-3 text-center bg-[#0D1B5E] rounded-r-xl">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {/* Spacing Row */}
                <tr className="h-3">
                  <td colSpan="5"></td>
                </tr>
                {paginatedSotrUnits.map((unit, idx) => {
                  const isAktif = unit.status_sotr === 'Aktif';
                  const hasRider = unit.rider !== 'Belum Ditugaskan';
                  return (
                    <tr key={unit.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* No */}
                      <td className="px-4 py-3 border-r-2 border-gray-100 text-center font-black text-gray-500">
                        {String((sotrPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}
                      </td>
                      {/* Unit SOTR */}
                      <td className="px-6 py-3 border-r-2 border-gray-100 text-left font-black text-sm text-black">
                        <div>{unit.unit}</div>
                        <div className="text-[10px] text-gray-400 font-bold">Area: {unit.area}</div>
                      </td>
                      {/* Rider Ditugaskan */}
                      <td className="px-6 py-3 border-r-2 border-gray-100 text-left">
                        {hasRider ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border border-black overflow-hidden shadow-[1px_1px_0_0_#000] bg-gray-200 shrink-0">
                              {unit.foto_rider ? (
                                <img
                                  src={unit.foto_rider}
                                  alt={unit.rider}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/susu.webp';
                                    e.target.className = 'w-full h-full object-contain p-0.5 bg-white';
                                  }}
                                />
                              ) : (
                                <span className="material-symbols-outlined text-xs flex items-center justify-center h-full">person</span>
                              )}
                            </div>
                            <span className="text-black font-black text-xs leading-none">{unit.rider}</span>
                          </div>
                        ) : (
                          <div className="bg-[#FFFBEB] border border-amber-300 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 w-max shadow-[1px_1px_0_0_#FCD34D]">
                            <span className="material-symbols-outlined text-xs">warning</span>
                            BELUM DITUGASKAN
                          </div>
                        )}
                      </td>
                      {/* Status SOTR Toggle */}
                      <td className="px-4 py-3 border-r-2 border-gray-100 text-center">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleToggleOutletStatus(unit, 'sotr')}
                            className={`w-10 h-5.5 rounded-full border-2 border-black flex items-center p-0.5 transition-colors cursor-pointer ${isAktif ? 'bg-[#22C55E] justify-end' : 'bg-gray-300 justify-start'
                              }`}
                          >
                            <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-black"></div>
                          </button>
                        </div>
                      </td>
                      {/* Aksi */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => openEditSotr(unit)}
                            className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-gray-50 flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer"
                            title="Edit Unit SOTR"
                          >
                            <span className="material-symbols-outlined text-sm text-gray-700">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSotrUnit(unit.id)}
                            className="w-8 h-8 rounded-lg border-2 border-[#EF4444] bg-white hover:bg-red-50 flex items-center justify-center shadow-[2px_2px_0_0_#EF4444] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#EF4444] cursor-pointer"
                            title="Hapus Unit SOTR"
                          >
                            <span className="material-symbols-outlined text-sm text-[#EF4444]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Card Content - Mobile */}
          <div className="block md:hidden divide-y-[3px] divide-gray-900 bg-white">
            {paginatedSotrUnits.map((unit) => {
              const isAktif = unit.status_sotr === 'Aktif';
              const hasRider = unit.rider !== 'Belum Ditugaskan';
              return (
                <div key={unit.id} className="p-4 flex flex-col gap-3 text-left relative">
                  {/* Status SOTR Toggle at top right */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleToggleOutletStatus(unit, 'sotr')}
                      className={`w-10 h-5.5 rounded-full border-[2px] border-black flex items-center p-0.5 transition-colors cursor-pointer ${isAktif ? 'bg-[#22C55E] justify-end' : 'bg-gray-300 justify-start'
                        }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-black"></div>
                    </button>
                  </div>

                  <div className="pr-14">
                    <h3 className="font-black text-black text-sm">{unit.unit}</h3>
                    <div className="text-gray-500 font-bold text-[10px] mt-1">Area: {unit.area}</div>
                  </div>

                  <div className="mt-1">
                    {hasRider ? (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full border-[2px] border-black overflow-hidden shadow-[1px_1px_0_0_#000] bg-gray-200 shrink-0">
                          {unit.foto_rider ? (
                            <img
                              src={unit.foto_rider}
                              alt={unit.rider}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/susu.webp';
                                e.target.className = 'w-full h-full object-contain p-0.5 bg-white';
                              }}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-xs flex items-center justify-center h-full">person</span>
                          )}
                        </div>
                        <span className="text-black font-black text-xs leading-none">{unit.rider}</span>
                      </div>
                    ) : (
                      <div className="bg-[#FFFBEB] border-[2px] border-amber-300 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 w-max shadow-[1px_1px_0_0_#FCD34D] mt-2">
                        <span className="material-symbols-outlined text-xs">warning</span>
                        BELUM DITUGASKAN
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t-[2px] border-gray-100">
                    <span className={`inline-block px-3 py-1 border-[2px] border-black rounded text-[9px] font-black tracking-widest uppercase shadow-[2px_2px_0_0_#000] ${unit.status_operasional === 'BUKA'
                        ? 'border-[#22C55E] bg-green-50 text-[#22C55E]'
                        : 'border-gray-400 bg-gray-50 text-gray-500'
                      }`}>
                      {unit.status_operasional}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditSotr(unit)}
                        className="w-8 h-8 rounded-lg border-[2px] border-black bg-white flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]"
                      >
                        <span className="material-symbols-outlined text-sm text-gray-700">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSotrUnit(unit.id)}
                        className="w-8 h-8 rounded-lg border-[2px] border-[#EF4444] bg-white flex items-center justify-center shadow-[2px_2px_0_0_#EF4444] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#EF4444]"
                      >
                        <span className="material-symbols-outlined text-sm text-[#EF4444]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {sotrUnits.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-bold">
                Unit SOTR tidak ditemukan.
              </div>
            )}
          </div>

          <div className="border-t-2 border-gray-100 my-4"></div>

          {/* Footer info pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-gray-500 font-bold">
              Menampilkan {sotrUnits.length > 0 ? (sotrPage - 1) * itemsPerPage + 1 : 0}-{Math.min(sotrPage * itemsPerPage, sotrUnits.length)} dari {sotrUnits.length} unit
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSotrPage(prev => Math.max(prev - 1, 1))}
                disabled={sotrPage === 1}
                className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-sm transition-all ${sotrPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-white hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
                  }`}
              >
                &lt;
              </button>
              {Array.from({ length: sotrTotalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setSotrPage(p)}
                  className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-xs transition-all ${p === sotrPage
                      ? 'bg-[#FACC15] cursor-default shadow-[2px_2px_0_0_#000]'
                      : 'bg-white hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setSotrPage(prev => Math.min(prev + 1, sotrTotalPages))}
                disabled={sotrPage === sotrTotalPages}
                className={`border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-black text-sm transition-all ${sotrPage === sotrTotalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-white hover:bg-gray-50 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]'
                  }`}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Footer Row with Add Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={openAddSotr}
            className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined font-black text-sm">add</span>
            TAMBAH OUTLET SOTR
          </button>
        </div>
      </div>

      {/* Modal SOTR */}
      {isSotrModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-lg overflow-hidden flex flex-col my-8">

            {/* Header */}
            <div className="bg-[#EEF2FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-[#0A1045] font-black text-sm uppercase tracking-widest">
                {sotrEditMode ? 'EDIT DATA OUTLET SOTR' : 'TAMBAH OUTLET SOTR'}
              </span>
              <button
                onClick={() => setIsSotrModalOpen(false)}
                className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-gray-50 flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-black">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSotrUnit} className="flex flex-col flex-1 text-left">
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">

                {/* Nama Unit SOTR */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    NAMA UNIT SOTR / OUTLET
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rider Budi (SOTR)"
                    value={sotrFormData.unit}
                    onChange={(e) => setSotrFormData({ ...sotrFormData, unit: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                    required
                  />
                </div>

                {/* Rider Penangung Jawab Select */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    RIDER PENANGGUNG JAWAB
                  </label>
                  <select
                    value={sotrFormData.rider}
                    onChange={(e) => {
                      setSaveError(null);
                      setSotrFormData({ ...sotrFormData, rider: e.target.value });
                    }}
                    className="w-full px-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 shadow-[2px_2px_0_0_#000] cursor-pointer"
                  >
                    <option value="Belum Ditugaskan">Belum Ditugaskan</option>
                    {ridersList.map(r => {
                      const isTaken = assignedRiderIds.has(r.id_rider);
                      return (
                        <option
                          key={r.id_rider}
                          value={r.nama_rider}
                          disabled={isTaken}
                          style={isTaken ? { color: '#9ca3af', fontStyle: 'italic' } : {}}
                        >
                          {r.nama_rider}{isTaken ? ' (Sudah Ditugaskan)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  {/* Warning jika rider yang dipilih ternyata sudah dipakai */}
                  {(() => {
                    const selectedRider = ridersList.find(r => r.nama_rider === sotrFormData.rider);
                    const isTaken = selectedRider && assignedRiderIds.has(selectedRider.id_rider);
                    return isTaken ? (
                      <div className="mt-2 flex items-center gap-2 bg-amber-50 border-2 border-amber-400 rounded-lg px-3 py-2">
                        <span className="material-symbols-outlined text-amber-600 text-sm">warning</span>
                        <p className="text-[10px] font-black text-amber-700">Rider ini sudah ditugaskan di unit SOTR lain.</p>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* Area Input */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    AREA WILAYAH BERJUALAN
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Marpoyan / Panam / Harapan Raya"
                      value={sotrFormData.area}
                      onChange={(e) => setSotrFormData({ ...sotrFormData, area: e.target.value })}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                      required
                    />
                    <span className="material-symbols-outlined absolute left-4 text-gray-500 font-bold text-sm">
                      location_on
                    </span>
                  </div>
                </div>

              </div>

              {/* Error Banner */}
              {saveError && (
                <div className="mx-6 mb-4 flex items-start gap-3 bg-red-50 border-[2px] border-red-400 rounded-xl px-4 py-3 shadow-[2px_2px_0_0_#EF4444]">
                  <span className="material-symbols-outlined text-red-500 text-lg shrink-0 mt-0.5">error</span>
                  <p className="text-[11px] font-black text-red-700 leading-snug">{saveError}</p>
                </div>
              )}

              {/* Footer */}
              <div className="bg-[#F1F5F9] border-t-2 border-black px-6 py-4 flex justify-end gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSotrModalOpen(false)}
                  className="bg-white hover:bg-gray-100 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-6 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black text-[16px]">save</span>
                  SIMPAN DATA
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
