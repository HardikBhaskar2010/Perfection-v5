# 🚀 Supabase Setup Instructions

Your Supabase credentials have been configured! Here's what you need to do to complete the setup:

## ✅ Credentials Configured

- **Supabase URL**: `https://satbswbgkcgaddbesgns.supabase.co`
- **Anon Key**: Configured in `/app/frontend/.env`

## 📋 Database Setup

If you haven't already set up your Supabase database tables, follow these steps:

### 1. Go to Supabase SQL Editor
   - Open your Supabase dashboard: https://supabase.com/dashboard
   - Navigate to **SQL Editor** in the left sidebar

### 2. Run the Schema Script
   - Copy the contents of `/app/supabase_schema.sql`
   - Paste it into the SQL Editor
   - Click **Run** to create all necessary tables

This will create:
- `profiles` table (user profiles)
- `components` table (electronic components database)
- `projects` table (saved STEM projects)
- `saved_components` table (user's saved components)
- `user_preferences` table (user settings)

### 3. Enable Row Level Security (RLS)
The schema already includes RLS policies, but verify:
- Go to **Authentication** → **Policies**
- Ensure policies are enabled for all tables

## 🔐 Google OAuth Setup

### Current Configuration:
Google OAuth is **already configured** in the code to redirect to:
```
${window.location.origin}/auth/callback
```

### Required Supabase Settings:
1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID** from Google Cloud Console
   - **Client Secret** from Google Cloud Console
4. Add authorized redirect URLs:
   - `https://satbswbgkcgaddbesgns.supabase.co/auth/v1/callback`
   - Your app URL + `/auth/callback` (e.g., `http://localhost:3000/auth/callback`)

### Google Cloud Console Setup:
If you haven't set up Google OAuth credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → Create **OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - `https://satbswbgkcgaddbesgns.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret to Supabase

## 🎯 Current User Flow

✅ **Unauthenticated Users**:
- Visit `/` → Redirected to `/login`
- See Login page with options: Google OAuth, Email, Guest Mode

✅ **After Login**:
- Redirected back to `/` 
- **Authenticated users** see **Dashboard** (stats, projects, analytics)
- **Guest users** see **Landing page** (limited features)

✅ **Components Page**:
- Now connected to Supabase
- Can add/view/delete components
- Shows mock data if no components in database yet

## 🧪 Testing

1. **Test Google OAuth**:
   - Click "Continue with Google" on login page
   - Should redirect to Google sign-in
   - After successful login, redirects to Dashboard

2. **Test Components Page**:
   - Navigate to `/components`
   - Should show either Supabase components or mock data
   - Try adding a new component

3. **Test Guest Mode**:
   - Click "Continue as Guest"
   - Should show Landing page
   - Can use all features (projects saved locally)

## 📝 Notes

- Frontend environment variables are in `/app/frontend/.env`
- Supabase schema is in `/app/supabase_schema.sql`
- Authentication flow is in `/app/frontend/src/services/authService.ts`
- All changes are live and frontend has been restarted

## 🆘 Troubleshooting

**Google OAuth not working?**
- Check Supabase dashboard → Authentication → Providers
- Verify redirect URLs are correctly configured
- Check browser console for errors

**Components page empty?**
- Run the SQL schema to create tables
- Components will show mock data until you add real ones
- Check Supabase → Table Editor → components

**Need help?**
- Check browser console (F12)
- Check `/var/log/supervisor/frontend.err.log` for errors
- Verify Supabase credentials in `.env` file
