import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
const JWT_SECRET = process.env.JWT_SECRET!;

export function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}
