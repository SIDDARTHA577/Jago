-- Jago Platform PostgreSQL Schema Migration
-- Complete RLS, Roles, RBAC, Document Versioning, Approvals, Notifications, Audit Trails

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS on all custom tables by default
-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_key TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_key TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROLE PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_key TEXT NOT NULL REFERENCES public.roles(role_key) ON DELETE CASCADE,
    permission_key TEXT NOT NULL REFERENCES public.permissions(permission_key) ON DELETE CASCADE,
    allowed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_key, permission_key)
);

-- 4. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role_key TEXT NOT NULL REFERENCES public.roles(role_key) DEFAULT 'pilot',
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    organization TEXT,
    designation TEXT,
    license_number TEXT,
    address TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_reference TEXT UNIQUE NOT NULL,
    pilot_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'Pending Verification' 
        CHECK (status IN ('Pending Verification', 'Under Verification', 'Verified', 'Approved', 'Rejected', 'Permission Granted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    permission_granted_at TIMESTAMPTZ,
    approved_by UUID REFERENCES public.profiles(id),
    approval_remarks TEXT
);

-- 6. APPLICATION ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.application_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    verifier_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE
);

-- 7. DOCUMENT TYPES TABLE (Admin Configurable)
CREATE TABLE IF NOT EXISTS public.document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    mandatory BOOLEAN DEFAULT TRUE,
    supported_extensions JSONB DEFAULT '["pdf","jpg","png","jpeg"]'::jsonb,
    supported_mime_types JSONB DEFAULT '["application/pdf","image/jpeg","image/png"]'::jsonb,
    max_file_size_bytes BIGINT DEFAULT 10485760, -- 10MB default
    duplicate_policy TEXT DEFAULT 'prevent' CHECK (duplicate_policy IN ('prevent', 'warn', 'allow')),
    replacement_allowed BOOLEAN DEFAULT TRUE,
    resubmission_allowed BOOLEAN DEFAULT TRUE,
    participates_in_approval BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 1,
    owner_confirmation_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    document_type_id UUID NOT NULL REFERENCES public.document_types(id) ON DELETE RESTRICT,
    current_version_id UUID, -- Foreign key constraint added after document_versions table creation
    status TEXT NOT NULL DEFAULT 'Uploaded'
        CHECK (status IN ('Uploaded', 'Pending Verification', 'Verified', 'Rejected')),
    is_required_snapshot BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(application_id, document_type_id)
);

-- 9. DOCUMENT VERSIONS TABLE
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    version_number INT NOT NULL DEFAULT 1,
    storage_bucket TEXT NOT NULL DEFAULT 'jago-documents',
    storage_path TEXT NOT NULL,
    original_file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    extension TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum TEXT,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    verification_status TEXT DEFAULT 'Pending Verification'
        CHECK (verification_status IN ('Pending Verification', 'Verified', 'Rejected')),
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    rejection_remarks TEXT,
    rejected_by UUID REFERENCES public.profiles(id),
    rejected_at TIMESTAMPTZ,
    active BOOLEAN DEFAULT TRUE,
    UNIQUE(document_id, version_number)
);

-- Circular FK link for current_version_id in documents
ALTER TABLE public.documents 
    ADD CONSTRAINT fk_documents_current_version 
    FOREIGN KEY (current_version_id) REFERENCES public.document_versions(id) ON DELETE SET NULL;

-- 10. VERIFICATION EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.verification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    document_version_id UUID REFERENCES public.document_versions(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('VERIFY', 'REJECT', 'RESET_TO_PENDING')),
    old_status TEXT,
    new_status TEXT NOT NULL,
    remarks TEXT,
    performed_by UUID NOT NULL REFERENCES public.profiles(id),
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. REJECTION RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.rejection_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    document_version_id UUID REFERENCES public.document_versions(id) ON DELETE SET NULL,
    rejection_scope TEXT NOT NULL CHECK (rejection_scope IN ('DOCUMENT', 'APPLICATION')),
    reason TEXT NOT NULL,
    remarks TEXT NOT NULL,
    rejected_by UUID NOT NULL REFERENCES public.profiles(id),
    rejected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolution_type TEXT CHECK (resolution_type IN ('RE_SUBMITTED', 'MANUALLY_OVERRIDDEN', 'CANCELLED'))
);

-- 12. APPROVAL EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.approval_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    action TEXT NOT NULL DEFAULT 'APPROVE',
    approved_by UUID NOT NULL REFERENCES public.profiles(id),
    approval_role TEXT NOT NULL,
    approval_remarks TEXT,
    approved_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PERMISSION EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.permission_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL DEFAULT 'PERMISSION_GRANTED',
    granted_by UUID NOT NULL REFERENCES public.profiles(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    remarks TEXT
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. NOTIFICATION DELIVERIES TABLE
CREATE TABLE IF NOT EXISTS public.notification_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('IN_APP', 'EMAIL', 'SMS', 'PUSH')),
    delivery_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (delivery_status IN ('PENDING', 'SENT', 'FAILED')),
    provider_reference TEXT,
    sent_at TIMESTAMPTZ,
    error_message TEXT
);

-- 16. AUDIT LOGS TABLE (Append-Only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES public.profiles(id),
    actor_role TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. SYSTEM SETTINGS TABLE (Owner-Confirmed Configs)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    value_type TEXT NOT NULL DEFAULT 'string',
    description TEXT,
    owner_confirmation_required BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. ACCEPTANCE RECORDS TABLE (Pilot Acceptance Verification)
CREATE TABLE IF NOT EXISTS public.acceptance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    developer_name TEXT NOT NULL,
    tester_name TEXT NOT NULL,
    pilot_status TEXT NOT NULL CHECK (pilot_status IN ('Passed', 'Passed with Changes', 'Failed')),
    open_issues TEXT,
    final_remarks TEXT,
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_applications_pilot_user_id ON public.applications(pilot_user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_application_assignments_verifier ON public.application_assignments(verifier_user_id);
CREATE INDEX IF NOT EXISTS idx_documents_application_id ON public.documents(application_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_application ON public.audit_logs(application_id);

-- SECURITY HELPER FUNCTIONS (Security Definer to prevent RLS recursion)
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS UUID AS $$
    SELECT id FROM public.profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_profile_role()
RETURNS TEXT AS $$
    SELECT role_key FROM public.profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_permission(p_permission_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_role TEXT;
    v_allowed BOOLEAN;
BEGIN
    SELECT role_key INTO v_role FROM public.profiles WHERE auth_user_id = auth.uid() LIMIT 1;
    IF v_role IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Admin has all permissions by default unless restricted
    IF v_role = 'admin' THEN
        RETURN TRUE;
    END IF;

    SELECT allowed INTO v_allowed 
    FROM public.role_permissions 
    WHERE role_key = v_role AND permission_key = p_permission_key;

    RETURN COALESCE(v_allowed, FALSE);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_access_application(p_application_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_profile_id UUID;
    v_role TEXT;
    v_is_owner BOOLEAN;
    v_is_assigned BOOLEAN;
BEGIN
    v_profile_id := public.current_profile_id();
    v_role := public.current_profile_role();

    IF v_role = 'admin' THEN
        RETURN TRUE;
    END IF;

    -- Check if pilot owner
    SELECT EXISTS(
        SELECT 1 FROM public.applications 
        WHERE id = p_application_id AND pilot_user_id = v_profile_id
    ) INTO v_is_owner;

    IF v_is_owner THEN
        RETURN TRUE;
    END IF;

    -- Check if verifier assigned
    IF v_role = 'verifier' THEN
        SELECT EXISTS(
            SELECT 1 FROM public.application_assignments 
            WHERE application_id = p_application_id AND verifier_user_id = v_profile_id AND active = TRUE
        ) INTO v_is_assigned;
        RETURN v_is_assigned;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- BUSINESS LOGIC FUNCTIONS
-- Status derivation function
CREATE OR REPLACE FUNCTION public.recalculate_application_status(p_application_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_current_status TEXT;
    v_has_rejected BOOLEAN;
    v_has_pending BOOLEAN;
    v_mandatory_count INT;
    v_verified_mandatory_count INT;
    v_new_status TEXT;
BEGIN
    SELECT status INTO v_current_status FROM public.applications WHERE id = p_application_id;

    -- Don't recalculate if already Approved/Permission Granted unless rejected
    IF v_current_status = 'Permission Granted' OR v_current_status = 'Approved' THEN
        RETURN v_current_status;
    END IF;

    -- Check for any rejected mandatory documents
    SELECT EXISTS(
        SELECT 1 FROM public.documents d
        JOIN public.document_types dt ON d.document_type_id = dt.id
        WHERE d.application_id = p_application_id AND dt.mandatory = TRUE AND d.status = 'Rejected'
    ) INTO v_has_rejected;

    IF v_has_rejected THEN
        v_new_status := 'Rejected';
    ELSE
        -- Total mandatory documents
        SELECT COUNT(*) INTO v_mandatory_count FROM public.document_types WHERE mandatory = TRUE AND active = TRUE;

        -- Verified mandatory documents for this app
        SELECT COUNT(*) INTO v_verified_mandatory_count
        FROM public.documents d
        JOIN public.document_types dt ON d.document_type_id = dt.id
        WHERE d.application_id = p_application_id AND dt.mandatory = TRUE AND dt.active = TRUE AND d.status = 'Verified';

        IF v_mandatory_count > 0 AND v_verified_mandatory_count >= v_mandatory_count THEN
            v_new_status := 'Verified';
        ELSE
            v_new_status := 'Under Verification';
        END IF;
    END IF;

    UPDATE public.applications 
    SET status = v_new_status, updated_at = NOW() 
    WHERE id = p_application_id;

    RETURN v_new_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ATOMIC PERMISSION GRANT TRANSACTION
CREATE OR REPLACE FUNCTION public.grant_application_permission(
    p_application_id UUID,
    p_remarks TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_profile_id UUID;
    v_role TEXT;
    v_app RECORD;
    v_unverified_mandatory_count INT;
    v_rejected_count INT;
BEGIN
    v_profile_id := public.current_profile_id();
    v_role := public.current_profile_role();

    -- Check authority: Verifier or Admin
    IF v_role NOT IN ('verifier', 'admin') THEN
        RAISE EXCEPTION 'Unauthorized: Only authorized Verifiers or Admins can grant final permission.';
    END IF;

    -- Load application
    SELECT * INTO v_app FROM public.applications WHERE id = p_application_id FOR UPDATE;
    IF v_app.id IS NULL THEN
        RAISE EXCEPTION 'Application not found.';
    END IF;

    -- Check mandatory documents unverified
    SELECT COUNT(*) INTO v_unverified_mandatory_count
    FROM public.document_types dt
    LEFT JOIN public.documents d ON dt.id = d.document_type_id AND d.application_id = p_application_id
    WHERE dt.mandatory = TRUE AND dt.active = TRUE 
    AND (d.id IS NULL OR d.status != 'Verified');

    IF v_unverified_mandatory_count > 0 THEN
        RAISE EXCEPTION 'Cannot grant permission: % mandatory document(s) are not yet verified.', v_unverified_mandatory_count;
    END IF;

    -- Check for any blocking rejections
    SELECT COUNT(*) INTO v_rejected_count
    FROM public.documents
    WHERE application_id = p_application_id AND status = 'Rejected';

    IF v_rejected_count > 0 THEN
        RAISE EXCEPTION 'Cannot grant permission: Application has % rejected document(s).', v_rejected_count;
    END IF;

    -- Perform transaction updates
    UPDATE public.applications
    SET status = 'Permission Granted',
        approved_at = NOW(),
        permission_granted_at = NOW(),
        approved_by = v_profile_id,
        approval_remarks = p_remarks,
        updated_at = NOW()
    WHERE id = p_application_id;

    -- Record approval event
    INSERT INTO public.approval_events (application_id, action, approved_by, approval_role, approval_remarks)
    VALUES (p_application_id, 'APPROVE', v_profile_id, v_role, p_remarks);

    -- Record permission event
    INSERT INTO public.permission_events (application_id, event_type, granted_by, remarks)
    VALUES (p_application_id, 'PERMISSION_GRANTED', v_profile_id, p_remarks);

    -- Audit log
    INSERT INTO public.audit_logs (actor_user_id, actor_role, action, entity_type, entity_id, application_id, metadata)
    VALUES (v_profile_id, v_role, 'PERMISSION_GRANTED', 'application', p_application_id, p_application_id, 
            jsonb_build_object('remarks', p_remarks, 'reference', v_app.public_reference));

    -- Create Notification for Pilot
    INSERT INTO public.notifications (recipient_user_id, application_id, type, title, message)
    VALUES (v_app.pilot_user_id, p_application_id, 'PERMISSION_GRANTED', 
            'Permission Granted!', 
            'Your application ' || v_app.public_reference || ' has been verified and permission has been granted.');

    RETURN jsonb_build_object('success', true, 'status', 'Permission Granted', 'reference', v_app.public_reference);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rejection_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permission_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acceptance_records ENABLE ROW LEVEL SECURITY;

-- ROLES & PERMISSIONS POLICIES
CREATE POLICY "Public read active roles" ON public.roles FOR SELECT USING (active = TRUE OR public.current_profile_role() = 'admin');
CREATE POLICY "Public read active permissions" ON public.permissions FOR SELECT USING (active = TRUE OR public.current_profile_role() = 'admin');
CREATE POLICY "Public read role permissions" ON public.role_permissions FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage roles" ON public.roles FOR ALL USING (public.current_profile_role() = 'admin');
CREATE POLICY "Admin manage permissions" ON public.permissions FOR ALL USING (public.current_profile_role() = 'admin');
CREATE POLICY "Admin manage role permissions" ON public.role_permissions FOR ALL USING (public.current_profile_role() = 'admin');

-- PROFILES POLICIES
CREATE POLICY "User view own profile or verifier/admin view" ON public.profiles FOR SELECT
USING (auth_user_id = auth.uid() OR public.current_profile_role() IN ('verifier', 'admin'));

CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL USING (public.current_profile_role() = 'admin');

-- APPLICATIONS POLICIES
CREATE POLICY "Pilot view own application or Verifier/Admin access" ON public.applications FOR SELECT
USING (
    pilot_user_id = public.current_profile_id() 
    OR public.current_profile_role() = 'admin' 
    OR (public.current_profile_role() = 'verifier' AND public.can_access_application(id))
);

CREATE POLICY "Pilot insert application" ON public.applications FOR INSERT
WITH CHECK (pilot_user_id = public.current_profile_id());

CREATE POLICY "Pilot update own application status or Verifier/Admin" ON public.applications FOR UPDATE
USING (
    pilot_user_id = public.current_profile_id() 
    OR public.current_profile_role() = 'admin' 
    OR (public.current_profile_role() = 'verifier' AND public.can_access_application(id))
);

-- ASSIGNMENTS POLICIES
CREATE POLICY "Verifier view own assignments or Admin manage" ON public.application_assignments FOR SELECT
USING (verifier_user_id = public.current_profile_id() OR public.current_profile_role() = 'admin');

CREATE POLICY "Admin manage assignments" ON public.application_assignments FOR ALL USING (public.current_profile_role() = 'admin');

-- DOCUMENT TYPES POLICIES
CREATE POLICY "Read active document types" ON public.document_types FOR SELECT USING (active = TRUE OR public.current_profile_role() = 'admin');
CREATE POLICY "Admin manage document types" ON public.document_types FOR ALL USING (public.current_profile_role() = 'admin');

-- DOCUMENTS & VERSIONS POLICIES
CREATE POLICY "View application documents" ON public.documents FOR SELECT
USING (public.can_access_application(application_id));

CREATE POLICY "Pilot upload document" ON public.documents FOR INSERT
WITH CHECK (public.can_access_application(application_id));

CREATE POLICY "Update document status" ON public.documents FOR UPDATE
USING (public.can_access_application(application_id));

CREATE POLICY "View document versions" ON public.document_versions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.documents d 
        WHERE d.id = document_id AND public.can_access_application(d.application_id)
    )
);

CREATE POLICY "Insert document version" ON public.document_versions FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.documents d 
        WHERE d.id = document_id AND public.can_access_application(d.application_id)
    )
);

CREATE POLICY "Update document version" ON public.document_versions FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.documents d 
        WHERE d.id = document_id AND public.can_access_application(d.application_id)
    )
);

-- VERIFICATION & REJECTION POLICIES
CREATE POLICY "View verification events" ON public.verification_events FOR SELECT
USING (public.can_access_application(application_id));

CREATE POLICY "Insert verification event" ON public.verification_events FOR INSERT
WITH CHECK (public.current_profile_role() IN ('verifier', 'admin') AND public.can_access_application(application_id));

CREATE POLICY "View rejection records" ON public.rejection_records FOR SELECT
USING (public.can_access_application(application_id));

CREATE POLICY "Insert rejection record" ON public.rejection_records FOR INSERT
WITH CHECK (public.current_profile_role() IN ('verifier', 'admin') AND public.can_access_application(application_id));

-- APPROVAL & PERMISSION EVENTS POLICIES
CREATE POLICY "View approval events" ON public.approval_events FOR SELECT
USING (public.can_access_application(application_id));

CREATE POLICY "View permission events" ON public.permission_events FOR SELECT
USING (public.can_access_application(application_id));

-- NOTIFICATIONS POLICIES
CREATE POLICY "View own notifications" ON public.notifications FOR SELECT
USING (recipient_user_id = public.current_profile_id() OR public.current_profile_role() = 'admin');

CREATE POLICY "Update own notifications" ON public.notifications FOR UPDATE
USING (recipient_user_id = public.current_profile_id());

CREATE POLICY "Insert notifications" ON public.notifications FOR INSERT
WITH CHECK (TRUE);

-- AUDIT LOGS POLICIES (Append-only for users, SELECT for Admin)
CREATE POLICY "Admin view audit logs" ON public.audit_logs FOR SELECT
USING (public.current_profile_role() = 'admin');

CREATE POLICY "Insert audit logs" ON public.audit_logs FOR INSERT
WITH CHECK (TRUE);

-- SYSTEM SETTINGS & ACCEPTANCE POLICIES
CREATE POLICY "Read system settings" ON public.system_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage system settings" ON public.system_settings FOR ALL USING (public.current_profile_role() = 'admin');

CREATE POLICY "View acceptance records" ON public.acceptance_records FOR SELECT USING (public.current_profile_role() IN ('verifier', 'admin'));
CREATE POLICY "Create acceptance records" ON public.acceptance_records FOR INSERT WITH CHECK (public.current_profile_role() IN ('verifier', 'admin'));
