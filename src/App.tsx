import React from 'react';
import { AppProvider, useApp, ActiveNavView } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { LingkunganList } from './components/LingkunganList';
import { KategorialList } from './components/KategorialList';
import { EntityDetailView } from './components/EntityDetailView';
import { SeksiPortal } from './components/SeksiPortal';
import { KalenderView } from './components/KalenderView';
import { AuthModal } from './components/AuthModal';
import { ProgramModal } from './components/ProgramModal';
import { PengumumanModal } from './components/PengumumanModal';
import { AdminPengurusModal } from './components/AdminPengurusModal';
import { 
  Megaphone, 
  Home, 
  Users, 
  Calendar, 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Church, 
  CheckCircle2, 
  AlertCircle, 
  Info 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    selectedEntity, 
    setSelectedEntity, 
    pengumumanList,
    lingkunganList,
    kategorialList,
    toast 
  } = useApp();

  const handleTabChange = (view: ActiveNavView) => {
    setSelectedEntity(null);
    setActiveView(view);
  };

  const navItems = [
    { id: 'dashboard' as ActiveNavView, label: 'Warta Pengumuman Seksi', icon: Megaphone },
    { id: 'lingkungan' as ActiveNavView, label: '14 Lingkungan Paroki', icon: Home },
    { id: 'kategorial' as ActiveNavView, label: '7 Kategorial', icon: Users },
    { id: 'kalender' as ActiveNavView, label: 'Kalender Paroki', icon: Calendar },
    { id: 'seksi_portal' as ActiveNavView, label: 'Portal Seksi & DPPH', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Parish Top Header */}
      <Header />

      {/* Desktop Navigation Bar */}
      <nav className="hidden md:block bg-white border-b border-slate-200 sticky top-[57px] z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = !selectedEntity && activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-100 text-amber-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 font-medium hidden lg:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Paroki Katedral Keuskupan Agung Medan</span>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6">
        {selectedEntity ? (
          <EntityDetailView />
        ) : (
          <>
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'lingkungan' && <LingkunganList />}
            {activeView === 'kategorial' && <KategorialList />}
            {activeView === 'kalender' && <KalenderView />}
            {activeView === 'seksi_portal' && <SeksiPortal />}
          </>
        )}
      </main>

      {/* Toast Feedback Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs sm:text-sm font-semibold ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-700'
              : toast.type === 'error'
              ? 'bg-red-950 text-red-100 border-red-700'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <AuthModal />
      <ProgramModal />
      <PengumumanModal />
      <AdminPengurusModal />

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav />

      {/* Cathedral Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto hidden md:block">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-white font-bold font-cathedral text-sm mb-2">
                <Church className="w-4 h-4 text-amber-400" />
                <span>Gereja Katedral Medan</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Paroki Santa Perawan Maria Yang Dikandung Tanpa Noda, Keuskupan Agung Medan. Melayani 14 Lingkungan dan 7 Kelompok Kategorial.
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-white font-semibold mb-2">Sekretariat Paroki</div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Jl. Pemuda No. 1, Medan - Sumatera Utara 20151</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>(061) 4515570 / 4515572</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>sekretariat@katedralmedan.or.id</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-white font-semibold mb-2">Jadwal Misa Hari Minggu</div>
              <div className="text-slate-400">Pkl 06.30 WIB (Indonesia)</div>
              <div className="text-slate-400">Pkl 08.30 WIB (Anak & Keluarga)</div>
              <div className="text-slate-400">Pkl 10.30 WIB (English Mass)</div>
              <div className="text-slate-400">Pkl 17.00 WIB & 19.00 WIB (OMK)</div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>© {new Date().getFullYear()} Paroki Katedral St. Maria Dikandung Tanpa Noda Keuskupan Agung Medan</div>
            <div>Sistem Informasi Pastoral Terpadu</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
