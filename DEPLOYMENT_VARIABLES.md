# Deployment Environment Variables Reference

This document outlines all environment variables required by the supervisor when deploying the IntegralTech stack.

---

## 1. Frontend Environment Variables (`.env.production`)

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Full URL to the production backend API v1 endpoint | `https://api.integraltech.ma/api/v1` |
| `VITE_BACKEND_URL` | Base URL of the backend host | `https://api.integraltech.ma` |
| `VITE_SITE_URL` | Base URL of the production frontend site (used for SEO & canonical URLs) | `https://integraltech.ma` |

---

## 2. Backend Environment Variables (`.env.production`)

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `APP_NAME` | Name of the application | `IntegralTech` |
| `APP_ENV` | Application environment (must be `production`) | `production` |
| `APP_KEY` | Laravel 32-character encryption key (`php artisan key:generate`) | `base64:...` |
| `APP_DEBUG` | Enable/disable debug mode (must be `false` in production) | `false` |
| `APP_URL` | Production URL of the API host | `https://api.integraltech.ma` |
| `FRONTEND_URL` | Production URL of the Frontend host | `https://integraltech.ma` |
| `SANCTUM_STATEFUL_DOMAINS` | Comma-separated domains authorized for Sanctum cookies | `integraltech.ma,api.integraltech.ma` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated origins allowed by CORS | `https://integraltech.ma` |
| `DB_CONNECTION` | Database driver | `mysql` |
| `DB_HOST` | MySQL container/host address | `mysql` |
| `DB_PORT` | MySQL database port | `3306` |
| `DB_DATABASE` | MySQL database name | `integraltech_db` |
| `DB_USERNAME` | Production MySQL application username | `integraltech_app` |
| `DB_PASSWORD` | Strong production MySQL password | *[SUPERVISOR_GENERATED_PASSWORD]* |
| `SESSION_DRIVER` | Session storage driver | `database` |
| `SESSION_DOMAIN` | Session cookie domain scope | `.integraltech.ma` |
| `SESSION_SECURE_COOKIE` | Require HTTPS for session cookies | `true` |
| `SESSION_SAME_SITE` | SameSite cookie attribute | `lax` |
