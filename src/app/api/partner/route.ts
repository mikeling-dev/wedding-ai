import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    // First get the partner's ID from the current user
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { partnerId: true },
    });

    if (!currentUser?.partnerId) {
      return NextResponse.json(
        { message: "No partner found" },
        { status: 404 }
      );
    }

    // Then fetch the partner's information
    const partner = await prisma.user.findUnique({
      where: { id: currentUser.partnerId },
      select: {
        id: true,
        name: true,
        picture: true,
        subscription: true,
        weddings: true,
      },
    });

    if (!partner) {
      return NextResponse.json(
        { message: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(partner);
  } catch (error) {
    console.error("Error fetching partner information:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
