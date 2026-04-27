import { describe, it, expect } from 'vitest';
import { healthCheck } from '../../src/shared/health';

describe('healthCheck', () => {
    it('should return true when application is healthy', () => {
    expect(healthCheck()).toBe(true);
    });
});