import {
  autoUnit,
  bytesForUnit,
  convertBytes,
  estimateTextBytes,
  storageDeviceCount,
} from './scaleMath';

describe('Data Scale conversion', () => {
  it('distinguishes SI and IEC units', () => {
    expect(bytesForUnit(2, 'SI')).toBe(1_000_000);
    expect(bytesForUnit(2, 'IEC')).toBe(1_048_576);
    expect(convertBytes(1_000_000, 2, 'SI')).toBe(1);
  });
  it('selects an appropriate unit', () => {
    expect(autoUnit(1_000_000_000, 'SI')).toMatchObject({ value: 1, unit: 'GB' });
    expect(autoUnit(1_073_741_824, 'IEC')).toMatchObject({ value: 1, unit: 'GiB' });
  });
  it('estimates variable-width text explicitly', () => {
    expect(estimateTextBytes(100, 1)).toBe(100);
    expect(estimateTextBytes(100, 3)).toBe(300);
  });
  it('calculates storage device counts', () =>
    expect(storageDeviceCount(7.68e12, 3.84e12)).toBe(2));
});
