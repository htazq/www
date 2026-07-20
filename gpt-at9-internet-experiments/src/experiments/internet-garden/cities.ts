export interface CityNode {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export const cities: CityNode[] = [
  { id: 'shanghai', name: '上海', country: '中国', lat: 31.2304, lon: 121.4737 },
  { id: 'singapore', name: '新加坡', country: '新加坡', lat: 1.3521, lon: 103.8198 },
  { id: 'tokyo', name: '东京', country: '日本', lat: 35.6762, lon: 139.6503 },
  { id: 'sydney', name: '悉尼', country: '澳大利亚', lat: -33.8688, lon: 151.2093 },
  { id: 'mumbai', name: '孟买', country: '印度', lat: 19.076, lon: 72.8777 },
  { id: 'frankfurt', name: '法兰克福', country: '德国', lat: 50.1109, lon: 8.6821 },
  { id: 'london', name: '伦敦', country: '英国', lat: 51.5072, lon: -0.1276 },
  { id: 'virginia', name: '弗吉尼亚', country: '美国', lat: 37.4316, lon: -78.6569 },
  { id: 'los-angeles', name: '洛杉矶', country: '美国', lat: 34.0522, lon: -118.2437 },
  { id: 'sao-paulo', name: '圣保罗', country: '巴西', lat: -23.5558, lon: -46.6396 },
];

export const simplifiedLand = [
  'M35 55 L115 35 L170 62 L158 105 L108 128 L62 112 Z',
  'M135 142 L185 150 L205 210 L174 292 L145 236 Z',
  'M292 55 L350 36 L430 48 L470 90 L438 128 L370 116 L320 136 L278 98 Z',
  'M336 140 L390 134 L414 206 L377 275 L338 218 Z',
  'M452 176 L510 170 L540 205 L516 242 L468 228 Z',
] as const;
