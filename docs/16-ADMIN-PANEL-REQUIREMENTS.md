# Admin Panel Requirements

Complete specification for the Camp Holiday administration interface.

---

## 🎯 Overview

The admin panel provides camp staff with tools to:
- Manage bookings (view, edit, create, cancel)
- Monitor arrivals and departures
- Manage parcel availability
- Configure pricing and services
- View reports and statistics
- Handle user accounts

---

## 👥 User Roles

| Role | Access | Description |
|------|--------|-------------|
| **Admin** | Full access | Complete control over all features |
| **Staff** | Booking management | Can manage bookings, no pricing/settings |
| **Viewer** | Read-only | Can view data but not modify |

---

## 📱 Admin Routes Structure

```
/admin                          # Dashboard
/admin/bookings                 # Booking list
/admin/bookings/new             # Create booking
/admin/bookings/[id]            # Booking details
/admin/bookings/calendar        # Calendar view
/admin/parcels                  # Parcel management
/admin/parcels/[id]             # Parcel details
/admin/pricing                  # Pricing configuration
/admin/services                 # Additional services
/admin/users                    # User management
/admin/contacts                 # Contact messages
/admin/reports                  # Reports & analytics
/admin/settings                 # Site settings
/admin/api-keys                 # Cashier API keys
```

---

## 📊 Dashboard

### Key Metrics (Today)

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   ARRIVALS      │   DEPARTURES    │   OCCUPANCY     │   PENDING       │
│       5         │       3         │      78%        │       12        │
│   arriving      │   leaving       │   occupied      │   bookings      │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### Quick Actions

- [ ] Create new booking
- [ ] Block dates
- [ ] View today's arrivals
- [ ] View pending bookings

### Charts

1. **Occupancy by Zone** (donut chart)
2. **Bookings This Month** (bar chart)
3. **Revenue This Month** (line chart)

### Recent Activity

```
- 10:30 - Booking CH-ABC123 confirmed
- 09:45 - Guest checked in (A5)
- 09:15 - New contact message received
- Yesterday - Booking CH-XYZ789 created
```

---

## 📅 Booking Management

### Booking List View

| Column | Sortable | Filterable |
|--------|----------|------------|
| Booking Code | ✅ | ✅ |
| Guest Name | ✅ | ✅ |
| Parcel | ✅ | ✅ |
| Check-in | ✅ | ✅ |
| Check-out | ✅ | ✅ |
| Guests | ❌ | ❌ |
| Total | ✅ | ❌ |
| Status | ✅ | ✅ |
| Payment | ✅ | ✅ |
| Actions | ❌ | ❌ |

### Filters

```
Status:     [ All ] [ Pending ] [ Confirmed ] [ Cancelled ]
Payment:    [ All ] [ Unpaid ] [ Partial ] [ Paid ]
Zone:       [ All ] [ Zone A ] [ Zone B ] ... [ Glamping ]
Date Range: [ Check-in From ] [ Check-in To ]
Search:     [ Guest name, email, phone, booking code ]
```

### Booking Detail View

```
┌────────────────────────────────────────────────────────────────┐
│  BOOKING: CH-ABC123                      Status: [CONFIRMED ▼] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  GUEST INFORMATION                       PARCEL                │
│  ──────────────────                      ──────                │
│  Name: John Smith                        Code: A5              │
│  Email: john@example.com                 Zone: Tent Zone A     │
│  Phone: +385 91 123 4567                 View on Map →         │
│  Address: 123 Main St, Zagreb                                  │
│                                                                │
│  DATES                                   GUESTS                │
│  ─────                                   ──────                │
│  Check-in:  July 15, 2025 (14:00)       Adults: 2             │
│  Check-out: July 20, 2025 (12:00)       Children 5-11: 1      │
│  Nights: 5                               Children 0-4: 0       │
│                                          Total: 3              │
│                                                                │
│  SERVICES                                                      │
│  ────────                                                      │
│  ☑ Electricity       5 × €5.00  =  €25.00                     │
│  ☑ Car Parking       5 × €5.00  =  €25.00                     │
│                                                                │
│  PRICING BREAKDOWN                                             │
│  ─────────────────                                             │
│  Base Price:           €130.00                                 │
│  Services:              €50.00                                 │
│  Tourist Tax:           €18.00                                 │
│  ─────────────────────────────                                 │
│  TOTAL:                €198.00                                 │
│                                                                │
│  PAYMENT STATUS: [PARTIAL ▼]                                   │
│  ─────────────────                                             │
│  Deposit (30%):         €59.40  ✓ Paid                        │
│  Balance Due:          €138.60                                 │
│                                                                │
│  [ Record Payment ]                                            │
│                                                                │
│  NOTES                                                         │
│  ─────                                                         │
│  Guest: "Arriving late around 6 PM"                           │
│  Admin: [ Add internal note... ]                              │
│                                                                │
│  HISTORY                                                       │
│  ───────                                                       │
│  July 10, 14:22 - Deposit paid                                │
│  June 1, 10:30  - Booking confirmed                           │
│  June 1, 10:28  - Booking created                             │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  [ Edit ] [ Cancel Booking ] [ Send Email ] [ Print ]         │
└────────────────────────────────────────────────────────────────┘
```

### Create/Edit Booking

Form fields:
- Date picker (check-in/check-out)
- Parcel selector (with availability check)
- Guest counter (adults, children)
- Guest details (name, email, phone, address)
- Services checkboxes
- Notes field
- Auto-calculated pricing

### Calendar View

```
         July 2025
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  14 │  15 │  16 │  17 │  18 │  19 │  20 │
│     │ ▼5  │     │     │     │     │ △3  │
│     │ arr │     │     │     │     │ dep │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  21 │  22 │  23 │  24 │  25 │  26 │  27 │
│ ▼8  │     │     │     │ △4  │     │     │
│ arr │     │     │     │ dep │     │     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘

▼ = Arrivals    △ = Departures
Click date to see details
```

---

## 🏕️ Parcel Management

### Parcel List

| Column | Description |
|--------|-------------|
| Code | Parcel code (A1, B2, etc.) |
| Zone | Zone assignment |
| Type | tent/camper/glamping |
| Capacity | Max guests |
| Amenities | Electricity, water icons |
| Status | Active/Maintenance/Inactive |
| Current | Current booking or "Available" |

### Parcel Detail

- View parcel info and map location
- See upcoming bookings
- Block dates (maintenance, etc.)
- Edit amenities

### Block Dates

```
┌─────────────────────────────────────────┐
│  BLOCK PARCEL A5                        │
├─────────────────────────────────────────┤
│  From:   [ July 25, 2025 ]              │
│  To:     [ July 28, 2025 ]              │
│  Reason: [ Maintenance      ▼]          │
│          ○ Maintenance                  │
│          ○ Private Use                  │
│          ○ Other: [______________]      │
│                                         │
│  [ Cancel ]              [ Block Dates ]│
└─────────────────────────────────────────┘
```

---

## 💰 Pricing Management

### Seasons

```
┌────────────────────────────────────────────────────────────────┐
│  PRICING SEASONS - 2025                           [ Add Season ]│
├────────────────────────────────────────────────────────────────┤
│  Season       │ Start      │ End        │ Status   │ Actions  │
├───────────────┼────────────┼────────────┼──────────┼──────────┤
│  Low Season   │ Apr 1      │ May 31     │ Active   │ [Edit]   │
│  Mid Season   │ Jun 1      │ Jun 30     │ Active   │ [Edit]   │
│  High Season  │ Jul 1      │ Aug 31     │ Active   │ [Edit]   │
│  Mid Season   │ Sep 1      │ Sep 30     │ Active   │ [Edit]   │
│  Low Season   │ Oct 1      │ Oct 31     │ Active   │ [Edit]   │
└────────────────────────────────────────────────────────────────┘
```

### Zone Pricing Matrix

```
                    │  Low   │  Mid   │  High  │  Peak  │
────────────────────┼────────┼────────┼────────┼────────┤
 Tent Zone A        │        │        │        │        │
   Adult            │  €10   │  €13   │  €16   │  €20   │
   Child (5-11)     │   €6   │   €8   │  €10   │  €12   │
────────────────────┼────────┼────────┼────────┼────────┤
 Tent Zone B        │        │        │        │        │
   Adult            │  €10   │  €13   │  €16   │  €20   │
   Child (5-11)     │   €6   │   €8   │  €10   │  €12   │
────────────────────┼────────┼────────┼────────┼────────┤
 Glamping           │        │        │        │        │
   Per night        │ €100   │ €120   │ €150   │ €180   │
────────────────────┴────────┴────────┴────────┴────────┘

[ Save Changes ]
```

---

## ➕ Services Management

```
┌────────────────────────────────────────────────────────────────┐
│  ADDITIONAL SERVICES                              [ Add Service ]│
├────────────────────────────────────────────────────────────────┤
│  Service      │ Price  │ Type      │ Applies To  │ Status      │
├───────────────┼────────┼───────────┼─────────────┼─────────────┤
│  Electricity  │  €5    │ Per day   │ Tent,Camper │ ✓ Active    │
│  Water        │  €3    │ Per day   │ Camper      │ ✓ Active    │
│  Car Parking  │  €5    │ Per day   │ All         │ ✓ Active    │
│  Pet          │  €5    │ Per day   │ All         │ ✓ Active    │
│  Washing      │  €5    │ Per use   │ All         │ ✓ Active    │
└────────────────────────────────────────────────────────────────┘
```

---

## 📧 Contact Messages

```
┌────────────────────────────────────────────────────────────────┐
│  CONTACT MESSAGES                          [ New ] [ Read ] [ All ]│
├────────────────────────────────────────────────────────────────┤
│  ● John Smith                              Jul 15, 10:30       │
│    Availability question                                       │
│    "Hi, I wanted to ask about availability..."                │
├────────────────────────────────────────────────────────────────┤
│  ○ Maria Garcia                            Jul 14, 15:45       │
│    Group booking inquiry                                       │
│    "We are a group of 20 people and..."                       │
├────────────────────────────────────────────────────────────────┤
│  ✓ Peter Mueller                           Jul 13, 09:20       │
│    Price question - Replied                                    │
│    "What are your rates for July?"                            │
└────────────────────────────────────────────────────────────────┘

● New   ○ Read   ✓ Replied
```

---

## 📈 Reports

### Available Reports

1. **Occupancy Report**
   - Occupancy % by zone
   - Occupancy % by date range
   - Comparison to previous period

2. **Revenue Report**
   - Total revenue by period
   - Revenue by zone
   - Revenue by service
   - Average booking value

3. **Booking Report**
   - Bookings by status
   - Bookings by source
   - Cancellation rate
   - Lead time analysis

4. **Guest Report**
   - Total guests by period
   - Nationality breakdown
   - Repeat guests

### Export Options

- [ ] PDF
- [ ] Excel
- [ ] CSV

---

## 🔑 API Key Management

```
┌────────────────────────────────────────────────────────────────┐
│  CASHIER API KEYS                                 [ Create Key ]│
├────────────────────────────────────────────────────────────────┤
│  Name           │ Permissions       │ Last Used    │ Status    │
├─────────────────┼───────────────────┼──────────────┼───────────┤
│  Main Reception │ read,write,checkin│ 2 hours ago  │ ✓ Active  │
│  Beach Bar      │ read              │ Yesterday    │ ✓ Active  │
│  Test Key       │ read,write        │ Never        │ ○ Inactive│
└────────────────────────────────────────────────────────────────┘

Click key to view/regenerate. Keys are shown only once when created.
```

---

## ⚙️ Settings

### General Settings

- Site name
- Contact email
- Contact phone
- Address
- Check-in time (default: 14:00)
- Check-out time (default: 12:00)
- Default currency (EUR)
- Timezone (Europe/Zagreb)

### Booking Settings

- Minimum nights per zone
- Maximum guests per parcel type
- Deposit percentage
- Booking confirmation auto-send
- Cancellation policy text

### Email Settings

- SMTP configuration
- Email templates
- Notification recipients

---

## 🔒 Security Requirements

1. **Authentication**
   - Admin login separate from guest login
   - Session timeout (30 minutes inactivity)
   - Password requirements (8+ chars, mixed)

2. **Authorization**
   - Role-based access control
   - Audit logging for all changes
   - IP whitelist option

3. **Data Protection**
   - GDPR compliance
   - Guest data export
   - Data deletion requests

---

## 📱 Mobile Responsiveness

The admin panel must work on tablets (minimum 768px width):
- Responsive tables with horizontal scroll
- Collapsible sidebar navigation
- Touch-friendly buttons and inputs
- Optimized calendar view for mobile

---

## ✅ Implementation Checklist

### Phase 1: Core Admin
- [ ] Admin layout with sidebar
- [ ] Dashboard with key metrics
- [ ] Booking list with filters
- [ ] Booking detail view
- [ ] Basic reports

### Phase 2: Management
- [ ] Create/edit booking
- [ ] Parcel management
- [ ] Block dates feature
- [ ] Pricing seasons
- [ ] Services management

### Phase 3: Advanced
- [ ] Calendar view
- [ ] User management
- [ ] Contact messages
- [ ] API key management
- [ ] Settings page

### Phase 4: Polish
- [ ] Advanced reports
- [ ] Export functionality
- [ ] Email templates
- [ ] Audit logging
- [ ] Mobile optimization

---

*This completes the production documentation suite.*

