# Current Milestone

## Milestone 5.1: Contact Form Hardening

### Status

Implementation complete and locally verified on `fix/contact-form-hardening`; ready for the review and delivery workflow.

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
