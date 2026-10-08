import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, Phone, MapPin, Check, Lock, Home, Users } from 'lucide-react';

export const AdminPengurusModal: React.FC = () => {
  const { 
    adminEditModalOpen, 
    adminEditTarget, 
    closeAdminEditModal, 
    lingkunganList, 
    kategorialList, 
    updateLingkungan, 
    updateKategorial 
  } = useApp();

  const [ketua, setKetua] = useState('');
  const [kontak, setKontak] = useState('');
  const [wilayahOrJadwal, setWilayahOrJadwal] = useState('');
  const [pendamping, setPendamping] = useState('');
  const [jumlahKk, setJumlahKk] = useState<number | ''>('');
  const [jumlahJiwa, setJumlahJiwa] = useState<number | ''>('');
  const [pin, setPin] = useState('1234');

  const isLingkungan = adminEditTarget?.type === 'lingkungan';
  const targetItem = isLingkungan 
    ? lingkunganList.find(l => l.id === adminEditTarget?.id)
    : kategorialList.find(k => k.id === adminEditTarget?.id);

  useEffect(() => {
    if (targetItem) {
      if (isLingkungan) {
        const ling = targetItem as any;
        setKetua(ling.ketuaLingkungan || '');
        setKontak(ling.kontak || '');
        setWilayahOrJadwal(ling.wilayah || '');
        setJumlahKk(ling.jumlahKk || 0);
        setJumlahJiwa(ling.jumlahJiwa || 0);
        setPin(ling.pin || '1234');
      } else {
        const kat = targetItem as any;
        setKetua(kat.ketua || '');
        setKontak(kat.kontak || '');
        setWilayahOrJadwal(kat.jadwalRutin || '');
        setPendamping(kat.pendamping || '');
        setPin(kat.pin || '1234');
      }
    }
  }, [adminEditModalOpen, adminEditTarget, targetItem, isLingkungan]);

  if (!adminEditModalOpen || !targetItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLingkungan) {
      updateLingkungan(targetItem.id, {
        ketuaLingkungan: ketua.trim(),
        kontak: kontak.trim(),
        wilayah: wilayahOrJadwal.trim(),
        jumlahKk: typeof jumlahKk === 'number' ? jumlahKk : 0,
        jumlahJiwa: typeof jumlahJiwa === 'number' ? jumlahJiwa : 0,
        pin: pin.trim() || '1234',
      });
    } else {
      updateKategorial(targetItem.id, {
        ketua: ketua.trim(),
        kontak: kontak.trim(),
        jadwalRutin: wilayahOrJadwal.trim(),
        pendamping: pendamping.trim(),
        pin: pin.trim() || '1234',
      });
    }
    closeAdminEditModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Portal Pastor Paroki / Admin
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-cathedral">
                Input & Edit Pengurus
              </h3>
            </div>
          </div>
          <button
            onClick={closeAdminEditModal}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Selected Entity Title */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLingkungan ? <Home className="w-4 h-4 text-amber-700" /> : <Users className="w-4 h-4 text-indigo-700" />}
            <span className="text-xs font-bold text-slate-800 font-cathedral">
              {targetItem.nama}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
            {targetItem.kode}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          {/* Nama Ketua / Pengurus */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Ketua / Pengurus <span className="text-red-500">*</span>:
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder={isLingkungan ? "Contoh: Bpk. F. Sihombing" : "Contoh: Gabriel Kevin / Sr. Maria Goretti"}
                value={ketua}
                onChange={(e) => setKetua(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* No Kontak / HP */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Kontak / WhatsApp:
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="0812-xxxx-xxxx"
                value={kontak}
                onChange={(e) => setKontak(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm font-mono"
              />
            </div>
          </div>

          {/* Wilayah (Lingkungan) or Jadwal (Kategorial) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isLingkungan ? 'Cakupan Wilayah / Jalan:' : 'Jadwal Pertemuan / Pertemuan Rutin:'}
            </label>
            <input
              type="text"
              placeholder={isLingkungan ? "Contoh: Jl. Sukaraja & Brigjen Katamso" : "Contoh: Setiap Sabtu Pkl 19.30 WIB"}
              value={wilayahOrJadwal}
              onChange={(e) => setWilayahOrJadwal(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
            />
          </div>

          {/* Pendamping for Kategorial */}
          {!isLingkungan && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pastor / Suster / Frater Pendamping:
              </label>
              <input
                type="text"
                placeholder="Contoh: Pastor Moderator / Sr. Pembina"
                value={pendamping}
                onChange={(e) => setPendamping(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>
          )}

          {/* Jumlah KK & Jiwa for Lingkungan */}
          {isLingkungan && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah KK (Keluarga):
                </label>
                <input
                  type="number"
                  min={0}
                  value={jumlahKk}
                  onChange={(e) => setJumlahKk(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah Jiwa:
                </label>
                <input
                  type="number"
                  min={0}
                  value={jumlahJiwa}
                  onChange={(e) => setJumlahJiwa(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>
            </div>
          )}

          {/* PIN Keamanan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PIN Akses Pengurus:
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-mono tracking-widest"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={closeAdminEditModal}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Nama Pengurus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
