import { createPickup } from './factories/Pickup';

const PICKUP_TYPES = [
  'shield',
  'laser',
  'aura',
  'rocket',
  'boomerang',
  'health',
] as const;

export function initCheats(): void {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.code === 'Digit1') {
      e.preventDefault();
      const type =
        PICKUP_TYPES[Math.floor(Math.random() * PICKUP_TYPES.length)]!;
      createPickup(type);
    }
  });
}
