// src/app/api/suggest-rules/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
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
      model: "gpt-3.5-turbo", // ✅ downgraded from gpt-4o
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;

    try {
      const parsed = JSON.parse(content || "[]");
      return NextResponse.json({ rules: parsed });
    } catch {
      return NextResponse.json(
        { rules: [], error: "Invalid JSON response from OpenAI" },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error(" OpenAI Suggest Rules Error:", err);
    return NextResponse.json(
      { rules: [], error: err?.message || "OpenAI request failed" },
      { status: 500 }
    );
  }
}
