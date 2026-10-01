import React, { useEffect, useState } from 'react';
import { Profile, Application } from '../../types';
import { applicationService } from '../../services/applicationService';
import { exportPilotPermissionCertificate } from '../../lib/exportPdf';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, ShieldCheck, Clock, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface PilotStatusProps {
  user: Profile;
}

export const PilotStatus: React.FC<PilotStatusProps> = ({ user }) => {
  const [app, setApp] = useState<Application | null>(null);

  useEffect(() => {
    applicationService.getPilotApplication(user.id).then(setApp);
  }, [user.id]);

  if (!app) return <div className="p-8 text-center text-slate-500 text-xs font-medium">Loading Permission Status...</div>;

  const isGranted = app.status === 'Permission Granted';

  const handleDownloadCertificate = () => {
    if (app && user) {
      exportPilotPermissionCertificate(app, user);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span>Application Permission Status</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">Check your driver verification approval status and download official permission certificate.</p>
      </div>

      <Card className={isGranted ? 'border-emerald-300 shadow-md bg-white' : 'bg-white'}>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <span>Driver Permission Certificate</span>
              <Badge variant={app.status}>{app.status}</Badge>
            </div>
          }
          description={`Application Reference: ${app.public_reference}`}
          action={
            isGranted && (
              <Button
                size="sm"
                variant="success"
                onClick={handleDownloadCertificate}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Download Certificate
              </Button>
            )
          }
        />
        <CardContent className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs text-slate-500 font-mono">Driver Applicant Name</p>
                <p className="text-lg font-bold text-slate-900">{user.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-mono">DL & Plate Number</p>
                <p className="text-sm font-semibold text-slate-900 font-mono">
                  {user.license_number || 'AP39 20240012345'} • {user.vehicle_number || 'AP 39 TV 4589'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Submission Date:</span>
                <p className="text-slate-800 font-semibold">{new Date(app.submitted_at).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-slate-500">Vehicle Category:</span>
                <p className="text-slate-800 font-semibold">{user.vehicle_type || 'Auto Rickshaw (Passenger Vehicle)'}</p>
              </div>
            </div>

            {isGranted ? (
              <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-xl text-emerald-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>VERIFICATION COMPLETED • PERMISSION GRANTED</span>
                </div>
                <p className="text-slate-700">
                  This certifies that all required identity, driving license, and vehicle registration documents have been verified and approved.
                </p>
                <div className="text-[11px] font-mono text-slate-600 pt-2 border-t border-emerald-200 flex justify-between">
                  <span>Authorized Authority: AP Transport Verification Board</span>
                  <span>Granted: {app.permission_granted_at ? new Date(app.permission_granted_at).toLocaleString() : 'Recent'}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold text-amber-900">Verification In Progress</p>
                  <p className="text-slate-600 mt-0.5">
                    Your driver Aadhaar, DL, and RC documents are under verification by the transport board.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
