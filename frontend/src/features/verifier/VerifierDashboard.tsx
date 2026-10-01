import React, { useEffect, useState } from 'react';
import { Profile, Application } from '../../types';
import { applicationService } from '../../services/applicationService';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, XCircle, Clock, ShieldCheck, ArrowRight, Car, FileUp } from 'lucide-react';

export interface VerifierDashboardProps {
  user: Profile;
}

export const VerifierDashboard: React.FC<VerifierDashboardProps> = ({ user }) => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getApplications().then(list => {
      setApps(list);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs animate-pulse font-medium">Loading Verifier Workspace...</div>;
  }

  const assigned = user.role_key === 'admin' ? apps : apps.filter(a => a.assigned_verifier_id === user.id);
  const pendingCount = assigned.filter(a => a.status === 'Pending Verification' || a.status === 'Under Verification').length;
  const newUploadCount = assigned.filter(a => a.has_new_upload).length;
  const verifiedCount = assigned.filter(a => a.status === 'Verified').length;
  const rejectedCount = assigned.filter(a => a.status === 'Rejected').length;
  const grantedCount = assigned.filter(a => a.status === 'Permission Granted').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span>Verifier Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review assigned driver applications, preview identity/DL/RC documents, verify certificates, and record remarks.
          </p>
        </div>

        <Link to="/verifier/applications">
          <Button variant="primary" icon={<FileText className="w-4 h-4" />}>
            Open Assigned Applications ({assigned.length})
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Pending Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card className={newUploadCount > 0 ? 'bg-amber-50/60 border-amber-300 shadow-sm' : 'bg-white border-slate-200/80 shadow-sm'}>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
              <span>New Doc Uploads</span>
              <FileUp className="w-4 h-4 text-amber-600 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-amber-900">{newUploadCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Verified Drivers</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{verifiedCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Rejected Items</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">{rejectedCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Permission Granted</span>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{grantedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200/80 shadow-sm">
        <CardHeader
          title="Assigned Driver Applications"
          description="Applications assigned for identity, DL, and vehicle RC document verification"
          action={
            <Link to="/verifier/applications">
              <Button size="sm" variant="outline" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All
              </Button>
            </Link>
          }
        />
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {assigned.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No assigned driver applications pending in queue.
              </div>
            ) : (
              assigned.map(app => (
                <div key={app.id} className={`p-4 flex items-center justify-between gap-4 transition-colors ${app.has_new_upload ? 'bg-amber-50/50 hover:bg-amber-50/80' : 'hover:bg-slate-50'}`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{app.public_reference}</span>
                      <Badge variant={app.status}>{app.status}</Badge>
                      {app.has_new_upload && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse shadow-sm">
                          <FileUp className="w-3 h-3 text-amber-600 shrink-0" />
                          New Upload Alert
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Driver: <strong className="text-slate-800 font-semibold">{app.pilot?.name || 'N/A'}</strong></span>
                      <span>•</span>
                      <span>DL No: <strong className="font-mono text-slate-700">{app.pilot?.license_number || 'N/A'}</strong></span>
                      {app.pilot?.vehicle_number && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Car className="w-3 h-3 text-indigo-600" /> Plate: <strong className="font-mono text-slate-800">{app.pilot.vehicle_number}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  <Link to={`/verifier/applications/${app.id}`}>
                    <Button size="sm" variant={app.has_new_upload ? 'warning' : 'primary'}>
                      {app.has_new_upload ? 'Review New Upload' : 'Inspect & Verify'}
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
