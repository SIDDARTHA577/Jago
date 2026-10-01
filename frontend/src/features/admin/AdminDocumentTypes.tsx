import React, { useEffect, useState } from 'react';
import { DocumentType } from '../../types';
import { documentService } from '../../services/documentService';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { FileCode, Plus, Edit2 } from 'lucide-react';

export const AdminDocumentTypes: React.FC = () => {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<Partial<DocumentType>>({});

  const loadData = async () => {
    const list = await documentService.getDocumentTypes();
    setTypes(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.saveDocumentType(editingType);
    setModalOpen(false);
    await loadData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-6 h-6 text-sky-600" />
            <span>Document Types & Requirements Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure pilot document upload requirements, mandatory flags, and file size limits.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => { setEditingType({}); setModalOpen(true); }}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Document Type
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {types.map(dt => (
          <Card key={dt.id}>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <span>{dt.name}</span>
                  {dt.mandatory ? (
                    <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-bold uppercase">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-medium uppercase">
                      Optional
                    </span>
                  )}
                </div>
              }
              description={`Code: ${dt.code}`}
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setEditingType(dt); setModalOpen(true); }}
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit
                </Button>
              }
            />
            <CardContent className="space-y-2 text-xs text-slate-700">
              <p className="text-slate-600">{dt.description}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
                <div>Max Size: <strong className="text-slate-900">{(dt.max_file_size_bytes / (1024 * 1024)).toFixed(0)} MB</strong></div>
                <div>Duplicate Policy: <strong className="text-sky-700 capitalize">{dt.duplicate_policy}</strong></div>
                <div>Extensions: <strong className="text-slate-900">{dt.supported_extensions.join(', ').toUpperCase()}</strong></div>
                <div>Approval Gate: <strong className="text-emerald-700">{dt.participates_in_approval ? 'Yes' : 'No'}</strong></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingType.id ? 'Edit Document Type' : 'Create Document Type'}
        description="Configure file limits and mandatory status"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Document Name"
            value={editingType.name || ''}
            onChange={e => setEditingType({ ...editingType, name: e.target.value })}
            required
          />

          <Input
            label="Unique Code"
            value={editingType.code || ''}
            onChange={e => setEditingType({ ...editingType, code: e.target.value })}
            required
          />

          <Input
            label="Description"
            value={editingType.description || ''}
            onChange={e => setEditingType({ ...editingType, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Mandatory Gate
              </label>
              <select
                value={editingType.mandatory ? 'true' : 'false'}
                onChange={e => setEditingType({ ...editingType, mandatory: e.target.value === 'true' })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              >
                <option value="true font-semibold">Mandatory Document</option>
                <option value="false">Optional Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Duplicate Policy
              </label>
              <select
                value={editingType.duplicate_policy || 'prevent'}
                onChange={e => setEditingType({ ...editingType, duplicate_policy: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              >
                <option value="prevent">Prevent Upload</option>
                <option value="warn">Warn User</option>
                <option value="allow">Allow Duplicates</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Document Type
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

