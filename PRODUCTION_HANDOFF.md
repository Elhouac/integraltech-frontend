# Production Handoff Document — IntegralTech Platform

## 1. Project Architecture Overview
The IntegralTech platform is built using an enterprise decoupled architecture:
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + GSAP + Lucide Icons.
- **Backend API**: Laravel 11 with Sanctum stateful cookie/session authentication.
- **Database**: MySQL 8.0 with InnoDB engine and utf8mb4 encoding.
- **Web Server & Reverse Proxy**: Dual Nginx setup (Frontend SPA routing & static asset caching; Backend FastCGI PHP-FPM gateway).

---

## 2. Supervisor Deployment Prerequisites
Before running the deployment stack on a target VPS:
1. Docker Engine 24.0+ & Docker Compose 2.20+ installed.
2. Production domain names configured in DNS (e.g. `integraltech.ma` and `api.integraltech.ma`).
3. SSL Certificates issued (Certbot / Let's Encrypt / Cloudflare).
4. Environment configuration files (`.env`) instantiated from `.env.production.example`.

---

## 3. Required Environment Variables
See [`DEPLOYMENT_VARIABLES.md`](./DEPLOYMENT_VARIABLES.md) for the complete list of secrets and domain configurations required by the supervisor.

---

## 4. Docker Deployment Commands

### Build & Start Stack
```bash
docker compose -f docker-compose.production.yml up -d --build
```

### Check Container Status
```bash
docker compose -f docker-compose.production.yml ps
```

### View Application Logs
```bash
docker compose -f docker-compose.production.yml logs -f --tail=100
```

---

## 5. Database Migration & Cache Commands

### Execute Migrations safely (No Data Loss)
```bash
docker compose -f docker-compose.production.yml exec backend php artisan migrate --force
```

### Optimize Laravel Cache
```bash
docker compose -f docker-compose.production.yml exec backend php artisan config:cache
docker compose -f docker-compose.production.yml exec backend php artisan route:cache
docker compose -f docker-compose.production.yml exec backend php artisan view:cache
```

---

## 6. Storage Permissions & Storage Symlink
```bash
docker compose -f docker-compose.production.yml exec backend php artisan storage:link
docker compose -f docker-compose.production.yml exec backend chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
```

---

## 7. Rollback & Emergency Strategy

### Revert Application Containers
```bash
docker compose -f docker-compose.production.yml down
# Deploy previous git commit / docker image tag
docker compose -f docker-compose.production.yml up -d
```

### Database Rollback (If Migration added new tables)
```bash
docker compose -f docker-compose.production.yml exec backend php artisan migrate:rollback --step=1
```

---

## 8. Tasks Reserved for Supervisor
- VPS Provisioning & Firewall setup (Ports 80, 443, 22 only).
- DNS A/AAAA Record Mapping.
- SSL Certificate generation & Nginx TLS termination setup.
- Production database password creation & secrets vault storage.
- Automated daily database volume backup cron (`mysqldump`).
- Server Uptime & Error Log Monitoring (Sentry / Datadog / Grafana).
