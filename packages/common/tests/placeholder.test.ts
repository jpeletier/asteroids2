import { describe, expect, it } from 'vitest';

import { commonPackageName } from '../src/index';

describe('common placeholder', () => {
  it('keeps the common test workspace active', () => {
    // Delete this placeholder test when the first real common test is added.
    expect(commonPackageName).toBe('@spacerocks/common');
  });
});
