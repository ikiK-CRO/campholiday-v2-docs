# Localization Implementation Guide

Complete guide for implementing multi-language support with next-intl.

---

## 🌍 Supported Languages

| Code | Language | Native Name | Flag | Priority |
|------|----------|-------------|------|----------|
| `en` | English | English | 🇬🇧 | Default |
| `hr` | Croatian | Hrvatski | 🇭🇷 | High |
| `de` | German | Deutsch | 🇩🇪 | High |
| `it` | Italian | Italiano | 🇮🇹 | Medium |
| `fr` | French | Français | 🇫🇷 | Medium |

---

## 📦 Installation

```bash
npm install next-intl
```

---

## 🔧 Configuration

### 1. Create i18n Configuration

```typescript
// src/i18n/config.ts
export const locales = ['en', 'hr', 'de', 'it', 'fr'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hr: 'Hrvatski',
  de: 'Deutsch',
  it: 'Italiano',
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  hr: '🇭🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  fr: '🇫🇷',
};
```

### 2. Create Request Configuration

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = locales.includes(locale as any) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
    timeZone: 'Europe/Zagreb',
    now: new Date(),
  };
});
```

### 3. Middleware Setup

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Only show locale in URL when not default
  localeDetection: true,     // Detect from browser/cookie
});

export const config = {
  // Match all pathnames except for
  // - ... files in public folder
  // - api routes
  // - _next
  matcher: ['/', '/(hr|de|it|fr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### 4. Next.js Configuration

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  // ... your other config
};

export default withNextIntl(nextConfig);
```

---

## 📁 File Structure

```
src/
├── i18n/
│   ├── config.ts              # Locale configuration
│   ├── request.ts             # Server request config
│   └── messages/
│       ├── en.json            # English (default)
│       ├── hr.json            # Croatian
│       ├── de.json            # German
│       ├── it.json            # Italian
│       └── fr.json            # French
├── app/
│   └── [locale]/              # Locale-aware routes
│       ├── layout.tsx
│       ├── page.tsx
│       ├── booking/
│       └── ...
```

---

## 📝 Translation Files

### English (en.json) - Master File

```json
{
  "common": {
    "siteName": "Camp Holiday",
    "tagline": "Your paradise on Hvar island",
    "bookNow": "Book Now",
    "learnMore": "Learn More",
    "viewAll": "View All",
    "close": "Close",
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "navigation": {
    "home": "Home",
    "camping": "Camping",
    "glamping": "Glamping",
    "map": "Map",
    "about": "About",
    "contact": "Contact",
    "booking": "Booking",
    "login": "Sign In",
    "register": "Register",
    "dashboard": "Dashboard",
    "admin": "Admin"
  },
  "hero": {
    "title": "Welcome to Camp Holiday",
    "subtitle": "Experience the magic of Hvar island",
    "description": "Discover authentic Mediterranean camping under the pine trees, just steps from the crystal-clear Adriatic Sea.",
    "cta": {
      "primary": "Book Your Stay",
      "secondary": "Explore the Camp"
    }
  },
  "zones": {
    "tentA": {
      "name": "Tent Zone A",
      "description": "Seaside tent zone with beautiful sea views and direct beach access."
    },
    "tentB": {
      "name": "Tent Zone B",
      "description": "Shaded zone under pine trees, perfect for hot summer days."
    },
    "tentC": {
      "name": "Tent Zone C",
      "description": "Quiet family zone, ideal for families with children."
    },
    "camperP1": {
      "name": "Camper Pitch P1",
      "description": "Premium pitches with full hookup and extra space."
    },
    "camperP2": {
      "name": "Camper Pitch P2",
      "description": "Standard pitches with essential amenities."
    },
    "glamping": {
      "name": "Glamping Hvar",
      "description": "Luxury safari tents with all modern amenities."
    }
  },
  "booking": {
    "title": "Book Your Stay",
    "steps": {
      "dates": "Select Dates",
      "guests": "Number of Guests",
      "accommodation": "Choose Accommodation",
      "services": "Additional Services",
      "details": "Your Details",
      "confirm": "Confirm Booking"
    },
    "dates": {
      "checkIn": "Check-in",
      "checkOut": "Check-out",
      "nights": "{count, plural, =1 {# night} other {# nights}}",
      "selectDates": "Select your dates"
    },
    "guests": {
      "adults": "Adults",
      "adultsHelp": "18 years and older",
      "children511": "Children (5-11)",
      "children511Help": "5 to 11 years old",
      "children04": "Infants (0-4)",
      "children04Help": "Under 5 years - free",
      "total": "Total guests"
    },
    "services": {
      "title": "Additional Services",
      "electricity": "Electricity",
      "water": "Water Connection",
      "car": "Car Parking",
      "pet": "Pet",
      "washing": "Washing Machine Use",
      "perDay": "per day",
      "perUse": "per use"
    },
    "summary": {
      "title": "Booking Summary",
      "accommodation": "Accommodation",
      "basePrice": "Base Price",
      "services": "Services",
      "touristTax": "Tourist Tax",
      "total": "Total",
      "deposit": "Deposit (30%)",
      "balanceDue": "Balance due on arrival"
    },
    "form": {
      "name": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "address": "Address",
      "city": "City",
      "country": "Country",
      "notes": "Special Requests"
    },
    "confirmation": {
      "title": "Booking Confirmed!",
      "code": "Booking Code",
      "message": "Thank you for your reservation. A confirmation email has been sent to {email}.",
      "checkIn": "Check-in",
      "checkOut": "Check-out",
      "viewBooking": "View Booking",
      "backHome": "Back to Home"
    },
    "errors": {
      "unavailable": "Selected accommodation is not available for these dates.",
      "invalidDates": "Please select valid check-in and check-out dates.",
      "minNights": "Minimum stay is {min} nights.",
      "maxGuests": "Maximum capacity is {max} guests."
    }
  },
  "calendar": {
    "available": "Available",
    "booked": "Booked",
    "blocked": "Not Available",
    "checkoutOnly": "Check-out only",
    "checkinAvailable": "Available from 2 PM",
    "legend": "Calendar Legend"
  },
  "auth": {
    "login": {
      "title": "Welcome Back",
      "subtitle": "Sign in to your account",
      "email": "Email",
      "password": "Password",
      "rememberMe": "Remember me",
      "forgotPassword": "Forgot password?",
      "submit": "Sign In",
      "noAccount": "Don't have an account?",
      "register": "Create Account"
    },
    "register": {
      "title": "Create Account",
      "subtitle": "Join Camp Holiday",
      "name": "Full Name",
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "terms": "I agree to the Terms and Conditions",
      "submit": "Create Account",
      "hasAccount": "Already have an account?",
      "login": "Sign In"
    },
    "errors": {
      "invalidCredentials": "Invalid email or password",
      "emailTaken": "Email already in use",
      "weakPassword": "Password must be at least 8 characters",
      "passwordMismatch": "Passwords do not match"
    }
  },
  "contact": {
    "title": "Contact Us",
    "subtitle": "We'd love to hear from you",
    "form": {
      "name": "Your Name",
      "email": "Your Email",
      "subject": "Subject",
      "message": "Message",
      "send": "Send Message"
    },
    "info": {
      "address": "Address",
      "phone": "Phone",
      "email": "Email",
      "hours": "Reception Hours"
    },
    "success": "Thank you! Your message has been sent.",
    "error": "Failed to send message. Please try again."
  },
  "footer": {
    "description": "Camp Holiday - Your paradise on Hvar island. Camping, glamping and unforgettable experiences since 2014.",
    "quickLinks": "Quick Links",
    "contact": "Contact",
    "followUs": "Follow Us",
    "copyright": "© {year} Camp Holiday. All rights reserved."
  },
  "meta": {
    "home": {
      "title": "Camp Holiday Hvar - Camping & Glamping in Croatia",
      "description": "Experience authentic Mediterranean camping on Hvar island. Tent zones, camper pitches, and luxury glamping. Book your Croatian adventure today."
    },
    "camping": {
      "title": "Camping Zones - Camp Holiday Hvar",
      "description": "Choose from our tent zones and camper pitches. Shaded spots under pine trees, sea views, and all essential amenities."
    },
    "glamping": {
      "title": "Glamping Hvar - Luxury Safari Tents",
      "description": "Luxury glamping in Croatia. Seven exclusive safari tents with modern amenities, private terraces, and stunning nature."
    }
  }
}
```

### Croatian (hr.json)

```json
{
  "common": {
    "siteName": "Camp Holiday",
    "tagline": "Vaš raj na otoku Hvaru",
    "bookNow": "Rezerviraj",
    "learnMore": "Saznaj više",
    "viewAll": "Vidi sve",
    "close": "Zatvori",
    "save": "Spremi",
    "cancel": "Odustani",
    "loading": "Učitavanje...",
    "error": "Greška",
    "success": "Uspješno"
  },
  "navigation": {
    "home": "Početna",
    "camping": "Kampiranje",
    "glamping": "Glamping",
    "map": "Karta",
    "about": "O nama",
    "contact": "Kontakt",
    "booking": "Rezervacija",
    "login": "Prijava",
    "register": "Registracija",
    "dashboard": "Nadzorna ploča",
    "admin": "Administracija"
  },
  "hero": {
    "title": "Dobrodošli u Camp Holiday",
    "subtitle": "Doživite čaroliju otoka Hvara",
    "description": "Otkrijte autentično mediteransko kampiranje pod borovima, samo nekoliko koraka od kristalno čistog Jadranskog mora.",
    "cta": {
      "primary": "Rezervirajte smještaj",
      "secondary": "Istražite kamp"
    }
  },
  "booking": {
    "title": "Rezervirajte smještaj",
    "steps": {
      "dates": "Odaberite datume",
      "guests": "Broj gostiju",
      "accommodation": "Odaberite smještaj",
      "services": "Dodatne usluge",
      "details": "Vaši podaci",
      "confirm": "Potvrda rezervacije"
    },
    "dates": {
      "checkIn": "Dolazak",
      "checkOut": "Odlazak",
      "nights": "{count, plural, =1 {# noć} =2 {# noći} =3 {# noći} =4 {# noći} other {# noći}}",
      "selectDates": "Odaberite datume"
    },
    "guests": {
      "adults": "Odrasli",
      "adultsHelp": "18 godina i stariji",
      "children511": "Djeca (5-11)",
      "children511Help": "5 do 11 godina",
      "children04": "Bebe (0-4)",
      "children04Help": "Do 5 godina - besplatno",
      "total": "Ukupno gostiju"
    },
    "services": {
      "title": "Dodatne usluge",
      "electricity": "Struja",
      "water": "Priključak vode",
      "car": "Parking za auto",
      "pet": "Kućni ljubimac",
      "washing": "Korištenje perilice",
      "perDay": "po danu",
      "perUse": "po korištenju"
    },
    "summary": {
      "title": "Sažetak rezervacije",
      "accommodation": "Smještaj",
      "basePrice": "Osnovna cijena",
      "services": "Usluge",
      "touristTax": "Turistička pristojba",
      "total": "Ukupno",
      "deposit": "Akontacija (30%)",
      "balanceDue": "Ostatak plaćanja pri dolasku"
    }
  },
  "calendar": {
    "available": "Slobodno",
    "booked": "Zauzeto",
    "blocked": "Nedostupno",
    "checkoutOnly": "Samo odlazak",
    "checkinAvailable": "Slobodno od 14h",
    "legend": "Legenda kalendara"
  },
  "contact": {
    "title": "Kontaktirajte nas",
    "subtitle": "Rado ćemo vam pomoći",
    "form": {
      "name": "Vaše ime",
      "email": "Vaš email",
      "subject": "Predmet",
      "message": "Poruka",
      "send": "Pošalji poruku"
    },
    "success": "Hvala! Vaša poruka je poslana.",
    "error": "Slanje nije uspjelo. Pokušajte ponovo."
  },
  "footer": {
    "description": "Camp Holiday - Vaš raj na otoku Hvaru. Kampiranje, glamping i nezaboravna iskustva od 2014.",
    "quickLinks": "Brze veze",
    "contact": "Kontakt",
    "followUs": "Pratite nas",
    "copyright": "© {year} Camp Holiday. Sva prava pridržana."
  }
}
```

---

## 🧩 Using Translations

### In Server Components

```typescript
// app/[locale]/page.tsx
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// For metadata
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

// In component
export default function HomePage() {
  const t = useTranslations('hero');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button>{t('cta.primary')}</button>
    </div>
  );
}
```

### In Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function BookingForm() {
  const t = useTranslations('booking');
  
  return (
    <form>
      <h2>{t('title')}</h2>
      <label>{t('form.name')}</label>
      {/* ... */}
    </form>
  );
}
```

### With Pluralization

```typescript
const t = useTranslations('booking.dates');

// In en.json: "nights": "{count, plural, =1 {# night} other {# nights}}"
<span>{t('nights', { count: 5 })}</span>
// Output: "5 nights"
```

### With Variables

```typescript
const t = useTranslations('booking.confirmation');

// In en.json: "message": "A confirmation email has been sent to {email}."
<p>{t('message', { email: 'john@example.com' })}</p>
// Output: "A confirmation email has been sent to john@example.com."
```

---

## 🔄 Language Switcher Component

```typescript
// components/layout/language-switcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, localeFlags } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname if present
    const segments = pathname.split('/');
    const pathWithoutLocale = locales.includes(segments[1] as any)
      ? '/' + segments.slice(2).join('/')
      : pathname;
    
    const newPath = newLocale === 'en' 
      ? pathWithoutLocale 
      : `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
  };
  
  return (
    <div className="relative">
      <button className="flex items-center gap-2">
        <span>{localeFlags[locale as keyof typeof localeFlags]}</span>
        <span>{localeNames[locale as keyof typeof localeNames]}</span>
      </button>
      
      <div className="dropdown">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={loc === locale ? 'active' : ''}
          >
            <span>{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 📅 Date & Number Formatting

```typescript
import { useFormatter } from 'next-intl';

export function BookingDates({ checkIn, checkOut, price }) {
  const format = useFormatter();
  
  return (
    <div>
      <p>
        Check-in: {format.dateTime(checkIn, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
      <p>
        Price: {format.number(price, {
          style: 'currency',
          currency: 'EUR'
        })}
      </p>
    </div>
  );
}
```

---

## 📊 Database Multilingual Content

For dynamic content, use separate columns:

```sql
-- zones table has multilingual columns
description TEXT,      -- English (default)
description_hr TEXT,   -- Croatian
description_de TEXT,   -- German
description_it TEXT,   -- Italian
description_fr TEXT,   -- French
```

### Query with locale:

```typescript
// lib/supabase/queries.ts
export async function getZones(locale: string) {
  const descriptionColumn = locale === 'en' 
    ? 'description' 
    : `description_${locale}`;
  
  const { data } = await supabase
    .from('zones')
    .select(`
      id,
      name,
      slug,
      ${descriptionColumn}:description
    `);
  
  return data;
}
```

---

## ✅ Translation Checklist

- [ ] All UI text extracted to JSON files
- [ ] Croatian translations complete
- [ ] German translations complete
- [ ] Italian translations complete
- [ ] French translations complete
- [ ] Pluralization rules tested
- [ ] Date/number formatting verified
- [ ] Language switcher working
- [ ] SEO meta tags translated
- [ ] Email templates translated
- [ ] Error messages translated

---

*Next: [15-GEOJSON-EXTRACTION-GUIDE.md](./15-GEOJSON-EXTRACTION-GUIDE.md) for map data*

