/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrompt, ArtStyle } from './prompt';

export interface ImageResult {
  imageData: string;
  mimeType: string;
}

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    console.log('[Imagen] Checking API key:', apiKey ? 'Found (length: ' + apiKey.length + ')' : 'NOT FOUND');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not configured. Please add it to your environment variables.');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateArtImage(ascii: string, style: ArtStyle): Promise<ImageResult> {
  console.log('[Imagen] Starting image generation...');
  console.log('[Imagen] Style:', style);
  console.log('[Imagen] ASCII length:', ascii.length);

  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });
  console.log('[Imagen] Model initialized');

  const prompt = buildPrompt(ascii, style);
  console.log('[Imagen] Prompt built, length:', prompt.length);

  try {
    console.log('[Imagen] Calling Google AI API...');
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['image', 'text'],
      } as any,
    });
    console.log('[Imagen] API response received');

    const response = result.response;
    const candidate = response.candidates?.[0];

    if (!candidate?.content?.parts) {
      console.error('[Imagen] No candidates in response:', JSON.stringify(response, null, 2));
      throw new Error('No image generated - empty response from API');
    }

    console.log('[Imagen] Found', candidate.content.parts.length, 'parts in response');

    for (const part of candidate.content.parts) {
      if ('inlineData' in part && part.inlineData) {
        console.log('[Imagen] Found image data, mimeType:', part.inlineData.mimeType);
        return {
          imageData: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'image/png',
        };
      }
    }

    console.error('[Imagen] No image data found in parts');
    throw new Error('No image data in response');
  } catch (error) {
    console.error('[Imagen] API call failed:', error);
    throw error;
  }
}
