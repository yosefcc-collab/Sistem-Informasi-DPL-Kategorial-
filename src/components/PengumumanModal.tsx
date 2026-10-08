import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PengumumanItem, SeksiId, PengumumanPrioritas } from '../types';
import { Megaphone, Calendar, User, Phone, Check, Image as ImageIcon, Upload, X, ShieldCheck, Lock } from 'lucide-react';

export const PengumumanModal: React.FC = () => {
  const { 
    pengumumanModalOpen, 
    editingPengumuman, 
    closePengumumanModal, 
    addPengumuman, 
    updatePengumuman, 
    seksiList, 
    currentSession 
  } = useApp();

  const isPastorOrAdmin = currentSession?.role === 'pastor_admin';

  const [seksiId, setSeksiId] = useState<SeksiId>('dpph');
  const [judul, setJudul] = useState('');
  const [ringkasan, setRingkasan] = useState('');
  const [isiLengkap, setIsiLengkap] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [prioritas, setPrioritas] = useState<PengumumanPrioritas>('biasa');
  const [penanggungJawab, setPenanggungJawab] = useState('');
  const [kontak, setKontak] = useState('');
  const [targetAudiens, setTargetAudiens] = useState('Seluruh Umat Paroki Katedral');
  const [lampiranInfo, setLampiranInfo] = useState('');
  const [gambarUrl, setGambarUrl] = useState<string>('');

  useEffect(() => {
    if (editingPengumuman) {
      setSeksiId(editingPengumuman.seksiId);
      setJudul(editingPengumuman.judul);
      setRingkasan(editingPengumuman.ringkasan);
      setIsiLengkap(editingPengumuman.isiLengkap);
      setTanggalMulai(editingPengumuman.tanggalMulai);
      setTanggalSelesai(editingPengumuman.tanggalSelesai || '');
      setPrioritas(editingPengumuman.prioritas);
      setPenanggungJawab(editingPengumuman.penanggungJawab);
      setKontak(editingPengumuman.kontak || '');
      setTargetAudiens(editingPengumuman.targetAudiens || 'Seluruh Umat Paroki Katedral');
      setLampiranInfo(editingPengumuman.lampiranInfo || '');
      setGambarUrl(editingPengumuman.gambarUrl || '');
    } else {
      let defaultSeksi: SeksiId = 'dpph';
      if (currentSession?.role === 'pengurus_seksi' && currentSession.targetId) {
        defaultSeksi = currentSession.targetId as SeksiId;
      }
      setSeksiId(defaultSeksi);
      setJudul('');
      setRingkasan('');
      setIsiLengkap('');
      const today = new Date().toISOString().split('T')[0];
      setTanggalMulai(today);
      setTanggalSelesai('');
      setPrioritas('biasa');
      const seksiObj = seksiList.find(s => s.id === defaultSeksi);
      setPenanggungJawab(seksiObj?.ketuaSeksi || '');
      setKontak('');
      setTargetAudiens('Seluruh Umat Paroki Katedral');
      setLampiranInfo('');
      setGambarUrl('');
    }
  }, [pengumumanModalOpen, editingPengumuman, currentSession, seksiList]);

  if (!pengumumanModalOpen) return null;

  // Handle image upload from device
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setGambarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isiLengkap.trim() || !penanggungJawab.trim()) {
      alert('Mohon isi Judul Pengumuman, Isi Lengkap, dan Penanggung Jawab.');
      return;
    }

    // Determine final seksi
    let finalSeksiId = seksiId;
    if (!isPastorOrAdmin && currentSession?.role === 'pengurus_seksi' && currentSession.targetId) {
      finalSeksiId = currentSession.targetId as SeksiId;
    }

    const seksi = seksiList.find(s => s.id === finalSeksiId);

    const payload = {
      seksiId: finalSeksiId,
      seksiNama: seksi?.nama || 'Seksi Paroki',
      judul: judul.trim(),
      ringkasan: ringkasan.trim() || judul.trim(),
      isiLengkap: isiLengkap.trim(),
      tanggalMulai,
      tanggalSelesai: tanggalSelesai || undefined,
      prioritas,
      penanggungJawab: penanggungJawab.trim(),
      kontak: kontak.trim() || undefined,
      targetAudiens: targetAudiens.trim() || undefined,
      lampiranInfo: lampiranInfo.trim() || undefined,
      gambarUrl: gambarUrl.trim() || undefined,
      isPublished: true,
    };

    if (editingPengumuman) {
      updatePengumuman(editingPengumuman.id, payload);
    } else {
      addPengumuman(payload);
    }
  };

  const currentSeksiObj = seksiList.find(s => s.id === seksiId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Publikasi Warta Resmi Paroki
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-cathedral">
                {editingPengumuman ? 'Edit Pengumuman Seksi' : 'Buat Pengumuman Seksi Baru'}
              </h3>
            </div>
          </div>
          <button
            onClick={closePengumumanModal}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          {/* Seksi & Prioritas: If Pastor/Admin can choose any seksi; if Pengurus Seksi locked */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Seksi / Bidang:
              </label>
              {isPastorOrAdmin ? (
                <select
                  value={seksiId}
                  onChange={(e) => {
                    const newId = e.target.value as SeksiId;
                    setSeksiId(newId);
                    const seksiObj = seksiList.find(s => s.id === newId);
                    if (seksiObj) {
                      setPenanggungJawab(seksiObj.ketuaSeksi);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                >
                  {seksiList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.singkatan} - {s.nama}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span className="line-clamp-1">{currentSeksiObj?.singkatan} - {currentSeksiObj?.nama}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat Urgensi:
              </label>
              <select
                value={prioritas}
                onChange={(e) => setPrioritas(e.target.value as PengumumanPrioritas)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
              >
                <option value="biasa">Warta Biasa</option>
                <option value="penting">Penting / Perhatian</option>
                <option value="mendesak">Mendesak / Segera</option>
              </select>
            </div>
          </div>

          {/* Judul */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Pengumuman <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Jadwal Misa Khusus & Petunjuk Perayaan"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Picture / Foto Banner Warta (Requested feature!) */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Gambar / Foto Warta (Picture):
            </label>

            {gambarUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center">
                <img
                  src={gambarUrl}
                  alt="Preview Warta"
                  className="max-h-48 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setGambarUrl('')}
                  className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md cursor-pointer"
                  title="Hapus Gambar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-3 cursor-pointer bg-white transition group">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-amber-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-700">
                    Unggah Gambar dari Perangkat / Kamera
                  </span>
                  <span className="text-[10px] text-slate-400">
                    JPG, PNG, WebP (Maks 3MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Atau URL:</span>
                  <input
                    type="url"
                    placeholder="https://contoh-link-gambar.jpg"
                    value={gambarUrl}
                    onChange={(e) => setGambarUrl(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ringkasan Singkat */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ringkasan Singkat (Tampilan Kartu Beranda):
            </label>
            <input
              type="text"
              placeholder="Ringkasan 1-2 kalimat untuk preview di beranda..."
              value={ringkasan}
              onChange={(e) => setRingkasan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Isi Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Isi Lengkap Warta / Instruksi <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Tuliskan tanggal, waktu, persyaratan, dan rincian lengkap pengumuman seksi..."
              value={isiLengkap}
              onChange={(e) => setIsiLengkap(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Tanggal Mulai & Tanggal Selesai */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Mulai Berlaku:
              </label>
              <input
                type="date"
                required
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Berlaku Sampai (Opsional):
              </label>
              <input
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>

          {/* Penanggung Jawab & Kontak */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Penanggung Jawab:
              </label>
              <input
                type="text"
                required
                value={penanggungJawab}
                onChange={(e) => setPenanggungJawab(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Telepon / WA:
              </label>
              <input
                type="text"
                placeholder="0812-xxxx-xxxx"
                value={kontak}
                onChange={(e) => setKontak(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={closePengumumanModal}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingPengumuman ? 'Simpan Warta' : 'Publikasikan ke Dashboard'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
