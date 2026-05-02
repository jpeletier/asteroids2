import { world, updatePhase, gameState } from '../world';
import { Alien } from '../components/index';
import { GAME_CONFIG } from '../constants';
import { createAlien } from '../factories/Alien';
import { createPickup } from '../factories/Pickup';

const alienQuery = world.query('SpawnAliens').requires(Alien);

world
  .system('Spawn')
  .phase(updatePhase)
  .run(() => {
    if (gameState.state !== 'playing') return;
    const now = Date.now();

    if (
      now - gameState.lastAlienSpawnTime > GAME_CONFIG.ALIEN_SPAWN_INTERVAL &&
      alienQuery.entities.size < GAME_CONFIG.ALIEN_CAP
    ) {
      createAlien();
      gameState.lastAlienSpawnTime = now;
    }

    if (
      !gameState.shieldPickupExists &&
      now - gameState.lastShieldSpawnTime > GAME_CONFIG.SHIELD_SPAWN_INTERVAL
    ) {
      if (Math.random() < GAME_CONFIG.SHIELD_SPAWN_CHANCE) {
        createPickup('shield');
        gameState.shieldPickupExists = true;
      }
      gameState.lastShieldSpawnTime = now;
    }

    if (
      !gameState.laserPickupExists &&
      now - gameState.lastLaserSpawnTime > GAME_CONFIG.LASER_SPAWN_INTERVAL
    ) {
      if (Math.random() < GAME_CONFIG.LASER_SPAWN_CHANCE) {
        createPickup('laser');
        gameState.laserPickupExists = true;
      }
      gameState.lastLaserSpawnTime = now;
    }

    if (
      !gameState.auraPickupExists &&
      now - gameState.lastAuraSpawnTime > GAME_CONFIG.AURA_SPAWN_INTERVAL
    ) {
      if (Math.random() < GAME_CONFIG.AURA_SPAWN_CHANCE) {
        createPickup('aura');
        gameState.auraPickupExists = true;
      }
      gameState.lastAuraSpawnTime = now;
    }

    if (
      !gameState.rocketPickupExists &&
      now - gameState.lastRocketSpawnTime > GAME_CONFIG.ROCKET_SPAWN_INTERVAL
    ) {
      if (Math.random() < GAME_CONFIG.ROCKET_SPAWN_CHANCE) {
        createPickup('rocket');
        gameState.rocketPickupExists = true;
      }
      gameState.lastRocketSpawnTime = now;
    }

    if (
      !gameState.healthPickupExists &&
      now - gameState.lastHealthSpawnTime > GAME_CONFIG.HEALTH_SPAWN_INTERVAL
    ) {
      if (Math.random() < GAME_CONFIG.HEALTH_SPAWN_CHANCE) {
        createPickup('health');
        gameState.healthPickupExists = true;
      }
      gameState.lastHealthSpawnTime = now;
    }
  });
