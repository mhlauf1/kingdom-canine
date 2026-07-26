# Current Milestone

## Milestone 5.1: Contact Form Hardening

### Status

Complete — PR #6 merged into `main` as `59c375c` and Production deployment `9KXFS2tYhnqJNWR4dXQ1t5EP4APy` is verified read-only.

### Scope

- Preserve the published contact contract: required `name`, `email`, and `message`; optional `phone` and `service`
- Restrict `service` to Daycare, Boarding, Grooming, or Transportation
- Add strict server-side validation, field limits, JSON-only parsing, and a 32 KiB request limit
- Add a hidden honeypot without changing the visible form
- Restrict client and email rendering to the supported fields
- Format US phone input while accepting pasted `+1` country codes
- Validate the reCAPTCHA v3 action and exact Production/Preview hostname
- Fail closed when reCAPTCHA is missing in Production; retry bounded verification failures and preserve legitimate leads when Google is temporarily unavailable
- Preserve `info@kingdomcanine.com`, the configured IMPACT BCC, and `/thank-you`
- Add focused non-delivery tests and run lint, type-check, and build before any commit

### Safety constraint

Do not submit the form or send email during implementation and verification. Live facility delivery, IMPACT BCC, and thank-you navigation remain deferred to the coordinated portfolio acceptance window.

### Local verification

- 10 focused non-delivery contact tests pass
- Focused ESLint passes
- TypeScript passes
- Production build passes
- `git diff --check` passes
- Repository-wide lint remains blocked by 106 pre-existing errors and 9 warnings outside this patch
- No form was submitted and no email was sent

### Delivery verification

- Vercel Preview and Production deployments completed successfully
- Preview and Production render the hidden honeypot, expected required fields, length limits, and Kingdom service choices
- Pasting `+1 (314) 631-6738` formats safely to `(314) 631-6738`
- Production reCAPTCHA renders normally; Preview remains blocked by the existing Google key's domain registration
- Preview Sanity Live remains blocked by its existing CORS configuration
- Production `/thank-you` has the correct canonical URL, `noindex, follow`, and fallback phone
- Production browser logs are clean
- Live recipient delivery, IMPACT BCC receipt, and successful-submission navigation remain deferred to the coordinated portfolio acceptance window

## Milestone 5: Post-Launch Polish

### Status

In progress — **the site is LAUNCHED** and live at https://www.kingdomcanine.com/ (has been for months as of July 2026; the DNS cutover items below are done). Remaining goals are post-launch polish.

### Added in this milestone

- Contact form thank-you page (client request, following the wags-stay-n-play pilot): new Sanity page at `/thank-you` (heroMinimal + ctaBanner, noIndex so it's excluded from search + sitemap), Sanity ID `9fa81fda-cf4c-49c2-a8ad-86711bae2f27`. ContactForm now redirects via `router.push('/thank-you')` on successful submit instead of showing the inline success card — the client-side navigation fires the existing `virtual_page_view` GTM/CTM event, making submissions trackable as conversions. The `successMessage` field remains in the schema but is no longer rendered.
- Contact form spam protection and validation: Google reCAPTCHA v3 plus strict Zod validation, a hidden honeypot, a 32 KiB streaming JSON limit, supported-field allowlisting, field limits, paste-safe phone formatting, exact action/hostname validation, and two bounded 3-second verification attempts. Missing Production reCAPTCHA configuration fails closed; a genuine Google outage may deliver only after bounded retries and is visibly flagged in the notification. Env vars: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` in Preview and Production.
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
