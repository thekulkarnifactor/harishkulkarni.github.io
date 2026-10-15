# harishkulkarni.in

Personal / freelance site of Harish Kulkarni — data engineering, AI, web and automation.

Plain HTML, CSS and JavaScript. No framework, no build step.

```
site/
  index.html        ← all page content
  assets/styles.css ← design (change --ac at the top to recolour the site)
  assets/main.js    ← animations, filters, panels
  CNAME             ← custom domain: harishkulkarni.in
  resume.pdf        ← optional: add your résumé, then uncomment the footer link in index.html
.github/workflows/deploy.yml ← publishes ./site to the gh-pages branch on every push to main
```

## Run locally

```bash
cd site
python3 -m http.server 8080
# open http://localhost:8080
```

## Edit content

- **Projects** — copy any `<article class="card" data-cat="…">` block in `index.html`.
  `data-cat` must be one of `Data`, `AI`, `Web`, `Automation` (filter counts update automatically).
- **Testimonials** — a ready section is commented out in `index.html`; uncomment it once you have real quotes.
- **Accent colour** — `--ac` in `assets/styles.css`.

## Deploy

Push to `main`. GitHub Actions copies `site/` to the `gh-pages` branch, which GitHub Pages serves at https://harishkulkarni.in.
