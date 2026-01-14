export type ArtStyle = 'watercolor' | 'oil' | 'pixel' | 'neon' | 'graffiti' | 'cyberpunk' | 'chrome' | 'glitch' | 'flame';

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
  cyberpunk: {
    key: 'cyberpunk',
    name: '赛博朋克',
    description: '霓虹色彩、未来都市、科技感',
    prompt: 'cyberpunk style, neon lights, futuristic city backdrop, rain reflections, holographic effects, tech noir atmosphere',
  },
  chrome: {
    key: 'chrome',
    name: '金属铬金',
    description: '反光金属质感、3D立体字',
    prompt: '3D chrome metal letters, reflective metallic surface, liquid metal effect, studio lighting, high polish finish',
  },
  glitch: {
    key: 'glitch',
    name: '故障艺术',
    description: '数字故障、扭曲错位、RGB偏移',
    prompt: 'glitch art style, digital distortion, RGB color shift, scan lines, corrupted data aesthetic, vaporwave',
  },
  flame: {
    key: 'flame',
    name: '火焰能量',
    description: '燃烧效果、能量光芒',
    prompt: 'flaming text effect, fire and embers, burning energy, sparks flying, molten lava glow, dramatic dark background',
  },
};

export function getAvailableStyles(): StyleInfo[] {
  return Object.values(STYLES);
}

// 场景元素池，用于随机生成前景和背景
const SCENE_ELEMENTS = {
  foreground: [
    'people walking',
    'a person looking up',
    'children playing',
    'a couple holding hands',
    'a cyclist riding by',
    'a cat sitting',
    'a dog running',
    'birds flying low',
    'flowers and grass',
    'a street vendor',
  ],
  background: [
    'distant mountains',
    'rolling hills',
    'a waterfall cascading',
    'tall trees and forest',
    'a calm lake',
    'floating clouds',
    'a river flowing',
    'ancient ruins',
    'windmills on hills',
    'hot air balloons in sky',
  ],
};

function getRandomElements(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function buildPrompt(ascii: string, style: ArtStyle): string {
  const styleInfo = STYLES[style];

  // 随机选择 1-2 个前景元素和 1-2 个背景元素
  const foregroundElements = getRandomElements(SCENE_ELEMENTS.foreground, Math.floor(Math.random() * 2) + 1);
  const backgroundElements = getRandomElements(SCENE_ELEMENTS.background, Math.floor(Math.random() * 2) + 1);

  return `Create a scenic landscape image with a giant banner in the mid-ground.

The banner displays this ASCII art text:
${ascii}

Scene composition:
- MID-GROUND: A massive billboard or canvas banner prominently displaying the text above, clearly readable
- FOREGROUND (close to viewer): ${foregroundElements.join(', ')}
- BACKGROUND (far distance): ${backgroundElements.join(', ')}

Art style: ${styleInfo.prompt}

Requirements:
- The banner with text must be the focal point, large and clearly visible
- Create depth with foreground elements closer to viewer and background elements in the distance
- Apply the ${styleInfo.name} artistic style consistently across the entire scene
- Make it visually striking, immersive, and suitable for sharing
- High quality, detailed artwork with rich atmosphere`;
}
