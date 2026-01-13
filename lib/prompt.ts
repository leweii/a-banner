export type ArtStyle = 'watercolor' | 'oil' | 'pixel' | 'neon' | 'graffiti';

interface StyleInfo {
  key: ArtStyle;
  name: string;
  description: string;
  prompt: string;
}

const STYLES: Record<ArtStyle, StyleInfo> = {
  watercolor: {
    key: 'watercolor',
    name: '水彩',
    description: '柔和、流动、淡雅',
    prompt: 'watercolor painting style, soft edges, flowing colors, delicate washes, artistic',
  },
  oil: {
    key: 'oil',
    name: '油画',
    description: '厚重、笔触明显',
    prompt: 'oil painting style, visible brush strokes, rich textures, impasto technique, classical',
  },
  pixel: {
    key: 'pixel',
    name: '像素',
    description: '复古游戏感',
    prompt: 'pixel art style, 8-bit retro game aesthetic, blocky pixels, vibrant colors, nostalgic',
  },
  neon: {
    key: 'neon',
    name: '霓虹',
    description: '发光、赛博朋克',
    prompt: 'neon sign style, glowing lights, dark background, cyberpunk aesthetic, electric colors',
  },
  graffiti: {
    key: 'graffiti',
    name: '涂鸦',
    description: '街头、喷漆质感',
    prompt: 'street graffiti style, spray paint effect, urban wall, bold colors, street art',
  },
};

export function getAvailableStyles(): StyleInfo[] {
  return Object.values(STYLES);
}

export function buildPrompt(ascii: string, style: ArtStyle): string {
  const styleInfo = STYLES[style];

  return `Create an artistic typography image based on this ASCII art text:

${ascii}

Transform this ASCII art into a beautiful ${styleInfo.prompt}.

Requirements:
- Keep the text clearly readable and prominent
- Apply the artistic style to the entire composition
- Make it visually striking and suitable for sharing
- High quality, detailed artwork`;
}
