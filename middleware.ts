import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const url = new URL(request.url);

  // 获取用户IP
  const ip =
    request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");

  // 获取访问URL的路径和查询参数
  const pathWithQuery = url.pathname + url.search;

  // 获取用户代理信息
  const client = request.headers.get("user-agent") || "unknown";

  // 获取当前请求的完整域名
  const origin = url.origin;

  // 发送日志数据到API路由
  await fetch(`${origin}/api/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ip: ip || "unknown",
      url: pathWithQuery,
      client,
    }),
  });

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，排除：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     * - static (static files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|static|Datalog|Datareport).*)",
  ],
};
