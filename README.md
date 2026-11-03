# Marble Run

[Play Marble Run](https://intrepion.github.io/kata-inspired-by-marble-madness-codex-dot/)

An original browser arcade game inspired by Atari Games' *Marble Madness*. Roll through six winding, suspended, scrolling raceways with narrow bridges and gaps before the clock runs out. Play with the arrow keys or WASD, or drag across the raceway to add rolling momentum; release to coast and drag against the motion to brake; on touch devices use the on-screen arrows. Pause with Escape or the pause button. Finish a raceway to score points and carry remaining seconds into the next. Build speed while moving forward to jump gaps automatically; a slow approach falls. Falling or touching acid costs three seconds and returns you to a checkpoint. Steelies and bumpers shove the marble; pale ice reduces traction.

## Run locally

Serve this directory over HTTP, for example `python3 -m http.server 8000 --bind 127.0.0.1`, then visit http://127.0.0.1:8000/. No build step or external JavaScript dependencies are required. Run automated checks with `npm test` (Node 18+).

## Design and sources

The [Atari operator manual](https://manualzz.com/doc/9822788/atari-games-marble-madness-arcade-game-user-manual) describes the original's six timed raceways, trackball control, scrolling, hazards, respawns, bonuses and time carryover. A [Retro Gamer designer interview](https://electronicsandbooks.com/edt/manual/Magazine/R/Retro%20Gamer%20UK/53.pdf) informed the progression from practice through enemies and ice. This is an independent approximation with original procedural canvas art and code; it does not include Atari assets. The view is an isometric projection rather than a 3D engine: the deliberately simple collision model needs no external library.

The original's exact course geometry, trackball feel, two-player mode, music, reverse gravity, birds, pipes, waves, alternate routes, and detailed enemy behavior are not reproduced. This game uses keyboard/touch controls and a simplified checkpoint and scoring system.

[Return to Oliver's Kata Arcade](https://intrepion.github.io/)

MIT licensed; see LICENSE. Marble Madness is a trademark of its respective owner. This project is not affiliated with or endorsed by Atari.

## Arcade metadata

See [docs/arcade-metadata.md](docs/arcade-metadata.md) for the game-owned manifest and screenshot provenance.

Pointer dragging approximates trackball impulses using screen-relative motion with the course projection accounted for. It is not a calibration of Atari trackball hardware. Keyboard and on-screen arrows remain available.
