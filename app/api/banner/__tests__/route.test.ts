import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('POST /api/banner', () => {
  it('should generate ASCII banner', async () => {
    const request = new NextRequest('http://localhost/api/banner', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hi', font: 'Standard' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ascii).toBeDefined();
    expect(data.ascii.length).toBeGreaterThan(0);
  });

  it('should return 400 for empty text', async () => {
    const request = new NextRequest('http://localhost/api/banner', {
      method: 'POST',
      body: JSON.stringify({ text: '', font: 'Standard' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should return 400 for invalid font', async () => {
    const request = new NextRequest('http://localhost/api/banner', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hello', font: 'InvalidFont' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('invalid_font');
    expect(data.message).toContain('Invalid font');
  });

  it('should return 400 for malformed JSON', async () => {
    const request = new NextRequest('http://localhost/api/banner', {
      method: 'POST',
      body: 'this is not valid json{',
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('invalid_json');
  });
});
