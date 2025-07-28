// src/app/api/suggest-rules/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai"; // or use fetch with OpenAI API

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { headers, sampleRows, prompt } = body;

  const systemPrompt = `
You are a helpful assistant for a data scheduling tool.
Based on column headers and sample rows, recommend JSON rules of types:
- coRun: { type: "coRun", tasks: [...] }
- slotRestriction: { type: "slotRestriction", group: "", minCommonSlots: 2 }
- phaseWindow: { type: "phaseWindow", task: "", allowedPhases: [...] }
- loadLimit: { type: "loadLimit", group: "", maxSlotsPerPhase: 2 }

Return a JSON array of valid rules only. No explanation.
`;

  const userPrompt = prompt || `Headers: ${headers.join(", ")}\nSample: ${JSON.stringify(sampleRows[0])}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
  });

  try {
    const parsed = JSON.parse(completion.choices[0].message.content ?? "[]");
    return NextResponse.json({ rules: parsed });
  } catch (err) {
    return NextResponse.json({ rules: [], error: "Invalid AI response" }, { status: 500 });
  }
}
