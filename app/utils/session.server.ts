import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "./db.server";

// 配置 session 存储
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session", // cookie 名称
    httpOnly: true, // 防止客户端 JS 读取
    path: "/", // cookie 路径
    sameSite: "lax", // CSRF 保护
    secrets: ["s3cr3t"], // 用于签名 cookie（应该使用环境变量）
    secure: process.env.NODE_ENV === "production", // 在生产环境使用 HTTPS
  },
});

// 获取 session
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// 创建新的登录 session
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// 获取已登录用户
export async function getUser(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}

// 需要登录的路由
export async function requireUser(
  request: Request,
  redirectTo: string = "/login"
) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

// 退出登录
export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
