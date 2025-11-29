# Supabase Setup Guide

Complete guide to setting up Supabase for Camp Holiday.

---

## 📋 Prerequisites

- Supabase account (free at [supabase.com](https://supabase.com))
- Node.js 18+ installed
- Project codebase ready

---

## 🚀 Step 1: Create Supabase Project

### 1.1 Create New Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Name**: `camp-holiday`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: `eu-central-1` (Frankfurt) - closest to Croatia
4. Click "Create new project"
5. Wait ~2 minutes for provisioning

### 1.2 Get API Keys

After project creation, go to **Settings → API**:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon (public) key: eyJhbGciOiJIUzI1NiIsInR5cCI6...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6... (KEEP SECRET!)
```

---

## 🔧 Step 2: Local Development Setup

### 2.1 Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# npm (alternative)
npm install -g supabase
```

### 2.2 Initialize Supabase in Project

```bash
cd camp-holiday
supabase init
```

This creates:
```
supabase/
├── config.toml       # Supabase configuration
├── migrations/       # Database migrations
├── functions/        # Edge functions (optional)
└── seed.sql          # Initial data
```

### 2.3 Link to Remote Project

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

Get project ID from Supabase dashboard URL:
`app.supabase.com/project/THIS_IS_YOUR_PROJECT_ID`

---

## 🗃️ Step 3: Database Migrations

### 3.1 Create Migration Files

Create the migration file:

```bash
supabase migration new initial_schema
```

This creates: `supabase/migrations/20231129000000_initial_schema.sql`

### 3.2 Add Schema

Copy the complete schema from [12-DATABASE-SCHEMA.md](./12-DATABASE-SCHEMA.md) into the migration file.

### 3.3 Run Migration

```bash
# Apply to remote database
supabase db push

# Or for local development
supabase db reset
```

---

## 🔐 Step 4: Configure Authentication

### 4.1 Email Auth Settings

Go to **Authentication → Providers → Email**:

- ✅ Enable Email provider
- ✅ Enable email confirmations
- ✅ Enable "Secure email change"

### 4.2 Email Templates

Go to **Authentication → Email Templates**:

#### Confirm Signup
```html
<h2>Welcome to Camp Holiday!</h2>
<p>Click the link below to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
```

#### Reset Password
```html
<h2>Reset Your Password</h2>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

### 4.3 Redirect URLs

Go to **Authentication → URL Configuration**:

```
Site URL: https://campholiday.eu
Redirect URLs:
- https://campholiday.eu/**
- http://localhost:3000/**  (for development)
```

---

## 🛡️ Step 5: Row Level Security (RLS)

### 5.1 Enable RLS on All Tables

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
```

### 5.2 Create Policies

```sql
-- Profiles: Users can read/update own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Bookings: Users see own, admins see all
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Public tables (zones, parcels, services, pricing)
CREATE POLICY "Anyone can read zones" ON zones
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read parcels" ON parcels
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read services" ON services
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read pricing" ON zone_pricing
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read seasons" ON pricing_seasons
  FOR SELECT USING (true);

-- Contact messages: Anyone can insert, admins can read
CREATE POLICY "Anyone can submit contact" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read contacts" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

---

## 🌐 Step 6: Environment Variables

### 6.1 Create `.env.local`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# Server-side only (never expose!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### 6.2 Add to `.gitignore`

```
.env.local
.env.production
```

### 6.3 Vercel Environment Variables

1. Go to Vercel project settings
2. Add same variables under **Environment Variables**
3. Scope appropriately (Production, Preview, Development)

---

## 📦 Step 7: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## 🔌 Step 8: Create Supabase Client

### 8.1 Browser Client

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 8.2 Server Client

```typescript
// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  )
}
```

### 8.3 Admin Client (for API routes)

```typescript
// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
```

---

## 🔄 Step 9: Auth Middleware

```typescript
// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

---

## 🧪 Step 10: Test Authentication

### 10.1 Create Test User

In Supabase dashboard → Authentication → Users → Add User:

```
Email: test@example.com
Password: test123456
```

### 10.2 Test Login Flow

```typescript
// Test in browser console or component
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'test123456'
})

console.log(data, error)
```

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API keys saved securely
- [ ] Database schema migrated
- [ ] RLS policies applied
- [ ] Auth configured
- [ ] Environment variables set
- [ ] Client utilities created
- [ ] Middleware working
- [ ] Test login successful

---

## 🆘 Troubleshooting

### "Invalid API key"
- Check `.env.local` has correct values
- Restart dev server after changing env vars

### "Permission denied"
- RLS is blocking access
- Check policies match your use case
- Use service role key for admin operations

### "User not found after signup"
- Profile trigger might have failed
- Check `profiles` table manually
- Verify trigger function exists

---

*Next: [12-DATABASE-SCHEMA.md](./12-DATABASE-SCHEMA.md) for complete schema*

