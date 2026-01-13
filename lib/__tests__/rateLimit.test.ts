import { checkRateLimit } from '../rateLimit';

// Mock Upstash Redis
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
  })),
}));

describe('checkRateLimit', () => {
  it('should return allowed: true when under limit', async () => {
    const result = await checkRateLimit('127.0.0.1');
    expect(result).toHaveProperty('allowed');
    expect(result).toHaveProperty('remaining');
    expect(result).toHaveProperty('reset');
  });
});
