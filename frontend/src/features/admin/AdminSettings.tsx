import React, { useEffect, useState } from 'react';
import { SystemSetting } from '../../types';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';
import { Card, CardContent } from '../../components/ui/Card';
import { Settings } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);

  const loadSettings = async () => {
    const list = await adminService.getSystemSettings();
    setSettings(list);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleUpdate = async (setting: SystemSetting, newValue: any) => {
    const user = await authService.getCurrentUser();
    await adminService.updateSystemSetting(setting.id, newValue, user?.id || 'admin');
    await loadSettings();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-sky-600" />
          <span>System Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          System configurations for file size limits, authentication security, and workflow models.
        </p>
      </div>

      <div className="space-y-4">
        {settings.map(s => (
          <Card key={s.id}>
            <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 font-mono">{s.key}</h4>
                </div>
                <p className="text-xs text-slate-500">{s.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {s.value_type === 'boolean' ? (
                  <select
                    value={String(s.value)}
                    onChange={e => handleUpdate(s, e.target.value === 'true')}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                  >
                    <option value="true">Enabled (True)</option>
                    <option value="false">Disabled (False)</option>
                  </select>
                ) : s.value_type === 'number' ? (
                  <input
                    type="number"
                    value={Number(s.value)}
                    onChange={e => handleUpdate(s, Number(e.target.value))}
                    className="w-28 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                  />
                ) : (
                  <input
                    type="text"
                    value={typeof s.value === 'object' ? JSON.stringify(s.value) : String(s.value)}
                    onChange={e => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        handleUpdate(s, parsed);
                      } catch {
                        handleUpdate(s, e.target.value);
                      }
                    }}
                    className="w-64 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

