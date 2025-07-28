"use client";

import { useState } from "react";
import { Rule } from "@/lib/ruleSchemas";

export default function NaturalLanguageRuleBox({
  onAddRule,
}: {
  onAddRule: (rule: Rule) => void;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/natural-rule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (data?.rule) {
        onAddRule(data.rule);
        setInput("");
      } else {
        setError("Failed to extract rule.");
      }
    } catch (err) {
      setError("Error reaching server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h3 className="font-semibold text-lg">🤖 Natural Language Rule Generator</h3>
      <textarea
        className="w-full p-2 border rounded text-black"
        placeholder='e.g. "Group Alpha must share 2 common slots"'
        rows={2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Converting..." : "✨ Convert to Rule"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
