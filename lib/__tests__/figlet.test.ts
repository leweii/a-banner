import { generateAscii, getAvailableFonts } from '../figlet';

describe('generateAscii', () => {
  it('should generate ASCII art from text', async () => {
    const result = await generateAscii('Hi', 'Standard');
    expect(result).toContain('_');
    expect(result).toContain('|');
    expect(result.length).toBeGreaterThan(10);
  });

  it('should throw error for empty text', async () => {
    await expect(generateAscii('', 'Standard')).rejects.toThrow('Text is required');
  });
});

describe('getAvailableFonts', () => {
  it('should return array of font names', () => {
    const fonts = getAvailableFonts();
    expect(Array.isArray(fonts)).toBe(true);
    expect(fonts).toContain('Standard');
    expect(fonts).toContain('ANSI Shadow');
    expect(fonts.length).toBeGreaterThan(0);
  });
});
