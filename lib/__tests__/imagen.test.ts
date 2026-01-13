import { generateArtImage } from '../imagen';

// Mock Google AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          candidates: [
            {
              content: {
                parts: [{ inlineData: { data: 'base64data', mimeType: 'image/png' } }],
              },
            },
          ],
        },
      }),
    }),
  })),
}));

describe('generateArtImage', () => {
  beforeAll(() => {
    process.env.GOOGLE_AI_API_KEY = 'test-api-key';
  });

  it('should return base64 image data', async () => {
    const result = await generateArtImage('ASCII ART', 'watercolor');
    expect(result).toHaveProperty('imageData');
    expect(result).toHaveProperty('mimeType');
  });
});
