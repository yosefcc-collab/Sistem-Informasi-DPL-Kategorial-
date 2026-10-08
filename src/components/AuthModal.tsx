import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, EntityType } from '../types';
import { Lock, Shield, KeyRound, Home, Users, CheckCircle, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    authTarget, 
    closeAuthModal, 
    login, 
    lingkunganList, 
    kategorialList, 
    seksiList,
    navigateToEntityDetail 
  } = useApp();

  const [role, setRole] = useState<UserRole>('pengurus_lingkungan');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (authTarget) {
      setRole(authTarget.role || 'pengurus_lingkungan');
      if (authTarget.targetId) {
        setSelectedTargetId(authTarget.targetId);
      } else {
        if (authTarget.role === 'pengurus_lingkungan') {
          setSelectedTargetId(lingkunganList[0]?.id || '');
        } else if (authTarget.role === 'pengurus_kategorial') {
          setSelectedTargetId(kategorialList[0]?.id || '');
        } else if (authTarget.role === 'pengurus_seksi') {
          setSelectedTargetId(seksiList[0]?.id || '');
        }
      }
    } else {
      setSelectedTargetId(lingkunganList[0]?.id || '');
    }
    setPin('');
    setErrorMessage('');
  }, [authModalOpen, authTarget, lingkunganList, kategorialList, seksiList]);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (role !== 'pastor_admin' && !selectedTargetId) {
      setErrorMessage('Silakan pilih salah satu entitas terlebih dahulu.');
      return;
    }

    if (!pin) {
      setErrorMessage('Masukkan PIN pengurus.');
      return;
    }

    const success = login(role, selectedTargetId, pin);
    if (success) {
      if (authTarget?.callback) {
        authTarget.callback();
      } else if (role === 'pengurus_lingkungan') {
        navigateToEntityDetail('lingkungan', selectedTargetId);
      } else if (role === 'pengurus_kategorial') {
        navigateToEntityDetail('kategorial', selectedTargetId);
      }
      closeAuthModal();
    } else {
      setErrorMessage('PIN salah. Silakan periksa kembali PIN Anda.');
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMessage('');
    if (newRole === 'pengurus_lingkungan') {
      setSelectedTargetId(lingkunganList[0]?.id || '');
    } else if (newRole === 'pengurus_kategorial') {
      setSelectedTargetId(kategorialList[0]?.id || '');
    } else if (newRole === 'pengurus_seksi') {
      setSelectedTargetId(seksiList[0]?.id || '');
    } else {
      setSelectedTargetId('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-cathedral">
                Autentikasi Pengurus Paroki
              </h3>
              <p className="text-xs text-slate-500">
                Pilih peran dan masukkan PIN untuk mengelola program & warta
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRoleChange('pengurus_lingkungan')}
            className={`py-2 px-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              role === 'pengurus_lingkungan'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>14 Lingkungan</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('pengurus_kategorial')}
            className={`py-2 px-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              role === 'pengurus_kategorial'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>7 Kategorial</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('pengurus_seksi')}
            className={`py-2 px-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              role === 'pengurus_seksi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Seksi / DPPH</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('pastor_admin')}
            className={`py-2 px-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              role === 'pastor_admin'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Pastor / Admin</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          {/* Target Entity Selector */}
          {role === 'pengurus_lingkungan' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih dari 14 Lingkungan:
              </label>
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {lingkunganList.map((ling) => (
                  <option key={ling.id} value={ling.id}>
                    {ling.kode} - {ling.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === 'pengurus_kategorial' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih dari 7 Kategorial:
              </label>
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {kategorialList.map((kat) => (
                  <option key={kat.id} value={kat.id}>
                    {kat.kode} - {kat.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === 'pengurus_seksi' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Seksi / DPPH Pelaksana:
              </label>
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {seksiList.map((seksi) => (
                  <option key={seksi.id} value={seksi.id}>
                    {seksi.singkatan} - {seksi.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === 'pastor_admin' && (
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Akses Pastor Paroki & Administrator DPPH:</strong>
              <p className="mt-0.5 text-amber-800">
                Memiliki kewenangan penuh mengawasi dan mengelola seluruh program di 14 Lingkungan, 7 Kategorial, dan Warta Seksi.
              </p>
            </div>
          )}

          {/* PIN Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PIN Keamanan Pengurus:
            </label>
            <input
              type="password"
              placeholder="Masukkan PIN Pengurus"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-widest text-center"
              maxLength={8}
              autoFocus
            />
          </div>

          {errorMessage && (
            <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-medium text-center">
              {errorMessage}
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Verifikasi & Masuk Sesi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
