import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import announcementService from '../../../services/announcementService';

export default function AnnouncementsSection({ sliders, onRefresh }) {
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [annEditMode, setAnnEditMode] = useState(false);
  const [selectedAnnId, setSelectedAnnId] = useState(null);
  const [annFormData, setAnnFormData] = useState({
    judul: '',
    isi: '',
    status: 'Aktif',
    tanggal_mulai: '',
    tanggal_selesai: ''
  });
  const [annImageFile, setAnnImageFile] = useState(null);
  const [annPhotoPreview, setAnnPhotoPreview] = useState(null);
  const annFileInputRef = useRef(null);

  const openAddAnn = () => {
    setAnnEditMode(false);
    setAnnImageFile(null);
    setAnnPhotoPreview(null);
    setAnnFormData({
      judul: '',
      isi: '',
      status: 'Aktif',
      tanggal_mulai: '',
      tanggal_selesai: ''
    });
    setIsAnnModalOpen(true);
  };

  const openEditAnn = (ann) => {
    setAnnEditMode(true);
    setSelectedAnnId(ann.id);
    setAnnImageFile(null);
    setAnnPhotoPreview(ann.image);
    setAnnFormData({
      judul: ann.title,
      isi: ann.isi || '',
      status: ann.status ? 'Aktif' : 'Nonaktif',
      tanggal_mulai: ann.tanggal_mulai || '',
      tanggal_selesai: ann.tanggal_selesai || ''
    });
    setIsAnnModalOpen(true);
  };

  const handleToggleSlider = async (sliderId) => {
    const slide = sliders.find(s => s.id === sliderId);
    if (!slide) return;
    const targetStatus = slide.status ? 'Nonaktif' : 'Aktif';
    try {
      await announcementService.updateAnnouncement(sliderId, { status: targetStatus });
      onRefresh();
    } catch (error) {
      alert('Gagal merubah status slide');
    }
  };

  const handleDeleteSlider = async (sliderId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengumuman/slide ini?')) return;
    try {
      await announcementService.deleteAnnouncement(sliderId);
      onRefresh();
    } catch (error) {
      alert('Gagal menghapus slide');
    }
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id_admin', 1);
    formData.append('judul', annFormData.judul || 'Pengumuman');
    formData.append('isi', annFormData.isi || '');
    formData.append('status', annFormData.status);
    if (annFormData.tanggal_mulai) {
      formData.append('tanggal_mulai', annFormData.tanggal_mulai);
    }
    if (annFormData.tanggal_selesai) {
      formData.append('tanggal_selesai', annFormData.tanggal_selesai);
    }
    if (annImageFile) {
      formData.append('gambar_announcement', annImageFile);
    }

    try {
      if (annEditMode) {
        await announcementService.updateAnnouncement(selectedAnnId, formData);
      } else {
        await announcementService.createAnnouncement(formData);
      }
      setIsAnnModalOpen(false);
      setAnnImageFile(null);
      setAnnPhotoPreview(null);
      onRefresh();
    } catch (error) {
      alert(error.message || 'Gagal menyimpan pengumuman');
    }
  };

  return (
    <>
      {/* ----------------------------------------------------
          SECTION 1: TOP BANNER AND CAROUSEL SLIDER (BLUE BOX)
          ---------------------------------------------------- */}
      <div className="rounded-2xl p-6 md:p-8 space-y-8 ">

        {/* Header Title Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-white pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-[#fdd835] tracking-wide uppercase">
              Kelola Data Outlet
            </h1>
            <p className="text-gray-200 font-bold text-xs">
              Atur konten banner dan informasi terbaru untuk aplikasi pelanggan.
            </p>
          </div>
          <button
            onClick={openAddAnn}
            className="bg-[#FACC15] hover:bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all rounded-xl px-5 py-2.5 font-black text-xs uppercase flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined font-black text-sm">campaign</span>
            Unggah Pengumuman Baru
          </button>
        </div>

        {/* Carousel Visual Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-[#FACC15] text-lg">visibility</span>
              Urutan Visual Slider
            </div>
            {/* Page Arrow indicators */}
            <div className="flex gap-2">
              <button className="bg-white border-2 border-black rounded-lg w-7 h-7 flex items-center justify-center hover:bg-gray-100 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
                <span className="material-symbols-outlined text-xs font-black">chevron_left</span>
              </button>
              <button className="bg-white border-2 border-black rounded-lg w-7 h-7 flex items-center justify-center hover:bg-gray-100 cursor-pointer shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000]">
                <span className="material-symbols-outlined text-xs font-black">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sliders.map((slide, idx) => (
              <div
                key={slide.id}
                className="bg-white border-[3px] border-black rounded-2xl overflow-hidden shadow-[4px_4px_0_0_#000] flex flex-col justify-between"
              >
                {/* Visual Image & Toggle */}
                <div className="p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      SLIDE {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSlider(slide.id)}
                        className={`w-10 h-5.5 rounded-full border-2 border-black flex items-center p-0.5 transition-colors cursor-pointer ${slide.status ? 'bg-[#22C55E] justify-end' : 'bg-gray-300 justify-start'}`}
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-black"></div>
                      </button>
                      <span className="text-[9px] font-black text-gray-500 uppercase">{slide.status ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>

                  {/* Banner Image Mock */}
                  <div className="border-[3px] border-black rounded-xl w-full bg-[#fdd835] overflow-hidden shadow-[2px_2px_0_0_#000] relative aspect-[3/4]" style={{ contentVisibility: 'auto' }}>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover block opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                      <p className="text-[10px] text-[#FACC15] font-black uppercase tracking-wider mb-1">Pengumuman</p>
                      <h4 className="text-xs font-black leading-snug drop-shadow-md">{slide.title}</h4>
                    </div>
                  </div>
                </div>

                {/* Info and delete action */}
                <div className="bg-gray-50 border-t-2 border-black px-3 py-2.5 flex justify-between items-center">
                  <button
                    onClick={() => openEditAnn(slide)}
                    className="text-xs font-black text-black hover:text-[#3B82F6] truncate pr-2 text-left"
                  >
                    ✏ {slide.title}
                  </button>
                  <button
                    onClick={() => handleDeleteSlider(slide.id)}
                    className="text-[#EF4444] hover:text-red-700 cursor-pointer flex items-center shrink-0"
                    title="Hapus Slide"
                  >
                    <span className="material-symbols-outlined text-sm font-black">delete</span>
                    <span className="text-[9px] font-black uppercase ml-0.5">hapus</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Dotted Add Banner Card */}
            <button
              onClick={openAddAnn}
              className="border-[3px] border-dashed border-white rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center p-6 space-y-2 group cursor-pointer w-full h-full min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#FACC15] border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-black font-black text-xl">add</span>
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Tambah Slide / Pengumuman
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Modal Announcement */}
      {isAnnModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] w-full max-w-lg overflow-hidden flex flex-col my-8">

            {/* Header */}
            <div className="bg-[#EEF2FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-[#0A1045] font-black text-sm uppercase tracking-widest">
                {annEditMode ? 'EDIT DATA PENGUMUMAN' : 'TAMBAH PENGUMUMAN BARU'}
              </span>
              <button
                onClick={() => setIsAnnModalOpen(false)}
                className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-gray-50 flex items-center justify-center shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-black">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAnnouncement} className="flex flex-col flex-1 text-left">
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                {/* Judul Pengumuman */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    JUDUL PENGUMUMAN
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Promo Ramadhan Berkah"
                    value={annFormData.judul}
                    onChange={(e) => setAnnFormData({ ...annFormData, judul: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border-[3px] border-black rounded-xl text-black font-bold text-xs focus:outline-none focus:ring-0 placeholder:text-gray-400 shadow-[2px_2px_0_0_#000]"
                  />
                </div>

                {/* Gambar Pengumuman */}
                <div>
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest mb-2 block">
                    GAMBAR PENGUMUMAN
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Preview box */}
                    <div className="w-20 h-20 border-[3px] border-black rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center shadow-[2px_2px_0_0_#000] shrink-0">
                      {annPhotoPreview ? (
                        <img src={annPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-gray-400 text-3xl font-black">image</span>
                      )}
                    </div>
                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => annFileInputRef.current?.click()}
                        className="bg-white hover:bg-gray-50 text-black border-2 border-black rounded-lg px-3 py-1.5 font-black text-[10px] uppercase shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] transition-all cursor-pointer"
                      >
                        Pilih Gambar
                      </button>
                      {annPhotoPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setAnnImageFile(null);
                            setAnnPhotoPreview(null);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white border-2 border-black rounded-lg px-3 py-1.5 font-black text-[10px] uppercase shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] transition-all cursor-pointer"
                        >
                          Hapus
                        </button>
                      )}
                      <input
                        ref={annFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAnnImageFile(file);
                            setAnnPhotoPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0A1045] uppercase tracking-widest block">
                    STATUS AKTIF
                  </label>
                  <div className="bg-[#F1F5F9] border-2 border-dashed border-gray-300 rounded-xl p-3 flex gap-6 items-center">
                    <label className="flex items-center gap-2 cursor-pointer font-black text-xs text-[#10B981]">
                      <input
                        type="radio"
                        name="ann_status"
                        checked={annFormData.status === 'Aktif'}
                        onChange={() => setAnnFormData({ ...annFormData, status: 'Aktif' })}
                        className="w-4 h-4 border-2 border-black focus:ring-0 text-[#10B981]"
                      />
                      <span>● AKTIF</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-black text-xs text-[#EF4444]">
                      <input
                        type="radio"
                        name="ann_status"
                        checked={annFormData.status === 'Nonaktif'}
                        onChange={() => setAnnFormData({ ...annFormData, status: 'Nonaktif' })}
                        className="w-4 h-4 border-2 border-black focus:ring-0 text-[#EF4444]"
                      />
                      <span>● NON-AKTIF</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-[#F1F5F9] border-t-2 border-black px-6 py-4 flex justify-end gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
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
