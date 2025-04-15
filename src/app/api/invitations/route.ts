import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export const dynamic = "force-dynamic";

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

    const invitations = await prisma.invitation.findMany({
      where: {
        OR: [{ receiverId: decoded.userId }, { receiverEmail: decoded.email }],
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { receiverEmail } = await req.json();

    if (!receiverEmail) {
      return NextResponse.json(
        { error: "Receiver email is required" },
        { status: 400 }
      );
    }

    // Check if user already has a partner
    const sender = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { partnerId: true },
    });

    if (sender?.partnerId) {
      return NextResponse.json(
        { error: "You already have a partner" },
        { status: 400 }
      );
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail },
    });

    if (receiver?.partnerId) {
      return NextResponse.json(
        { error: "This user already has a partner" },
        { status: 400 }
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        senderId: decoded.userId,
        OR: [{ receiverId: receiver?.id }, { receiverEmail: receiverEmail }],
        status: "PENDING",
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "You already have a pending invitation to this user" },
        { status: 400 }
      );
    }

    // Check if sender has reached the limit of 3 pending invitations
    const pendingInvitationsCount = await prisma.invitation.count({
      where: {
        senderId: decoded.userId,
        status: "PENDING",
      },
    });

    if (pendingInvitationsCount >= 3) {
      return NextResponse.json(
        { error: "You have reached the limit of 3 pending invitations" },
        { status: 400 }
      );
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        senderId: decoded.userId,
        receiverId: receiver?.id,
        receiverEmail: receiverEmail,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
}
