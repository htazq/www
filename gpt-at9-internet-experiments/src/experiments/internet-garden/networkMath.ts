import type { CityNode } from './cities';

const EARTH_RADIUS_KM = 6371;

export function haversineDistance(
  a: Pick<CityNode, 'lat' | 'lon'>,
  b: Pick<CityNode, 'lat' | 'lon'>,
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function estimateRtt(distanceKm: number) {
  const routeStretch = 1.45;
  const fiberSpeedKmPerMs = 200;
  const propagation = (distanceKm * routeStretch * 2) / fiberSpeedKmPerMs;
  return Math.max(8, propagation + 12);
}

export function stageBreakdown(rtt: number) {
  const dns = Math.max(4, rtt * 0.18);
  const tcp = rtt * 0.5;
  const tls = rtt * 0.78;
  const ttfb = Math.max(12, rtt * 0.86);
  const download = Math.max(6, rtt * 0.22);
  return { dns, tcp, tls, ttfb, download, total: dns + tcp + tls + ttfb + download };
}

export function project(lon: number, lat: number, width = 560, height = 310) {
  return { x: ((lon + 180) / 360) * width, y: ((90 - lat) / 180) * height };
}
