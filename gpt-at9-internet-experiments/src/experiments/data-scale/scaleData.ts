export const scaleLevels = [
  {
    power: 0,
    label: '1 BYTE',
    realm: 'MICROSCOPIC INFORMATION',
    example: 'One ASCII character under UTF-8. Many other characters require more bytes.',
    color: 'phosphor',
  },
  {
    power: 1,
    label: 'KILO / KIBI',
    realm: 'SHORT TEXT',
    example: 'A small configuration file or a few paragraphs of plain text.',
  },
  {
    power: 2,
    label: 'MEGA / MEBI',
    realm: 'MEDIA OBJECT',
    example: 'A compressed photo, short audio sample, or application asset.',
  },
  {
    power: 3,
    label: 'GIGA / GIBI',
    realm: 'PERSONAL DEVICE',
    example: 'Applications, video, memory capacity, and everyday transfers.',
  },
  {
    power: 4,
    label: 'TERA / TEBI',
    realm: 'STORAGE DEVICE',
    example: 'A modern SSD, workstation dataset, or backup set.',
  },
  {
    power: 5,
    label: 'PETA / PEBI',
    realm: 'RACK / ENTERPRISE',
    example: 'Large storage clusters, research archives, or fleet telemetry.',
  },
  {
    power: 6,
    label: 'EXA / EXBI',
    realm: 'INFRASTRUCTURE',
    example: 'National-scale or hyperscale data estates and aggregate traffic.',
  },
] as const;
