// pages/api/natural-rule.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const prompt = `
You are a rule extraction assistant. Based on the user input, extract the appropriate rule as a JSON object using one of these types:

- coRun: { type: "coRun", tasks: ["T1", "T2"] }
- slotRestriction: { type: "slotRestriction", group: "Alpha", minCommonSlots: 2 }
- phaseWindow: { type: "phaseWindow", task: "T3", allowedPhases: [1, 2, 3] }
- loadLimit: { type: "loadLimit", group: "Sales", maxSlotsPerPhase: 2 }

Return ONLY the rule as JSON.

User: "${text}"
`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  const raw = chat.choices[0].message.content || "";
  try {
    const rule = JSON.parse(raw);
    return NextResponse.json({ rule });
  } catch (e) {
    return NextResponse.json({ error: "Invalid response from model", raw }, { status: 500 });
  }
}
