import figlet from 'figlet';

// Import fonts as modules (works on Vercel serverless)
import standard from 'figlet/importable-fonts/Standard';
import banner from 'figlet/importable-fonts/Banner';
import big from 'figlet/importable-fonts/Big';
import block from 'figlet/importable-fonts/Block';
import bubble from 'figlet/importable-fonts/Bubble';
import digital from 'figlet/importable-fonts/Digital';
import ivrit from 'figlet/importable-fonts/Ivrit';
import lean from 'figlet/importable-fonts/Lean';
import mini from 'figlet/importable-fonts/Mini';
import script from 'figlet/importable-fonts/Script';
import shadow from 'figlet/importable-fonts/Shadow';
import slant from 'figlet/importable-fonts/Slant';
import small from 'figlet/importable-fonts/Small';
import starWars from 'figlet/importable-fonts/Star Wars';

// Font data map
const FONT_DATA: Record<string, string> = {
  Standard: standard,
  Banner: banner,
  Big: big,
  Block: block,
  Bubble: bubble,
  Digital: digital,
  Ivrit: ivrit,
  Lean: lean,
  Mini: mini,
  Script: script,
  Shadow: shadow,
  Slant: slant,
  Small: small,
  'Star Wars': starWars,
};

// Track loaded fonts
const loadedFonts = new Set<string>();

function ensureFontLoaded(fontName: string): void {
  if (!loadedFonts.has(fontName)) {
    const fontData = FONT_DATA[fontName];
    if (fontData) {
      figlet.parseFont(fontName, fontData);
      loadedFonts.add(fontName);
    }
  }
}

// Pre-load all fonts immediately
Object.keys(FONT_DATA).forEach((fontName) => {
  ensureFontLoaded(fontName);
});

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

  // Ensure font is loaded before use
  ensureFontLoaded(font);

  return new Promise((resolve, reject) => {
    figlet.text(text, { font }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result || '');
    });
  });
}
