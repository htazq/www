export type UnitSystem = 'SI' | 'IEC';

export const SI_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'] as const;
export const IEC_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'] as const;

export function unitBase(system: UnitSystem) {
  return system === 'SI' ? 1000 : 1024;
}

export function bytesForUnit(power: number, system: UnitSystem) {
  return unitBase(system) ** power;
}

export function convertBytes(bytes: number, power: number, system: UnitSystem) {
  return bytes / bytesForUnit(power, system);
}

export function autoUnit(bytes: number, system: UnitSystem) {
  const units = system === 'SI' ? SI_UNITS : IEC_UNITS;
  const base = unitBase(system);
  if (!Number.isFinite(bytes) || bytes <= 0) return { value: 0, unit: units[0], power: 0 };
  const power = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(base)));
  return { value: bytes / base ** power, unit: units[power], power };
}

export function estimateTextBytes(characters: number, bytesPerCharacter: number) {
  return Math.max(0, characters) * Math.max(0, bytesPerCharacter);
}

export function storageDeviceCount(bytes: number, capacityBytes: number) {
  if (capacityBytes <= 0) return 0;
  return bytes / capacityBytes;
}

export function formatNumber(value: number, digits = 3) {
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}
