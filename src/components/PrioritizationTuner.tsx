"use client";

import { useState } from "react";

const criteria = [
  { id: "priorityLevel", label: "Client Priority Level" },
  { id: "taskFulfillment", label: "Requested Task Fulfillment" },
  { id: "fairness", label: "Fair Distribution Across Clients" },
  { id: "loadBalance", label: "Even Load Across Workers" }
];

export default function PrioritizationTuner() {
  const [weights, setWeights] = useState<Record<string, number>>({
    priorityLevel: 3,
    taskFulfillment: 3,
    fairness: 3,
    loadBalance: 3
  });

  const updateWeight = (key: string, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const exportWeights = () => {
    const blob = new Blob([JSON.stringify({ prioritization: weights }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prioritization.json";
    link.click();
  };

  return (
    <div className="mt-10 p-6 bg-white rounded shadow space-y-6 text-black">
      <h2 className="text-xl font-semibold">⚖️ Prioritization Settings</h2>

      <div className="grid gap-6">
        {criteria.map((c) => (
          <div key={c.id} className="space-y-1">
            <label className="block text-sm font-medium">{c.label}</label>
            <input
              type="range"
              min={1}
              max={5}
              value={weights[c.id]}
              onChange={(e) => updateWeight(c.id, Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">Weight: {weights[c.id]}</span>
          </div>
        ))}
      </div>

      <button
        onClick={exportWeights}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
         Export prioritization.json
      </button>
    </div>
  );
}
