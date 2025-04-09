// import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const redirectUri = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/auth/google/callback`
    : "http://localhost:3000/api/auth/google/callback";

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 400 }
    );
  }

  const userResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }
  );
  const userData = await userResponse.json();

  const { id: googleId, email, name } = userData;

  let user;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    if (!existingUser.googleId) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { googleId },
      });
    } else {
      user = existingUser;
    }
  } else {
    user = await prisma.user.create({
      data: { googleId, email, name },
    });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "24h",
  });
  const cookie = serialize("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400,
    path: "/",
    sameSite: "lax",
  });

  const homeUrl = `http://localhost:3000/`;
  return NextResponse.redirect(homeUrl, {
    headers: { "Set-Cookie": cookie },
  });
}
