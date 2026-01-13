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
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateArtImage(ascii: string, style: ArtStyle): Promise<ImageResult> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });

  const prompt = buildPrompt(ascii, style);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['image', 'text'],
    } as any,
  });

  const response = result.response;
  const candidate = response.candidates?.[0];

  if (!candidate?.content?.parts) {
    throw new Error('No image generated');
  }

  for (const part of candidate.content.parts) {
    if ('inlineData' in part && part.inlineData) {
      return {
        imageData: part.inlineData.data,
        mimeType: part.inlineData.mimeType || 'image/png',
      };
    }
  }

  throw new Error('No image data in response');
}
