# ASCII Banner 增强设计

## 概述

优化 ASCII Banner 的视觉效果，包括：
1. 添加更炫酷的 3D 立体字体
2. 新增 4 种艺术风格供 AI 图片生成

## 第 1 部分：ASCII 字体增强

### 目标

添加 ANSI Shadow 风格字体，实现粗笔画 + 斜角切边效果。

### 效果示例

```
 █████╗ ███████╗ ██████╗██╗██╗
██╔══██╗██╔════╝██╔════╝██║██║
███████║███████╗██║     ██║██║
██╔══██║╚════██║██║     ██║██║
██║  ██║███████║╚██████╗██║██║
╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝╚═╝
```

### 实现方式

1. 在 `lib/figlet.ts` 中新增 figlet 字体：
   - `ANSI Shadow` - 经典粗体斜角风格

2. 更新 `types/figlet.d.ts` 添加新字体的类型声明

3. 字体加载方式保持不变（懒加载 + require importable-fonts）

### 文件改动

| 文件 | 改动内容 |
|------|----------|
| `lib/figlet.ts` | 新增 ANSI Shadow 字体加载 |
| `types/figlet.d.ts` | 新增字体类型声明 |

## 第 2 部分：新增艺术风格

### 目标

在 `lib/prompt.ts` 中新增 4 种艺术风格供 AI 图片生成。

### 新增风格详情

| 风格 Key | 中文名 | 描述 | Prompt 关键词 |
|----------|--------|------|---------------|
| cyberpunk | 赛博朋克 | 霓虹色彩、未来都市、科技感 | cyberpunk style, neon lights, futuristic city backdrop, rain reflections, holographic effects, tech noir atmosphere |
| chrome | 金属铬金 | 反光金属质感、3D 立体字 | 3D chrome metal letters, reflective metallic surface, liquid metal effect, studio lighting, high polish finish |
| glitch | 故障艺术 | 数字故障、扭曲错位、RGB 偏移 | glitch art style, digital distortion, RGB color shift, scan lines, corrupted data aesthetic, vaporwave |
| flame | 火焰能量 | 燃烧效果、能量光芒 | flaming text effect, fire and embers, burning energy, sparks flying, molten lava glow, dramatic dark background |

### 文件改动

| 文件 | 改动内容 |
|------|----------|
| `lib/prompt.ts` | 新增 4 种艺术风格，扩展 ArtStyle 类型 |

## 测试验证

- 更新 `lib/__tests__/figlet.test.ts` 覆盖新字体
- 更新 `lib/__tests__/prompt.test.ts` 覆盖新风格

## 风险点

- ANSI Shadow 字体需确认 figlet 的 importable-fonts 中有提供，否则需要手动添加字体文件

## 不需要改动

- 前端组件（自动读取可用字体/风格列表）
- API 路由（逻辑不变）
- 图片生成逻辑（prompt 结构不变）
