# Current Milestone

## Milestone 2: Sanity Schema & Content Seeding

### Status
Complete (on branch `content/sanity-seed`, ready to merge)

### Goals
Rewrite all pricing data with correct KC values from Brian's doc. Update calculator components for KC's service structure (VIP suite, grooming matrix, à la carte). Add POS URL fields to settings schema. Seed Sanity with KC content. Deploy schema. Establish KC color palette.

### Checklist

#### Pricing data rewrite (`pricingData.ts`)
- [x] Daycare: replaced HAFH rates with KC values ($36/$24), removed 5-day package, added 10/20/30-day packages with correct totals ($325/$615/$865)
- [x] Boarding: replaced 4 room types with 2 (Standard $64, VIP $150 suite), updated additional dog rate to $55, added suite rate logic
- [x] Grooming: added hair length dimension for bath (size × short/long), added à la carte items (5 services), added doodle surcharge (+$10), renamed services (bath/fullGroom), added teeth cleaning add-on

#### Calculator component updates
- [x] DaycareCalculator: type narrowing from 5-day package removal (auto-propagated)
- [x] BoardingCalculator: VIP suite logic (flat rate, hides add-dog, auto-removes extra dogs on switch), fixed hardcoded "$29/night" bug to use dynamic rate
- [x] GroomingCalculator: hair length pill selector for bath, à la carte CheckboxGroup, doodle toggle per dog, teeth cleaning checkbox for full groom

#### Settings schema
- [x] Added `posUrls` object field to settings singleton (portalUrl, registrationUrl, per-service booking URLs)
- [x] Updated settingsQuery in queries.ts to include posUrls

#### Sanity content seeding
- [x] Settings: facility info, contact, hours, POS URLs (Gingr), nav with page/service references, footer columns, local business structured data
- [x] Service: Daycare (heroMinimal + pricingCalculator + ctaBanner)
- [x] Service: Boarding (heroMinimal + pricingCalculator + ctaBanner)
- [x] Service: Grooming (heroMinimal + pricingCalculator + ctaBanner)
- [x] Service: Transportation (heroMinimal + pricingList with 3 items + ctaBanner)
- [x] Page: Homepage (hero + serviceTabs + statsBar + ctaBanner)
- [x] Page: Pricing (pricingPageTabs with daycare/boarding/grooming tabs, full matrix data)
- [x] Page: Contact (heroMinimal + contactForm)
- [x] Page: New Clients (heroMinimal + processSteps with 3-step flow)

#### Infrastructure
- [x] Deploy schema to Sanity cloud (via `npx sanity schema deploy` from studio/)
- [x] Created `studio/.env` with correct project ID and dataset
- [x] Verify build passes — clean
- [x] Verify GROQ queries return correct data — 9 documents live

#### Color palette
- [x] Replaced HAFH teal/red palette with KC royal purple + gold palette in `globals.css`
- [x] All 18 CSS custom properties updated — zero component changes needed

### Definition of Done
- [x] All pricing values match Brian's doc exactly
- [x] Calculator components work correctly for all services
- [x] POS URLs stored in Sanity settings (single-point swap for Gingr → Goose)
- [x] All content renders on the site through GROQ queries
- [x] Build passes clean
- [x] KC brand colors applied

### Notes
- Half-day package rates derived proportionally (24/36 = 2/3 ratio) since Brian only specified full-day package prices
- VIP Luxury Suite is a flat $150/night for 1-4 dogs (suite rate, not per-dog)
- Transportation uses static pricingList block, no calculator needed
- À la carte grooming services use existing CheckboxGroup component
- Settings singleton ID is auto-generated (not "siteSettings") — queried by `_type == "settings"` which works fine
- Logo swap still blocked on Brian providing source file
