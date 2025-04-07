import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 20;

  const logs = await prisma.log.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      ip: true,
      url: true,
      client: true,
      createdAt: true,
    },
  });

  const total = await prisma.log.count();

  return Response.json({ logs, total });
}
