"use client";
import { useState } from "react";

interface NaturalQueryBoxProps {
  rules: any; // Replace 'any' with a more specific type if available
  priorities: any;
  gridData: any;
}

export default function NaturalQueryBox({ rules, priorities, gridData }: NaturalQueryBoxProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const ask = async () => {
    const res = await fetch("/api/natural-query", {
      method: "POST",
      body: JSON.stringify({ question, rules, priorities, gridData }),
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    setAnswer(json.answer);
  };

  return (
    <div className="mt-10 p-4 bg-white rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">🧠 Ask a question</h2>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. Show me rules with Sales group"
        className="w-full p-2 border rounded"
      />
      <button onClick={ask} className="bg-indigo-600 text-white px-4 py-2 rounded">
        Ask
      </button>
      {answer && <div className="mt-2 p-2 bg-gray-100 rounded">{answer}</div>}
    </div>
  );
}
