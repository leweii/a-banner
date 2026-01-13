import { generateAscii, getAvailableFonts } from '../figlet';

describe('generateAscii', () => {
  it('should generate ASCII art from text with block font', async () => {
    const result = await generateAscii('HI', 'block');
    expect(result).toContain('█');
    expect(result.length).toBeGreaterThan(10);
  });

  it('should generate ASCII art with slim font', async () => {
    const result = await generateAscii('AB', 'slim');
    expect(result).toContain('/');
    expect(result.length).toBeGreaterThan(5);
  });

  it('should generate ASCII art with banner font', async () => {
    const result = await generateAscii('X', 'banner');
    expect(result).toContain('#');
    expect(result.length).toBeGreaterThan(10);
  });

  it('should throw error for empty text', async () => {
    await expect(generateAscii('', 'block')).rejects.toThrow('Text is required');
  });

  it('should handle unknown characters gracefully', async () => {
    const result = await generateAscii('A B', 'block');
    expect(result).toBeTruthy();
  });
});

describe('getAvailableFonts', () => {
  it('should return array of font names', () => {
    const fonts = getAvailableFonts();
    expect(Array.isArray(fonts)).toBe(true);
    expect(fonts).toContain('block');
    expect(fonts).toContain('slim');
    expect(fonts).toContain('banner');
    expect(fonts.length).toBe(3);
  });
});
