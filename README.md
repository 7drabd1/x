# صدقة جارية — Tasbeeh & Dua

An Arabic, RTL, mobile-first digital tasbeeh and dua platform dedicated as Sadaqah Jariyah for
**سليم بن علي الحمداني**. No ads, no tracking, no backend. Installable and fully offline.

Stack: React 19 + TypeScript, Vite, Tailwind CSS v4. Fonts (Tajawal, Kufam) are bundled, so the site never calls Google Fonts or any other third party.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then outputs ./dist
npm run preview    # serve the production build (needed to try the service worker)
```

Requires Node 20.19+ (or 22+).

## Deploy

**Vercel** — import the repo. Vite is detected automatically; nothing to configure.

**GitHub Pages** — push to `main`, then in the repo go to *Settings → Pages → Source* and pick **GitHub Actions**.
`.github/workflows/deploy.yml` builds and publishes. The build uses relative asset paths, so it works under `/repo-name/` without any config.

Any static host works too: upload the contents of `dist/`.

## Edit the content

| What | Where |
| --- | --- |
| Name, dedication line, prayer line | `src/data/memorial.ts` |
| Duas, adhkar and their sources | `src/data/adhkar.ts` |
| Tasbeeh phrases and goal options | `src/data/dhikr.ts` |
| Colours, background speed | `src/index.css` (variables at the top, `drift-*` keyframes) |

If you change the name, also update the two vocalised forms in `memorial.ts`: the duas use them so the Arabic grammar stays correct.

## How it works

- **Tasbeeh**: `useTasbeeh` keeps a count per phrase (plus rounds and lifetime totals) in `localStorage` through the `useLocalStorage` hook. Goals: 33, 99, 100 or unlimited. Every tap calls `navigator.vibrate(20)`; completing a round plays a longer pattern. Sound is synthesised with the Web Audio API and is off by default.
- **Background**: three drifting gradient pools (transform-only animation, 90–130 s loops), a faint star lattice, and a canvas of slow gold and emerald dust that eases aside from the cursor or a finger. It pauses when the tab is hidden and stays still when the visitor has "reduce motion" enabled.
- **Offline**: `public/sw.js` is filled with the full file list at build time (`vite.config.ts`), so everything is cached on the first visit. The cache name changes with every build, so updates arrive on the next load.

## Notes

- iOS Safari does not implement the Vibration API, so iPhone visitors get no haptics (everything else works).
- Have someone who reads Arabic well proofread `adhkar.ts` before you publish. The texts are standard, widely circulated ones with their sources, but for religious text a second pair of eyes is worth it.
