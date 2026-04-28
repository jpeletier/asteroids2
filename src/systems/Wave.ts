import { world, updatePhase, gameState, canvasSize } from '../world';
import { Asteroid, Alien } from '../components/index';
import { createAsteroid } from '../factories/Asteroid';

const asteroidQuery = world.query('WaveAsteroids').requires(Asteroid).track();
const alienQuery2 = world.query('WaveAliens').requires(Alien).track();

function spawnWave(wave: number): void {
  const count = 3 + wave * 2;
  const { width, height } = canvasSize;
  for (let i = 0; i < count; i++) {
    let x: number;
    let y: number;
    do {
      x = Math.random() * width;
      y = Math.random() * height;
    } while (Math.hypot(x - width / 2, y - height / 2) < 200);
    createAsteroid(x, y, 3);
  }
}

world.system('Wave')
  .phase(updatePhase)
  .run(() => {
    if (gameState.state !== 'playing') return;
    if (asteroidQuery.entities.size === 0 && alienQuery2.entities.size === 0) {
      gameState.wave++;
      spawnWave(gameState.wave);
    }
  });
