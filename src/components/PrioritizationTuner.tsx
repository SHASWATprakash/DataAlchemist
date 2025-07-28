"use client";

import { useState } from "react";

type Priority = {
  label: string;
  value: number;
};

export default function PrioritizationTuner() {
  const [priorities, setPriorities] = useState<Priority[]>([
    { label: "Task A", value: 50 },
    { label: "Task B", value: 75 },
    { label: "Task C", value: 25 },
  ]);

  const updatePriority = (index: number, newValue: number) => {
    const updated = [...priorities];
    updated[index].value = newValue;
    setPriorities(updated);
  };

  const exportPriorities = () => {
    const blob = new Blob([JSON.stringify({ priorities }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "priorities.json";
    a.click();
  };

  return (
    <div className="p-6 mt-10 bg-white rounded shadow space-y-4 text-black">
      <h2 className="text-xl font-semibold">🎯 Prioritization Tuner</h2>

      {priorities.map((p, i) => (
        <div key={i} className="space-y-1">
          <label className="font-medium">{p.label} — {p.value}</label>
          <input
            type="range"
            min={0}
            max={100}
            value={p.value}
            onChange={(e) => updatePriority(i, Number(e.target.value))}
            className="w-full"
          />
        </div>
      ))}

      <button
        onClick={exportPriorities}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        📤 Export priorities.json
      </button>
    </div>
  );
}
