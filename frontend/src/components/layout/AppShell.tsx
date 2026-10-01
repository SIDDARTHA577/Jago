import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Profile, UserRole } from '../../types';
import { Dialog } from '../ui/Dialog';
import { mockStore } from '../../lib/mockStore';
import { Bell, Check } from 'lucide-react';

export interface AppShellProps {
  user: Profile | null;
  onLogout: () => void;
  onSwitchRole?: (role: UserRole) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ user, onLogout, children }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [, forceUpdate] = useState({});

  const notifications = user ? mockStore.getNotifications(user.id) : [];
  const unreadCount = notifications.filter(n => !n.read_at).length;

  const handleMarkAllRead = () => {
    if (user) {
      mockStore.markAllNotificationsRead(user.id);
      forceUpdate({});
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      <Header
        user={user}
        onLogout={onLogout}
        unreadNotificationCount={unreadCount}
        onOpenNotifications={() => setNotifOpen(true)}
      />

      <div className="flex flex-1">
        {user && <Sidebar role={user.role_key} />}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      <Dialog
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="In-App Notifications"
        description="Real-time document verification & status activity log"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-600">
              {unreadCount} Unread Notification{unreadCount === 1 ? '' : 's'}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1 font-semibold"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">No notifications yet.</div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    mockStore.markNotificationRead(n.id);
                    forceUpdate({});
                  }}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    n.read_at
                      ? 'bg-slate-50 border-slate-200 text-slate-500'
                      : 'bg-white border-sky-300 text-slate-900 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-sky-600 flex items-center gap-1.5 font-bold">
                      <Bell className="w-3.5 h-3.5" />
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
