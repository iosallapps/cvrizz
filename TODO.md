# CV Builder - Todo List

## ✅ Completat

### Editor UX
- [x] Work Experience - Add/Edit/Remove cu dialog + Zod validation
- [x] Education - Add/Edit/Remove cu dialog + Zod validation
- [x] Skills - Add/Edit/Remove cu quick-add și dialog
- [x] Personal Info section functional
- [x] Live preview cu template rendering
- [x] Auto-save cu status indicator
- [x] Template selector

### Security & Production Fixes
- [x] Open redirect vulnerability fix în auth/callback
- [x] Resume ownership validation în stripe/checkout
- [x] Webhook error handling cu retry logic
- [x] Trial enforcement în middleware
- [x] Server actions pentru resume CRUD
- [x] React Query setup pentru data fetching

### UI/UX
- [x] Button text color fix (outline, ghost variants)
- [x] Dialog text-foreground fix
- [x] Design tokens în globals.css
- [x] Semantic icon colors
- [x] Form validation cu Zod + error messages inline
- [x] Dark/Light mode toggle cu Lucide icons

---

## 🔄 De Făcut Local

### ~~Mobile Responsive~~ ✅
- [x] Editor layout pe mobile (single column)
- [x] Touch-friendly buttons (min 44px)
- [x] Mobile navigation improvements
- [x] Preview panel toggle pe mobile (floating button + fullscreen modal)

### ~~Loading States~~ ✅
- [x] Skeleton loaders pentru dashboard stat cards
- [x] Skeleton loaders pentru resume cards
- [x] Skeleton loaders pentru settings profile
- [x] Loading states în editor (existing)

### ~~Error Boundaries~~ ✅
- [x] Global error boundary component (app/error.tsx)
- [x] Section-level error boundaries (components/shared/ErrorBoundary.tsx)
- [x] Dashboard error boundary (app/(app)/dashboard/error.tsx)
- [x] Editor error boundary (app/(app)/editor/[id]/error.tsx)
- [x] Retry mechanisms cu RetryableSection component

---

## 🚀 Necesită Deployment / Servicii Externe

### Stripe Integration (necesită chei live)
- [ ] Test checkout flow complet
- [ ] Webhook endpoint verificat
- [ ] Customer portal functional

### ~~PDF Export~~ ✅
- [x] Client-side PDF export with jsPDF + html2canvas
- [x] PDF generation (no server needed)
- [x] Download button functional

### AI Features (necesită OpenAI key)
- [ ] Generate bullet points pentru work experience
- [ ] Generate professional summary
- [ ] AI credits tracking

### Email (necesită Resend)
- [ ] Welcome email
- [ ] Trial expiration reminder
- [ ] Payment confirmation

---

## 📋 Nice to Have (Post-MVP)

- [x] Drag & drop reorder pentru sections (@dnd-kit - Work, Education, Skills)
- [x] Multiple templates (30 templates în 6 categorii)
- [x] Export to Word (.docx) - docx library
- [x] Public resume links (/r/[slug] routes, ShareDialog in editor)
- [ ] Resume analytics
- [x] i18n - Romanian language support complet (327+ keys, localStorage persistence, auto-detect country)

---

## 🐛 Known Issues

- [ ] Port 3000 sometimes occupied (use 3001)
- [ ] Middleware deprecation warning (use proxy instead)

---

*Last updated: 2026-02-04*
