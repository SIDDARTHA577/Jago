import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  UploadCloud, 
  CheckSquare, 
  Bell, 
  BarChart3, 
  Users, 
  UserCheck, 
  FileCode, 
  Sliders, 
  ShieldAlert, 
  Settings, 
  Award
} from 'lucide-react';
import { UserRole } from '../../types';

export interface SidebarProps {
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 font-bold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 sticky top-16 h-[calc(100vh-4rem)] p-4 shadow-sm overflow-y-auto z-30">
      <div className="space-y-6">
        {role === 'pilot' && (
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
              Pilot Portal
            </div>
            <NavLink to="/pilot/dashboard" className={linkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Dashboard</span>
            </NavLink>
            <NavLink to="/pilot/profile" className={linkClass}>
              <User className="w-4 h-4" />
              <span>Pilot Profile</span>
            </NavLink>
            <NavLink to="/pilot/documents" className={linkClass}>
              <UploadCloud className="w-4 h-4" />
              <span>Document Upload & Status</span>
            </NavLink>
            <NavLink to="/pilot/status" className={linkClass}>
              <CheckSquare className="w-4 h-4" />
              <span>Permission Status</span>
            </NavLink>
            <NavLink to="/pilot/notifications" className={linkClass}>
              <Bell className="w-4 h-4" />
              <span>In-App Notifications</span>
            </NavLink>
          </nav>
        )}

        {role === 'verifier' && (
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
              Verification Workspace
            </div>
            <NavLink to="/verifier/dashboard" className={linkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Verifier Dashboard</span>
            </NavLink>
            <NavLink to="/verifier/applications" className={linkClass}>
              <FileText className="w-4 h-4" />
              <span>Assigned Applications</span>
            </NavLink>
            <NavLink to="/verifier/notifications" className={linkClass}>
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </NavLink>
            <NavLink to="/verifier/reports" className={linkClass}>
              <BarChart3 className="w-4 h-4" />
              <span>Verification Reports</span>
            </NavLink>
          </nav>
        )}

        {role === 'admin' && (
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
              Admin Workspace
            </div>
            <NavLink to="/admin/dashboard" className={linkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" className={linkClass}>
              <Users className="w-4 h-4" />
              <span>User & RBAC Management</span>
            </NavLink>
            <NavLink to="/admin/assignments" className={linkClass}>
              <UserCheck className="w-4 h-4" />
              <span>Verifier Assignments</span>
            </NavLink>
            <NavLink to="/admin/document-types" className={linkClass}>
              <FileCode className="w-4 h-4" />
              <span>Document Types Config</span>
            </NavLink>
            <NavLink to="/admin/verification-rules" className={linkClass}>
              <Sliders className="w-4 h-4" />
              <span>Workflow & Rules</span>
            </NavLink>
            <NavLink to="/admin/reports" className={linkClass}>
              <BarChart3 className="w-4 h-4" />
              <span>Operational Reports</span>
            </NavLink>
            <NavLink to="/admin/audit" className={linkClass}>
              <ShieldAlert className="w-4 h-4" />
              <span>System Audit Logs</span>
            </NavLink>
            <NavLink to="/admin/system-settings" className={linkClass}>
              <Settings className="w-4 h-4" />
              <span>System Settings</span>
            </NavLink>
            <NavLink to="/admin/notifications" className={linkClass}>
              <Bell className="w-4 h-4" />
              <span>In-App Notifications</span>
            </NavLink>
          </nav>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-center justify-between font-mono text-slate-700">
            <span>Status:</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              ONLINE
            </span>
          </div>
          <p className="text-[10px] text-slate-500">AP State Pilot Access Portal Active</p>
        </div>
      </div>
    </aside>
  );
};

