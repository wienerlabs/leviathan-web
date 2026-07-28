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

## Waitlist

The `/waitlist` page verifies each signup with X (Twitter) via OAuth 2.0 and
stores verified entries in Supabase. All logic lives in Vercel edge functions
under `api/waitlist/`; the browser only ever talks to same-origin `/api/...` routes,
so no secrets reach the client. The X identity is carried in a signed, HttpOnly
cookie and re-checked server-side on submit, so a spot can't be claimed for an
account the user didn't actually authenticate.

### One-time setup

1. **X app** — at https://developer.x.com create an app with OAuth 2.0 ("Web
   App" / confidential client). Scopes: `tweet.read`, `users.read`. Add the
   callback `https://YOUR-DOMAIN/api/waitlist/twitter/callback` to the app's
   redirect URLs (exact match). Copy the Client ID and Client Secret.
2. **Supabase** — create a project, then run `supabase/schema.sql` in the SQL
   editor. Copy the project URL and the service-role key (Settings > API).
3. **Env** — set the variables from `.env.example` in Vercel (Project >
   Settings > Environment Variables). Generate the session secret with
   `openssl rand -base64 32`.
4. Redeploy. Until every variable is set, the page shows a friendly "not
   configured yet" state instead of erroring.

### Flow

`Connect X` → `/api/waitlist/twitter/start` (PKCE verifier + state in a signed
cookie) → X authorize → `/api/waitlist/twitter/callback` (verifies state,
exchanges the code, reads the profile, sets a signed identity cookie) → back on
`/waitlist` the user adds an optional email + role and submits to
`/api/waitlist/submit`, which trusts the cookie identity (never the request
body) and upserts into Supabase keyed on the X user id.

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

That also rebuilds X-style link preview mockups under `public/previews/`
(per-post cards + stack + grid). Every new blog post must ship with those
previews; `npm run build` runs the same pipeline.


## Links

- Network: https://github.com/wienerlabs/leviathan-net
- Research: https://github.com/wienerlabs/leviathan
- X: https://x.com/leviathanfront
