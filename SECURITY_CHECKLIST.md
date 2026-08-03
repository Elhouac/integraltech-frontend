# Security Checklist & Audit Log — IntegralTech Platform

## 1. Secrets & Credentials Management
- [x] Zero hardcoded secrets, database passwords, or private keys in source code.
- [x] Git ignores `.env`, `.env.local`, `.env.production`, `node_modules`, `vendor`, and `.venv`.
- [x] Example environment files (`.env.production.example`) contain placeholders only.

---

## 2. Authentication & Authorization Security
- [x] State-based Sanctum cookie/session authentication (`credentials: "include"`).
- [x] No tokens stored in `localStorage` or `sessionStorage`.
- [x] Password hashing using BCRYPT with 12 rounds.
- [x] Role-based access control (RBAC) enforced via Laravel Gates and `PermissionMatrix`.
- [x] Rate limiting configured on sensitive endpoints:
  - `POST /api/v1/auth/login`: 5 attempts/min per IP & email.
  - `POST /api/v1/auth/forgot-password`: 3 requests per 15 min.
  - `POST /api/v1/auth/reset-password`: 3 requests per 15 min.
  - `POST /api/v1/public/leads`: 5 requests per 10 min per IP.
  - `POST /api/v1/public/subscribers`: 10 requests per min per IP.

---

## 3. Input Validation & File Upload Security
- [x] All API endpoints validated using Form Request validation rules.
- [x] Media assets strictly validated against file extensions, MIME types, and file size limits (max 10MB).
- [x] File uploads sanitized to prevent path traversal attacks.

---

## 4. Network & Server Hardening (Nginx & Headers)
- [x] Blocked public web access to `.env`, `.git`, `.htaccess`, and private storage paths.
- [x] Configured security headers:
  - `X-Frame-Options: SAMEORIGIN` (prevents Clickjacking).
  - `X-Content-Type-Options: nosniff` (prevents MIME sniffing).
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- [x] `CORS_ALLOWED_ORIGINS` restricted strictly to configured `FRONTEND_URL`.
- [x] `SANCTUM_STATEFUL_DOMAINS` restricted strictly to authorized production domains.
