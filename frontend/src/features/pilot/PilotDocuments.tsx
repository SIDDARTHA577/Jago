import React, { useEffect, useState } from 'react';
import { Profile, Application, DocumentType } from '../../types';
import { applicationService } from '../../services/applicationService';
import { documentService } from '../../services/documentService';
import { DocumentUploader } from '../../components/documents/DocumentUploader';
import { DocumentPreviewModal } from '../../components/documents/DocumentPreviewModal';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UploadCloud, ShieldCheck, CheckCircle2, Send, Save, AlertCircle, Info, FileText } from 'lucide-react';

export interface PilotDocumentsProps {
  user: Profile;
}

export const PilotDocuments: React.FC<PilotDocumentsProps> = ({ user }) => {
  const [app, setApp] = useState<Application | null>(null);
  const [docTypes, setDocTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewVersionId, setPreviewVersionId] = useState<string | null>(null);

  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    const [application, types] = await Promise.all([
      applicationService.getPilotApplication(user.id),
      documentService.getDocumentTypes()
    ]);
    setApp(application);
    setDocTypes(types);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  if (loading || !app) {
    return <div className="p-8 text-center text-slate-500 text-xs font-medium animate-pulse">Loading Document Upload Center...</div>;
  }

  const docs = app.documents || [];
  const mandatoryTypes = docTypes.filter(dt => dt.mandatory && dt.active);
  const uploadedMandatoryCount = mandatoryTypes.filter(dt => {
    const d = docs.find(doc => doc.document_type_id === dt.id);
    return d && d.current_version;
  }).length;

  const totalMandatory = mandatoryTypes.length;
  const isAllMandatoryUploaded = totalMandatory > 0 && uploadedMandatoryCount === totalMandatory;

  const handleUpload = async (docTypeId: string, file: File) => {
    try {
      await documentService.uploadDocument({
        applicationId: app.id,
        documentTypeId: docTypeId,
        file,
        uploadedBy: user.id
      });
      await loadData();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to upload document');
    }
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    setFeedbackMsg(null);
    try {
      // Refresh current state
      await loadData();
      setFeedbackMsg({ type: 'success', text: 'Document progress saved as draft successfully.' });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Failed to save draft progress.' });
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmitForVerification = async () => {
    if (!isAllMandatoryUploaded) {
      setFeedbackMsg({
        type: 'error',
        text: `Please upload all mandatory documents (${uploadedMandatoryCount}/${totalMandatory} uploaded) before submitting.`
      });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      // Reload & confirm submission status
      await loadData();
      setFeedbackMsg({
        type: 'success',
        text: 'Your document application has been submitted successfully for inspector verification!'
      });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Submission failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
            <UploadCloud className="w-6 h-6 text-indigo-600" />
            <span>Driver Document Upload Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload your driver Aadhaar card, Motor Vehicle Driving License (DL), and Vehicle Registration Certificate (RC).
          </p>
        </div>

        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2 text-slate-700 font-mono shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Ref ID: <strong className="text-slate-900">{app.public_reference}</strong></span>
        </div>
      </div>

      {/* Mandatory Progress Meter & Action Toolbar */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Mandatory Document Readiness</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isAllMandatoryUploaded
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {uploadedMandatoryCount} of {totalMandatory} Uploaded
                </span>
              </div>
              <p className="text-xs text-slate-500">
                All mandatory documents must be uploaded before final verification submission.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                loading={savingDraft}
                onClick={handleSaveDraft}
                icon={<Save className="w-4 h-4" />}
              >
                Save Progress Draft
              </Button>

              <Button
                variant="primary"
                loading={submitting}
                disabled={!isAllMandatoryUploaded || app.status === 'Permission Granted'}
                onClick={handleSubmitForVerification}
                icon={<Send className="w-4 h-4" />}
              >
                Submit for Verification
              </Button>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
              style={{ width: `${totalMandatory > 0 ? (uploadedMandatoryCount / totalMandatory) * 100 : 0}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {feedbackMsg && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
            : 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
        }`}>
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-indigo-950 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
        <span className="leading-relaxed">
          Please upload clear scan copies of your PDF or image files. Once submitted, your assigned document verifier will review each document and record official verification stamps.
        </span>
      </div>

      {/* Document Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {docTypes.map(dt => {
          const existingDoc = app.documents?.find(d => d.document_type_id === dt.id);
          return (
            <DocumentUploader
              key={dt.id}
              documentType={dt}
              existingDocument={existingDoc}
              onUpload={file => handleUpload(dt.id, file)}
              onPreview={versionId => setPreviewVersionId(versionId)}
              disabled={app.status === 'Permission Granted'}
            />
          );
        })}
      </div>

      <DocumentPreviewModal
        isOpen={!!previewVersionId}
        onClose={() => setPreviewVersionId(null)}
        documentVersionId={previewVersionId}
      />
    </div>
  );
};
