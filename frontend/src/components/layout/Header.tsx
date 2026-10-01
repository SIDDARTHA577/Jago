import React, { useState } from 'react';
import { Shield, Bell, LogOut, Menu, X } from 'lucide-react';
import { Profile } from '../../types';

export interface HeaderProps {
  user: Profile | null;
  onLogout: () => void;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  unreadNotificationCount,
  onOpenNotifications,
  onToggleMobileMenu,
  isMobileMenuOpen
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {user && onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/10 ring-1 ring-white/50">
          <Shield className="w-6 h-6 text-white stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider text-slate-900 font-mono">JAGO</span>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold border border-sky-200 hidden sm:inline-block">
              PILOT PLATFORM
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Verification & Permission Portal</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors"
          title="In-App Notification Center"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-rose-500/30">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-slate-800 block leading-none">{user?.name || 'User'}</span>
              <span className="text-[10px] text-slate-500 font-medium capitalize block mt-0.5">{user?.role_key}</span>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <span className="mt-1.5 inline-block text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold capitalize">
                  {user?.role_key} Account
                </span>
              </div>

              <button
                onClick={() => { onLogout(); setUserMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors mt-1 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

