# Pokédex Tracker

**Live app:** https://4dfnkbtdck-wq.github.io/pokedex/
(once GitHub Pages is enabled for this repo — see below)

A small, dependency-free web app for tracking which Pokémon you've
obtained — the same idea as a checklist spreadsheet, but as an app. Covers
the full National Pokédex, #001 Bulbasaur through #1025 Pecharunt (Gen
1–9), plus every **Mega Evolution** across all three sources it's come
from so far — the mainline games (48: 30 from X/Y, 18 from Omega Ruby/
Alpha Sapphire), Pokémon Legends Z-A's base game (26), and its **Mega
Dimension** DLC (23) — **Gigantamax** form (34), and regional variant —
Alolan (18), Galarian (19), Hisuian (16), and Paldean (4: Wooper plus
all three Tauros breeds) — each as its own separate entry right next to
its base species.

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
`mega_za`, `mega_za_dlc`, or `gmax`), and a `baseId` — the National Dex
number it's filed under (a form's own `id` is its distinct PokéAPI form
id, so its caught state doesn't collide with its base species). Sprite
images aren't bundled — each card loads its sprite directly from
PokéAPI's [sprites repo](https://github.com/PokeAPI/sprites) by that id.

Beyond the mainline 48, Pokémon Legends Z-A added two more waves:

- `mega_za` — its base game (26): Clefable, Victreebel, Starmie,
  Dragonite, Meganium, Feraligatr, Skarmory, Froslass, Emboar,
  Excadrill, Scolipede, Scrafty, Eelektross, Chandelure, Chesnaught,
  Delphox, Greninja, Pyroar, Eternal Floette, Malamar, Barbaracle,
  Dragalge, Hawlucha, Zygarde, Drampa, and Falinks. Tagged "MEGA Z-A".
- `mega_za_dlc` — its **Mega Dimension** DLC (23): Chimecho, Staraptor,
  Heatran, Darkrai, Golurk, Meowstic (Male and Female forms),
  Crabominable, Golisopod, Magearna (plus its Original Color variant),
  Zeraora, Scovillain, Glimmora, Tatsugiri (all three forms),
  Baxcalibur, and Mega Raichu X/Y — plus second "Z" Megas for three
  Pokémon that already had one from the mainline games (Absol, Garchomp,
  Lucario). Tagged "MEGA DLC". Mega Raichu is **not** a Pokémon GO
  exclusive — GO's Raichu Super Mega Raid Day (July 2026) just featured
  it in a raid rotation after its Legends Z-A debut; an earlier revision
  of this tracker wrongly tagged it "MEGA GO" and implied it originated
  there.

All three group under the single **Mega** form filter — that's still
the form someone's looking for — but each card's own tag says which
wave it's from.

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
