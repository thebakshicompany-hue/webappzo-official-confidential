# PocketBase Backend Setup

This directory contains the PocketBase backend for the application.

## What is PocketBase?

PocketBase is an open-source backend solution that provides:
- **Database**: SQLite-based with real-time subscriptions
- **Authentication**: Built-in user auth with email/password, OAuth2, etc.
- **File Storage**: Built-in file upload and serving
- **Admin UI**: Web-based dashboard for managing data
- **REST API**: Automatic API generation from collections

## Setup Instructions

### 1. Download PocketBase

Download PocketBase for Windows from the official website:
https://pocketbase.io/docs/

Or use PowerShell to download directly:

```powershell
# Download PocketBase v0.22.0 for Windows
Invoke-WebRequest -Uri "https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_windows_amd64.zip" -OutFile "pocketbase.zip"

# Extract the zip file
Expand-Archive -Path "pocketbase.zip" -DestinationPath "." -Force

# Clean up
Remove-Item "pocketbase.zip"
```

### 2. Start PocketBase

Run PocketBase server:

```powershell
.\pocketbase.exe serve
```

This will start PocketBase on `http://localhost:8090`

### 3. Access Admin Dashboard

Once running, visit: http://localhost:8090/_/

Create your admin account on first visit.

## Database Schema

The database includes the following collections:

### users (auth collection)
- **email** (string, required, unique)
- **name** (string)
- **avatar** (file)
- Built-in fields: id, created, updated, emailVisibility, verified

### organizations
- **name** (string, required)
- **description** (text)
- **logo** (file)
- **owner** (relation to users)
- **created_by** (relation to users)

### user_organizations (junction table)
- **user** (relation to users)
- **organization** (relation to organizations)
- **role** (select: member, admin, owner)

### subscriptions
- **organization** (relation to organizations)
- **stripe_customer_id** (string)
- **stripe_subscription_id** (string)
- **plan** (select: free, pro, enterprise)
- **status** (select: active, canceled, past_due)
- **current_period_end** (date)

## Environment Variables

Add to your frontend `.env.local`:

```
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

For production, set the production URL.

## API Usage

PocketBase provides automatic REST API:

- **List records**: `GET /api/collections/{collection}/records`
- **View record**: `GET /api/collections/{collection}/records/{id}`
- **Create record**: `POST /api/collections/{collection}/records`
- **Update record**: `PATCH /api/collections/{collection}/records/{id}`
- **Delete record**: `DELETE /api/collections/{collection}/records/{id}`

Authentication endpoints:
- **Sign up**: `POST /api/collections/users/records`
- **Sign in**: `POST /api/collections/users/auth-with-password`
- **Refresh**: `POST /api/collections/users/auth-refresh`

## Development Workflow

1. Start PocketBase: `.\pocketbase.exe serve`
2. Access admin UI: http://localhost:8090/_/
3. Manage collections, view data, configure settings
4. Frontend connects via PocketBase SDK

## Production Deployment

PocketBase is a single executable that can be deployed to:
- VPS (DigitalOcean, Linode, etc.)
- Cloud platforms with persistent storage
- Docker containers

Make sure to:
- Set up proper backups for the SQLite database
- Use environment variables for sensitive config
- Enable HTTPS in production
- Configure CORS settings
