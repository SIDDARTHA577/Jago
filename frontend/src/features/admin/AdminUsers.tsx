import React, { useEffect, useState } from 'react';
import { Profile, UserRole } from '../../types';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Users } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);

  const loadUsers = async () => {
    const list = await adminService.getUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await adminService.updateUserProfile(userId, { role_key: newRole });
    await loadUsers();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          <span>User & RBAC Role Management</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage system users, assign system roles (Pilot/Driver, Verifier, Admin), and enforce access permissions.
        </p>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader title="Registered System Users" description="All driver applicants, document verifiers, and administrators" />
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email / Contact</th>
                <th className="p-4">DL & Vehicle Plate</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Role Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{u.name}</td>
                  <td className="p-4 text-slate-600 font-mono">
                    <div>{u.email}</div>
                    <div className="text-[10px] text-slate-400 font-sans">{u.phone || 'N/A'}</div>
                  </td>
                  <td className="p-4 text-slate-700 font-mono">
                    {u.role_key === 'pilot' ? (
                      <div>
                        <div className="font-bold text-indigo-700">{u.vehicle_number || 'Not Provided'}</div>
                        <div className="text-[10px] text-slate-500 font-sans">DL: {u.license_number || 'Not Provided'}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">N/A (Staff)</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant="info" className="capitalize font-bold">
                      {u.role_key}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={u.role_key}
                      onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    >
                      <option value="pilot">Pilot / Driver</option>
                      <option value="verifier">Verifier</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
