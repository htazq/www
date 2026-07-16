import { estimateRtt, haversineDistance, stageBreakdown } from './networkMath';

it('computes plausible great-circle distance and deterministic timing', () => {
  const distance = haversineDistance({ lat: 31.23, lon: 121.47 }, { lat: 50.11, lon: 8.68 });
  expect(distance).toBeGreaterThan(8000);
  expect(distance).toBeLessThan(10000);
  expect(estimateRtt(distance)).toBeGreaterThan(100);
  expect(stageBreakdown(100).total).toBeGreaterThan(100);
});
