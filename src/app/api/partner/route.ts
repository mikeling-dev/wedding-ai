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
        email: true,
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

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    // Get current user's partner information
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { partnerId: true },
    });

    if (!currentUser?.partnerId) {
      return NextResponse.json(
        { message: "No partner found to unlink" },
        { status: 404 }
      );
    }

    // Get partner's information to verify the relationship
    const partner = await prisma.user.findUnique({
      where: { id: currentUser.partnerId },
      select: { id: true, partnerId: true },
    });

    if (!partner || partner.partnerId !== decoded.userId) {
      return NextResponse.json(
        { message: "Invalid partner relationship" },
        { status: 400 }
      );
    }

    // Update both users to remove the partner relationship
    await prisma.$transaction([
      prisma.user.update({
        where: { id: decoded.userId },
        data: { partnerId: null },
      }),
      prisma.user.update({
        where: { id: partner.id },
        data: { partnerId: null },
      }),
    ]);

    return NextResponse.json(
      { message: "Successfully unlinked partner" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unlinking partner:", error);
    return NextResponse.json(
      { error: "Failed to unlink partner" },
      { status: 500 }
    );
  }
}
