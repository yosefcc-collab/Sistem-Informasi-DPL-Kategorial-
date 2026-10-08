import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SeksiItem, SeksiId } from '../types';
import { 
  Shield, 
  Lock, 
  Plus, 
  Megaphone, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Search,
  KeyRound,
  FileText
} from 'lucide-react';

export const SeksiPortal: React.FC = () => {
  const { 
    seksiList, 
    pengumumanList, 
    currentSession, 
    openAuthModal, 
    openPengumumanModal,
    hasAccessToSeksi,
    setActiveView 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredSeksi = seksiList.filter(s => {
    return (
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.singkatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ketuaSeksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSeksiAction = (seksi: SeksiItem) => {
    if (hasAccessToSeksi(seksi.id)) {
      openPengumumanModal();
    } else {
      openAuthModal({
        role: 'pengurus_seksi',
        targetId: seksi.id,
        targetName: seksi.nama,
        targetType: 'seksi',
        callback: () => {
          openPengumumanModal();
        },
      });
    }
  };

  return (
    <div className="space-y-3.5 pb-20 md:pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-3.5 sm:p-5 text-white shadow-md border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-medium mb-1">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>DPPH & 14 Seksi Paroki</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-cathedral">
              Portal Pengurus Seksi & Warta Paroki
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 max-w-xl line-clamp-2">
              Autentikasi PIN diperlukan bagi pengurus Seksi untuk mempublikasikan warta ke Beranda Paroki.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <div className="text-[10px] text-slate-200 font-semibold">
              Autentikasi Pengurus Seksi
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari Seksi (DPPH, Liturgi, Keamanan, Komsos, Kepemudaan, PSE, KKI, PLBKS, dll)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Seksi Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSeksi.map((seksi) => {
          const isAuthorized = hasAccessToSeksi(seksi.id);
          const pengumumanCount = pengumumanList.filter(p => p.seksiId === seksi.id).length;

          return (
            <div
              key={seksi.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all hover:shadow-md flex flex-col justify-between ${
                isAuthorized
                  ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${seksi.badgeColor}`}>
                    {seksi.singkatan}
                  </span>

                  {isAuthorized ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Login Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Perlu PIN
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 font-cathedral mb-1 leading-snug">
                  {seksi.nama}
                </h3>

                <div className="text-xs text-slate-600 flex items-center gap-1.5 mb-2.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>Penanggung Jawab:</strong> {seksi.ketuaSeksi}</span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {seksi.deskripsi}
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                  <span>{pengumumanCount} Warta Aktif</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSeksiAction(seksi)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer ${
                    isAuthorized
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isAuthorized ? (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Buat Warta</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Login & Buat Warta</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
