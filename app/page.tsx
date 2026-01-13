'use client';

import { useState, useEffect, useCallback } from 'react';
import TextInput from '@/components/TextInput';
import FontSelector from '@/components/FontSelector';
import StyleSelector from '@/components/StyleSelector';
import AsciiPreview from '@/components/AsciiPreview';
import ResultDisplay from '@/components/ResultDisplay';
import Captcha from '@/components/Captcha';
import { FontName } from '@/lib/figlet';
import { ArtStyle } from '@/lib/prompt';

const FONTS: FontName[] = ['block', 'slim', 'banner'];

const STYLES = [
  { key: 'watercolor' as ArtStyle, name: '水彩', description: '柔和、流动、淡雅' },
  { key: 'oil' as ArtStyle, name: '油画', description: '厚重、笔触明显' },
  { key: 'pixel' as ArtStyle, name: '像素', description: '复古游戏感' },
  { key: 'neon' as ArtStyle, name: '霓虹', description: '发光、赛博朋克' },
  { key: 'graffiti' as ArtStyle, name: '涂鸦', description: '街头、喷漆质感' },
];

export default function Home() {
  const [text, setText] = useState('');
  const [font, setFont] = useState<FontName>('block');
  const [style, setStyle] = useState<ArtStyle>('watercolor');
  const [ascii, setAscii] = useState('');
  const [asciiLoading, setAsciiLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

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
      setCaptchaToken(null);
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">ASCII Banner Art</h1>
        <p className="text-gray-600 text-center mb-8">
          将文字转换为 ASCII 艺术，再用 AI 生成独特的艺术图片
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-4">
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
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
            />

            <button
              onClick={handleGenerate}
              disabled={!ascii || !captchaToken || imageLoading}
              className={`w-full py-4 font-medium rounded-lg transition-colors ${
                !ascii || !captchaToken || imageLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {imageLoading ? '生成中...' : '生成 AI 艺术图片'}
            </button>

            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            {remaining !== null && (
              <p className="text-gray-500 text-center text-sm">
                今日剩余次数: {remaining}
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

        <footer className="text-center text-gray-400 text-sm mt-8">
          Powered by figlet.js & Google Imagen AI
        </footer>
      </div>
    </main>
  );
}
