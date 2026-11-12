# SeniorCare verification status

## Completed in this environment
- Extracted original HTML/CSS and six WebP assets are present in this package.
- Static HTML audit: **PASS** for five pages (no duplicate IDs, missing internal anchor targets, missing image files, or mismatched image dimensions).
- Confirmed six original homepage images retain intrinsic dimensions and are transformed into `next/image` components by `components/OriginalPage.tsx`.

## Not completed (do not represent as passing)
- `npm install`: **blocked by package-registry network timeout**.
- `npm run typecheck` and `npm run build`: **not run**, since dependencies could not be installed.
- Browser screenshots and pixel-by-pixel comparison: **not run**. A Playwright script is supplied in `scripts/visual-check.mjs` for 30 viewport/page combinations.
- Lighthouse, axe accessibility, live form submission, and Vercel deployment: **not run**.

## Run locally / in CI

```bash
npm install
npm run static-audit
npm run typecheck
npm run build
npm run dev
# In another terminal:
npm install -D playwright
npx playwright install chromium
mkdir -p screenshots
node scripts/visual-check.mjs
```

**GitHub Actions** will execute typecheck/build once this ZIP is pushed to GitHub. It requires a committed `package-lock.json` to use `npm ci`; run `npm install` and commit the lockfile before enabling CI.

## Important launch blockers
- The source HTML contains marketing metrics and phone numbers that must be validated with the client.
- Cloudflare Turnstile and server-only Supabase credentials must be set in Vercel before accepting inquiries.
- Privacy-policy links in the supplied HTML currently lead to page anchors rather than a reviewed privacy policy.
- Contact API needs production rate limiting and privacy/retention review.
