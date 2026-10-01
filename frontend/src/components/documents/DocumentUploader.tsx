import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle, FileText, RefreshCw, Eye, CheckCircle2, X } from 'lucide-react';
import { DocumentItem, DocumentType } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';

export interface DocumentUploaderProps {
  documentType: DocumentType;
  existingDocument?: DocumentItem;
  onUpload: (file: File) => Promise<void>;
  onPreview: (versionId: string) => void;
  disabled?: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  documentType,
  existingDocument,
  onUpload,
  onPreview,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Staging state before upload confirmation
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentVersion = existingDocument?.current_version;
  const maxMb = (documentType.max_file_size_bytes / (1024 * 1024)).toFixed(0);

  const validateAndStageFile = (file: File) => {
    if (!file) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    // Format validation
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const allowedExts = documentType.supported_extensions.map(e => e.toLowerCase().replace('.', ''));
    
    if (!allowedExts.includes(ext)) {
      setErrorMsg(`Invalid format .${ext}. Allowed formats: ${allowedExts.join(', ').toUpperCase()}`);
      return;
    }

    // Size validation
    if (file.size > documentType.max_file_size_bytes) {
      const fileMb = (file.size / (1024 * 1024)).toFixed(2);
      setErrorMsg(`File size (${fileMb} MB) exceeds maximum allowed limit of ${maxMb} MB.`);
      return;
    }

    // File is valid -> Stage it for "Use this file" selection
    setStagedFile(file);
  };

  const handleConfirmUpload = async () => {
    if (!stagedFile) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setUploading(true);

    try {
      await onUpload(stagedFile);
      const fileName = stagedFile.name;
      setUploadedFileName(fileName);
      setStagedFile(null);
      setShowSuccessModal(true);
      setSuccessMsg(`"${fileName}" uploaded successfully!`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndStageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !uploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndStageFile(file);
    }
  };

  const triggerFileSelect = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const cancelStagedFile = () => {
    setStagedFile(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const acceptFormats = documentType.supported_extensions
    .map(e => (e.startsWith('.') ? e : `.${e}`))
    .join(',');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all">
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        disabled={disabled || uploading}
        onChange={handleFileChange}
        accept={acceptFormats}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900">{documentType.name}</h4>
            {documentType.mandatory ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                Required
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                Optional
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">{documentType.description}</p>
        </div>

        {existingDocument ? (
          <Badge variant={existingDocument.status}>{existingDocument.status}</Badge>
        ) : (
          <Badge variant="neutral">Not Uploaded</Badge>
        )}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
        <span>Formats: <strong className="text-slate-700">{documentType.supported_extensions.join(', ').toUpperCase()}</strong></span>
        <span>•</span>
        <span>Max Size: <strong className="text-slate-700">{maxMb} MB</strong></span>
      </div>

      {stagedFile ? (
        /* Staged File Preview with "Use this file" option */
        <div className="p-4 bg-indigo-50/70 border-2 border-indigo-300 rounded-2xl space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Selected File Ready</span>
                <p className="text-xs font-bold text-slate-900 truncate">{stagedFile.name}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{(stagedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            <button
              onClick={cancelStagedFile}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors shrink-0"
              title="Cancel file selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-200/80">
            <Button
              size="sm"
              variant="outline"
              onClick={triggerFileSelect}
              disabled={uploading}
            >
              Choose Different File
            </Button>
            <Button
              size="sm"
              variant="primary"
              loading={uploading}
              onClick={handleConfirmUpload}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Use this file
            </Button>
          </div>
        </div>
      ) : currentVersion ? (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{currentVersion.original_file_name}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                <span>Version {currentVersion.version_number}</span>
                <span>•</span>
                <span>{(currentVersion.size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span>Uploaded {new Date(currentVersion.uploaded_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPreview(currentVersion.id)}
              icon={<Eye className="w-3.5 h-3.5" />}
            >
              Preview PDF
            </Button>

            {!disabled && (existingDocument.status !== 'Verified' || documentType.replacement_allowed) && (
              <Button
                size="sm"
                variant="secondary"
                loading={uploading}
                onClick={triggerFileSelect}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                type="button"
              >
                {existingDocument.status === 'Rejected' ? 'Re-upload File' : 'Replace File'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={triggerFileSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            disabled
              ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
              : isDragging
              ? 'border-indigo-500 bg-indigo-50/70 shadow-inner'
              : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/30'
          }`}
        >
          <UploadCloud className={`w-8 h-8 mx-auto mb-2 transition-transform ${isDragging ? 'scale-110 text-indigo-600' : 'text-indigo-500'}`} />
          <p className="text-xs font-bold text-slate-800">
            {uploading
              ? 'Processing & Uploading File...'
              : isDragging
              ? 'Drop PDF / Image file here to select'
              : 'Click or Drag PDF/Image File to Upload'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Select a file, then click "Use this file" to confirm upload</p>
        </div>
      )}

      {currentVersion?.verification_status === 'Rejected' && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-900">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Document Rejection Notice: {currentVersion.rejection_reason}</span>
          </div>
          {currentVersion.rejection_remarks && (
            <p className="text-slate-700 text-[11px] pl-5.5 font-medium">Verifier Remarks: {currentVersion.rejection_remarks}</p>
          )}
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* File Uploaded Successfully Popup Modal */}
      <Dialog
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="File Uploaded Successfully"
        description="Official document record updated"
        maxWidth="md"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900">Upload Confirmed</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your document <strong className="text-slate-900 font-semibold">"{uploadedFileName}"</strong> for{' '}
              <span className="text-indigo-600 font-bold">{documentType.name}</span> has been uploaded successfully according to portal guidelines.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-center justify-center gap-2 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Document version registered & pending verification</span>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setShowSuccessModal(false)}
            >
              OK, Got it
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

