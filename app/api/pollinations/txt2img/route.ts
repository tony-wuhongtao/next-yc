import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt, width = 1024, height = 1024, seed = 42, model = 'flux' } = await request.json();
  
  try {
    const url = `https://pollinations.ai/p/${prompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true`;
    const response = await fetch(url);
    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
