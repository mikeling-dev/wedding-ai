import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface TodoListItem {
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY || "your-api-key" });

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Verify user and get their tier
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // if (user.weddings && user.subscription === "BASIC") {
    //     return NextResponse.json({error: "Exceed wedding limit, "})
    // }

    // Get wedding details from request body
    const weddingDetails = await req.json();

    // Select model based on user's subscription tier
    const model = user.subscription === "PREMIUM" ? "gpt-4o" : "gpt-4o-mini";

    // Construct prompt based on wedding details
    const prompt = `Use the information provided below, create a detailed wedding plan, ensuring all elements reflect their traditions (if provided), values, and obligations:
    Partner 1: ${weddingDetails.partner1Name}
    Partner 2: ${weddingDetails.partner2Name}
    Cultural Background: ${weddingDetails.culturalBackground}
    Religion: ${weddingDetails.religion}
    Date: ${weddingDetails.weddingDate}
    Location: ${weddingDetails.country}, ${weddingDetails.state}
    Budget: ${weddingDetails.budget}
    Guest Count: ${weddingDetails.guestCount}
    Theme: ${weddingDetails.theme}
    Special Requests: ${weddingDetails.specialRequests || "None"}

    If religion and cultural background is provided, include a specific category for cultural and religious practices with tasks that outline what the couple should do according to their culture and religion (e.g., specific rituals, attire, or community involvement)

    ${
      user.subscription === "PREMIUM"
        ? `Create a comprehensive wedding plan that includes:
        1. A brief overview of the wedding style and vision, inspired by the couple's cultural background and religion, blending traditional elements with modern preferences if applicable.
        2. A timeline with key phases (e.g., Planning Phase, Booking Phase, Design Phase, Execution Phase) customized to accommodate cultural or religious requirements (e.g., auspicious dates, pre-wedding rituals).
        3. A detailed budget breakdown with percentages for different categories, including a category for cultural/religious expenses (e.g., ceremonial items, officiant fees). Assume a total budget of $30,000 unless otherwise specified.
        4. A list of key categories (e.g., Venue, Catering, Photography, Cultural/Religious Practices) with brief descriptions that reflect the couple's traditions and needs.
        5. A to-do list organized by categories, with 5-7 tasks per category. For the Cultural/Religious Practices category, include specific tasks the couple must complete to honor their religion and cultural background (e.g., arranging a specific ceremony, consulting a religious leader, or preparing traditional items).
      
      Return the response as a JSON object with the following structure:
    {
        "overview": "string describing the wedding style and vision",
        "timeline": [
            {
            "phase": "phase name",
            "description": "brief description of activities, including any cultural/religious tasks",
            "startTime": "time relative to wedding (e.g., 'Now', '6 Months Before', '1 Week Before')"
            }
        ],
        "budget": [
            {
            "category": "budget category name",
            "percentage": number (1-100, total must sum to 100),
            "amount": number (calculated based on total budget)
            }
        ],
        "categories": [
            {
            "name": "category name",
            "description": "brief description reflecting cultural/religious context",
            "icon": "suggested icon name from Remix Icon (ri-*)"
            }
        ],
        "todoList": [
            {
            "title": "task title",
            "description": "task description, specific to cultural/religious needs where applicable",
            "category": "corresponding category name from categories",
            "dueDate": "suggested timeline relative to wedding date (e.g., '6 Months Before', '1 Month Before')",
            "status": "pending"
            }
        ]
    }`
        : `Create a comprehensive wedding plan that includes:
      1. A brief overview of the wedding style and vision
      2. A timeline with key phases (Planning Phase, Booking Phase, Design Phase, etc.)
      3. A detailed budget breakdown with percentages for different categories
      4. A list of key categories (Venue, Catering, Photography, etc.) with brief descriptions
      5. A todo list organized by categories with at least 5-7 tasks per category
      
      Return the response as a JSON object with the following structure:
      {
        "overview": "string describing the wedding style and vision",
        "timeline": [
          {
            "phase": "phase name",
            "description": "brief description",
            "startTime": "time relative to wedding (e.g., 'Now', '2 Months', etc.)"
          }
        ],
        "budget": [
          {
            "category": "budget category name",
            "percentage": number (1-100),
            "amount": number (calculated based on total budget)
          }
        ],
        "categories": [
          {
            "name": "category name",
            "description": "brief description",
            "icon": "suggested icon name from Remix Icon (ri-*)"
          }
        ],
        "todoList": [
          {
            "title": "task title",
            "description": "task description",
            "category": "corresponding category name from categories",
            "dueDate": "suggested timeline relative to wedding date",
            "status": "pending"
          }
        ]
      }`
    }`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are a professional wedding planner that creates detailed, personalized wedding plans based on couples' religion, cultural background and preferences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: user.subscription === "PREMIUM" ? 4000 : 2000,
    });

    const plan = completion.choices[0]?.message?.content;

    if (!plan) {
      return NextResponse.json(
        { error: "Failed to generate plan" },
        { status: 500 }
      );
    }

    // Parse the plan JSON string
    let parsedPlan;
    try {
      parsedPlan = JSON.parse(plan);
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return NextResponse.json(
        { error: "Failed to parse plan" },
        { status: 500 }
      );
    }

    // Save the plan to the database
    const savedPlan = await prisma.plan.create({
      data: {
        weddingId: weddingDetails.weddingId,
        overview: parsedPlan.overview,
        budgetBreakdown: parsedPlan.budget,
        timeline: parsedPlan.timeline,
        categories: parsedPlan.categories,
      },
    });

    // Create tasks from the todoList
    if (parsedPlan.todoList && Array.isArray(parsedPlan.todoList)) {
      await prisma.task.createMany({
        data: parsedPlan.todoList.map((task: TodoListItem) => ({
          planId: savedPlan.id,
          title: task.title,
          description: task.description,
          dueDate: null, // We'll need to convert the relative date to actual date later
          isCompleted: false,
          category: task.category,
        })),
      });
    }

    // Fetch the created plan with its tasks
    const planWithTasks = await prisma.plan.findUnique({
      where: { id: savedPlan.id },
      include: { tasks: true },
    });

    return NextResponse.json({ plan: planWithTasks });
  } catch (error) {
    console.error("Error generating wedding plan:", error);
    return NextResponse.json(
      { error: "Failed to generate wedding plan" },
      { status: 500 }
    );
  }
}
