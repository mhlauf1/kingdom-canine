# Milestones

## Overview

The Kingdom Canine website is built in milestones, not features. Each milestone represents a meaningful, deployable chunk of work. The site should be viewable on Vercel after every milestone.

KC is the simplest site in the Embark portfolio. Brian confirmed this. The milestone plan reflects that — fewer milestones, tighter scope.

---

## Milestone 1: Foundation & Cleanup

**Status:** In Progress
**Branch:** `feature/foundation`

### Goals
- Strip all Home Away From Home-specific content, images, and references from the cloned codebase
- Remove HAFH-specific features not needed for KC:
  - Three-theme system — N/A, did not exist in clone (HAFH already had single palette)
  - Theme toggle widget — N/A, did not exist in clone
  - Cat services page and related schemas/components
  - Webcams page and related schemas/components
  - About page (not in scope unless Brian sends content)
- Set up new Sanity project/dataset and connect it
- Establish KC color palette and typography (single theme, no toggle)
- Swap logo to KC logo (pending source file from Brian)
- Update all meta tags, site title, favicon, OG images for KC
- Update `.env` / `.env.example` with KC-specific values
- Verify clean Vercel deployment

### Completed so far
- All HAFH text references replaced with "Kingdom Canine" (16 edits across 12 files)
- HAFH phone number replaced with KC phone (314-631-6738) in pricing calculators
- Webcam system fully removed (3 schema files, 3 components, 1 API route, plus references in BlockRenderer, queries, page/service schemas)
- Cat pricing data removed from `pricingData.ts`
- Root `package.json` name fixed from "hound-3" to "kingdom-canine"
- `frontend/.env.local` created with Sanity env vars
- TypeScript compiles clean; zero HAFH references in source files

### Remaining
- Logo swap (blocked — waiting on Brian)
- Sanity project connection (need new project ID or decision to keep `ldmtl3r7`)
- `SANITY_API_READ_TOKEN` needed for full build
- Vercel deployment setup and verification
- Schema deploy to cloud

### Definition of Done
- Site deploys to Vercel with no HAFH or Hound Around references anywhere
- All pages render without errors (content can be placeholder)
- Unused HAFH features removed (theme system, cats, webcams)
- Single KC design direction applied

---

## Milestone 2: Sanity Schema & Content Seeding

**Status:** Not Started
**Branch:** `content/sanity-seed`

### Goals
- Review Sanity schemas — trim unused types (cat services, webcams)
- Add transportation service schema if needed
- Seed all available content into Sanity:
  - Facility info (name, address, phone, hours)
  - All pricing data from Brian's doc (daycare, boarding, grooming, transportation)
  - Service descriptions (from current site + Brian's doc)
  - Booking info (Gingr portal URLs — stored in settings for easy Goose swap)
- Verify all GROQ queries return correct data

### Definition of Done
- Sanity Studio loads with all seeded content
- All content renders on the site through GROQ queries
- No hardcoded content in components — everything from Sanity
- POS URLs in settings doc (single point of update for Gingr → Goose)

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