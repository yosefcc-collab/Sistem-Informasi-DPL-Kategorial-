import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProgramItem, ProgramStatus, ProgramKategori } from '../types';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Lock, 
  ShieldCheck, 
  Printer, 
  Search, 
  DollarSign, 
  Users, 
  FileText,
  Tag,
  Home,
  Edit,
  Sparkles
} from 'lucide-react';

export const EntityDetailView: React.FC = () => {
  const { 
    selectedEntity, 
    returnToListView, 
    lingkunganList, 
    kategorialList, 
    programList, 
    hasAccessToEntity, 
    openAuthModal, 
    openProgramModal, 
    deleteProgram, 
    updateProgram,
    isPastorOrAdmin,
    openAdminEditModal
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [kategoriFilter, setKategoriFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<ProgramItem | null>(null);

  if (!selectedEntity) {
    return null;
  }

  const { type, id } = selectedEntity;
  const isLingkungan = type === 'lingkungan';

  const entityData = isLingkungan 
    ? lingkunganList.find(l => l.id === id) 
    : kategorialList.find(k => k.id === id);

  if (!entityData) {
    return (
      <div className="p-6 text-center bg-white rounded-xl shadow-xs">
        <p className="text-slate-600 text-xs sm:text-sm">Data tidak ditemukan.</p>
        <button
          onClick={returnToListView}
          className="mt-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs"
        >
          Kembali
        </button>
      </div>
    );
  }

  const isAuthorized = hasAccessToEntity(type, id);
  const isAdmin = isPastorOrAdmin();

  // Programs for this specific entity
  const entityPrograms = programList.filter(
    p => p.entityType === type && p.entityId === id
  );

  const filteredPrograms = entityPrograms.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesKategori = kategoriFilter === 'all' || p.kategori === kategoriFilter;
    const matchesSearch = 
      p.namaKegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesKategori && matchesSearch;
  });

  const getStatusBadge = (status: ProgramStatus) => {
    switch (status) {
      case 'rencana':
        return <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">Rencana</span>;
      case 'berjalan':
        return <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 animate-pulse">Berjalan</span>;
      case 'selesai':
        return <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Selesai</span>;
      case 'dibatalkan':
        return <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800">Batal</span>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const ketuaName = isLingkungan 
    ? (entityData as any).ketuaLingkungan 
    : (entityData as any).ketua;

  return (
    <div className="space-y-3.5 pb-20 md:pb-10 animate-in fade-in duration-200">
      {/* Top Navigation & Return */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={returnToListView}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cetak Agenda</span>
        </button>
      </div>

      {/* Entity Profile Banner - Compact */}
      <div className={`rounded-xl p-3.5 sm:p-5 text-white shadow-md border ${
        isLingkungan 
          ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 border-amber-500/30'
          : 'bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 border-indigo-500/30'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                isLingkungan ? 'bg-amber-400 text-slate-950' : 'bg-indigo-400 text-slate-950'
              }`}>
                {entityData.kode}
              </span>
              <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                {isLingkungan ? 'Lingkungan Paroki' : 'Kelompok Kategorial'}
              </span>
            </div>

            <h2 className="text-base sm:text-xl font-bold font-cathedral">
              {entityData.nama}
            </h2>

            {isLingkungan ? (
              <p className="text-[11px] text-amber-100 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Wilayah: {(entityData as any).wilayah || 'Belum diisi'}</span>
              </p>
            ) : (
              <p className="text-[11px] text-indigo-100 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-300 shrink-0" />
                <span>Jadwal: {(entityData as any).jadwalRutin || 'Belum diisi'}</span>
              </p>
            )}
          </div>

          {/* Pengurus Contact & Stats Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/15 text-[11px] space-y-1 shrink-0 sm:min-w-[190px]">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-300">
              <span>Pengurus</span>
              {isAdmin && (
                <button
                  onClick={() => openAdminEditModal(type, id)}
                  className="text-amber-300 hover:text-white underline text-[9px] flex items-center gap-0.5 cursor-pointer"
                >
                  <Edit className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            <div>
              <span className="text-slate-300 text-[10px]">Ketua: </span>
              <strong className="text-white">
                {ketuaName ? ketuaName : <em className="text-amber-200">Belum diinput</em>}
              </strong>
            </div>
            {entityData.kontak && (
              <div>
                <span className="text-slate-300 text-[10px]">Kontak: </span>
                <span className="font-mono text-white text-[10px]">{entityData.kontak}</span>
              </div>
            )}
            {isLingkungan && (
              <div className="pt-1 border-t border-white/10 flex justify-between gap-2 text-[10px] text-slate-200">
                <span>KK: <strong>{(entityData as any).jumlahKk}</strong></span>
                <span>Jiwa: <strong>{(entityData as any).jumlahJiwa}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Authorization Alert Banner */}
      {isAuthorized ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-emerald-900 font-semibold text-[11px] sm:text-xs">
              Akses Pengurus Aktif: Anda dapat menambah & mengedit kegiatan.
            </span>
          </div>

          <button
            onClick={() => openProgramModal()}
            className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Program</span>
          </button>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="text-amber-900 font-semibold text-[11px] sm:text-xs">
              Mode Tamu (Hanya Lihat). Untuk input data program, masuk dengan PIN.
            </span>
          </div>

          <button
            onClick={() => {
              openAuthModal({
                role: isLingkungan ? 'pengurus_lingkungan' : 'pengurus_kategorial',
                targetId: entityData.id,
                targetName: entityData.nama,
                targetType: type,
              });
            }}
            className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs transition active:scale-95 cursor-pointer shrink-0"
          >
            <Lock className="w-3 h-3" />
            <span>Login Pengurus</span>
          </button>
        </div>
      )}

      {/* Program Management & Filter Section */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-cathedral">
              Daftar Program & Kegiatan ({entityPrograms.length})
            </h3>
            <p className="text-[10px] text-slate-500">
              Agenda ibadat, karitatif, katekese, dan pertemuan
            </p>
          </div>

          {isAuthorized && (
            <button
              onClick={() => openProgramModal()}
              className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs cursor-pointer"
            >
              <Plus className="w-3 h-3 text-amber-400" />
              <span>Input Program</span>
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Status</option>
            <option value="rencana">Direncanakan</option>
            <option value="berjalan">Sedang Berjalan</option>
            <option value="selesai">Selesai</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>

          {/* Kategori Filter */}
          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="Doa & Ibadat">Doa & Ibadat</option>
            <option value="Rosario / Novena">Rosario / Novena</option>
            <option value="Pendalaman Iman / Katekese">Pendalaman Iman / Katekese</option>
            <option value="Sosial & Karitatif">Sosial & Karitatif</option>
            <option value="Kerja Bakti & Lingkungan Hidup">Kerja Bakti & Lingkungan</option>
            <option value="Kunjungan Orang Sakit / Lansia">Kunjungan Lansia & Sakit</option>
            <option value="Koor & Liturgi">Koor & Liturgi</option>
            <option value="Pembinaan & Rekoleksi">Pembinaan & Rekoleksi</option>
            <option value="Kaderisasi & Olahraga">Kaderisasi & Olahraga</option>
            <option value="Rapat Pengurus">Rapat Pengurus</option>
          </select>
        </div>

        {/* Programs List */}
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1.5">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-semibold text-slate-700">
              Belum ada program kegiatan yang diinput
            </h4>
            <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
              {isAuthorized 
                ? 'Klik tombol "Tambah Program" di atas untuk memasukkan jadwal kegiatan pertama.'
                : 'Data saat ini masih 0. Jadwal akan ditampilkan setelah pengurus menginput data.'}
            </p>
            {isAuthorized && (
              <button
                onClick={() => openProgramModal()}
                className="mt-1 inline-flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Input Jadwal Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredPrograms.map((program) => {
              return (
                <div
                  key={program.id}
                  className="bg-white rounded-xl p-3 border border-slate-200 hover:border-slate-300 shadow-xs transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        {getStatusBadge(program.status)}
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {program.kategori}
                        </span>
                      </div>
                      <h4 
                        onClick={() => setSelectedProgramDetail(program)}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-800 transition cursor-pointer"
                      >
                        {program.namaKegiatan}
                      </h4>
                    </div>

                    {isAuthorized && (
                      <div className="flex items-center gap-1">
                        <select
                          value={program.status}
                          onChange={(e) => updateProgram(program.id, { status: e.target.value as ProgramStatus })}
                          className="text-[10px] font-medium bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700"
                        >
                          <option value="rencana">Rencana</option>
                          <option value="berjalan">Berjalan</option>
                          <option value="selesai">Selesai</option>
                          <option value="dibatalkan">Batal</option>
                        </select>

                        <button
                          onClick={() => openProgramModal(program)}
                          title="Edit"
                          className="p-1 text-slate-400 hover:text-blue-600 bg-slate-50 rounded border border-slate-200"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus kegiatan "${program.namaKegiatan}"?`)) {
                              deleteProgram(program.id);
                            }
                          }}
                          title="Hapus"
                          className="p-1 text-slate-400 hover:text-red-600 bg-slate-50 rounded border border-slate-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                    {program.deskripsi}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10px] text-slate-600 pt-1.5 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{new Date(program.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {program.waktu} WIB</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                      <span className="line-clamp-1">{program.lokasi}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span className="line-clamp-1">PJ: {program.penanggungJawab}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Program Detail Popup Modal */}
      {selectedProgramDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  {getStatusBadge(selectedProgramDetail.status)}
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                    {selectedProgramDetail.kategori}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-cathedral">
                  {selectedProgramDetail.namaKegiatan}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProgramDetail(null)}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>{selectedProgramDetail.deskripsi}</p>
              {selectedProgramDetail.catatan && (
                <div className="pt-1.5 border-t border-slate-200 text-[11px] text-slate-500 italic">
                  <strong>Catatan:</strong> {selectedProgramDetail.catatan}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {new Date(selectedProgramDetail.tanggal).toLocaleDateString('id-ID', { dateStyle: 'full' })} ({selectedProgramDetail.waktu} WIB)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>{selectedProgramDetail.lokasi}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>PJ: {selectedProgramDetail.penanggungJawab}</span>
              </div>
              {selectedProgramDetail.kontakPJ && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono">{selectedProgramDetail.kontakPJ}</span>
                </div>
              )}
              {selectedProgramDetail.estimasiPeserta && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Estimasi: {selectedProgramDetail.estimasiPeserta} Orang</span>
                </div>
              )}
              {selectedProgramDetail.anggaranBiaya && (
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                  <span>Anggaran: Rp {selectedProgramDetail.anggaranBiaya.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSelectedProgramDetail(null)}
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
