# Camp Holiday - Technical Implementation Plan

## 1. Technology Stack

### 1.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x (latest stable) | React framework with App Router |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling |
| **React-Leaflet** | 5.x | Interactive maps |
| **Framer Motion** | 11.x | Animations |
| **next-intl** | 3.x | Internationalization |
| **React Hook Form** | 7.x | Form handling |
| **Zod** | 3.x | Validation |
| **date-fns** | 3.x | Date manipulation |

### 1.2 Backend & Database

| Technology | Purpose |
|------------|---------|
| **Supabase** | Database (PostgreSQL), Auth, Storage |
| **Supabase Auth** | Email, OAuth (Google, Apple ready) |
| **Supabase Edge Functions** | Serverless API endpoints |
| **Resend** | Transactional emails |

### 1.3 Infrastructure

| Service | Purpose |
|---------|---------|
| **Vercel** | Hosting & deployment |
| **Supabase** | Backend services |
| **Cloudflare** | CDN (optional) |

---

## 2. Project Structure

```
camp-holiday/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # Internationalized routes
│   │   │   ├── (public)/             # Public pages
│   │   │   │   ├── page.tsx          # Homepage
│   │   │   │   ├── camping/
│   │   │   │   │   ├── page.tsx      # Camping overview
│   │   │   │   │   └── [zone]/
│   │   │   │   │       └── page.tsx  # Zone detail
│   │   │   │   ├── glamping/
│   │   │   │   │   ├── page.tsx      # Glamping overview
│   │   │   │   │   └── [tent]/
│   │   │   │   │       └── page.tsx  # Tent detail
│   │   │   │   ├── map/
│   │   │   │   │   └── page.tsx      # Interactive map
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx      # About us
│   │   │   │   ├── contact/
│   │   │   │   │   └── page.tsx      # Contact form
│   │   │   │   └── booking/
│   │   │   │       ├── page.tsx      # Booking flow start
│   │   │   │       ├── [type]/
│   │   │   │       │   └── page.tsx  # Type-specific booking
│   │   │   │       ├── cart/
│   │   │   │       │   └── page.tsx  # Cart/summary
│   │   │   │       └── confirmation/
│   │   │   │           └── page.tsx  # Booking confirmation
│   │   │   ├── (auth)/               # Auth pages
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── forgot-password/
│   │   │   │       └── page.tsx
│   │   │   ├── (dashboard)/          # User dashboard
│   │   │   │   └── dashboard/
│   │   │   │       ├── page.tsx      # Overview
│   │   │   │       ├── bookings/
│   │   │   │       │   └── page.tsx  # User's bookings
│   │   │   │       └── profile/
│   │   │   │           └── page.tsx  # Profile settings
│   │   │   └── (admin)/              # Admin area
│   │   │       └── admin/
│   │   │           ├── page.tsx      # Admin dashboard
│   │   │           ├── bookings/
│   │   │           │   └── page.tsx  # Manage bookings
│   │   │           ├── parcels/
│   │   │           │   └── page.tsx  # Manage parcels
│   │   │           ├── users/
│   │   │           │   └── page.tsx  # Manage users
│   │   │           └── settings/
│   │   │               └── page.tsx  # Site settings
│   │   ├── api/                      # API routes
│   │   │   ├── bookings/
│   │   │   ├── availability/
│   │   │   ├── webhook/              # Future payment webhooks
│   │   │   └── cashier/              # Cashier application API
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── calendar.tsx
│   │   │   └── ...
│   │   ├── layout/                   # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── navigation.tsx
│   │   │   ├── mobile-menu.tsx
│   │   │   └── language-switcher.tsx
│   │   ├── map/                      # Map components
│   │   │   ├── interactive-map.tsx
│   │   │   ├── map-legend.tsx
│   │   │   ├── parcel-popup.tsx
│   │   │   └── zone-layer.tsx
│   │   ├── booking/                  # Booking components
│   │   │   ├── date-picker.tsx
│   │   │   ├── parcel-selector.tsx
│   │   │   ├── guest-counter.tsx
│   │   │   ├── services-selector.tsx
│   │   │   ├── booking-summary.tsx
│   │   │   └── booking-calendar.tsx
│   │   ├── sections/                 # Page sections
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── accommodation-card.tsx
│   │   │   ├── testimonials.tsx
│   │   │   └── gallery.tsx
│   │   └── forms/                    # Form components
│   │       ├── contact-form.tsx
│   │       ├── login-form.tsx
│   │       └── register-form.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── admin.ts              # Admin client
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── validations.ts
│   │
│   ├── hooks/
│   │   ├── use-availability.ts
│   │   ├── use-booking.ts
│   │   ├── use-auth.ts
│   │   └── use-map.ts
│   │
│   ├── types/
│   │   ├── booking.ts
│   │   ├── parcel.ts
│   │   ├── user.ts
│   │   └── database.ts
│   │
│   ├── data/
│   │   ├── parcels.ts                # Parcel definitions
│   │   ├── zones.ts                  # Zone definitions
│   │   ├── geojson/                  # Map GeoJSON files
│   │   │   ├── zone-a.json
│   │   │   ├── zone-b.json
│   │   │   ├── zone-c.json
│   │   │   ├── glamping.json
│   │   │   ├── camper-p1.json
│   │   │   ├── camper-p2.json
│   │   │   └── facilities.json
│   │   └── pricing.ts                # Pricing configuration
│   │
│   ├── i18n/
│   │   ├── config.ts
│   │   └── messages/
│   │       ├── en.json
│   │       ├── hr.json
│   │       ├── de.json
│   │       ├── fr.json
│   │       └── it.json
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── camping/
│   │   ├── glamping/
│   │   ├── gallery/
│   │   └── logos/
│   ├── icons/
│   └── map/                          # Map assets
│
├── supabase/
│   ├── migrations/                   # Database migrations
│   └── functions/                    # Edge functions
│
├── docs/                             # Project documentation
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. Database Schema

### 3.1 Core Tables

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zones
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- 'Zone A', 'Zone B', etc.
  slug TEXT NOT NULL UNIQUE,             -- 'zone-a', 'zone-b', etc.
  type TEXT NOT NULL,                    -- 'tent', 'camper', 'glamping'
  description TEXT,
  description_hr TEXT,
  description_de TEXT,
  description_fr TEXT,
  description_it TEXT,
  image_url TEXT,
  color TEXT,                            -- For map display
  min_nights INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parcels
CREATE TABLE parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES zones(id),
  code TEXT NOT NULL UNIQUE,             -- 'A1', 'B12', 'P25', etc.
  name TEXT,                             -- For glamping: 'Gdinj', 'Jelsa', etc.
  capacity_min INTEGER DEFAULT 1,
  capacity_max INTEGER DEFAULT 4,
  size_sqm NUMERIC,
  has_electricity BOOLEAN DEFAULT FALSE,
  has_water BOOLEAN DEFAULT FALSE,
  amenities JSONB DEFAULT '[]',
  geojson JSONB,                         -- Parcel boundary for map
  status TEXT DEFAULT 'active',          -- 'active', 'maintenance', 'inactive'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing Seasons
CREATE TABLE pricing_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- 'Low', 'Mid', 'High', 'Peak'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zone Pricing
CREATE TABLE zone_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES zones(id),
  season_id UUID REFERENCES pricing_seasons(id),
  adult_price NUMERIC NOT NULL,
  child_5_11_price NUMERIC NOT NULL,
  child_0_4_price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zone_id, season_id)
);

-- Additional Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_hr TEXT,
  name_de TEXT,
  name_fr TEXT,
  name_it TEXT,
  price NUMERIC NOT NULL,
  price_type TEXT DEFAULT 'daily',       -- 'daily', 'one_time', 'per_use'
  is_per_person BOOLEAN DEFAULT FALSE,
  applicable_to TEXT[],                  -- ['tent', 'camper', 'glamping']
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  parcel_id UUID REFERENCES parcels(id),
  
  -- Dates (check-in from 2PM, check-out at 12PM)
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  check_in_time TIME DEFAULT '14:00',
  check_out_time TIME DEFAULT '12:00',
  
  -- Guests
  adults INTEGER NOT NULL DEFAULT 1,
  children_5_11 INTEGER DEFAULT 0,
  children_0_4 INTEGER DEFAULT 0,
  
  -- Pricing
  base_price NUMERIC NOT NULL,
  services_price NUMERIC DEFAULT 0,
  tourist_tax NUMERIC DEFAULT 0,
  total_price NUMERIC NOT NULL,
  deposit_amount NUMERIC,
  deposit_paid BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT DEFAULT 'pending',         -- 'pending', 'confirmed', 'cancelled', 'completed'
  payment_status TEXT DEFAULT 'unpaid',  -- 'unpaid', 'partial', 'paid'
  
  -- Metadata
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: check-out must be after check-in
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- Booking Services (junction table)
CREATE TABLE booking_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  quantity INTEGER DEFAULT 1,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability Blocks (for manual blocking)
CREATE TABLE availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID REFERENCES parcels(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',             -- 'new', 'read', 'replied'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Views & Functions

```sql
-- View: Parcel availability
CREATE VIEW parcel_availability AS
SELECT 
  p.id AS parcel_id,
  p.code,
  p.zone_id,
  z.type AS zone_type,
  d.date,
  CASE 
    WHEN b.id IS NOT NULL THEN 'booked'
    WHEN ab.id IS NOT NULL THEN 'blocked'
    ELSE 'available'
  END AS status,
  -- Same-day availability (after 2PM if checkout that day)
  CASE 
    WHEN b.check_out_date = d.date THEN 'available_afternoon'
    ELSE NULL
  END AS same_day_status
FROM parcels p
CROSS JOIN generate_series(
  CURRENT_DATE, 
  CURRENT_DATE + INTERVAL '1 year', 
  INTERVAL '1 day'
) AS d(date)
JOIN zones z ON p.zone_id = z.id
LEFT JOIN bookings b ON p.id = b.parcel_id 
  AND d.date >= b.check_in_date 
  AND d.date < b.check_out_date
  AND b.status NOT IN ('cancelled')
LEFT JOIN availability_blocks ab ON p.id = ab.parcel_id
  AND d.date >= ab.start_date
  AND d.date <= ab.end_date;

-- Function: Check availability for date range
CREATE OR REPLACE FUNCTION check_availability(
  p_parcel_id UUID,
  p_check_in DATE,
  p_check_out DATE
) RETURNS BOOLEAN AS $$
DECLARE
  v_conflict_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_conflict_count
  FROM bookings
  WHERE parcel_id = p_parcel_id
    AND status NOT IN ('cancelled')
    AND (
      -- New booking overlaps with existing
      (p_check_in < check_out_date AND p_check_out > check_in_date)
    );
  
  RETURN v_conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate booking price
CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_zone_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_adults INTEGER,
  p_children_5_11 INTEGER,
  p_children_0_4 INTEGER
) RETURNS NUMERIC AS $$
DECLARE
  v_total NUMERIC := 0;
  v_day DATE;
  v_adult_price NUMERIC;
  v_child_price NUMERIC;
BEGIN
  FOR v_day IN SELECT generate_series(p_check_in, p_check_out - 1, '1 day'::interval)::date LOOP
    SELECT zp.adult_price, zp.child_5_11_price
    INTO v_adult_price, v_child_price
    FROM zone_pricing zp
    JOIN pricing_seasons ps ON zp.season_id = ps.id
    WHERE zp.zone_id = p_zone_id
      AND v_day >= ps.start_date
      AND v_day <= ps.end_date;
    
    IF v_adult_price IS NULL THEN
      -- Use default pricing if no season defined
      v_adult_price := 10.00;
      v_child_price := 6.00;
    END IF;
    
    v_total := v_total + (v_adult_price * p_adults) + (v_child_price * p_children_5_11);
  END LOOP;
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. API Endpoints

### 4.1 Public API

```typescript
// GET /api/availability
// Query params: parcelId, checkIn, checkOut
// Returns: { available: boolean, message?: string }

// GET /api/availability/calendar
// Query params: parcelId, month, year
// Returns: { dates: { date: string, status: 'available' | 'booked' | 'blocked' }[] }

// GET /api/zones
// Returns: Zone[]

// GET /api/parcels
// Query params: zoneId?
// Returns: Parcel[]

// GET /api/pricing
// Query params: zoneId, checkIn, checkOut, adults, children511, children04
// Returns: { basePrice: number, breakdown: PriceBreakdown }

// POST /api/bookings
// Body: BookingRequest
// Returns: { bookingId: string, status: string }

// POST /api/contact
// Body: ContactMessage
// Returns: { success: boolean }
```

### 4.2 Authenticated API

```typescript
// GET /api/user/bookings
// Returns: Booking[]

// GET /api/user/bookings/:id
// Returns: BookingDetails

// PATCH /api/user/bookings/:id/cancel
// Returns: { success: boolean }

// GET /api/user/profile
// Returns: Profile

// PATCH /api/user/profile
// Body: ProfileUpdate
// Returns: Profile
```

### 4.3 Admin API

```typescript
// GET /api/admin/bookings
// Query params: status, dateFrom, dateTo, page, limit
// Returns: { bookings: Booking[], total: number }

// PATCH /api/admin/bookings/:id
// Body: BookingUpdate
// Returns: Booking

// POST /api/admin/availability-blocks
// Body: AvailabilityBlock
// Returns: AvailabilityBlock

// GET /api/admin/stats
// Returns: DashboardStats
```

### 4.4 Cashier API

```typescript
// POST /api/cashier/authenticate
// Body: { apiKey: string }
// Returns: { token: string }

// GET /api/cashier/bookings/today
// Returns: { arrivals: Booking[], departures: Booking[] }

// PATCH /api/cashier/bookings/:id/checkin
// Returns: { success: boolean }

// PATCH /api/cashier/bookings/:id/checkout
// Returns: { success: boolean }
```

---

## 5. Authentication Flow

### 5.1 Email Registration

1. User fills registration form
2. Supabase creates user with email verification
3. User verifies email
4. Profile created in `profiles` table
5. User redirected to dashboard

### 5.2 Social Auth (Placeholders)

- Google OAuth button (configured but shows "Coming Soon")
- Apple Sign-In button (configured but shows "Coming Soon")

### 5.3 Session Management

- JWT tokens via Supabase Auth
- Server-side session validation
- Refresh token rotation
- Secure cookie storage

---

## 6. Same-Day Availability Logic

### 6.1 Rules

```typescript
const CHECKOUT_TIME = '12:00'; // Noon
const CHECKIN_TIME = '14:00';  // 2 PM

function canBookSameDay(
  parcelId: string, 
  requestedDate: Date, 
  requestedCheckIn: string
): boolean {
  const existingBooking = await getBookingForDate(parcelId, requestedDate);
  
  if (!existingBooking) return true;
  
  // If someone is checking out that day
  if (existingBooking.checkOutDate === requestedDate) {
    // Allow booking from 2 PM onwards
    return requestedCheckIn >= CHECKIN_TIME;
  }
  
  return false;
}
```

### 6.2 Calendar Display

- Morning slot (before noon): Shows existing booking
- Afternoon slot (after 2 PM): Shows available if checkout that day
- Full day: Shows available/booked normally

---

## 7. Internationalization

### 7.1 Supported Languages

| Code | Language | Flag |
|------|----------|------|
| en | English | 🇬🇧 |
| hr | Croatian | 🇭🇷 |
| de | German | 🇩🇪 |
| fr | French | 🇫🇷 |
| it | Italian | 🇮🇹 |

### 7.2 Implementation

Using `next-intl` with App Router:

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'hr', 'de', 'fr', 'it'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});
```

### 7.3 Content Translation

- Static UI text: JSON translation files
- Dynamic content: Database columns for each language
- Dates/Numbers: Native Intl API

---

## 8. Map Implementation

### 8.1 React-Leaflet Setup

```typescript
// components/map/interactive-map.tsx
'use client';

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CAMP_CENTER: [number, number] = [43.16167, 16.70674];
const DEFAULT_ZOOM = 18;

export function InteractiveMap() {
  return (
    <MapContainer 
      center={CAMP_CENTER} 
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
    >
      {/* Custom background layer instead of satellite */}
      <TileLayer url="/map/tiles/{z}/{x}/{y}.png" />
      
      {/* Zone layers */}
      <ZoneLayer zone="zone-a" color="#5B9BD5" />
      <ZoneLayer zone="zone-b" color="#70AD47" />
      <ZoneLayer zone="zone-c" color="#7B7DB5" />
      <ZoneLayer zone="glamping" color="#ED7D31" />
      
      {/* Facilities markers */}
      <FacilitiesLayer />
      
      {/* Legend */}
      <MapLegend />
    </MapContainer>
  );
}
```

### 8.2 GeoJSON Structure

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "a1",
        "code": "A1",
        "zone": "zone-a",
        "type": "tent"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[16.xxx, 43.xxx], ...]]
      }
    }
  ]
}
```

---

## 9. MVP Phase Plan

### Phase 1: Foundation (Week 1-2)

- [ ] Project setup (Next.js, Tailwind, Supabase)
- [ ] Database schema & migrations
- [ ] Authentication (email only)
- [ ] Basic layout components
- [ ] Homepage design
- [ ] Internationalization setup

### Phase 2: Core Pages (Week 2-3)

- [ ] Camping page with zones
- [ ] Glamping page with tents
- [ ] About page
- [ ] Contact page with form
- [ ] Interactive map (basic)

### Phase 3: Booking System (Week 3-4)

- [ ] Availability calendar
- [ ] Booking flow
- [ ] Same-day availability logic
- [ ] Price calculation
- [ ] Booking confirmation

### Phase 4: User Area (Week 4-5)

- [ ] User dashboard
- [ ] Booking management
- [ ] Profile settings

### Phase 5: Admin Area (Week 5-6)

- [ ] Admin dashboard
- [ ] Booking management
- [ ] Parcel management
- [ ] Basic reports

### Phase 6: Polish & Testing (Week 6-7)

- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Content review
- [ ] Bug fixes

---

## 10. Future Enhancements (Post-MVP)

1. **Payment Integration** (Stripe)
2. **Advanced Reporting**
3. **Email Campaigns**
4. **Reviews System**
5. **Loyalty Program**
6. **Mobile App**
7. **Channel Manager Integration**

