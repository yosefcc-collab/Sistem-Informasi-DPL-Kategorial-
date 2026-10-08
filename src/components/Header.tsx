import React from 'react';
import { useApp } from '../context/AppContext';
import { Church, ShieldCheck, UserCheck, LogOut, KeyRound, Sparkles, RefreshCw, Cloud, CloudCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentSession, logout, openAuthModal, resetAllData, isCloudSynced } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border-b border-amber-500/30">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
        {/* Church Emblem & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Church className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] sm:text-xs font-semibold tracking-wider uppercase text-amber-400">
                Keuskupan Agung Medan
              </span>
              {isCloudSynced && (
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Firebase Live</span>
                </span>
              )}
            </div>
            <h1 className="text-xs sm:text-base md:text-lg font-bold tracking-tight text-white line-clamp-1 font-cathedral">
              Katedral SPM Dikandung Tanpa Noda Medan
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-300 hidden md:block">
              Sistem Informasi 14 Lingkungan, 7 Kategorial & Warta Seksi
            </p>
          </div>
        </div>

        {/* User Auth Info & Controls */}
        <div className="flex items-center gap-2">
          {currentSession ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1 justify-end">
                  <UserCheck className="w-3 h-3" /> Terautentikasi
                </span>
                <span className="text-xs font-medium text-slate-200 line-clamp-1 max-w-[170px]">
                  {currentSession.targetName || 'Administrator'}
                </span>
              </div>
              <button
                onClick={logout}
                title="Keluar dari sesi"
                className="flex items-center gap-1.5 text-xs bg-red-950/70 hover:bg-red-900 text-red-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-red-700/50 transition active:scale-95 cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-3 py-1.5 rounded-lg shadow-md transition active:scale-95 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-950" />
              <span>Login Pengurus</span>
            </button>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset data program dan pengumuman ke data awal paroki?')) {
                resetAllData();
              }
            }}
            title="Reset Data Paroki"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition active:scale-95 border border-slate-700/60"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
