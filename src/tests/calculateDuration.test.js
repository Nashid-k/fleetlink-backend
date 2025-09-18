import { describe, it, expect } from 'vitest';
import { calculateDuration } from '../utils/calculateDuration.js';

describe('calculateDuration', () => {
  it('calculates duration between pincodes', () => {
    expect(calculateDuration('100001', '100020')).toBe(19);
    expect(calculateDuration('100020', '100001')).toBe(19);
    expect(calculateDuration('110001', '110005')).toBe(4);
  });

  it('handles edge cases with modulo 24', () => {
    expect(calculateDuration('100001', '100025')).toBe(0);
    expect(calculateDuration('100001', '100049')).toBe(0);
  });
});
