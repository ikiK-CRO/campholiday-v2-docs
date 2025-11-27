# Camp Holiday - Design & Style Guide

## 1. Design Philosophy

### 1.1 Brand Identity

Camp Holiday represents a unique blend of:
- **Mediterranean coastal charm** - Clear blue waters, pine forests, stone paths
- **Nature connection** - "In touch with nature" tagline
- **Modern luxury** (Glamping) - "...create memories"
- **Family-friendly atmosphere** - Welcoming, warm, relaxed

### 1.2 Design Principles

1. **Clean & Spacious** - Generous whitespace, uncluttered layouts
2. **Visual-First** - High-quality imagery takes center stage
3. **Easy Navigation** - Clear hierarchy, intuitive paths
4. **Mobile Excellence** - Touch-friendly, fast-loading
5. **Accessibility** - WCAG 2.1 AA compliant

---

## 2. Color Palette

### 2.1 Primary Colors (From Logo)

```css
:root {
  /* Camp Holiday Brand Colors */
  --ocean-teal: #4BBFBC;      /* Primary - Ocean/Wave */
  --forest-green: #9BC53D;    /* Secondary - Nature/Trees */
  
  /* Extended Ocean Blues */
  --deep-sea: #1E6B8A;        /* Dark accent */
  --azure: #0EA5E9;           /* Bright accent */
  --sky-light: #E0F2FE;       /* Light background */
  
  /* Extended Greens */
  --pine: #2D5A27;            /* Dark green */
  --meadow: #84CC16;          /* Bright green */
  --sage: #E8F5E9;            /* Light green bg */
  
  /* Warm Accents */
  --sunset: #F97316;          /* Orange - CTA, Glamping */
  --sand: #FEF3C7;            /* Sandy beach tones */
  --coral: #FB7185;           /* Soft warm accent */
}
```

### 2.2 Neutral Palette

```css
:root {
  /* Neutrals */
  --white: #FFFFFF;
  --stone-50: #FAFAF9;
  --stone-100: #F5F5F4;
  --stone-200: #E7E5E4;
  --stone-300: #D6D3D1;
  --stone-400: #A8A29E;
  --stone-500: #78716C;
  --stone-600: #57534E;
  --stone-700: #44403C;
  --stone-800: #292524;
  --stone-900: #1C1917;
  --black: #0A0A0A;
}
```

### 2.3 Zone Colors (For Map)

```css
:root {
  /* Zone A - Tent (Coastal) */
  --zone-a: #5B9BD5;
  --zone-a-hover: #4A89C4;
  
  /* Zone B - Tent (Central Pine) */
  --zone-b: #70AD47;
  --zone-b-hover: #5F9C36;
  
  /* Zone C - Tent (Upper) */
  --zone-c: #7B7DB5;
  --zone-c-hover: #6A6CA4;
  
  /* Glamping */
  --glamping: #ED7D31;
  --glamping-hover: #DC6C20;
  
  /* Camper P1 */
  --camper-p1: #9DC3E6;
  --camper-p1-hover: #8CB2D5;
  
  /* Camper P2 */
  --camper-p2: #B4A7D6;
  --camper-p2-hover: #A396C5;
  
  /* Parking */
  --parking: #A5A5A5;
}
```

### 2.4 Semantic Colors

```css
:root {
  /* Status */
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Availability */
  --available: #22C55E;
  --booked: #EF4444;
  --blocked: #9CA3AF;
  --partial: #F59E0B;  /* Same-day afternoon available */
}
```

---

## 3. Typography

### 3.1 Font Families

```css
:root {
  /* Display/Headings - Elegant, coastal feel */
  --font-display: 'Playfair Display', 'Georgia', serif;
  
  /* Body Text - Clean, readable */
  --font-body: 'DM Sans', 'Helvetica Neue', sans-serif;
  
  /* Mono - For prices, codes */
  --font-mono: 'JetBrains Mono', 'Consolas', monospace;
}
```

### 3.2 Font Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 3.3 Type Scale

```css
:root {
  /* Display sizes */
  --text-display-xl: clamp(3rem, 8vw, 5rem);      /* Hero headlines */
  --text-display-lg: clamp(2.5rem, 6vw, 4rem);    /* Section headlines */
  --text-display-md: clamp(2rem, 4vw, 3rem);      /* Page titles */
  
  /* Heading sizes */
  --text-h1: clamp(1.75rem, 3vw, 2.25rem);
  --text-h2: clamp(1.5rem, 2.5vw, 1.875rem);
  --text-h3: clamp(1.25rem, 2vw, 1.5rem);
  --text-h4: clamp(1.125rem, 1.5vw, 1.25rem);
  
  /* Body sizes */
  --text-lg: 1.125rem;
  --text-base: 1rem;
  --text-sm: 0.875rem;
  --text-xs: 0.75rem;
  
  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### 3.4 Typography Utilities

```css
/* Headings */
h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 500;
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

/* Display text for hero sections */
.display-text {
  font-family: var(--font-display);
  font-weight: 400;
  font-style: italic;
  line-height: var(--leading-tight);
}

/* Body text */
body {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: var(--leading-relaxed);
}

/* Price display */
.price {
  font-family: var(--font-mono);
  font-weight: 500;
}
```

---

## 4. Spacing System

```css
:root {
  /* Base unit: 4px */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
  
  /* Section spacing */
  --section-sm: var(--space-16);
  --section-md: var(--space-24);
  --section-lg: var(--space-32);
  
  /* Container */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

---

## 5. Component Styles

### 5.1 Buttons

```css
/* Base button */
.btn {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-sm);
  padding: var(--space-3) var(--space-6);
  border-radius: 9999px;  /* Pill shape */
  transition: all 150ms ease;
  cursor: pointer;
}

/* Primary */
.btn-primary {
  background: var(--ocean-teal);
  color: white;
}
.btn-primary:hover {
  background: var(--deep-sea);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(75, 191, 188, 0.3);
}

/* Secondary */
.btn-secondary {
  background: white;
  color: var(--stone-800);
  border: 2px solid var(--stone-200);
}
.btn-secondary:hover {
  border-color: var(--ocean-teal);
  color: var(--ocean-teal);
}

/* Glamping/CTA */
.btn-glamping {
  background: var(--sunset);
  color: white;
}
.btn-glamping:hover {
  background: #EA580C;
}

/* Large variant */
.btn-lg {
  font-size: var(--text-base);
  padding: var(--space-4) var(--space-8);
}
```

### 5.2 Cards

```css
.card {
  background: white;
  border-radius: var(--space-4);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 200ms ease;
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card-image {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
}

.card-content {
  padding: var(--space-6);
}
```

### 5.3 Form Inputs

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  border: 2px solid var(--stone-200);
  border-radius: var(--space-2);
  transition: all 150ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--ocean-teal);
  box-shadow: 0 0 0 3px rgba(75, 191, 188, 0.2);
}

.input-error {
  border-color: var(--error);
}

.label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--space-2);
  color: var(--stone-700);
}
```

---

## 6. Layout Patterns

### 6.1 Hero Section

```jsx
<section className="relative h-screen min-h-[600px]">
  {/* Background Image */}
  <Image 
    src="/images/hero/main.webp"
    alt="Camp Holiday aerial view"
    fill
    className="object-cover"
    priority
  />
  
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
  
  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
    <h1 className="font-display text-display-xl mb-4">
      Camp Holiday
    </h1>
    <p className="text-xl md:text-2xl mb-8 max-w-2xl">
      In touch with nature on the beautiful island of Hvar
    </p>
    <div className="flex gap-4">
      <Button variant="primary" size="lg">Book Now</Button>
      <Button variant="secondary" size="lg">Explore</Button>
    </div>
  </div>
</section>
```

### 6.2 Section Layout

```jsx
<section className="py-section-md bg-stone-50">
  <div className="container mx-auto px-4">
    <div className="text-center max-w-2xl mx-auto mb-12">
      <h2 className="text-h1 mb-4">Accommodations</h2>
      <p className="text-lg text-stone-600">
        Choose your perfect spot in paradise
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Cards */}
    </div>
  </div>
</section>
```

### 6.3 Navigation

```jsx
<header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
  <div className="container mx-auto px-4">
    <nav className="flex items-center justify-between h-16 md:h-20">
      {/* Logo */}
      <Link href="/">
        <Image src="/logos/camp-holiday.svg" alt="Camp Holiday" height={40} />
      </Link>
      
      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-8">
        <li><NavLink href="/">Home</NavLink></li>
        <li><NavLink href="/camping">Camping</NavLink></li>
        <li><NavLink href="/glamping">Glamping</NavLink></li>
        <li><NavLink href="/map">Map</NavLink></li>
        <li><NavLink href="/about">About</NavLink></li>
        <li><NavLink href="/contact">Contact</NavLink></li>
      </ul>
      
      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Button href="/booking">Book Now</Button>
        <MobileMenuToggle className="md:hidden" />
      </div>
    </nav>
  </div>
</header>
```

---

## 7. Animation Guidelines

### 7.1 Transitions

```css
/* Default transition */
.transition-default {
  transition: all 150ms ease;
}

/* Smooth for larger movements */
.transition-smooth {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Spring for interactive elements */
.transition-spring {
  transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 7.2 Page Load Animations

```jsx
// Using Framer Motion
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
};

// Staggered children
const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};
```

### 7.3 Scroll Reveal

```jsx
const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

// Usage with Intersection Observer
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={revealVariants}
>
  <Card />
</motion.div>
```

---

## 8. Responsive Breakpoints

```css
/* Tailwind default breakpoints */
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

### 8.1 Mobile-First Approach

```jsx
// Example: Grid columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

### 8.2 Mobile Navigation Pattern

- Hamburger menu icon
- Full-screen overlay menu
- Large touch targets (44px minimum)
- Language selector accessible

---

## 9. Image Guidelines

### 9.1 Image Sizes

| Usage | Dimensions | Format |
|-------|------------|--------|
| Hero | 1920x1080 | WebP |
| Card thumbnail | 800x500 | WebP |
| Gallery | 1200x800 | WebP |
| Logo | SVG | SVG |
| Icons | 24x24, 32x32 | SVG |

### 9.2 Image Optimization

```jsx
// Next.js Image component
<Image
  src="/images/hero.webp"
  alt="Descriptive alt text"
  width={1920}
  height={1080}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={blurDataUrl}
  className="object-cover"
/>
```

### 9.3 Placeholder Strategy

For missing images, use:
- Unsplash placeholder images (camping, beach, nature)
- Solid color backgrounds with icons
- Gradient overlays

---

## 10. Accessibility Checklist

- [ ] Color contrast ratio ≥ 4.5:1 (text)
- [ ] Color contrast ratio ≥ 3:1 (large text, UI elements)
- [ ] Focus states visible on all interactive elements
- [ ] Alt text for all images
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Skip link to main content
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Screen reader testing
- [ ] Reduced motion support

```css
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Dark Mode (Optional/Future)

Prepared variables for future dark mode:

```css
.dark {
  --bg-primary: var(--stone-900);
  --bg-secondary: var(--stone-800);
  --text-primary: var(--stone-100);
  --text-secondary: var(--stone-400);
  --border: var(--stone-700);
}
```


