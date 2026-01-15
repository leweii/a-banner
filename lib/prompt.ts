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
    prompt: 'watercolor painting masterpiece, soft wet-on-wet technique, flowing pigments bleeding into paper, delicate color washes with subtle gradients, loose expressive brushwork, luminous transparency, dreamy ethereal atmosphere, artistic splatter effects',
  },
  oil: {
    key: 'oil',
    name: '油画',
    description: '厚重、笔触明显',
    prompt: 'oil painting masterpiece in the style of impressionist masters, thick impasto brushstrokes with visible texture, rich saturated colors, dramatic chiaroscuro lighting, canvas texture visible, museum quality artwork, painterly depth and dimension',
  },
  pixel: {
    key: 'pixel',
    name: '像素',
    description: '复古游戏感',
    prompt: 'pixel art masterpiece, 16-bit retro game aesthetic with dithering techniques, carefully placed pixels, limited color palette with maximum impact, nostalgic arcade vibes, crisp pixel-perfect details, iconic video game atmosphere',
  },
  neon: {
    key: 'neon',
    name: '霓虹',
    description: '发光、赛博朋克',
    prompt: 'neon art masterpiece, brilliant glowing tubes against deep darkness, electric pink and cyan light bleeding into atmosphere, light reflections on wet surfaces, humming fluorescent energy, retro-futuristic noir mood, vibrant light trails',
  },
  graffiti: {
    key: 'graffiti',
    name: '涂鸦',
    description: '街头、喷漆质感',
    prompt: 'street art graffiti masterpiece, bold spray paint strokes with dripping effects, urban concrete texture, vibrant wildstyle lettering influence, stencil art elements, raw street culture energy, weathered wall aesthetic',
  },
  cyberpunk: {
    key: 'cyberpunk',
    name: '赛博朋克',
    description: '霓虹色彩、未来都市、科技感',
    prompt: 'cyberpunk masterpiece, neon-soaked dystopian atmosphere, holographic advertisements flickering, rain-slicked streets with light reflections, flying vehicles in distance, tech noir cinematography, Blade Runner inspired aesthetic, atmospheric fog and haze',
  },
  chrome: {
    key: 'chrome',
    name: '金属铬金',
    description: '反光金属质感、3D立体字',
    prompt: '3D chrome masterpiece, liquid mercury reflections, mirror-polished metallic surfaces catching dramatic studio lighting, environmental reflections in metal, sculptural depth and dimension, high-end product photography quality, pristine finish',
  },
  glitch: {
    key: 'glitch',
    name: '故障艺术',
    description: '数字故障、扭曲错位、RGB偏移',
    prompt: 'glitch art masterpiece, corrupted digital aesthetics, RGB channel separation with chromatic aberration, scan line distortions, data moshing effects, vaporwave color palette, CRT monitor artifacts, broken pixel patterns, surreal digital decay',
  },
  flame: {
    key: 'flame',
    name: '火焰能量',
    description: '燃烧效果、能量光芒',
    prompt: 'fire and flame masterpiece, blazing inferno with dancing flames, glowing embers floating upward, intense orange and red gradients, dramatic rim lighting, smoke wisps curling, molten energy core, phoenix-like radiance against darkness',
  },
};

export function getAvailableStyles(): StyleInfo[] {
  return Object.values(STYLES);
}

// 场景元素池，用于随机生成前景、背景、光照和氛围
const SCENE_ELEMENTS = {
  foreground: [
    'silhouettes of people walking with long shadows',
    'a lone figure gazing upward in contemplation',
    'children chasing butterflies through wildflowers',
    'a couple sharing an umbrella in soft rain',
    'a vintage bicycle leaning against a lamp post',
    'a graceful cat perched on a windowsill',
    'birds taking flight from tall grass',
    'scattered autumn leaves dancing in wind',
    'blooming cherry blossom petals drifting',
    'a street musician playing violin',
    'lanterns glowing warmly at dusk',
    'a red phone booth covered in ivy',
    'cobblestone path winding through flowers',
    'dewdrops glistening on spider webs',
  ],
  background: [
    'majestic snow-capped mountain peaks',
    'rolling lavender fields stretching to horizon',
    'a cascading waterfall catching rainbow light',
    'ancient forest with sunbeams through canopy',
    'mirror-still lake reflecting the sky',
    'dramatic cloudscape with silver linings',
    'a winding river through autumn valley',
    'mysterious ancient temple ruins overgrown with vines',
    'windmills silhouetted against sunset',
    'colorful hot air balloons dotting the sky',
    'northern lights dancing in polar sky',
    'a lighthouse on rocky cliff by sea',
    'terraced rice paddies in golden hour',
    'floating islands among clouds',
  ],
  lighting: [
    'golden hour sunlight casting warm glow',
    'dramatic sunset with orange and purple sky',
    'soft diffused light through morning mist',
    'blue hour twilight with first stars appearing',
    'dappled sunlight filtering through leaves',
    'moonlit scene with silver highlights',
    'rays of light breaking through storm clouds',
    'warm candlelit ambiance',
  ],
  atmosphere: [
    'gentle morning fog rolling across the scene',
    'dust particles floating in sunbeams',
    'light rain creating ripples and reflections',
    'autumn haze with warm golden tones',
    'crisp winter air with breath visible',
    'magical fireflies twinkling at dusk',
    'petals and leaves swirling in breeze',
    'soft bokeh lights in background',
  ],
};

function getRandomElements(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function buildPrompt(ascii: string, style: ArtStyle): string {
  const styleInfo = STYLES[style];

  // 随机选择场景元素
  const foregroundElements = getRandomElements(SCENE_ELEMENTS.foreground, Math.floor(Math.random() * 2) + 1);
  const backgroundElements = getRandomElements(SCENE_ELEMENTS.background, Math.floor(Math.random() * 2) + 1);
  const lightingElement = getRandomElements(SCENE_ELEMENTS.lighting, 1)[0];
  const atmosphereElement = getRandomElements(SCENE_ELEMENTS.atmosphere, 1)[0];

  return `Create a breathtaking artistic masterpiece featuring a monumental banner as the centerpiece.

The banner proudly displays this text in LARGE, BOLD, CLEAR letters:
${ascii}

CINEMATIC COMPOSITION:
- FOCAL POINT: A grand, elegant banner or billboard majestically positioned in the mid-ground, displaying the text above
- FOREGROUND (intimate detail): ${foregroundElements.join(', ')}
- BACKGROUND (epic vista): ${backgroundElements.join(', ')}
- LIGHTING: ${lightingElement}
- ATMOSPHERE: ${atmosphereElement}

ARTISTIC STYLE: ${styleInfo.prompt}

CRITICAL TEXT REQUIREMENTS:
- The text on the banner MUST be the main focal point, taking up at least 40% of the image
- Text must be LARGE, BOLD, and CRYSTAL CLEAR with high contrast against the banner background
- Each letter must be perfectly legible and sharp, not blurry or artistic distortion
- Use solid, thick lettering style - no thin strokes or decorative fonts that reduce readability
- The banner background should be a solid contrasting color to make text pop

ARTISTIC EXCELLENCE:
- Apply cinematic depth of field with sharp mid-ground and artistically blurred fore/background
- Use rule of thirds composition for maximum visual impact
- Create rich visual storytelling through layered elements
- Employ dramatic ${styleInfo.name} style rendering for the environment
- Aim for award-winning photography/illustration quality
- Include subtle details that reward closer viewing
- Balance complexity with elegant simplicity`;
}
