import React, { useEffect, useState } from 'react';
import { Profile, Application } from '../../types';
import { applicationService } from '../../services/applicationService';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Search, Filter, ShieldCheck, ArrowRight, Car, FileUp } from 'lucide-react';

export interface VerifierApplicationsProps {
  user: Profile;
}

export const VerifierApplications: React.FC<VerifierApplicationsProps> = ({ user }) => {
  const [apps, setApps] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    applicationService.getApplications().then(setApps);
  }, []);

  const filtered = apps.filter(app => {
    const isAssignedToUser = user.role_key === 'admin' || app.assigned_verifier_id === user.id;
    const matchesSearch = 
      app.public_reference.toLowerCase().includes(search.toLowerCase()) ||
      (app.pilot?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.pilot?.vehicle_number || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return isAssignedToUser && matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <span>Assigned Applications Queue</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review driver application details, inspect uploaded identity/DL/RC PDF documents, and grant permissions.
        </p>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reference, driver name, vehicle plate..."
              className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Verified">Verified</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Permission Granted">Permission Granted</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Reference</th>
                <th className="p-4">Driver Name</th>
                <th className="p-4">DL Number</th>
                <th className="p-4">Vehicle Plate No.</th>
                <th className="p-4">Status & Activity</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No assigned driver applications match the filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(app => (
                  <tr key={app.id} className={`transition-colors ${app.has_new_upload ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50'}`}>
                    <td className="p-4 font-mono font-bold text-indigo-700">
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
                    <td className="p-4 font-bold text-slate-900">{app.pilot?.name || 'Driver'}</td>
                    <td className="p-4 font-mono text-slate-700">{app.pilot?.license_number || 'N/A'}</td>
                    <td className="p-4 font-mono font-bold text-slate-900">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        <Car className="w-3 h-3 text-indigo-600" />
                        {app.pilot?.vehicle_number || 'Not Provided'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant={app.status}>{app.status}</Badge>
                        {app.last_uploaded_at && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            Doc Upload: {new Date(app.last_uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{new Date(app.submitted_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <Link to={`/verifier/applications/${app.id}`}>
                        <Button size="sm" variant={app.has_new_upload ? 'warning' : 'primary'} icon={<ArrowRight className="w-3.5 h-3.5" />}>
                          {app.has_new_upload ? 'Review New Upload' : 'Inspect & Verify'}
                        </Button>
                      </Link>
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
