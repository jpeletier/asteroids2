export const GAME_CONFIG = {
    ALIEN_SPAWN_INTERVAL: 15000,
    SHIELD_SPAWN_CHANCE: 0.7,
    SHIELD_SPAWN_INTERVAL: 10000,
    LASER_SPAWN_CHANCE: 0.3,
    LASER_SPAWN_INTERVAL: 15000,
};

export const ENTITY_CONFIG = {
    BULLET: {
        SPEED: 7,
    },
    ASTEROID: {
        SPEED_FACTOR: 4,
    },
    POWERUP: {
        SPEED_FACTOR: 1,
        RADIUS: 15,
    },
    ALIEN: {
        RADIUS: 15,
        SPEED_FACTOR: 2,
        SHOOT_COOLDOWN_BASE: 60,
        SHOOT_COOLDOWN_RANGE: 40,
        TARGET_DIST_MAX: 400,
    },
    BOSS: {
        RADIUS: 60,
        HP: 50,
        SPEED_X: 2,
        TARGET_Y_FACTOR: 0.2,
    },
    SHIP: {
        RADIUS: 12,
        FRICTION: 0.98,
        ROTATION_SPEED: 0.07,
        THRUST_POWER: 0.2,
        SHOOT_COOLDOWN: 15,
        MAX_HP: 100,
        LASER_SHOT_COUNT: 10,
        LASER_TIMER: 200,
        SHIELD_DURATION: 2400,
        HEALTH_BAR_TIMER: 60,
    }
};

export const SCORING = {
    ASTEROID_BASE: 10,
    ALIEN: 100,
    BOSS: 1000,
    SHIELD: 50,
    LASER: 75,
};
