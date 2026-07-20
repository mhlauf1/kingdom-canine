# Kingdom Canine — Render Contract

This specifies the post-projection data passed by the current frontend. Evidence is repository source plus the 2026-07-10 read-only production snapshot.

## 1. Routing map

| Route | Route file | Query | Document mapping / behavior |
|---|---|---|---|
| `/` | `frontend/app/page.tsx` | `homepageQuery` | Fixed page document where `slug.current == "homepage"`; rendered through PageBuilder; metadata uses same query with stega disabled. |
| `/[slug]` | `frontend/app/[slug]/page.tsx` | `getPageQuery`; `pagesSlugs` | URL segment maps to page slug. `generateStaticParams` returns every page slug, including `homepage` (therefore a possible `/homepage` parameter in addition to special root). Missing document renders inline “Page not found”, not `notFound()`. |
| `/services/[slug]` | `frontend/app/services/[slug]/page.tsx` | `getServiceQuery`; `serviceSlugs` | Segment maps to service slug; PageBuilder contract; metadata fallback: SEO title/description → title/heading/shortDescription. |
| `/studio/[[...tool]]` | `frontend/app/studio/[[...tool]]/page.tsx` | none | Embedded Sanity Studio; not PageBuilder. |
| `/api/contact` | `frontend/app/api/contact/route.ts` | none | POST handler sends email; not CMS-rendered. |
| `/api/draft-mode/enable` | `frontend/app/api/draft-mode/enable/route.ts` | none | Sanity draft-mode handler. |
| `/sitemap.xml` | `frontend/app/sitemap.ts` | `sitemapData` | Computes canonical URLs and excludes `seo.noIndex`; homepage special-cased to root. |
| `/robots.txt` | `frontend/app/robots.ts` | none | Static MetadataRoute response. |

## 2. Projection delta

All eight expanded GROQ strings are reproduced verbatim in `cms-audit/schema-inventory.json` and `REPORT.md`; source: `frontend/sanity/lib/queries.ts`.

- Settings spreads raw fields, recursively projects nav/footer/button link objects, resolves referenced page/service to `page` (slug string) and `pageType`, and computes `faviconUrl` from `favicon.asset->url`. Other images remain Sanity image objects with asset references.
- Page/service queries select route-level identity and SEO fields, rename `pageBuilder` to the projected array of the same name, spread every block, expand all supported nested buttons/links, expand Portable Text link mark definitions, dereference `serviceTabs.tabs[]` and `testimonials.reviews[]`. No general image asset projection adds URL, LQIP, or dimensions. Components build image URLs from asset references.
- Sitemap renames `slug.current` to string `slug` and `seo.noIndex` to `noIndex`. Slug-list queries similarly return a scalar `slug`. Services-nav returns scalar slug plus id/title.

Representative stored → projected sketch:

```json
// stored
{"_type":"page","slug":{"current":"homepage"},"pageBuilder":[{"_type":"testimonials","reviews":[{"_ref":"testimonial-id"}]},{"_type":"hero","primaryCta":{"link":{"linkType":"page","page":{"_ref":"service-id"}}}}]}
// projected
{"_id":"…","_type":"page","name":"Homepage","slug":{"current":"homepage"},"seo":{},"pageBuilder":[{"_type":"testimonials","reviews":[{"_id":"testimonial-id","quote":"…","authorName":"…","authorLabel":"…","rating":5}]},{"_type":"hero","primaryCta":{"link":{"linkType":"page","page":"daycare","pageType":"service"}}}]}
```

## 3. Block props contract (live types only)

`PageBuilder` passes each live block to `BlockRenderer`, which calls the mapped component with exactly `{block, index, pageId, pageType}`; fields are nested under `block`, not spread as top-level props. Evidence: `frontend/app/components/PageBuilder.tsx`; `frontend/app/components/BlockRenderer.tsx:51-136`. `block` always includes `_key` and `_type` from the GROQ spread. Optionality below is empirical across live published instances.

### `contactForm` → `ContactForm.tsx` (1 live instance)

Component: `frontend/app/components/sections/ContactForm.tsx` (wrapped by BlockRenderer).

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (1/1) |
| `_type` | string | no (1/1) |
| `address` | string | no (1/1) |
| `email` | string | no (1/1) |
| `eyebrow` | string | no (1/1) |
| `fields` | array<object> | no (1/1) |
| `formFields` | array<object> | no (1/1) |
| `heading` | string | no (1/1) |
| `hours` | array<object> | no (1/1) |
| `mapEmbedUrl` | string | no (1/1) |
| `phone` | string | no (1/1) |
| `showMap` | boolean | no (1/1) |
| `submitButtonText` | string | no (1/1) |
| `submitText` | string | no (1/1) |
| `successMessage` | string | no (1/1) |

### `ctaBanner` → `CtaBanner.tsx` (5 live instances)

Component: `frontend/app/components/sections/CtaBanner.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (5/5) |
| `_type` | string | no (5/5) |
| `backgroundImage` | image object with asset reference; crop/hotspot/alt when stored (URL built in component, not projected) | no (5/5) |
| `cta` | object | no (5/5) |
| `heading` | string | no (5/5) |
| `ratingText` | string | yes (4/5) |
| `showRating` | boolean | yes (4/5) |

### `ctaStrip` → `CtaStrip.tsx` (5 live instances)

Component: `frontend/app/components/sections/CtaStrip.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (5/5) |
| `_type` | string | no (5/5) |
| `backgroundColor` | string | no (5/5) |
| `cta` | object | no (5/5) |
| `heading` | string | no (5/5) |
| `subtext` | string | no (5/5) |

### `faqAccordion` → `FaqAccordion.tsx` (4 live instances)

Component: `frontend/app/components/sections/FaqAccordion.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (4/4) |
| `_type` | string | no (4/4) |
| `eyebrow` | string | no (4/4) |
| `faqs` | array<object> | no (4/4) |
| `heading` | string | no (4/4) |

### `featureCards` → `FeatureCards.tsx` (4 live instances)

Component: `frontend/app/components/sections/FeatureCards.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (4/4) |
| `_type` | string | no (4/4) |
| `columns` | number | yes (3/4) |
| `cta` | object | no (4/4) |
| `darkMode` | boolean | no (4/4) |
| `features` | array<object> | no (4/4) |
| `heading` | string | no (4/4) |
| `subheading` | string | no (4/4) |
| `trustLine` | string | yes (2/4) |

### `galleryPage` → `GalleryPage.tsx` (1 live instance)

Component: `frontend/app/components/sections/GalleryPage.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (1/1) |
| `_type` | string | no (1/1) |
| `heading` | string | no (1/1) |
| `images` | array<image object with asset reference; crop/hotspot/alt when stored (URL built in component, not projected)> | no (1/1) |
| `layout` | string | no (1/1) |

### `hero` → `Hero.tsx` (1 live instance)

Component: `frontend/app/components/sections/Hero.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (1/1) |
| `_type` | string | no (1/1) |
| `carouselImages` | array<image object with asset reference; crop/hotspot/alt when stored (URL built in component, not projected)> | no (1/1) |
| `eyebrow` | string | no (1/1) |
| `heading` | string | no (1/1) |
| `primaryCta` | object | no (1/1) |
| `reviewText` | string | no (1/1) |
| `secondaryCta` | object | no (1/1) |
| `subtext` | string | no (1/1) |
| `trustLine` | string | no (1/1) |

### `heroMinimal` → `HeroMinimal.tsx` (2 live instances)

Component: `frontend/app/components/sections/HeroMinimal.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (2/2) |
| `_type` | string | no (2/2) |
| `backgroundColor` | string | no (2/2) |
| `eyebrow` | string | no (2/2) |
| `heading` | string | no (2/2) |
| `headingAccent` | string | no (2/2) |
| `subtext` | string | no (2/2) |

### `heroSplit` → `HeroSplit.tsx` (2 live instances)

Component: `frontend/app/components/sections/HeroSplit.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (2/2) |
| `_type` | string | no (2/2) |
| `backgroundColor` | string | no (2/2) |
| `body` | string | no (2/2) |
| `eyebrow` | string | no (2/2) |
| `heading` | string | no (2/2) |
| `image` | image object with asset reference; crop/hotspot/alt when stored (URL built in component, not projected) | no (2/2) |
| `imagePosition` | string | no (2/2) |
| `primaryCta` | object | no (2/2) |
| `secondaryCta` | object | no (2/2) |

### `policyNotes` → `PolicyNotes.tsx` (1 live instance)

Component: `frontend/app/components/sections/PolicyNotes.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (1/1) |
| `_type` | string | no (1/1) |
| `backgroundColor` | string | no (1/1) |
| `categories` | array<object> | no (1/1) |
| `eyebrow` | string | no (1/1) |
| `heading` | string | no (1/1) |

### `pricingCalculator` → `PricingCalculator.tsx` (2 live instances)

Component: `frontend/app/components/sections/PricingCalculator.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (2/2) |
| `_type` | string | no (2/2) |
| `calculatorType` | string | no (2/2) |
| `ctaLink` | link object with resolved page/pageType only for page-reference branch | no (2/2) |
| `ctaText` | string | no (2/2) |
| `displayMode` | string | no (2/2) |
| `eyebrow` | string | no (2/2) |
| `heading` | string | no (2/2) |
| `subheading` | string | no (2/2) |
| `taxNote` | string | no (2/2) |

### `pricingList` → `PricingList.tsx` (1 live instance)

Component: `frontend/app/components/sections/PricingList.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (1/1) |
| `_type` | string | no (1/1) |
| `backgroundColor` | string | no (1/1) |
| `columns` | number | no (1/1) |
| `description` | string | no (1/1) |
| `eyebrow` | string | no (1/1) |
| `heading` | string | no (1/1) |
| `items` | array<object> | no (1/1) |

### `pricingPageTabs` → `PricingPageTabs.tsx` (1 live instance)

Component: `frontend/app/components/sections/PricingPageTabs.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (1/1) |
| `_type` | string | no (1/1) |
| `ctaLink` | link object with resolved page/pageType only for page-reference branch | no (1/1) |
| `ctaText` | string | no (1/1) |
| `defaultTab` | string | no (1/1) |
| `description` | string | no (1/1) |
| `eyebrow` | string | no (1/1) |
| `heading` | string | no (1/1) |
| `services` | array<object> | no (1/1) |
| `taxNote` | string | no (1/1) |

### `processSteps` → `ProcessSteps.tsx` (4 live instances)

Component: `frontend/app/components/sections/ProcessSteps.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (4/4) |
| `_type` | string | no (4/4) |
| `backgroundColor` | string | yes (3/4) |
| `cta` | object | yes (1/4) |
| `description` | string | yes (2/4) |
| `eyebrow` | string | no (4/4) |
| `heading` | string | no (4/4) |
| `steps` | array<object> | no (4/4) |

### `requirementsList` → `RequirementsList.tsx` (1 live instance)

Component: `frontend/app/components/sections/RequirementsList.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (1/1) |
| `_type` | string | no (1/1) |
| `backgroundColor` | string | no (1/1) |
| `description` | string | no (1/1) |
| `eyebrow` | string | no (1/1) |
| `heading` | string | no (1/1) |
| `image` | image object with asset reference; crop/hotspot/alt when stored (URL built in component, not projected) | no (1/1) |
| `imagePosition` | string | no (1/1) |
| `items` | array<object> | no (1/1) |

### `serviceCards` → `ServiceCards.tsx` (1 live instance)

Component: `frontend/app/components/sections/ServiceCards.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (1/1) |
| `_type` | string | no (1/1) |
| `cards` | array<object> | no (1/1) |
| `columns` | number | no (1/1) |
| `description` | string | no (1/1) |
| `eyebrow` | string | no (1/1) |
| `heading` | string | no (1/1) |
| `variant` | string | no (1/1) |

### `spacer` → `Spacer.tsx` (16 live instances)

Component: `frontend/app/components/sections/Spacer.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (16/16) |
| `_type` | string | no (16/16) |
| `size` | string | yes (14/16) |

### `splitContent` → `SplitContent.tsx` (5 live instances)

Component: `frontend/app/components/sections/SplitContent.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (5/5) |
| `_type` | string | no (5/5) |
| `backgroundColor` | string | yes (4/5) |
| `body` | array<Portable Text block> | no (5/5) |
| `heading` | string | no (5/5) |
| `hours` | array<object> | yes (1/5) |
| `image` | image object with asset reference; crop/hotspot/alt when stored (URL built in component, not projected) | no (5/5) |
| `imagePosition` | string | no (5/5) |
| `link` | object | yes (3/5) |

### `statsBar` → `StatsBar.tsx` (1 live instance)

Component: `frontend/app/components/sections/StatsBar.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (1/1) |
| `_type` | string | no (1/1) |
| `stats` | array<object> | no (1/1) |

### `testimonials` → `Testimonials.tsx` (1 live instance)

Component: `frontend/app/components/sections/Testimonials.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (1/1) |
| `_type` | string | no (1/1) |
| `googleRating` | string | no (1/1) |
| `googleReviewCount` | number | no (1/1) |
| `heading` | string | no (1/1) |
| `reviews` | array<object> | no (1/1) |

### `whatsIncluded` → `WhatsIncluded.tsx` (2 live instances)

Component: `frontend/app/components/sections/WhatsIncluded.tsx`.

| `block` field | As received | Optional in live data |
|---|---|---:|
| `_key` | string | no (2/2) |
| `_type` | string | no (2/2) |
| `backgroundColor` | string | no (2/2) |
| `columns` | number | no (2/2) |
| `description` | string | no (2/2) |
| `eyebrow` | string | no (2/2) |
| `heading` | string | no (2/2) |
| `iconColor` | string | no (2/2) |
| `items` | array<object> | no (2/2) |
| `layout` | string | no (2/2) |

## 4. Preview/editing coupling inventory

| File | Coupling |
|---|---|
| `frontend/sanity/lib/live.ts` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/[slug]/page.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/services/[slug]/page.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/layout.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/page.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/BlockRenderer.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/sanity/lib/utils.ts` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/sitemap.ts` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/DraftModeToast.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/PageBuilder.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/Cta.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/FullWidthMedia.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/CtaStrip.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/GalleryShowcase.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/HeroBanner.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/IconGrid.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/HeroSplit.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/PricingMatrix.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/PolicyNotes.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/GalleryCarousel.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/HeroMinimal.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/GalleryPage.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/RequirementsList.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/ValuePillars.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/ServiceCards.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/FeatureGrid.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/LogoBar.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/PricingList.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/ExpandingCardsRow.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/SplitContent.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/FeatureList.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/ContentColumns.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/GalleryGrid.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/VideoSection.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/WhatsIncluded.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/ContactForm.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |
| `frontend/app/components/sections/ProcessSteps.tsx` | Imports or calls Sanity live fetch, visual editing, hooks, stega cleanup, or data attributes; exact imports/calls are mechanically discoverable in this file. |

Key hubs: `frontend/sanity/lib/live.ts` configures `defineLive` with server/browser tokens; `frontend/sanity/lib/client.ts` enables stega; `frontend/sanity/lib/utils.ts` creates edit data attributes; `frontend/app/layout.tsx` mounts `SanityLive` and draft-only `VisualEditing`; `PageBuilder.tsx` uses `useOptimistic`.

## 5. Shared shell data

`frontend/app/layout.tsx:94-242` fetches `settingsQuery` for metadata and again in parallel with `servicesNavQuery` for the shell. Settings supplies title/description/OG image/favicon/search verification; nav items, CTA, footer columns/text/links/contact/social/POS; GA4/GTM IDs; logo; and local-business JSON-LD. Services-nav supplies `{_id,title,slug}`; layout replaces the CMS “Services” nav item's children with these four services. `Header.tsx` receives settings plus injected nav; `Footer.tsx` receives settings.

The adapter must preserve the current nondeterministic singleton behavior only if exact bug compatibility is required; source query is unordered `*[_type == "settings"][0]`, while production has two settings documents. Evidence: `frontend/sanity/lib/queries.ts:17`; production snapshot.
