# EduConnect — Brand Identity Specification
### *LinkedIn-grade branding. Flat. Professional. No gradients. No dark backgrounds.*

---

## 1. App Name

**EduConnect**
Tagline: *Where Academic Careers Begin*
Sub-tagline: *Academic Social Network*

**Why EduConnect?**
- Clear, professional, internationally readable
- "Edu" signals education instantly (no ambiguity)
- "Connect" signals networking (LinkedIn DNA)
- Two syllables each — easy to say, easy to remember
- Domain-friendly: educonnect.in / educonnect.app

---

## 2. Logo Mark

### Icon Construction
```
Shape:    Rounded rectangle (rx = 22% of width) — NOT a circle
Fill:     #1A56DB (flat, no gradient, no shadow)
Icon:     Mortarboard cap — white, flat, single-color
          - Top diamond (cap top)
          - Tassel (vertical line + circle, right side)
          - Cap body (trapezoid below diamond)
```

### Logo Versions

| Version | Use case |
|---|---|
| Icon + Name (horizontal) | Website header, email header, documents |
| Icon only (square) | App icon, favicon, avatar, badge |
| Reversed (white on blue) | Dark headers, email banners |
| Monochrome (all blue, no fill) | Embossed, print, single-color contexts |

### Clear Space Rule
Minimum clear space = 1× the height of the "E" in EduConnect on all sides.
Never place the logo on a dark, black, or gradient background.

---

## 3. Colour Palette — Flat Only

> ⛔ No gradients. No mesh backgrounds. No dark page backgrounds. No glow effects.

| Name | Hex | Use |
|---|---|---|
| **Brand** | `#1A56DB` | Primary buttons, links, icon bg, active states, nav highlights |
| **Brand Dark** | `#1E429F` | Hover state on Brand, pressed button |
| **Brand Tint** | `#E8F0FE` | Light bg behind brand elements, selected states |
| **Accent (Cyan)** | `#0891B2` | Secondary highlights, badges, tags, skill chips |
| **Accent Tint** | `#CFFAFE` | Accent backgrounds |
| **Job/Alert** | `#D97706` | Job posts, noticeboard banners, alert badges |
| **Job Tint** | `#FEF3C7` | Job card backgrounds |
| **Success** | `#059669` | Applied status, verified, online dot, open to work |
| **Danger** | `#EF4444` | Errors, rejected status, notification badge |
| **Neutral Dark** | `#1E293B` | Body text, headings |
| **Neutral Mid** | `#64748B` | Secondary text, metadata |
| **Neutral Light** | `#CBD5E1` | Borders, dividers |
| **Page Background** | `#F8FAFF` | Main page bg (very light blue-white, NOT pure white) |
| **Card Background** | `#FFFFFF` | Post cards, job cards, modals |

### DaisyUI Theme Config
```js
// tailwind.config.js
daisyui: {
  themes: [{
    educonnect: {
      "primary":   "#1A56DB",
      "primary-focus": "#1E429F",
      "primary-content": "#FFFFFF",
      "secondary": "#0891B2",
      "secondary-content": "#FFFFFF",
      "accent":    "#D97706",
      "accent-content": "#FFFFFF",
      "neutral":   "#1E293B",
      "neutral-content": "#FFFFFF",
      "base-100":  "#F8FAFF",   // page bg
      "base-200":  "#EFF3FF",   // slightly deeper
      "base-300":  "#CBD5E1",   // borders
      "base-content": "#1E293B",
      "info":      "#0891B2",
      "success":   "#059669",
      "warning":   "#D97706",
      "error":     "#EF4444",
    }
  }]
}
```

---

## 4. Typography

| Level | Font | Size | Weight | Use |
|---|---|---|---|---|
| Display | Poppins | 32–40px | 600 | Hero heading, landing page |
| H1 | Poppins | 24px | 600 | Page titles |
| H2 | Inter | 20px | 500 | Section headings |
| H3 | Inter | 16px | 500 | Card titles, modal headings |
| Body | Inter | 15px | 400 | Post text, descriptions |
| Small | Inter | 13px | 400 | Meta, timestamps, captions |
| Label | Inter | 11px | 500 | Badges, tags, all-caps labels |
| Mono | JetBrains Mono | 12px | 400 | Code, API responses |

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?
  family=Inter:wght@400;500;600&
  family=Poppins:wght@600;700&
  family=JetBrains+Mono:wght@400
  &display=swap" rel="stylesheet"/>
```

---

## 5. Icon System

**Library:** Lucide React (outline, consistent 1.5px stroke)

| Context | Icon | Name |
|---|---|---|
| Home / Feed | House | `<Home />` |
| Explore / Search | Search | `<Search />` |
| Create Post | Plus circle | `<PlusCircle />` |
| Jobs | Briefcase | `<Briefcase />` |
| Profile | User circle | `<UserCircle />` |
| Chat | Message circle | `<MessageCircle />` |
| Notifications | Bell | `<Bell />` |
| Like | Heart | `<Heart />` |
| Save | Bookmark | `<Bookmark />` |
| Share | Share 2 | `<Share2 />` |
| Comment | MessageSquare | `<MessageSquare />` |
| Follow | UserPlus | `<UserPlus />` |
| Verified | BadgeCheck | `<BadgeCheck />` |
| Quick Apply | Zap | `<Zap />` |
| Match | Sparkles | `<Sparkles />` |
| Skill Gap | TrendingUp | `<TrendingUp />` |
| Map | MapPin | `<MapPin />` |
| Kanban | Columns | `<Columns />` |
| Story | PlayCircle | `<PlayCircle />` |
| Timeline | GitBranch | `<GitBranch />` |
| Endorsement | ThumbsUp | `<ThumbsUp />` |
| Settings | Settings | `<Settings />` |

---

## 6. App Icon Specification

### Web (Favicon)
```
/public/favicon.ico          → 16×16, 32×32 multi-size ICO
/public/favicon-16x16.png    → 16×16 PNG
/public/favicon-32x32.png    → 32×32 PNG
/public/apple-touch-icon.png → 180×180 PNG (iOS bookmark)
```

### Android PWA (manifest.json)
```json
{
  "name": "EduConnect",
  "short_name": "EduConnect",
  "description": "Academic Social Network for Students and Teachers",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#F8FAFF",
  "theme_color": "#1A56DB",
  "icons": [
    { "src": "/icons/icon-72.png",   "sizes": "72x72",   "type": "image/png" },
    { "src": "/icons/icon-96.png",   "sizes": "96x96",   "type": "image/png" },
    { "src": "/icons/icon-128.png",  "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144.png",  "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152.png",  "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192.png",  "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-384.png",  "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512.png",  "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

> **Maskable icons:** Add 10% safe zone padding (full bleed blue bg) for Android adaptive icons.

### Desktop (Electron / TWA)
```
Icon shape:   Rounded rectangle (NOT circle) with rx ≈ 20%
Sizes needed: 16, 32, 48, 64, 128, 256, 512 (PNG) + .ico for Windows
macOS:        .icns bundle
Linux:        512×512 PNG
```

### Splash Screen
```
Background: #1A56DB (brand blue — flat)
Content:    White mortarboard icon (64px) + "EduConnect" in white Inter 600
            + "Academic Social Network" in white/60% opacity Inter 400 11px
NO black background. NO gradient. Light feel even in splash.
```

---

## 7. Role Badges

```jsx
// Colour-coded role badges (DaisyUI + custom)

Student         → bg: #E8F0FE  text: #1E429F   border: none
Teacher         → bg: #CFFAFE  text: #155E75   border: none
Professor       → bg: #CFFAFE  text: #155E75   border: none
HOD             → bg: #CFFAFE  text: #155E75   border: none
Principal       → bg: #1A56DB  text: white      border: none
Email Verified  → bg: #D1FAE5  text: #065F46   icon: ✅
Institution ✓   → bg: #1A56DB  text: white      icon: 🏫
Top Contributor → bg: #EDE9FE  text: #4C1D95   icon: ⭐
Paid Role       → bg: #FEF3C7  text: #92400E   border: none
Unpaid/Vol.     → bg: #D1FAE5  text: #065F46   border: none
Open to Work    → bg: #D1FAE5  text: #065F46   dot: green pulsing
```

---

## 8. What NOT to Do (Brand Rules)

| ❌ Don't | ✅ Do instead |
|---|---|
| Use gradients on icon or buttons | Flat #1A56DB fill only |
| Use black or dark page background | Use #F8FAFF (light) |
| Use circle shape for app icon | Use rounded rect (rx ≈ 22%) |
| Place logo on coloured/image backgrounds | White or #F8FAFF surfaces only |
| Use more than 2 brand colours in one UI section | Primary blue + one accent max |
| Stretch or rotate the logo | Use as-is only |
| Use emoji in the logo | Icon SVG only |
| Multi-colour icon (blue cap + cyan tassel etc.) | White icon on blue bg only |

---

## 9. UI Surface Rules

```
Page background:    #F8FAFF  (NOT white, NOT dark)
Card background:    #FFFFFF  with 0.5px border #CBD5E1
Sidebar background: #FFFFFF  with right border #CBD5E1
Modal overlay:      rgba(15,23,42,0.5) backdrop
Bottom tab bar:     #FFFFFF  with top border #CBD5E1, active = #1A56DB
Top navbar:         #FFFFFF  with bottom border #CBD5E1
Inputs:             #FFFFFF  with 0.5px border, focus = 2px ring #1A56DB
Buttons (primary):  bg #1A56DB, text white, hover #1E429F
Buttons (ghost):    bg transparent, border #CBD5E1, hover bg #EFF3FF
```

---

## 10. Social / OG Meta Tags

```html
<meta property="og:title" content="EduConnect — Academic Social Network"/>
<meta property="og:description" content="Connect students with teachers and institutions. Find academic roles, post jobs, and build your academic network."/>
<meta property="og:image" content="https://yourdomain.com/og-image.png"/>
<!-- OG Image: 1200×630px, blue #1A56DB solid bg, white logo centred -->
<meta name="theme-color" content="#1A56DB"/>
<meta name="apple-mobile-web-app-title" content="EduConnect"/>
<meta name="application-name" content="EduConnect"/>
```

---

*EduConnect Brand Specification v1.0*
*Flat · Professional · LinkedIn-grade · No gradients · No dark backgrounds*