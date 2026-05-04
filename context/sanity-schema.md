# Sanity Schema Reference

> **This file is a living document.** Update it whenever the Sanity schema changes so Claude Code always has an accurate picture of the content model.

## Status

Schema cleaned up from Home Away From Home clone. Webcam types (`webcam`, `webcamGrid`, `webcamPreview`) removed in Milestone 1. Cat pricing removed from `pricingData.ts`. Transportation service may need minor schema additions in Milestone 2.

## Sanity Project Details

- **Project ID:** `ldmtl3r7` ← update with actual ID from `.env.local`
- **Dataset:** `production`
- **Studio URL:** `http://localhost:3333` (dev) / embedded at `/studio` in frontend
- **API version:** `2025-09-25`

## Architecture

This is a **page builder** architecture. Pages and services have a `pageBuilder` array field that accepts 40+ block types. There are no standalone `pricingTier` or `faq` documents — pricing, FAQs, team members, and feature cards are all inline arrays within pageBuilder blocks.

The only standalone reference document is `testimonial`.

## Document Types

### `settings` (singleton)
Global site config: title, tagline, logo, nav items, CTA button, footer columns, contact info, social links, business hours, SEO (OG image, favicon, GA4, GTM, GSC), local business structured data.

**KC-specific:** POS portal URLs stored here (Gingr now, Goose later) for single-point swap.

### `page`
Generic pages (homepage, pricing, gallery, new-clients, contact). Fields: name, slug, seo, pageBuilder (42 block types — webcam types removed).

**KC pages (vs. HAFH):** No about page, no webcams page.

### `service`
Service detail pages (daycare, boarding, grooming, transportation). Fields: title, slug, sticker, shortDescription, tabImage, tabCta, heading, seo, pageBuilder (35 block types — webcam types removed).

**KC services (vs. HAFH):** No cat services. Transportation is new (not in HAFH).

### `testimonial`
Customer reviews. Fields: quote, authorName, authorLabel, rating (1-5, default 5).

## Key Object Types (PageBuilder Blocks)

- `hero` / `heroSplit` / `heroBanner` / `heroMinimal` — Hero sections
- `featureCards` / `featureGrid` / `featureList` — Feature displays
- `pricingTable` / `pricingList` / `pricingMatrix` / `pricingCalculator` / `pricingPageTabs` — Pricing
- `faqAccordion` — Inline Q&A (not standalone documents)
- `testimonials` — References `testimonial` documents
- `teamGrid` — Inline team members (name, role, bio, certifications, image)
- `serviceTabs` / `serviceCards` — Service displays (reference `service` documents)
- `contactForm` — Dynamic form builder
- `galleryGrid` / `galleryCarousel` / `galleryShowcase` / `galleryPage` — Gallery
- `processSteps` / `whatsIncluded` / `requirementsList` — Lists/timelines
- `splitContent` / `contentColumns` — Content layouts
- `callToAction` / `ctaBanner` / `ctaStrip` — CTAs
- `statsBar` — Stats counter
- `iconGrid` / `valuePillars` / `logoBar` — Misc

## Reusable Object Types

- `link` — Flexible link (internal page/service reference or external URL)
- `button` — Button with text + link
- `blockContent` — Rich text (Portable Text)
- `blockContentTextOnly` — Text-only rich text
- `seo` — Per-page SEO overrides (metaTitle, metaDescription, ogImage, noIndex)

## GROQ Query Patterns

All queries live in `frontend/sanity/lib/queries.ts`.

```groq
// Homepage
*[_type == 'page' && slug.current == 'homepage'][0]{ ... }

// Page by slug
*[_type == 'page' && slug.current == $slug][0]{ ... }

// Service by slug
*[_type == 'service' && slug.current == $slug][0]{ ... }

// Settings (singleton)
*[_type == 'settings'][0]{ ... }

// Services for nav
*[_type == 'service']{ title, "slug": slug.current }
```

## Pricing Calculator

The pricing calculator (`pricingCalculator` block type) has a `calculatorType` field (`daycare` | `boarding` | `grooming`) and supports `single` or `tabbed` display mode. **Actual pricing data is hardcoded in `frontend/app/data/pricingData.ts`**, not in Sanity. The Sanity block only configures which calculator to show and the CTA link.

**KC note:** `pricingData.ts` must be completely rewritten with KC pricing. Do not leave any HAFH values.

## KC-Specific Schema Considerations

- **Transportation service** — may need a simple pricing display block if `pricingTable` doesn't fit the single-trip + package structure well. Evaluate during Milestone 2.
- **VIP Luxury Suite** — the boarding pricing display needs to accommodate a premium tier that feels visually distinct from standard boarding. Could be a `pricingMatrix` with styled rows, or a custom block.
- **Grooming matrix** — bath × size × hair length is a 2D matrix. `pricingMatrix` block should handle this. Verify during Milestone 2.

## Notes

- Keep schemas structurally aligned with other Embark sites for future template extraction
- Don't add fields you don't need yet — only add what the current content requires
- Schema deployed to cloud via `npx sanity@latest schema deploy` from `studio/` directory