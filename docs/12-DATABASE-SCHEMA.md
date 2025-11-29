# Database Schema

Complete PostgreSQL schema for Camp Holiday with half-day booking logic.

---

## 📊 Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   profiles   │     │    zones     │     │   parcels    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK,FK)   │     │ id (PK)      │     │ id (PK)      │
│ email        │     │ name         │◄────┤ zone_id (FK) │
│ full_name    │     │ slug         │     │ code         │
│ phone        │     │ type         │     │ name         │
│ role         │     │ color        │     │ capacity_max │
│ ...          │     │ ...          │     │ geojson      │
└──────┬───────┘     └──────────────┘     │ ...          │
       │                                  └──────┬───────┘
       │                                         │
       │             ┌──────────────┐            │
       │             │   bookings   │            │
       │             ├──────────────┤            │
       └────────────►│ user_id (FK) │            │
                     │ parcel_id(FK)│◄───────────┘
                     │ check_in_date│
                     │ check_out_date
                     │ adults       │
                     │ total_price  │
                     │ status       │
                     └──────────────┘
```

---

## 🗃️ Complete Schema SQL

### Core Tables

```sql
-- ===========================================
-- PROFILES (extends Supabase auth.users)
-- ===========================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'HR',
  language TEXT DEFAULT 'en',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();


-- ===========================================
-- ZONES
-- ===========================================
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('tent', 'camper', 'glamping')),
  description TEXT,
  description_hr TEXT,
  description_de TEXT,
  description_fr TEXT,
  description_it TEXT,
  features JSONB DEFAULT '[]',
  image_url TEXT,
  color TEXT,
  min_nights INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_zones_slug ON zones(slug);
CREATE INDEX idx_zones_type ON zones(type);


-- ===========================================
-- PARCELS
-- ===========================================
CREATE TABLE parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT,                              -- For glamping: 'Gdinj', 'Jelsa', etc.
  capacity_min INTEGER DEFAULT 1,
  capacity_max INTEGER DEFAULT 4,
  size_sqm NUMERIC(10,2),
  has_electricity BOOLEAN DEFAULT FALSE,
  has_water BOOLEAN DEFAULT FALSE,
  amenities JSONB DEFAULT '[]',
  geojson JSONB,                          -- Parcel boundary polygon
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_parcels_zone ON parcels(zone_id);
CREATE INDEX idx_parcels_code ON parcels(code);
CREATE INDEX idx_parcels_status ON parcels(status);


-- ===========================================
-- PRICING SEASONS
-- ===========================================
CREATE TABLE pricing_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                     -- 'Low Season', 'Mid Season', etc.
  slug TEXT NOT NULL,                     -- 'low', 'mid', 'high', 'peak'
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_season_dates CHECK (end_date > start_date),
  UNIQUE(slug, year)
);

CREATE INDEX idx_seasons_dates ON pricing_seasons(start_date, end_date);
CREATE INDEX idx_seasons_year ON pricing_seasons(year);


-- ===========================================
-- ZONE PRICING
-- ===========================================
CREATE TABLE zone_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES pricing_seasons(id) ON DELETE CASCADE,
  adult_price NUMERIC(10,2) NOT NULL,
  child_5_11_price NUMERIC(10,2) NOT NULL,
  child_0_4_price NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(zone_id, season_id)
);

CREATE INDEX idx_zone_pricing_zone ON zone_pricing(zone_id);
CREATE INDEX idx_zone_pricing_season ON zone_pricing(season_id);


-- ===========================================
-- ADDITIONAL SERVICES
-- ===========================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_hr TEXT,
  name_de TEXT,
  name_fr TEXT,
  name_it TEXT,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  price_type TEXT DEFAULT 'daily' CHECK (price_type IN ('daily', 'once', 'per_use')),
  is_per_person BOOLEAN DEFAULT FALSE,
  applicable_to TEXT[] DEFAULT ARRAY['tent', 'camper', 'glamping'],
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_active ON services(is_active);


-- ===========================================
-- BOOKINGS (Main table with half-day logic)
-- ===========================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,      -- Human-readable: 'CH-ABC123'
  user_id UUID REFERENCES profiles(id),
  parcel_id UUID NOT NULL REFERENCES parcels(id),
  
  -- Dates
  -- IMPORTANT: Same date can be check_out for booking A AND check_in for booking B
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  
  -- Standard times (12:00 checkout, 14:00 checkin)
  check_in_time TIME DEFAULT '14:00',
  check_out_time TIME DEFAULT '12:00',
  
  -- Guests
  adults INTEGER NOT NULL DEFAULT 1 CHECK (adults >= 1),
  children_5_11 INTEGER DEFAULT 0 CHECK (children_5_11 >= 0),
  children_0_4 INTEGER DEFAULT 0 CHECK (children_0_4 >= 0),
  
  -- Pricing breakdown
  base_price NUMERIC(10,2) NOT NULL,
  services_price NUMERIC(10,2) DEFAULT 0,
  tourist_tax NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL,
  
  -- Deposit
  deposit_amount NUMERIC(10,2) DEFAULT 0,
  deposit_paid BOOLEAN DEFAULT FALSE,
  deposit_paid_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  
  -- Guest contact (in case no user account)
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  
  -- Notes
  notes TEXT,                             -- Guest notes
  admin_notes TEXT,                       -- Internal notes
  
  -- Tracking
  source TEXT DEFAULT 'website',          -- 'website', 'admin', 'cashier', 'phone'
  created_by UUID REFERENCES profiles(id),
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_booking_dates CHECK (check_out_date > check_in_date),
  CONSTRAINT valid_guest_count CHECK (adults + children_5_11 + children_0_4 >= 1)
);

-- Generate human-readable booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_code = 'CH-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_booking_insert
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_booking_code();

-- Update timestamp trigger
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Indexes for performance
CREATE INDEX idx_bookings_parcel ON bookings(parcel_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_code ON bookings(booking_code);


-- ===========================================
-- BOOKING SERVICES (Junction table)
-- ===========================================
CREATE TABLE booking_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  quantity INTEGER DEFAULT 1 CHECK (quantity >= 1),
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_services_booking ON booking_services(booking_id);


-- ===========================================
-- AVAILABILITY BLOCKS (Manual blocking)
-- ===========================================
CREATE TABLE availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_block_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_blocks_parcel ON availability_blocks(parcel_id);
CREATE INDEX idx_blocks_dates ON availability_blocks(start_date, end_date);


-- ===========================================
-- CONTACT MESSAGES
-- ===========================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_status ON contact_messages(status);
CREATE INDEX idx_contacts_created ON contact_messages(created_at DESC);


-- ===========================================
-- CASHIER API KEYS
-- ===========================================
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                     -- 'Main Cashier', 'Reception'
  key_hash TEXT NOT NULL UNIQUE,          -- Hashed API key
  permissions TEXT[] DEFAULT ARRAY['read'],
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
```

---

## 🔍 Availability Functions

### Check Parcel Availability (Half-Day Logic)

```sql
-- ===========================================
-- CHECK AVAILABILITY WITH HALF-DAY LOGIC
-- ===========================================
CREATE OR REPLACE FUNCTION check_parcel_availability(
  p_parcel_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS TABLE (
  is_available BOOLEAN,
  conflict_reason TEXT
) AS $$
DECLARE
  v_parcel_status TEXT;
  v_existing_booking RECORD;
  v_block RECORD;
BEGIN
  -- Check parcel exists and is active
  SELECT status INTO v_parcel_status
  FROM parcels WHERE id = p_parcel_id;
  
  IF v_parcel_status IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Parcel not found';
    RETURN;
  END IF;
  
  IF v_parcel_status != 'active' THEN
    RETURN QUERY SELECT FALSE, 'Parcel is not available';
    RETURN;
  END IF;
  
  -- Check for conflicting bookings
  -- HALF-DAY RULE: New check-in CAN be on same day as existing check-out
  SELECT * INTO v_existing_booking
  FROM bookings
  WHERE parcel_id = p_parcel_id
    AND status NOT IN ('cancelled', 'no_show')
    AND (
      -- True overlap (not same-day turnover)
      (p_check_in < check_out_date AND p_check_out > check_in_date)
      -- Exclude same-day turnover (allowed)
      AND NOT (p_check_in = check_out_date)
      AND NOT (p_check_out = check_in_date)
    )
  LIMIT 1;
  
  IF v_existing_booking IS NOT NULL THEN
    RETURN QUERY SELECT FALSE, 
      'Conflicts with booking ' || v_existing_booking.booking_code || 
      ' (' || v_existing_booking.check_in_date || ' to ' || v_existing_booking.check_out_date || ')';
    RETURN;
  END IF;
  
  -- Check for manual blocks
  SELECT * INTO v_block
  FROM availability_blocks
  WHERE parcel_id = p_parcel_id
    AND (
      (p_check_in <= end_date AND p_check_out > start_date)
    )
  LIMIT 1;
  
  IF v_block IS NOT NULL THEN
    RETURN QUERY SELECT FALSE, 
      'Blocked: ' || COALESCE(v_block.reason, 'Maintenance');
    RETURN;
  END IF;
  
  -- All clear!
  RETURN QUERY SELECT TRUE, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;


-- ===========================================
-- GET PARCEL CALENDAR (for calendar display)
-- ===========================================
CREATE OR REPLACE FUNCTION get_parcel_calendar(
  p_parcel_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  date DATE,
  status TEXT,
  booking_id UUID,
  booking_code TEXT,
  is_check_in BOOLEAN,
  is_check_out BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(p_start_date, p_end_date, '1 day'::interval)::date AS d
  ),
  booking_dates AS (
    SELECT 
      b.id,
      b.booking_code,
      b.check_in_date,
      b.check_out_date
    FROM bookings b
    WHERE b.parcel_id = p_parcel_id
      AND b.status NOT IN ('cancelled', 'no_show')
      AND b.check_in_date <= p_end_date
      AND b.check_out_date >= p_start_date
  ),
  block_dates AS (
    SELECT start_date, end_date
    FROM availability_blocks
    WHERE parcel_id = p_parcel_id
      AND start_date <= p_end_date
      AND end_date >= p_start_date
  )
  SELECT 
    ds.d AS date,
    CASE
      -- Blocked
      WHEN EXISTS (
        SELECT 1 FROM block_dates bl 
        WHERE ds.d >= bl.start_date AND ds.d <= bl.end_date
      ) THEN 'blocked'
      -- Check-out day (morning only, available afternoon)
      WHEN EXISTS (
        SELECT 1 FROM booking_dates bd 
        WHERE ds.d = bd.check_out_date
      ) AND NOT EXISTS (
        SELECT 1 FROM booking_dates bd 
        WHERE ds.d >= bd.check_in_date AND ds.d < bd.check_out_date
      ) THEN 'checkout_only'
      -- Check-in day (available morning, booked afternoon)
      WHEN EXISTS (
        SELECT 1 FROM booking_dates bd 
        WHERE ds.d = bd.check_in_date
      ) AND NOT EXISTS (
        SELECT 1 FROM booking_dates bd 
        WHERE ds.d > bd.check_in_date AND ds.d <= bd.check_out_date
      ) THEN 'checkin_only'
      -- Fully booked
      WHEN EXISTS (
        SELECT 1 FROM booking_dates bd 
        WHERE ds.d >= bd.check_in_date AND ds.d < bd.check_out_date
      ) THEN 'booked'
      -- Available
      ELSE 'available'
    END AS status,
    (
      SELECT bd.id FROM booking_dates bd
      WHERE ds.d >= bd.check_in_date AND ds.d <= bd.check_out_date
      LIMIT 1
    ) AS booking_id,
    (
      SELECT bd.booking_code FROM booking_dates bd
      WHERE ds.d >= bd.check_in_date AND ds.d <= bd.check_out_date
      LIMIT 1
    ) AS booking_code,
    EXISTS (
      SELECT 1 FROM booking_dates bd WHERE ds.d = bd.check_in_date
    ) AS is_check_in,
    EXISTS (
      SELECT 1 FROM booking_dates bd WHERE ds.d = bd.check_out_date
    ) AS is_check_out
  FROM date_series ds
  ORDER BY ds.d;
END;
$$ LANGUAGE plpgsql;


-- ===========================================
-- CALCULATE BOOKING PRICE
-- ===========================================
CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_zone_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_adults INTEGER,
  p_children_5_11 INTEGER DEFAULT 0,
  p_children_0_4 INTEGER DEFAULT 0
)
RETURNS TABLE (
  nights INTEGER,
  base_price NUMERIC,
  tourist_tax NUMERIC,
  total_price NUMERIC,
  price_breakdown JSONB
) AS $$
DECLARE
  v_day DATE;
  v_nights INTEGER;
  v_base_price NUMERIC := 0;
  v_adult_price NUMERIC;
  v_child_price NUMERIC;
  v_breakdown JSONB := '[]'::jsonb;
  v_tax_per_adult_night NUMERIC := 1.20; -- Croatian tourist tax
BEGIN
  v_nights := p_check_out - p_check_in;
  
  FOR v_day IN SELECT generate_series(p_check_in, p_check_out - 1, '1 day'::interval)::date
  LOOP
    -- Get price for this day based on season
    SELECT zp.adult_price, zp.child_5_11_price
    INTO v_adult_price, v_child_price
    FROM zone_pricing zp
    JOIN pricing_seasons ps ON zp.season_id = ps.id
    WHERE zp.zone_id = p_zone_id
      AND v_day >= ps.start_date
      AND v_day <= ps.end_date;
    
    -- Default prices if no season defined
    IF v_adult_price IS NULL THEN
      v_adult_price := 15.00;
      v_child_price := 10.00;
    END IF;
    
    -- Add to total
    v_base_price := v_base_price + (v_adult_price * p_adults) + (v_child_price * p_children_5_11);
    
    -- Add to breakdown
    v_breakdown := v_breakdown || jsonb_build_object(
      'date', v_day,
      'adult_price', v_adult_price,
      'child_price', v_child_price,
      'daily_total', (v_adult_price * p_adults) + (v_child_price * p_children_5_11)
    );
  END LOOP;
  
  RETURN QUERY SELECT
    v_nights,
    ROUND(v_base_price, 2),
    ROUND(v_tax_per_adult_night * p_adults * v_nights, 2),
    ROUND(v_base_price + (v_tax_per_adult_night * p_adults * v_nights), 2),
    v_breakdown;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔐 Row Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all profiles" ON profiles FOR ALL USING (is_admin());

-- PUBLIC TABLES (read-only for everyone)
CREATE POLICY "Public read zones" ON zones FOR SELECT USING (true);
CREATE POLICY "Public read parcels" ON parcels FOR SELECT USING (true);
CREATE POLICY "Public read seasons" ON pricing_seasons FOR SELECT USING (true);
CREATE POLICY "Public read pricing" ON zone_pricing FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admins manage zones" ON zones FOR ALL USING (is_admin());
CREATE POLICY "Admins manage parcels" ON parcels FOR ALL USING (is_admin());
CREATE POLICY "Admins manage seasons" ON pricing_seasons FOR ALL USING (is_admin());
CREATE POLICY "Admins manage pricing" ON zone_pricing FOR ALL USING (is_admin());
CREATE POLICY "Admins manage services" ON services FOR ALL USING (is_admin());

-- BOOKINGS
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can manage all bookings" ON bookings FOR ALL USING (is_admin());

-- BOOKING SERVICES
CREATE POLICY "Users can read own booking services" ON booking_services FOR SELECT 
  USING (EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_id AND bookings.user_id = auth.uid()));
CREATE POLICY "Admins can manage booking services" ON booking_services FOR ALL USING (is_admin());

-- AVAILABILITY BLOCKS
CREATE POLICY "Public read blocks" ON availability_blocks FOR SELECT USING (true);
CREATE POLICY "Admins manage blocks" ON availability_blocks FOR ALL USING (is_admin());

-- CONTACT MESSAGES
CREATE POLICY "Anyone can submit contact" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contacts" ON contact_messages FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update contacts" ON contact_messages FOR UPDATE USING (is_admin());

-- API KEYS (admin only)
CREATE POLICY "Admins manage API keys" ON api_keys FOR ALL USING (is_admin());
```

---

## 🌱 Seed Data

```sql
-- Insert zones
INSERT INTO zones (name, slug, type, color, description, min_nights) VALUES
('Tent Zone A', 'zone-a', 'tent', '#5B9BD5', 'Seaside tent zone with beautiful views', 2),
('Tent Zone B', 'zone-b', 'tent', '#70AD47', 'Shaded tent zone under pine trees', 2),
('Tent Zone C', 'zone-c', 'tent', '#7B7DB5', 'Quiet tent zone perfect for families', 2),
('Camper Pitch P1', 'camper-p1', 'camper', '#9DC3E6', 'Premium camper pitches with full hookup', 3),
('Camper Pitch P2', 'camper-p2', 'camper', '#B48FCF', 'Standard camper pitches', 3),
('Glamping Hvar', 'glamping', 'glamping', '#ED7D31', 'Luxury glamping tents with all amenities', 3);

-- Insert pricing seasons for 2025
INSERT INTO pricing_seasons (name, slug, year, start_date, end_date, sort_order) VALUES
('Low Season', 'low', 2025, '2025-04-01', '2025-05-31', 1),
('Mid Season', 'mid', 2025, '2025-06-01', '2025-06-30', 2),
('High Season', 'high', 2025, '2025-07-01', '2025-08-31', 3),
('Mid Season', 'mid-fall', 2025, '2025-09-01', '2025-09-30', 4),
('Low Season', 'low-fall', 2025, '2025-10-01', '2025-10-31', 5);

-- Insert services
INSERT INTO services (name, name_hr, price, price_type, applicable_to, sort_order) VALUES
('Electricity', 'Struja', 5.00, 'daily', ARRAY['tent', 'camper'], 1),
('Water Connection', 'Priključak vode', 3.00, 'daily', ARRAY['camper'], 2),
('Car Parking', 'Parking', 5.00, 'daily', ARRAY['tent', 'camper', 'glamping'], 3),
('Pet', 'Kućni ljubimac', 5.00, 'daily', ARRAY['tent', 'camper', 'glamping'], 4),
('Washing Machine', 'Veš mašina', 5.00, 'per_use', ARRAY['tent', 'camper', 'glamping'], 5),
('Extra Person', 'Dodatna osoba', 10.00, 'daily', ARRAY['glamping'], 6);

-- Create admin user (run after auth user exists)
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@campholiday.eu';
```

---

*Next: [13-CASHIER-API-SPEC.md](./13-CASHIER-API-SPEC.md) for API documentation*

