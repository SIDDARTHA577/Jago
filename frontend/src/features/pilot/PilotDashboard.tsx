import React, { useEffect, useState } from 'react';
import { Profile, Application, DocumentType } from '../../types';
import { applicationService } from '../../services/applicationService';
import { documentService } from '../../services/documentService';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, UploadCloud, ShieldCheck, FileText, ArrowRight, Car, IdCard } from 'lucide-react';

export interface PilotDashboardProps {
  user: Profile;
}

export const PilotDashboard: React.FC<PilotDashboardProps> = ({ user }) => {
  const [app, setApp] = useState<Application | null>(null);
  const [docTypes, setDocTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationService.getPilotApplication(user.id),
      documentService.getDocumentTypes()
    ]).then(([application, types]) => {
      setApp(application);
      setDocTypes(types);
      setLoading(false);
    });
  }, [user.id]);

  if (loading || !app) {
    return <div className="p-8 text-center text-slate-500 text-xs font-medium animate-pulse">Loading Your Driver Workspace...</div>;
  }

  const docs = app.documents || [];
  const mandatoryTypes = docTypes.filter(dt => dt.mandatory && dt.active);
  const verifiedCount = mandatoryTypes.filter(dt => {
    const d = docs.find(doc => doc.document_type_id === dt.id);
    return d && d.status === 'Verified';
  }).length;

  const rejectedDocs = docs.filter(d => d.status === 'Rejected');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 via-sky-600 to-blue-700 p-6 rounded-3xl text-white shadow-lg shadow-indigo-600/15">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight">Welcome back, {user.name}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold backdrop-blur-md border border-white/20">
              {app.status}
            </span>
          </div>
          <p className="text-xs text-sky-100 mt-1 font-mono">
            Application Reference ID: <strong className="text-white font-bold">{app.public_reference}</strong>
          </p>
        </div>

        <Link to="/pilot/documents">
          <Button variant="secondary" className="bg-white text-indigo-900 hover:bg-sky-50 font-bold border-0 shadow-md" icon={<UploadCloud className="w-4 h-4 text-indigo-600" />}>
            Upload Required Documents
          </Button>
        </Link>
      </div>

      {rejectedDocs.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-700">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Action Required: Document Needs Correction</span>
          </div>
          <p className="text-slate-700">
            {rejectedDocs.length} of your documents require attention. Please review the inspector remarks and re-upload an updated file.
          </p>
        </div>
      )}

      {app.status === 'Permission Granted' && (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-base text-emerald-800">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>Driver Permission & Vehicle Access Granted!</span>
          </div>
          <p className="text-xs text-slate-700">
            Your driver identity, driving license, and vehicle RC documents have been verified successfully. Your approval is active.
          </p>
          {app.approval_remarks && (
            <p className="text-xs text-slate-600 font-mono pt-1">Verification Remarks: "{app.approval_remarks}"</p>
          )}
        </div>
      )}

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Mandatory Document Progress</span>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-black text-slate-900">{verifiedCount} / {mandatoryTypes.length}</span>
              <span className="text-xs text-emerald-600 font-bold">Verified</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${mandatoryTypes.length > 0 ? (verifiedCount / mandatoryTypes.length) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Driver & Vehicle Identification</span>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <IdCard className="w-4 h-4 text-indigo-600" />
                <span>DL: <strong className="font-mono text-slate-900">{user.license_number || 'Not Provided'}</strong></span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <Car className="w-4 h-4 text-indigo-600" />
                <span>Plate: <strong className="font-mono text-slate-900">{user.vehicle_number || 'Not Provided'}</strong></span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">{user.vehicle_type || 'Auto Rickshaw / Passenger Vehicle'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Required Documents Checklist */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader
          title="Required Documents Checklist"
          description="Upload your driver identity card, driving license (DL), and vehicle registration certificate (RC)"
          action={
            <Link to="/pilot/documents">
              <Button size="sm" variant="outline" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Manage Documents
              </Button>
            </Link>
          }
        />
        <CardContent className="divide-y divide-slate-100">
          {docTypes.map(dt => {
            const doc = docs.find(d => d.document_type_id === dt.id);
            return (
              <div key={dt.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{dt.name}</span>
                      {dt.mandatory ? (
                        <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{dt.description}</p>
                  </div>
                </div>

                <Badge variant={doc ? doc.status : 'neutral'}>
                  {doc ? doc.status : 'Not Uploaded'}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
