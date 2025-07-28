import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { question, rules, priorities, gridData } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that analyzes a scheduling config. You will answer questions based on these three objects: 'rules', 'priorities', and 'gridData'.`
      },
      {
        role: "user",
        content: `Here is the data:\nRules: ${JSON.stringify(
          rules
        )}\nPriorities: ${JSON.stringify(
          priorities
        )}\nGrid: ${JSON.stringify(gridData)}\n\nQuestion: ${question}`
      }
    ]
  });

  return NextResponse.json({ answer: completion.choices[0].message.content });
}
