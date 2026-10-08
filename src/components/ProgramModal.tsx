import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProgramItem, ProgramKategori, ProgramStatus, EntityType } from '../types';
import { Calendar, Clock, MapPin, User, Phone, DollarSign, Users, Plus, Check, Lock, ShieldCheck } from 'lucide-react';

const KATEGORI_OPTIONS: ProgramKategori[] = [
  'Doa & Ibadat',
  'Rosario / Novena',
  'Pendalaman Iman / Katekese',
  'Sosial & Karitatif',
  'Kerja Bakti & Lingkungan Hidup',
  'Kunjungan Orang Sakit / Lansia',
  'Koor & Liturgi',
  'Pembinaan & Rekoleksi',
  'Kaderisasi & Olahraga',
  'Rapat Pengurus',
];

export const ProgramModal: React.FC = () => {
  const { 
    programModalOpen, 
    editingProgram, 
    closeProgramModal, 
    addProgram, 
    updateProgram,
    lingkunganList,
    kategorialList,
    currentSession,
    selectedEntity 
  } = useApp();

  const isPastorOrAdmin = currentSession?.role === 'pastor_admin';
  const isLingkunganUser = currentSession?.role === 'pengurus_lingkungan';
  const isKategorialUser = currentSession?.role === 'pengurus_kategorial';

  const [entityType, setEntityType] = useState<EntityType>('lingkungan');
  const [entityId, setEntityId] = useState<string>('');
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState<ProgramKategori>('Doa & Ibadat');
  const [tanggal, setTanggal] = useState('');
  const [waktu, setWaktu] = useState('19.30');
  const [lokasi, setLokasi] = useState('');
  const [penanggungJawab, setPenanggungJawab] = useState('');
  const [kontakPJ, setKontakPJ] = useState('');
  const [estimasiPeserta, setEstimasiPeserta] = useState<number | ''>('');
  const [anggaranBiaya, setAnggaranBiaya] = useState<number | ''>('');
  const [status, setStatus] = useState<ProgramStatus>('rencana');
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    if (editingProgram) {
      setEntityType(editingProgram.entityType);
      setEntityId(editingProgram.entityId);
      setNamaKegiatan(editingProgram.namaKegiatan);
      setDeskripsi(editingProgram.deskripsi);
      setKategori(editingProgram.kategori);
      setTanggal(editingProgram.tanggal);
      setWaktu(editingProgram.waktu);
      setLokasi(editingProgram.lokasi);
      setPenanggungJawab(editingProgram.penanggungJawab);
      setKontakPJ(editingProgram.kontakPJ || '');
      setEstimasiPeserta(editingProgram.estimasiPeserta || '');
      setAnggaranBiaya(editingProgram.anggaranBiaya || '');
      setStatus(editingProgram.status);
      setCatatan(editingProgram.catatan || '');
    } else {
      // Determine scoped entity
      let initialType: EntityType = 'lingkungan';
      let initialId = lingkunganList[0]?.id || '';

      if (isLingkunganUser && currentSession?.targetId) {
        // STRICT LOCK to this Lingkungan
        initialType = 'lingkungan';
        initialId = currentSession.targetId;
      } else if (isKategorialUser && currentSession?.targetId) {
        // STRICT LOCK to this Kategorial
        initialType = 'kategorial';
        initialId = currentSession.targetId;
      } else if (selectedEntity) {
        initialType = selectedEntity.type;
        initialId = selectedEntity.id;
      }

      setEntityType(initialType);
      setEntityId(initialId);
      setNamaKegiatan('');
      setDeskripsi('');
      setKategori('Doa & Ibadat');
      const today = new Date().toISOString().split('T')[0];
      setTanggal(today);
      setWaktu('19.30');
      setLokasi('');
      setPenanggungJawab('');
      setKontakPJ('');
      setEstimasiPeserta('');
      setAnggaranBiaya('');
      setStatus('rencana');
      setCatatan('');
    }
  }, [programModalOpen, editingProgram, currentSession, selectedEntity, lingkunganList, kategorialList, isLingkunganUser, isKategorialUser]);

  if (!programModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKegiatan.trim() || !lokasi.trim() || !tanggal || !penanggungJawab.trim()) {
      alert('Mohon lengkapi Nama Kegiatan, Tanggal, Lokasi, dan Penanggung Jawab.');
      return;
    }

    // Enforce entity locking for non-admin users
    let finalEntityType = entityType;
    let finalEntityId = entityId;

    if (!isPastorOrAdmin) {
      if (isLingkunganUser && currentSession?.targetId) {
        finalEntityType = 'lingkungan';
        finalEntityId = currentSession.targetId;
      } else if (isKategorialUser && currentSession?.targetId) {
        finalEntityType = 'kategorial';
        finalEntityId = currentSession.targetId;
      }
    }

    const currentEntityName = finalEntityType === 'lingkungan'
      ? (lingkunganList.find(l => l.id === finalEntityId)?.nama || 'Lingkungan')
      : (kategorialList.find(k => k.id === finalEntityId)?.nama || 'Kategorial');

    const programPayload = {
      entityId: finalEntityId,
      entityType: finalEntityType,
      entityName: currentEntityName,
      namaKegiatan: namaKegiatan.trim(),
      deskripsi: deskripsi.trim() || 'Kegiatan kebersamaan umat Paroki Katedral Medan.',
      kategori,
      tanggal,
      waktu,
      lokasi: lokasi.trim(),
      penanggungJawab: penanggungJawab.trim(),
      kontakPJ: kontakPJ.trim() || undefined,
      estimasiPeserta: typeof estimasiPeserta === 'number' ? estimasiPeserta : undefined,
      anggaranBiaya: typeof anggaranBiaya === 'number' ? anggaranBiaya : undefined,
      status,
      catatan: catatan.trim() || undefined,
    };

    if (editingProgram) {
      updateProgram(editingProgram.id, programPayload);
    } else {
      addProgram(programPayload);
    }
  };

  const selectedEntityObj = entityType === 'lingkungan'
    ? lingkunganList.find(l => l.id === entityId)
    : kategorialList.find(k => k.id === entityId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Formulir Program Kegiatan
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-cathedral mt-0.5">
              {editingProgram ? 'Edit Jadwal Program' : 'Input Program Kegiatan Baru'}
            </h3>
          </div>
          <button
            onClick={closeProgramModal}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          {/* Entity Assignment: Locked if regular pengurus, selectable if Pastor/Admin */}
          {isPastorOrAdmin ? (
            <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Akses Pastor/Admin: Dapat input untuk Lingkungan maupun Kategorial</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Kategori Ranah:
                  </label>
                  <select
                    value={entityType}
                    onChange={(e) => {
                      const newType = e.target.value as EntityType;
                      setEntityType(newType);
                      setEntityId(newType === 'lingkungan' ? (lingkunganList[0]?.id || '') : (kategorialList[0]?.id || ''));
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                  >
                    <option value="lingkungan">14 Lingkungan</option>
                    <option value="kategorial">7 Kategorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Pilih Nama:
                  </label>
                  <select
                    value={entityId}
                    onChange={(e) => setEntityId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                  >
                    {entityType === 'lingkungan'
                      ? lingkunganList.map(l => (
                          <option key={l.id} value={l.id}>
                            {l.kode} - {l.nama}
                          </option>
                        ))
                      : kategorialList.map(k => (
                          <option key={k.id} value={k.id}>
                            {k.kode} - {k.nama}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Scoped User View: strictly locked to their logged-in entity only */
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                    Entitas Pelaksana (Terkunci Sesuai Akun Login):
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-cathedral">
                    {selectedEntityObj?.nama || currentSession?.targetName || 'Komunitas Anda'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white border border-slate-200 rounded">
                {selectedEntityObj?.kode || (isLingkunganUser ? 'Lingkungan' : 'Kategorial')}
              </span>
            </div>
          )}

          {/* Nama Kegiatan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Program / Kegiatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ibadat Rosario Lingkungan Putaran 4 / Pertemuan Mingguan"
              value={namaKegiatan}
              onChange={(e) => setNamaKegiatan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Kategori & Status */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Kegiatan:
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as ProgramKategori)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs"
              >
                {KATEGORI_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Pelaksanaan:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProgramStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold"
              >
                <option value="rencana">Direncanakan</option>
                <option value="berjalan">Sedang Berjalan</option>
                <option value="selesai">Selesai Terlaksana</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          {/* Tanggal & Waktu */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pukul (WIB):
              </label>
              <input
                type="time"
                value={waktu}
                onChange={(e) => setWaktu(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lokasi / Tempat Pelaksanaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rumah Bpk. F. Sihombing / Aula Katedral Lt. 2"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rincian / Keterangan Acara:
            </label>
            <textarea
              rows={2}
              placeholder="Tuliskan tujuan acara, renungan, atau susunan kegiatan..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Penanggung Jawab & Kontak */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Penanggung Jawab (PJ) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nama Pengurus"
                value={penanggungJawab}
                onChange={(e) => setPenanggungJawab(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. HP / WA:
              </label>
              <input
                type="text"
                placeholder="08xx-xxxx-xxxx"
                value={kontakPJ}
                onChange={(e) => setKontakPJ(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Estimasi Peserta & Anggaran */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimasi Peserta (Orang):
              </label>
              <input
                type="number"
                min={0}
                placeholder="Jumlah orang"
                value={estimasiPeserta}
                onChange={(e) => setEstimasiPeserta(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Anggaran Biaya (Rp):
              </label>
              <input
                type="number"
                min={0}
                step={10000}
                placeholder="Biaya (Rp)"
                value={anggaranBiaya}
                onChange={(e) => setAnggaranBiaya(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={closeProgramModal}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingProgram ? 'Simpan Perubahan' : 'Terbitkan Program'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
