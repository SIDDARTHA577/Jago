import { Application, Profile, DocumentType, DocumentItem, DocumentVersion, NotificationItem, AuditLog, SystemSetting, ApplicationAssignment, AcceptanceRecord, PilotTestCheckitem, UserRole } from '../types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'p-pilot-1',
    auth_user_id: 'auth-pilot-1',
    role_key: 'pilot',
    name: 'K. Rajesh Varma',
    email: 'pilot@jago.com',
    phone: '+91 94401 23456',
    license_number: '',
    vehicle_number: '',
    vehicle_type: 'Auto Rickshaw (Passenger Vehicle)',
    address: 'Door No. 12-4-15, MG Road, Vijayawada, Andhra Pradesh 520010',
    password_hash: '41b28fabae303b62334f5fc12bd0d0afaefd038f24e897b41ff03659be659a2d',
    status: 'active',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-verifier-1',
    auth_user_id: 'auth-verifier-1',
    role_key: 'verifier',
    name: 'V. Lakshmi Prasanna',
    email: 'verifier@jago.com',
    phone: '+91 98492 87654',
    address: 'AP Secretariat H-Block, Amaravati, Andhra Pradesh 522237',
    password_hash: '8c49dc528463459b373a33f2feee638d87cf5372394267483b934f003316ef6a',
    status: 'active',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-admin-1',
    auth_user_id: 'auth-admin-1',
    role_key: 'admin',
    name: 'Ch. Venkat Rao',
    email: 'admin@jago.com',
    phone: '+91 94900 11223',
    address: 'IT Tower, Hill No. 3, Rushikonda, Visakhapatnam, Andhra Pradesh 530045',
    password_hash: 'cc9f4d092fdb02f8345a1d3e5b8a55427d8c1bd419af4603291c90ec20b913ee',
    status: 'active',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const INITIAL_DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'dt-1',
    name: 'Driver Identity & Aadhaar Card',
    code: 'GOVT_ID',
    description: 'Valid Aadhaar card or government-issued driver identity proof',
    active: true,
    mandatory: true,
    supported_extensions: ['pdf', 'jpg', 'jpeg', 'png'],
    supported_mime_types: ['application/pdf', 'image/jpeg', 'image/png'],
    max_file_size_bytes: 10485760,
    duplicate_policy: 'prevent',
    replacement_allowed: true,
    resubmission_allowed: true,
    participates_in_approval: true,
    display_order: 1,
    owner_confirmation_required: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'dt-2',
    name: 'Driving License (DL)',
    code: 'DRIVING_LICENSE',
    description: 'Valid Motor Vehicle Driving License issued by Transport Dept / RTO',
    active: true,
    mandatory: true,
    supported_extensions: ['pdf', 'jpg', 'jpeg', 'png'],
    supported_mime_types: ['application/pdf', 'image/jpeg', 'image/png'],
    max_file_size_bytes: 15728640,
    duplicate_policy: 'prevent',
    replacement_allowed: true,
    resubmission_allowed: true,
    participates_in_approval: true,
    display_order: 2,
    owner_confirmation_required: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'dt-3',
    name: 'Vehicle Registration Certificate (RC)',
    code: 'VEHICLE_RC',
    description: 'Official Vehicle Registration Certificate displaying registration number plate',
    active: true,
    mandatory: true,
    supported_extensions: ['pdf', 'jpg', 'jpeg', 'png'],
    supported_mime_types: ['application/pdf', 'image/jpeg', 'image/png'],
    max_file_size_bytes: 10485760,
    duplicate_policy: 'prevent',
    replacement_allowed: true,
    resubmission_allowed: true,
    participates_in_approval: true,
    display_order: 3,
    owner_confirmation_required: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'dt-4',
    name: 'Vehicle Fitness & Insurance Certificate',
    code: 'FITNESS_INSURANCE',
    description: 'Valid vehicle fitness certificate or motor insurance policy paper',
    active: true,
    mandatory: false,
    supported_extensions: ['pdf', 'jpg', 'jpeg', 'png'],
    supported_mime_types: ['application/pdf', 'image/jpeg', 'image/png'],
    max_file_size_bytes: 20971520,
    duplicate_policy: 'warn',
    replacement_allowed: true,
    resubmission_allowed: true,
    participates_in_approval: true,
    display_order: 4,
    owner_confirmation_required: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_SYSTEM_SETTINGS: SystemSetting[] = [
  {
    id: 'st-1',
    key: 'auth_otp_enabled',
    value: false,
    value_type: 'boolean',
    description: 'Require One-Time Password (OTP) verification on login',
    owner_confirmation_required: true,
    active: true
  },
  {
    id: 'st-2',
    key: 'max_file_size_global_mb',
    value: 20,
    value_type: 'number',
    description: 'Maximum global upload file size limit in Megabytes',
    owner_confirmation_required: true,
    active: true
  },
  {
    id: 'st-3',
    key: 'approval_hierarchy_mode',
    value: 'single_verifier',
    value_type: 'string',
    description: 'Approval authority model: single_verifier | admin_only | dual_verifier',
    owner_confirmation_required: true,
    active: true
  },
  {
    id: 'st-4',
    key: 'notification_channels_enabled',
    value: ['IN_APP', 'EMAIL'],
    value_type: 'json',
    description: 'Active notification dispatch channels',
    owner_confirmation_required: true,
    active: true
  }
];

export const INITIAL_PILOT_TEST_CHECKLIST: PilotTestCheckitem[] = [
  { id: 'tc-1', testCase: 'Login with valid credentials', expectedResult: 'User reaches correct dashboard according to role', status: 'Passed', category: 'Authentication' },
  { id: 'tc-2', testCase: 'Open document upload screen', expectedResult: 'Upload screen opens with mandatory document indicators', status: 'Passed', category: 'Document Upload' },
  { id: 'tc-3', testCase: 'Upload valid document', expectedResult: 'Document uploads successfully with version 1 tag', status: 'Passed', category: 'Document Upload' },
  { id: 'tc-4', testCase: 'Upload invalid file format or size', expectedResult: 'System shows clear client validation error', status: 'Passed', category: 'Validation' },
  { id: 'tc-5', testCase: 'Verifier opens assigned application', expectedResult: 'Verifier can view pilot details and document list', status: 'Passed', category: 'Verification' },
  { id: 'tc-6', testCase: 'Verify document', expectedResult: 'Document status becomes Verified with verifier stamp', status: 'Passed', category: 'Verification' },
  { id: 'tc-7', testCase: 'Reject document with valid reason', expectedResult: 'Reason is saved, document state becomes Rejected', status: 'Passed', category: 'Rejection' },
  { id: 'tc-8', testCase: 'Re-upload rejected document', expectedResult: 'New version created, status resets to Pending Verification', status: 'Passed', category: 'Re-submission' },
  { id: 'tc-9', testCase: 'Grant permission when mandatory documents verified', expectedResult: 'Confirmation dialog prompts, status becomes Permission Granted', status: 'Passed', category: 'Final Permission' }
];

class MockStore {
  private profiles: Profile[] = [...INITIAL_PROFILES];
  private documentTypes: DocumentType[] = [...INITIAL_DOCUMENT_TYPES];
  private systemSettings: SystemSetting[] = [...INITIAL_SYSTEM_SETTINGS];
  private checklist: PilotTestCheckitem[] = [...INITIAL_PILOT_TEST_CHECKLIST];
  private applications: Application[] = [];
  private assignments: ApplicationAssignment[] = [];
  private notifications: NotificationItem[] = [];
  private auditLogs: AuditLog[] = [];
  private acceptanceRecords: AcceptanceRecord[] = [];

  constructor() {
    this.loadFromStorage();
    if (this.applications.length === 0) {
      this.seedInitialApplication();
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('JAGO_STORE_APPLICATIONS', JSON.stringify(this.applications));
      localStorage.setItem('JAGO_STORE_NOTIFICATIONS', JSON.stringify(this.notifications));
      localStorage.setItem('JAGO_STORE_ASSIGNMENTS', JSON.stringify(this.assignments));
      localStorage.setItem('JAGO_STORE_AUDIT_LOGS', JSON.stringify(this.auditLogs));
      localStorage.setItem('JAGO_STORE_PROFILES', JSON.stringify(this.profiles));
      localStorage.setItem('JAGO_STORE_DOC_TYPES', JSON.stringify(this.documentTypes));
      localStorage.setItem('JAGO_STORE_SETTINGS', JSON.stringify(this.systemSettings));
    } catch (e) {
      console.warn('Failed to write to localStorage', e);
    }
  }

  private loadFromStorage() {
    try {
      const appsStr = localStorage.getItem('JAGO_STORE_APPLICATIONS');
      if (appsStr) this.applications = JSON.parse(appsStr);

      const notifsStr = localStorage.getItem('JAGO_STORE_NOTIFICATIONS');
      if (notifsStr) this.notifications = JSON.parse(notifsStr);

      const assignStr = localStorage.getItem('JAGO_STORE_ASSIGNMENTS');
      if (assignStr) this.assignments = JSON.parse(assignStr);

      const auditStr = localStorage.getItem('JAGO_STORE_AUDIT_LOGS');
      if (auditStr) this.auditLogs = JSON.parse(auditStr);

      const profStr = localStorage.getItem('JAGO_STORE_PROFILES');
      if (profStr) this.profiles = JSON.parse(profStr);

      const dtStr = localStorage.getItem('JAGO_STORE_DOC_TYPES');
      if (dtStr) this.documentTypes = JSON.parse(dtStr);

      const settStr = localStorage.getItem('JAGO_STORE_SETTINGS');
      if (settStr) this.systemSettings = JSON.parse(settStr);
    } catch (e) {
      console.warn('Failed to load from localStorage', e);
    }
  }

  private seedInitialApplication() {
    const appId = 'app-1001';
    const pilot = this.profiles.find(p => p.role_key === 'pilot')!;
    const verifier = this.profiles.find(p => p.role_key === 'verifier')!;

    const v1Id = 'ver-1001-1';
    const doc1Id = 'doc-1001-1';

    const docVersion1: DocumentVersion = {
      id: v1Id,
      document_id: doc1Id,
      version_number: 1,
      storage_bucket: 'jago-documents',
      storage_path: `jago/applications/${appId}/documents/${doc1Id}/versions/${v1Id}/pilot_passport.pdf`,
      original_file_name: 'Pilot_Passport_Govt_ID.pdf',
      mime_type: 'application/pdf',
      extension: 'pdf',
      size_bytes: 2450000,
      uploaded_by: pilot.id,
      uploaded_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      verification_status: 'Verified',
      verified_by: verifier.id,
      verified_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      active: true
    };

    const docItem1: DocumentItem = {
      id: doc1Id,
      application_id: appId,
      document_type_id: 'dt-1',
      current_version_id: v1Id,
      status: 'Verified',
      is_required_snapshot: true,
      uploaded_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      document_type: this.documentTypes.find(dt => dt.id === 'dt-1'),
      current_version: docVersion1,
      versions: [docVersion1]
    };

    const v2Id = 'ver-1001-2';
    const doc2Id = 'doc-1001-2';

    const docVersion2: DocumentVersion = {
      id: v2Id,
      document_id: doc2Id,
      version_number: 1,
      storage_bucket: 'jago-documents',
      storage_path: `jago/applications/${appId}/documents/${doc2Id}/versions/${v2Id}/pilot_license.pdf`,
      original_file_name: 'FAA_Commercial_Pilot_License.pdf',
      mime_type: 'application/pdf',
      extension: 'pdf',
      size_bytes: 3100000,
      uploaded_by: pilot.id,
      uploaded_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      verification_status: 'Pending Verification',
      active: true
    };

    const docItem2: DocumentItem = {
      id: doc2Id,
      application_id: appId,
      document_type_id: 'dt-2',
      current_version_id: v2Id,
      status: 'Pending Verification',
      is_required_snapshot: true,
      uploaded_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      document_type: this.documentTypes.find(dt => dt.id === 'dt-2'),
      current_version: docVersion2,
      versions: [docVersion2]
    };

    const initialApp: Application = {
      id: appId,
      public_reference: 'JAGO-2026-0891',
      pilot_user_id: pilot.id,
      status: 'Under Verification',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      submitted_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      pilot: pilot,
      assigned_verifier_id: verifier.id,
      assigned_verifier: verifier,
      documents: [docItem1, docItem2]
    };

    this.applications.push(initialApp);

    this.assignments.push({
      id: 'as-1',
      application_id: appId,
      verifier_user_id: verifier.id,
      assigned_by: this.profiles.find(p => p.role_key === 'admin')?.id,
      assigned_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      active: true,
      verifier,
      application: initialApp
    });

    this.notifications.push({
      id: 'notif-1',
      recipient_user_id: pilot.id,
      application_id: appId,
      type: 'DOCUMENT_VERIFIED',
      title: 'Document Verified',
      message: 'Your Pilot Identity & Government ID has been verified by Inspector Sarah Connor.',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    });

    this.auditLogs.push({
      id: 'aud-1',
      actor_user_id: pilot.id,
      actor_role: 'pilot',
      action: 'APPLICATION_SUBMITTED',
      entity_type: 'application',
      entity_id: appId,
      application_id: appId,
      metadata: { public_reference: 'JAGO-2026-0891' },
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      actor_name: pilot.name
    });
  }

  getDocumentVersionById(versionId: string): DocumentVersion | undefined {
    for (const app of this.applications) {
      for (const doc of app.documents || []) {
        const ver = doc.versions?.find(v => v.id === versionId);
        if (ver) return ver;
      }
    }
    return undefined;
  }

  getProfiles() { return this.profiles; }
  getProfileByRole(role: string) { return this.profiles.find(p => p.role_key === role); }

  registerUser(data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    password_hash?: string;
    address: string;
    state: string;
    pincode: string;
    license_number?: string;
    vehicle_number?: string;
    vehicle_type?: string;
    role_key?: UserRole;
  }): Profile {
    const existing = this.profiles.find(p => p.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error(`Account with email "${data.email}" already exists. Please Sign In.`);
    }

    const newId = `p-${Date.now()}`;
    const newProfile: Profile = {
      id: newId,
      auth_user_id: `auth-${Date.now()}`,
      role_key: data.role_key || 'pilot',
      name: data.name,
      email: data.email,
      phone: data.phone,
      license_number: data.license_number || '',
      vehicle_number: data.vehicle_number || '',
      vehicle_type: data.vehicle_type || 'Auto Rickshaw (Passenger Vehicle)',
      address: `${data.address}, ${data.state} - ${data.pincode}`,
      state: data.state,
      pincode: data.pincode,
      password_hash: data.password_hash,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.profiles.push(newProfile);

    if (newProfile.role_key === 'pilot') {
      this.getApplicationByPilot(newId);
    }

    this.logAudit(newId, newProfile.role_key, 'USER_REGISTERED', 'profile', newId, undefined, undefined, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      state: data.state,
      pincode: data.pincode,
      license_number: data.license_number,
      vehicle_number: data.vehicle_number
    });

    this.saveToStorage();
    return newProfile;
  }

  updateProfile(id: string, updates: Partial<Profile>) {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index !== -1) {
      this.profiles[index] = { ...this.profiles[index], ...updates, updated_at: new Date().toISOString() };
      this.logAudit(id, this.profiles[index].role_key, 'PROFILE_UPDATED', 'profile', id, undefined, undefined, updates);
      this.saveToStorage();
      return this.profiles[index];
    }
    return null;
  }

  getApplications() { return this.applications; }
  getApplicationById(id: string) { return this.applications.find(a => a.id === id); }
  getApplicationByPilot(pilotId: string) {
    let app = this.applications.find(a => a.pilot_user_id === pilotId);
    if (!app) {
      const newId = `app-${Date.now().toString().slice(-5)}`;
      const newRef = `JAGO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const pilot = this.profiles.find(p => p.id === pilotId);
      
      app = {
        id: newId,
        public_reference: newRef,
        pilot_user_id: pilotId,
        status: 'Pending Verification',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        pilot: pilot,
        documents: []
      };
      this.applications.push(app);
      this.logAudit(pilotId, 'pilot', 'APPLICATION_CREATED', 'application', newId, newId, undefined, { public_reference: newRef });
      this.saveToStorage();
    }
    return app;
  }

  getDocumentTypes() { return this.documentTypes; }
  saveDocumentType(dt: Partial<DocumentType>) {
    if (dt.id) {
      const idx = this.documentTypes.findIndex(item => item.id === dt.id);
      if (idx !== -1) {
        this.documentTypes[idx] = { ...this.documentTypes[idx], ...dt, updated_at: new Date().toISOString() };
      }
    } else {
      const newDt: DocumentType = {
        id: `dt-${Date.now()}`,
        name: dt.name || 'New Document Type',
        code: dt.code || `DOC_${Date.now()}`,
        description: dt.description || '',
        active: dt.active ?? true,
        mandatory: dt.mandatory ?? false,
        supported_extensions: dt.supported_extensions || ['pdf', 'jpg', 'png'],
        supported_mime_types: dt.supported_mime_types || ['application/pdf', 'image/jpeg'],
        max_file_size_bytes: dt.max_file_size_bytes || 10485760,
        duplicate_policy: dt.duplicate_policy || 'prevent',
        replacement_allowed: dt.replacement_allowed ?? true,
        resubmission_allowed: dt.resubmission_allowed ?? true,
        participates_in_approval: dt.participates_in_approval ?? true,
        display_order: this.documentTypes.length + 1,
        owner_confirmation_required: dt.owner_confirmation_required ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.documentTypes.push(newDt);
    }
    this.saveToStorage();
  }

  uploadDocument(params: {
    applicationId: string;
    documentTypeId: string;
    file: File;
    uploadedBy: string;
    fileDataUrl?: string;
  }) {
    const app = this.getApplicationById(params.applicationId);
    if (!app) throw new Error('Application not found');

    const docType = this.documentTypes.find(dt => dt.id === params.documentTypeId);
    if (!docType) throw new Error('Invalid document type');

    if (params.file.size > docType.max_file_size_bytes) {
      const maxMb = (docType.max_file_size_bytes / (1024 * 1024)).toFixed(0);
      throw new Error(`File size (${(params.file.size / 1024 / 1024).toFixed(2)} MB) exceeds maximum allowed limit of ${maxMb} MB.`);
    }

    const ext = params.file.name.split('.').pop()?.toLowerCase() || '';
    if (!docType.supported_extensions.includes(ext)) {
      throw new Error(`Unsupported file format .${ext}. Allowed formats: ${docType.supported_extensions.join(', ')}.`);
    }

    let docItem = app.documents?.find(d => d.document_type_id === params.documentTypeId);
    let isReplacement = false;
    let isResubmission = false;

    if (docItem) {
      if (docItem.status === 'Verified' && !docType.replacement_allowed) {
        throw new Error('Replacement is disabled for this verified document.');
      }
      if (docItem.status === 'Rejected') {
        isResubmission = true;
      } else {
        isReplacement = true;
      }
    }

    const docId = docItem ? docItem.id : `doc-${Date.now()}`;
    const versionNum = docItem?.versions ? docItem.versions.length + 1 : 1;
    const versionId = `ver-${Date.now()}-${versionNum}`;

    let fileUrl = params.fileDataUrl || '';
    if (!fileUrl) {
      try {
        if (params.file) {
          fileUrl = URL.createObjectURL(params.file);
        }
      } catch (e) {
        console.warn('Could not create Object URL for file', e);
      }
    }

    const newVersion: DocumentVersion = {
      id: versionId,
      document_id: docId,
      version_number: versionNum,
      storage_bucket: 'jago-documents',
      storage_path: `jago/applications/${app.id}/documents/${docId}/versions/${versionId}/${params.file.name}`,
      original_file_name: params.file.name,
      mime_type: params.file.type || 'application/octet-stream',
      extension: ext,
      size_bytes: params.file.size,
      uploaded_by: params.uploadedBy,
      uploaded_at: new Date().toISOString(),
      verification_status: 'Pending Verification',
      file_data_url: fileUrl,
      active: true
    };

    if (docItem) {
      docItem.current_version_id = versionId;
      docItem.current_version = newVersion;
      docItem.status = 'Pending Verification';
      docItem.updated_at = new Date().toISOString();
      docItem.versions = docItem.versions ? [...docItem.versions, newVersion] : [newVersion];
    } else {
      docItem = {
        id: docId,
        application_id: app.id,
        document_type_id: docType.id,
        current_version_id: versionId,
        status: 'Pending Verification',
        is_required_snapshot: docType.mandatory,
        uploaded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        document_type: docType,
        current_version: newVersion,
        versions: [newVersion]
      };
      app.documents = app.documents ? [...app.documents, docItem] : [docItem];
    }

    app.has_new_upload = true;
    app.last_uploaded_at = new Date().toISOString();
    app.unreviewed_docs_count = (app.documents || []).filter(d => d.status === 'Pending Verification' || d.status === 'Uploaded').length;

    this.recalculateApplicationStatus(app.id);

    const actionType = isResubmission ? 'DOCUMENT_RESUBMITTED' : (isReplacement ? 'DOCUMENT_REPLACED' : 'DOCUMENT_UPLOADED');
    this.logAudit(params.uploadedBy, 'pilot', actionType, 'document_version', versionId, app.id, docId, {
      file_name: params.file.name,
      version: versionNum
    });

    // Notify assigned verifier & admins about new upload or re-uploaded V2 document
    const pilot = this.profiles.find(p => p.id === params.uploadedBy);
    const pilotName = pilot?.name || 'Pilot Driver';

    const verifierRecipients = app.assigned_verifier_id 
      ? [app.assigned_verifier_id]
      : this.profiles.filter(p => p.role_key === 'verifier').map(p => p.id);

    const adminRecipients = this.profiles.filter(p => p.role_key === 'admin').map(p => p.id);
    const recipients = Array.from(new Set([...verifierRecipients, ...adminRecipients]));

    for (const recipientId of recipients) {
      if (recipientId !== params.uploadedBy) {
        this.addNotification({
          recipient_user_id: recipientId,
          application_id: app.id,
          document_id: docId,
          type: isResubmission || versionNum > 1 ? 'DOCUMENT_RESUBMITTED' : 'DOCUMENT_UPLOADED',
          title: isResubmission || versionNum > 1 ? `Re-uploaded Document (V${versionNum})` : 'New Document Uploaded',
          message: `Pilot ${pilotName} uploaded "${params.file.name}" for application ${app.public_reference}.`
        });
      }
    }

    this.saveToStorage();
    return docItem;
  }

  markApplicationAsReviewed(appId: string) {
    const app = this.getApplicationById(appId);
    if (app) {
      app.has_new_upload = false;
      this.saveToStorage();
    }
  }

  verifyDocument(documentVersionId: string, verifierId: string, remarks?: string) {
    let targetDoc: DocumentItem | undefined;
    let targetApp: Application | undefined;

    for (const app of this.applications) {
      const foundDoc = app.documents?.find(d => d.current_version_id === documentVersionId || d.versions?.some(v => v.id === documentVersionId));
      if (foundDoc) {
        targetDoc = foundDoc;
        targetApp = app;
        break;
      }
    }

    if (!targetDoc || !targetApp) throw new Error('Document version not found');

    const version = targetDoc.versions?.find(v => v.id === documentVersionId);
    if (!version) throw new Error('Version missing');

    // IDEMPOTENCY CHECK: If already verified, return immediately without duplicate notification or audit log
    if (version.verification_status === 'Verified') {
      return targetDoc;
    }

    version.verification_status = 'Verified';
    version.verified_by = verifierId;
    version.verified_at = new Date().toISOString();

    if (targetDoc.current_version_id === documentVersionId) {
      targetDoc.status = 'Verified';
      targetDoc.updated_at = new Date().toISOString();
    }

    this.recalculateApplicationStatus(targetApp.id);
    
    const unreviewedCount = (targetApp.documents || []).filter(d => d.status === 'Pending Verification' || d.status === 'Uploaded').length;
    targetApp.unreviewed_docs_count = unreviewedCount;
    if (unreviewedCount === 0) {
      targetApp.has_new_upload = false;
    }

    const verifier = this.profiles.find(p => p.id === verifierId);

    this.logAudit(verifierId, 'verifier', 'DOCUMENT_VERIFIED', 'document_version', documentVersionId, targetApp.id, targetDoc.id, {
      remarks: remarks || 'Verified by verifier'
    });

    this.addNotification({
      recipient_user_id: targetApp.pilot_user_id,
      application_id: targetApp.id,
      document_id: targetDoc.id,
      type: 'DOCUMENT_VERIFIED',
      title: 'Document Verified',
      message: `Your uploaded document "${version.original_file_name}" has been verified successfully by ${verifier?.name || 'verifier'}.`
    });

    this.saveToStorage();
    return targetDoc;
  }

  rejectDocument(params: {
    documentVersionId: string;
    verifierId: string;
    reason: string;
    remarks: string;
    rejectionScope: 'DOCUMENT' | 'APPLICATION';
  }) {
    if (!params.reason || !params.remarks) {
      throw new Error('Rejection reason and mandatory remarks are required.');
    }

    let targetDoc: DocumentItem | undefined;
    let targetApp: Application | undefined;

    for (const app of this.applications) {
      const foundDoc = app.documents?.find(d => d.current_version_id === params.documentVersionId || d.versions?.some(v => v.id === params.documentVersionId));
      if (foundDoc) {
        targetDoc = foundDoc;
        targetApp = app;
        break;
      }
    }

    if (!targetDoc || !targetApp) throw new Error('Document version not found');

    const version = targetDoc.versions?.find(v => v.id === params.documentVersionId);
    if (!version) throw new Error('Version missing');

    version.verification_status = 'Rejected';
    version.rejection_reason = params.reason;
    version.rejection_remarks = params.remarks;
    version.rejected_by = params.verifierId;
    version.rejected_at = new Date().toISOString();

    targetDoc.status = 'Rejected';
    targetDoc.updated_at = new Date().toISOString();

    if (params.rejectionScope === 'APPLICATION') {
      targetApp.status = 'Rejected';
    } else {
      this.recalculateApplicationStatus(targetApp.id);
    }

    const verifier = this.profiles.find(p => p.id === params.verifierId);

    this.logAudit(params.verifierId, 'verifier', 'DOCUMENT_REJECTED', 'document_version', params.documentVersionId, targetApp.id, targetDoc.id, {
      reason: params.reason,
      remarks: params.remarks,
      scope: params.rejectionScope
    });

    this.addNotification({
      recipient_user_id: targetApp.pilot_user_id,
      application_id: targetApp.id,
      document_id: targetDoc.id,
      type: 'DOCUMENT_REJECTED',
      title: 'Document Rejection Notice',
      message: `Your document "${version.original_file_name}" was rejected. Reason: ${params.reason}. Verifier Remarks: ${params.remarks}`
    });

    this.saveToStorage();
    return targetDoc;
  }

  grantPermission(applicationId: string, actorId: string, remarks?: string) {
    const app = this.getApplicationById(applicationId);
    if (!app) throw new Error('Application not found');

    const actor = this.profiles.find(p => p.id === actorId);
    if (!actor || (actor.role_key !== 'verifier' && actor.role_key !== 'admin')) {
      throw new Error('Unauthorized: Only authorized Verifiers or Admins can grant permission.');
    }

    const activeMandatoryTypes = this.documentTypes.filter(dt => dt.mandatory && dt.active);
    const appDocs = app.documents || [];

    for (const dt of activeMandatoryTypes) {
      const doc = appDocs.find(d => d.document_type_id === dt.id);
      if (!doc || !doc.current_version_id) {
        throw new Error(`Cannot grant permission: Mandatory document "${dt.name}" has not been uploaded.`);
      }
      if (doc.status === 'Rejected') {
        throw new Error(`Cannot grant permission: Mandatory document "${dt.name}" is rejected and pending re-upload.`);
      }
      if (doc.status !== 'Verified' && doc.current_version_id) {
        this.verifyDocument(doc.current_version_id, actorId, 'Verified during final approval grant');
      }
    }

    app.status = 'Permission Granted';
    app.approved_at = new Date().toISOString();
    app.permission_granted_at = new Date().toISOString();
    app.approved_by = actorId;
    app.approval_remarks = remarks || 'All mandatory documents verified. Driver permission granted.';
    app.updated_at = new Date().toISOString();

    this.logAudit(actorId, actor.role_key, 'PERMISSION_GRANTED', 'application', applicationId, applicationId, undefined, {
      remarks: app.approval_remarks,
      public_reference: app.public_reference
    });

    this.addNotification({
      recipient_user_id: app.pilot_user_id,
      application_id: app.id,
      type: 'PERMISSION_GRANTED',
      title: 'Permission Granted!',
      message: `Congratulations! Your driver application ${app.public_reference} has passed document verification and permission has been granted.`
    });

    this.saveToStorage();
    return app;
  }

  recalculateApplicationStatus(applicationId: string) {
    const app = this.getApplicationById(applicationId);
    if (!app) return;

    if (app.status === 'Permission Granted' || app.status === 'Approved') return;

    const docs = app.documents || [];
    const hasRejected = docs.some(d => d.status === 'Rejected');

    if (hasRejected) {
      app.status = 'Rejected';
    } else {
      const activeMandatoryTypes = this.documentTypes.filter(dt => dt.mandatory && dt.active);
      const verifiedMandatoryCount = activeMandatoryTypes.filter(dt => {
        const d = docs.find(doc => doc.document_type_id === dt.id);
        return d && d.status === 'Verified';
      }).length;

      if (activeMandatoryTypes.length > 0 && verifiedMandatoryCount === activeMandatoryTypes.length) {
        app.status = 'Verified';
      } else if (docs.length > 0) {
        app.status = 'Under Verification';
      } else {
        app.status = 'Pending Verification';
      }
    }
    app.updated_at = new Date().toISOString();
  }

  assignVerifier(applicationId: string, verifierId: string, assignedBy: string) {
    const app = this.getApplicationById(applicationId);
    if (!app) throw new Error('Application not found');

    const verifier = this.profiles.find(p => p.id === verifierId && p.role_key === 'verifier');
    if (!verifier) throw new Error('Invalid verifier profile');

    app.assigned_verifier_id = verifierId;
    app.assigned_verifier = verifier;

    this.assignments.push({
      id: `as-${Date.now()}`,
      application_id: applicationId,
      verifier_user_id: verifierId,
      assigned_by: assignedBy,
      assigned_at: new Date().toISOString(),
      active: true,
      verifier,
      application: app
    });

    this.logAudit(assignedBy, 'admin', 'APPLICATION_ASSIGNED', 'application_assignment', applicationId, applicationId, undefined, {
      verifier_name: verifier.name
    });

    this.addNotification({
      recipient_user_id: verifierId,
      application_id: applicationId,
      type: 'APPLICATION_ASSIGNED',
      title: 'New Application Assignment',
      message: `You have been assigned to verify application ${app.public_reference} (${app.pilot?.name}).`
    });

    return app;
  }

  getNotifications(userId: string) {
    return this.notifications.filter(n => n.recipient_user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  markNotificationRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read_at = new Date().toISOString();
  }

  markAllNotificationsRead(userId: string) {
    this.notifications.filter(n => n.recipient_user_id === userId).forEach(n => n.read_at = new Date().toISOString());
  }

  private addNotification(n: Omit<NotificationItem, 'id' | 'created_at'>) {
    this.notifications.push({
      ...n,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString()
    });
  }

  getAuditLogs() {
    return [...this.auditLogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  private logAudit(
    actorId: string,
    role: string,
    action: string,
    entityType: string,
    entityId?: string,
    appId?: string,
    docId?: string,
    metadata?: Record<string, any>
  ) {
    const actor = this.profiles.find(p => p.id === actorId);
    this.auditLogs.push({
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_user_id: actorId,
      actor_role: role,
      actor_name: actor?.name || 'System User',
      action,
      entity_type: entityType,
      entity_id: entityId,
      application_id: appId,
      document_id: docId,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    });
  }

  getSystemSettings() { return this.systemSettings; }
  updateSystemSetting(id: string, value: any, actorId: string) {
    const setting = this.systemSettings.find(s => s.id === id);
    if (setting) {
      setting.value = value;
      setting.updated_at = new Date().toISOString();
      this.logAudit(actorId, 'admin', 'SYSTEM_SETTING_CHANGED', 'system_setting', id, undefined, undefined, { key: setting.key, value });
    }
  }

  getTestChecklist() { return this.checklist; }
  updateChecklistItem(id: string, status: 'Passed' | 'Failed' | 'Pending', notes?: string) {
    const item = this.checklist.find(i => i.id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
    }
  }

  getAcceptanceRecords() { return this.acceptanceRecords; }
  saveAcceptanceRecord(rec: Omit<AcceptanceRecord, 'id' | 'evaluated_at'>) {
    const newRec: AcceptanceRecord = {
      ...rec,
      id: `acc-${Date.now()}`,
      evaluated_at: new Date().toISOString()
    };
    this.acceptanceRecords.push(newRec);
    return newRec;
  }
}

export const mockStore = new MockStore();
