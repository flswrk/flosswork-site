# Festival themes

Festival looks (Diwali, Christmas and so on) that switch on and off by date. They are separate from the site's own design (`styles.css`), and nothing loads outside a festival window.

## Everyday use

All scheduling lives in `schedule.json`:

```json
{
  "enabled": true,
  "festivals": [
    { "id": "diwali-d", "label": "Diwali 2026", "from": "2026-11-04", "to": "2026-11-12",
      "banner": { "text": "Shubh Deepavali from Flosswork", "more": "wishing you a bright, healthy smile" } }
  ]
}
```

After any edit run `node tools/build-site.js` from the project folder, then upload the site. The build checks the file, prints which festival theme is live today and what is scheduled, and stops with a FESTIVAL THEME ERROR if a date, id or file is wrong.

- **Dates** are inclusive and read in India time (midnight to midnight).
- **Kill switch:** set `"enabled": false`, rebuild, upload. Every festival theme turns off.
- **Overlap:** if two windows overlap the build warns, and the later entry in the file wins.
- **Banner:** `text` is always shown, `more` only on screens 760px and wider.
- **Yearly:** festival dates move, so add a new entry each year (Diwali, Holi and Eid especially).

## Preview before the festival

Add `?festival=<id>` to any page, for example `https://flosswork.in/?festival=diwali-d`. The choice sticks for that browser tab, so you can click through the site. Use `?festival=off` to clear it. Preview works even when the kill switch is off.

## Adding a festival theme

1. Make `festival-themes/<id>.css` and `festival-themes/<id>.js` (copy `diwali-d.*` as a starting point).
2. CSS: set the tokens on `html[data-fw-festival="<id>"]` (`--fa` accent fill, `--fo` text on it, `--fg` accent on dark, `--link` accent text on light, plus the site's `--green --greend --tint --soft --img`), then style the banner `.fw-fest` and any decoration.
3. JS: `FWFestival.define(function(t){ ... })`. `t` gives `el()`, `rnd()`, `reduce` (visitor prefers reduced motion), `hero` (the page's hero element), `banner`, and `fx` (a fixed layer for floating particles). Skip motion when `t.reduce` is true.
4. Add an entry to `schedule.json`, run `node tools/build-site.js`, preview with `?festival=<id>`.

## How it works

`tools/build-site.js` writes a tiny inline script into every page, right after `styles.css`. It holds the schedule, picks today's festival theme and, only if one is live, loads `base.css`, `<id>.css`, `base.js` and `<id>.js`. The banner is fixed at the top; the header and page are pushed down by `--bn` (40px, 36px on phones). Files carry a content hash in `?v=` and are cached for a year (`_headers`).

## Performance rules

Animate only `transform` and `opacity`. Keep particles to about 14 on desktop and 8 on phones. Everything decorative must stop under `prefers-reduced-motion`.
