# Current Milestone

## Milestone 5: Post-Launch Polish

### Status

In progress — **the site is LAUNCHED** and live at https://www.kingdomcanine.com/ (has been for months as of July 2026; the DNS cutover items below are done). Remaining goals are post-launch polish.

### Added in this milestone

- Contact form thank-you page (client request, following the wags-stay-n-play pilot): new Sanity page at `/thank-you` (heroMinimal + ctaBanner, noIndex so it's excluded from search + sitemap), Sanity ID `9fa81fda-cf4c-49c2-a8ad-86711bae2f27`. ContactForm now redirects via `router.push('/thank-you')` on successful submit instead of showing the inline success card — the client-side navigation fires the existing `virtual_page_view` GTM/CTM event, making submissions trackable as conversions. The `successMessage` field remains in the schema but is no longer rendered.
- Contact form spam protection: Google reCAPTCHA v3 (invisible), same implementation as wags-stay-n-play. ContactForm loads the script on mount and sends a `recaptchaToken` with submissions; `/api/contact` verifies it against Google (min score 0.5) before sending email. No new npm deps. Fails open if `RECAPTCHA_SECRET_KEY` is unset or Google is unreachable, so misconfiguration never drops real leads. Env vars: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` — added in `.env.local` and Vercel (Preview + Production); secret key validated against Google siteverify.
- Analytics audit (July 2026): GTM (`GTM-PB7HP55C`) and CTM (`602201`) load from the `siteSettings` singleton in the root layout — verified present in the served HTML of every live page. Interior-page tracking on client-side navigation requires Impact Marketing to add a Custom Event trigger for `virtual_page_view` in their GTM container (our side already pushes it via `TrackingRouteEvents`).

### Goals

- SEO optimization (meta tags, structured data, sitemap.xml, robots.txt)
- Performance audit - Lighthouse 90+ all categories
- Accessibility audit (WCAG AA compliance)
- Cross-browser testin
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
