import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: Request) {
  const {
    name,
    testType,
    I,
    E,
    S,
    N,
    T,
    F,
    J,
    P,
    content
  } = await request.json();

  try {
    const report = await prisma.report.create({
      data: {
        name,
        testType,
        I,
        E,
        S,
        N,
        T,
        F,
        J,
        P,
        content
      }
    });

    return NextResponse.json({ id: report.id });
  } catch (error) {
    console.error('创建报告失败:', error);
    return NextResponse.json({ error: '创建报告失败' }, { status: 500 });
  }
}
