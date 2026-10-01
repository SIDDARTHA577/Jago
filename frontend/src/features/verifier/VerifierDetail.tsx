import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Profile, Application, DocumentType } from '../../types';
import { applicationService } from '../../services/applicationService';
import { documentService } from '../../services/documentService';
import { verificationService, approvalService } from '../../services/verificationService';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { RejectionModal } from '../../components/verification/RejectionModal';
import { ApprovalModal } from '../../components/verification/ApprovalModal';
import { DocumentPreviewModal } from '../../components/documents/DocumentPreviewModal';
import { mockStore } from '../../lib/mockStore';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  AlertTriangle, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  Award,
  ArrowLeft,
  Car,
  Loader2,
  Check
} from 'lucide-react';

export interface VerifierDetailProps {
  user: Profile;
}

export const VerifierDetail: React.FC<VerifierDetailProps> = ({ user }) => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const [app, setApp] = useState<Application | null>(null);
  const [docTypes, setDocTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [rejectingDocVersionId, setRejectingDocVersionId] = useState<string | null>(null);
  const [rejectingDocName, setRejectingDocName] = useState<string>('');

  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [previewVersionId, setPreviewVersionId] = useState<string | null>(null);

  const loadData = async () => {
    if (!applicationId) return;
    const [application, types] = await Promise.all([
      applicationService.getApplicationById(applicationId),
      documentService.getDocumentTypes()
    ]);
    setApp(application);
    setDocTypes(types);
    setLoading(false);
    mockStore.markApplicationAsReviewed(applicationId);
  };

  useEffect(() => {
    loadData();
  }, [applicationId]);

  if (loading || !app) {
    return <div className="p-8 text-center text-slate-500 text-xs animate-pulse font-medium">Loading Application Verification Workspace...</div>;
  }

  const docs = app.documents || [];
  const activeMandatoryTypes = docTypes.filter(dt => dt.mandatory && dt.active);

  const missingMandatoryCount = activeMandatoryTypes.filter(dt => {
    const d = docs.find(doc => doc.document_type_id === dt.id);
    return !d || !d.current_version;
  }).length;

  const rejectedCount = docs.filter(d => d.status === 'Rejected').length;
  const isApprovalEligible = missingMandatoryCount === 0 && rejectedCount === 0;

  const handleVerifyDoc = async (documentVersionId: string) => {
    if (verifyingDocId) return; // Prevent double submit
    setVerifyingDocId(documentVersionId);
    try {
      await verificationService.verifyDocument(documentVersionId, user.id, 'Verified by authorized transport inspector');
      setToastMessage('Document verified successfully! Pilot notified.');
      setTimeout(() => setToastMessage(null), 3500);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setVerifyingDocId(null);
    }
  };

  const handleConfirmRejection = async (params: { reason: string; remarks: string; scope: 'DOCUMENT' | 'APPLICATION' }) => {
    if (!rejectingDocVersionId) return;
    await verificationService.rejectDocument({
      documentVersionId: rejectingDocVersionId,
      verifierId: user.id,
      reason: params.reason,
      remarks: params.remarks,
      rejectionScope: params.scope
    });
    setRejectingDocVersionId(null);
    await loadData();
  };

  const handleConfirmPermission = async (remarks: string) => {
    await approvalService.grantPermission(app.id, user.id, remarks);
    await loadData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-normal">Idempotent Single Notification Triggered</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/verifier/applications')}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assigned Applications Queue
        </button>

        <Badge variant={app.status}>{app.status}</Badge>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-6 bg-gradient-to-r from-indigo-50/70 via-slate-50 to-white space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xl font-extrabold text-indigo-700">{app.public_reference}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200">
                  Verification Target
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Created on {new Date(app.created_at).toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-2">
              {app.status === 'Permission Granted' ? (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Permission Authorized & Seal Issued
                </div>
              ) : (
                <Button
                  variant="success"
                  disabled={!isApprovalEligible}
                  onClick={() => setApprovalModalOpen(true)}
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Approve Application
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Driver Applicant</span>
                <strong className="text-slate-900 font-bold">{app.pilot?.name || 'N/A'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Phone Contact</span>
                <strong className="text-slate-800">{app.pilot?.phone || 'N/A'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Award className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Driving License (DL)</span>
                <strong className="font-mono text-slate-900 font-bold">{app.pilot?.license_number || 'Not Provided'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Car className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Vehicle Plate No.</span>
                <strong className="font-mono text-slate-900 font-bold">{app.pilot?.vehicle_number || 'Not Provided'}</strong>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={isApprovalEligible ? 'border-emerald-200 bg-emerald-50/40 shadow-sm' : 'border-amber-200 bg-amber-50/40 shadow-sm'}>
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isApprovalEligible ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            )}
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {isApprovalEligible
                  ? 'All Mandatory Verification Requirements Satisfied'
                  : 'Approval Gate Disabled: Verification Requirements Pending'}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {isApprovalEligible
                  ? 'Authorized verifier may confirm final approval to grant driver permission.'
                  : missingMandatoryCount > 0
                  ? `${missingMandatoryCount} mandatory document(s) are missing or incomplete.`
                  : 'Application contains rejected document(s) awaiting correction.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 tracking-tight">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>Uploaded Document Review List</span>
        </h3>

        <div className="space-y-4">
          {docTypes.map(dt => {
            const doc = docs.find(d => d.document_type_id === dt.id);
            const currentVer = doc?.current_version;

            return (
              <Card key={dt.id} className="bg-white border-slate-200/80 shadow-sm hover:border-slate-300 transition-colors">
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{dt.name}</h4>
                      {dt.mandatory ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200 uppercase">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                          Optional
                        </span>
                      )}
                      <Badge variant={doc ? doc.status : 'neutral'}>
                        {doc ? doc.status : 'Not Uploaded'}
                      </Badge>
                    </div>

                    {currentVer ? (
                      <div className="text-xs text-slate-700 space-y-1 font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <p>File: <strong className="text-slate-900 font-bold">{currentVer.original_file_name}</strong> (Version {currentVer.version_number})</p>
                        <p className="text-[11px] text-slate-500 font-sans">
                          Uploaded on {new Date(currentVer.uploaded_at).toLocaleString()} • {(currentVer.size_bytes / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {currentVer.rejection_reason && (
                          <div className="mt-1.5 pt-1.5 border-t border-rose-200 text-rose-700 font-sans">
                            <strong className="block text-rose-800">Rejection Reason: {currentVer.rejection_reason}</strong>
                            <span className="text-slate-700">Remarks: "{currentVer.rejection_remarks}"</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No document file uploaded yet by driver.</p>
                    )}
                  </div>

                  {currentVer && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewVersionId(currentVer.id)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Secure Preview
                      </Button>

                      {app.status !== 'Permission Granted' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            disabled={currentVer.verification_status === 'Verified' || verifyingDocId === currentVer.id}
                            onClick={() => handleVerifyDoc(currentVer.id)}
                            icon={verifyingDocId === currentVer.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          >
                            {verifyingDocId === currentVer.id ? 'Verifying...' : currentVer.verification_status === 'Verified' ? 'Verified' : 'Verify'}
                          </Button>

                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              setRejectingDocVersionId(currentVer.id);
                              setRejectingDocName(dt.name);
                            }}
                            icon={<XCircle className="w-3.5 h-3.5" />}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <RejectionModal
        isOpen={!!rejectingDocVersionId}
        onClose={() => setRejectingDocVersionId(null)}
        onConfirmRejection={handleConfirmRejection}
        documentName={rejectingDocName}
      />

      <ApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        application={app}
        onConfirmPermission={handleConfirmPermission}
      />

      <DocumentPreviewModal
        isOpen={!!previewVersionId}
        onClose={() => setPreviewVersionId(null)}
        documentVersionId={previewVersionId}
      />
    </div>
  );
};
