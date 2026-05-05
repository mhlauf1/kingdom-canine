# Current Milestone

## Milestone 3: Core Pages — Homepage & Services

### Status
In progress (branch `feature/core-pages`)

### Goals
Build the homepage and four service detail pages (Daycare, Boarding, Grooming, Transportation) using the established Embark component patterns. The homepage mirrors the HAFH structure that we want to standardize across the network.

### Homepage structure (in build order)
1. **Hero with image carousel** — eyebrow, headline, subtext, dual CTAs, star rating row, horizontal facility-photo carousel beneath
2. **Service cards (image-overlay variant)** — 4 cards, each with bg image, numbered badge (1–4), name + description overlaid at bottom, "Learn more" CTA
3. **About Us split** — left: heading + body + structured Hours block; right: facility photo
4. **Testimonial carousel** — 3 placeholder reviews to start (Brian's real reviews swap in later)
5. **CTA banner** — centered bg image, "Ready to give your dog a kingdom of their own?", Book a Visit CTA, star rating

### Schema changes for homepage
- `hero`: add optional `carouselImages: image[]`
- `serviceCards`: add optional `variant: 'white' | 'imageOverlay'` (default `white` keeps other Embark sites visually unchanged)
- `splitContent`: add optional `hours: { label: string, value: string }[]`

### Service pages (next sub-chunk)
After homepage approved, build Daycare, Boarding (with VIP Luxury Suite as a real visual moment), Grooming (transparent pricing matrix), Transportation (single + packages).

### Definition of Done
- [ ] Homepage all 5 sections rendering with Sanity content
- [ ] Schema redeployed to cloud
- [ ] 3 placeholder testimonials seeded
- [ ] All four service pages built and populated
- [ ] Mobile responsive (375 / 768 / 1280)
- [ ] `npm run build` passes clean
- [ ] No HAFH/Hound Around references in any output

### Notes
- User uploads hero carousel images, About Us photo, and CTA banner background image to Sanity after schema lands
- Service detail pages already have `heroMinimal + pricingCalculator + ctaBanner` from M2 seed; M3 expands them with feature grids and any service-specific moments (VIP suite, grooming matrix, etc.)
