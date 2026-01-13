/* eslint-disable @typescript-eslint/no-require-imports */
// Use require to ensure fonts are loaded synchronously at runtime

const figlet = require('figlet');

// Font data - loaded lazily to ensure proper initialization on serverless
let fontsLoaded = false;
const fontData: Record<string, string> = {};

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
] as const;

export type FontName = (typeof AVAILABLE_FONTS)[number];

// Load and parse all fonts - called before any font usage
function ensureFontsLoaded(): void {
  if (fontsLoaded) {
    console.log('[Figlet] Fonts already loaded');
    return;
  }

  console.log('[Figlet] Loading fonts...');

  try {
    // Load each font from importable-fonts (these are bundled ES modules, not file reads)
    fontData['Standard'] = require('figlet/importable-fonts/Standard').default;
    fontData['Banner'] = require('figlet/importable-fonts/Banner').default;
    fontData['Big'] = require('figlet/importable-fonts/Big').default;
    fontData['Block'] = require('figlet/importable-fonts/Block').default;
    fontData['Bubble'] = require('figlet/importable-fonts/Bubble').default;
    fontData['Digital'] = require('figlet/importable-fonts/Digital').default;
    fontData['Ivrit'] = require('figlet/importable-fonts/Ivrit').default;
    fontData['Lean'] = require('figlet/importable-fonts/Lean').default;
    fontData['Mini'] = require('figlet/importable-fonts/Mini').default;
    fontData['Script'] = require('figlet/importable-fonts/Script').default;
    fontData['Shadow'] = require('figlet/importable-fonts/Shadow').default;
    fontData['Slant'] = require('figlet/importable-fonts/Slant').default;
    fontData['Small'] = require('figlet/importable-fonts/Small').default;

    console.log('[Figlet] Font data loaded, parsing fonts...');

    // Parse each font into figlet's internal cache
    for (const [name, data] of Object.entries(fontData)) {
      console.log(`[Figlet] Parsing font: ${name}`);
      figlet.parseFont(name, data);
    }

    fontsLoaded = true;
    console.log('[Figlet] All fonts loaded and parsed successfully');
  } catch (error) {
    console.error('[Figlet] Error loading fonts:', error);
    throw error;
  }
}

export function getAvailableFonts(): FontName[] {
  return [...AVAILABLE_FONTS];
}

export async function generateAscii(text: string, font: FontName = 'Standard'): Promise<string> {
  console.log(`[Figlet] generateAscii called with text="${text}", font="${font}"`);

  if (!text || text.trim() === '') {
    throw new Error('Text is required');
  }

  // Ensure fonts are loaded before use
  ensureFontsLoaded();

  // Re-parse the specific font just before use to ensure it's in figlet's cache
  if (fontData[font]) {
    console.log(`[Figlet] Re-parsing font ${font} before use`);
    figlet.parseFont(font, fontData[font]);
  } else {
    console.error(`[Figlet] Font ${font} not found in fontData`);
    throw new Error(`Font ${font} not available`);
  }

  try {
    console.log(`[Figlet] Calling textSync with font ${font}`);
    const result = figlet.textSync(text, { font });
    console.log(`[Figlet] textSync completed, result length: ${result.length}`);
    return result;
  } catch (error) {
    console.error(`[Figlet] textSync error:`, error);
    throw error;
  }
}
