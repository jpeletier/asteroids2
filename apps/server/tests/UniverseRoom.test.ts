import { describe, expect, it } from 'vitest';

import { UniverseRoom } from '../src/rooms/UniverseRoom';

describe('UniverseRoom', () => {
  it('defines the server-side ECS room class', () => {
    const room = new UniverseRoom();

    expect(room).toBeInstanceOf(UniverseRoom);
  });
});
