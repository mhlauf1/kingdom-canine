# Milestones

## Overview

The Kingdom Canine website is built in milestones, not features. Each milestone represents a meaningful, deployable chunk of work. The site should be viewable on Vercel after every milestone.

KC is the simplest site in the Embark portfolio. Brian confirmed this. The milestone plan reflects that — fewer milestones, tighter scope.

---

## Milestone 1: Foundation & Cleanup

**Status:** Complete (merged to main)
**Branch:** `feature/foundation`

### Goals
- Strip all Home Away From Home-specific content, images, and references from the cloned codebase
- Remove HAFH-specific features not needed for KC (cat services, webcams)
- Connect Sanity project and set up environment
- Update all meta tags, site title for KC

### What was done
- All HAFH text references replaced with "Kingdom Canine" (16 edits across 12 files)
- HAFH phone number replaced with KC phone (314-631-6738) in pricing calculators
- Webcam system fully removed (3 schema files, 3 components, 1 API route, plus references in BlockRenderer, queries, page/service schemas)
- Cat pricing data removed from `pricingData.ts`
- Root `package.json` name fixed from "hound-3" to "kingdom-canine"
- `frontend/.env.local` created with Sanity env vars and read token
- Contact form email sender and footer updated
- TypeScript compiles clean; zero HAFH references in source files

### Still blocked
- Logo swap (waiting on source file from Brian)
- Vercel deployment (deferred — not deploying until further along)

---

## Milestone 2: Sanity Schema & Content Seeding

**Status:** Complete (on branch `content/sanity-seed`, ready to merge)
**Branch:** `content/sanity-seed`

### Goals
- Rewrite all pricing data with correct KC values from Brian's doc
- Update calculator components for KC's service structure
- Add POS URL fields to settings schema for Gingr → Goose swap
- Seed all Sanity content
- Deploy schema to cloud
- Establish KC color palette

### What was done

#### Pricing data (`pricingData.ts` — complete rewrite)
- Daycare: $36 full / $24 half, 10/20/30-day packages ($325/$615/$865), removed 5-day package
- Boarding: Standard $64/night, VIP Luxury Suite $150/night (flat rate 1-4 dogs), additional dog $55/night
- Grooming: Bath matrix (size × hair length), full groom by size ($89-$129), doodle surcharge +$10, 5 à la carte services ($8-$18), teeth cleaning add-on $10
- All calculation functions updated with suite rate logic, marketed totals, and à la carte support

#### Calculator components
- BoardingCalculator: VIP suite auto-removes extra dogs, hides add-dog button, shows suite note, fixed "$29/night" hardcoded bug
- GroomingCalculator: hair length pill selector for bath, isDoodle toggle per dog, à la carte CheckboxGroup, teeth cleaning checkbox
- DaycareCalculator: minimal changes (type narrowing auto-propagated from data)

#### Settings schema
- Added `posUrls` object field (portalUrl, registrationUrl, per-service booking URLs)
- Updated settingsQuery to include posUrls

#### Sanity content (9 documents seeded and published)
- Settings: full facility info, nav with page/service references, footer, contact, POS URLs (Gingr), local business structured data with hours and geo
- 4 services: Daycare, Boarding, Grooming, Transportation (each with hero + pricing + CTA)
- 4 pages: Homepage (hero + serviceTabs + statsBar + CTA), Pricing (pricingPageTabs with 3 service tabs + full matrix data), Contact (form), New Clients (3-step process)

#### Infrastructure
- Schema deployed to Sanity cloud
- `studio/.env` created with correct project ID
- Build passes clean

#### Color palette
- Replaced HAFH teal/red palette with KC royal purple + gold
- Primary dark: `#3D1952` (deep purple), Accent: `#7B2D8E` (purple), Gold: `#D4A843`
- All 18 CSS custom properties updated in `globals.css` — zero component changes needed

---

## Milestone 3: Core Pages — Homepage & Services

**Status:** Not Started
**Branch:** `feature/core-pages`

### Goals
- Homepage: hero, services overview, stats counter, CTA
- Daycare page: hero, features, pricing (single visits + packages), CTA
- Boarding page: hero, "Pack Mentality" narrative, pricing (Standard + VIP Luxury Suite), CTA
- Grooming page: hero, pricing matrix (bath × size × hair length, full groom, à la carte), CTA
- Transportation page: hero, description, pricing (single + packages), CTA
- All pages responsive across desktop, tablet, mobile

### Key design moments
- **VIP Luxury Suite** needs its own visual treatment on the boarding page — premium tier, not just another row
- **Grooming pricing matrix** replaces the old narrative packages with transparent pricing
- **Transportation** is unique to KC — simple page but needs to feel like part of the system

### Definition of Done
- All five pages fully built and populated with Sanity content
- Pricing displays are accurate against Brian's doc
- Mobile responsive
- No placeholder content in service pages

---

## Milestone 4: Supporting Pages & New Client Flow

**Status:** Not Started
**Branch:** `feature/supporting-pages`

### Goals
- Pricing page: comprehensive pricing overview for all services (daycare, boarding, grooming, transportation)
- Contact page: contact form, map embed, hours, POS booking link
- New Clients page: custom Get Started form/flow (replaces HighLevel 3-step funnel)
- Gallery page: photo grid (scaffolded — photos pending from Brian)

### Definition of Done
- All supporting pages built
- Contact form functional
- New client flow designed and built
- Gallery scaffolded with placeholder state
- Testimonials section ready (scaffolded — content pending)

---

## Milestone 5: Polish & Launch Prep

**Status:** Not Started
**Branch:** `feature/polish`

### Goals
- SEO optimization (meta tags, structured data, sitemap.xml, robots.txt)
- Performance audit (Lighthouse 90+ all categories)
- Accessibility audit (WCAG AA compliance)
- Cross-browser testing
- Custom 404 page
- Final content review — audit all pricing against Brian's doc
- Populate any content received from Brian (photos, testimonials, FAQs)
- DNS cutover plan:
  - Update A record + www CNAME in Cloudflare to point to Vercel
  - Remove Mailgun SPF include
  - Preserve Facebook domain verification + MS verification TXT records
- 24-hour notice to Brian for POS price update coordination

### Definition of Done
- Lighthouse 90+ across all categories
- All content approved
- DNS cutover plan documented
- Brian notified 24 hours before go-live
- POS prices match site prices exactly on launch day
