import React, { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { documentService } from '../../services/documentService';
import { Loader2, ShieldCheck, Lock, Download } from 'lucide-react';
import { Button } from '../ui/Button';

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentVersionId: string | null;
  fileName?: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentVersionId,
  fileName
}) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && documentVersionId) {
      setLoading(true);
      setError(null);
      documentService
        .getDocumentPreviewUrl(documentVersionId)
        .then(url => setPreviewUrl(url))
        .catch(err => setError(err.message || 'Failed to load document preview'))
        .finally(() => setLoading(false));
    } else {
      setPreviewUrl(null);
    }
  }, [isOpen, documentVersionId]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = fileName || `Document_${documentVersionId || 'preview'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={fileName || 'Secure Document Preview'}
      description="Protected Storage Access • Verification Portal Stream"
      maxWidth="4xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Document Preview Active</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Lock className="w-3.5 h-3.5 text-sky-600" />
              <span>Verified Data Stream</span>
            </div>
            {previewUrl && (
              <Button
                size="sm"
                variant="primary"
                onClick={handleDownload}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Download Document
              </Button>
            )}
          </div>
        </div>

        <div className="w-full h-[550px] bg-slate-900 border border-slate-200 rounded-xl overflow-hidden relative flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
              <span>Loading Document Content...</span>
            </div>
          ) : error ? (
            <div className="text-center p-6 text-rose-500 text-xs space-y-2">
              <p className="font-bold">Preview Authorization Error</p>
              <p className="text-slate-400">{error}</p>
            </div>
          ) : previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0 bg-white"
              title="Document Preview"
            />
          ) : null}
        </div>
      </div>
    </Dialog>
  );
};

