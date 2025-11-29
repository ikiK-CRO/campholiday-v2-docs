# Camp Holiday - Production Roadmap

## 📋 Executive Summary

This document outlines the complete plan to bring Camp Holiday from the current MVP state to a production-ready booking system with:
- Real authentication (Supabase Auth)
- PostgreSQL database (Supabase)
- Half-day booking calendar logic
- Cashier API integration (no payment gateway)
- Full internationalization (5 languages)
- Functional admin panel

---

## 🎯 Project Scope

### What We're Building

| Component | Description | Status |
|-----------|-------------|--------|
| **Frontend UI** | Beautiful, responsive Next.js website | ✅ Complete |
| **Interactive Map** | Leaflet-based parcel selection | ✅ Complete |
| **Supabase Backend** | Auth, Database, Storage | 🔄 To implement |
| **Booking System** | Half-day calendar logic | 🔄 To implement |
| **Cashier API** | REST API for external cashier | 🔄 To implement |
| **Admin Panel** | Full booking/parcel management | 🔄 To implement |
| **Localization** | EN, HR, DE, FR, IT | 🔄 To implement |

### What We're NOT Building (Phase 1)
- ❌ Payment gateway integration (client uses external cashier)
- ❌ Mobile app
- ❌ Channel manager integration

---

## 📁 Documentation Index

| Document | Description |
|----------|-------------|
| [11-SUPABASE-SETUP-GUIDE.md](./11-SUPABASE-SETUP-GUIDE.md) | Step-by-step Supabase configuration |
| [12-DATABASE-SCHEMA.md](./12-DATABASE-SCHEMA.md) | Complete database schema with SQL |
| [13-CASHIER-API-SPEC.md](./13-CASHIER-API-SPEC.md) | API specification for cashier integration |
| [14-LOCALIZATION-GUIDE.md](./14-LOCALIZATION-GUIDE.md) | i18n implementation guide |
| [15-GEOJSON-EXTRACTION-GUIDE.md](./15-GEOJSON-EXTRACTION-GUIDE.md) | Extract parcels from DWG files |
| [16-ADMIN-PANEL-REQUIREMENTS.md](./16-ADMIN-PANEL-REQUIREMENTS.md) | Admin panel features |

---

## 🗓️ Implementation Timeline

### Phase 1: Backend Foundation (Week 1-2)

#### Week 1: Supabase Setup
- [ ] Create Supabase project
- [ ] Configure authentication (email/password)
- [ ] Run database migrations
- [ ] Set up Row Level Security (RLS)
- [ ] Create initial seed data

#### Week 2: API Layer
- [ ] Create Supabase client utilities
- [ ] Implement authentication hooks
- [ ] Build availability checking API
- [ ] Build pricing calculation API

### Phase 2: Booking System (Week 3-4)

#### Week 3: Booking Flow
- [ ] Date picker with half-day logic
- [ ] Guest counter with validation
- [ ] Available parcels display
- [ ] Additional services selection
- [ ] Real-time price calculator

#### Week 4: Booking Completion
- [ ] User data form
- [ ] Booking confirmation
- [ ] Email notifications (Resend)
- [ ] User booking history

### Phase 3: Admin Panel (Week 5-6)

#### Week 5: Core Admin Features
- [ ] Admin authentication/authorization
- [ ] Booking management (CRUD)
- [ ] Calendar view (arrivals/departures)
- [ ] Parcel status management

#### Week 6: Advanced Admin
- [ ] Pricing season management
- [ ] Reports and statistics
- [ ] Manual booking creation
- [ ] Availability blocking

### Phase 4: Cashier API (Week 7)

- [ ] API authentication (API keys)
- [ ] Today's arrivals/departures endpoint
- [ ] Check-in/check-out endpoints
- [ ] Booking details endpoint
- [ ] API documentation

### Phase 5: Localization (Week 8)

- [ ] next-intl setup with locale routing
- [ ] Extract all UI strings
- [ ] Croatian translation
- [ ] German translation
- [ ] French translation
- [ ] Italian translation
- [ ] Database multilingual content

### Phase 6: Testing & Launch (Week 9-10)

- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment
- [ ] DNS/domain configuration
- [ ] Monitoring setup

---

## 🔧 Technical Decisions

### Authentication
```
Provider: Supabase Auth
Methods: Email/password (Phase 1), Google/Apple OAuth (Phase 2)
Session: JWT with refresh tokens
Storage: HTTP-only cookies
```

### Database
```
Provider: Supabase (PostgreSQL)
ORM: Direct Supabase client (no Prisma for simplicity)
Migrations: SQL files in /supabase/migrations
```

### API Architecture
```
Internal: Next.js API routes + Supabase client
External: Cashier API with API key authentication
Rate limiting: Supabase + Vercel edge config
```

### Hosting
```
Frontend: Vercel
Backend: Supabase
Domain: campholiday.eu (client's domain)
CDN: Vercel Edge Network
```

---

## 📊 Data Requirements from Client

### Required Before Development

| Item | Description | Format | Status |
|------|-------------|--------|--------|
| **DWG Map File** | Camp layout with parcel boundaries | .dwg | ⏳ Pending |
| **Parcel List** | All parcels with codes and zones | Excel/CSV | ⏳ Pending |
| **Pricing Tables** | Seasonal prices per zone | Excel/CSV | ⏳ Pending |
| **Service List** | Additional services with prices | List | ⏳ Pending |
| **Translations** | Content in HR, DE, FR, IT | Text files | ⏳ Pending |
| **Admin Accounts** | Initial admin user details | Email list | ⏳ Pending |

### GeoJSON Extraction Process

1. **Client provides**: DWG file of camp map
2. **Developer extracts**: Parcel polygons as GeoJSON
3. **Tools needed**: QGIS (free) or AutoCAD
4. **See**: [15-GEOJSON-EXTRACTION-GUIDE.md](./15-GEOJSON-EXTRACTION-GUIDE.md)

---

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] All translations complete
- [ ] Database seeded with real data
- [ ] Parcel GeoJSON verified
- [ ] Admin accounts created
- [ ] Email templates configured
- [ ] API keys generated for cashier

### Launch Day
- [ ] DNS records updated
- [ ] SSL certificate verified
- [ ] Production environment variables set
- [ ] Monitoring dashboards ready
- [ ] Backup strategy confirmed

### Post-Launch
- [ ] Real booking test (create → cancel)
- [ ] Cashier API integration test
- [ ] Multi-language verification
- [ ] Mobile device testing

---

## 💰 Cost Estimates (Monthly)

| Service | Free Tier | Production Est. |
|---------|-----------|-----------------|
| Supabase | 500MB DB, 1GB storage | ~$25/month |
| Vercel | 100GB bandwidth | ~$20/month |
| Resend (email) | 100 emails/day | ~$20/month |
| Domain | - | ~$15/year |
| **Total** | $0 | **~$65/month** |

---

## 📞 Communication Plan

### Weekly Updates
- Progress report every Friday
- Demo of completed features
- Blockers and dependencies

### Key Milestones
1. Backend live with auth ✓
2. Booking flow working ✓
3. Admin panel functional ✓
4. Cashier API ready ✓
5. Translations complete ✓
6. Production launch 🚀

---

## ❓ Open Questions for Client

1. **Check-in/out times**: Currently 14:00/12:00 - confirm?
2. **Deposit policy**: 30% deposit required? On confirmation or arrival?
3. **Cancellation policy**: Refund rules?
4. **Minimum stay**: Different by season?
5. **Pet policy**: Max number of pets? Extra fee?
6. **Cashier system details**: Which software? API docs available?

---

*Last updated: November 29, 2025*

