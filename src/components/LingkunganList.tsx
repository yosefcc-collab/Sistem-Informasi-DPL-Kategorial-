import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LingkunganItem } from '../types';
import { 
  Home, 
  MapPin, 
  User, 
  Phone, 
  Calendar, 
  Lock, 
  ChevronRight, 
  Search, 
  ShieldCheck,
  Edit,
  Sparkles
} from 'lucide-react';

export const LingkunganList: React.FC = () => {
  const { 
    lingkunganList, 
    programList, 
    currentSession, 
    openAuthModal, 
    navigateToEntityDetail,
    hasAccessToEntity,
    isPastorOrAdmin,
    openAdminEditModal
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [authDialogLingkungan, setAuthDialogLingkungan] = useState<LingkunganItem | null>(null);

  const filteredLingkungan = lingkunganList.filter(item => {
    return (
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wilayah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ketuaLingkungan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCardClick = (ling: LingkunganItem) => {
    const hasAccess = hasAccessToEntity('lingkungan', ling.id);
    if (hasAccess) {
      navigateToEntityDetail('lingkungan', ling.id);
    } else {
      setAuthDialogLingkungan(ling);
    }
  };

  const isAdmin = isPastorOrAdmin();

  return (
    <div className="space-y-3.5 pb-20 md:pb-10">
      {/* Header Banner - Compact */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-xl p-3.5 sm:p-5 text-white shadow-md border border-amber-600/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.2 rounded bg-amber-700/60 text-amber-200 text-[10px] font-medium mb-1">
              <Home className="w-3 h-3 text-amber-300" />
              <span>Komunitas Basis Gerejawi</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-cathedral">
              14 Lingkungan Paroki Katedral Medan
            </h2>
            <p className="text-[11px] sm:text-xs text-amber-100/90 mt-0.5 max-w-xl line-clamp-2">
              Pilih lingkungan untuk melihat atau menginput kegiatan. Autentikasi PIN diperlukan untuk manajemen program.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-amber-950/60 px-2.5 py-1.5 rounded-lg border border-amber-700/50">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <div className="text-[10px] text-amber-200 font-semibold">
              Autentikasi Pengurus
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notice Banner if Pastor/Admin */}
      {isAdmin && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-slate-800 font-semibold text-[11px] sm:text-xs">
              Mode Pastor / Admin Aktif: Anda dapat menginput dan mengubah nama pengurus di setiap lingkungan.
            </span>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari lingkungan (Sukaraja, Sei Agul, Kesawan, Lorong 1)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"
          >
            ✕
          </button>
        )}
      </div>

      {/* Lingkungan Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredLingkungan.map((ling) => {
          const programs = programList.filter(
            p => p.entityType === 'lingkungan' && p.entityId === ling.id
          );
          const activeProgramsCount = programs.filter(p => p.status === 'rencana' || p.status === 'berjalan').length;
          const isAuthorized = hasAccessToEntity('lingkungan', ling.id);

          return (
            <div
              key={ling.id}
              className={`bg-white rounded-xl p-3.5 border transition-all hover:shadow-md flex flex-col justify-between ${
                isAuthorized
                  ? 'border-emerald-300 ring-1 ring-emerald-500/20 bg-emerald-50/5'
                  : 'border-slate-200 hover:border-amber-400'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-mono">
                    {ling.kode}
                  </span>

                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAdminEditModal('lingkungan', ling.id);
                        }}
                        title="Edit Nama Pengurus"
                        className="p-1 text-slate-500 hover:text-amber-800 bg-slate-100 hover:bg-amber-100 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3 text-amber-700" />
                        <span>Edit Pengurus</span>
                      </button>
                    )}

                    {isAuthorized ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                        Aktif
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        PIN
                      </span>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h3 
                  onClick={() => handleCardClick(ling)}
                  className="text-sm font-bold text-slate-900 font-cathedral mb-1 leading-snug line-clamp-1 cursor-pointer hover:text-amber-800"
                >
                  {ling.nama}
                </h3>

                {/* Wilayah */}
                <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-2">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="line-clamp-1">{ling.wilayah}</span>
                </div>

                {/* Ketua & Kontak */}
                <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 min-w-0">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">
                        <strong>Ketua:</strong> {ling.ketuaLingkungan ? ling.ketuaLingkungan : <em className="text-slate-400">Belum diisi</em>}
                      </span>
                    </div>
                  </div>
                  {ling.kontak && (
                    <div className="flex items-center gap-1 text-slate-500">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-mono text-[10px]">{ling.kontak}</span>
                    </div>
                  )}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-1.5 text-center text-[10px] mb-2">
                  <div className="bg-amber-50/70 py-1 rounded border border-amber-100">
                    <span className="text-amber-800">Keluarga: </span>
                    <strong className="text-amber-950">{ling.jumlahKk} KK</strong>
                  </div>
                  <div className="bg-amber-50/70 py-1 rounded border border-amber-100">
                    <span className="text-amber-800">Umat: </span>
                    <strong className="text-amber-950">{ling.jumlahJiwa} Jiwa</strong>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <Calendar className="w-3 h-3 text-amber-600" />
                  <span>
                    <strong className="text-slate-900">{activeProgramsCount}</strong> Program
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCardClick(ling)}
                  className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-700 hover:text-amber-900 cursor-pointer"
                >
                  <span>{isAuthorized ? 'Buka Detail' : 'Masuk Menu'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Authentication Prompt Dialog When Clicking a Lingkungan */}
      {authDialogLingkungan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">
                    Autentikasi Pengurus
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-cathedral">
                    {authDialogLingkungan.nama}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setAuthDialogLingkungan(null)}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-snug">
              Untuk menginput atau mengelola data program kegiatan <strong>{authDialogLingkungan.nama}</strong>, silakan login dengan PIN Pengurus.
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  openAuthModal({
                    role: 'pengurus_lingkungan',
                    targetId: authDialogLingkungan.id,
                    targetName: authDialogLingkungan.nama,
                    targetType: 'lingkungan',
                  });
                  setAuthDialogLingkungan(null);
                }}
                className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Masuk Pengurus (Input Program)</span>
              </button>

              <button
                onClick={() => {
                  navigateToEntityDetail('lingkungan', authDialogLingkungan.id);
                  setAuthDialogLingkungan(null);
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <span>Lihat Jadwal (Mode Tamu / Umat)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
