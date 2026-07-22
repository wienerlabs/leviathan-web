<p align="center">
  <img src="public/banner.jpg" alt="Leviathan" width="100%" />
</p>

# Leviathan website

Marketing site for [Leviathan](https://x.com/leviathanfront): trustless training for the people's model.

## Stack

Vite, React 19, Tailwind v4, Motion.

## Docs

Local route: `/docs/developer/quickstart`

Content is derived from [wienerlabs/leviathan](https://github.com/wienerlabs/leviathan) and [wienerlabs/leviathan-net](https://github.com/wienerlabs/leviathan-net). Prefer the GitHub sources if anything drifts.

## Theme

Light and dark themes. Preference is stored in `localStorage` under
`leviathan-theme`. Defaults to the system color scheme. Toggle lives in the
site header and docs header.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Blog and X cards

Each blog post gets a LaTeX-style Open Graph card (title + summary + date) so
X/Twitter shows a large preview when you paste the link.

### Add a post

1. Append an entry to `src/blog/catalog.json` (`slug`, `title`, `description`, `date`, `dateLabel`).
   `title` and `description` are what X shows in the card.
2. Create `src/blog/posts/<slug>.tsx` and register it in `src/blog/posts/index.ts`.
3. Ship. Build generates a static card at `public/og/<slug>.png` and injects
   crawler meta into `dist/blog/<slug>/index.html`.

### Share a post

1. Deploy main (Vercel).
2. Open the post URL, e.g. `https://leviathan.run/blog/verifier-daemon-fusion`.
3. Paste that URL into X. Card fields:
   - **Title** from `catalog.json` → `title`
   - **Summary** from `catalog.json` → `description`
   - **Image** static PNG at `/og/<slug>.png` (paper card, 1200x630)
4. If an old card is cached, append `?v=2` once to force a fresh scrape.

Preview the image directly (static file, no API):

```
https://leviathan.run/og/verifier-daemon-fusion.png
```

Regenerate cards locally:

```
npm run og:generate
```

## Links

- Network: https://github.com/wienerlabs/leviathan-net
- Research: https://github.com/wienerlabs/leviathan
- X: https://x.com/leviathanfront
