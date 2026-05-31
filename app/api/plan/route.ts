import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shortTermGoals, longTermGoals, currentRoutine, desiredHabits } = body;

    const prompt = `Act as an expert life coach. Create a personalized life plan based on the following:
Short-Term Goals: ${shortTermGoals}
Long-Term Goals: ${longTermGoals}
Current Routine: ${currentRoutine}
Desired Habits: ${desiredHabits}

Provide a well-structured plan with actionable steps organized efficiently.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            morningRoutine: {
              type: Type.ARRAY,
              description: "List of morning routine items",
              items: { type: Type.STRING },
            },
            eveningRoutine: {
              type: Type.ARRAY,
              description: "List of evening routine items",
              items: { type: Type.STRING },
            },
            actionableSteps: {
              type: Type.ARRAY,
              description: "List of specific steps to achieve short and long term goals",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["title", "description"],
              },
            },
            habitFormation: {
              type: Type.ARRAY,
              description: "Tips or specific strategies to integrate desired habits",
              items: { type: Type.STRING },
            },
            motivationalQuote: {
              type: Type.STRING,
            },
          },
          required: ["morningRoutine", "eveningRoutine", "actionableSteps", "habitFormation", "motivationalQuote"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating plan:", error);
    return NextResponse.json(
      { error: "Failed to generate plan. Please try again." },
      { status: 500 }
    );
  }
}
