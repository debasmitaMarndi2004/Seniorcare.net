# Supabase integration — SeniorCare

## Status
The Next.js code is prepared, **not yet attached to a dedicated Supabase project**. Existing user projects belong to other applications and must not be reused without explicit confirmation.

## Setup
1. Create a **dedicated** `seniorcare-production` Supabase project in the correct organization and region.
2. Review and apply `supabase/schema.sql` using a tracked Supabase migration.
3. In Vercel → Project → Settings → Environment Variables, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Add the same values to `.env.local` for local development.
4. The Resources page displays the latest six *published* articles when Supabase is configured; otherwise the static demo continues to work.
5. Manage article content from the Supabase dashboard. New rows default to unpublished. Do not add policies that allow anonymous writes.

## Security
- Never add `service_role` or `sb_secret_...` keys to frontend code, environment variables prefixed `NEXT_PUBLIC_`, or GitHub.
- RLS permits public **reads of published articles only**, no public writes.
- Contact forms remain disabled until privacy consent, spam protection, secure server-side submission and storage are designed and reviewed.
- This is a content CMS preparation, **not** a HIPAA-compliant medical record system.

## Verification after provisioning
Run `select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename = 'articles';`, verify anon cannot write and cannot read unpublished drafts, add a test published article, then confirm it appears on `/resources`.
