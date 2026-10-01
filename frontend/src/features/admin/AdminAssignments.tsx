import React, { useEffect, useState } from 'react';
import { Application, Profile } from '../../types';
import { applicationService } from '../../services/applicationService';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { UserCheck, CheckCircle2, CheckSquare, Square, FileUp } from 'lucide-react';

export const AdminAssignments: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [verifiers, setVerifiers] = useState<Profile[]>([]);
  const [selectedVerifiers, setSelectedVerifiers] = useState<Record<string, string>>({});
  const [savingAppId, setSavingAppId] = useState<string | null>(null);

  // Multi-select state
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [batchVerifierId, setBatchVerifierId] = useState<string>('');
  const [batchSaving, setBatchSaving] = useState(false);

  const loadData = async () => {
    const [allApps, users] = await Promise.all([
      applicationService.getApplications(),
      adminService.getUsers()
    ]);
    setApps(allApps);
    setVerifiers(users.filter(u => u.role_key === 'verifier' || u.role_key === 'admin'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (appId: string) => {
    const verifierId = selectedVerifiers[appId];
    if (!verifierId) return;

    setSavingAppId(appId);
    try {
      await applicationService.assignVerifier(appId, verifierId, 'admin');
      await loadData();
    } finally {
      setSavingAppId(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAppIds(apps.map(a => a.id));
    } else {
      setSelectedAppIds([]);
    }
  };

  const handleToggleSelect = (appId: string) => {
    if (selectedAppIds.includes(appId)) {
      setSelectedAppIds(selectedAppIds.filter(id => id !== appId));
    } else {
      setSelectedAppIds([...selectedAppIds, appId]);
    }
  };

  const handleBatchAssign = async () => {
    if (!batchVerifierId || selectedAppIds.length === 0) return;

    setBatchSaving(true);
    try {
      for (const id of selectedAppIds) {
        await applicationService.assignVerifier(id, batchVerifierId, 'admin');
      }
      setSelectedAppIds([]);
      setBatchVerifierId('');
      await loadData();
    } finally {
      setBatchSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-sky-600" />
          <span>Verifier Application Assignments</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Select multiple pilot applications using checkboxes and directly assign them to an inspector at once.
        </p>
      </div>

      {/* Batch Actions Bar */}
      {selectedAppIds.length > 0 && (
        <div className="p-4 bg-sky-50 border border-sky-300 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
            <CheckSquare className="w-5 h-5 text-sky-600" />
            <span>{selectedAppIds.length} Application(s) Selected for Bulk Assignment</span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={batchVerifierId}
              onChange={e => setBatchVerifierId(e.target.value)}
              className="px-3 py-2 bg-white border border-sky-300 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Select Verifier to Assign All...</option>
              {verifiers.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>

            <Button
              variant="primary"
              size="sm"
              loading={batchSaving}
              disabled={!batchVerifierId}
              onClick={handleBatchAssign}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Assign Selected ({selectedAppIds.length})
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedAppIds([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader title="Application Assignments Table" description="Check applications to assign multiple items at once" />
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={apps.length > 0 && selectedAppIds.length === apps.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">Reference</th>
                <th className="p-4">Pilot Applicant</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Assigned Verifier</th>
                <th className="p-4 text-right">Assign / Reassign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No applications registered yet.
                  </td>
                </tr>
              ) : (
                apps.map(app => {
                  const isChecked = selectedAppIds.includes(app.id);
                  return (
                    <tr key={app.id} className={`transition-colors ${isChecked ? 'bg-sky-50/60' : 'hover:bg-slate-50'}`}>
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(app.id)}
                          className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-mono font-bold text-sky-700">
                        <div className="flex items-center gap-2">
                          <span>{app.public_reference}</span>
                          {app.has_new_upload && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse shadow-sm">
                              <FileUp className="w-3 h-3 text-amber-600 shrink-0" />
                              New Upload
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-900">{app.pilot?.name || 'Pilot'}</td>
                      <td className="p-4">
                        <Badge variant={app.status}>{app.status}</Badge>
                      </td>
                      <td className="p-4 text-slate-700 font-medium">
                        {app.assigned_verifier ? (
                          <span className="font-bold text-emerald-700">{app.assigned_verifier.name}</span>
                        ) : (
                          <span className="text-amber-600 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={selectedVerifiers[app.id] || app.assigned_verifier_id || ''}
                            onChange={e => setSelectedVerifiers({ ...selectedVerifiers, [app.id]: e.target.value })}
                            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                          >
                            <option value="">Select Verifier...</option>
                            {verifiers.map(v => (
                              <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            variant="primary"
                            loading={savingAppId === app.id}
                            onClick={() => handleAssign(app.id)}
                            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          >
                            Save
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

