# Pokédex Tracker

**Live app:** https://4dfnkbtdck-wq.github.io/pokedex/
(once GitHub Pages is enabled for this repo — see below)

A small, dependency-free web app for tracking which Pokémon you've
obtained — the same idea as a checklist spreadsheet, but as an app. Covers
the full National Pokédex, #001 Bulbasaur through #1025 Pecharunt (Gen
1–9), plus every canonical **Mega Evolution** (48) and **Gigantamax**
form (34), tracked as their own separate entries right next to their
base species.

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

## Using it

- Tap any Pokémon's card to mark it **caught** (green ring, full-color
  sprite) or back to not-caught (grayed-out sprite).
- **Search** by name or Pokédex number — searching a number matches a
  species and all of its Mega/Gigantamax forms.
- Filter by **Generation**, **Form** (Base / Mega / Gigantamax), **Type**,
  or **Caught / Missing** status.
- **Mark visible caught** marks everything currently matching your
  filters/search as caught in one tap — handy after a search like
  "gen 3" if you own that whole box.
- **Clear all caught** resets your whole list (asks for confirmation
  first).
- The progress bar and header count track your total caught out of 1107
  (1025 species + 48 Megas + 34 Gigantamax forms), regardless of any
  active filter.

Your caught list is saved to this browser's `localStorage` — it's per
browser/device, with no account or server involved.

## Data

`js/data.js` holds the dex list, generated from [PokéAPI](https://pokeapi.co)'s
public CSV data. Each entry has an English name, generation, type(s), a
`category` (`base`, `mega`, or `gmax`), and a `baseId` — the National
Dex number it's filed under (a Mega/Gigantamax form's own `id` is its
distinct PokéAPI form id, so its caught state doesn't collide with its
base species). Sprite images aren't bundled — each card loads its sprite
directly from PokéAPI's [sprites repo](https://github.com/PokeAPI/sprites)
by that id.

---

Fan-made, unofficial tool. Pokémon and Pokémon character names are
trademarks of Nintendo, Game Freak, and Creatures Inc.
