# PocketBase Database Schema

This document describes the database schema for PocketBase collections.

## Collections

### 1. users (Auth Collection)

**Type:** Auth Collection

**Fields:**
- `email` (Email, Required, Unique)
- `name` (Plain Text, Required)
- `avatar` (File - single, Max size: 5MB, Allowed types: image/*)

**Settings:**
- Auth options: Email/Password enabled
- Minimum password length: 8 characters
- Email verification: Optional (can be enabled)

### 2. organizations

**Type:** Base Collection

**Fields:**
- `name` (Plain Text, Required, Min: 2, Max: 100)
- `description` (Editor/Rich Text, Optional)
- `logo` (File - single, Max size: 2MB, Allowed types: image/*)
- `owner` (Relation to users, Required, Single)
- `created_by` (Relation to users, Required, Single)

**Indexes:**
- `CREATE INDEX idx_organizations_owner ON organizations (owner)`

**API Rules:**
- List: `@request.auth.id != ""`
- View: `@request.auth.id != ""`
- Create: `@request.auth.id != "" && @request.data.created_by = @request.auth.id`
- Update: `owner = @request.auth.id || @request.auth.id ?= user_organizations_via_organization.user.id`
- Delete: `owner = @request.auth.id`

### 3. user_organizations (Junction Table)

**Type:** Base Collection

**Fields:**
- `user` (Relation to users, Required, Single)
- `organization` (Relation to organizations, Required, Single)
- `role` (Select, Required, Options: ["member", "admin", "owner"])

**Indexes:**
- `CREATE UNIQUE INDEX idx_user_org ON user_organizations (user, organization)`

**API Rules:**
- List: `@request.auth.id = user.id || @request.auth.id = organization.owner.id`
- View: `@request.auth.id = user.id || @request.auth.id = organization.owner.id`
- Create: `@request.auth.id = organization.owner.id || @request.auth.id ?= organization.user_organizations_via_organization.user.id && organization.user_organizations_via_organization.role ?= "admin"`
- Update: `organization.owner.id = @request.auth.id`
- Delete: `organization.owner.id = @request.auth.id || user.id = @request.auth.id`

### 4. subscriptions

**Type:** Base Collection

**Fields:**
- `organization` (Relation to organizations, Required, Single, Cascade delete)
- `stripe_customer_id` (Plain Text, Optional)
- `stripe_subscription_id` (Plain Text, Optional)
- `plan` (Select, Required, Options: ["free", "pro", "enterprise"], Default: "free")
- `status` (Select, Required, Options: ["active", "canceled", "past_due"], Default: "active")
- `current_period_end` (Date, Optional)

**Indexes:**
- `CREATE UNIQUE INDEX idx_subscription_org ON subscriptions (organization)`
- `CREATE INDEX idx_subscription_stripe ON subscriptions (stripe_subscription_id)`

**API Rules:**
- List: `@request.auth.id = organization.owner.id || @request.auth.id ?= organization.user_organizations_via_organization.user.id`
- View: `@request.auth.id = organization.owner.id || @request.auth.id ?= organization.user_organizations_via_organization.user.id`
- Create: `@request.auth.id = organization.owner.id`
- Update: `@request.auth.id = organization.owner.id || @request.auth.id ?= organization.user_organizations_via_organization.user.id && organization.user_organizations_via_organization.role ?= "admin"`
- Delete: `@request.auth.id = organization.owner.id`

## Setup via Admin UI

1. Start PocketBase: `.\start-pocketbase.ps1`
2. Open admin UI: http://localhost:8090/_/
3. Create an admin account
4. Navigate to "Collections"
5. Create each collection with the fields specified above
6. Set up the API rules for each collection
7. Create indexes as specified

## Setup via Import (Recommended)

You can also import the schema using the PocketBase admin UI:
1. Go to Settings > Import collections
2. Upload a schema JSON file (will be provided separately)
3. Verify all collections are created correctly

## Testing

After setting up collections, you can:
1. Create test users via the auth collection
2. Create test organizations
3. Test the relationships between users and organizations
4. Use the test page at `/test-pocketbase` in the frontend
