import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LingkunganItem, 
  KategorialItem, 
  SeksiItem, 
  PengumumanItem, 
  ProgramItem, 
  UserSession, 
  UserRole, 
  EntityType 
} from '../types';
import { 
  INITIAL_LINGKUNGAN, 
  INITIAL_KATEGORIAL, 
  INITIAL_SEKSI, 
  INITIAL_PENGUMUMAN, 
  INITIAL_PROGRAMS 
} from '../data/initialData';
import { db, auth, testFirestoreConnection } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

export type ActiveNavView = 'dashboard' | 'lingkungan' | 'kategorial' | 'kalender' | 'seksi_portal';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
}

interface AppContextType {
  lingkunganList: LingkunganItem[];
  kategorialList: KategorialItem[];
  seksiList: SeksiItem[];
  pengumumanList: PengumumanItem[];
  programList: ProgramItem[];
  currentSession: UserSession | null;
  activeView: ActiveNavView;
  setActiveView: (view: ActiveNavView) => void;
  selectedEntity: { type: EntityType; id: string } | null;
  setSelectedEntity: (entity: { type: EntityType; id: string } | null) => void;
  isCloudSynced: boolean;
  
  // Auth Modal State
  authModalOpen: boolean;
  authTarget: {
    role: UserRole;
    targetId?: string;
    targetName?: string;
    targetType?: EntityType | 'seksi';
    callback?: () => void;
  } | null;
  openAuthModal: (target?: {
    role: UserRole;
    targetId?: string;
    targetName?: string;
    targetType?: EntityType | 'seksi';
    callback?: () => void;
  }) => void;
  closeAuthModal: () => void;
  
  // Auth Actions
  login: (role: UserRole, targetId?: string, pin?: string) => boolean;
  logout: () => void;
  hasAccessToEntity: (type: EntityType, id: string) => boolean;
  hasAccessToSeksi: (seksiId?: string) => boolean;
  isPastorOrAdmin: () => boolean;

  // Program CRUD
  programModalOpen: boolean;
  editingProgram: ProgramItem | null;
  openProgramModal: (prog?: ProgramItem) => void;
  closeProgramModal: () => void;
  addProgram: (program: Omit<ProgramItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProgram: (id: string, updates: Partial<ProgramItem>) => void;
  deleteProgram: (id: string) => void;

  // Pengumuman CRUD
  pengumumanModalOpen: boolean;
  editingPengumuman: PengumumanItem | null;
  openPengumumanModal: (peng?: PengumumanItem) => void;
  closePengumumanModal: () => void;
  addPengumuman: (item: Omit<PengumumanItem, 'id' | 'createdAt'>) => void;
  updatePengumuman: (id: string, updates: Partial<PengumumanItem>) => void;
  deletePengumuman: (id: string) => void;

  // Admin / Pastor Entity Pengurus Management
  updateLingkungan: (id: string, updates: Partial<LingkunganItem>) => void;
  updateKategorial: (id: string, updates: Partial<KategorialItem>) => void;
  adminEditModalOpen: boolean;
  adminEditTarget: { type: EntityType; id: string } | null;
  openAdminEditModal: (type: EntityType, id: string) => void;
  closeAdminEditModal: () => void;

  // Navigation helpers
  navigateToEntityDetail: (type: EntityType, id: string) => void;
  returnToListView: () => void;

  // Feedback Toast
  toast: { text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  
  // Reset data
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LINGKUNGAN: 'katedral_lingkungan_v3',
  KATEGORIAL: 'katedral_kategorial_v3',
  PENGUMUMAN: 'katedral_pengumuman_v3',
  PROGRAMS: 'katedral_programs_v3',
  SESSION: 'katedral_session_v3',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lingkunganList, setLingkunganList] = useState<LingkunganItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LINGKUNGAN);
      return saved ? JSON.parse(saved) : INITIAL_LINGKUNGAN;
    } catch {
      return INITIAL_LINGKUNGAN;
    }
  });

  const [kategorialList, setKategorialList] = useState<KategorialItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KATEGORIAL);
      return saved ? JSON.parse(saved) : INITIAL_KATEGORIAL;
    } catch {
      return INITIAL_KATEGORIAL;
    }
  });

  const [seksiList] = useState<SeksiItem[]>(INITIAL_SEKSI);

  const [pengumumanList, setPengumumanList] = useState<PengumumanItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PENGUMUMAN);
      return saved ? JSON.parse(saved) : INITIAL_PENGUMUMAN;
    } catch {
      return INITIAL_PENGUMUMAN;
    }
  });

  const [programList, setProgramList] = useState<ProgramItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
    } catch {
      return INITIAL_PROGRAMS;
    }
  });

  const [currentSession, setCurrentSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeView, setActiveView] = useState<ActiveNavView>('dashboard');
  const [selectedEntity, setSelectedEntity] = useState<{ type: EntityType; id: string } | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTarget, setAuthTarget] = useState<AppContextType['authTarget']>(null);

  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);

  const [pengumumanModalOpen, setPengumumanModalOpen] = useState(false);
  const [editingPengumuman, setEditingPengumuman] = useState<PengumumanItem | null>(null);

  // Admin Pengurus Modal state
  const [adminEditModalOpen, setAdminEditModalOpen] = useState(false);
  const [adminEditTarget, setAdminEditTarget] = useState<{ type: EntityType; id: string } | null>(null);

  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // 1. Initial Connection Test
  useEffect(() => {
    testFirestoreConnection().then(connected => {
      setIsCloudSynced(connected);
    });
  }, []);

  // 2. Realtime Synchronization with Firestore onSnapshot
  useEffect(() => {
    // Sync Programs collection
    const unsubPrograms = onSnapshot(
      collection(db, 'programs'),
      (snapshot) => {
        const items: ProgramItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as ProgramItem);
        });
        // Sort descending by date
        items.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
        setProgramList(items);
        localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(items));
        setIsCloudSynced(true);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'programs');
      }
    );

    // Sync Pengumuman collection
    const unsubPengumuman = onSnapshot(
      collection(db, 'pengumuman'),
      (snapshot) => {
        const items: PengumumanItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as PengumumanItem);
        });
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPengumumanList(items);
        localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify(items));
        setIsCloudSynced(true);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'pengumuman');
      }
    );

    // Sync Lingkungan metadata
    const unsubLingkungan = onSnapshot(
      collection(db, 'lingkungan'),
      (snapshot) => {
        if (!snapshot.empty) {
          const map: { [id: string]: Partial<LingkunganItem> } = {};
          snapshot.forEach((docSnap) => {
            map[docSnap.id] = docSnap.data() as Partial<LingkunganItem>;
          });
          setLingkunganList(prev => prev.map(l => ({ ...l, ...(map[l.id] || {}) })));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'lingkungan');
      }
    );

    // Sync Kategorial metadata
    const unsubKategorial = onSnapshot(
      collection(db, 'kategorial'),
      (snapshot) => {
        if (!snapshot.empty) {
          const map: { [id: string]: Partial<KategorialItem> } = {};
          snapshot.forEach((docSnap) => {
            map[docSnap.id] = docSnap.data() as Partial<KategorialItem>;
          });
          setKategorialList(prev => prev.map(k => ({ ...k, ...(map[k.id] || {}) })));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'kategorial');
      }
    );

    return () => {
      unsubPrograms();
      unsubPengumuman();
      unsubLingkungan();
      unsubKategorial();
    };
  }, []);

  // Save Session in localStorage
  useEffect(() => {
    try {
      if (currentSession) {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentSession));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentSession]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(prev => (prev?.text === text ? null : prev));
    }, 3500);
  };

  const openAuthModal = (target?: AppContextType['authTarget']) => {
    setAuthTarget(target || null);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthTarget(null);
  };

  const isPastorOrAdmin = (): boolean => {
    return currentSession?.role === 'pastor_admin';
  };

  const hasAccessToEntity = (type: EntityType, id: string): boolean => {
    if (!currentSession) return false;
    if (currentSession.role === 'pastor_admin') return true;
    if (type === 'lingkungan' && currentSession.role === 'pengurus_lingkungan' && currentSession.targetId === id) {
      return true;
    }
    if (type === 'kategorial' && currentSession.role === 'pengurus_kategorial' && currentSession.targetId === id) {
      return true;
    }
    return false;
  };

  const hasAccessToSeksi = (seksiId?: string): boolean => {
    if (!currentSession) return false;
    if (currentSession.role === 'pastor_admin') return true;
    if (currentSession.role === 'pengurus_seksi') {
      if (!seksiId) return true;
      return currentSession.targetId === seksiId || currentSession.targetId === 'dpph';
    }
    return false;
  };

  const login = (role: UserRole, targetId?: string, pin?: string): boolean => {
    if (role === 'pastor_admin') {
      if (pin === '1234' || pin === 'katedral2026') {
        const session: UserSession = {
          role: 'pastor_admin',
          targetName: 'Pastor Paroki / DPPH Administrator',
          authenticatedAt: new Date().toISOString(),
        };
        setCurrentSession(session);
        showToast('Berhasil masuk sebagai Pastor Paroki / Administrator', 'success');
        return true;
      }
      showToast('PIN Pastor Paroki / Admin salah. Silakan coba lagi.', 'error');
      return false;
    }

    if (role === 'pengurus_lingkungan') {
      const ling = lingkunganList.find(l => l.id === targetId);
      if (!ling) {
        showToast('Pilih Lingkungan terlebih dahulu', 'error');
        return false;
      }
      if (pin === ling.pin || pin === '1234') {
        const session: UserSession = {
          role: 'pengurus_lingkungan',
          targetId: ling.id,
          targetName: ling.nama,
          authenticatedAt: new Date().toISOString(),
        };
        setCurrentSession(session);
        showToast(`Berhasil masuk sebagai Pengurus ${ling.nama}`, 'success');
        return true;
      }
      showToast(`PIN Lingkungan ${ling.nama} salah. Silakan coba lagi.`, 'error');
      return false;
    }

    if (role === 'pengurus_kategorial') {
      const kat = kategorialList.find(k => k.id === targetId);
      if (!kat) {
        showToast('Pilih Kategorial terlebih dahulu', 'error');
        return false;
      }
      if (pin === kat.pin || pin === '1234') {
        const session: UserSession = {
          role: 'pengurus_kategorial',
          targetId: kat.id,
          targetName: kat.nama,
          authenticatedAt: new Date().toISOString(),
        };
        setCurrentSession(session);
        showToast(`Berhasil masuk sebagai Pengurus ${kat.nama}`, 'success');
        return true;
      }
      showToast(`PIN Kategorial ${kat.nama} salah. Silakan coba lagi.`, 'error');
      return false;
    }

    if (role === 'pengurus_seksi') {
      const seksi = seksiList.find(s => s.id === targetId);
      if (!seksi) {
        showToast('Pilih Seksi/DPPH terlebih dahulu', 'error');
        return false;
      }
      if (pin === seksi.pin || pin === '1234') {
        const session: UserSession = {
          role: 'pengurus_seksi',
          targetId: seksi.id,
          targetName: seksi.nama,
          authenticatedAt: new Date().toISOString(),
        };
        setCurrentSession(session);
        showToast(`Berhasil masuk sebagai Pengurus ${seksi.nama}`, 'success');
        return true;
      }
      showToast(`PIN ${seksi.nama} salah. Silakan coba lagi.`, 'error');
      return false;
    }

    return false;
  };

  const logout = () => {
    setCurrentSession(null);
    showToast('Telah keluar dari sesi pengurus', 'info');
  };

  // Program Management with Firestore setDoc/updateDoc/deleteDoc
  const openProgramModal = (prog?: ProgramItem) => {
    setEditingProgram(prog || null);
    setProgramModalOpen(true);
  };

  const closeProgramModal = () => {
    setProgramModalOpen(false);
    setEditingProgram(null);
  };

  const addProgram = async (programData: Omit<ProgramItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProg: ProgramItem = {
      ...programData,
      id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Optimistic update
    setProgramList(prev => [newProg, ...prev]);
    closeProgramModal();
    showToast('Kegiatan / Program berhasil disimpan & disinkronkan', 'success');

    // Firestore write
    try {
      await setDoc(doc(db, 'programs', newProg.id), newProg);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `programs/${newProg.id}`);
    }
  };

  const updateProgram = async (id: string, updates: Partial<ProgramItem>) => {
    const updatedPayload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    setProgramList(prev => prev.map(p => (p.id === id ? { ...p, ...updatedPayload } : p)));
    closeProgramModal();
    showToast('Data kegiatan berhasil diperbarui di cloud', 'success');

    // Firestore update
    try {
      await updateDoc(doc(db, 'programs', id), updatedPayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `programs/${id}`);
    }
  };

  const deleteProgram = async (id: string) => {
    // Optimistic update
    setProgramList(prev => prev.filter(p => p.id !== id));
    showToast('Program kegiatan telah dihapus dari cloud', 'info');

    // Firestore delete
    try {
      await deleteDoc(doc(db, 'programs', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `programs/${id}`);
    }
  };

  // Pengumuman Management with Firestore
  const openPengumumanModal = (peng?: PengumumanItem) => {
    setEditingPengumuman(peng || null);
    setPengumumanModalOpen(true);
  };

  const closePengumumanModal = () => {
    setPengumumanModalOpen(false);
    setEditingPengumuman(null);
  };

  const addPengumuman = async (itemData: Omit<PengumumanItem, 'id' | 'createdAt'>) => {
    const newItem: PengumumanItem = {
      ...itemData,
      id: `warta-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setPengumumanList(prev => [newItem, ...prev]);
    closePengumumanModal();
    showToast('Warta berhasil dipublikasikan & tersinkronisasi di Firebase', 'success');

    // Firestore write
    try {
      await setDoc(doc(db, 'pengumuman', newItem.id), newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `pengumuman/${newItem.id}`);
    }
  };

  const updatePengumuman = async (id: string, updates: Partial<PengumumanItem>) => {
    // Optimistic update
    setPengumumanList(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
    closePengumumanModal();
    showToast('Warta berhasil diperbarui di Firebase', 'success');

    // Firestore update
    try {
      await updateDoc(doc(db, 'pengumuman', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `pengumuman/${id}`);
    }
  };

  const deletePengumuman = async (id: string) => {
    // Optimistic update
    setPengumumanList(prev => prev.filter(p => p.id !== id));
    showToast('Warta telah ditarik dari Firebase', 'info');

    // Firestore delete
    try {
      await deleteDoc(doc(db, 'pengumuman', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `pengumuman/${id}`);
    }
  };

  // Admin Pastor Management for Lingkungan & Kategorial Leaders with Firestore Sync
  const updateLingkungan = async (id: string, updates: Partial<LingkunganItem>) => {
    setLingkunganList(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)));
    showToast('Data pengurus lingkungan tersimpan di Firebase', 'success');

    try {
      await setDoc(doc(db, 'lingkungan', id), updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `lingkungan/${id}`);
    }
  };

  const updateKategorial = async (id: string, updates: Partial<KategorialItem>) => {
    setKategorialList(prev => prev.map(k => (k.id === id ? { ...k, ...updates } : k)));
    showToast('Data pengurus kategorial tersimpan di Firebase', 'success');

    try {
      await setDoc(doc(db, 'kategorial', id), updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `kategorial/${id}`);
    }
  };

  const openAdminEditModal = (type: EntityType, id: string) => {
    setAdminEditTarget({ type, id });
    setAdminEditModalOpen(true);
  };

  const closeAdminEditModal = () => {
    setAdminEditModalOpen(false);
    setAdminEditTarget(null);
  };

  // Navigation
  const navigateToEntityDetail = (type: EntityType, id: string) => {
    setSelectedEntity({ type, id });
  };

  const returnToListView = () => {
    setSelectedEntity(null);
  };

  const resetAllData = () => {
    setLingkunganList(INITIAL_LINGKUNGAN);
    setKategorialList(INITIAL_KATEGORIAL);
    setPengumumanList(INITIAL_PENGUMUMAN);
    setProgramList(INITIAL_PROGRAMS);
    setCurrentSession(null);
    setSelectedEntity(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.LINGKUNGAN);
      localStorage.removeItem(STORAGE_KEYS.KATEGORIAL);
      localStorage.removeItem(STORAGE_KEYS.PENGUMUMAN);
      localStorage.removeItem(STORAGE_KEYS.PROGRAMS);
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (e) {
      console.error(e);
    }
    showToast('Sesi lokal telah direset', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        lingkunganList,
        kategorialList,
        seksiList,
        pengumumanList,
        programList,
        currentSession,
        activeView,
        setActiveView,
        selectedEntity,
        setSelectedEntity,
        isCloudSynced,

        authModalOpen,
        authTarget,
        openAuthModal,
        closeAuthModal,

        login,
        logout,
        hasAccessToEntity,
        hasAccessToSeksi,
        isPastorOrAdmin,

        programModalOpen,
        editingProgram,
        openProgramModal,
        closeProgramModal,
        addProgram,
        updateProgram,
        deleteProgram,

        pengumumanModalOpen,
        editingPengumuman,
        openPengumumanModal,
        closePengumumanModal,
        addPengumuman,
        updatePengumuman,
        deletePengumuman,

        updateLingkungan,
        updateKategorial,
        adminEditModalOpen,
        adminEditTarget,
        openAdminEditModal,
        closeAdminEditModal,

        navigateToEntityDetail,
        returnToListView,

        toast,
        showToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
