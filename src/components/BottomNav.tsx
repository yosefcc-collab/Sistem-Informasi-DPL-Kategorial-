import React from 'react';
import { useApp, ActiveNavView } from '../context/AppContext';
import { Newspaper, Home, Users, Calendar, Megaphone, Shield } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, setSelectedEntity, pengumumanList, lingkunganList, kategorialList } = useApp();

  const handleNav = (view: ActiveNavView) => {
    setSelectedEntity(null);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    {
      id: 'dashboard' as ActiveNavView,
      label: 'Warta Seksi',
      shortLabel: 'Warta',
      icon: Megaphone,
      badge: pengumumanList.filter(p => p.prioritas === 'penting' || p.prioritas === 'mendesak').length,
    },
    {
      id: 'lingkungan' as ActiveNavView,
      label: '14 Lingkungan',
      shortLabel: 'Lingkungan',
      icon: Home,
      count: lingkunganList.length,
    },
    {
      id: 'kategorial' as ActiveNavView,
      label: '7 Kategorial',
      shortLabel: 'Kategorial',
      icon: Users,
      count: kategorialList.length,
    },
    {
      id: 'kalender' as ActiveNavView,
      label: 'Kalender Paroki',
      shortLabel: 'Kalender',
      icon: Calendar,
    },
    {
      id: 'seksi_portal' as ActiveNavView,
      label: 'Portal Seksi',
      shortLabel: 'Seksi DPPH',
      icon: Shield,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden">
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-800 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-lg transition ${
                    isActive ? 'bg-amber-100 text-amber-900 shadow-xs' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {item.badge ? (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.shortLabel}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
