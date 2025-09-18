import { describe, it, expect } from 'vitest';
import { calculateDuration } from '../utils/calculateDuration.js';

describe('calculateDuration', () => {
  it('should calculate duration correctly for different pincodes', () => {
    expect(calculateDuration('100001', '100020')).toBe(19);
    expect(calculateDuration('100020', '100001')).toBe(19); 
    expect(calculateDuration('110001', '110005')).toBe(4);
  });

  it('should handle edge cases with modulo 24', () => {
    expect(calculateDuration('100001', '100025')).toBe(24 % 24); // 0
    expect(calculateDuration('100001', '100049')).toBe(48 % 24); // 0
  });
});