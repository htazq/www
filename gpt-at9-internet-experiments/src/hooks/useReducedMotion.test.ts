import { getReducedMotionPreference } from './useReducedMotion';

it('reads the browser reduced-motion preference', () => {
  Object.defineProperty(window, 'matchMedia', {
    value: () => ({ matches: true }),
    configurable: true,
  });
  expect(getReducedMotionPreference()).toBe(true);
});
