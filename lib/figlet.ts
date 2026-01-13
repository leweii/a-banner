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

// Parse and register all fonts
figlet.parseFont('Standard', standard);
figlet.parseFont('Banner', banner);
figlet.parseFont('Big', big);
figlet.parseFont('Block', block);
figlet.parseFont('Bubble', bubble);
figlet.parseFont('Digital', digital);
figlet.parseFont('Ivrit', ivrit);
figlet.parseFont('Lean', lean);
figlet.parseFont('Mini', mini);
figlet.parseFont('Script', script);
figlet.parseFont('Shadow', shadow);
figlet.parseFont('Slant', slant);
figlet.parseFont('Small', small);
figlet.parseFont('Star Wars', starWars);

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
