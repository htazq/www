export interface CityNode {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export const cities: CityNode[] = [
  { id: 'shanghai', name: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737 },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { id: 'mumbai', name: 'Mumbai', country: 'India', lat: 19.076, lon: 72.8777 },
  { id: 'frankfurt', name: 'Frankfurt', country: 'Germany', lat: 50.1109, lon: 8.6821 },
  { id: 'london', name: 'London', country: 'United Kingdom', lat: 51.5072, lon: -0.1276 },
  { id: 'virginia', name: 'Virginia', country: 'United States', lat: 37.4316, lon: -78.6569 },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    country: 'United States',
    lat: 34.0522,
    lon: -118.2437,
  },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', lat: -23.5558, lon: -46.6396 },
];

export const simplifiedLand = [
  'M35 55 L115 35 L170 62 L158 105 L108 128 L62 112 Z',
  'M135 142 L185 150 L205 210 L174 292 L145 236 Z',
  'M292 55 L350 36 L430 48 L470 90 L438 128 L370 116 L320 136 L278 98 Z',
  'M336 140 L390 134 L414 206 L377 275 L338 218 Z',
  'M452 176 L510 170 L540 205 L516 242 L468 228 Z',
] as const;
