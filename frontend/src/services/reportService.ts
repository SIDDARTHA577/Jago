import { mockStore } from '../lib/mockStore';

export interface ReportItem {
  [key: string]: any;
}

export const reportService = {
  getApplicationWiseReport(): ReportItem[] {
    const apps = mockStore.getApplications();
    return apps.map(app => {
      const docs = app.documents || [];
      const totalDocs = docs.length;
      const verifiedDocs = docs.filter(d => d.status === 'Verified').length;
      const pendingDocs = docs.filter(d => d.status === 'Pending Verification').length;
      const rejectedDocs = docs.filter(d => d.status === 'Rejected').length;

      return {
        public_reference: app.public_reference,
        pilot_name: app.pilot?.name || 'N/A',
        pilot_email: app.pilot?.email || 'N/A',
        vehicle_number: app.pilot?.vehicle_number || 'AP 39 TV 4589',
        status: app.status,
        total_documents: totalDocs,
        verified_documents: verifiedDocs,
        pending_documents: pendingDocs,
        rejected_documents: rejectedDocs,
        assigned_verifier: app.assigned_verifier?.name || 'Unassigned',
        created_at: new Date(app.created_at).toLocaleDateString()
      };
    });
  },

  getPendingDocumentsReport(): ReportItem[] {
    const apps = mockStore.getApplications();
    const result: ReportItem[] = [];

    apps.forEach(app => {
      app.documents?.forEach(doc => {
        if (doc.status === 'Pending Verification') {
          result.push({
            public_reference: app.public_reference,
            pilot_name: app.pilot?.name || 'N/A',
            document_name: doc.document_type?.name || 'Document',
            mandatory: doc.document_type?.mandatory ? 'Yes' : 'No',
            version_number: doc.current_version?.version_number || 1,
            uploaded_at: doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : 'N/A',
            assigned_verifier: app.assigned_verifier?.name || 'Unassigned'
          });
        }
      });
    });

    return result;
  },

  getVerifiedApplicationsReport(): ReportItem[] {
    const apps = mockStore.getApplications().filter(a => a.status === 'Verified' || a.status === 'Permission Granted' || a.status === 'Approved');
    return apps.map(app => ({
      public_reference: app.public_reference,
      pilot_name: app.pilot?.name || 'N/A',
      license_number: app.pilot?.license_number || 'N/A',
      vehicle_number: app.pilot?.vehicle_number || 'AP 39 TV 4589',
      assigned_verifier: app.assigned_verifier?.name || 'N/A',
      status: app.status,
      submitted_at: new Date(app.submitted_at).toLocaleDateString(),
      verified_at: app.verified_at ? new Date(app.verified_at).toLocaleDateString() : new Date(app.updated_at).toLocaleDateString()
    }));
  },

  getRejectedReport(): ReportItem[] {
    const apps = mockStore.getApplications();
    const result: ReportItem[] = [];

    apps.forEach(app => {
      app.documents?.forEach(doc => {
        doc.versions?.forEach(ver => {
          if (ver.verification_status === 'Rejected') {
            const rejectingUser = mockStore.getProfiles().find(p => p.id === ver.rejected_by);
            result.push({
              public_reference: app.public_reference,
              pilot_name: app.pilot?.name || 'N/A',
              document_type: doc.document_type?.name || 'Document',
              version: ver.version_number,
              file_name: ver.original_file_name,
              rejection_reason: ver.rejection_reason || 'N/A',
              rejection_remarks: ver.rejection_remarks || 'N/A',
              rejected_by: rejectingUser?.name || 'Verifier',
              rejected_at: ver.rejected_at ? new Date(ver.rejected_at).toLocaleString() : 'N/A'
            });
          }
        });
      });
    });

    return result;
  },

  getPermissionGrantedReport(): ReportItem[] {
    const apps = mockStore.getApplications().filter(a => a.status === 'Permission Granted');
    return apps.map(app => {
      const approver = mockStore.getProfiles().find(p => p.id === app.approved_by);
      return {
        public_reference: app.public_reference,
        pilot_name: app.pilot?.name || 'N/A',
        pilot_email: app.pilot?.email || 'N/A',
        license_number: app.pilot?.license_number || 'N/A',
        vehicle_number: app.pilot?.vehicle_number || 'AP 39 TV 4589',
        approved_by: approver?.name || 'Authorized Official',
        approval_remarks: app.approval_remarks || 'N/A',
        permission_granted_at: app.permission_granted_at ? new Date(app.permission_granted_at).toLocaleString() : 'N/A'
      };
    });
  },

  getVerifierActivityReport(): ReportItem[] {
    const verifiers = mockStore.getProfiles().filter(p => p.role_key === 'verifier');
    const apps = mockStore.getApplications();
    const audit = mockStore.getAuditLogs();

    return verifiers.map(v => {
      const assignedApps = apps.filter(a => a.assigned_verifier_id === v.id);
      const verifiedVerifications = audit.filter(a => a.actor_user_id === v.id && a.action === 'DOCUMENT_VERIFIED').length;
      const rejectionsDone = audit.filter(a => a.actor_user_id === v.id && a.action === 'DOCUMENT_REJECTED').length;
      const permissionsGranted = audit.filter(a => a.actor_user_id === v.id && a.action === 'PERMISSION_GRANTED').length;

      return {
        verifier_name: v.name,
        verifier_email: v.email,
        total_assigned_applications: assignedApps.length,
        documents_verified: verifiedVerifications,
        documents_rejected: rejectionsDone,
        permissions_granted: permissionsGranted,
        status: v.status
      };
    });
  },

  getDateWiseActivityReport(): ReportItem[] {
    const audit = mockStore.getAuditLogs().filter(a => ['DOCUMENT_VERIFIED', 'DOCUMENT_REJECTED', 'PERMISSION_GRANTED'].includes(a.action));
    const dateMap: Record<string, { date: string; verifications: number; rejections: number; permissions: number }> = {};

    audit.forEach(entry => {
      const dStr = new Date(entry.created_at).toLocaleDateString();
      if (!dateMap[dStr]) {
        dateMap[dStr] = { date: dStr, verifications: 0, rejections: 0, permissions: 0 };
      }
      if (entry.action === 'DOCUMENT_VERIFIED') dateMap[dStr].verifications++;
      if (entry.action === 'DOCUMENT_REJECTED') dateMap[dStr].rejections++;
      if (entry.action === 'PERMISSION_GRANTED') dateMap[dStr].permissions++;
    });

    return Object.values(dateMap);
  }
};
