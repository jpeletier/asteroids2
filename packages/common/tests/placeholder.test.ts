import { describe, expect, it } from 'vitest';

import { Position, SHARED_COMPONENT_TYPES, createWorld } from '../src/index';

class LocalComponent {}

describe('createWorld', () => {
  it('registers shared component types before local component ids', () => {
    const world = createWorld();
    const positionType = SHARED_COMPONENT_TYPES.find(
      ([ComponentClass]) => ComponentClass === Position,
    )?.[1];

    expect(world.getComponentType(Position)).toBe(positionType);

    world.registerComponent(LocalComponent);
    expect(world.getComponentType(LocalComponent)).toBe(256);
  });
});
