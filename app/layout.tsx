import type { Metadata } from 'next';
import { ZCOOL_KuaiLe, Caveat, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const zcool = ZCOOL_KuaiLe({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-zcool',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'ASCII 艺术画生成器',
  description: '将文字转换为 ASCII 艺术，再用 AI 生成独特的艺术图片',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={`${zcool.variable} ${caveat.variable} ${jetbrains.variable}`}>{children}</body>
    </html>
  );
}
