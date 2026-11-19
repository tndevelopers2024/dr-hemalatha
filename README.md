# Dr. Hemalatha — Obstetrics & Gynaecology Website

Production-structured static website (plain HTML, CSS, and vanilla JS — no build step required).

## Project Structure

```text
dr-hemalatha/
├── index.html                  # Main HTML5 entry point (all views via hash routing)
├── css/
│   ├── tokens.css              # Design tokens, base reset & typography
│   ├── layout.css              # Header, navigation, mega-menu, grids & cards
│   ├── sections.css            # Page sections & interactive widgets
│   └── footer.css              # Footer, floating actions & reduced-motion
├── js/
│   └── main.js                 # Router, popup, due-date calculator, filters & sliders
├── assets/
│   └── images/
│       ├── dr-hemalatha.jpg    # Doctor portrait (extracted from prototype base64)
│       └── favicon.svg         # Brand SVG favicon
├── docs/
│   └── client-content-latest.md # Latest client-shared copy for upcoming content update
└── robots.txt                  # Currently set to Disallow (draft); update before launch
```

## Local Preview

Open `index.html` directly, or serve locally:

```bash
python3 -m http.server 8080
```

## Pre-Launch Checklist (Before Going Live)

1. Apply the client's latest content from `docs/client-content-latest.md`.
2. Replace `XXX` placeholders (phone, WhatsApp, email, address, clinic hours, emergency line).
3. Remove the `.draft` banner in `index.html`.
4. Update `<meta name="robots" content="index, follow">` in `index.html` and `Allow: /` in `robots.txt`.
5. Connect the appointment & callback forms to the clinic's backend/WhatsApp/email handler.
