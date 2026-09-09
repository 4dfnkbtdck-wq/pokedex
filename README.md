# Pokédex Tracker

**Live app:** https://4dfnkbtdck-wq.github.io/pokedex/
(once GitHub Pages is enabled for this repo — see below)

A small, dependency-free web app for tracking which Pokémon you've
obtained — the same idea as a checklist spreadsheet, but as an app. Covers
the full National Pokédex, #001 Bulbasaur through #1025 Pecharunt (Gen
1–9), plus every **Mega Evolution** across all three sources — the
mainline-game roster (48), Pokémon GO's own additions (2: Mega Raichu
X/Y), and Pokémon Legends Z-A's Mega Dimension DLC (47) — **Gigantamax**
form (34), and regional variant — Alolan (18), Galarian (19), Hisuian
(16), and Paldean (4: Wooper plus all three Tauros breeds) — each as
its own separate entry right next to its base species.

## Running it

No build step, no install. Just open `index.html` in a browser, or serve
the folder statically:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

It also works as-is on GitHub Pages: Settings → Pages → Source:
"Deploy from a branch" → Branch: `main`, folder `/ (root)` → Save. It'll
be live at `https://<your-username>.github.io/pokedex/` within a minute.

## Installing it on your phone

It's a PWA — there's no App Store app, but it installs and behaves like
one:

- **iPhone (Safari)**: open the site, tap Share, then **Add to Home
  Screen**.
- **Android (Chrome)**: open the site, tap the ⋮ menu, then **Add to
  Home screen** / **Install app**.

Once installed it opens full-screen with its own icon, and a service
worker caches the app shell so it keeps working with no signal — your
caught list is unaffected either way since it already lives in
`localStorage`, not the network (sprite images do still need a
connection the first time each one loads).

## Using it

- Tap any Pokémon's card to mark it **caught** (green ring, full-color
  sprite) or back to not-caught (grayed-out sprite).
- **Search** by name or Pokédex number — searching a number matches a
  species and all of its Mega/Gigantamax/regional forms.
- Filter by **Generation**, **Form** (Base / Alolan / Galarian / Hisuian
  / Paldean / Mega / Gigantamax), **Type**, or **Caught / Missing**
  status.
- **Mark visible caught** marks everything currently matching your
  filters/search as caught in one tap — handy after a search like
  "gen 3" if you own that whole box.
- **Clear all caught** resets your whole list (asks for confirmation
  first).
- The number in the navbar is always your overall total out of 1213
  (1025 species + 57 regional variants + 97 Megas + 34 Gigantamax
  forms). The progress bar below it instead scopes to your active
  Generation/Form/Type filters and search — e.g. filtering to Gen 1
  shows "X / 151 caught" — so it ignores the Caught/Missing toggle
  specifically (scoping to that too would always read 100% or 0%).

Your caught list is saved to this browser's `localStorage` — it's per
browser/device, with no account or server involved.

## Data

`js/data.js` holds the dex list, generated from [PokéAPI](https://pokeapi.co)'s
public CSV data. Each entry has an English name, generation, type(s), a
`category` (`base`, `alolan`, `galarian`, `hisuian`, `paldean`, `mega`,
`mega_go`, `mega_za`, or `gmax`), and a `baseId` — the National Dex
number it's filed under (a form's own `id` is its distinct PokéAPI form
id, so its caught state doesn't collide with its base species). Sprite
images aren't bundled — each card loads its sprite directly from
PokéAPI's [sprites repo](https://github.com/PokeAPI/sprites) by that id.

Beyond the 48 mainline Megas, two other sources added their own:

- `mega_go` — Pokémon GO's own additions (currently just Mega Raichu
  X/Y, debuted July 2026), tagged "MEGA GO" on the card.
- `mega_za` — Pokémon Legends Z-A's **Mega Dimension** DLC (December
  2025), which added 47 more across many Pokémon that never had a Mega
  before (Victreebel, Dragonite, Zeraora, Golisopod, and more), plus
  second "Z" Megas for three that already had one (Absol, Garchomp,
  Lucario). Tagged "MEGA Z-A" on the card.

All three group under the single **Mega** form filter — that's still
the form someone's looking for — but each card's own tag says which
game it's from. (Earlier revisions of this README wrongly called the
`mega_za` set "unofficial fan content" based on PokéAPI not yet having
assigned it a final Pokédex order — that was a bad inference, not a
confirmed fact, and it was wrong: it's real DLC content.)

Galarian Darmanitan is tracked once (its Standard Mode form) — Zen Mode
is a temporary in-battle transformation, not a separate obtainable
Pokémon, matching how the original (non-Galarian) Darmanitan's own Zen
Mode isn't tracked separately either.

## Files

- `index.html` / `js/app.js` — the tracker itself.
- `js/data.js` — the dex data described above.
- `css/styles.css` — all styling.
- `manifest.webmanifest` / `sw.js` / `img/` — what make it installable
  (see "Installing it on your phone" above). Bump `sw.js`'s
  `CACHE_VERSION` (and its own copies of the `?v=` URLs) on any deploy
  that touches `css`/`js`, the same discipline the `?v=` query strings
  in `index.html` already follow — an installed icon otherwise keeps
  serving old files from its offline cache even after those two catch
  up.

---

Fan-made, unofficial tool. Pokémon and Pokémon character names are
trademarks of Nintendo, Game Freak, and Creatures Inc.
