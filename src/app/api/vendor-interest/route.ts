import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      businessName,
      email,
      phoneNumber,
      country,
      state,
      categories,
      description,
    } = body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !country ||
      !categories ||
      !description
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate categories
    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: "At least one category is required" },
        { status: 400 }
      );
    }

    // Validate that all categories are valid Category enum values
    const validCategories = categories.every((category) =>
      Object.values(Category).includes(category as Category)
    );

    if (!validCategories) {
      return NextResponse.json(
        { error: "Invalid category provided" },
        { status: 400 }
      );
    }

    // Create vendor interest record
    const vendorInterest = await prisma.vendorInterests.create({
      data: {
        name,
        businessName,
        email,
        phoneNumber,
        country,
        state,
        categories: categories as Category[],
        description,
      },
    });

    return NextResponse.json(
      {
        message: "Vendor interest submitted successfully",
        data: vendorInterest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting vendor interest:", error);
    return NextResponse.json(
      { error: "Failed to submit vendor interest" },
      { status: 500 }
    );
  }
}
