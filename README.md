# Cloud Backup & Recovery Dashboard

Production-structured full-stack application focused **only** on Backup & Recovery workflows.

## Included Scope
- Backup management (create/update/delete/pause-resume via status updates)
- Real-time backup and recovery progress via WebSocket events
- Backup scheduling via cron expressions
- Storage usage and health APIs
- Logs and audit entries
- JWT authentication and role-ready claims
- Enterprise dashboard UI focused on backup operations only

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Run:
   ```bash
   npm start
   ```

## Environment Variables
See `.env.example`.

## API Surface
- `POST /auth/register`
- `POST /auth/login`
- `POST /backup/create`
- `PUT /backup/update/:id`
- `DELETE /backup/delete/:id`
- `POST /backup/start/:id`
- `POST /backup/stop/:id`
- `GET /backup/status`
- `GET /backup/history`
- `POST /recovery/start`
- `GET /recovery/status`
- `GET /recovery/history`
- `GET /storage/status`
- `GET /storage/usage`
- `GET /logs/backup`
- `GET /logs/recovery`

## Real-Time Events
- `backup.progress`
- `backup.status`
- `recovery.progress`
- `recovery.status`
- `log.new`
