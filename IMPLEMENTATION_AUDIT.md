# SeniorCare implementation audit — 2026-11-12

## Implemented and verified
- Dedicated Supabase database: `orozvfjicwkpjkptnhsw`.
- Contact inquiry table has RLS enabled and no public policies. Verified `anon INSERT = false`, `authenticated SELECT = false`.
- Supabase security advisor returned informational `rls_enabled_no_policy` for contact inquiries. This is intentional: only a server-side secret-key client may insert.
- Contact API: Zod validation, consent requirement, honeypot, origin validation, Cloudflare Turnstile server verification, restricted body size, server-side database insertion.
- Contact form displays explicit errors and success states; no simulated successful submissions.
- Sitemap and robots metadata routes. Demo remains noindex to prevent indexing unfinished medical-adjacent content.

## Still outstanding (do not call production-ready)
- **Pixel-perfect migration** of the five supplied HTML mockups has NOT been completed. The current pages are a simplified redesign.
- **Images:** original homepage embeds six WebP images as data URIs. They still need to be extracted into approved static assets, committed, and rendered with `next/image` with explicit sizing and appropriate priority.
- **Responsive QA:** mobile (320, 375, 430px), tablet (768px), desktop (1024, 1440px) browser screenshots and comparison against the originals have NOT been run.
- **Accessibility:** keyboard navigation, modal focus management, form screen-reader review, contrast checks, axe scan pending.
- **Performance:** Lighthouse, Core Web Vitals, and bundle analysis pending.
- **Production build:** `npm install && npm run typecheck && npm run build` have NOT been executed in an environment with npm registry access.
- **Operational setup:** Vercel environment variables `SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` must be configured before form use.
- **Anti-abuse:** add persistent rate limiting/WAF rules for public contact endpoint before public launch.
- **Privacy:** privacy notice, retention period, deletion procedure, recipient notification and access controls must be agreed with the client. Do not request or store patient medical data through this form.
- **Content review:** validate all medical claims, care costs, endorsements, contact details and image rights with the client.

## Deployment check
```bash
npm ci
npm run typecheck
npm run build
```
Ensure no missing environment variables and test successful/failed Turnstile flows on the deployed domain.
