# Jago Website — Decoupled Production Architecture

Production-ready end-to-end implementation built according to **“JAGO WEBSITE DEVELOPMENT — Master Implementation Specification”**.

---

## 📂 Production Directory Structure

The project has been organized into clearly separated `frontend` and `supabase` directories, with frontend modules structured by user profiles and roles:

```text
d:\Jago\
├── frontend/                          # Dedicated Frontend Application (React + Vite + TS)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── types/
│       │   └── index.ts               # Core TypeScript Domain & DB Types
│       ├── lib/
│       │   ├── supabase.ts            # Supabase Client & Connection Guard
│       │   ├── mockStore.ts           # State Store & Seed Engine
│       │   ├── exportExcel.ts         # Excel XLSX Export Generator
│       │   └── exportPdf.ts           # PDF Report Generator
│       ├── services/
│       │   ├── authService.ts         # Auth & Session Security Service
│       │   ├── applicationService.ts  # Application Workflow Service
│       │   ├── documentService.ts     # Document Upload & Preview Service
│       │   ├── verificationService.ts # Document Verification Service
│       │   ├── adminService.ts        # Admin Management Service
│       │   ├── reportService.ts       # 7 Operational Reports Service
│       │   └── auditService.ts        # Immutable Audit Trail Service
│       ├── components/
│       │   ├── ui/                    # Reusable UI Components (Button, Input, Card, Badge, Dialog)
│       │   ├── layout/                # Layout Shell (Header, Sidebar, AppShell, ProtectedRoute)
│       │   ├── documents/             # Shared Document Components (Uploader, Preview Modal)
│       │   └── verification/          # Shared Verification Components (Rejection Modal, Approval Modal)
│       ├── features/                  # Role-Based Feature Modules
│       │   ├── auth/                  # Authentication Feature
│       │   │   └── Login.tsx
│       │   ├── pilot/                 # Pilot Role Feature Module
│       │   │   ├── PilotDashboard.tsx
│       │   │   ├── PilotProfile.tsx
│       │   │   ├── PilotDocuments.tsx
│       │   │   ├── PilotNotifications.tsx
│       │   │   └── PilotStatus.tsx
│       │   ├── verifier/              # Verifier Role Feature Module
│       │   │   ├── VerifierDashboard.tsx
│       │   │   ├── VerifierApplications.tsx
│       │   │   ├── VerifierDetail.tsx
│       │   │   └── VerifierReports.tsx
│       │   └── admin/                 # Admin Role Feature Module
│       │       ├── AdminDashboard.tsx
│       │       ├── AdminUsers.tsx
│       │       ├── AdminAssignments.tsx
│       │       ├── AdminDocumentTypes.tsx
│       │       ├── AdminVerificationRules.tsx
│       │       ├── AdminReports.tsx
│       │       ├── AdminAudit.tsx
│       │       ├── AdminSettings.tsx
│       │       └── AdminAcceptance.tsx
│       └── routes/
│           └── AppRoutes.tsx          # Role-Guarded Application Routing
│
├── supabase/                          # Dedicated Backend & Database Engine
│   ├── config.toml                    # Supabase Project Configuration
│   ├── seed.sql                       # Roles, Permissions, Document Types & System Settings Seed
│   ├── migrations/
│   │   └── 20260930000000_jago_schema.sql  # Schema, RLS Policies & Atomic RPC Functions
│   └── functions/                     # Server-Side Supabase Edge Functions
│       ├── document-preview/index.ts  # Token Verification & Signed Preview URL Generator
│       └── grant-permission/index.ts  # Atomic Server-Side Permission Grant Function
│
├── Jago_Antigravity_End_to_End_Development_Prompt.md
└── README.md
```

---

## 🔑 Seeded Login Credentials for All Roles

You can test and verify the complete application flow using any of the following seeded user roles:

| User Role | Email Credential | Password | Name / Title | Key Responsibilities |
|---|---|---|---|---|
| **Pilot Applicant** | `pilot@jago.com` | `password123` | Capt. Alex Mercer | Profile management, document upload, status tracking, rejection remarks review, re-submission, final permission certificate |
| **Document Verifier** | `verifier@jago.com` | `password123` | Inspector Sarah Connor | Assigned applications queue, secure preview, document verification, mandatory rejection remarks entry, approval gate execution |
| **Administrator** | `admin@jago.com` | `password123` | Chief Admin David Vance | User & role management, verifier assignments, document types config, system settings, 7 operational reports, audit logs, QA acceptance sign-off |

*(Note: The login page also includes 1-click Simulator Role buttons for quick testing).*

---

## 🛠️ Complete Running & Verification Commands

### 1. Run Frontend Web Application (Development Server)
- **Directory:** `d:\Jago\frontend\`
- **Command:**
  ```bash
  cd d:\Jago\frontend
  npm run dev
  ```
- **Local URL:** [http://localhost:3000](http://localhost:3000)

### 2. Execute Production Build & Type Checking
- **Directory:** `d:\Jago\frontend\`
- **Command:**
  ```bash
  cd d:\Jago\frontend
  npm run build
  ```

### 3. Connect Supabase CLI End-to-End (Cloud or Remote Supabase Instance)
- **Link Supabase Project:**
  ```bash
  cd d:\Jago
  supabase link --project-ref <your-supabase-project-id>
  ```
- **Push Database Migrations & RLS Policies:**
  ```bash
  supabase db push
  ```
- **Apply Initial Seed Data:**
  ```bash
  supabase db seed
  ```
- **Deploy Edge Functions:**
  ```bash
  supabase functions deploy document-preview
  supabase functions deploy grant-permission
  ```
- **Update Environment File (`d:\Jago\frontend\.env`):**
  ```env
  VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
  VITE_SUPABASE_ANON_KEY=<your-anon-key>
  ```
