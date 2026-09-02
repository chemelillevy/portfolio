# Levy Chemelil — Portfolio

Personal portfolio for **Levy Chemelil**, Project Manager & Full-Stack Developer at Focus4ward
(Nairobi, Kenya). A dependency-free static site: three files, no build step.

Live: https://chemelillevy.netlify.app/

## Structure

```
portfolio/
├── index.html      # All content and markup
├── styles.css      # Design tokens + all styling (light/dark)
├── script.js       # Theme, nav, scroll spy, reveals, contact form
├── sitemap.xml     # SEO
└── README.md
```

## Design

Editorial monochrome: Georgia for display type, Inter for UI, Courier for mono detail, with a
single amber accent (`#FCA311`) on a hairline grid. The page sits inside a 1280px `.frame` whose
left and right borders draw the vertical rules; `.frame > section` supplies the horizontal ones.
The black statement band is deliberately outside the frame so it runs full-bleed.

## Sections

| Section | Content |
| --- | --- |
| Hero | Centred serif statement and calls to action |
| Intro | Positioning and headline stats |
| Pillars | Four capabilities with line-art icons, divided by hairlines |
| Statement | Full-bleed black band |
| Experience | Role list, Focus4ward first |
| Projects | Card grid — Document Intelligence Agent, KenLA, Thrive HRMS, and others |
| About | Bio and grouped stack |
| Credentials | Education and certifications |
| Contact | Details and mailto form |

## Running locally

Any static server works — the site has no build step:

```bash
python -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000.

## Theming

All colours live as CSS custom properties at the top of `styles.css`. `:root` holds the light
palette; `[data-theme="dark"]` overrides the same names. To restyle the whole site, change those
two blocks.

The theme respects `prefers-color-scheme` on first visit and remembers the visitor's choice in
`localStorage` after that. The light treatment is the primary one — the design is built around
paper-white with hairline rules.

For an all-sans treatment, point `--font-display` at `var(--font-ui)`.

## Editing content

- **Add a project** — copy a `.card` article in the projects grid. The `:nth-child(3n + 1)` rules
  strip the left border on each row's first card; they're restated at each breakpoint, so check
  those if you change the column count.
- **Add a role** — copy a `.role` item. Add `role--current` and the `tag--amber` badge to the
  newest one.
- **Add a stack group** — copy a `.stack-group` block in the About section.
- Elements with the `reveal` class fade in on scroll; keep the class on anything new.
- Two-tone body copy: wrap the trailing sentence in `<span class="tint">`.

## Accessibility & performance

- Semantic landmarks, skip link, labelled form fields, `aria-live` form status
- Full keyboard navigation; visible focus rings
- `prefers-reduced-motion` disables animation and scroll smoothing
- Scroll handlers are throttled with `requestAnimationFrame`; reveals use `IntersectionObserver`
- Print stylesheet strips chrome for a clean CV-style printout
- No icon-font dependency — the few icons are inline SVG, so only two font files load

## Contact

- **Email**: levichelal87@gmail.com
- **Phone**: +254 718 376 639
- **Location**: Ngong Road, Nairobi, Kenya
- **GitHub**: https://github.com/chemelillevy
- **LinkedIn**: https://www.linkedin.com/in/levy-chemelil-6717aa25a/
