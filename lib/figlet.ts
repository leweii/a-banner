/* eslint-disable @typescript-eslint/no-require-imports */
// Use require to ensure fonts are loaded synchronously at runtime

const figlet = require('figlet');

// Force load fonts immediately using require (not import)
const fonts: Record<string, string> = {
  'Standard': require('figlet/importable-fonts/Standard').default,
  'Banner': require('figlet/importable-fonts/Banner').default,
  'Big': require('figlet/importable-fonts/Big').default,
  'Block': require('figlet/importable-fonts/Block').default,
  'Bubble': require('figlet/importable-fonts/Bubble').default,
  'Digital': require('figlet/importable-fonts/Digital').default,
  'Ivrit': require('figlet/importable-fonts/Ivrit').default,
  'Lean': require('figlet/importable-fonts/Lean').default,
  'Mini': require('figlet/importable-fonts/Mini').default,
  'Script': require('figlet/importable-fonts/Script').default,
  'Shadow': require('figlet/importable-fonts/Shadow').default,
  'Slant': require('figlet/importable-fonts/Slant').default,
  'Small': require('figlet/importable-fonts/Small').default,
  'Star Wars': require('figlet/importable-fonts/Star Wars').default,
};

// Parse all fonts immediately
for (const [name, data] of Object.entries(fonts)) {
  figlet.parseFont(name, data);
}

const AVAILABLE_FONTS = [
  'Standard',
  'Banner',
  'Big',
  'Block',
  'Bubble',
  'Digital',
  'Ivrit',
  'Lean',
  'Mini',
  'Script',
  'Shadow',
  'Slant',
  'Small',
  'Star Wars',
] as const;

export type FontName = (typeof AVAILABLE_FONTS)[number];

export function getAvailableFonts(): FontName[] {
  return [...AVAILABLE_FONTS];
}

export async function generateAscii(text: string, font: FontName = 'Standard'): Promise<string> {
  if (!text || text.trim() === '') {
    throw new Error('Text is required');
  }

  // Re-parse font just before use to ensure it's loaded
  if (fonts[font]) {
    figlet.parseFont(font, fonts[font]);
  }

  return figlet.textSync(text, { font });
}
