import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import { stripe } from "../../../lib/stripe";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let decoded: { userId: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Invalid token";
      return NextResponse.json({ error: message }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (!stripeSession || stripeSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Invalid or unpaid session" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          userId: decoded.userId,
          stripeSessionId: sessionId,
          amount: stripeSession.amount_total
            ? stripeSession.amount_total / 100
            : 0,
          status: "COMPLETED",
        },
      });

      return tx.user.update({
        where: { id: decoded.userId },
        data: { subscription: "PREMIUM" },
      });
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
