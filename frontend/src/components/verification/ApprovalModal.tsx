import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Application } from '../../types';

export interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onConfirmPermission: (remarks: string) => Promise<void>;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  application,
  onConfirmPermission
}) => {
  const [remarks, setRemarks] = useState('All mandatory driver identity, DL, and vehicle RC documents verified successfully.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onConfirmPermission(remarks);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Permission grant failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Grant Driver Permission Confirmation"
      description="Official Database Authorization Event • Mandatory Document Verification Completed"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Driver Permission Confirmation</span>
          </div>
          <p className="text-xs text-slate-700">
            You are granting final driver access permission for application{' '}
            <strong className="text-emerald-900 font-mono font-bold">{application.public_reference}</strong> ({application.pilot?.name}).
          </p>
        </div>

        <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p>• Driver Name: <strong className="text-slate-900 font-semibold">{application.pilot?.name}</strong></p>
          <p>• DL Number: <strong className="text-slate-900 font-semibold">{application.pilot?.license_number || 'N/A'}</strong></p>
          <p>• Vehicle Plate Number: <strong className="text-slate-900 font-semibold">{application.pilot?.vehicle_number || 'AP 39 TV 4589'}</strong></p>
          <p>• Verification Status: <strong className="text-emerald-700 font-bold">All Mandatory Documents Verified</strong></p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Approval Remarks / Endorsement Notes
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success" loading={loading} icon={<ShieldCheck className="w-4 h-4" />}>
            Grant Final Permission
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
