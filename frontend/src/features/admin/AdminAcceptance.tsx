import React, { useEffect, useState } from 'react';
import { mockStore } from '../../lib/mockStore';
import { PilotTestCheckitem, AcceptanceRecord, PilotStatus } from '../../types';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Award, CheckCircle2, FileCheck } from 'lucide-react';

export const AdminAcceptance: React.FC = () => {
  const [checklist, setChecklist] = useState<PilotTestCheckitem[]>([]);
  const [records, setRecords] = useState<AcceptanceRecord[]>([]);

  const [developerName, setDeveloperName] = useState('Antigravity AI Engineer');
  const [testerName, setTesterName] = useState('V. Lakshmi Prasanna');
  const [pilotStatus, setPilotStatus] = useState<PilotStatus>('Passed');
  const [openIssues, setOpenIssues] = useState('None. All pilot verification test cases verified successfully.');
  const [finalRemarks, setFinalRemarks] = useState('Product meets end-to-end production readiness guidelines.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadData = () => {
    setChecklist([...mockStore.getTestChecklist()]);
    setRecords([...mockStore.getAcceptanceRecords()]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Passed' ? 'Failed' : 'Passed';
    mockStore.updateChecklistItem(id, nextStatus as any);
    loadData();
  };

  const handleSubmitAcceptance = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.saveAcceptanceRecord({
      developer_name: developerName,
      tester_name: testerName,
      pilot_status: pilotStatus,
      open_issues: openIssues,
      final_remarks: finalRemarks
    });
    setSavedSuccess(true);
    loadData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-600" />
          <span>Pilot Test Checklist & QA Acceptance</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          QA testing checklist and sign-off records for system verification.
        </p>
      </div>

      <Card>
        <CardHeader
          title="QA Testing Checklist"
          description="Verification matrix for functional test coverage"
        />
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Category</th>
                <th className="p-4">Test Case</th>
                <th className="p-4">Expected Result</th>
                <th className="p-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {checklist.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-sky-800 border border-slate-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{item.testCase}</td>
                  <td className="p-4 text-slate-600">{item.expectedResult}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleStatusToggle(item.id, item.status)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        item.status === 'Passed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                      }`}
                    >
                      {item.status === 'Passed' ? 'PASSED ✓' : 'FAILED ✗'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmitAcceptance}>
        <Card>
          <CardHeader
            title="Final QA Acceptance Sign-Off"
            description="Persisted sign-off record for deployment"
          />
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Developer Name"
                value={developerName}
                onChange={e => setDeveloperName(e.target.value)}
                required
              />
              <Input
                label="Tester / Inspector Name"
                value={testerName}
                onChange={e => setTesterName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Pilot Status Result
              </label>
              <select
                value={pilotStatus}
                onChange={e => setPilotStatus(e.target.value as PilotStatus)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              >
                <option value="Passed">Passed (Fully Accepted)</option>
                <option value="Passed with Changes">Passed with Changes</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <Input
              label="Open Issues (If Any)"
              value={openIssues}
              onChange={e => setOpenIssues(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Final Remarks & Summary
              </label>
              <textarea
                rows={3}
                value={finalRemarks}
                onChange={e => setFinalRemarks(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Final Acceptance Record saved and logged successfully!</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" variant="success" icon={<FileCheck className="w-4 h-4" />}>
              Save Acceptance Sign-Off
            </Button>
          </CardFooter>
        </Card>
      </form>

      {records.length > 0 && (
        <Card>
          <CardHeader title="Historical Acceptance Logs" />
          <CardContent className="space-y-3">
            {records.map(r => (
              <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Evaluated on {new Date(r.evaluated_at).toLocaleString()}</span>
                  <Badge variant={r.pilot_status === 'Passed' ? 'approved' : 'rejected'}>{r.pilot_status}</Badge>
                </div>
                <p className="text-slate-600">Developer: <strong className="text-slate-800">{r.developer_name}</strong> • Tester: <strong className="text-slate-800">{r.tester_name}</strong></p>
                <p className="text-slate-700">Remarks: "{r.final_remarks}"</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

