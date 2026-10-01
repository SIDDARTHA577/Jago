import React, { useEffect, useState } from 'react';
import { AuditLog } from '../../types';
import { auditService } from '../../services/auditService';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { ShieldAlert, Search } from 'lucide-react';

export const AdminAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    auditService.getAuditLogs().then(setLogs);
  }, []);

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.actor_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.entity_type || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-sky-600" />
          <span>System Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete audit history logging user uploads, verification reviews, rejections, and approvals.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Audit Trail Log Entries"
          description="Log history of security and workflow actions"
          action={
            <div className="w-64 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter action or user..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              />
            </div>
          }
        />
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor / User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Entity Target</th>
                <th className="p-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="p-4 font-bold text-slate-900">{log.actor_name || 'System User'}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-sky-800 border border-slate-200">
                        {log.actor_role || 'system'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-700">{log.action}</td>
                    <td className="p-4 font-mono text-slate-700">{log.entity_type}</td>
                    <td className="p-4 font-mono text-[11px] text-slate-500 truncate max-w-xs">
                      {JSON.stringify(log.metadata || {})}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

