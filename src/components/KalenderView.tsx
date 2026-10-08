import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProgramItem } from '../types';
import { Calendar, Clock, MapPin, Tag, Filter, User, ChevronRight, Home, Users } from 'lucide-react';

export const KalenderView: React.FC = () => {
  const { programList, navigateToEntityDetail } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'lingkungan' | 'kategorial'>('all');

  // Sort programs by date ascending
  const sortedPrograms = [...programList].sort((a, b) => {
    return new Date(a.tanggal + 'T' + (a.waktu || '00:00')).getTime() - new Date(b.tanggal + 'T' + (b.waktu || '00:00')).getTime();
  });

  const filteredPrograms = sortedPrograms.filter(p => {
    if (filterType === 'all') return true;
    return p.entityType === filterType;
  });

  // Group programs by Date
  const groupedByDate: { [dateStr: string]: ProgramItem[] } = {};
  filteredPrograms.forEach(p => {
    if (!groupedByDate[p.tanggal]) {
      groupedByDate[p.tanggal] = [];
    }
    groupedByDate[p.tanggal].push(p);
  });

  const dateKeys = Object.keys(groupedByDate).sort();

  return (
    <div className="space-y-3.5 pb-20 md:pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-3.5 sm:p-5 text-white shadow-md border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-medium mb-1">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>Agenda Paroki Katedral Medan</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-cathedral">
              Kalender Kegiatan Bersama
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 max-w-xl line-clamp-2">
              Jadwal ibadat rosario, misa lingkungan, dan kegiatan kategorial se-Paroki.
            </p>
          </div>

          {/* Quick Filter */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700 text-xs self-start sm:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                filterType === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('lingkungan')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                filterType === 'lingkungan' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lingkungan
            </button>
            <button
              onClick={() => setFilterType('kategorial')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                filterType === 'kategorial' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Kategorial
            </button>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      {dateKeys.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Belum ada agenda jadwal terdaftar</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dateKeys.map((dateStr) => {
            const dateObj = new Date(dateStr + 'T00:00:00');
            const items = groupedByDate[dateStr];

            return (
              <div key={dateStr} className="space-y-3">
                {/* Date Header Badge */}
                <div className="sticky top-16 z-20 flex items-center gap-2 bg-slate-50/95 backdrop-blur-xs py-1.5">
                  <div className="px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg text-xs font-bold shadow-xs">
                    {dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-[11px] text-slate-500 font-medium">{items.length} Agenda</span>
                </div>

                {/* Day's Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2 sm:pl-3 border-l-2 border-amber-300/60 ml-2 sm:ml-4">
                  {items.map((prog) => {
                    return (
                      <div
                        key={prog.id}
                        className="bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            prog.entityType === 'lingkungan'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                          }`}>
                            {prog.entityType === 'lingkungan' ? <Home className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                            <span>{prog.entityName}</span>
                          </span>

                          <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{prog.waktu} WIB</span>
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {prog.namaKegiatan}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {prog.deskripsi}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-1 text-[11px] text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span className="line-clamp-1">{prog.lokasi}</span>
                          </div>

                          <button
                            onClick={() => navigateToEntityDetail(prog.entityType, prog.entityId)}
                            className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Lihat Detail</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
