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
- Boarding: Standard $64/night, VIP Luxury Cottage Suite $125/night (1-4 dogs), additional dog $55/night
- Grooming: Bath matrix (size × hair length), full groom by size ($89-$129), doodle surcharge +$10, 6 à la carte services ($8-$30), teeth cleaning add-on $10
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

**Status:** Complete (merged to main)
**Branch:** `feature/core-pages`

### Goals
- Homepage: hero with image carousel, service cards (image-overlay variant), about us split with hours, testimonials, stats bar, CTA banner
- Daycare page: hero, pricing calculator, CTA
- Boarding page: hero, pricing calculator (Standard + VIP Luxury Cottage Suite), CTA
- Grooming page: hero, pricing calculator (bath matrix, full groom, à la carte), CTA
- Transportation page: hero, pricing list (single + packages), CTA

### What was done
- Homepage built with all sections rendering from Sanity content
- Hero headline updated to "Where your dog is treated like royalty" per Brian's feedback
- All four service pages built with heroMinimal + pricing + ctaBanner
- Schema changes: hero carouselImages, serviceCards variant, splitContent hours
- Schema deployed to cloud, all content seeded and published
- Brian's May 5 feedback applied: VIP Luxury Suite → VIP Luxury Cottage Suite, $150 → $125/night, Pad Trim → Spot Trim ($15), added Face Feet & Sanitary ($30)
- Removed unconfirmed half-day package totals (only full-day totals from Brian's doc)
- Fixed standard boarding description from "Individual kennel run" to "Cage-free, all-inclusive group boarding"
- Hero carousel marquee slowed to 200s
- All pricing audited and verified against intake doc + Brian's feedback

---

## Milestone 4: Supporting Pages & Homepage CTA

**Status:** Complete (merged to main)
**Branch:** `feature/supporting-pages`

### Goals
- Add "Get Started" ctaStrip to homepage (position 3, between Service Cards and About Us) linking to Gingr registration
- Contact page: contact form, Google Maps embed, hours, phone
- Pricing page: comprehensive pricing overview (pricingPageTabs)
- Gallery page: scaffolded with placeholder state (photos pending from Brian)
- Remove or repurpose New Clients page (registration handled by Gingr portal link)

### What was done
- Homepage ctaStrip added between Service Cards and About Us, linking to Gingr registration
- Contact page with contactForm, Google Maps embed, hours grid, phone link, address
- Pricing page rendering all three calculator tabs (daycare, boarding, grooming) via pricingPageTabs
- Gallery page scaffolded with placeholder state (waiting on photos from Brian)
- New Clients page restored to nav (repurposed as onboarding guide, not removed)
- Phone number added to header nav (desktop + mobile)
- Boarding calculator fix: flat $55 additional dog rate regardless of room type
- ContactForm schema updated with hours array (label/value pairs)
- FeatureCards schema updated with columns prop (3 or 4)
- Build passes clean

---

## Milestone 4.5: Data Integrity & Analytics Fixes

**Status:** Complete (merged to main)
**Branches:** `fix/settings-singleton-remediation`, `feature/gtm-ctm-route-tracking`

### Goals
- Fix `settingsQuery` fetching an arbitrary `settings` document instead of the canonical singleton
- Remove leftover cross-brand (Boxers Bed & Biscuits) alt text fallback strings from a shared Hound Around-origin component
- Add virtual page view tracking for GTM and CallTrackingMetrics (CTM) on client-side route changes
- Load the CallTrackingMetrics tracking script from Sanity settings instead of leaving it unwired

### What was done
- `settingsQuery` now filters on `_id == "siteSettings"` so the frontend always reads the canonical settings document rather than whichever `settings` document Sanity returns first (`fix: enforce canonical settings singleton`)
- `HeroMarquee.tsx` alt-text fallbacks corrected from "Boxers Bed & Biscuits" / "Boxers facility" to "Kingdom Canine" / "Kingdom Canine facility" (`fix: correct cross-brand hero alt text`)
- Added `TrackingRouteEvents.tsx` (client component, mounted in `layout.tsx`): pushes a `virtual_page_view` event to `dataLayer` on every route change and re-triggers CTM's `window.__ctm.main.runNow()` so CTM's call-tracking swap logic re-runs on client-side navigations, not just full page loads
- Added `ctmId` field to the `settings` singleton schema (numeric CTM account ID, e.g. `602201`), wired into `settingsQuery`, and added conditional `<Script>` loading of `https://{ctmId}.tctm.co/t.js` in `layout.tsx` — previously the CTM route-tracking listener existed with nothing loading `window.__ctm` in the first place
- Schema deployed to Sanity cloud; `siteSettings` document patched and published with `ctmId: "602201"`
- Build passes clean; both branches merged to `main`

---

## Launch

**Status:** Complete — the site is live at https://www.kingdomcanine.com/ (Vercel + Cloudflare DNS; HighLevel site retired). It has been in production for months as of July 2026; these docs were updated retroactively in July 2026 to reflect that.

---

## Milestone 5: Post-Launch Polish

**Status:** In Progress
**Branch:** `feature/thank-you-page` (and others as needed)

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

---

## Milestone 5.1: Contact Form Hardening

**Status:** Complete (merged to `main`)
**Branch:** `fix/contact-form-hardening`
**PR:** #6
**Merge commit:** `59c375c`

### What was done

- Preserved required `name`, `email`, and `message`; optional `phone` and `service`; Kingdom's four service choices; facility recipient; IMPACT BCC; `(314) 631-6738` fallback; and `/thank-you`
- Added a strict Zod schema, supported-field allowlist, server-side field limits, JSON-only parsing, and a 32 KiB streaming request limit
- Added a hidden honeypot that returns the ordinary success response without sending email
- Added exact reCAPTCHA action and Production/Preview hostname validation
- Added two bounded 3-second verification attempts, Production secret fail-closed behavior, and visibly flagged delivery only for a genuine Google outage
- Added progressive US phone formatting with paste-safe `+1` handling
- Added ten focused non-delivery tests and the contact-test script

### Verification

- Ten focused tests, focused ESLint, TypeScript, Production build, and `git diff --check` pass
- Repository-wide lint remains blocked by 106 pre-existing errors and 9 warnings outside this patch
- Vercel Preview and Production deployments completed successfully
- Read-only Preview and Production QA confirmed the hardened form contract and correct `/thank-you` behavior
- Production reCAPTCHA is healthy and browser logs are clean
- Preview retains the known external Google-key domain-registration and Sanity CORS dependencies
- No form was submitted and no email was sent
- Live recipient delivery, IMPACT BCC receipt, and successful-submission navigation remain deferred to the coordinated portfolio acceptance window
