import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { WeddingRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ action: string }> }
) {
  const params = await props.params;
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const action = params.action;
  if (action !== "accept" && action !== "reject") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    const { invitationId } = await req.json();

    // Find and verify the invitation
    const invitation = await prisma.invitation.findFirst({
      where: {
        id: invitationId,
        OR: [{ receiverId: decoded.userId }, { receiverEmail: decoded.email }],
        status: "PENDING",
      },
      include: {
        sender: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (action === "accept") {
      // If the invitation was sent to email and user now exists, update the receiverId
      if (!invitation.receiverId) {
        await prisma.invitation.update({
          where: { id: invitationId },
          data: { receiverId: decoded.userId },
        });
      }

      // Start a transaction to handle all the updates
      await prisma.$transaction(async (tx) => {
        // Update both users to be partners
        await tx.user.update({
          where: { id: decoded.userId },
          data: { partnerId: invitation.senderId },
        });
        await tx.user.update({
          where: { id: invitation.senderId },
          data: { partnerId: decoded.userId },
        });

        // Find all weddings where either user is a creator
        const allWeddings = await tx.weddingUser.findMany({
          where: {
            OR: [
              // Check sender's weddings
              {
                userId: invitation.senderId,
                role: WeddingRole.CREATOR,
              },
              // Check receiver's weddings
              {
                userId: decoded.userId,
                role: WeddingRole.CREATOR,
              },
            ],
          },
          include: {
            wedding: true,
          },
        });

        // Add each user as partner to the other's weddings
        for (const weddingUser of allWeddings) {
          if (weddingUser.userId === invitation.senderId) {
            // This is sender's wedding, add receiver as partner
            await tx.weddingUser.create({
              data: {
                userId: decoded.userId,
                weddingId: weddingUser.wedding.id,
                role: WeddingRole.PARTNER,
              },
            });
          } else {
            // This is receiver's wedding, add sender as partner
            await tx.weddingUser.create({
              data: {
                userId: invitation.senderId,
                weddingId: weddingUser.wedding.id,
                role: WeddingRole.PARTNER,
              },
            });
          }
        }
      });
    }

    // Update invitation status
    const updatedInvitation = await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: action === "accept" ? "ACCEPTED" : "DENIED" },
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

    return NextResponse.json(updatedInvitation);
  } catch (error) {
    console.error(`Error ${action}ing invitation:`, error);
    return NextResponse.json(
      { error: `Failed to ${action} invitation` },
      { status: 500 }
    );
  }
}
