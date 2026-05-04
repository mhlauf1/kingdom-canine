# Current Milestone

## Milestone 1: Foundation & Cleanup

### Status
In Progress (on branch `feature/foundation`)

### Goals
Strip all Home Away From Home content and references from the cloned codebase. Remove unused HAFH features. Set up KC-specific Sanity project, design direction, and deployment.

### Checklist

#### Remove HAFH-specific content
- [x] Search all files for "Home Away", "HAFH", "Fargo", "Hound Around", "Cottage Grove", "hafhfacility" — replace or remove
- [ ] Remove HAFH logo assets — blocked, waiting on KC logo from Brian
- [ ] Remove HAFH-specific images from Sanity media library and `/public` — deferred, images are generic/reusable
- [ ] Clear any seeded Sanity content from the HAFH build — deferred until new Sanity project connected

#### Remove unused features
- [x] Remove three-theme CSS custom property system — N/A, did not exist in cloned codebase (HAFH already had a single palette)
- [x] Remove ThemeToggle widget component — N/A, did not exist in cloned codebase
- [x] Remove `?theme=` URL param and localStorage logic — N/A, did not exist in cloned codebase
- [x] Remove cat services page (`/services/cats`) and related components — removed `catPricing` from `pricingData.ts` (no dedicated cat page/components existed; pages are CMS-driven)
- [x] Remove webcams page (`/webcams`) and related components — deleted `WebcamGrid.tsx`, `WebcamEmbed.tsx`, `WebcamPreview.tsx`, `webcam-auth/route.ts`; cleaned `BlockRenderer.tsx` and `queries.ts`
- [x] Remove webcam schema types (`webcam`, `webcamGrid`, `webcamPreview`) — deleted 3 schema files; cleaned `index.ts`, `page.ts`, `service.ts`
- [x] Remove about page — N/A, no static about page existed (pages are CMS-driven via dynamic `[slug]` route)
- [x] Clean up any unused schema object types after removals — done (webcam types removed from page builder arrays)

#### Set up KC identity
- [x] Establish single color palette for KC — using inherited palette (cream/forest/terracotta) as placeholder; will refine in M3
- [x] Set typography — using inherited fonts (Bricolage Grotesque + Geist) as placeholder; will refine in M3
- [ ] Swap logo — blocked, waiting on source file from Brian; TextLogo fallback updated to "Kingdom / Canine"
- [x] Update site title, meta tags, favicon, OG image placeholders — site title updated to "Kingdom Canine" across all configs and fallbacks; robots.ts sitemap URL updated to kingdomcanine.com

#### Infrastructure
- [ ] Connect new Sanity project (update `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`) — currently using `ldmtl3r7` from HAFH; need new project ID or confirmation to keep this one
- [ ] Deploy Sanity schema to cloud — blocked until Sanity project confirmed
- [ ] Verify Vercel deployment is clean — blocked until Vercel project set up
- [ ] Add Vercel preview URL to Sanity CORS origins — blocked until Vercel project set up
- [ ] Add `SANITY_API_READ_TOKEN` to `frontend/.env.local` — needed for full build; pre-existing gap from clone

#### Additional completed items (not in original checklist)
- [x] Replaced HAFH phone number (701-532-1618) with KC phone (314-631-6738) in pricing calculators
- [x] Fixed root `package.json` name from "hound-3" to "kingdom-canine"
- [x] Created `frontend/.env.local` with Sanity project ID and dataset (was missing)
- [x] Contact form email sender and footer updated from HAFH to Kingdom Canine

### Definition of Done
- Site deploys with no HAFH or Hound Around references anywhere
- All pages render without errors (content can be placeholder)
- Theme system removed — single KC design direction in place
- Cat services, webcams, and about page removed
- Sanity connected and schema deployed

### What's left to complete M1
- Logo swap (blocked on Brian)
- Sanity project connection (need project ID or decision to keep current)
- `SANITY_API_READ_TOKEN` for full build
- Vercel deployment verification
- Schema deploy to cloud

### Notes
- Don't touch pricing data or content seeding yet — that's Milestone 2
- Focus is purely on making this codebase "Kingdom Canine" instead of "Home Away From Home"
- Design direction (colors, fonts) can be minimal/placeholder for now — refine in Milestone 3
- The three-theme system, ThemeToggle, and `?theme=` URL param never existed in this cloned codebase — HAFH had already simplified to a single palette before we cloned