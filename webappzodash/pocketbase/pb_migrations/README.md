# PocketBase Migrations

This directory contains database migration files for PocketBase. These migrations automatically create the necessary collections and configure their schemas.

## Created Collections

### 1. `organizations`
- **Fields**: name, description, owner, created_by
- **Purpose**: Stores organization/workspace data
- **Access Rules**: Members can view/edit, owners can delete

### 2. `user_organizations`
- **Fields**: user, organization, role
- **Purpose**: Junction table for user-organization relationships
- **Access Rules**: Owners and admins can manage members

### 3. `subscriptions`
- **Fields**: organization, stripe_customer_id, stripe_subscription_id, plan, status
- **Purpose**: Manages subscription information for organizations
- **Access Rules**: Only organization owners can manage

## How to Apply Migrations

### Automatic (Recommended)
PocketBase automatically runs migrations on startup if they haven't been applied yet.

1. **Stop PocketBase** if it's running (Ctrl+C in the terminal)
2. **Restart PocketBase**:
   ```powershell
   cd pocketbase
   .\start-pocketbase.ps1
   ```
3. PocketBase will detect and apply new migrations automatically

### Manual
If you need to manually trigger migrations:

```bash
cd pocketbase
./pocketbase migrate
```

## Verify Migrations

After applying migrations:

1. Open PocketBase Admin UI: `http://localhost:8090/_/`
2. Check that these collections exist:
   - ✅ users (already exists)
   - ✅ organizations (new)
   - ✅ user_organizations (new)
   - ✅ subscriptions (new)

## Rollback

If you need to rollback migrations:

```bash
./pocketbase migrate down
```

This will undo the last migration.

## Notes

- Migration files are named with timestamps to ensure they run in order
- Each migration includes a rollback function for easy reversal
- API rules are pre-configured for security and proper access control
- Unique indexes prevent duplicate user-organization relationships
