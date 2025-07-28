"use client";

import { useState } from "react";

type RuleType = "coRun" | "slotRestriction" | "phaseWindow" | "loadLimit";

export default function RuleBuilder() {
  const [rules, setRules] = useState<any[]>([]);
  const [selectedRuleType, setSelectedRuleType] = useState<RuleType>("coRun");

  const addRule = () => {
    let newRule;
    switch (selectedRuleType) {
      case "coRun":
        newRule = { type: "coRun", tasks: ["T1", "T2"] };
        break;
      case "slotRestriction":
        newRule = { type: "slotRestriction", group: "Alpha", minCommonSlots: 2 };
        break;
      case "phaseWindow":
        newRule = { type: "phaseWindow", task: "T3", allowedPhases: [1, 2, 3] };
        break;
      case "loadLimit":
        newRule = { type: "loadLimit", group: "Sales", maxSlotsPerPhase: 2 };
        break;
    }

    setRules((prev) => [...prev, newRule]);
  };

  return (
    <div className="mt-10 p-6 bg-white rounded shadow space-y-4 text-black">
      <h2 className="text-xl font-semibold">📏 Rule Builder</h2>

      <div className="flex flex-wrap gap-4 items-center">
        <select
          className="border px-3 py-2 rounded"
          value={selectedRuleType}
          onChange={(e) => setSelectedRuleType(e.target.value as RuleType)}
        >
          <option value="coRun">Co-Run Tasks</option>
          <option value="slotRestriction">Slot Restriction</option>
          <option value="phaseWindow">Phase Window</option>
          <option value="loadLimit">Load Limit</option>
        </select>

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          onClick={addRule}
        >
          ➕ Add Rule
        </button>
      </div>

      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded text-sm font-mono">
            {JSON.stringify(rule)}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          const blob = new Blob([JSON.stringify({ rules }, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "rules.json";
          link.click();
        }}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
         Export rules.json
      </button>
    </div>
  );
}
