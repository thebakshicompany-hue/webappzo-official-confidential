# 🚀 Quick Start Guide - PocketBase Integration

Follow these steps to get PocketBase up and running with your application.

## Step 1: Start PocketBase Server

Open PowerShell and navigate to the pocketbase directory:

```powershell
cd "c:\Users\NIPUN\Downloads\webappzo official confidential\webappzodash\pocketbase"
.\start-pocketbase.ps1
```

**Alternative:** Run directly:
```powershell
.\pocketbase.exe serve
```

You should see:
```
> Server started at http://127.0.0.1:8090
> Admin UI: http://127.0.0.1:8090/_/
```

## Step 2: Create Admin Account

1. Open your browser and go to: **http://localhost:8090/_/**
2. On first visit, you'll be prompted to create an admin account
3. Fill in your admin email and password
4. Click "Create and Login"

## Step 3: Set Up Database Collections

### Option A: Manual Setup (Recommended for learning)

1. In the PocketBase admin UI, click **"New Collection"**
2. Create the following collections (see `SCHEMA.md` for detailed field specifications):

**1. users collection (Auth Collection)**
- Click "New Collection" → "Auth collection"
- Name: `users`
- Add fields:
  - `name` (Plain text, Required)
  - `avatar` (File, Optional, Max 5MB)
- Save collection

**2. organizations collection**
- Click "New Collection" → "Base collection"
- Name: `organizations`
- Add fields:
  - `name` (Plain text, Required)
  - `description` (Editor, Optional)
  - `logo` (File, Optional, Max 2MB)
  - `owner` (Relation → users, Single, Required)
  - `created_by` (Relation → users, Single, Required)
- Save collection

**3. user_organizations collection**
- Click "New Collection" → "Base collection"
- Name: `user_organizations`
- Add fields:
  - `user` (Relation → users, Single, Required)
  - `organization` (Relation → organizations, Single, Required)
  - `role` (Select, Required, Options: member, admin, owner)
- Save collection

**4. subscriptions collection**
- Click "New Collection" → "Base collection"
- Name: `subscriptions`
- Add fields:
  - `organization` (Relation → organizations, Single, Required)
  - `stripe_customer_id` (Plain text, Optional)
  - `stripe_subscription_id` (Plain text, Optional)
  - `plan` (Select, Required, Options: free, pro, enterprise, Default: free)
  - `status` (Select, Required, Options: active, canceled, past_due, Default: active)
  - `current_period_end` (Date, Optional)
- Save collection

### Option B: Import Schema (Coming Soon)
*Schema export/import functionality will be added*

## Step 4: Configure Frontend Environment

1. Navigate to the frontend directory
2. Create a `.env.local` file (or copy from `env.example`):

```bash
cd ../frontend
```

Create `.env.local`:
```env
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

## Step 5: Start Frontend

```powershell
pnpm run dev
```

The frontend will start at **http://localhost:3000**

## Step 6: Test the Integration

1. Open your browser and navigate to: **http://localhost:3000/test-pocketbase**
2. You should see the PocketBase test page with:
   - Connection status (should show "Auth Store Valid: ✓ Yes")
   - Registration form
   - Login form

3. **Test Registration:**
   - Click "Register" tab
   - Fill in: Name, Email, Password (min 8 characters)
   - Click "Register"
   - You should be automatically logged in

4. **Verify in Admin UI:**
   - Go back to http://localhost:8090/_/
   - Navigate to Collections → users
   - You should see your newly created user!

5. **Test Login/Logout:**
   - Click "Logout" on the test page
   - Use the "Login" tab to log back in
   - Verify the session persists across page refreshes

## Troubleshooting

### PocketBase won't start
- Check if port 8090 is already in use
- Try running on a different port: `.\pocketbase.exe serve --http=127.0.0.1:8091`
- Update `.env.local` to match the new port

### Connection Error in Frontend
- Verify PocketBase is running (check http://localhost:8090/_/)
- Ensure `.env.local` has the correct URL
- Restart the Next.js dev server after changing `.env.local`

### Collections not found
- Make sure you created all collections in the admin UI
- Check collection names are exactly: `users`, `organizations`, `user_organizations`, `subscriptions`

### Authentication errors
- Clear browser cookies and localStorage
- Check that the users collection is an "Auth collection" type
- Verify minimum password length is 8 characters

## Next Steps

✅ PocketBase server is running
✅ Database collections are set up  
✅ Frontend can connect to PocketBase
✅ User registration and login work

**Now you can:**
1. Build custom auth UI to replace Clerk
2. Integrate organization management
3. Connect Stripe with PocketBase subscriptions
4. Build your application features using PocketBase!

## Development Workflow

**Terminal 1 - PocketBase:**
```powershell
cd pocketbase
.\start-pocketbase.ps1
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
pnpm run dev
```

**Terminal 3 - Backend (Encore):** *(if keeping both)*
```powershell
cd backend
encore run
```

Access:
- 🌐 Frontend: http://localhost:3000
- 🗄️ PocketBase Admin: http://localhost:8090/_/
- 🔧 PocketBase API: http://localhost:8090/api/
- ⚡ Encore API: http://localhost:4000 *(if running)*

---

**Happy coding! 🎉**
