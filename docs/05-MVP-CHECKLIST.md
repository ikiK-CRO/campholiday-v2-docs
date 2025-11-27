# Camp Holiday MVP - Development Checklist

## Phase 1: Project Setup

### Environment Setup
- [ ] Initialize Next.js 15.x project with TypeScript
- [ ] Configure Tailwind CSS 4.x
- [ ] Set up ESLint and Prettier
- [ ] Configure path aliases in tsconfig.json
- [ ] Set up project folder structure

### Database & Auth
- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Configure Supabase Auth (email)
- [ ] Set up environment variables
- [ ] Create database types

### Base Configuration
- [ ] Configure next-intl for 5 languages
- [ ] Set up translation files (EN, HR, DE, FR, IT)
- [ ] Configure fonts (Playfair Display, DM Sans)
- [ ] Set up Tailwind theme with custom colors
- [ ] Create CSS variables

---

## Phase 2: Core Components

### Layout Components
- [ ] Header with navigation
- [ ] Mobile hamburger menu
- [ ] Footer component
- [ ] Language switcher
- [ ] Logo component (both logos)

### UI Components
- [ ] Button (primary, secondary, glamping variants)
- [ ] Card component
- [ ] Input/Form fields
- [ ] Date picker
- [ ] Calendar component
- [ ] Loading spinner
- [ ] Modal/Dialog

### Page Sections
- [ ] Hero section component
- [ ] Feature cards grid
- [ ] Accommodation card
- [ ] Image gallery
- [ ] Testimonial section (optional)
- [ ] Contact form

---

## Phase 3: Pages

### Public Pages
- [ ] Homepage
  - [ ] Hero with main image
  - [ ] Quick booking widget
  - [ ] Accommodation highlights (Camping, Glamping)
  - [ ] Features/amenities section
  - [ ] Location preview
  - [ ] CTA section

- [ ] Camping Page
  - [ ] Hero with tent zones image
  - [ ] Overview text
  - [ ] Zone cards (A, B, C)
  - [ ] Camper pitch cards (P1, P2)
  - [ ] Features/amenities
  - [ ] Link to booking

- [ ] Glamping Page
  - [ ] Hero with glamping image
  - [ ] Introduction text
  - [ ] Tent features
  - [ ] Gallery
  - [ ] Link to booking

- [ ] Map Page
  - [ ] React-Leaflet integration
  - [ ] GeoJSON zone layers
  - [ ] Zone color coding
  - [ ] Facilities markers
  - [ ] Legend component
  - [ ] Parcel click popup
  - [ ] Zoom controls

- [ ] About Page
  - [ ] Team description
  - [ ] Location info
  - [ ] Image gallery

- [ ] Contact Page
  - [ ] Contact form
  - [ ] Address/phone/email
  - [ ] Google Maps embed
  - [ ] Social links

---

## Phase 4: Booking System

### Availability System
- [ ] Availability checking function
- [ ] Same-day availability logic (check-out noon, check-in 2pm)
- [ ] Calendar view with availability status
- [ ] Price calculation function

### Booking Flow
- [ ] Booking type selection (tent/camper/glamping)
- [ ] Zone/parcel selection
- [ ] Date picker with availability
- [ ] Guest counter (adults, children)
- [ ] Additional services selection
- [ ] Price summary
- [ ] User info form
- [ ] Confirmation page

### Booking API
- [ ] POST /api/bookings - Create booking
- [ ] GET /api/availability - Check availability
- [ ] GET /api/pricing - Calculate price
- [ ] GET /api/parcels - List parcels

---

## Phase 5: Authentication

### Auth Pages
- [ ] Login page with email
- [ ] Register page with email
- [ ] Forgot password page
- [ ] Email verification flow

### Auth Components
- [ ] Login form
- [ ] Register form
- [ ] Social login buttons (placeholder only)
- [ ] Password reset form

### Auth Logic
- [ ] Supabase Auth integration
- [ ] Session management
- [ ] Protected routes middleware
- [ ] User profile creation

---

## Phase 6: User Dashboard (MVP - Visible, Limited Functionality)

### Dashboard Pages
- [ ] Dashboard overview
- [ ] My bookings list
- [ ] Booking detail view
- [ ] Profile settings page

### Dashboard Features
- [ ] View upcoming bookings
- [ ] View past bookings
- [ ] Edit profile information
- [ ] Change password

---

## Phase 7: Admin Dashboard (MVP - Visible, Limited Functionality)

### Admin Pages
- [ ] Admin login
- [ ] Dashboard with stats
- [ ] Bookings management
- [ ] Calendar view
- [ ] Settings page

### Admin Features (MVP)
- [ ] View all bookings
- [ ] Filter bookings by status/date
- [ ] Basic stats display
- [ ] View contact messages

---

## Phase 8: Map Implementation

### GeoJSON Data
- [ ] Extract coordinates from original site
- [ ] Create zone-a.json
- [ ] Create zone-b.json
- [ ] Create zone-c.json
- [ ] Create glamping.json
- [ ] Create camper-p1.json
- [ ] Create camper-p2.json
- [ ] Create facilities.json

### Map Features
- [ ] Render all zones with colors
- [ ] Parcel labels
- [ ] Click to view parcel info
- [ ] Zoom to zone
- [ ] Legend toggle
- [ ] Responsive map container

---

## Phase 9: Internationalization

### Translation Files
- [ ] English (EN) - Complete
- [ ] Croatian (HR) - Complete
- [ ] German (DE) - Complete
- [ ] French (FR) - Complete
- [ ] Italian (IT) - Complete

### Translatable Content
- [ ] Navigation labels
- [ ] Button text
- [ ] Form labels
- [ ] Error messages
- [ ] Page titles
- [ ] Meta descriptions
- [ ] Zone descriptions (in DB)

---

## Phase 10: Final Polish

### Performance
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Bundle optimization
- [ ] Lighthouse audit

### Testing
- [ ] Mobile responsive testing
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Form validation testing
- [ ] Booking flow testing
- [ ] Auth flow testing

### SEO
- [ ] Meta tags
- [ ] Open Graph tags
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Structured data (JSON-LD)

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast check
- [ ] Focus states
- [ ] Alt texts

---

## Assets Checklist

### Images (Provided)
- [x] MAIN_HERO_SECTION_IMG_8554.webp
- [x] GLAPMING_HERO_SECTION_IMG_7324.webp
- [x] GLAMPING_GALERY_HERO_IMG_7293.webp
- [x] TENT_ZONES_HERO_IMG_5291.webp

### Logos
- [x] logo1.png (Camp Holiday)
- [x] logo2.jpg (Glamping Hvar)
- [ ] SVG versions (to be created)

### Placeholder Images Needed
- [ ] Zone A gallery
- [ ] Zone B gallery
- [ ] Zone C gallery
- [ ] Camper pitch images
- [ ] Beach images
- [ ] Beach bar images
- [ ] Facilities images
- [ ] Aerial/drone images

### Icons
- [ ] Zone icons
- [ ] Facility icons
- [ ] Social media icons
- [ ] Navigation icons

---

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrated to production
- [ ] Images optimized and uploaded
- [ ] SSL certificate configured

### Deployment
- [ ] Deploy to Vercel
- [ ] Configure custom domain
- [ ] Set up redirects
- [ ] Configure CORS for API

### Post-Deployment
- [ ] Test all functionality
- [ ] Monitor for errors
- [ ] Set up analytics
- [ ] Backup database

---

## Future Enhancements (Post-MVP)

- [ ] Stripe payment integration
- [ ] Email notifications (Resend)
- [ ] Advanced admin reports
- [ ] Review system
- [ ] Cashier API
- [ ] Mobile app considerations
- [ ] Channel manager integration


