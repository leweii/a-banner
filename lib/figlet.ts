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

// Font data map - ensures imports are not tree-shaken
const FONT_DATA: { [key: string]: string } = {
  'Standard': standard,
  'Banner': banner,
  'Big': big,
  'Block': block,
  'Bubble': bubble,
  'Digital': digital,
  'Ivrit': ivrit,
  'Lean': lean,
  'Mini': mini,
  'Script': script,
  'Shadow': shadow,
  'Slant': slant,
  'Small': small,
  'Star Wars': starWars,
};

// Initialize all fonts immediately - this runs on module load
let fontsInitialized = false;

function initializeFonts(): void {
  if (fontsInitialized) return;

  Object.entries(FONT_DATA).forEach(([fontName, fontData]) => {
    try {
      figlet.parseFont(fontName, fontData);
    } catch (e) {
      console.error(`Failed to parse font ${fontName}:`, e);
    }
  });

  fontsInitialized = true;
}

// Initialize on module load
initializeFonts();

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

  // Ensure fonts are loaded (idempotent)
  initializeFonts();

  // Use synchronous version since fonts are preloaded
  try {
    const result = figlet.textSync(text, { font });
    return result;
  } catch {
    // Fallback to async version
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
}
