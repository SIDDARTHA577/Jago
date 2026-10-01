export type UserRole = 'pilot' | 'verifier' | 'admin';

export type ApplicationStatus = 
  | 'Pending Verification' 
  | 'Under Verification' 
  | 'Verified' 
  | 'Approved' 
  | 'Rejected' 
  | 'Permission Granted';

export type DocumentStatus = 
  | 'Uploaded' 
  | 'Pending Verification' 
  | 'Verified' 
  | 'Rejected';

export type DuplicatePolicy = 'prevent' | 'warn' | 'allow';
export type PilotStatus = 'Passed' | 'Passed with Changes' | 'Failed';

export interface Profile {
  id: string;
  auth_user_id: string;
  role_key: UserRole;
  name: string;
  email: string;
  phone?: string;
  license_number?: string; // Driving License Number
  vehicle_number?: string; // Vehicle Plate/Registration Number (e.g., AP 39 TV 4589)
  vehicle_type?: string;   // Vehicle Category (Auto, Bike, Car, Commercial)
  address?: string;
  state?: string;
  pincode?: string;
  password_hash?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface DocumentType {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  mandatory: boolean;
  supported_extensions: string[];
  supported_mime_types: string[];
  max_file_size_bytes: number;
  duplicate_policy: DuplicatePolicy;
  replacement_allowed: boolean;
  resubmission_allowed: boolean;
  participates_in_approval: boolean;
  display_order: number;
  owner_confirmation_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  storage_bucket: string;
  storage_path: string;
  original_file_name: string;
  mime_type: string;
  extension: string;
  size_bytes: number;
  checksum?: string;
  uploaded_by: string;
  uploaded_at: string;
  verification_status: DocumentStatus;
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  rejection_remarks?: string;
  rejected_by?: string;
  rejected_at?: string;
  file_data_url?: string;
  active: boolean;
}

export interface DocumentItem {
  id: string;
  application_id: string;
  document_type_id: string;
  current_version_id?: string;
  status: DocumentStatus;
  is_required_snapshot: boolean;
  uploaded_at: string;
  updated_at: string;
  document_type?: DocumentType;
  current_version?: DocumentVersion;
  versions?: DocumentVersion[];
}

export interface Application {
  id: string;
  public_reference: string;
  pilot_user_id: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  verified_at?: string;
  approved_at?: string;
  permission_granted_at?: string;
  approved_by?: string;
  approval_remarks?: string;
  pilot?: Profile;
  assigned_verifier_id?: string;
  assigned_verifier?: Profile;
  documents?: DocumentItem[];
  has_new_upload?: boolean;
  last_uploaded_at?: string;
  unreviewed_docs_count?: number;
}

export interface ApplicationAssignment {
  id: string;
  application_id: string;
  verifier_user_id: string;
  assigned_by?: string;
  assigned_at: string;
  active: boolean;
  verifier?: Profile;
  application?: Application;
}

export interface NotificationItem {
  id: string;
  recipient_user_id: string;
  application_id?: string;
  document_id?: string;
  type: string;
  title: string;
  message: string;
  read_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id?: string;
  actor_role?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  application_id?: string;
  document_id?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  created_at: string;
  actor_name?: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  value_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  owner_confirmation_required: boolean;
  active: boolean;
  updated_at?: string;
}

export interface AcceptanceRecord {
  id: string;
  application_id?: string;
  developer_name: string;
  tester_name: string;
  pilot_status: PilotStatus;
  open_issues?: string;
  final_remarks?: string;
  evaluated_at: string;
  created_by?: string;
}

export interface PilotTestCheckitem {
  id: string;
  testCase: string;
  expectedResult: string;
  status: 'Passed' | 'Failed' | 'Pending';
  category: string;
  notes?: string;
}
