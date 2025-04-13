import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the user has permission to delete this wedding
    const weddingUser = await prisma.weddingUser.findFirst({
      where: {
        weddingId: params.id,
        userId: user.userId,
      },
    });

    if (!weddingUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the wedding and all related data
    await prisma.$transaction([
      // Delete wedding users
      prisma.weddingUser.deleteMany({
        where: {
          weddingId: params.id,
        },
      }),
      // Delete wedding plan and associated tasks
      prisma.task.deleteMany({
        where: {
          plan: {
            weddingId: params.id,
          },
        },
      }),
      prisma.plan.deleteMany({
        where: {
          weddingId: params.id,
        },
      }),
      // Delete the wedding itself
      prisma.wedding.delete({
        where: {
          id: params.id,
        },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[WEDDING_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
