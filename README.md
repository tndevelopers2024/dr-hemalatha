# Dr. Hemalatha Pugalendhi — Obstetrics & Gynaecology Website

## Purpose

Multi-page static clinic website for **Dr. Hemalatha Pugalendhi** (Sr. Consultant in Obstetrics & Gynecology, Expert Laparoscopic Surgeon and Endometriosis Specialist), showcasing pregnancy & high-risk maternity care, endometriosis excision, 4K laparoscopic & hysteroscopic procedures, urogynecology, fertility care, patient guides, events, and consultation booking.

## Tech Stack

- **100% Pure HTML5, CSS3, and Vanilla JS** — zero frameworks, zero build step, zero runtime dependencies.
- **One main stylesheet** (`css/styles.css`, including responsive and `@media print` rules) and **one main script** (`js/main.js`).
- **20 flat HTML pages** (`index.html`, `about.html`, `laparoscopy.html`, etc.) + custom `404.html`, `sitemap.xml`, `robots.txt`, `site.webmanifest`, WebP/JPEG responsive portraits, SVG logos, and JSON-LD structured data.

## Project Structure

```text
dr-hemalatha/
├── index.html
├── about.html
├── services.html
├── obstetrics.html
├── gynaecology.html
├── pregnancy-care.html
├── high-risk-pregnancy.html
├── labour-and-delivery.html
├── painless-labour.html
├── endometriosis.html
├── laparoscopy.html
├── fertility.html
├── patient-guide.html
├── events.html
├── patient-stories.html
├── blog.html
├── contact.html
├── privacy-policy.html         # Draft legal template
├── terms-and-conditions.html   # Draft legal template
├── cookie-policy.html          # Draft legal template
├── 404.html                    # Custom 404 error page
├── css/styles.css              # Single organized stylesheet (+ print styles)
├── js/main.js                  # Single vanilla JS file
├── assets/images/              # WebP/JPG portraits, SVG logos, favicons, OG image
├── site.webmanifest            # Web App Manifest
├── sitemap.xml                 # XML sitemap
├── robots.txt                  # Staging (Disallow) — switch to Allow at launch
├── _headers / .htaccess / vercel.json  # Security & caching headers
└── docs/                       # Checklist status & client reference copy
```

## Running Locally

No installation or build required. Serve the project root with any static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Deploying

Upload the root folder directly to any static host (no build step):

- **Apache / cPanel:** Upload all site files to `public_html/` (`.htaccess` configures security headers, Gzip, browser caching, custom `404.html`, and disabled directory listing).
- **Netlify / Cloudflare Pages:** Publish directory `.` (uses `_headers` automatically).
- **Vercel:** Deploy directly (configured via `vercel.json`).

## Pre-Launch Checklist

Before going live:
1. Replace `https://example.com` canonical/OG/sitemap URLs with the live domain.
2. Replace `XXX` and `[...]` placeholders (phone, WhatsApp, email, address, timings, maps, bio, reviews, events) with client-approved values.
3. Add the live form endpoint (`data-endpoint` on `#bookForm` and `#popForm`) and client GA4/GTM ID (`data-ga4` / `data-gtm` on `<body>`).
4. Replace draft legal page text with client/lawyer-approved copy.
5. Remove the `.draft` top banner, change `<meta name="robots" content="noindex, nofollow">` to `index, follow`, and update `robots.txt` to `Allow: /` with the live `Sitemap:` URL.

## Ownership & Standards

- **Agency / Delivery Owner:** TechieNutpam (`https://github.com/tndevelopers2024/dr-hemalatha`)
- **Standards Checklist:** Tracked in [`docs/checklist-status.md`](docs/checklist-status.md)
- **Client Reference Copy:** Saved in [`docs/client-content-latest.md`](docs/client-content-latest.md)
