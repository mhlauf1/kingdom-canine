# Kingdom Canine — Sanity Schema & Content Architecture Audit

> **SNAPSHOT — captured July 2026.** This audit reflects the codebase and dataset at the time it was written and is NOT kept up to date. Verify any finding against the current code before acting on it.

Audit date: 2026-07-10  
Model: `gpt-5`  
Evidence scope: repository source plus read-only production dataset snapshot. The requested `cms-audit/reference/*` files were NOT FOUND; completed references resolved at `../home-away-fargo/cms-audit/schema-inventory.json` and `../houndaround/main-3/cms-audit/schema-inventory.json`.

## Executive inventory

- Clone parent: **home-away-fargo** (documented). Mechanical diff: 35 of 47 registered Kingdom schema files are byte-identical; 12 differ; webcam document and two webcam blocks were removed. No evidence against parentage. Evidence: `context/project-overview.md:11-27`; `studio/src/schemaTypes/index.ts`; mechanical `diff -qr` against `../home-away-fargo/studio/src/schemaTypes`.
- Production dataset: 53 documents total; 5 pages, 4 services, 3 testimonials, 2 settings, 26 image assets, 13 system documents. Evidence: read-only GROQ `*[]|order(_type){_type}` on project `ldmtl3r7`, dataset `production`.
- Registered schema: 3 document types and 47 object/array types. Evidence: `studio/src/schemaTypes/index.ts`.
- Live page-builder blocks: 21; dead registered blocks: 21. Evidence: read-only GROQ over `pageBuilder[]._type`.

## Mechanical drift from clone parent

| Change | Evidence |
|---|---|
| Removed `webcam`, `webcamPreview`, `webcamGrid` and their page-builder membership | `studio/src/schemaTypes/index.ts`; `documents/page.ts`; `documents/service.ts`; diff to parent checkout |
| Added `contactForm.hours`, `featureCards.columns`, `galleryPage.images[].span`, `hero.carouselImages`, `serviceCards.variant`, `splitContent.hours`; named inline members for service cards/stats | corresponding files under `studio/src/schemaTypes/objects/`; diff to parent |
| `link.href` accepts relative URLs and http/https/mailto/tel | `studio/src/schemaTypes/objects/link.ts:25-39` |
| Settings adds `posUrls`, removes `ctmScriptUrl`, and changes brand defaults | `studio/src/schemaTypes/singletons/settings.tsx`; diff to parent |
| Query adds `posUrls`, removes `ctmScriptUrl` and webcam expansion | `frontend/sanity/lib/queries.ts:17-53,64-282`; diff to parent |

## Document types

### `page` — Page

Source: `studio/src/schemaTypes/documents/page.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `name` | string | yes | Rule.required() | frontend/app/[slug]/page.tsx (generateMetadata title fallback); studio locations resolver |
| `slug` | slug | yes | Rule.required() | frontend/app/[slug]/page.tsx; frontend/app/sitemap.ts; frontend/sanity/lib/utils.ts linkResolver |
| `seo` | seo | no | DRIFT vs hound-3: populated (metaTitle + metaDescription) on ALL 7 live pages; ogImage and noIndex populated nowhere | frontend/app/[slug]/page.tsx generateMetadata; frontend/app/page.tsx generateMetadata; frontend/app/sitemap.ts (noIndex) |
| `pageBuilder` | array | no | 44 member types (hound-3 had 41; adds heroMarquee, expandingCardsRow, spacer). insertMenu grid view expects /static/page-builder-thumbnails/<type>.webp but only 2 thumbnails exist (callToAction, infoSection) — 42 broken preview images in the Studio insert menu | frontend/app/components/PageBuilder.tsx; frontend/app/components/BlockRenderer.tsx |

### `service` — Service

Source: `studio/src/schemaTypes/documents/service.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `title` | string | yes | Rule.required() | frontend/app/services/[slug]/page.tsx; frontend/app/layout.tsx (services nav injection — INERT on this site, see riskFlags); frontend/app/components/sections/ServiceTabs.tsx (block unused live) |
| `slug` | slug | no | source: 'title', maxLength: 96 | frontend/app/services/[slug]/page.tsx; frontend/app/sitemap.ts; frontend/app/layout.tsx |
| `sticker` | image | no | image field: alt (string) | frontend/app/components/sections/ServiceTabs.tsx |
| `shortDescription` | text | no | Set on all 4 services; only reachable consumer is the metadata fallback, which never fires because seo.metaDescription is set everywhere | frontend/app/components/sections/ServiceTabs.tsx (block unused live); frontend/app/services/[slug]/page.tsx (meta description fallback) |
| `tabImage` | image | no | image field: alt (string) | frontend/app/components/sections/ServiceTabs.tsx; studio preview media |
| `tabCta` | button | no |  | frontend/app/components/sections/ServiceTabs.tsx |
| `heading` | string | no | DRIFT vs hound-3: populated on all 4 live services (e.g. 'Dog Boarding') but still only consumed as a metadata-description fallback that never fires (seo.metaDescription set everywhere) — near-dead | frontend/app/services/[slug]/page.tsx (meta description fallback only) |
| `seo` | seo | no | Populated (metaTitle + metaDescription) on all 4 live services | frontend/app/services/[slug]/page.tsx generateMetadata |
| `pageBuilder` | array | no | Drift vs page: omits galleryPage, pricingPageTabs (same omission as hound-3); includes the 3 new types (heroMarquee, expandingCardsRow, spacer); order differs slightly (service.ts:77-120) | frontend/app/components/PageBuilder.tsx |

### `testimonial` — Testimonial

Source: `studio/src/schemaTypes/documents/testimonial.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `quote` | text | yes | Rule.required() | frontend/app/components/sections/Testimonials.tsx |
| `authorName` | string | yes | Rule.required() | frontend/app/components/sections/Testimonials.tsx |
| `authorLabel` | string | no |  | frontend/app/components/sections/Testimonials.tsx |
| `rating` | number | no | Rule.min(1).max(5) | frontend/app/components/sections/Testimonials.tsx |

## Object and array types

### `seo` — SEO & Metadata

Source: `studio/src/schemaTypes/objects/seo.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `metaTitle` | string | no | Rule.warning().max(70) | frontend/app/page.tsx; frontend/app/[slug]/page.tsx; frontend/app/services/[slug]/page.tsx |
| `metaDescription` | text | no | Rule.warning().max(160) | same 3 generateMetadata fns |
| `ogImage` | image | no | image field: alt (string) | same 3 generateMetadata fns via resolveOpenGraphImage |
| `noIndex` | boolean | no | populated nowhere in live data | 3 generateMetadata fns (robots); frontend/app/sitemap.ts (exclusion) |

### `button` — (no title)

Source: `studio/src/schemaTypes/objects/button.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `buttonText` | string | no |  | frontend/app/components/ui/Button.tsx via section components |
| `link` | link | no |  | frontend/app/components/ui/Button.tsx; frontend/app/components/ResolvedLink.tsx |

### `link` — Link

Source: `studio/src/schemaTypes/objects/link.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `linkType` | string | no | options: href\|page, radio. NO initialValue (unlike blockContent annotation which defaults 'href') | frontend/sanity/lib/utils.ts linkResolver |
| `href` | url | no | custom: 'URL is required when Link Type is URL' when linkType==='href' && !value | linkResolver |
| `page` | reference | no | custom: 'Page reference is required when Link Type is Page' when linkType==='page' && !value | linkResolver (dereferenced to slug + pageType in GROQ) |
| `queryString` | string | no | unset everywhere in live data | linkResolver (appends ?qs) |
| `openInNewTab` | boolean | no |  | ResolvedLink.tsx; Button.tsx (target/rel) |

### `blockContent` — Block Content

Source: `studio/src/schemaTypes/objects/blockContent.tsx`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|

### `blockContentTextOnly` — Block Content (Simple - Text Only)

Source: `studio/src/schemaTypes/objects/blockContentTextOnly.tsx`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|

### `callToAction` — Call to Action

Source: `studio/src/schemaTypes/objects/callToAction.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/Cta.tsx |
| `heading` | string | yes | Rule.required() | Cta.tsx |
| `body` | blockContentTextOnly | no |  | Cta.tsx via CustomPortableText |
| `button` | button | no |  | Cta.tsx |
| `image` | image | no |  | Cta.tsx (alt hardcoded 'Demo image') |
| `theme` | string | no | options light\|dark radio | Cta.tsx |
| `contentAlignment` | string | no | options textFirst\|imageFirst radio | Cta.tsx |

### `infoSection` — Info Section

Source: `studio/src/schemaTypes/objects/infoSection.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `heading` | string | no |  | frontend/app/components/InfoSection.tsx |
| `subheading` | string | no |  | InfoSection.tsx |
| `content` | blockContent | no |  | InfoSection.tsx via CustomPortableText (components map — links/images DO render here) |

### `hero` — Hero

Source: `studio/src/schemaTypes/objects/hero.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/Hero.tsx |
| `heading` | string | yes | Rule.required() | Hero.tsx |
| `subtext` | text | no |  | Hero.tsx |
| `primaryCta` | button | no |  | Hero.tsx |
| `secondaryCta` | button | no |  | Hero.tsx |
| `reviewRating` | number | no | Rule.min(1).max(5) | Hero.tsx |
| `reviewText` | string | no | unset live | Hero.tsx |
| `trustLine` | string | no | unset live | Hero.tsx |
| `heroImage` | image | no | unset on all 4 live instances — all service heroes render text-only | Hero.tsx (width 960) |
| `carouselImages` | array | no | Kingdom addition vs parent; populated on homepage. | frontend/app/components/sections/Hero.tsx |

### `heroMarquee` — Hero Marquee

Source: `studio/src/schemaTypes/objects/heroMarquee.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/HeroMarquee.tsx |
| `heading` | string | yes | Rule.required() | HeroMarquee.tsx |
| `headingAccent` | string | no | second line in brand color | HeroMarquee.tsx |
| `subtext` | text | no |  | HeroMarquee.tsx |
| `primaryCta` | button | no |  | HeroMarquee.tsx |
| `secondaryCta` | button | no |  | HeroMarquee.tsx |
| `reviewRating` | number | no | Rule.min(1).max(5) | HeroMarquee.tsx (star row) |
| `reviewText` | string | no |  | HeroMarquee.tsx |
| `trustLine` | string | no |  | HeroMarquee.tsx |
| `bubbleText` | string | no | text split across top/bottom arcs of a decorative SVG circle badge | HeroMarquee.tsx |
| `heroLogo` | image | no | field: alt (string) | HeroMarquee.tsx (width 400; alt fallback 'Boxers Bed & Biscuits') |
| `marqueeImages` | array | no | 9 images live, all with alt | HeroMarquee.tsx (width 880, duplicated array, CSS marquee animation 120s) |

### `expandingCardsRow` — Expanding Cards Row

Source: `studio/src/schemaTypes/objects/expandingCardsRow.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/ExpandingCardsRow.tsx |
| `heading` | string | yes | Rule.required() | ExpandingCardsRow.tsx |
| `subheading` | text | no |  | ExpandingCardsRow.tsx |
| `cards` | array | no | Rule.min(2).max(4) | ExpandingCardsRow.tsx (width 1200) |
| `backgroundColor` | string | no | cream\|sand radio | ExpandingCardsRow.tsx |

### `spacer` — Spacer

Source: `studio/src/schemaTypes/objects/spacer.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `size` | string | no | sm\|md\|lg\|xl radio. Component quirk: sm and md both map to h-16 (Spacer.tsx:1-6) | frontend/app/components/sections/Spacer.tsx |

### `imageRow` — Image Row

Source: `studio/src/schemaTypes/objects/imageRow.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `images` | array | no | Rule.min(1).max(6) | frontend/app/components/sections/ImageRow.tsx (width 400) |

### `featureCards` — Feature Cards

Source: `studio/src/schemaTypes/objects/featureCards.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `heading` | string | yes | Rule.required() | frontend/app/components/sections/FeatureCards.tsx |
| `subheading` | text | no |  | FeatureCards.tsx |
| `stickerLeft` | image | no | field: alt | FeatureCards.tsx (width 160) |
| `stickerRight` | image | no | field: alt | FeatureCards.tsx (width 160) |
| `features` | array | no | inline object {icon: string (Iconify name), title: string required, description: text} | FeatureCards.tsx (Iconify @iconify/react — external api.iconify.design dependency) |
| `cta` | button | no | unset live | FeatureCards.tsx |
| `trustLine` | string | no | unset live | FeatureCards.tsx |
| `darkMode` | boolean | no | Typed in component props but never destructured/rendered — DEAD FIELD (set true on all 4 live instances, inert) | NOT FOUND |
| `columns` | number | no | Kingdom addition vs parent; options 3\|4. | frontend/app/components/sections/FeatureCards.tsx |

### `serviceTabs` — Service Tabs

Source: `studio/src/schemaTypes/objects/serviceTabs.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/ServiceTabs.tsx |
| `heading` | string | yes | Rule.required() | ServiceTabs.tsx |
| `tabs` | array | no | reference | ServiceTabs.tsx (dereferenced in GROQ) |

### `statsBar` — Stats Bar

Source: `studio/src/schemaTypes/objects/statsBar.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `stats` | array | no | inline object {value: string required, label: string required} | frontend/app/components/sections/StatsBar.tsx |
| `showLogo` | boolean | no |  | StatsBar.tsx |

### `testimonials` — Testimonials

Source: `studio/src/schemaTypes/objects/testimonials.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `icon` | image | no | field: alt | frontend/app/components/sections/Testimonials.tsx (width 120) |
| `heading` | string | yes | Rule.required() | Testimonials.tsx |
| `reviews` | array | no | reference | Testimonials.tsx (dereferenced in GROQ) |
| `googleRating` | string | no | set live | Testimonials.tsx |
| `googleReviewCount` | number | no | Typed in props but never destructured/rendered — DEAD FIELD (set in live data, inert) | NOT FOUND |

### `ctaBanner` — CTA Banner

Source: `studio/src/schemaTypes/objects/ctaBanner.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `icon` | image | no | field: alt | frontend/app/components/sections/CtaBanner.tsx (width 200) |
| `stickerImage` | image | no | field: alt | CtaBanner.tsx (width 120) |
| `heading` | string | yes | Rule.required() | CtaBanner.tsx |
| `backgroundImage` | image | no | field: alt | CtaBanner.tsx (width 1200, eager when index<=1) |
| `sideImage` | image | no | field: alt; presence switches to 2-col layout | CtaBanner.tsx (width 700) |
| `cta` | button | no | set on all 10 | CtaBanner.tsx |
| `alignment` | string | no | NEW FIELD vs hound-3. options center\|left radio; only affects full-width (no side image) layout | CtaBanner.tsx (isLeft branch) |
| `showRating` | boolean | no | false on 9 of 10 live instances | CtaBanner.tsx |
| `ratingText` | string | no | set on 1 of 10 | CtaBanner.tsx |

### `splitContent` — Split Content

Source: `studio/src/schemaTypes/objects/splitContent.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `heading` | string | yes | Rule.required() | frontend/app/components/sections/SplitContent.tsx |
| `body` | blockContent | no |  | SplitContent.tsx via BARE <PortableText> (no components map — link marks would render as plain text; live bodies contain no links) |
| `link` | object | no | unset on both live instances (About CTA was deliberately removed 2026-04-21) | SplitContent.tsx via Button |
| `badge` | image | no | field: alt | SplitContent.tsx (width 80) |
| `image` | image | no | field: alt | SplitContent.tsx (width 600) |
| `stickerImage` | image | no | field: alt | SplitContent.tsx (width 200) |
| `imagePosition` | string | no | left\|right radio | SplitContent.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest radio. Live values: forest (homepage), cream (about) | SplitContent.tsx |
| `hours` | array | no | Kingdom addition vs parent; populated on homepage. | frontend/app/components/sections/SplitContent.tsx |

### `faqAccordion` — FAQ Accordion

Source: `studio/src/schemaTypes/objects/faqAccordion.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/FaqAccordion.tsx |
| `heading` | string | yes | Rule.required() | FaqAccordion.tsx |
| `faqs` | array | no | faq: inline object {question: string required, answer: blockContent} | FaqAccordion.tsx — answer via BARE <PortableText> + toPlainText for FAQPage JSON-LD |

### `pricingTable` — Pricing Table

Source: `studio/src/schemaTypes/objects/pricingTable.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/PricingTable.tsx |
| `heading` | string | no |  | PricingTable.tsx |
| `description` | text | no | grooming instance carries the pricing disclaimer + mobile-grooming note (client-managed copy) | PricingTable.tsx |
| `categories` | array | no | pricingCategory: {categoryName: string required, tiers: array of pricingTier {name: string required, price: string, description: text, features: array of string, highlighted: boolean (init false), cta: button}} | PricingTable.tsx |

### `teamGrid` — Team Grid

Source: `studio/src/schemaTypes/objects/teamGrid.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/TeamGrid.tsx |
| `heading` | string | no |  | TeamGrid.tsx |
| `members` | array | no | teamMember: {name: string required, role: string, bio: text, certifications: string (single comma-separated string, NOT an array), image: image hotspot} | TeamGrid.tsx (width 400) |

### `galleryGrid` — Gallery Grid

Source: `studio/src/schemaTypes/objects/galleryGrid.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/GalleryGrid.tsx |
| `heading` | string | no |  | GalleryGrid.tsx |
| `images` | array | no | image (hotspot, fields: alt string, caption string) | GalleryGrid.tsx (width 600 grid; 1600 lightbox via sanityImageUrlWithDimensions) |
| `columns` | number | no | 2\|3\|4 | GalleryGrid.tsx |
| `displayStyle` | string | no | grid\|circles radio | GalleryGrid.tsx |
| `enableLightbox` | boolean | no |  | GalleryGrid.tsx (yet-another-react-lightbox) |
| `accentImage` | image | no | field: alt | GalleryGrid.tsx (width 200) |
| `backgroundColor` | string | no | cream\|sand\|forest radio | GalleryGrid.tsx |

### `contactForm` — Contact Form

Source: `studio/src/schemaTypes/objects/contactForm.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/ContactForm.tsx |
| `heading` | string | yes | Rule.required() | ContactForm.tsx |
| `description` | blockContent | no | set live | ContactForm.tsx via BARE <PortableText> |
| `formFields` | array | no | formField: {fieldName: string required, label: string required, type: string (text\|email\|tel\|textarea\|select, init text), required: boolean (init false), options: array of string (hidden unless type==select)} | ContactForm.tsx → POST /api/contact (nodemailer) |
| `submitButtonText` | string | no |  | ContactForm.tsx |
| `successMessage` | string | no |  | ContactForm.tsx |
| `showMap` | boolean | no | true live | ContactForm.tsx |
| `mapEmbedUrl` | url | no | set live | ContactForm.tsx |
| `nextSteps` | array | no | nextStep: {title: string required, description: text} | ContactForm.tsx |
| `image` | image | no | field: alt | ContactForm.tsx (width 700) |
| `address` | text | no | Duplicates settings.contactInfo.address — per-block copy, both set live | ContactForm.tsx |
| `phone` | string | no | Duplicates settings.contactInfo.phone | ContactForm.tsx (tel: link) |
| `email` | string | no | Duplicates settings.contactInfo.email (both updated to hafhfacility@gmail.com in Round 4) | ContactForm.tsx (mailto:) |
| `hours` | array | no | Kingdom addition vs parent; populated live. | frontend/app/components/sections/ContactForm.tsx |

### `heroSplit` — Hero Split

Source: `studio/src/schemaTypes/objects/heroSplit.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/HeroSplit.tsx |
| `heading` | string | yes | Rule.required() | HeroSplit.tsx |
| `body` | text | no |  | HeroSplit.tsx |
| `primaryCta` | button | no |  | HeroSplit.tsx |
| `secondaryCta` | button | no |  | HeroSplit.tsx |
| `image` | image | yes | Rule.required() | HeroSplit.tsx (width 600) |
| `stickerImage` | image | no | field: alt | HeroSplit.tsx (width 200) |
| `imagePosition` | string | no | left\|right radio | HeroSplit.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest radio | HeroSplit.tsx |

### `heroBanner` — Hero Banner

Source: `studio/src/schemaTypes/objects/heroBanner.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/HeroBanner.tsx |
| `heading` | string | yes | Rule.required() | HeroBanner.tsx |
| `subtext` | text | no |  | HeroBanner.tsx |
| `primaryCta` | button | no |  | HeroBanner.tsx |
| `backgroundImage` | image | no |  | HeroBanner.tsx (width 1400) |
| `overlayOpacity` | string | no | light\|medium\|heavy radio | HeroBanner.tsx |
| `minHeight` | string | no | standard\|tall\|fullscreen radio | HeroBanner.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest radio; used when no bg image | HeroBanner.tsx |

### `heroMinimal` — Hero Minimal

Source: `studio/src/schemaTypes/objects/heroMinimal.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/HeroMinimal.tsx |
| `rating` | string | no | unset live | HeroMinimal.tsx (ticker mode) |
| `heading` | string | yes | Rule.required() | HeroMinimal.tsx |
| `headingAccent` | string | no | unset live | HeroMinimal.tsx |
| `subtext` | text | no |  | HeroMinimal.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest radio | HeroMinimal.tsx |

### `serviceCards` — Service Cards

Source: `studio/src/schemaTypes/objects/serviceCards.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/ServiceCards.tsx |
| `heading` | string | yes | Rule.required() | ServiceCards.tsx |
| `description` | text | no |  | ServiceCards.tsx |
| `cards` | array | no | inline {image: image hotspot, title: string required, description: text, cta: button} | ServiceCards.tsx (width 400) |
| `columns` | number | no | 2\|3\|4 | ServiceCards.tsx |
| `backgroundColor` | string | no | cream\|sand radio | ServiceCards.tsx |
| `variant` | string | no | Kingdom addition vs parent; white\|imageOverlay; homepage uses imageOverlay. | frontend/app/components/sections/ServiceCards.tsx |

### `featureList` — Feature List

Source: `studio/src/schemaTypes/objects/featureList.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/FeatureList.tsx |
| `heading` | string | yes | Rule.required() | FeatureList.tsx |
| `features` | array | no | inline {title: string required, body: blockContent, image: image hotspot, cta: button} | FeatureList.tsx — body via BARE <PortableText>; image width 600 |
| `showNumbers` | boolean | no |  | FeatureList.tsx |
| `backgroundColor` | string | no | cream\|sand radio | FeatureList.tsx |

### `processSteps` — Process Steps

Source: `studio/src/schemaTypes/objects/processSteps.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/ProcessSteps.tsx |
| `heading` | string | yes | Rule.required() | ProcessSteps.tsx |
| `description` | text | no |  | ProcessSteps.tsx |
| `steps` | array | no | Rule.min(2).max(6) | ProcessSteps.tsx |
| `cta` | button | no |  | ProcessSteps.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest radio | ProcessSteps.tsx |

### `contentColumns` — Content Columns

Source: `studio/src/schemaTypes/objects/contentColumns.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/ContentColumns.tsx |
| `heading` | string | no |  | ContentColumns.tsx |
| `columns` | array | no | Rule.min(2).max(3) | ContentColumns.tsx — body via BARE <PortableText>; image width 500 |
| `layout` | number | no | 2\|3 | ContentColumns.tsx |
| `backgroundColor` | string | no | cream\|sand radio | ContentColumns.tsx |

### `iconGrid` — Icon Grid

Source: `studio/src/schemaTypes/objects/iconGrid.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/IconGrid.tsx |
| `heading` | string | yes | Rule.required() | IconGrid.tsx |
| `description` | text | no |  | IconGrid.tsx |
| `items` | array | no | inline {icon: string (Iconify), title: string required, description: text} | IconGrid.tsx |
| `columns` | number | no | 2\|3\|4 | IconGrid.tsx |
| `accentImage` | image | no | field: alt | IconGrid.tsx (width 200) |
| `backgroundColor` | string | no | cream\|sand\|forest radio | IconGrid.tsx |

### `videoSection` — Video Section

Source: `studio/src/schemaTypes/objects/videoSection.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/VideoSection.tsx |
| `heading` | string | no |  | VideoSection.tsx |
| `description` | text | no |  | VideoSection.tsx |
| `videoUrl` | url | yes | Rule.required() | VideoSection.tsx |
| `thumbnail` | image | no |  | VideoSection.tsx (width 960) |
| `layout` | string | no | full\|split radio | VideoSection.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest radio | VideoSection.tsx |

### `fullWidthMedia` — Full Width Media

Source: `studio/src/schemaTypes/objects/fullWidthMedia.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `heading` | string | no |  | frontend/app/components/sections/FullWidthMedia.tsx |
| `subtext` | text | no |  | FullWidthMedia.tsx |
| `cta` | button | no |  | FullWidthMedia.tsx |
| `image` | image | yes | Rule.required() | FullWidthMedia.tsx (width 1400) |
| `textAlignment` | string | no | left\|center\|right radio | FullWidthMedia.tsx |
| `overlayOpacity` | string | no | light\|medium\|heavy radio | FullWidthMedia.tsx |

### `ctaStrip` — CTA Strip

Source: `studio/src/schemaTypes/objects/ctaStrip.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `heading` | string | yes | Rule.required() | frontend/app/components/sections/CtaStrip.tsx |
| `subtext` | string | no |  | CtaStrip.tsx |
| `cta` | button | yes | Rule.required() | CtaStrip.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest\|terracotta radio | CtaStrip.tsx |

### `logoBar` — Logo Bar

Source: `studio/src/schemaTypes/objects/logoBar.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `heading` | string | no |  | frontend/app/components/sections/LogoBar.tsx |
| `logos` | array | no | inline {image: image required, alt: string required, url: url} | LogoBar.tsx (width 160) |
| `displayMode` | string | no | grid\|marquee radio | LogoBar.tsx |
| `backgroundColor` | string | no | cream\|sand\|white radio | LogoBar.tsx |

### `pricingMatrix` — Pricing Matrix

Source: `studio/src/schemaTypes/objects/pricingMatrix.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/PricingMatrix.tsx |
| `heading` | string | no |  | PricingMatrix.tsx |
| `description` | text | no |  | PricingMatrix.tsx |
| `tables` | array | no | matrixTable: {tableName: string required, tableDescription: string, columnHeaders: array of string, rows: array of matrixRow {rowLabel: string required, cells: array of matrixCell {value: string, note: string}}} | PricingMatrix.tsx |
| `footnotes` | array | no | string | PricingMatrix.tsx |
| `backgroundColor` | string | no | cream\|sand radio | PricingMatrix.tsx |

### `pricingList` — Pricing List

Source: `studio/src/schemaTypes/objects/pricingList.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/PricingList.tsx |
| `heading` | string | no |  | PricingList.tsx |
| `description` | text | no |  | PricingList.tsx |
| `items` | array | no | pricingListItem: {service: string required, price: string, note: string} | PricingList.tsx |
| `columns` | number | no | 1\|2 radio | PricingList.tsx |
| `backgroundColor` | string | no | cream\|sand radio | PricingList.tsx |

### `policyNotes` — Policy Notes

Source: `studio/src/schemaTypes/objects/policyNotes.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/PolicyNotes.tsx |
| `heading` | string | no |  | PolicyNotes.tsx |
| `categories` | array | no | policyCategory: {categoryName: string required, policies: array of string} | PolicyNotes.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest radio | PolicyNotes.tsx |

### `featureGrid` — Feature Grid

Source: `studio/src/schemaTypes/objects/featureGrid.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `heading` | string | yes | Rule.required() | frontend/app/components/sections/FeatureGrid.tsx |
| `cta` | button | no |  | FeatureGrid.tsx |
| `items` | array | no | inline {image: image hotspot, icon: string (Iconify fallback), title: string required, description: text} | FeatureGrid.tsx (width 128, height 128) |
| `columns` | number | no | 3\|4 radio | FeatureGrid.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest\|black radio | FeatureGrid.tsx |

### `pricingCalculator` — Pricing Calculator

Source: `studio/src/schemaTypes/objects/pricingCalculator.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `displayMode` | string | no | single\|tabbed radio | frontend/app/components/sections/PricingCalculator.tsx |
| `calculatorType` | string | no | custom: required for single mode | PricingCalculator.tsx |
| `eyebrow` | string | no |  | PricingCalculator.tsx |
| `heading` | string | yes | Rule.required() | PricingCalculator.tsx |
| `subheading` | text | no |  | PricingCalculator.tsx |
| `ctaText` | string | no |  | PricingCalculator.tsx |
| `ctaLink` | link | no | live values: booking.goose.pet URLs (Goose booking platform, NOT the Gingr app named in project docs) | PricingCalculator.tsx |
| `taxNote` | string | no |  | PricingCalculator.tsx |

### `whatsIncluded` — What's Included

Source: `studio/src/schemaTypes/objects/whatsIncluded.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/WhatsIncluded.tsx |
| `heading` | string | no |  | WhatsIncluded.tsx |
| `description` | text | no |  | WhatsIncluded.tsx |
| `items` | array | no | inline {icon: string (Iconify), title: string required, description: text} | WhatsIncluded.tsx |
| `layout` | string | no | card\|inline radio | WhatsIncluded.tsx |
| `columns` | number | no | 2\|3\|4 radio | WhatsIncluded.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest radio | WhatsIncluded.tsx |
| `iconColor` | string | no | terracotta\|forest\|muted radio | WhatsIncluded.tsx |

### `requirementsList` — Requirements List

Source: `studio/src/schemaTypes/objects/requirementsList.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/RequirementsList.tsx |
| `heading` | string | yes | Rule.required() | RequirementsList.tsx |
| `description` | text | no |  | RequirementsList.tsx |
| `items` | array | no | item: {text: string} | RequirementsList.tsx |
| `link` | object | no | unset on all 3 live instances | RequirementsList.tsx |
| `image` | image | no | field: alt | RequirementsList.tsx (width 600) |
| `imagePosition` | string | no | left\|right radio | RequirementsList.tsx |
| `backgroundColor` | string | no | cream\|sand radio | RequirementsList.tsx |

### `galleryCarousel` — Gallery Carousel

Source: `studio/src/schemaTypes/objects/galleryCarousel.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/GalleryCarousel.tsx |
| `heading` | string | no |  | GalleryCarousel.tsx |
| `images` | array | no | image (hotspot, fields: alt string, caption string) | GalleryCarousel.tsx (width 500; 1600 lightbox) |
| `enableLightbox` | boolean | no |  | GalleryCarousel.tsx |
| `backgroundColor` | string | no | cream\|sand\|forest radio | GalleryCarousel.tsx |

### `galleryShowcase` — Gallery Showcase

Source: `studio/src/schemaTypes/objects/galleryShowcase.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/GalleryShowcase.tsx |
| `heading` | string | no |  | GalleryShowcase.tsx |
| `subheading` | text | no |  | GalleryShowcase.tsx |
| `images` | array | no | caption defined but NOT rendered by GalleryShowcase.tsx — dead subfield | GalleryShowcase.tsx (widths 1200/400; 1600 lightbox) |
| `backgroundColor` | string | no | cream\|sand radio | GalleryShowcase.tsx |

### `galleryPage` — Gallery Page

Source: `studio/src/schemaTypes/objects/galleryPage.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `heading` | string | no | unset live | frontend/app/components/sections/GalleryPage.tsx |
| `subtext` | text | no | unset live | GalleryPage.tsx |
| `images` | array | no | image (hotspot, fields: alt string, caption string) | GalleryPage.tsx (widths 500/1000; 1600 lightbox) |
| `layout` | string | no | grid\|single radio | GalleryPage.tsx |
| `backgroundColor` | string | no | cream\|sand radio | GalleryPage.tsx |
| `images[].span` | number | no | Kingdom addition vs parent; options 1\|2. | frontend/app/components/sections/GalleryPage.tsx |

### `valuePillars` — Value Pillars

Source: `studio/src/schemaTypes/objects/valuePillars.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/ValuePillars.tsx |
| `heading` | string | no |  | ValuePillars.tsx |
| `description` | text | no |  | ValuePillars.tsx |
| `pillars` | array | no | inline {metric: string required, title: string required, description: text} | ValuePillars.tsx |
| `columns` | number | no | 2\|3\|4 radio | ValuePillars.tsx |
| `accentImage` | image | no | field: alt | ValuePillars.tsx (width 200) |
| `backgroundColor` | string | no | cream\|sand\|forest radio | ValuePillars.tsx |

### `pricingPageTabs` — Pricing Page Tabs

Source: `studio/src/schemaTypes/objects/pricingPageTabs.ts`

| Field | Type | Required | Validation / configuration | Consumed by |
|---|---|---:|---|---|
| `eyebrow` | string | no |  | frontend/app/components/sections/PricingPageTabs.tsx |
| `heading` | string | yes | Rule.required() | PricingPageTabs.tsx |
| `description` | text | no |  | PricingPageTabs.tsx |
| `defaultTab` | string | no | daycare\|boarding\|grooming radio; /pricing#boarding deep links select tabs | PricingPageTabs.tsx |
| `services` | array | no | inline {serviceKey: string required (daycare\|boarding\|grooming), pricingDisplay: string (table\|matrix, init table), tableData: object (hidden unless table) {categories: array of pricingCategory {categoryName, tiers: array of pricingTier {name, price, description: string, features: array of string, highlighted: boolean}}, description: text}, matrixData: object (hidden unless matrix) {description: text, tables: array of matrixTable {tableName, tableDescription, columnHeaders: array of string, rows: array of matrixRow {rowLabel, cells: array of matrixCell {value, note}}}, footnotes: array of string}, showCalculator: boolean (init true)} | PricingPageTabs.tsx; frontend/app/components/pricing/PricingTierCards.tsx; frontend/app/components/pricing/PricingMatrixDisplay.tsx |
| `ctaText` | string | no |  | PricingPageTabs.tsx |
| `ctaLink` | link | no |  | PricingPageTabs.tsx |
| `taxNote` | string | no |  | PricingPageTabs.tsx |

## Portable Text configurations

Evidence: `studio/src/schemaTypes/objects/blockContent.tsx` and `blockContentTextOnly.tsx`.

```json
[
  {
    "location": "blockContent (shared type: infoSection.content, splitContent.body, faqAccordion.faqs[].answer, featureList.features[].body, contentColumns.columns[].body, contactForm.description) — file studio/src/schemaTypes/objects/blockContent.tsx, byte-identical to hound-3",
    "styles": [
      "SANITY DEFAULTS — not restricted in schema (normal, h1–h6, blockquote)"
    ],
    "lists": [
      "SANITY DEFAULTS (bullet, number)"
    ],
    "decorators": [
      "SANITY DEFAULTS (strong, em, code, underline, strike-through)"
    ],
    "annotations": [
      {
        "name": "link",
        "fields": {
          "linkType": "string radio href|page, initialValue 'href'",
          "href": "url, hidden unless linkType href/null, custom validation required-when-href",
          "page": "reference to [page] ONLY (note: standalone link object also allows service), hidden unless linkType page, custom validation required-when-page",
          "openInNewTab": "boolean, initialValue false"
        }
      }
    ],
    "customBlocks": [
      {
        "type": "image",
        "options": {
          "hotspot": true
        },
        "fields": "NONE — no alt/caption fields on schema, but CustomPortableText renderer reads value.alt (always undefined)"
      }
    ],
    "rendererFile": "SPLIT: frontend/app/components/PortableText.tsx (CustomPortableText) used only by InfoSection.tsx and Cta.tsx; the other 5 sites (SplitContent.tsx, FaqAccordion.tsx, FeatureList.tsx, ContentColumns.tsx, ContactForm.tsx) use BARE <PortableText> from @portabletext/react with NO components map",
    "customComponents": [
      "CustomPortableText: types.image → SanityImage width 672 cover rounded; block.h1/h2 → anchor-link headings using _key as fragment id; marks.link → ResolvedLink/linkResolver",
      "Bare renderers: default serializers only — custom link annotation and image blocks are NOT handled (links would render as plain text)"
    ],
    "liveDataShape": "Benign on this site today: across all live PT content there are ZERO link annotations and ZERO inline images. Styles used: normal, h3 (infoSection), h4 (splitContent). Marks used: strong only. (Verified by GROQ over all page/service docs 2026-07-10.)"
  },
  {
    "location": "blockContentTextOnly (used by callToAction.body — block type unused in live data) — file studio/src/schemaTypes/objects/blockContentTextOnly.tsx, byte-identical to hound-3",
    "styles": [
      "SANITY DEFAULTS — bare {type:'block'}"
    ],
    "lists": [
      "SANITY DEFAULTS"
    ],
    "decorators": [
      "SANITY DEFAULTS"
    ],
    "annotations": [
      "SANITY DEFAULT link annotation ({href}) — NOT the custom {linkType,href,page} shape used in blockContent"
    ],
    "customBlocks": [],
    "rendererFile": "frontend/app/components/Cta.tsx via frontend/app/components/PortableText.tsx",
    "customComponents": [
      "marks.link → ResolvedLink; linkResolver treats missing linkType with href as linkType='href'"
    ],
    "liveDataShape": "No live instances (callToAction unused)"
  },
  {
    "location": "settings.description (inline block array, studio/src/schemaTypes/singletons/settings.tsx)",
    "styles": [
      "[] (explicitly empty — plain paragraphs only)"
    ],
    "lists": [
      "[] (explicitly empty)"
    ],
    "decorators": [
      "[] (explicitly empty)"
    ],
    "annotations": [
      {
        "name": "link",
        "fields": "same custom link shape as blockContent (linkType/href/page→[page]/openInNewTab)"
      }
    ],
    "customBlocks": [],
    "rendererFile": "frontend/app/layout.tsx (generateMetadata)",
    "customComponents": [
      "Never rendered as rich text — only flattened via toPlainText() for the meta description"
    ],
    "liveDataShape": "NOT POPULATED in live data → site-wide meta description is the empty string (layout.tsx:117)"
  }
]
```

## GROQ inventory (verbatim post-interpolation strings)

All query definitions originate in `frontend/sanity/lib/queries.ts`.

### `settingsQuery`

Used by: frontend/app/layout.tsx (generateMetadata + RootLayout)

```groq
*[_type == "settings"][0]{
  ...,
  navItems[]{
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }
,
    children[]{
      ...,
      
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

    }
  },
  ctaButton {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  },
  footerColumns[]{
    ...,
    links[]{
      ...,
      
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

    }
  },
  contactInfo,
  footerTagline,
  footerText,
  footerTextLink,
  footerBottomLinks[]{
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  },
  logo,
  yearEstablished,
  socialLinks,
  posUrls,
  "faviconUrl": favicon.asset->url,
  ga4MeasurementId,
  gtmContainerId,
  googleSiteVerification,
  localBusiness
}
```

### `getPageQuery`

Used by: frontend/app/[slug]/page.tsx

```groq

  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    seo,
    
  "pageBuilder": pageBuilder[]{
    ...,
    _type == "callToAction" => {
      ...,
      button 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "infoSection" => {
      content[]{
        ...,
        markDefs[]{
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "hero" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }
,
      secondaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "featureCards" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "serviceTabs" => {
      ...,
      tabs[]->{
        _id,
        title,
        slug,
        sticker{asset, alt},
        shortDescription,
        tabImage{asset, crop, hotspot, alt},
        tabCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "testimonials" => {
      ...,
      reviews[]->{
        _id,
        quote,
        authorName,
        authorLabel,
        rating
      }
    },
    _type == "ctaBanner" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "splitContent" => {
      ...,
      link {
        ...,
        link {
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "faqAccordion" => {
      ...,
      faqs[]{
        ...,
        answer[]{
          ...,
          markDefs[]{
            ...,
            
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

          }
        }
      }
    },
    _type == "pricingTable" => {
      ...,
      categories[]{
        ...,
        tiers[]{
          ...,
          cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

        }
      }
    },
    _type == "contactForm" => {
      ...,
      description[]{
        ...,
        markDefs[]{
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "heroSplit" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }
,
      secondaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "heroBanner" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "heroMarquee" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }
,
      secondaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "heroMinimal" => {
      ...
    },
    _type == "serviceCards" => {
      ...,
      cards[]{
        ...,
        cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "expandingCardsRow" => {
      ...,
      cards[]{
        ...,
        link 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "featureList" => {
      ...,
      features[]{
        ...,
        body[]{
          ...,
          markDefs[]{
            ...,
            
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

          }
        },
        cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "processSteps" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "contentColumns" => {
      ...,
      columns[]{
        ...,
        body[]{
          ...,
          markDefs[]{
            ...,
            
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

          }
        },
        cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "fullWidthMedia" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "ctaStrip" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "pricingMatrix" => {
      ...
    },
    _type == "pricingList" => {
      ...
    },
    _type == "policyNotes" => {
      ...
    },
    _type == "featureGrid" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "pricingCalculator" => {
      ...,
      ctaLink {
        ...,
        
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }
    },
    _type == "whatsIncluded" => {
      ...
    },
    _type == "requirementsList" => {
      ...,
      link {
        ...,
        link {
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "galleryGrid" => {
      ...
    },
    _type == "galleryCarousel" => {
      ...
    },
    _type == "galleryShowcase" => {
      ...
    },
    _type == "galleryPage" => {
      ...
    },
    _type == "pricingPageTabs" => {
      ...,
      ctaLink {
        ...,
        
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }
    },
  }
,
  }

```

### `homepageQuery`

Used by: frontend/app/page.tsx (homepage)

```groq

  *[_type == 'page' && slug.current == 'homepage'][0]{
    _id,
    _type,
    name,
    slug,
    seo,
    
  "pageBuilder": pageBuilder[]{
    ...,
    _type == "callToAction" => {
      ...,
      button 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "infoSection" => {
      content[]{
        ...,
        markDefs[]{
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "hero" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }
,
      secondaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "featureCards" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "serviceTabs" => {
      ...,
      tabs[]->{
        _id,
        title,
        slug,
        sticker{asset, alt},
        shortDescription,
        tabImage{asset, crop, hotspot, alt},
        tabCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "testimonials" => {
      ...,
      reviews[]->{
        _id,
        quote,
        authorName,
        authorLabel,
        rating
      }
    },
    _type == "ctaBanner" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "splitContent" => {
      ...,
      link {
        ...,
        link {
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "faqAccordion" => {
      ...,
      faqs[]{
        ...,
        answer[]{
          ...,
          markDefs[]{
            ...,
            
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

          }
        }
      }
    },
    _type == "pricingTable" => {
      ...,
      categories[]{
        ...,
        tiers[]{
          ...,
          cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

        }
      }
    },
    _type == "contactForm" => {
      ...,
      description[]{
        ...,
        markDefs[]{
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "heroSplit" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }
,
      secondaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "heroBanner" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "heroMarquee" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }
,
      secondaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "heroMinimal" => {
      ...
    },
    _type == "serviceCards" => {
      ...,
      cards[]{
        ...,
        cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "expandingCardsRow" => {
      ...,
      cards[]{
        ...,
        link 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "featureList" => {
      ...,
      features[]{
        ...,
        body[]{
          ...,
          markDefs[]{
            ...,
            
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

          }
        },
        cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "processSteps" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "contentColumns" => {
      ...,
      columns[]{
        ...,
        body[]{
          ...,
          markDefs[]{
            ...,
            
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

          }
        },
        cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "fullWidthMedia" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "ctaStrip" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "pricingMatrix" => {
      ...
    },
    _type == "pricingList" => {
      ...
    },
    _type == "policyNotes" => {
      ...
    },
    _type == "featureGrid" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "pricingCalculator" => {
      ...,
      ctaLink {
        ...,
        
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }
    },
    _type == "whatsIncluded" => {
      ...
    },
    _type == "requirementsList" => {
      ...,
      link {
        ...,
        link {
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "galleryGrid" => {
      ...
    },
    _type == "galleryCarousel" => {
      ...
    },
    _type == "galleryShowcase" => {
      ...
    },
    _type == "galleryPage" => {
      ...
    },
    _type == "pricingPageTabs" => {
      ...,
      ctaLink {
        ...,
        
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }
    },
  }
,
  }

```

### `sitemapData`

Used by: frontend/app/sitemap.ts

```groq

  *[_type in ["page", "service"] && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
    "noIndex": seo.noIndex,
  }

```

### `pagesSlugs`

Used by: frontend/app/[slug]/page.tsx generateStaticParams

```groq

  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}

```

### `getServiceQuery`

Used by: frontend/app/services/[slug]/page.tsx

```groq

  *[_type == 'service' && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    heading,
    shortDescription,
    seo,
    
  "pageBuilder": pageBuilder[]{
    ...,
    _type == "callToAction" => {
      ...,
      button 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "infoSection" => {
      content[]{
        ...,
        markDefs[]{
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "hero" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }
,
      secondaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "featureCards" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "serviceTabs" => {
      ...,
      tabs[]->{
        _id,
        title,
        slug,
        sticker{asset, alt},
        shortDescription,
        tabImage{asset, crop, hotspot, alt},
        tabCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "testimonials" => {
      ...,
      reviews[]->{
        _id,
        quote,
        authorName,
        authorLabel,
        rating
      }
    },
    _type == "ctaBanner" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "splitContent" => {
      ...,
      link {
        ...,
        link {
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "faqAccordion" => {
      ...,
      faqs[]{
        ...,
        answer[]{
          ...,
          markDefs[]{
            ...,
            
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

          }
        }
      }
    },
    _type == "pricingTable" => {
      ...,
      categories[]{
        ...,
        tiers[]{
          ...,
          cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

        }
      }
    },
    _type == "contactForm" => {
      ...,
      description[]{
        ...,
        markDefs[]{
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "heroSplit" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }
,
      secondaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "heroBanner" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "heroMarquee" => {
      ...,
      primaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }
,
      secondaryCta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "heroMinimal" => {
      ...
    },
    _type == "serviceCards" => {
      ...,
      cards[]{
        ...,
        cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "expandingCardsRow" => {
      ...,
      cards[]{
        ...,
        link 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "featureList" => {
      ...,
      features[]{
        ...,
        body[]{
          ...,
          markDefs[]{
            ...,
            
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

          }
        },
        cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "processSteps" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "contentColumns" => {
      ...,
      columns[]{
        ...,
        body[]{
          ...,
          markDefs[]{
            ...,
            
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

          }
        },
        cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

      }
    },
    _type == "fullWidthMedia" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "ctaStrip" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "pricingMatrix" => {
      ...
    },
    _type == "pricingList" => {
      ...
    },
    _type == "policyNotes" => {
      ...
    },
    _type == "featureGrid" => {
      ...,
      cta 
  {
    ...,
    
  link {
      ...,
      
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }

  }

    },
    _type == "pricingCalculator" => {
      ...,
      ctaLink {
        ...,
        
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }
    },
    _type == "whatsIncluded" => {
      ...
    },
    _type == "requirementsList" => {
      ...,
      link {
        ...,
        link {
          ...,
          
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

        }
      }
    },
    _type == "galleryGrid" => {
      ...
    },
    _type == "galleryCarousel" => {
      ...
    },
    _type == "galleryShowcase" => {
      ...
    },
    _type == "galleryPage" => {
      ...
    },
    _type == "pricingPageTabs" => {
      ...,
      ctaLink {
        ...,
        
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }

      }
    },
  }
,
  }

```

### `serviceSlugs`

Used by: frontend/app/services/[slug]/page.tsx generateStaticParams

```groq

  *[_type == "service" && defined(slug.current)]
  {"slug": slug.current}

```

### `servicesNavQuery`

Used by: frontend/app/layout.tsx (Services nav dropdown injection — INERT on this site: nav label is 'Services and Pricing', injection matches 'Services' exactly; query still runs every request)

```groq

  *[_type == "service" && defined(slug.current)] | order(title asc) {
    _id, title, "slug": slug.current
  }

```

## Dataset snapshot and live usage

| Document | Slug | Live blocks |
|---|---|---|
| service | `grooming` | `heroMinimal`, `spacer`, `featureCards`, `spacer`, `splitContent`, `whatsIncluded`, `ctaStrip`, `policyNotes`, `faqAccordion`, `ctaBanner`, `spacer` |
| page | `homepage` | `hero`, `serviceCards`, `ctaStrip`, `splitContent`, `testimonials`, `statsBar`, `spacer`, `ctaBanner`, `spacer` |
| service | `boarding` | `heroSplit`, `spacer`, `featureCards`, `spacer`, `splitContent`, `spacer`, `pricingCalculator`, `ctaStrip`, `requirementsList`, `processSteps`, `faqAccordion`, `ctaBanner`, `spacer` |
| page | `new-clients` | `spacer`, `processSteps` |
| page | `gallery` | `galleryPage` |
| page | `contact` | `spacer`, `contactForm` |
| service | `daycare` | `heroSplit`, `spacer`, `featureCards`, `spacer`, `pricingCalculator`, `splitContent`, `whatsIncluded`, `ctaStrip`, `processSteps`, `faqAccordion`, `ctaBanner`, `spacer` |
| service | `transportation` | `heroMinimal`, `spacer`, `featureCards`, `pricingList`, `splitContent`, `processSteps`, `ctaStrip`, `faqAccordion`, `ctaBanner`, `spacer` |
| page | `pricing` | `pricingPageTabs` |

Two settings documents exist: `fba58743-9937-4781-b004-ad8ced408efd` (populated) and `siteSettings` (sparse). The query is unordered `*[_type == "settings"][0]`. Evidence: production snapshot; `frontend/sanity/lib/queries.ts:17`.

## Fetch, image, settings, SEO, and sub-site models

- Fetch configuration: {"client":"frontend/sanity/lib/client.ts: createClient({useCdn: true, token: SANITY_API_READ_TOKEN (server-only import, throws if missing), stega: {studioUrl}})","live":"frontend/sanity/lib/live.ts: defineLive({client, serverToken, browserToken}) — ALL page fetches go through sanityFetch (Live Content API, tag-based auto-revalidation); <SanityLive onError={handleError}/> in layout.tsx:238","staticParams":"generateStaticParams uses perspective:'published', stega:false; metadata fetches use stega:false","revalidateRoutes":"NOT FOUND — no /api/revalidate webhook route; revalidation is entirely via next-sanity Live","draftMode":"frontend/app/api/draft-mode/enable/route.ts via defineEnableDraftMode; disable via server action frontend/app/actions.ts; DraftModeToast + VisualEditing in layout when enabled"}. Evidence: `frontend/sanity/lib/client.ts`; `frontend/sanity/lib/live.ts`.
- Image transforms: [{"pattern":"sanity-image <SanityImage baseUrl=`https://cdn.sanity.io/images/${projectId}/${dataset}/` id={_ref} width={N} crop hotspot mode=cover\|contain> — library auto-generates srcset + auto=format. Widths used across components: 24, 28, 42, 80, 120, 128(+height 128), 150, 160, 200, 400, 500, 600, 672, 700, 704, 880, 960, 1000, 1200, 1400","files":["frontend/app/components/SanityImage.tsx (wrapper)","frontend/app/components/PortableText.tsx (672)","frontend/app/components/Cta.tsx (704)","frontend/app/components/Header.tsx / Footer.tsx (logo)","all frontend/app/components/sections/*.tsx incl. HeroMarquee (880/400) and ExpandingCardsRow (1200)"]},{"pattern":"@sanity/image-url builder.image(ref).width(1200).height(627).fit('crop').url() — OG images","files":["frontend/sanity/lib/utils.ts:19-28 resolveOpenGraphImage"]},{"pattern":"@sanity/image-url builder.image(ref).width(1600).auto('format').url() + natural dimensions parsed from _ref regex /-(\\d+)x(\\d+)-/ — lightbox slides (yet-another-react-lightbox)","files":["frontend/sanity/lib/image.ts:16-28","frontend/app/components/sections/GalleryGrid.tsx","GalleryCarousel.tsx","GalleryPage.tsx","GalleryShowcase.tsx"]},{"pattern":"raw asset URL via GROQ favicon.asset->url (no transforms) — the only asset dereference in queries","files":["frontend/sanity/lib/queries.ts:49","frontend/app/layout.tsx:121-126 (favicon unset live; frontend/app/icon.svg is the actual favicon)"]},{"pattern":"BUG (LIVE on this site): raw asset._ref string emitted as Organization JSON-LD logo — settings.logo IS set here (image-7cce0a50...-289x174-png) so the malformed value ships on every page","files":["frontend/app/layout.tsx:184-186 (also latent variant at 84-89, gated behind unset ogImage)"]}]. Evidence: `frontend/sanity/lib/image.ts`; `frontend/sanity/lib/utils.ts`; `frontend/app/components/SanityImage.tsx`.
- Settings: {"typeName":"settings","documentId":"UNCERTAIN / duplicated: fba58743-9937-4781-b004-ad8ced408efd and siteSettings both exist; frontend query is unordered by _type.","file":"studio/src/schemaTypes/singletons/settings.tsx","fields":[{"name":"title","title":"Title","type":"string","required":true,"validation":"rule.required()","initialValue":"Kingdom Canine","consumedBy":["frontend/app/layout.tsx (title template, Organization/WebSite JSON-LD)"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: yes. Evidence: read-only production snapshot."},{"name":"tagline","title":"Tagline","type":"string","consumedBy":[],"unused":true,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"description","title":"Description","type":"array (block, styles/lists/decorators empty, custom link annotation)","consumedBy":["frontend/app/layout.tsx meta description via toPlainText"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"logo","title":"Logo","type":"image","notes":"Schema-defined. Populated on primary UUID settings doc: no; populated on siteSettings doc: yes. Evidence: read-only production snapshot.","consumedBy":["frontend/app/components/Header.tsx","Footer.tsx (160)","layout.tsx Organization JSON-LD (as raw _ref — live bug)"],"unused":false},{"name":"navItems","title":"Navigation Items","type":"array","of":["navItem: {label: string required, link: link (hidden when children non-empty), children: array of {label: string, link: link}}"],"consumedBy":["frontend/app/layout.tsx:148-160 ('Services' label injection — inert here)","frontend/app/components/Header.tsx"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"ctaButton","title":"Header CTA Button","type":"button","consumedBy":["Header.tsx"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: yes. Evidence: read-only production snapshot."},{"name":"footerSticker","title":"Footer Sticker","type":"image","notes":"Schema-defined. Populated on primary UUID settings doc: no; populated on siteSettings doc: no. Evidence: read-only production snapshot.","consumedBy":["Footer.tsx (80)"],"unused":false},{"name":"footerTagline","title":"Footer Tagline","type":"text","consumedBy":["Footer.tsx via layout"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"footerColumns","title":"Footer Columns","type":"array","of":["inline {title: string, links: array of {label: string, link: link}}"],"consumedBy":["Footer.tsx"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"contactInfo","title":"Contact Information","type":"object {address: text, phone: string, email: string}","consumedBy":["Footer.tsx"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"footerText","title":"Footer Copyright Text","type":"string","consumedBy":["Footer.tsx"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"footerTextLink","title":"Footer Copyright Link","type":"object {label: string, href: url}","consumedBy":["Footer.tsx"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"footerBottomLinks","title":"Footer Bottom Links","type":"array","of":["inline {label: string, link: link}"],"consumedBy":["Footer.tsx"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: no; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"yearEstablished","title":"Year Established","type":"number","consumedBy":[],"unused":true,"notes":"Schema-defined. Populated on primary UUID settings doc: no; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"socialLinks","title":"Social Links","type":"object {facebook: url, instagram: url, google: url}","consumedBy":["Footer.tsx","layout.tsx JSON-LD sameAs"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"ogImage","title":"Open Graph Image","type":"image","hotspot":true,"notes":"Schema-defined. Populated on primary UUID settings doc: no; populated on siteSettings doc: no. Evidence: read-only production snapshot.","consumedBy":["layout.tsx resolveOpenGraphImage + metadataBase + JSON-LD urls"],"unused":false},{"name":"favicon","title":"Favicon","type":"image","consumedBy":["layout.tsx icons via faviconUrl deref"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: no; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"ga4MeasurementId","title":"GA4 Measurement ID","type":"string","validation":"Rule.warning().custom regex ^G-[A-Z0-9]+$","consumedBy":["layout.tsx (gtag fallback when no GTM)"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: no; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"gtmContainerId","title":"GTM Container ID","type":"string","validation":"Rule.warning().custom regex ^GTM-[A-Z0-9]+$","consumedBy":["layout.tsx @next/third-parties GoogleTagManager (rendered in <body>, drift vs hound-3 which renders it in <head>) + noscript iframe"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"googleSiteVerification","title":"Google Site Verification","type":"string","consumedBy":["layout.tsx metadata verification.google"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: no; populated on siteSettings doc: no. Evidence: read-only production snapshot."},{"name":"localBusiness","title":"Local Business (Structured Data)","type":"object","of":["businessName: string; businessType: string (init 'LocalBusiness'); address: object {street, city, state, zip, country (init 'US')}; phone: string; geoCoordinates: object {latitude: number, longitude: number}; businessHours: array of {days: string, open: string, close: string}; priceRange: string"],"consumedBy":["layout.tsx buildLocalBusinessJsonLd"],"unused":false,"notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: yes. Evidence: read-only production snapshot."},{"name":"posUrls","type":"object","notes":"Schema-defined. Populated on primary UUID settings doc: yes; populated on siteSettings doc: no. Evidence: read-only production snapshot.","title":"POS & Booking URLs","consumedBy":["frontend/app/layout.tsx via settingsQuery and shell consumers"],"unused":false}],"hardcodedValuesThatBelongHere":[{"value_description":"Kingdom Canine phone is hardcoded in header desktop/mobile and calculator notice.","file":"frontend/app/components/Header.tsx:268,464; frontend/app/components/pricing/CalculatorInputs.tsx:205"},{"value_description":"Production domain is hardcoded for metadata, robots and sitemap.","file":"frontend/app/layout.tsx:34; frontend/app/robots.ts:10; frontend/app/sitemap.ts"},{"value_description":"Calculator prices are code data rather than CMS settings.","file":"frontend/app/data/pricingData.ts"}]}. Evidence: `studio/src/schemaTypes/singletons/settings.tsx`; `frontend/sanity/lib/queries.ts:17-53`; `frontend/app/layout.tsx:94-242`.
- SEO: {"description":"Shared seo object on page and service: metaTitle, metaDescription, ogImage, noIndex. Root defaults come from settings. Route metadata and sitemap behavior are source-defined.","fallbackChain":["page title: seo.metaTitle → page.name → layout template using settings.title","service title: seo.metaTitle → service.title → layout template","service description: seo.metaDescription → service.heading → service.shortDescription","page description: seo.metaDescription; root default: toPlainText(settings.description)","OG image: route seo.ogImage; root settings.ogImage; transformed by resolveOpenGraphImage","robots/sitemap: seo.noIndex"]}. Evidence: `studio/src/schemaTypes/objects/seo.ts`; route `generateMetadata` functions.
- Sub-site: null. Evidence: registered schema and route inventory; no sub-site type or resolver found.

## Risk register

| Severity | Risk | Evidence |
|---|---|---|
| high | Two settings documents plus nondeterministic [0] selection can cause the shared shell to render either a sparse or populated singleton. | production dataset IDs fba58743-9937-4781-b004-ad8ced408efd and siteSettings; frontend/sanity/lib/queries.ts:17 |
| low | Cross-contamination sweep hit: # Home Away From Home — Fargo | README.md:1 |
| low | Cross-contamination sweep hit: Website for **Home Away From Home**, a pet daycare, boarding, and grooming facility in Fargo, ND. Part of the [Embark Pet Services](https://www.embarkpetservices.com/) portfolio. | README.md:3 |
| low | Cross-contamination sweep hit: **Live domain:** https://homeawayfargo.com/ | README.md:5 |
| low | Cross-contamination sweep hit: Website for Kingdom Canine, a pet daycare, boarding, grooming, and transportation facility in Pacific, MO. Part of the [Embark Pet Services](https://www.embarkpetservices.com/) portfolio operated by Cadence Private Capital. | CLAUDE.md:3 |
| low | Cross-contamination sweep hit: **Sister sites (design reference):** https://homeawayfargo.com/ · https://houndaroundresort.com/ · https://www.boxersbedandbiscuits.com/ | CLAUDE.md:7 |
| low | Cross-contamination sweep hit: - **Phone:** (314) 631-6738 | context/intake-content.md:11 |
| low | Cross-contamination sweep hit: - Strip all Home Away From Home-specific content, images, and references from the cloned codebase | context/milestones.md:17 |
| low | Cross-contamination sweep hit: - HAFH phone number replaced with KC phone (314-631-6738) in pricing calculators | context/milestones.md:24 |
| low | Cross-contamination sweep hit: Website for Kingdom Canine, a pet daycare, boarding, grooming, and transportation facility in Pacific, MO. Part of the [Embark Pet Services](https://www.embarkpetservices.com/) portfolio operated by Cadence Private Capital. | AGENTS.md:3 |
| low | Cross-contamination sweep hit: **Sister sites (design reference):** https://homeawayfargo.com/ · https://houndaroundresort.com/ · https://www.boxersbedandbiscuits.com/ | AGENTS.md:7 |
| low | Cross-contamination sweep hit: - If a component exists from the Hound Around codebase, modify it — don't rewrite from scratch unless structurally necessary | context/ai-interaction.md:10 |
| low | Cross-contamination sweep hit: - Chore: `chore/[name]` (e.g., `chore/remove-hound-around-refs`) | context/ai-interaction.md:36 |
| low | Cross-contamination sweep hit: This repo was cloned from the Hound Around Resort codebase (`mhlauf1/hound-3`) with a clean git history. It is its own independent repo (`mhlauf1/home-away-fargo`), not a GitHub fork. Follow these rules strictly: | context/ai-interaction.md:49 |
| low | Cross-contamination sweep hit: - Add new components alongside existing ones when HAFH needs something Hound Around doesn't have | context/ai-interaction.md:54 |
| low | Cross-contamination sweep hit: - Leave any Hound Around-specific content (copy, images, alt text, meta tags, comments, URLs) | context/ai-interaction.md:59 |
| low | Cross-contamination sweep hit: - Rename files/components without a clear reason — the Hound Around naming conventions are the standard | context/ai-interaction.md:61 |
| low | Cross-contamination sweep hit: ### When you find HAFH or Hound Around content | context/ai-interaction.md:64 |
| low | Cross-contamination sweep hit: - Never leave an HAFH or Hound Around reference as a placeholder — always swap to either real KC content or an explicit `[PLACEHOLDER]` marker | context/ai-interaction.md:67 |
| low | Cross-contamination sweep hit: - If a Hound Around pattern doesn't make sense for HAFH, explain why before changing it | context/ai-interaction.md:87 |
| low | Cross-contamination sweep hit: - Preserve existing patterns from the Hound Around codebase | context/ai-interaction.md:94 |
| low | Cross-contamination sweep hit: Kingdom Canine is one of ~10 facilities in the **Embark Pet Services** portfolio, a pet care roll-up platform operated by **Cadence Private Capital**. Lauf Studio (lauf.co) owns the design system, tech stack, and infrastructure for all Embark portfolio websites. | context/project-overview.md:7 |
| low | Cross-contamination sweep hit: **This repo was cloned from the Home Away From Home codebase** (`mhlauf1/home-away-fargo` on GitHub), the most recent Embark site build. The git history was wiped for a clean start — this is its own repo (`mhlauf1/kingdom-canine`), not a GitHub fork. | context/project-overview.md:11 |
| low | Cross-contamination sweep hit: git clone --depth 1 https://github.com/mhlauf1/home-away-fargo.git kingdom-canine | context/project-overview.md:16 |
| low | Cross-contamination sweep hit: git commit -m "Initial commit from Home Away From Home design system" | context/project-overview.md:21 |
| low | Cross-contamination sweep hit: - The component library, page structures, layout patterns, and Sanity integration patterns all originated from the Hound Around / Home Away builds | context/project-overview.md:27 |
| low | Cross-contamination sweep hit: - **Never reference Home Away From Home or Hound Around in user-facing content.** No leftover copy, image alt text, meta tags, or comments mentioning HAFH, Fargo, Hound Around, Cottage Grove, or any other facility-specific details | context/project-overview.md:33 |
| low | Cross-contamination sweep hit: - **Hound Around Resort** (houndaroundresort.com) — Live, design system origin | context/project-overview.md:42 |
| low | Cross-contamination sweep hit: - **Boxers Bed & Biscuits** (boxersbedandbiscuits.com) — Live | context/project-overview.md:43 |
| low | Cross-contamination sweep hit: - **Home Away From Home** (homeawayfargo.com) — Live, this repo's clone source | context/project-overview.md:44 |
| low | Cross-contamination sweep hit: - **Wags Stay N Play** (Moorhead, MN) — In queue | context/project-overview.md:46 |
| low | Cross-contamination sweep hit: - **Canine Country Club** (West Des Moines, IA) — Migration only, no rebuild | context/project-overview.md:47 |
| low | Cross-contamination sweep hit: - **Barks & Rec** (Hastings, MN) — Future | context/project-overview.md:48 |
| low | Cross-contamination sweep hit: - **Rio Grooming School & Salon** — Future | context/project-overview.md:49 |
| low | Cross-contamination sweep hit: - **Phone:** (314) 631-6738 | context/project-overview.md:148 |
| low | Cross-contamination sweep hit: - No HAFH or Hound Around references in any user-facing content, meta tags, alt text, or comments | context/coding-standards.md:153 |
| low | Cross-contamination sweep hit: "description": "e.g. \"© 2026 Kingdom Canine. Part of the Embark Pet Services family.\"", | studio/dist/static/478684dd.create-schema.json:644 |
| low | Cross-contamination sweep hit: "description": "Optional link embedded in the copyright text (e.g. \"Embark Pet Services\")", | studio/dist/static/478684dd.create-schema.json:650 |
| low | Cross-contamination sweep hit: description: 'e.g. "© 2026 Kingdom Canine. Part of the Embark Pet Services family."', | studio/src/schemaTypes/singletons/settings.tsx:219 |
| low | Cross-contamination sweep hit: description: 'Optional link embedded in the copyright text (e.g. "Embark Pet Services")', | studio/src/schemaTypes/singletons/settings.tsx:225 |
| low | Cross-contamination sweep hit: "description": "e.g. \"© 2026 Kingdom Canine. Part of the Embark Pet Services family.\"", | studio/dist/static/a4a201b3.create-schema.json:644 |
| low | Cross-contamination sweep hit: "description": "Optional link embedded in the copyright text (e.g. \"Embark Pet Services\")", | studio/dist/static/a4a201b3.create-schema.json:650 |
| low | Cross-contamination sweep hit: "description": "e.g. \"© 2026 Kingdom Canine. Part of the Embark Pet Services family.\"", | studio/dist/static/b94d65e6.create-schema.json:644 |
| low | Cross-contamination sweep hit: "description": "Optional link embedded in the copyright text (e.g. \"Embark Pet Services\")", | studio/dist/static/b94d65e6.create-schema.json:650 |
| low | Cross-contamination sweep hit: "description": "e.g. \"© 2026 Kingdom Canine. Part of the Embark Pet Services family.\"", | studio/dist/static/764cc546.create-schema.json:644 |
| low | Cross-contamination sweep hit: "description": "Optional link embedded in the copyright text (e.g. \"Embark Pet Services\")", | studio/dist/static/764cc546.create-schema.json:650 |
| medium | Cross-contamination sweep hit: (314) 631-6738 | frontend/app/components/pricing/CalculatorInputs.tsx:205 |
| low | Cross-contamination sweep hit: "description": "e.g. \"© 2026 Kingdom Canine. Part of the Embark Pet Services family.\"", | studio/dist/static/c1be53a4.create-schema.json:644 |
| low | Cross-contamination sweep hit: "description": "Optional link embedded in the copyright text (e.g. \"Embark Pet Services\")", | studio/dist/static/c1be53a4.create-schema.json:650 |
| low | Cross-contamination sweep hit: "description": "e.g. \"© 2026 Kingdom Canine. Part of the Embark Pet Services family.\"", | studio/dist/static/dcb5ba16.create-schema.json:644 |
| low | Cross-contamination sweep hit: "description": "Optional link embedded in the copyright text (e.g. \"Embark Pet Services\")", | studio/dist/static/dcb5ba16.create-schema.json:650 |
| medium | Cross-contamination sweep hit: (314) 631-6738 | frontend/app/components/Header.tsx:268 |
| medium | Cross-contamination sweep hit: (314) 631-6738 | frontend/app/components/Header.tsx:464 |
| high | Cross-contamination sweep hit: alt={heroLogo.alt \|\| 'Boxers Bed & Biscuits'} | frontend/app/components/sections/HeroMarquee.tsx:92 |
| high | Cross-contamination sweep hit: alt={img.alt \|\| 'Boxers facility'} | frontend/app/components/sections/HeroMarquee.tsx:260 |
| low | Live CMS footer contains Embark Pet Services brand/link; intentional portfolio attribution but included because sweep requires every hit. | production dataset settings fba58743-9937-4781-b004-ad8ced408efd footerText/footerTextLink |

## NOT FOUND / uncertainty

- Requested local reference files under `cms-audit/reference/`: **NOT FOUND**. Completed parent and ancestor inventories were used from their resolved checkouts.
- A deterministic guarantee of which settings document Sanity returns for an unordered `[0]`: **NOT FOUND**.
- Dataset drafts: none were returned by the authenticated default perspective; draft-specific historical content outside that perspective is **UNCERTAIN**.
