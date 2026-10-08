export type EntityType = 'lingkungan' | 'kategorial';

export type ProgramStatus = 'rencana' | 'berjalan' | 'selesai' | 'dibatalkan';

export type ProgramKategori = 
  | 'Doa & Ibadat' 
  | 'Rosario / Novena' 
  | 'Pendalaman Iman / Katekese' 
  | 'Sosial & Karitatif' 
  | 'Kerja Bakti & Lingkungan Hidup' 
  | 'Kunjungan Orang Sakit / Lansia' 
  | 'Koor & Liturgi' 
  | 'Pembinaan & Rekoleksi' 
  | 'Kaderisasi & Olahraga' 
  | 'Rapat Pengurus';

export interface ProgramItem {
  id: string;
  entityId: string;
  entityType: EntityType;
  entityName: string;
  namaKegiatan: string;
  deskripsi: string;
  kategori: ProgramKategori;
  tanggal: string; // YYYY-MM-DD
  waktu: string; // HH:mm
  lokasi: string;
  penanggungJawab: string;
  kontakPJ?: string;
  estimasiPeserta?: number;
  anggaranBiaya?: number;
  status: ProgramStatus;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LingkunganItem {
  id: string;
  kode: string;
  nama: string;
  wilayah: string;
  ketuaLingkungan: string;
  kontak: string;
  jumlahKk: number;
  jumlahJiwa: number;
  pin: string;
  deskripsi: string;
  iconName?: string;
}

export interface KategorialItem {
  id: string;
  kode: string;
  nama: string;
  bidang: string;
  ketua: string;
  pendamping: string;
  kontak: string;
  jadwalRutin: string;
  pin: string;
  deskripsi: string;
}

export type SeksiId = 
  | 'dpph'
  | 'seksi_keamanan'
  | 'seksi_umum'
  | 'seksi_komsos'
  | 'seksi_kepemudaan'
  | 'seksi_hak'
  | 'seksi_pse'
  | 'seksi_kerasulan_keluarga'
  | 'seksi_kki'
  | 'seksi_evangelisasi'
  | 'seksi_pendidikan'
  | 'seksi_kks'
  | 'seksi_liturgi'
  | 'seksi_katekese'
  | 'plbks';

export interface SeksiItem {
  id: SeksiId;
  nama: string;
  singkatan: string;
  ketuaSeksi: string;
  deskripsi: string;
  pin: string;
  badgeColor: string;
}

export type PengumumanPrioritas = 'biasa' | 'penting' | 'mendesak';

export interface PengumumanItem {
  id: string;
  seksiId: SeksiId;
  seksiNama: string;
  judul: string;
  ringkasan: string;
  isiLengkap: string;
  tanggalMulai: string;
  tanggalSelesai?: string;
  prioritas: PengumumanPrioritas;
  penanggungJawab: string;
  kontak?: string;
  lampiranInfo?: string;
  gambarUrl?: string;
  targetAudiens?: string;
  isPublished: boolean;
  createdAt: string;
}

export type UserRole = 'tamu' | 'pengurus_lingkungan' | 'pengurus_kategorial' | 'pengurus_seksi' | 'pastor_admin';

export interface UserSession {
  role: UserRole;
  targetId?: string; // id of lingkungan, kategorial, or seksi
  targetName?: string;
  authenticatedAt?: string;
}
