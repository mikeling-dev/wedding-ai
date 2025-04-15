import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { WeddingRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;

export const dynamic = "force-dynamic";

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

    const body = await req.json();
    const {
      partner1Name,
      partner2Name,
      culturalBackground,
      religion,
      email,
      phoneNumber,
      weddingDate,
      country,
      state,
      budget,
      guestCount,
      theme,
      specialRequests,
    } = body;

    // Get the current user and their partner info
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { partner: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or update wedding
    const wedding = await prisma.wedding.upsert({
      where: {
        id: body.weddingId || "new", // If no weddingId provided, use "new" which won't match any existing record
      },
      update: {
        partner1Name,
        partner2Name,
        culturalBackground,
        religion,
        email,
        phoneNumber,
        date: weddingDate,
        country,
        state,
        budget,
        guestCount,
        theme,
        specialRequests,
      },
      create: {
        partner1Name,
        partner2Name,
        culturalBackground,
        religion,
        email,
        phoneNumber,
        date: weddingDate,
        country,
        state,
        budget,
        guestCount,
        theme,
        specialRequests,
        users: {
          create: [
            {
              userId: currentUser.id,
              role: WeddingRole.CREATOR,
            },
            // If there's a partner, add them too
            ...(currentUser.partnerId
              ? [
                  {
                    userId: currentUser.partnerId,
                    role: WeddingRole.PARTNER,
                  },
                ]
              : []),
          ],
        },
      },
    });

    return NextResponse.json(wedding);
  } catch (error) {
    console.error("Error creating/updating wedding:", error);
    return NextResponse.json(
      { error: "Failed to create/update wedding" },
      { status: 500 }
    );
  }
}

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

    // Get the wedding ID from the URL if provided
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");

    // If weddingId is provided, get that specific wedding
    if (weddingId) {
      const wedding = await prisma.wedding.findFirst({
        where: {
          id: weddingId,
          users: {
            some: {
              userId: decoded.userId,
            },
          },
        },
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!wedding) {
        return NextResponse.json(
          { error: "Wedding not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(wedding);
    }

    // Otherwise, get all weddings for the user
    const weddings = await prisma.wedding.findMany({
      where: {
        users: {
          some: {
            userId: decoded.userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(weddings);
  } catch (error) {
    console.error("Error fetching wedding(s):", error);
    return NextResponse.json(
      { error: "Failed to fetch wedding(s)" },
      { status: 500 }
    );
  }
}
