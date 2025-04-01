import { NextResponse } from 'next/server';
import personalityTypes from '@/data/personalityTypes.json';

export async function GET() {
  return NextResponse.json(personalityTypes);
}
