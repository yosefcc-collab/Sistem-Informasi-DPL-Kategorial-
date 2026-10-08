import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KategorialItem } from '../types';
import { 
  Users, 
  Clock, 
  User, 
  Phone, 
  Calendar, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  Search, 
  Edit,
  Sparkles
} from 'lucide-react';

export const KategorialList: React.FC = () => {
  const { 
    kategorialList, 
    programList, 
    openAuthModal, 
    navigateToEntityDetail,
    hasAccessToEntity,
    isPastorOrAdmin,
    openAdminEditModal
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [authDialogKategorial, setAuthDialogKategorial] = useState<KategorialItem | null>(null);

  const filteredKategorial = kategorialList.filter(item => {
    return (
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bidang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ketua.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCardClick = (kat: KategorialItem) => {
    const isAuthorized = hasAccessToEntity('kategorial', kat.id);
    if (isAuthorized) {
      navigateToEntityDetail('kategorial', kat.id);
    } else {
      setAuthDialogKategorial(kat);
    }
  };

  const isAdmin = isPastorOrAdmin();

  return (
    <div className="space-y-3.5 pb-20 md:pb-10">
      {/* Header Banner - Compact */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 rounded-xl p-3.5 sm:p-5 text-white shadow-md border border-indigo-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.2 rounded bg-indigo-700/60 text-indigo-200 text-[10px] font-medium mb-1">
              <Users className="w-3 h-3 text-indigo-300" />
              <span>Kategorial & Komunitas Rohani</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-cathedral">
              7 Kategorial Paroki Katedral Medan
            </h2>
            <p className="text-[11px] sm:text-xs text-indigo-100/90 mt-0.5 max-w-xl line-clamp-2">
              Wadah kerasulan awam, devosi khusus, pembinaan pemuda, anak misioner, dan altar katedral.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-indigo-950/70 px-2.5 py-1.5 rounded-lg border border-indigo-700/50">
            <Lock className="w-3.5 h-3.5 text-indigo-300" />
            <div className="text-[10px] text-indigo-200 font-semibold">
              Autentikasi Pengurus
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notice Banner if Pastor/Admin */}
      {isAdmin && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-slate-800 font-semibold text-[11px] sm:text-xs">
              Mode Pastor / Admin Aktif: Anda dapat menginput dan mengubah nama pengurus di setiap kategorial.
            </span>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari kategorial (Legio Maria, OMK, SEKAMI, Kerahiman, PSSC, Misdinar)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

      {/* Kategorial Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredKategorial.map((kat) => {
          const programs = programList.filter(
            p => p.entityType === 'kategorial' && p.entityId === kat.id
          );
          const activeProgramsCount = programs.filter(p => p.status === 'rencana' || p.status === 'berjalan').length;
          const isAuthorized = hasAccessToEntity('kategorial', kat.id);

          return (
            <div
              key={kat.id}
              className={`bg-white rounded-xl p-3.5 border transition-all hover:shadow-md flex flex-col justify-between ${
                isAuthorized
                  ? 'border-indigo-400 ring-1 ring-indigo-500/20 bg-indigo-50/5'
                  : 'border-slate-200 hover:border-indigo-400'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded font-mono">
                    {kat.kode}
                  </span>

                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAdminEditModal('kategorial', kat.id);
                        }}
                        title="Edit Nama Pengurus"
                        className="p-1 text-slate-500 hover:text-indigo-800 bg-slate-100 hover:bg-indigo-100 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3 text-indigo-700" />
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
                  onClick={() => handleCardClick(kat)}
                  className="text-sm font-bold text-slate-900 font-cathedral mb-1 leading-snug cursor-pointer hover:text-indigo-800"
                >
                  {kat.nama}
                </h3>

                {/* Bidang */}
                <div className="inline-block px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-medium mb-2">
                  {kat.bidang}
                </div>

                {/* Details */}
                <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2.5">
                  <div className="flex items-center gap-1 min-w-0">
                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">
                      <strong>Ketua:</strong> {kat.ketua ? kat.ketua : <em className="text-slate-400">Belum diisi</em>}
                    </span>
                  </div>
                  {kat.pendamping && (
                    <div className="text-[10px] text-slate-500 pl-4 line-clamp-1">
                      Pendamping: {kat.pendamping}
                    </div>
                  )}
                  {kat.jadwalRutin && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span className="line-clamp-1">{kat.jadwalRutin}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <Calendar className="w-3 h-3 text-indigo-600" />
                  <span>
                    <strong className="text-slate-900">{activeProgramsCount}</strong> Kegiatan
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCardClick(kat)}
                  className="inline-flex items-center gap-0.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                >
                  <span>{isAuthorized ? 'Buka Detail' : 'Masuk Menu'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Authentication Prompt Dialog When Clicking a Kategorial */}
      {authDialogKategorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-indigo-800 uppercase tracking-wider block">
                    Autentikasi Pengurus
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-cathedral">
                    {authDialogKategorial.nama}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setAuthDialogKategorial(null)}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-snug">
              Untuk menginput atau mengelola data program kegiatan <strong>{authDialogKategorial.nama}</strong>, silakan login dengan PIN Pengurus.
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  openAuthModal({
                    role: 'pengurus_kategorial',
                    targetId: authDialogKategorial.id,
                    targetName: authDialogKategorial.nama,
                    targetType: 'kategorial',
                  });
                  setAuthDialogKategorial(null);
                }}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white font-semibold rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Masuk Pengurus (Input Program)</span>
              </button>

              <button
                onClick={() => {
                  navigateToEntityDetail('kategorial', authDialogKategorial.id);
                  setAuthDialogKategorial(null);
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
