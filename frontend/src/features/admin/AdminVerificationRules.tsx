import React, { useEffect, useState } from 'react';
import { SystemSetting } from '../../types';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Sliders, ShieldCheck, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminVerificationRules: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Local state for rule configurations
  const [hierarchyMode, setHierarchyMode] = useState('single_verifier');
  const [autoAssignment, setAutoAssignment] = useState('manual');
  const [rejectionPolicy, setRejectionPolicy] = useState('require_remarks');
  const [allowResubmission, setAllowResubmission] = useState(true);
  const [maxFileMb, setMaxFileMb] = useState(20);

  const loadData = async () => {
    const list = await adminService.getSystemSettings();
    setSettings(list);

    const modeItem = list.find(s => s.key === 'approval_hierarchy_mode');
    if (modeItem) setHierarchyMode(String(modeItem.value));

    const sizeItem = list.find(s => s.key === 'max_file_size_global_mb');
    if (sizeItem) setMaxFileMb(Number(sizeItem.value));

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    try {
      const modeItem = settings.find(s => s.key === 'approval_hierarchy_mode');
      if (modeItem) {
        await adminService.updateSystemSetting(modeItem.id, hierarchyMode, 'p-admin-1');
      }

      const sizeItem = settings.find(s => s.key === 'max_file_size_global_mb');
      if (sizeItem) {
        await adminService.updateSystemSetting(sizeItem.id, maxFileMb, 'p-admin-1');
      }

      setSuccessMsg('Verification & Workflow Rules updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs animate-pulse font-medium">Loading Workflow & Verification Rules...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-sky-600" />
          <span>Workflow & Verification Rules</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure official document verification policies, approval gates, verifier assignments, and rejection workflow rules.
        </p>
      </div>

      <form onSubmit={handleSaveRules}>
        <div className="space-y-6">
          {/* Rule Card 1: Approval Authority Model */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader
              title="Approval Hierarchy & Authority Gates"
              description="Define authorization levels required before permission is granted to a driver"
            />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setHierarchyMode('single_verifier')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    hierarchyMode === 'single_verifier'
                      ? 'border-sky-600 bg-sky-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <ShieldCheck className="w-5 h-5 text-sky-600" />
                    <input
                      type="radio"
                      name="hierarchy"
                      checked={hierarchyMode === 'single_verifier'}
                      onChange={() => setHierarchyMode('single_verifier')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Single Verifier Approval</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Assigned inspector can directly verify documents and issue final driver permission.
                  </p>
                </div>

                <div
                  onClick={() => setHierarchyMode('verifier_plus_admin')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    hierarchyMode === 'verifier_plus_admin'
                      ? 'border-sky-600 bg-sky-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <input
                      type="radio"
                      name="hierarchy"
                      checked={hierarchyMode === 'verifier_plus_admin'}
                      onChange={() => setHierarchyMode('verifier_plus_admin')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Dual Approval Gate</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Inspector verifies document validity; Administrator confirms final permission seal.
                  </p>
                </div>

                <div
                  onClick={() => setHierarchyMode('admin_only')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    hierarchyMode === 'admin_only'
                      ? 'border-sky-600 bg-sky-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    <input
                      type="radio"
                      name="hierarchy"
                      checked={hierarchyMode === 'admin_only'}
                      onChange={() => setHierarchyMode('admin_only')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Admin Strict Oversight</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    All document verification and final authorization actions restricted to Administrators.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rule Card 2: Assignment & Rejection Rules */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader
              title="Assignment & Rejection Policy Controls"
              description="Configure inspector assignments and mandatory rejection remark enforcement"
            />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Verifier Application Assignment Strategy
                  </label>
                  <select
                    value={autoAssignment}
                    onChange={e => setAutoAssignment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm font-semibold"
                  >
                    <option value="manual">Manual Admin Assignment (Strict Queue Isolation)</option>
                    <option value="round_robin">Automatic Round-Robin Distribution</option>
                    <option value="load_balanced">Workload Load Balanced Allocation</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Only assigned applications appear on inspector dashboard queues.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Document Rejection & Remarks Policy
                  </label>
                  <select
                    value={rejectionPolicy}
                    onChange={e => setRejectionPolicy(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm font-semibold"
                  >
                    <option value="require_remarks">Mandatory Reason & Inspector Remarks</option>
                    <option value="optional_remarks">Reason Required, Remarks Optional</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Verifier remarks are transmitted directly to Pilot applicant notification center.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Allow Pilot Resubmissions</span>
                    <span className="text-[10px] text-slate-500">Enable pilots to re-upload files after document rejection</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowResubmission}
                    onChange={e => setAllowResubmission(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Global File Size Cap</span>
                    <span className="text-[10px] text-slate-500">Maximum allowed size per uploaded PDF/Image file</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={maxFileMb}
                      onChange={e => setMaxFileMb(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 font-mono text-center"
                    />
                    <span className="text-xs font-bold text-slate-700">MB</span>
                  </div>
                </div>
              </div>
            </CardContent>

            {successMsg && (
              <div className="mx-6 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <CardFooter className="flex justify-end border-t border-slate-100 bg-slate-50/50">
              <Button type="submit" variant="primary" loading={saving} icon={<Save className="w-4 h-4" />}>
                Save Workflow Rules
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
};
