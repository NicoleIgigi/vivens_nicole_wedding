Nicole & Vivens — Wedding Website
=================================

A fast, responsive, static wedding site optimized for sharing and deployment on Vercel (or Netlify).

Structure
---------

- `index.html` — main page
- `styles.css` — styles (light/dark themes)
- `script.js` — theme toggle, countdown, add-to-calendar (single + full-day multi-event)
- `vercel.json` — headers + aggressive asset caching
- `robots.txt`, `sitemap.xml` — SEO basics

Local preview
-------------

Open `index.html` in your browser.

Deploy to Vercel (recommended)
------------------------------

1. Push this `new/` folder to GitHub as the repo root or set it as the project root in Vercel.
2. In Vercel:
   - Framework preset: Other
   - Root directory: `new`
   - Build command: none
   - Output directory: `new`
3. After first deploy, visit the deployment URL and verify Open Graph preview using any OG debugger.

Deploy to Netlify (optional)
---------------------------

- Drag-and-drop the `new/` folder into Netlify.
- Or set build to none and publish directory to `new`.

Social preview
--------------

We set Open Graph/Twitter tags using `hero pic.png`. Replace with a 1200x630 JPEG if you prefer a dedicated OG image, then update the meta tags in `index.html`.

Performance
-----------

- Long-term caching via `vercel.json`
- Responsive images and layouts
- Preloaded hero image

Calendar
--------

- Each schedule card has its own “Add to Calendar”.
- The hero “Add to calendar” adds the entire day as multiple events.

Contact
-------

Edit numbers in the `#contact` section. WhatsApp buttons use `wa.me` links.

License
-------

All rights reserved © 2024–2025 Nicole & Vivens.
