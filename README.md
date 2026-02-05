# RoguePi

A browser-based roguelike dungeon crawler. Descend 20 levels into **The Dungeon of π**, fight monsters, loot gear, and reach the bottom to claim the Pi Amulet—then survive the climb back to the surface.

## How to Play

Open `index.html` in a modern browser (no build step required). The game loads from the CDN and runs entirely in the browser.

- **Goal:** Reach depth 20, take the Pi Amulet, and return to the surface.
- **Movement:** WASD or arrow keys (including diagonals: Q/E/Z/C or Home/PgUp/End/PgDn).
- **Actions:** Move into an enemy to melee, **I** to use items, **J** to drop, **K** for ranged attack (bow/dart + missile), **L** to search, **R** to rest.
- **Survival:** Equip torches for light, manage thirst and hunger with water and rations.
- **Help:** In-game help is available from the menu.

High scores and progress are stored in `localStorage`.

## Tech

- Vanilla JavaScript (no framework).
- [PiJS](https://github.com/AndyStubbs/RoguePi) for the retro display and input.
- Single HTML file plus script modules; no bundler required.

## License

See repository for license details.
