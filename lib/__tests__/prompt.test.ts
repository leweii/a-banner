import { buildPrompt, getAvailableStyles } from '../prompt';

describe('buildPrompt', () => {
  it('should build prompt with watercolor style', () => {
    const ascii = ' _   _ \n| | | |\n|_| |_|';
    const prompt = buildPrompt(ascii, 'watercolor');

    expect(prompt).toContain('watercolor');
    expect(prompt).toContain(ascii);
  });

  it('should include style description', () => {
    const prompt = buildPrompt('TEST', 'neon');
    expect(prompt).toContain('glowing');
    expect(prompt).toContain('neon');
  });
});

describe('getAvailableStyles', () => {
  it('should return all 9 styles', () => {
    const styles = getAvailableStyles();
    expect(styles).toHaveLength(9);
    expect(styles.map((s) => s.key)).toContain('watercolor');
    expect(styles.map((s) => s.key)).toContain('oil');
    expect(styles.map((s) => s.key)).toContain('pixel');
    expect(styles.map((s) => s.key)).toContain('neon');
    expect(styles.map((s) => s.key)).toContain('graffiti');
    expect(styles.map((s) => s.key)).toContain('cyberpunk');
    expect(styles.map((s) => s.key)).toContain('chrome');
    expect(styles.map((s) => s.key)).toContain('glitch');
    expect(styles.map((s) => s.key)).toContain('flame');
  });
});
