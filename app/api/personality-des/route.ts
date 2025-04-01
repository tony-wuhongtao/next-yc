import { NextResponse } from 'next/server';
import personalityDes from '@/data/personality_descriptions.json';

export async function GET() {
  return NextResponse.json(personalityDes);
}