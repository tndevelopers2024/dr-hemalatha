# TechieNutpam Web Development Standards Checklist — `dr-hemalatha`

> Project copy per Section 1 of the TechieNutpam Web Development Standards Checklist.
> Status legend: `[x]` Done in code · `[ ]` Pending client / hosting / team action · `N/A` Not applicable (with 1-line reason).

---

## 2. Project setup, repo and environment
- [x] Project created in the company Git account (`tndevelopers2024/dr-hemalatha`).
- [ ] Repo name confirmed against `client-project-type` convention (`dr-hemalatha` — confirm with Tech Lead if rename is desired).
- [x] `README.md` complete (purpose, stack, local run, deploy instructions, pre-launch steps, owner).
- [x] `.gitignore` in place (`output/`, OS files, logs).
- N/A — `.env.example`, Node/PHP version pinning, package lock file: pure static HTML/CSS/JS site with no runtime, build tool, or server-side env vars per manager requirement.
- [x] No API keys, passwords, or secrets committed in code or Git.
- [ ] Branching (`main` = production, `develop` = staging, `feature/*`, `fix/*`) & PR review rules configured in GitHub settings.
- [ ] Separate staging (password-protected + `noindex`) and production hosting environments provisioned.
- [ ] Domain, hosting, DNS, email and third-party credentials stored in company password manager.

## 3. Branding, favicon and basics
- [x] Full favicon set added: `favicon.ico` (32×32 + 16×16), `favicon.svg`, `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png`.
- [x] `site.webmanifest` added with name, short_name, theme colour and icons.
- [x] `<meta name="theme-color" content="#b2386f">` set.
- [x] SVG logos (`logo.svg`, `logo-light.svg`) link to `/` with descriptive `alt` text.
- [x] Brand colours, typography and spacing match approved design.
- [x] Maximum 2 Google Font families loaded (`Young Serif`, `Figtree`) with `display=swap`.
- [x] `<html lang="en">` set on every page.
- [x] Copyright line in footer auto-generates current year via JS (`data-year`) with business name.
- [ ] Real contact details (phone, email, address, WhatsApp) supplied by client and linked (`tel:`, `mailto:`, `wa.me`).
- [x] Social media icon links to client's Instagram in a new tab with `rel="noopener noreferrer"`.
- [x] Custom `404.html` matching site design and linking back to home/key pages.
- [ ] Client confirmation for "Designed & developed by TechieNutpam" footer credit.

## 4. SEO: titles, meta tags, sitemap and schema
- [x] Unique `<title>` (50–60 chars) on every page.
- [x] Unique `<meta name="description">` (140–160 chars) on every page.
- [x] `<meta charset="UTF-8">` and viewport meta on every page.
- [x] `<link rel="canonical">` set on every page (update domain from `example.com` before launch).
- [x] Exactly one `<h1>` per page; strict `H1 → H2 → H3 → H4` hierarchy verified across all 21 pages.
- [x] Clean, lowercase, hyphenated URLs for all 20 pages (`/about/`, `/pregnancy-care/`, `/laparoscopy/`, etc.).
- [x] Descriptive alt text and meaningful filenames (`dr-hemalatha-pugalendhi-obgyn.webp`, `dr-hemalatha-og-share.png`).
- [x] Internal links verified with zero broken links.
- [x] Open Graph (`og:title`, `og:description`, `og:image` 1200×630, `og:url`, `og:type`, `og:site_name`) + Twitter Card (`summary_large_image`) on every page.
- [ ] WhatsApp and LinkedIn live link previews tested after deploying to public domain.
- [x] `sitemap.xml` present with all 20 live indexable pages (update domain before launch).
- [x] `robots.txt` present (currently `Disallow: /` for staging; switch to `Allow: /` + `Sitemap:` at launch).
- [ ] Remove `noindex` meta tag and `.draft` banner on production launch.
- [x] JSON-LD schema (`MedicalClinic`, `Physician`, `BreadcrumbList`, `FAQPage`, `WebPage`) on every page.
- [ ] Validate live JSON-LD with Google Rich Results Test.
- [ ] HTTP→HTTPS & www/non-www 301 redirects configured on live host (Apache template ready in `.htaccess`).
- [ ] Old-site 301 redirect map (confirm if replacing an existing domain, else mark N/A).
- [ ] Submit site & sitemap to Google Search Console and Bing Webmaster Tools; link Google Business Profile.

## 5. Legal pages and compliance
- [x] Legal page templates created and linked in footer on every page (`/privacy-policy/`, `/terms-and-conditions/`, `/cookie-policy/`).
- [ ] Final legal copy supplied or approved in writing by client / lawyer before go-live (never publish AI draft text as final).
- [x] Cookie consent banner implemented with Accept / Reject / Settings; analytics scripts load ONLY after consent.
- [x] DPDP unchecked consent checkbox with link to `/privacy-policy/` on both appointment and callback forms.
- [x] Minimal data collected + DPDP data access/correction/deletion instructions on Contact & Privacy pages.
- [x] Healthcare medical disclaimer in footer & Terms; no guaranteed-results claims; written consent required for patient stories/photos.
- N/A — E-commerce legal policies (Refund, Shipping, Return, GSTIN, Grievance Officer): brochure/appointment clinic website with no online checkout.
- N/A — Finance / trading and LMS / subscription disclaimers: healthcare clinic website.

## 6. Responsive design and cross-browser testing
- [x] Responsive layout, zero horizontal scroll, ≥44×44px tap targets, ≥16px body text, scrollable/stacked tables verified on desktop (`1280px`) and mobile (`390px`).
- [ ] Test on real physical Android phone & iPhone across Chrome, Safari, Firefox, Edge, and Samsung Internet before handover.

## 7. Performance
- [x] Portrait converted to compressed WebP + JPEG fallback in responsive sizes (`220w`, `420w`) with `<picture>`, `srcset`, `sizes`, explicit `width`/`height`.
- [x] Hero portrait eager-loaded with `fetchpriority="high"` and `<link rel="preload">`; below-the-fold images `loading="lazy"`.
- [x] Single clean CSS (`css/styles.css`) and single vanilla JS (`js/main.js`) with unused CSS/JS removed (server Gzip/Brotli enabled via `.htaccess`/CDN; optional one-time minification before upload if needed).
- [x] Caching headers prepared in `_headers`, `vercel.json`, and `.htaccess`.
- [ ] Enable Gzip/Brotli & CDN on live host; run Google PageSpeed Insights (85+ mobile, 90+ desktop) and save screenshot at handover.
- N/A — Raw video hosting / compression: Instagram Reels link externally to Instagram.

## 8. Accessibility (WCAG 2.2 AA basics)
- [x] Colour contrast verified ≥ 4.5:1 across palette (`--lav` `#6d4ca8` passes AA on `--sun` and `--bg`).
- [x] Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`), `<button>` vs `<a>`, skip link.
- [x] Visible `<label for>` on every field; clear non-colour-only error alerts (`role="alert"`, `aria-invalid`).
- [x] Keyboard usability: focus outlines, Escape closes menu/dropdown/modal, focus trap in callback dialog.
- [x] `aria-label` on icon-only buttons; `prefers-reduced-motion` respected.
- [ ] Run Lighthouse Accessibility (90+) & axe DevTools audit on live staging/production URL.

## 9. Security
- [x] Security headers configured in `_headers`, `vercel.json`, and `.htaccess` (`HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `CSP`).
- [x] Zero secrets/API keys in frontend code or Git; honeypot anti-spam field added to both forms.
- [x] Directory listing disabled & hidden files blocked in `.htaccess`.
- [ ] SSL certificate active on live host; verify headers on `securityheaders.com`; add server-side validation/rate-limiting/Turnstile at form endpoint.
- N/A — Database, login/auth, JWT/sessions, RBAC, file uploads, WordPress CMS: static clinic brochure site with no database, login or WordPress.

## 10. Forms, emails and integrations
- [x] Client-side validation (name, email, 10-digit Indian mobile with `+91` handling, DPDP consent), submit button disabled while submitting, clear success/error messages, `?event=` pre-fill, lazy-loaded Google Maps container.
- [ ] Connect `data-endpoint` (SMTP/Resend/Zoho/Formspree/backend), configure SPF/DKIM/DMARC on domain DNS, add real WhatsApp/Maps URL, and verify end-to-end delivery with client.
- N/A — Payment gateway & shipping webhooks: no online checkout.

## 11. Analytics and tracking
- [x] Consent-gated GTM/GA4 loader & conversion tracking hooks (`form_submit`, `phone_click`, `whatsapp_click`) ready in `js/main.js`.
- [ ] Create client-owned GA4/GTM/GSC accounts, set `data-ga4`/`data-gtm` on `<body>`, filter internal IP, verify in GTM Preview / GA4 DebugView.

## 12. Content and UX
- [x] Fixed `Antenatal classs` typo; removed scattered inline styles; added `@media print` styles; consistent CTA & navigation across all 20 pages.
- [ ] Client to supply real contact info, doctor qualifications/bio, hospital details, real Google Reviews, real event schedule, and blog articles (or hide "Coming soon" blog & sample events before launch), plus written approval.

## 13. Static websites
- N/A — Shared header/footer include/template: pure static HTML/CSS/JS site with no build step or server-side includes per manager requirement.
- [x] One main CSS file (`css/styles.css`) and one main JS file (`js/main.js`); zero inline styles scattered across pages.
- [x] CSS variables used for brand colours, fonts and spacing; root-relative internal links; vanilla JS (no jQuery).
- [ ] Connect secure form backend and run live W3C validator check on staging URL.
- N/A — WordPress bullet: custom static HTML/CSS/JS site.

## 14. E-commerce · 15. Shopify · 16. Next.js / full-stack
- N/A — Section 14 (E-commerce): healthcare clinic brochure website with no cart or checkout.
- N/A — Section 15 (Shopify): not built on Shopify.
- N/A — Section 16 (Next.js / full-stack): pure static HTML/CSS/JS site with no build tool, server or database.

## 17 & 18. General coding guidelines & AI-assisted coding
- [x] Meaningful camelCase / UPPER_SNAKE_CASE naming, short single-purpose functions, named constants, clean formatting, dead code removed.
- [ ] Human developer / Tech Lead code review of every line before merging PR to `main`.

## 19 & 20. Pre-launch & post-launch handover
- [ ] Complete all pending client/hosting items above, run live broken-link/Lighthouse/form tests, take pre-launch backup, get Tech Lead & written client sign-off, complete 24h post-launch check, backups, uptime/SSL alerts, client walkthrough & handover document.
