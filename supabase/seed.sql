-- Jago System Initial Seed Script
-- Populates Roles, Permissions, Default Document Types, System Settings, and Initial Seed Accounts

-- 1. SEED ROLES
INSERT INTO public.roles (role_key, display_name, description) VALUES
('pilot', 'Pilot User', 'Pilot applicant submitting documents for verification and permission'),
('verifier', 'Verifier', 'Authorized verifier reviewing and validating pilot documents'),
('admin', 'Administrator', 'System administrator managing users, document types, RBAC, and settings')
ON CONFLICT (role_key) DO NOTHING;

-- 2. SEED PERMISSIONS
INSERT INTO public.permissions (permission_key, display_name, description, category) VALUES
('view_own_profile', 'View Own Profile', 'Allows viewing personal profile', 'profile'),
('edit_own_profile', 'Edit Own Profile', 'Allows editing personal profile details', 'profile'),
('upload_document', 'Upload Document', 'Allows uploading pilot documents', 'documents'),
('replace_document', 'Replace Document', 'Allows replacing document before verification', 'documents'),
('resubmit_document', 'Re-submit Document', 'Allows re-submitting rejected documents', 'documents'),
('view_own_application', 'View Own Application', 'Allows viewing personal application status', 'application'),
('view_assigned_application', 'View Assigned Application', 'Allows verifier to view assigned pilot applications', 'verification'),
('view_document', 'View/Preview Document', 'Allows secure preview of uploaded documents', 'documents'),
('verify_document', 'Verify Document', 'Allows verifier to approve individual documents', 'verification'),
('reject_document', 'Reject Document', 'Allows verifier to reject individual documents', 'verification'),
('reject_application', 'Reject Application', 'Allows verifier to reject entire application', 'verification'),
('grant_permission', 'Grant Permission', 'Allows granting final pilot permission', 'approval'),
('view_reports', 'View Reports', 'Allows viewing activity and verification reports', 'reports'),
('manage_users', 'Manage Users', 'Allows admin to create and manage user accounts', 'admin'),
('manage_roles', 'Manage Roles', 'Allows admin to manage user roles', 'admin'),
('manage_assignments', 'Manage Verifier Assignments', 'Allows admin to assign verifiers to applications', 'admin'),
('manage_document_types', 'Manage Document Types', 'Allows admin to configure document requirements', 'admin'),
('manage_verification_rules', 'Manage Verification Rules', 'Allows admin to set verification parameters', 'admin'),
('manage_notifications', 'Manage Notifications', 'Allows admin to configure notification delivery', 'admin'),
('view_audit', 'View Audit Trail', 'Allows admin to view system audit logs', 'admin'),
('manage_system_settings', 'Manage System Settings', 'Allows admin to configure system options', 'admin')
ON CONFLICT (permission_key) DO NOTHING;

-- 3. MAP ROLE PERMISSIONS
-- Pilot Permissions
INSERT INTO public.role_permissions (role_key, permission_key, allowed)
SELECT 'pilot', permission_key, true FROM public.permissions 
WHERE permission_key IN ('view_own_profile', 'edit_own_profile', 'upload_document', 'replace_document', 'resubmit_document', 'view_own_application', 'view_document')
ON CONFLICT (role_key, permission_key) DO UPDATE SET allowed = true;

-- Verifier Permissions
INSERT INTO public.role_permissions (role_key, permission_key, allowed)
SELECT 'verifier', permission_key, true FROM public.permissions 
WHERE permission_key IN ('view_own_profile', 'edit_own_profile', 'view_assigned_application', 'view_document', 'verify_document', 'reject_document', 'reject_application', 'grant_permission', 'view_reports')
ON CONFLICT (role_key, permission_key) DO UPDATE SET allowed = true;

-- Admin Permissions (All permissions)
INSERT INTO public.role_permissions (role_key, permission_key, allowed)
SELECT 'admin', permission_key, true FROM public.permissions
ON CONFLICT (role_key, permission_key) DO UPDATE SET allowed = true;

-- 4. SEED CONFIGURABLE DOCUMENT TYPES (Configurable & Owner Confirmation Required)
INSERT INTO public.document_types (name, code, description, mandatory, supported_extensions, supported_mime_types, max_file_size_bytes, duplicate_policy, replacement_allowed, resubmission_allowed, participates_in_approval, display_order, owner_confirmation_required) VALUES
('Pilot Identity & Government ID', 'GOVT_ID', 'Government-issued photo identification (Passport, National ID, or Driver License)', true, '["pdf","jpg","jpeg","png"]'::jsonb, '["application/pdf","image/jpeg","image/png"]'::jsonb, 10485760, 'prevent', true, true, true, 1, false),
('Aviation Pilot License / Certificate', 'PILOT_LICENSE', 'Official pilot license certification issued by regulatory authority', true, '["pdf","jpg","jpeg","png"]'::jsonb, '["application/pdf","image/jpeg","image/png"]'::jsonb, 15728640, 'prevent', true, true, true, 2, false),
('Medical Fitness Certificate', 'MEDICAL_CERT', 'Valid aviation medical fitness examination report', true, '["pdf","jpg","jpeg","png"]'::jsonb, '["application/pdf","image/jpeg","image/png"]'::jsonb, 10485760, 'prevent', true, true, true, 3, false),
('Flight Logbook Summary', 'LOGBOOK_SUMMARY', 'Certified summary logbook of total flight hours and pilot experience', false, '["pdf","jpg","jpeg","png"]'::jsonb, '["application/pdf","image/jpeg","image/png"]'::jsonb, 20971520, 'warn', true, true, true, 4, true)
ON CONFLICT (code) DO NOTHING;

-- 5. SEED SYSTEM SETTINGS (Owner Confirmation Required)
INSERT INTO public.system_settings (key, value, value_type, description, owner_confirmation_required) VALUES
('auth_otp_enabled', 'false'::jsonb, 'boolean', 'Enable OTP/MFA authentication step during login [Owner Confirmation Required]', true),
('max_file_size_global_mb', '20'::jsonb, 'number', 'Global max file upload size limit in MB [Owner Confirmation Required]', true),
('approval_hierarchy_mode', '"single_verifier"'::jsonb, 'string', 'Approval hierarchy configuration: single_verifier vs admin_only vs dual_approval [Owner Confirmation Required]', true),
('notification_channels_enabled', '["IN_APP", "EMAIL"]'::jsonb, 'json', 'Enabled notification dispatch channels [Owner Confirmation Required]', true),
('duplicate_upload_policy', '"prevent"'::jsonb, 'string', 'Global default action for duplicate file uploads: prevent vs warn [Owner Confirmation Required]', true)
ON CONFLICT (key) DO NOTHING;
