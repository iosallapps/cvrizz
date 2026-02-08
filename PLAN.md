# CV Rizz — Launch Fix Plan

## PHASE 1: App-Breaking Bugs (Must Fix First)

### 1.1 Fix user creation at signup ⚠️ CRITICAL
- **Bug**: Signing up creates a Supabase Auth user but does NOT create a row in Prisma `users` table
- **Impact**: Trial enforcement fails (middleware queries `users` table), dashboard shows no data, billing breaks
- **Currently**: Prisma user only gets created at first Stripe checkout (`app/api/stripe/checkout/route.ts:32-39`)
- **Fix**: Add a Supabase Auth trigger OR a `POST /api/auth/callback` route that creates the Prisma user immediately on signup with `trialEndsAt = now + 14 days`

### 1.2 Set `NEXT_PUBLIC_APP_URL` on Vercel
- Currently `http://localhost:3000` in `.env.local`
- Must be `https://www.cvrizz.com` on Vercel
- Breaks: Stripe redirect URLs, auth callbacks, portal return URLs
- **Action**: Set env var in Vercel Dashboard → Settings → Environment Variables

### 1.3 Delete `node_modules 2`
- 626MB duplicate directory causing local Turbopack hangs
- `rm -rf "node_modules 2"`

---

## PHASE 2: Broken Pages & Links

### 2.1 Forgot password flow (2 pages)
- `/forgot-password` — email input → `supabase.auth.resetPasswordForEmail()` → "check your email" message
- `/reset-password` — landing page from email link → `supabase.auth.updateUser({ password })` → redirect to login
- Login page already links to `/forgot-password` (currently 404)

### 2.2 Fix `/editor/new` entry point
- Dashboard "Create Resume" button → must create resume in DB → redirect to `/editor/[newId]`
- Verify this flow works or fix it

### 2.3 Create `/resumes` page
- Dashboard "View all" link exists but page doesn't → 404
- Simple list of user's resumes with edit/delete actions

---

## PHASE 3: Settings Page Backend

### 3.1 Profile name update
- Form exists, no backend → wire to `prisma.user.update()`

### 3.2 Change password
- Form exists, no backend → `supabase.auth.updateUser({ password })`

### 3.3 Delete account
- Button exists, no backend → confirmation modal + cascade delete (Supabase Auth user + Prisma user + resumes)

---

## PHASE 4: SEO & Polish

### 4.1 `robots.txt`
- Allow: `/`, `/terms`, `/privacy`, `/r/*`
- Block: `/dashboard`, `/editor`, `/settings`, `/billing`, `/api`

### 4.2 `sitemap.xml`
- Static pages + public resume URLs

### 4.3 OpenGraph metadata
- Landing page: title, description, og:image for social sharing

---

## PHASE 5: Go Live

### 5.1 Stripe live mode
- Replace test keys with live keys on Vercel
- Create live webhook endpoint + update webhook secret
- Recreate price IDs in live mode
- Update Stripe Customer Portal: set Terms URL (`https://cvrizz.com/terms`), Privacy URL (`https://cvrizz.com/privacy`), enable plan switching

### 5.2 AI features
- `OPENAI_API_KEY` is empty — add key, verify generation endpoints work
- Core selling point, must work before marketing

### 5.3 Email (optional)
- Set up Resend for transactional emails (password reset, welcome, receipts)
- Can launch without this — Supabase sends basic auth emails

---

## NOT DOING (Post-Launch)
- Rate limiting (Upstash Redis) — add when traffic warrants it
- Error monitoring (Sentry)
- Unit/E2E tests
- Resume analytics, LinkedIn import, custom domains
