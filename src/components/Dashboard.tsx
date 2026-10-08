import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PengumumanItem } from '../types';
import { 
  Megaphone, 
  Home, 
  Users, 
  Plus, 
  Calendar, 
  ChevronRight, 
  Lock, 
  Eye, 
  Edit3, 
  Trash2, 
  Phone, 
  Search, 
  Church, 
  Image as ImageIcon 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    setActiveView, 
    pengumumanList, 
    seksiList, 
    currentSession, 
    openAuthModal, 
    openPengumumanModal, 
    deletePengumuman, 
    hasAccessToSeksi,
    isPastorOrAdmin
  } = useApp();

  const [selectedSeksiFilter, setSelectedSeksiFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalPengumuman, setDetailModalPengumuman] = useState<PengumumanItem | null>(null);

  const isAdmin = isPastorOrAdmin();

  // Filter pengumuman
  const filteredPengumuman = pengumumanList.filter(item => {
    const matchesSeksi = selectedSeksiFilter === 'all' || item.seksiId === selectedSeksiFilter;
    const matchesSearch = 
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.isiLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seksiNama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeksi && matchesSearch;
  });

  const handleBuatPengumumanClick = () => {
    if (isAdmin || currentSession?.role === 'pengurus_seksi') {
      openPengumumanModal();
    } else {
      openAuthModal({
        role: 'pengurus_seksi',
        targetType: 'seksi',
        callback: () => openPengumumanModal(),
      });
    }
  };

  return (
    <div className="space-y-3.5 pb-20 md:pb-10">
      {/* Compact Mobile-Friendly Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-5 shadow-md border border-amber-500/25">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-medium mb-1">
            <Church className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="line-clamp-1">Paroki Katedral Keuskupan Agung Medan</span>
          </div>

          <h2 className="text-sm sm:text-lg font-bold font-cathedral text-white leading-tight mb-1">
            Sistem Informasi Program & Warta Pastoral
          </h2>

          <p className="text-[11px] sm:text-xs text-slate-300 leading-snug mb-2 line-clamp-2">
            Pilih <strong>14 Lingkungan</strong> atau <strong>7 Kategorial</strong> untuk melihat program. Autentikasi PIN diperlukan untuk input data.
          </p>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
            <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">14 Lingkungan</span>
            <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">7 Kategorial</span>
            <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">15 Seksi DPPH</span>
          </div>
        </div>
      </div>

      {/* Primary Gateway Selector: Lingkungan or Kategorial */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: 14 Lingkungan */}
        <div 
          onClick={() => setActiveView('lingkungan')}
          className="group bg-white rounded-xl p-3 border border-amber-200 hover:border-amber-500 shadow-xs hover:shadow-md transition cursor-pointer active:scale-[0.98] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                14 Wilayah
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-800 transition font-cathedral leading-tight mb-0.5">
              14 Lingkungan
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 leading-tight">
              Doa rosario, ibadat lingkungan, dan kunjungan umat.
            </p>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-amber-700 font-semibold">
            <span>Buka Lingkungan</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 2: 7 Kategorial */}
        <div 
          onClick={() => setActiveView('kategorial')}
          className="group bg-white rounded-xl p-3 border border-indigo-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition cursor-pointer active:scale-[0.98] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded">
                7 Kelompok
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-800 transition font-cathedral leading-tight mb-0.5">
              7 Kategorial
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 leading-tight">
              Legio Maria, OMK, SEKAMI, Kerahiman, Misdinar, PSSC.
            </p>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-indigo-700 font-semibold">
            <span>Buka Kategorial</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </div>

      {/* Warta & Pengumuman Seksi-Seksi */}
      <section className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-amber-100 text-amber-900 rounded-md">
              <Megaphone className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-cathedral leading-tight">
                Warta & Pengumuman Seksi Paroki
              </h3>
              <p className="text-[10px] text-slate-400">
                Pemberitahuan dari DPPH & 14 Seksi Paroki
              </p>
            </div>
          </div>

          <button
            onClick={handleBuatPengumumanClick}
            className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Warta</span>
            {!isAdmin && <Lock className="w-2.5 h-2.5 opacity-80" />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pengumuman atau seksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"
            >
              ✕
            </button>
          )}
        </div>

        {/* Seksi Filter Chips */}
        <div className="overflow-x-auto pb-0.5 pt-0.5 -mx-1 px-1 scrollbar-none flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setSelectedSeksiFilter('all')}
            className={`px-2 py-1 rounded-md shrink-0 font-medium transition cursor-pointer ${
              selectedSeksiFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua ({pengumumanList.length})
          </button>
          {seksiList.map((seksi) => {
            const count = pengumumanList.filter(p => p.seksiId === seksi.id).length;
            return (
              <button
                key={seksi.id}
                onClick={() => setSelectedSeksiFilter(seksi.id)}
                className={`px-2 py-1 rounded-md shrink-0 font-medium transition cursor-pointer flex items-center gap-1 ${
                  selectedSeksiFilter === seksi.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{seksi.singkatan}</span>
                {count > 0 && (
                  <span className="text-[9px] px-1 rounded-full bg-amber-800 text-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Announcements Content */}
        {filteredPengumuman.length === 0 ? (
          <div className="text-center py-7 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Megaphone className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-700">Belum ada pengumuman warta</p>
            <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs mx-auto">
              Data diatur 0. Pengurus Seksi/DPPH dapat menekan tombol "Buat Warta" di atas untuk memasukkan pengumuman baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredPengumuman.map((item) => {
              const seksi = seksiList.find(s => s.id === item.seksiId);
              const canManage = isAdmin || hasAccessToSeksi(item.seksiId);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border transition hover:shadow-xs flex flex-col justify-between overflow-hidden ${
                    item.prioritas === 'mendesak'
                      ? 'border-red-300 bg-red-50/10'
                      : item.prioritas === 'penting'
                      ? 'border-amber-300 bg-amber-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Picture / Image Banner if present */}
                  {item.gambarUrl && (
                    <div 
                      onClick={() => setDetailModalPengumuman(item)}
                      className="w-full h-36 sm:h-40 overflow-hidden bg-slate-100 cursor-pointer relative"
                    >
                      <img
                        src={item.gambarUrl}
                        alt={item.judul}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                        <ImageIcon className="w-2.5 h-2.5" />
                        <span>Foto Warta</span>
                      </div>
                    </div>
                  )}

                  <div className="p-3">
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${seksi?.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {item.seksiNama}
                      </span>
                      {item.prioritas !== 'biasa' && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          item.prioritas === 'mendesak' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.prioritas === 'mendesak' ? 'Mendesak' : 'Penting'}
                        </span>
                      )}
                    </div>

                    <h4 
                      onClick={() => setDetailModalPengumuman(item)}
                      className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-amber-800 transition cursor-pointer mb-1 leading-snug"
                    >
                      {item.judul}
                    </h4>

                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-tight">
                      {item.ringkasan || item.isiLengkap}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(item.tanggalMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetailModalPengumuman(item)}
                          className="text-[10px] text-amber-700 font-bold hover:underline cursor-pointer"
                        >
                          Detail
                        </button>

                        {canManage && (
                          <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200">
                            <button
                              onClick={() => openPengumumanModal(item)}
                              title="Edit"
                              className="p-0.5 text-slate-400 hover:text-blue-600"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus pengumuman "${item.judul}"?`)) {
                                  deletePengumuman(item.id);
                                }
                              }}
                              title="Hapus"
                              className="p-0.5 text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Detail Modal for Selected Pengumuman with Picture */}
      {detailModalPengumuman && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
                  {detailModalPengumuman.seksiNama}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-cathedral mt-1.5 leading-snug">
                  {detailModalPengumuman.judul}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalPengumuman(null)}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            {/* Display Picture in full view if present */}
            {detailModalPengumuman.gambarUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={detailModalPengumuman.gambarUrl}
                  alt={detailModalPengumuman.judul}
                  className="w-full max-h-60 object-contain mx-auto"
                />
              </div>
            )}

            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
              {detailModalPengumuman.isiLengkap}
            </div>

            <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
              {detailModalPengumuman.penanggungJawab && (
                <div><strong className="text-slate-800">PJ:</strong> {detailModalPengumuman.penanggungJawab}</div>
              )}
              {detailModalPengumuman.kontak && (
                <div><strong className="text-slate-800">Kontak:</strong> <span className="font-mono">{detailModalPengumuman.kontak}</span></div>
              )}
              {detailModalPengumuman.targetAudiens && (
                <div><strong className="text-slate-800">Sasaran:</strong> {detailModalPengumuman.targetAudiens}</div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setDetailModalPengumuman(null)}
                className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Tutup Warta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
