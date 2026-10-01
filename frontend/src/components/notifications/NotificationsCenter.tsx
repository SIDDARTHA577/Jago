import React, { useEffect, useState } from 'react';
import { Profile, NotificationItem } from '../../types';
import { mockStore } from '../../lib/mockStore';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Bell, Check, AlertCircle, CheckCircle2, ShieldCheck, UserCheck, Trash2 } from 'lucide-react';

export interface NotificationsCenterProps {
  user: Profile;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = () => {
    const list = mockStore.getNotifications(user.id);
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
  }, [user.id]);

  const handleMarkRead = (id: string) => {
    mockStore.markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = () => {
    mockStore.markAllNotificationsRead(user.id);
    loadNotifications();
  };

  const filtered = notifications.filter(n => (filter === 'unread' ? !n.read_at : true));
  const unreadCount = notifications.filter(n => !n.read_at).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT_REJECTED':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'DOCUMENT_VERIFIED':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'APPLICATION_ASSIGNED':
        return <UserCheck className="w-5 h-5 text-sky-600" />;
      case 'PERMISSION_GRANTED':
        return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
            <Bell className="w-6 h-6 text-sky-600" />
            <span>In-App Notifications & Alerts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status updates, verifier remarks, assignment notices, and permission alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              icon={<Check className="w-4 h-4 text-emerald-600" />}
            >
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader
          title={
            <div className="flex items-center justify-between w-full">
              <span>Activity Log ({filtered.length})</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filter === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filter === 'unread' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>
          }
        />
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications found under selected filter.
              </div>
            ) : (
              filtered.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`p-4 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                    n.read_at ? 'bg-white hover:bg-slate-50/80 text-slate-600' : 'bg-sky-50/40 hover:bg-sky-50/80 text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                      n.type === 'DOCUMENT_REJECTED'
                        ? 'bg-rose-50 border-rose-200'
                        : n.type === 'DOCUMENT_VERIFIED'
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-sky-50 border-sky-200'
                    }`}>
                      {getNotifIcon(n.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{n.title}</span>
                        {!n.read_at && (
                          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 font-mono block pt-1">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!n.read_at && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(n.id);
                      }}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
