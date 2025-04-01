import { NextResponse } from 'next/server';
import { usePollinationsText } from '@pollinations/react';

export async function POST(request: Request) {
  const { text, seed = 42, model = 'openai', systemPrompt = "You are a helpful AI assistant." } = await request.json();
  
  const translatedText = await usePollinationsText(
    `Translate the Chinese text after the colon into English:${text}`, 
    {
      seed,
      model,
      systemPrompt
    }
  );

  return NextResponse.json({ translatedText });
}
