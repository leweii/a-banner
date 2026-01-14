'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import TextInput from '@/components/TextInput';
import FontSelector from '@/components/FontSelector';
import StyleSelector from '@/components/StyleSelector';
import AsciiPreview from '@/components/AsciiPreview';
import ResultDisplay from '@/components/ResultDisplay';
import Captcha, { CaptchaHandle } from '@/components/Captcha';
import { FontName } from '@/lib/figlet';
import { ArtStyle } from '@/lib/prompt';

const FONTS: FontName[] = [
  'Standard', 'ANSI Shadow', 'Banner', 'Big', 'Block', 'Bubble',
  'Digital', 'Ivrit', 'Lean', 'Mini', 'Script',
  'Shadow', 'Slant', 'Small',
];

const STYLES = [
  { key: 'watercolor' as ArtStyle, name: '水彩', description: '柔和、流动、淡雅', color: '#A8D8EA' },
  { key: 'oil' as ArtStyle, name: '油画', description: '厚重、笔触明显', color: '#8B7355' },
  { key: 'pixel' as ArtStyle, name: '像素', description: '复古游戏感', color: '#7FCD91' },
  { key: 'neon' as ArtStyle, name: '霓虹', description: '发光、赛博朋克', color: '#FF6B9D' },
  { key: 'graffiti' as ArtStyle, name: '涂鸦', description: '街头、喷漆质感', color: '#FFA07A' },
  { key: 'cyberpunk' as ArtStyle, name: '赛博朋克', description: '霓虹、未来都市', color: '#00D4FF' },
  { key: 'chrome' as ArtStyle, name: '金属铬金', description: '反光金属质感', color: '#C0C0C0' },
  { key: 'glitch' as ArtStyle, name: '故障艺术', description: '数字故障、RGB偏移', color: '#FF00FF' },
  { key: 'flame' as ArtStyle, name: '火焰能量', description: '燃烧效果、能量光芒', color: '#FF4500' },
];

export default function Home() {
  const [text, setText] = useState('');
  const [font, setFont] = useState<FontName>('Standard');
  const [style, setStyle] = useState<ArtStyle>('watercolor');
  const [ascii, setAscii] = useState('');
  const [asciiLoading, setAsciiLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const captchaRef = useRef<CaptchaHandle>(null);

  // Debounced ASCII generation
  useEffect(() => {
    if (!text.trim()) {
      setAscii('');
      return;
    }

    const timer = setTimeout(async () => {
      setAsciiLoading(true);
      try {
        const response = await fetch('/api/banner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, font }),
        });
        const data = await response.json();
        if (data.ascii) {
          setAscii(data.ascii);
        }
      } catch (err) {
        console.error('ASCII generation failed:', err);
      } finally {
        setAsciiLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [text, font]);

  const handleGenerate = useCallback(async () => {
    if (!ascii || !captchaToken) {
      setError('请先输入文字并完成验证');
      return;
    }

    setError(null);
    setImageLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ascii, style, captchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Generation failed');
        return;
      }

      setImageUrl(data.imageUrl);
      setRemaining(data.remaining);
    } catch (err) {
      setError('生成失败，请重试');
      console.error('Generation error:', err);
    } finally {
      setImageLoading(false);
      // hCaptcha token 是一次性的，用完后需要重新验证
      setCaptchaToken(null);
      captchaRef.current?.reset();
    }
  }, [ascii, style, captchaToken]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ascii-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl]);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="title-handwriting text-4xl mb-2">
            ASCII 艺术画生成器
          </h1>
          <p className="title-handwriting-en text-xl">
            Create your unique art
          </p>
        </header>

        {/* Main Content */}
        <div className="paper-card p-6 space-y-8">
          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <TextInput value={text} onChange={setText} />
            <FontSelector value={font} onChange={setFont} fonts={FONTS} />
          </div>

          {/* ASCII Preview */}
          <AsciiPreview ascii={ascii} loading={asciiLoading} />

          {/* Style Selection */}
          <StyleSelector value={style} onChange={setStyle} styles={STYLES} />

          {/* Captcha & Generate */}
          <div className="space-y-4">
            <Captcha
              ref={captchaRef}
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
            />

            <button
              onClick={handleGenerate}
              disabled={!ascii || !captchaToken || imageLoading}
              className="w-full btn-journal text-lg"
            >
              {imageLoading ? '生成中...' : '生成艺术图片'}
            </button>

            {error && (
              <p className="text-red-500 text-center title-handwriting">{error}</p>
            )}

            {remaining !== null && (
              <p className="text-center text-sm title-handwriting-en" style={{ color: 'var(--text-secondary)' }}>
                Today remaining: {remaining}
              </p>
            )}
          </div>

          {/* Result */}
          <ResultDisplay
            imageUrl={imageUrl}
            loading={imageLoading}
            onDownload={handleDownload}
          />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 title-handwriting-en text-sm" style={{ color: 'var(--text-secondary)' }}>
          Powered by figlet.js & Google Imagen AI
        </footer>
      </div>
    </main>
  );
}
