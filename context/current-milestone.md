# Current Milestone

## Milestone 4: Supporting Pages & Homepage CTA

### Status
Not started

### Goals
- Add "Get Started" `ctaStrip` to homepage (position 3, between Service Cards and About Us split) linking to Gingr registration URL
- Contact page: contact form, Google Maps embed, hours, phone
- Pricing page: comprehensive pricing overview (pricingPageTabs already seeded in Sanity)
- Gallery page: scaffolded with placeholder state (photos pending from Brian)
- Remove or repurpose New Clients page (no custom form needed — registration handled by Gingr portal)

### Homepage ctaStrip
- Position: between Service Cards and About Us split (block 3)
- CTA links to: https://kingdomcanine.portal.gingrapp.com/#/public/new_customer
- Component already exists and is wired into page builder — just needs a Sanity block added to the homepage

### Contact page
- Contact form (already has `contactForm` block type)
- Google Maps embed showing 2549 Hogan Rd, Pacific, MO 63069
- Hours of operation
- Phone number: (314) 631-6738

### Pricing page
- Already has `pricingPageTabs` block seeded in Sanity
- Verify it renders correctly with all three calculator tabs (daycare, boarding, grooming)

### Gallery page
- Scaffold with placeholder state
- Photos pending from Brian

### Definition of Done
- [ ] Homepage ctaStrip added and linking to Gingr registration
- [ ] Contact page with form, Google Maps, hours, phone
- [ ] Pricing page rendering all three calculator tabs
- [ ] Gallery page scaffolded
- [ ] New Clients page removed from nav (or repurposed)
- [ ] Mobile responsive
- [ ] `npm run build` passes clean
