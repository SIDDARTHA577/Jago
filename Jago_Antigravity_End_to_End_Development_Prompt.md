# Jago Website — Antigravity End-to-End Development Prompt

## 0. Master Instruction

Build the **complete Jago Website** from the attached **“JAGO WEBSITE DEVELOPMENT — Website Development Requirement & Pilot Verification Document — Version 1.0”**.

Treat this prompt as the **master implementation specification**. Do not omit, simplify, or replace any requirement from the source document.

The product is a **secure pilot-access, document-upload, document-verification, approval/permission, notification, reporting, administration, and audit platform**.

### Non-negotiable implementation rules

1. **Backend:** Supabase must be the backend platform.
2. Use:
   - Supabase Auth
   - Supabase PostgreSQL
   - Supabase Storage
   - Supabase Row Level Security (RLS)
   - Supabase Edge Functions for privileged/server-side workflows
   - Supabase Realtime where useful for status/notification updates
3. **Frontend:** Use **React + TypeScript + Vite**.
4. UI stack:
   - Tailwind CSS
   - shadcn/ui-style component architecture
   - React Router
   - React Hook Form + Zod
   - TanStack Query for server-state/data fetching
   - Recharts for dashboard/report visualizations where useful
   - Lucide icons
5. Reporting/export:
   - Excel export using a maintained XLSX-compatible library
   - PDF export using a maintained PDF generation library
6. Build the application as a **production-quality, responsive web application**, not a mockup.
7. Do not leave core features as TODOs, placeholders, fake buttons, non-functional menus, or static mock screens.
8. Do not expose Supabase service-role keys in the browser.
9. Do not create public document URLs.
10. Every protected operation must be enforced at the backend/database layer, not only hidden in the UI.
11. Do not silently invent business values that the source document explicitly says must be confirmed by the Jago project owner.
12. Where the source leaves a value/configuration undecided, implement it as a **configurable Admin setting**, clearly mark it as **Owner Confirmation Required**, and avoid hard-coding an arbitrary production business rule.
13. Use real database persistence. The finished application must work end-to-end against Supabase.
14. Include database migrations, seed/configuration scripts, RLS policies, Edge Functions, frontend, tests, environment configuration, and documentation.
15. Run linting, type-checking, tests and a production build before considering the implementation complete.
16. Fix errors rather than documenting them as known limitations unless the issue is genuinely blocked by a source requirement that requires owner confirmation.

---

# 1. Source Requirement Baseline

## 1.1 Project

**Project:** Jago Website

**Document:** Website Development Requirement & Pilot Verification Document

**Version:** 1.0

**Purpose:** Pilot access, uploaded document verification and permission workflow.

## 1.2 Project Objective

The website must:

- Provide a secure platform for pilot users to access the system.
- Allow pilot users to submit/upload required documents.
- Allow authorized users to verify submitted documents.
- Allow authorized users to approve/reject submissions.
- Grant final permission only after the configured verification requirements are satisfied.
- Record important actions for tracking and audit purposes.

---

# 2. User Roles and RBAC

Implement strict **Role-Based Access Control (RBAC)**.

Required roles:

### 2.1 Pilot User

Responsibilities:

- Secure login.
- Complete/update profile.
- Upload required documents.
- View own application/document status.
- View rejection reasons for own rejected documents/application.
- Re-upload corrected documents when re-submission is allowed.
- Receive/view notifications.
- View final permission status.

Pilot users must never:

- Access another pilot’s application.
- View another pilot’s documents.
- Verify documents.
- Reject documents/application.
- Grant permission.
- Manage users.
- Manage document types.
- Change verification rules.
- Change system permissions/settings.
- Access verifier/admin reports unless explicitly granted by future owner-configured permissions.

### 2.2 Verifier

Responsibilities:

- Access assigned applications.
- Open assigned application records.
- View authorized pilot details.
- Securely preview submitted documents.
- Verify individual documents.
- Reject individual documents or applications where configured.
- Enter mandatory rejection remarks/reasons.
- Review verification history.
- Approve/grant permission only if the configured approval authority allows the verifier to do so and all mandatory documents are verified.
- View relevant verification/activity reports.
- Receive relevant notifications.

Verifier must not access unassigned applications unless an explicit Admin permission/configuration allows it.

### 2.3 Admin

Responsibilities:

- Manage users.
- Manage user roles.
- Manage document types.
- Configure document requirements.
- Configure mandatory documents.
- Configure supported file types.
- Configure maximum file sizes.
- Configure duplicate-upload behavior.
- Configure replacement/re-submission rules.
- Manage permissions/RBAC configuration.
- Manage verifier/application assignment.
- Manage verification configuration.
- Manage approval authority/hierarchy.
- View/manage reports.
- View audit trail.
- Manage system settings.
- Manage notification configuration.
- Manage relevant system configuration.

Admin has full operational visibility, subject to safe system enforcement.

---

# 3. Required Modules

Implement these modules as real working features:

1. Login & Authentication
2. Pilot Registration/Profile
3. Application management
4. Document Upload
5. Document Verification
6. Approval / Permission
7. Rejection
8. Application Status
9. Notifications
10. Reports
11. Admin Settings
12. RBAC/permission management
13. Audit Trail
14. Final Acceptance / Pilot Test Checklist support

---

# 4. Recommended Application Architecture

## 4.1 Frontend

Use:

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Reusable accessible UI components
- React Hook Form
- Zod
- TanStack Query
- Recharts
- XLSX export
- PDF export
- Lucide icons

Use a clean architecture with:

```text
src/
  app/
  components/
  layouts/
  pages/
  routes/
  features/
    auth/
    profile/
    applications/
    documents/
    verification/
    approvals/
    notifications/
    reports/
    admin/
    audit/
  hooks/
  lib/
  services/
  schemas/
  types/
  utils/
```

Keep business rules out of presentation-only components.

## 4.2 Supabase

Use:

- Supabase Auth
- PostgreSQL database
- Supabase Storage
- RLS
- Edge Functions
- Realtime

All database access must respect RLS.

Use Edge Functions for actions that require trusted/server-side logic, including as appropriate:

- secure document preview URL generation
- sensitive approval workflow
- privileged role changes
- privileged admin operations
- notification dispatch
- report generation where server-side processing is preferable
- server-side validation/finalization of uploads
- other operations where the client must not be trusted

Never expose the service-role key to the frontend.

---

# 5. Authentication & Session Security

Implement secure:

- Login
- Logout
- Session persistence
- Session expiration/timeout
- Unauthorized-route protection
- Role-aware route protection
- Correct dashboard redirection after login

Support the source requirement for:

- Password authentication
- OTP authentication **if required**

Because the source says OTP support is conditional, implement OTP as a configurable capability rather than silently making it the required production login method.

Recommended design:

```text
Authentication method:
- Password
- OTP
- Password + optional OTP/MFA
```

Expose this through Admin/System configuration only where appropriate.

Use Supabase Auth.

Handle:

- invalid credentials
- expired sessions
- signed-out sessions
- unauthorized access
- disabled/inactive user
- session timeout
- protected route navigation
- clean logout

Do not reveal unnecessary authentication details in error messages.

---

# 6. User Registration & Pilot Profile

The Pilot User must be able to:

1. Access the Jago website.
2. Sign in using authorized credentials.
3. Complete the pilot profile.
4. Update profile information.
5. View their own stored information.

The profile must support:

- Name
- Contact details
- Any additional fields required by the configured Jago project setup

Do not invent final mandatory profile fields when the source says the mandatory fields are still to be confirmed.

Instead create a configurable/profile-field foundation so the project owner can finalize mandatory fields.

At minimum, the verifier screen must be able to display:

- Pilot Name
- Contact Details

---

# 7. Application Model

The system needs a persistent application/reference record so that documents and verification actions belong to a specific application.

Every application must have:

- unique application ID/reference
- pilot/user reference
- current application status
- assigned verifier(s), where applicable
- creation timestamp
- updated timestamp
- verification timestamps where applicable
- approval information where applicable
- final permission information where applicable

The system must support verifier assignment because the source explicitly states that a Verifier accesses **assigned applications**.

Admin must be able to assign/reassign applications to verifiers.

Do not expose internal IDs unnecessarily. The application must have a user-facing unique reference.

If an internal technical draft record is needed during incomplete profile/upload work, keep it as an internal technical state and do not introduce an unapproved business-facing status beyond the source status model.

---

# 8. Official Application Status Model

The source document requires these application/status concepts:

- Pending
- Under Verification
- Verified
- Approved
- Rejected
- Permission Granted

The implementation must preserve these source-defined statuses.

Recommended transition behavior:

```text
Initial submission
  -> Pending Verification

Verifier begins review
  -> Under Verification

All mandatory documents verified
  -> Verified

Authorized approval action confirmed
  -> Approved / Permission Granted

Rejected document/application
  -> Rejected

Corrected rejected document re-submitted
  -> Pending Verification
```

Where the source uses “Submitted / Pending Verification”, show the appropriate user-facing wording while maintaining one coherent internal status model.

When final approval is completed, record both:

- approval event
- permission-granted event/state

The final user-facing state should clearly communicate that permission has been granted.

---

# 9. Pilot User End-to-End Workflow

Implement the exact source workflow:

1. Pilot User opens Jago website.
2. User logs in using authorized credentials.
3. User completes/updates profile information.
4. User opens document upload section.
5. User uploads all required documents.
6. System validates file type, size and mandatory documents.
7. Application/document status becomes Submitted / Pending Verification.
8. Authorized Verifier opens the application.
9. Verifier reviews every uploaded document.
10. Verifier approves valid documents or rejects documents with remarks.
11. After successful verification, authorized user grants permission.
12. System records verifier, date/time and status.
13. Pilot user receives/views updated status.

Every step must produce the correct database state and UI state.

---

# 10. Document Configuration

Admin must be able to manage document types.

A document type configuration should support at least:

- document type name
- description
- active/inactive status
- mandatory/optional
- supported file formats
- maximum file size
- whether duplicates are allowed
- whether replacement is allowed
- whether re-submission is allowed after rejection
- whether the document participates in final approval requirements
- ordering/display sequence

The exact production values for:

- final document types
- mandatory fields/documents
- file-size limits
- supported formats

must remain configurable because the source explicitly says these require Jago project-owner confirmation.

Do not hard-code arbitrary production values.

---

# 11. Document Upload

## 11.1 User experience

The pilot user must have a clear document upload page containing:

- application reference
- list of required documents
- mandatory/optional indicator
- current upload/status
- upload control
- supported format information
- configured maximum size information
- preview action where supported
- replace action where permitted
- rejection reason where rejected
- re-upload/correction action where permitted

## 11.2 Validation

Validate:

- document type
- supported file type
- file extension
- MIME type
- maximum size
- mandatory document presence
- duplicate uploads
- application ownership
- allowed upload/replacement status
- user permissions

Validation must occur:

- client-side for fast UX
- server-side/backend side for security and correctness

Never rely only on frontend validation.

## 11.3 Duplicate Upload

The source requires the system to warn/prevent duplicate uploads where applicable.

Implement duplicate detection using a robust document identity such as:

- application
- document type
- current active version
- file hash/checksum

Make duplicate behavior configurable:

- Warn
- Prevent

Do not silently replace an existing file when the system should warn/prevent.

## 11.4 Preview

Users/verifiers should be able to preview documents where technically supported.

Support preview for common configured formats such as:

- PDF
- common image types

Do not publicly expose the storage object.

For unsupported preview formats, provide a secure authorized access/download mechanism if allowed by configuration.

## 11.5 Replace Document

Allow document replacement before final verification, subject to status/configuration rules.

Example policy model:

- Pending verification: replacement may be allowed if configured.
- Verified: replacement normally disabled unless an authorized rule explicitly permits it.
- Rejected: correction/re-upload may be allowed if configured.

When a new file replaces/re-submits a file, retain previous versions/history.

## 11.6 Upload Status

Display source-required document states:

- Uploaded
- Pending Verification
- Verified
- Rejected

---

# 12. Secure Document Storage

Create a **private Supabase Storage bucket** for Jago documents.

Documents must NOT be publicly accessible through unrestricted URLs.

Use:

- private bucket
- RLS policies on storage objects
- signed URLs with short expiration
- authorization checks before issuing preview/access URLs
- application ownership checks
- assigned-verifier checks
- admin authorization

Never use:

```text
public=true
```

for sensitive Jago documents.

Do not place permanent raw storage URLs in public database fields.

Preferred secure preview flow:

```text
User/Verifier requests preview
        |
        v
Authorized frontend request
        |
        v
Supabase Edge Function / secure backend action
        |
        +--> Check authenticated user
        +--> Check role
        +--> Check application access
        +--> Record VIEW audit event
        |
        v
Generate short-lived signed URL
        |
        v
Frontend previews document
```

---

# 13. Document Versioning & History

Preserve previous verification/rejection history.

Do not delete historical verification evidence when a rejected document is re-uploaded.

Use document versions.

A logical document can have:

```text
Document
  -> Version 1
  -> Version 2
  -> Version 3
```

Each version can retain:

- storage object path
- file name
- file type
- file size
- checksum/hash
- uploaded by
- uploaded at
- verification status
- verifier
- verification timestamp
- rejection reason
- remarks

The active version is the version currently participating in verification.

---

# 14. Document Verification Screen

Build a dedicated verifier-facing verification screen.

It must show:

### Required fields

- Application ID
- Pilot Name
- Contact Details
- Document List
- Document Preview
- Verification Result
- Remarks

### Actions

- Verify
- Reject
- Overall Approval, where allowed

### Verification states

- Pending
- Verified
- Rejected

### Verify action

When the verifier selects **Verify**:

1. Confirm the intended action.
2. Validate the verifier is authorized.
3. Validate the selected document belongs to an accessible application.
4. Update document verification state to Verified.
5. Record verifier identity.
6. Record date/time.
7. Record audit event.
8. Recalculate overall application status.
9. Generate relevant notification if the configured workflow requires it.

### Reject action

When the verifier selects **Reject**:

1. Open rejection confirmation UI.
2. Make rejection reason/remarks mandatory.
3. Reject the selected document/application.
4. Save rejection reason.
5. Save rejecting user.
6. Save date/time.
7. Record audit event.
8. Update application/document status appropriately.
9. Generate notification.
10. Enable correction/re-upload only if allowed by configured rules.

Never permit a rejection action without the mandatory rejection reason/remarks.

---

# 15. Application-Level Rejection

The Verifier must be able to reject:

- an individual document
- the entire application

according to configured rules.

The UI must clearly distinguish:

- document rejection
- application rejection

The rejection record must contain:

- rejection target
- reason/remarks
- rejected by
- rejected at
- affected document/version if applicable
- application reference

---

# 16. Rejection & Re-Submission

Implement the source requirements exactly:

- Verifier can reject an individual document or application according to rules.
- Rejection reason/remarks are mandatory.
- Pilot sees which document was rejected.
- Pilot sees the rejection reason.
- Pilot can upload corrected document where re-submission is allowed.
- Corrected document returns to Pending Verification.
- Previous verification/rejection history remains available to authorized users.

After re-upload:

```text
Rejected
   |
   v
Corrected document submitted
   |
   v
Pending Verification
   |
   v
Verifier review
   |
   +--> Verified
   |
   +--> Rejected again
```

Do not erase prior rejection records.

---

# 17. Approval / Permission Workflow

This is a critical business rule.

## 17.1 Authorization

Final permission can ONLY be granted by an authorized role.

The source states the authorized role is a configured:

- Verifier and/or
- Admin

The final approval hierarchy must remain configurable because the source explicitly says it must be confirmed by the Jago project owner.

## 17.2 Mandatory document rule

The system MUST NOT allow permission to be granted when mandatory documents remain:

- Pending
- Unverified
- Rejected

### Rule

```text
ALL mandatory documents verified
        |
        v
Enable Approval / Grant Permission

ANY mandatory document pending
        |
        v
Approval disabled

ANY mandatory document rejected
        |
        v
Approval disabled
+ show rejection reason
+ request correction/re-upload when allowed
```

This rule must be enforced at both:

- UI level
- server/database/Edge Function level

Never rely only on disabling a frontend button.

## 17.3 Approval confirmation

When an authorized user clicks approval:

1. Show confirmation popup.
2. Clearly show application/pilot reference.
3. Clearly state that permission will be granted.
4. Require explicit confirmation.
5. Re-check all mandatory document requirements on the server.
6. Re-check approval authority.
7. Record:
   - approved by
   - approval date/time
   - approval remarks
8. Change status to Approved / Permission Granted.
9. Record final permission event.
10. Record audit trail.
11. Notify the pilot.

The server must make the final authorization decision.

---

# 18. Notifications

Implement notifications for:

1. Document submission confirmation
2. Document verification completed
3. Document rejected with reason
4. Correction/re-upload required
5. Application approved / permission granted

Use an in-app notification center as a core feature.

Notifications should include:

- title
- message
- type
- recipient
- application reference where relevant
- document reference where relevant
- created timestamp
- read/unread state
- relevant action/deep link

Use Supabase Realtime where useful so status/notification updates can appear without unnecessary refreshes.

The final notification channels are **Owner Confirmation Required**. Build a notification service abstraction so future channels can be enabled without rewriting business logic.

Potential channel architecture:

```text
Notification event
      |
      v
Notification service
      |
      +--> In-app
      +--> Email adapter (optional/configurable)
      +--> SMS/OTP adapter (optional/configurable)
      +--> Other future channel
```

Do not assume a final third-party provider unless the Jago project owner specifies one.

---

# 19. Dashboards

## 19.1 Pilot Dashboard

Show:

- profile completion/status
- application/reference
- required documents
- document statuses
- current overall status
- rejection reasons
- re-upload actions where permitted
- notification summary
- final permission result

## 19.2 Verifier Dashboard

Show at least:

- Total assigned applications
- Pending Verification
- Under Verification
- Verified
- Rejected
- Approved / Permission Granted
- Recent Applications

Focus on assigned applications.

## 19.3 Admin Dashboard

Show at least the source-required metrics:

- Total Applications
- Pending Verification
- Verified Applications
- Rejected Applications/documents
- Approved / Permission Granted
- Recent Applications

Add useful drill-down/navigation from the metric cards.

Do not alter the source definitions.

---

# 20. Application List & Search

Build reusable application list components for Verifier/Admin.

Support:

- application ID/reference
- pilot name
- current status
- assigned verifier
- created date
- updated date
- verification state
- permission state

Provide practical filtering/search for usability, while preserving the source-defined report and status meanings.

At minimum support:

- search by application reference/name
- status filter
- date filter
- verifier filter for Admin
- rejected/pending focus

---

# 21. Admin Settings

Create a complete Admin Settings area.

Required capabilities:

### 21.1 User management

- list users
- search users
- view user
- activate/deactivate where required
- assign role
- change role
- manage verifier access
- view user status

### 21.2 Document types

- create
- edit
- activate/deactivate
- define mandatory/optional
- supported formats
- size limits
- duplicate policy
- replacement policy
- re-submission policy
- approval participation
- display order

### 21.3 Permissions / RBAC

- role-to-action configuration
- role capabilities
- safe defaults
- critical operations protected from accidental removal

### 21.4 Verification configuration

- required documents
- verification requirements
- application workflow configuration
- rejection/re-submission rules

### 21.5 Approval configuration

- authorized approval roles
- approval hierarchy
- enable/disable final approval path

### 21.6 Notification configuration

- enabled notification types
- enabled channels
- templates where appropriate
- channel configuration placeholders

### 21.7 System settings

Configuration for all source-listed owner-confirmed items:

- final document types
- mandatory fields
- maximum file sizes
- notification channels
- approval hierarchy
- technical/deployment settings where appropriate

Clearly label unresolved business settings as:

**Owner Confirmation Required**

---

# 22. RBAC Technical Design

Use both frontend route/action protection and database/backend enforcement.

Recommended conceptual permission model:

```text
roles
  - pilot
  - verifier
  - admin

permissions
  - view_own_profile
  - edit_own_profile
  - upload_document
  - replace_document
  - resubmit_document
  - view_own_application
  - view_assigned_application
  - view_document
  - verify_document
  - reject_document
  - reject_application
  - grant_permission
  - view_reports
  - manage_users
  - manage_roles
  - manage_document_types
  - manage_verification_rules
  - manage_notifications
  - view_audit
  - manage_system_settings
```

Admin may manage role mappings, but do not let role changes bypass core safety constraints.

Use secure PostgreSQL functions/security-definer functions carefully to avoid RLS recursion.

Potential helper functions:

```text
current_user_id()
current_user_role()
has_permission(permission_key)
can_access_application(application_id)
can_view_document(document_id)
can_grant_permission(application_id)
```

All security-sensitive checks must be server-side.

---

# 23. Database Schema

Create a normalized Supabase/PostgreSQL schema.

Recommended tables:

## Identity / user tables

### profiles

Fields conceptually:

- id
- auth_user_id
- role
- name
- contact fields
- status
- created_at
- updated_at

Do not force unconfirmed business fields.

### roles

- id
- role_key
- display_name
- active

### permissions

- id
- permission_key
- display_name
- description
- active

### role_permissions

- role_id
- permission_id
- allowed

---

## Application

### applications

- id
- public_reference
- pilot_user_id
- status
- created_at
- updated_at
- submitted_at
- verified_at
- approved_at
- permission_granted_at
- approved_by
- approval_remarks

### application_assignments

- id
- application_id
- verifier_user_id
- assigned_by
- assigned_at
- active

---

## Document configuration

### document_types

- id
- name
- description
- active
- mandatory
- supported_extensions
- supported_mime_types
- max_file_size_bytes
- duplicate_policy
- replacement_allowed
- resubmission_allowed
- participates_in_approval
- display_order
- created_at
- updated_at

---

## Application documents

### documents

- id
- application_id
- document_type_id
- current_version_id
- status
- is_required_snapshot
- uploaded_at
- updated_at

### document_versions

- id
- document_id
- version_number
- storage_bucket
- storage_path
- original_file_name
- mime_type
- extension
- size_bytes
- checksum
- uploaded_by
- uploaded_at
- verification_status
- verified_by
- verified_at
- rejection_reason
- rejection_remarks
- rejected_by
- rejected_at
- active

Do not physically delete historical versions when auditability requires retention.

---

## Verification history

### verification_events

- id
- application_id
- document_id nullable
- document_version_id nullable
- event_type
- old_status
- new_status
- remarks
- performed_by
- performed_at

---

## Rejections

### rejection_records

- id
- application_id
- document_id nullable
- document_version_id nullable
- rejection_scope
- reason
- remarks
- rejected_by
- rejected_at
- resolved_at nullable
- resolution_type nullable

---

## Approvals / permission

### approval_events

- id
- application_id
- action
- approved_by
- approval_role
- approval_remarks
- approved_at

### permission_events

- id
- application_id
- event_type
- granted_by
- granted_at
- remarks

---

## Notifications

### notifications

- id
- recipient_user_id
- application_id nullable
- document_id nullable
- type
- title
- message
- read_at nullable
- created_at

### notification_deliveries

- id
- notification_id
- channel
- delivery_status
- provider_reference nullable
- sent_at nullable
- error_message nullable

---

## Audit

### audit_logs

Must preserve a complete audit trail.

Fields:

- id
- actor_user_id
- actor_role
- action
- entity_type
- entity_id
- application_id nullable
- document_id nullable
- metadata JSONB
- ip/session metadata where appropriate and legally permitted
- created_at

At minimum audit:

- upload
- view
- verification
- rejection
- approval

Also audit important administrative/security changes such as:

- role change
- permission change
- document type/rule change
- assignment change
- settings change
- notification configuration change

---

## System configuration

### system_settings

- key
- value
- value_type
- description
- owner_confirmation_required
- active
- updated_by
- updated_at

Do not store secrets in ordinary system settings.

---

# 24. RLS Policy Requirements

Every sensitive table must have RLS enabled.

## Pilot rules

A Pilot may:

- read/update own profile as allowed
- read own applications
- read own document records
- create/upload documents for own application when allowed
- read own notifications
- mark own notifications read

A Pilot must not:

- read another pilot
- read another pilot application
- read another pilot document metadata
- update verification status
- create verification decisions
- approve
- grant permission
- manipulate audit logs

## Verifier rules

A Verifier may:

- read assigned applications
- read assigned application documents
- preview assigned documents through secure authorization
- create verification events for assigned applications
- reject assigned documents/applications when permitted
- view relevant history
- view relevant notifications
- grant permission only if configured as an approval authority

A Verifier must not:

- access unassigned applications unless explicitly configured
- alter role permissions
- modify audit history
- change core system settings unless explicitly permitted

## Admin rules

Admin may manage:

- users
- application assignments
- document types
- verification configuration
- permissions
- reports
- system settings
- approval configuration
- audit visibility

Never let clients bypass RLS by using direct table updates.

---

# 25. Storage RLS

Create a private storage bucket.

Object paths should be logically partitioned, e.g.:

```text
jago/
  applications/
    {application-id}/
      documents/
        {document-id}/
          versions/
            {version-id}/
```

Do not use raw user-controlled paths.

Ensure storage object policies verify:

- authenticated user
- role
- ownership/assignment
- application access
- document access
- admin rights

Do not allow anonymous read access.

---

# 26. Server-Side Validation

Every critical business rule must be revalidated server-side.

At minimum validate:

- authenticated identity
- role
- application ownership/access
- assignment
- document type validity
- mandatory document configuration
- file type
- file size
- duplicate rules
- replacement rules
- re-submission rules
- verification state transitions
- rejection requirements
- approval authority
- all mandatory-document verification status
- final permission eligibility

Use transactions for approval/permission actions so that partial updates cannot leave the application inconsistent.

---

# 27. Approval Transaction Safety

The grant-permission operation must be atomic.

Conceptually:

```text
BEGIN

1. Authenticate user
2. Verify approval authority
3. Lock/read application state
4. Load mandatory configured document requirements
5. Confirm every mandatory requirement has a valid verified version
6. Confirm no blocking rejection remains
7. Create approval event
8. Create permission event
9. Update application status
10. Record audit log
11. Create notification

COMMIT
```

If any validation fails:

```text
ROLLBACK
```

No partial permission state must be created.

---

# 28. Status Derivation

Do not allow inconsistent status combinations.

Create a central status-calculation service.

Conceptually:

```text
If mandatory document rejected
    -> Rejected

Else if mandatory document pending/unverified
    -> Pending Verification or Under Verification

Else if all mandatory documents verified
    -> Verified

Else after authorized final approval
    -> Approved / Permission Granted
```

Use the exact source business terms in user-facing labels.

Prevent impossible states, e.g.:

- Permission Granted while a mandatory document is Rejected.
- Permission Granted while a mandatory document is Pending.
- Verified status when required documents are not verified.
- Approval by unauthorized role.

---

# 29. Audit Trail

Every important action must be traceable.

Mandatory audit events:

- Document upload
- Document view
- Document verification
- Document rejection
- Application rejection
- Approval
- Permission grant

Also audit:

- login/security events where appropriate
- logout where useful
- role change
- user activation/deactivation
- assignment changes
- document rule changes
- settings changes
- permission changes
- notification configuration changes
- document replacement/re-submission

Each audit entry should identify:

- who
- what
- when
- which application
- which document/version where applicable
- previous state
- new state
- remarks/reason where applicable

Audit logs must be append-only from normal application paths.

Do not provide a UI operation that edits or deletes audit history.

---

# 30. Reports

Implement all source-required reports:

1. Application-wise verification report
2. Pending document verification report
3. Verified applications report
4. Rejected documents/application report with rejection reason
5. Permission granted report
6. Verifier-wise activity report
7. Date-wise approval and verification report

Each report should provide:

- table view
- correct data scope
- practical filters
- pagination for large datasets
- export where supported

Exports:

- Excel
- PDF

Ensure export access follows RBAC and RLS.

Do not expose report data belonging to unauthorized users.

---

# 31. Report Export Requirements

## Excel

Include:

- report title
- generated timestamp
- applied filters
- row data
- appropriate column headers

## PDF

Include:

- Jago branding/name
- report title
- generated timestamp
- applied filters
- data table
- page numbering where appropriate

Exports must represent the current filtered report, not unrelated data.

---

# 32. Notification Center UI

Build:

- notification bell
- unread count
- notification list
- read/unread state
- timestamps
- application/document links
- mark-as-read
- mark-all-as-read where appropriate

Notification templates must be clear and include rejection reason where applicable.

---

# 33. Page / Route Map

Implement role-aware routes.

## Public

```text
/login
```

Optional configurable auth routes:

```text
/otp
/forgot-password
/reset-password
```

## Pilot

```text
/pilot/dashboard
/pilot/profile
/pilot/application
/pilot/documents
/pilot/documents/:documentId
/pilot/notifications
/pilot/status
```

## Verifier

```text
/verifier/dashboard
/verifier/applications
/verifier/applications/:applicationId
/verifier/applications/:applicationId/documents/:documentId
/verifier/notifications
/verifier/reports
```

## Admin

```text
/admin/dashboard
/admin/users
/admin/users/:userId
/admin/applications
/admin/applications/:applicationId
/admin/assignments
/admin/document-types
/admin/permissions
/admin/verification-rules
/admin/approval-settings
/admin/notifications
/admin/reports
/admin/audit
/admin/system-settings
/admin/acceptance
```

Routes may be adapted to the final UX, but all functional areas above must exist.

---

# 34. UI/UX Requirements

The website must feel like a real professional business application.

Use:

- consistent layout
- left navigation/sidebar for protected dashboards
- responsive desktop/tablet/mobile layouts
- accessible forms
- keyboard-friendly controls
- clear status badges
- confirmation dialogs for destructive/sensitive actions
- loading states
- empty states
- error states
- success feedback
- skeleton loaders where useful
- accessible contrast
- meaningful validation messages
- clear document cards/table rows
- clear workflow progress

Status labels must be visually distinguishable but must not rely on color alone.

---

# 35. Document Verification UX

For the verifier, make the review workflow efficient.

Recommended layout:

```text
-------------------------------------------------
Application Header
Application ID | Pilot Name | Contact | Status
-------------------------------------------------
Documents
-------------------------------------------------
Document list | Preview | Verification actions
-------------------------------------------------
Verification history
-------------------------------------------------
Approval eligibility panel
-------------------------------------------------
```

For each document show:

- type
- mandatory/optional
- current version
- upload time
- uploaded by
- current status
- rejection reason if any
- preview
- verify action
- reject action

Show a clear explanation when overall approval is disabled:

Examples:

```text
Approval unavailable:
2 mandatory documents are still pending verification.
```

or

```text
Approval unavailable:
A mandatory document is rejected and requires correction.
```

The actual count must be computed dynamically.

---

# 36. Admin Assignment Workflow

Because Verifiers access **assigned applications**, implement:

1. Admin opens assignment screen.
2. Admin views pending/unassigned applications.
3. Admin chooses application.
4. Admin selects eligible Verifier.
5. Assignment is saved.
6. Assignment event is audited.
7. Verifier receives notification if configured.
8. Verifier sees the application on their dashboard.
9. Admin can reassign where permitted.
10. Historical assignment information remains auditable.

---

# 37. Error Handling

Handle all major error categories:

- network failure
- Supabase unavailable
- expired session
- unauthorized
- forbidden
- invalid upload
- file too large
- unsupported file
- duplicate file
- invalid state transition
- application not found
- document not found
- approval not allowed
- verification conflict
- notification failure
- report export failure

Do not reveal internal stack traces to end users.

Log technical details in a controlled development/operations channel.

---

# 38. Concurrency / Race Conditions

Prevent multiple users from making conflicting decisions.

Example:

If two authorized users attempt to verify/reject/approve simultaneously:

- re-check the latest state server-side
- reject stale operations safely
- preserve audit history
- avoid double approval
- avoid duplicate permission grants

Approval/permission must be idempotent.

---

# 39. Data Integrity

Use:

- foreign keys
- unique constraints
- check constraints where appropriate
- indexes
- transactional operations
- timestamps
- non-null constraints for genuinely required system fields

Examples:

- application reference unique
- document version numbers unique per document
- duplicate active assignment avoided
- role keys unique
- permission keys unique

Do not over-constrain business fields whose final requirements are still owner-confirmation items.

---

# 40. Privacy & Security

Treat uploaded documents as sensitive.

Requirements:

- private storage
- no public URLs
- least-privilege access
- RLS
- secure session management
- server-side authorization
- server-side validation
- safe error messages
- audit trail
- controlled downloads/previews
- no sensitive data in client logs
- no secrets committed to Git
- no Supabase service-role key in client bundle

Also protect against:

- insecure direct object reference
- privilege escalation
- cross-user data access
- unauthorized application access
- unauthorized document access
- unauthorized approval
- replay/double approval
- malicious file metadata
- oversized uploads
- invalid status transitions

---

# 41. Environment Configuration

Create `.env.example`.

Required categories:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Any secret/server-only key must be used only in Supabase Edge Functions/server environments and must NEVER use a `VITE_` prefix.

Document, notification, OTP and approval settings that require owner confirmation must be configurable.

---

# 42. Seed / Initialization

Create a safe initialization strategy.

Seed:

- core roles:
  - Pilot User
  - Verifier
  - Admin
- core permissions
- default document configuration structure
- notification types
- status definitions/configuration

Do not invent real Jago production document types or business limits.

For demo/development, provide clearly labeled sample configuration only.

Do not use fake hard-coded applications in production code.

---

# 43. Test Data / Demo Accounts

For local development/testing, create clearly labeled test users for:

- Pilot
- Verifier
- Admin

Never embed real credentials.

Provide documented steps to configure test identities through Supabase Auth.

---

# 44. Testing Requirements

Create unit, integration and end-to-end tests where practical.

At minimum test:

## Authentication

- valid login reaches correct dashboard
- invalid login is rejected
- logout works
- expired/invalid session is blocked
- role route protection works

## Document upload

- upload page opens
- valid document uploads
- invalid file rejected
- oversized file rejected
- duplicate handling works
- required documents tracked
- preview authorization works
- replacement rules work

## Verification

- verifier can access assigned application
- verifier cannot access unauthorized application
- document preview works
- verify changes status to Verified
- reject requires reason
- reject sets Rejected
- rejection reason persists

## Re-submission

- rejected document can be re-uploaded when allowed
- new version created
- status returns to Pending Verification
- previous rejection history preserved

## Approval

- unauthorized user cannot grant permission
- authorized user cannot approve with pending mandatory document
- authorized user cannot approve with rejected mandatory document
- authorized user can approve when all mandatory documents are verified
- confirmation is required
- approval records user/date/time/remarks
- permission-granted state is recorded
- pilot receives final status

## Audit

- upload audited
- view audited
- verify audited
- reject audited
- approve audited
- permission audited
- important admin actions audited

## Reports

- each required report returns correct data
- RBAC is respected
- Excel export works
- PDF export works

---

# 45. Exact Pilot Testing Checklist

Implement and/or automate the source checklist:

| Test Case | Expected Result |
|---|---|
| Login with valid credentials | User reaches correct dashboard |
| Open document upload | Upload screen opens correctly |
| Upload valid document | Document uploads successfully |
| Upload invalid file | System shows validation error |
| Verifier opens document | Document can be viewed |
| Verify document | Status becomes Verified |
| Reject document | Reason is captured and status is Rejected |
| Re-upload rejected document | Corrected document returns to verification |
| Grant permission | Only authorized role can approve |
| Check final status | Pilot sees updated status |
| Check audit history | Actions/date/user are recorded |

Provide Pass/Fail tracking for these checks.

---

# 46. Final Acceptance Support

The source document contains a Final Acceptance section.

Provide a final acceptance/QA screen or exportable acceptance record containing:

- Developer Name
- Tester / Verifier
- Pilot Status:
  - Passed
  - Passed with Changes
  - Failed
- Open Issues
- Final Remarks
- Date

The acceptance result should be persisted if an application-level acceptance workflow is implemented.

Do not remove this requirement simply because it is not a normal end-user feature.

---

# 47. Status / Workflow Rules Matrix

Implement and test this matrix:

| Condition | Allowed State / Action |
|---|---|
| Application submitted | Pending Verification |
| Verifier begins review | Under Verification |
| All mandatory documents verified | Verified |
| Mandatory document pending | Approval disabled |
| Mandatory document rejected | Approval disabled |
| Rejected document + resubmission allowed | Pilot may correct/re-upload |
| Corrected document submitted | Pending Verification |
| All mandatory verified + authorized approver | Approval enabled |
| Approval confirmation accepted | Approved / Permission Granted |
| Unauthorized role attempts approval | Denied |
| Rejection without remarks | Denied |
| Pilot tries another pilot’s document | Denied |
| Verifier tries unassigned application | Denied unless configured |
| Public document access | Denied |

---

# 48. Owner Confirmation Requirements

The source document explicitly states that these must be confirmed by the Jago project owner:

1. Final document types
2. Mandatory fields
3. File-size limits
4. Notification channels
5. Approval hierarchy
6. Technical stack

The user has now specified:

- **Supabase** as backend
- Frontend stack can be selected by implementation team
- Use React + TypeScript + Vite for this build

Therefore:

### Confirmed for this implementation

- Backend: Supabase
- Frontend: React + TypeScript + Vite

### Must remain configurable / marked for owner confirmation

- exact production document types
- exact mandatory fields
- final maximum file sizes
- final supported file formats
- final notification channels
- final approval hierarchy

Do NOT silently replace these with arbitrary business assumptions.

Build the configuration system so owner-confirmed values can be entered without code changes.

---

# 49. Source-to-Implementation Traceability

Ensure the final implementation explicitly covers every source section:

| Source Section | Implementation Coverage |
|---|---|
| 1. Project Objective | Secure pilot/document verification/permission platform |
| 2. User Roles | Pilot, Verifier, Admin + RBAC |
| 3. Website Modules | Auth, profile, upload, verification, approval, rejection, status, notifications, reports, settings |
| 4. Pilot User Workflow | Full end-to-end workflow |
| 5. Document Upload Requirements | Type, file, size, mandatory, duplicate, preview, replace, status |
| 6. Document Verification Screen | Application ID, pilot, contact, document list, preview, result, remarks, verify, reject, overall approval |
| 7. Approval & Permission Workflow | Mandatory-doc gate, pending/rejected blocking, confirmation, audit, notification |
| 8. Rejection & Re-Submission | Mandatory remarks, reason visibility, correction upload, pending reset, history |
| 9. Access Control & Security | RBAC, private documents, session security, audit, approval authority, server validation |
| 10. Dashboard Requirements | Required metrics and recent applications |
| 11. Reports | All seven specified reports + Excel/PDF |
| 12. Notifications | All five specified notification cases |
| 13. Pilot Testing Checklist | All specified cases with Pass/Fail |
| 14. Final Acceptance | Developer, tester, status, issues, remarks, date |
| Final Note | Owner-confirmed business values and configuration handling |

Do not mark the project complete unless every row above has a real implementation path.

---

# 50. Recommended Component Structure

Create reusable components such as:

```text
AuthGuard
RoleGuard
PermissionGuard
AppShell
Sidebar
Topbar
StatusBadge
ApplicationStatusTimeline
ApplicationCard
ApplicationTable
DocumentCard
DocumentTable
DocumentUploader
DocumentPreview
DocumentVersionHistory
VerificationPanel
RejectionDialog
ApprovalDialog
ApprovalEligibilityPanel
NotificationBell
NotificationList
ReportFilters
ReportTable
ReportExportButtons
AuditTimeline
AdminSettingsForm
DocumentTypeForm
RolePermissionMatrix
VerifierAssignmentPanel
ConfirmationDialog
EmptyState
ErrorState
LoadingState
```

Keep components composable and typed.

---

# 51. Recommended Data Access Patterns

Use a service/repository layer so UI components do not contain raw business logic.

Example:

```text
services/
  authService
  profileService
  applicationService
  documentService
  verificationService
  approvalService
  notificationService
  reportService
  adminService
  auditService
```

Use TanStack Query for:

- fetching
- caching
- invalidation
- optimistic UI only where safe

Do NOT use optimistic updates for irreversible security-sensitive operations such as final approval unless the server result is confirmed before updating the UI.

---

# 52. Audit Event Naming

Use consistent action names.

Suggested:

```text
AUTH_LOGIN
AUTH_LOGOUT
PROFILE_UPDATED

APPLICATION_CREATED
APPLICATION_SUBMITTED
APPLICATION_ASSIGNED
APPLICATION_REASSIGNED
APPLICATION_REJECTED

DOCUMENT_UPLOADED
DOCUMENT_VIEWED
DOCUMENT_REPLACED
DOCUMENT_VERIFIED
DOCUMENT_REJECTED
DOCUMENT_RESUBMITTED

APPROVAL_CONFIRMED
PERMISSION_GRANTED

USER_CREATED
USER_ROLE_CHANGED
USER_DISABLED

DOCUMENT_TYPE_CREATED
DOCUMENT_TYPE_UPDATED
DOCUMENT_RULE_CHANGED

PERMISSION_RULE_CHANGED
APPROVAL_RULE_CHANGED
NOTIFICATION_SETTING_CHANGED
SYSTEM_SETTING_CHANGED
```

The exact internal enum names may be adapted, but the audit meaning must be preserved.

---

# 53. Accessibility & Usability

Implement:

- keyboard navigation
- proper labels
- ARIA where appropriate
- accessible dialogs
- focus management
- screen-reader-friendly status information
- meaningful form errors
- no color-only status indicators

For documents and sensitive actions, provide strong visual confirmation before:

- rejection
- replacement
- final approval
- permission grant

---

# 54. Performance Requirements

Use:

- pagination
- database indexes
- selective queries
- lazy loading for non-critical screens
- efficient document preview
- client-side caching for non-sensitive display data
- no loading of all applications/documents into the browser at once

Do not download all document binaries for a list screen.

Use metadata in lists and fetch the secure preview only when requested.

---

# 55. SEO / Public Site Handling

The core Jago platform is an authenticated operational application.

Do not expose authenticated pilot/application/document content through search engines.

Public marketing/landing pages may be separate if needed, but they are not part of the source document's core workflow.

---

# 56. Logging

Use controlled application logging.

Development logs may include useful technical detail.

Production logs must:

- avoid sensitive document contents
- avoid passwords/tokens
- avoid service-role keys
- avoid unnecessary personal data

Audit logs are for business/security traceability and are separate from technical logs.

---

# 57. Git / Project Structure

Create a maintainable repository.

Recommended:

```text
jago-website/
  frontend/
  supabase/
    migrations/
    functions/
    seed/
  tests/
  docs/
  .env.example
  README.md
```

The exact structure can be simplified if the Antigravity environment works better with a single application directory, but all logical concerns must remain separated.

---

# 58. Documentation Requirements

Generate:

- README
- setup instructions
- Supabase setup instructions
- environment variable documentation
- database migration instructions
- seed instructions
- test instructions
- deployment instructions
- RBAC documentation
- security model
- document storage model
- report/export documentation
- owner-confirmation configuration guide
- final acceptance checklist

---

# 59. Deployment Readiness

Prepare for production deployment.

Verify:

- production Supabase project variables
- Auth redirect URLs
- private Storage bucket
- RLS policies
- Edge Functions
- notification configuration
- database migrations
- indexes
- no service key in frontend
- no debug/test credentials
- build succeeds
- routes work after refresh
- secure document URLs
- production error handling

---

# 60. Definition of Done

The task is complete only when:

### Functional

- Pilot can log in.
- Pilot can complete/update profile.
- Pilot can upload required documents.
- Validation works.
- Duplicate handling works.
- Preview works securely.
- Replacement works according to status/configuration.
- Verifier can see assigned applications.
- Verifier can preview documents.
- Verifier can verify documents.
- Verifier can reject documents/application with mandatory remarks.
- Pilot can see rejection reason.
- Pilot can re-submit where allowed.
- History is preserved.
- Authorized user can grant permission only when eligible.
- Approval confirmation works.
- Final approval/permission is recorded.
- Pilot sees final status.
- Notifications are generated.
- Dashboard metrics work.
- All required reports work.
- Excel export works.
- PDF export works.
- Admin can manage users.
- Admin can manage document types.
- Admin can manage permissions/RBAC.
- Admin can configure verification rules.
- Admin can configure approval authority.
- Admin can manage relevant system settings.
- Audit trail works.

### Security

- RLS enabled and tested.
- Role access enforced.
- Private document storage enforced.
- No unrestricted document URLs.
- Server-side validation enforced.
- Unauthorized approval impossible.
- Unauthorized document access impossible.
- Cross-pilot data access impossible.
- Audit records cannot be casually edited/deleted.
- Service-role credentials never reach client.

### QA

- All source pilot test cases pass.
- Unit/integration/E2E tests pass as implemented.
- TypeScript check passes.
- Lint passes.
- Production build passes.

---

# 61. Final Agent Execution Instructions

Work through the implementation in this order:

## Phase 1 — Foundation

1. Initialize React + TypeScript + Vite.
2. Configure Tailwind/shadcn-style UI system.
3. Configure routing.
4. Configure Supabase client.
5. Create environment configuration.
6. Set up project structure.

## Phase 2 — Database & Security

1. Create all PostgreSQL migrations.
2. Create roles.
3. Create permissions.
4. Create profiles.
5. Create applications.
6. Create assignments.
7. Create document types/configuration.
8. Create documents and document versions.
9. Create verification events.
10. Create rejection records.
11. Create approvals.
12. Create permission events.
13. Create notifications.
14. Create audit logs.
15. Create system settings.
16. Create indexes/constraints.
17. Enable RLS everywhere required.
18. Create RLS policies.
19. Create secure helper functions.

## Phase 3 — Storage & Edge Functions

1. Create private Jago document bucket.
2. Create secure storage policies.
3. Implement secure preview URL flow.
4. Implement secure upload/finalization flow.
5. Implement approval/permission Edge Function.
6. Implement notification service/Edge Function where needed.
7. Implement privileged admin actions where needed.

## Phase 4 — Authentication

1. Login.
2. Logout.
3. Session persistence.
4. Session timeout.
5. Auth route guards.
6. Role guards.
7. OTP-ready/auth configuration if enabled.

## Phase 5 — Pilot

1. Profile.
2. Application view.
3. Document checklist.
4. Upload.
5. Preview.
6. Replace.
7. Re-submit.
8. Status.
9. Rejection visibility.
10. Notifications.

## Phase 6 — Verifier

1. Dashboard.
2. Assigned application list.
3. Application detail.
4. Document verification.
5. Preview.
6. Verify.
7. Reject.
8. History.
9. Approval eligibility.
10. Final approval when authorized.

## Phase 7 — Admin

1. Dashboard.
2. Users.
3. Roles/permissions.
4. Assignments.
5. Document types.
6. Verification rules.
7. Approval configuration.
8. Notifications.
9. Reports.
10. Audit.
11. System settings.
12. Acceptance.

## Phase 8 — Reports & Exports

Implement all source-required reports and Excel/PDF exports.

## Phase 9 — QA

Run the exact pilot checklist plus security/RBAC tests and edge-case tests.

## Phase 10 — Production Readiness

Build, lint, type-check, test, verify RLS, verify private storage and verify all workflows.

---

# 62. Important Instruction About Ambiguity

The source document intentionally leaves some values for the Jago project owner to confirm.

When encountering one of these:

**DO NOT STOP THE IMPLEMENTATION.**

Instead:

1. Build the complete feature.
2. Make the unresolved business value configurable.
3. Display `Owner Confirmation Required` in Admin configuration/documentation.
4. Avoid inventing a production-specific business value.
5. Use clearly labeled development defaults only when the software needs a value to run locally.
6. Make changing the final value possible without rewriting the feature.

---

# 63. Final Quality Requirement

Before reporting completion, perform a **twice-checked requirement audit** against the original Jago PDF.

First pass:

- Verify every source section is implemented.

Second pass:

- Verify every individual source requirement has:
  - UI path
  - database representation where needed
  - RBAC rule
  - validation/security rule
  - audit event where appropriate
  - test coverage where appropriate

Do not declare completion while any source requirement is unimplemented or only represented by a placeholder.

The final result must be a coherent, connected, secure Jago Website — not a collection of unrelated pages.
