import React, { useEffect, useState } from 'react';
import { Application } from '../../types';
import { applicationService } from '../../services/applicationService';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Sliders, 
  ArrowUpRight, 
  FileCheck2, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  Activity, 
  Server, 
  Users, 
  ArrowRight,
  FileUp
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminDashboard: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getApplications().then(list => {
      setApps(list);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs font-semibold animate-pulse">Loading System Admin Dashboard...</div>;
  }

  const totalApps = apps.length;
  const pendingApps = apps.filter(a => a.status === 'Pending Verification' || a.status === 'Under Verification').length;
  const verifiedApps = apps.filter(a => a.status === 'Verified').length;
  const rejectedApps = apps.filter(a => a.status === 'Rejected').length;
  const permissionGrantedApps = apps.filter(a => a.status === 'Permission Granted').length;

  const chartData = [
    { name: 'Pending Review', count: pendingApps, fill: '#f59e0b' },
    { name: 'Verified', count: verifiedApps, fill: '#0d9488' },
    { name: 'Rejected', count: rejectedApps, fill: '#e11d48' },
    { name: 'Granted', count: permissionGrantedApps, fill: '#059669' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Executive Hero Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Executive Command Center</h1>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time Andhra Pradesh driver document verification statistics, verifier workload assignments, security metrics, and compliance audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/admin/assignments">
            <Button variant="outline" size="md" icon={<Users className="w-4 h-4 text-slate-600" />}>
              Assign Verifiers
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="primary" size="md" icon={<ArrowUpRight className="w-4 h-4" />}>
              Generate System Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow bg-white border-slate-200">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registered</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{totalApps}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
                <span>Active Driver Records</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow bg-white border-slate-200">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-amber-600 tracking-tight">{pendingApps}</p>
              <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold mt-1">
                <span>Requires Review</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow bg-white border-slate-200">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Drivers</span>
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-teal-700 tracking-tight">{verifiedApps}</p>
              <div className="flex items-center gap-1 text-[11px] text-teal-700 font-bold mt-1">
                <span>Docs Validated</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow bg-white border-slate-200">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rejected Apps</span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-rose-600 tracking-tight">{rejectedApps}</p>
              <div className="flex items-center gap-1 text-[11px] text-rose-700 font-bold mt-1">
                <span>Correction Sent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow bg-white border-slate-200">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Granted Seal</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-600 tracking-tight">{permissionGrantedApps}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
                <span>Approved Drivers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader
            title="Application Status Breakdown"
            description="Distribution of driver applications across verification pipeline stages"
          />
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader
            title="Approval & Verification Distribution"
            description="Proportion of verified vs permission granted driver applications"
          />
          <CardContent className="h-72 flex items-center justify-center">
            {totalApps === 0 ? (
              <div className="text-center text-slate-400 text-xs">No application data available for chart</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={4} label>
                    {chartData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Table */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader
          title="Recent Driver Applications"
          description="Registered applications awaiting or undergoing verification review"
          action={
            <Link to="/admin/assignments">
              <Button size="sm" variant="outline" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All Assignments
              </Button>
            </Link>
          }
        />
        <CardContent className="p-0 overflow-x-auto">
          {apps.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No applications in queue. Drivers can register and upload documents to get started.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Driver Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Verifier</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {apps.map(app => (
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
                    <td className="p-4">
                      <Badge variant={app.status}>{app.status}</Badge>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {app.assigned_verifier?.name || 'Unassigned'}
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/verifier/applications/${app.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
