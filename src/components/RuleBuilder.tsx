"use client";

import { useState } from "react";

type RuleType = "coRun" | "slotRestriction" | "phaseWindow" | "loadLimit";

type Rule =
  | { type: "coRun"; tasks: string[] }
  | { type: "slotRestriction"; group: string; minCommonSlots: number }
  | { type: "phaseWindow"; task: string; allowedPhases: number[] }
  | { type: "loadLimit"; group: string; maxSlotsPerPhase: number };

export default function RuleBuilder() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedRuleType, setSelectedRuleType] = useState<RuleType>("coRun");

  const addRule = () => {
    let newRule: Rule;
    switch (selectedRuleType) {
      case "coRun":
        newRule = { type: "coRun", tasks: [""] };
        break;
      case "slotRestriction":
        newRule = { type: "slotRestriction", group: "", minCommonSlots: 1 };
        break;
      case "phaseWindow":
        newRule = { type: "phaseWindow", task: "", allowedPhases: [1] };
        break;
      case "loadLimit":
        newRule = { type: "loadLimit", group: "", maxSlotsPerPhase: 1 };
        break;
    }

    setRules((prev) => [...prev, newRule]);
  };

  const updateRule = (index: number, updated: Rule) => {
    setRules((prev) => prev.map((r, i) => (i === index ? updated : r)));
  };

  const deleteRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-10 p-6 bg-white rounded shadow space-y-6 text-black">
      <h2 className="text-xl font-semibold">📏 Rule Builder</h2>

      <div className="flex gap-4 items-center">
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

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded space-y-2">
            <div className="flex justify-between items-center">
              <strong className="text-sm uppercase text-gray-600">{rule.type}</strong>
              <button
                onClick={() => deleteRule(index)}
                className="text-red-600 text-sm hover:underline"
              >
                🗑️ Delete
              </button>
            </div>

            {rule.type === "coRun" && (
              <input
                type="text"
                value={rule.tasks.join(",")}
                onChange={(e) =>
                  updateRule(index, { ...rule, tasks: e.target.value.split(",").map(t => t.trim()) })
                }
                placeholder="Tasks (comma separated)"
                className="w-full p-2 border rounded"
              />
            )}

            {rule.type === "slotRestriction" && (
              <>
                <input
                  type="text"
                  value={rule.group}
                  onChange={(e) => updateRule(index, { ...rule, group: e.target.value })}
                  placeholder="Group Name"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={rule.minCommonSlots}
                  min={1}
                  onChange={(e) =>
                    updateRule(index, { ...rule, minCommonSlots: parseInt(e.target.value) })
                  }
                  placeholder="Min Common Slots"
                  className="w-full p-2 border rounded"
                />
              </>
            )}

            {rule.type === "phaseWindow" && (
              <>
                <input
                  type="text"
                  value={rule.task}
                  onChange={(e) => updateRule(index, { ...rule, task: e.target.value })}
                  placeholder="Task Name"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  value={rule.allowedPhases.join(",")}
                  onChange={(e) =>
                    updateRule(index, {
                      ...rule,
                      allowedPhases: e.target.value.split(",").map((n) => parseInt(n.trim())),
                    })
                  }
                  placeholder="Allowed Phases (comma separated)"
                  className="w-full p-2 border rounded"
                />
              </>
            )}

            {rule.type === "loadLimit" && (
              <>
                <input
                  type="text"
                  value={rule.group}
                  onChange={(e) => updateRule(index, { ...rule, group: e.target.value })}
                  placeholder="Group Name"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={rule.maxSlotsPerPhase}
                  min={1}
                  onChange={(e) =>
                    updateRule(index, {
                      ...rule,
                      maxSlotsPerPhase: parseInt(e.target.value),
                    })
                  }
                  placeholder="Max Slots per Phase"
                  className="w-full p-2 border rounded"
                />
              </>
            )}
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
