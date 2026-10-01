import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRejection: (params: { reason: string; remarks: string; scope: 'DOCUMENT' | 'APPLICATION' }) => Promise<void>;
  documentName?: string;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  onConfirmRejection,
  documentName
}) => {
  const [reason, setReason] = useState('Illegible / Poor Image Quality');
  const [remarks, setRemarks] = useState('');
  const [scope, setScope] = useState<'DOCUMENT' | 'APPLICATION'>('DOCUMENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setError('Mandatory rejection remarks are required.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onConfirmRejection({ reason, remarks, scope });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record rejection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Reject Document: ${documentName || ''}`}
      description="Mandatory Rejection Reason & Verifier Remarks Entry"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>Rejection action will notify the pilot user and set document state to Rejected until re-submitted.</span>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Rejection Target Scope
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setScope('DOCUMENT')}
              className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                scope === 'DOCUMENT'
                  ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Document Level Only
            </button>
            <button
              type="button"
              onClick={() => setScope('APPLICATION')}
              className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                scope === 'APPLICATION'
                  ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Entire Application
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Primary Rejection Reason
          </label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          >
            <option value="Illegible / Poor Image Quality">Illegible / Poor Image Quality</option>
            <option value="Expired License or Certificate">Expired License or Certificate</option>
            <option value="Document Name / Identity Mismatch">Document Name / Identity Mismatch</option>
            <option value="Incomplete Pages / Cut Off Document">Incomplete Pages / Cut Off Document</option>
            <option value="Uncertified Copy / Missing Stamp">Uncertified Copy / Missing Stamp</option>
            <option value="Other Regulatory Non-Compliance">Other Regulatory Non-Compliance</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Mandatory Verifier Remarks <span className="text-rose-600">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder="Specify clear instructions for the pilot to correct and re-upload..."
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          />
        </div>

        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={loading}>
            Confirm Rejection
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
