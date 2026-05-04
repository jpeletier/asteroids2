# Co-op Asteroids: Boss Rush

A fast-paced, two-player cooperative Asteroids-style game.

## Features

- **Local Co-op**: Play with two players on one keyboard.
- **Waves**: Increasing difficulty with every wave.
- **Boss Rush**: Special boss battles every few waves.
- **Powerups**: Collect shields, weapons (Laser, Aura, Rocket, Boomerang), and health pickups. The Boomerang spins through enemies, curves back, and refunds ammo if you catch it.
- **Aliens**: Watch out for alien ships that hunt you down!

## Controls

### Player 1

- **Movement**: `W` (Thrust), `A` (Rotate Left), `D` (Rotate Right)
- **Shoot**: `Space`

### Player 2

- **Movement**: `Up Arrow` (Thrust), `Left Arrow` (Rotate Left), `Right Arrow` (Rotate Right)
- **Shoot**: `Enter`

## Development

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server (http://localhost:5173)
npm run build      # typecheck + production bundle → dist/
npm run test       # run Vitest smoke tests
```

## GitHub Pages previews

Pushes and same-repository PRs publish the built game to the `gh-pages` branch.

- Branch preview: `https://<owner>.github.io/<repo>/<branch>/`
- Pull request preview: `https://<owner>.github.io/<repo>/pr-<number>/`

Enable GitHub Pages in the repository settings with source branch `gh-pages` and folder `/`.
