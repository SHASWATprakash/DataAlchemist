"use client";

import { useEffect, useState } from "react";
import { ruleSchemas, RuleUnionSchema, Rule } from "@/lib/ruleSchemas";
import NaturalLanguageRuleBox from "@/components/NaturalLanguageRuleBox";
import { fetchRuleSuggestions } from "@/hooks/useRuleSuggestions";

type RuleType = Rule["type"];
type RuleErrors = { [key: number]: string };

const LOCAL_KEY = "data-alchemist-rules";

export default function RuleBuilder() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [errors, setErrors] = useState<RuleErrors>({});
  const [selectedRuleType, setSelectedRuleType] = useState<RuleType>("coRun");

  // 🔄 Load rules from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const validated = parsed.filter((r: any) =>
          RuleUnionSchema.safeParse(r).success
        );
        setRules(validated);
      } catch {
        console.warn("⚠️ Invalid localStorage format, ignoring");
      }
    }
  }, []);

  // 💾 Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(rules));
  }, [rules]);

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
        newRule = { type: "phaseWindow", task: "", allowedPhases: [] };
        break;
      case "loadLimit":
        newRule = { type: "loadLimit", group: "", maxSlotsPerPhase: 1 };
        break;
    }
    setRules((prev) => [...prev, newRule]);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...rules];
    (updated[index] as any)[field] = value;
    setRules(updated);

    const schema = ruleSchemas[updated[index].type];
    const result = schema.safeParse(updated[index]);
    setErrors((prev) => ({
      ...prev,
      [index]: result.success ? "" : result.error.errors[0]?.message,
    }));
  };

  const handleDelete = (index: number) => {
    const updated = [...rules];
    updated.splice(index, 1);
    setRules(updated);
  };

  const isValid = () =>
    rules.every((rule) => ruleSchemas[rule.type].safeParse(rule).success);

  return (
    <div className="mt-10 p-6 bg-white rounded shadow space-y-4 text-black">
      <h2 className="text-xl font-semibold">📏 Rule Builder</h2>

      {/* 🤖 Natural Language Box */}
      <NaturalLanguageRuleBox
        onAddRule={(rule) => {
          const parsed = RuleUnionSchema.safeParse(rule);
          if (parsed.success) {
            setRules((prev) => [...prev, parsed.data]);
          } else {
            console.warn("❌ Invalid rule from AI:", parsed.error);
          }
        }}
      />

      {/* 🔘 Rule type selector */}
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

      {/* 🧱 Editable Cards */}
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded border space-y-2">
            <div className="text-sm font-semibold flex justify-between items-center">
              {rule.type}
              <button
                className="text-xs text-red-600"
                onClick={() => handleDelete(index)}
              >
                ✖ Delete
              </button>
            </div>

            {rule.type === "coRun" && (
              <input
                className="w-full p-2 border rounded"
                value={rule.tasks.join(",")}
                onChange={(e) =>
                  handleChange(index, "tasks", e.target.value.split(","))
                }
                placeholder="Tasks (comma separated)"
              />
            )}

            {rule.type === "slotRestriction" && (
              <>
                <input
                  className="w-full p-2 border rounded"
                  value={rule.group}
                  onChange={(e) => handleChange(index, "group", e.target.value)}
                  placeholder="Group"
                />
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={rule.minCommonSlots}
                  onChange={(e) =>
                    handleChange(index, "minCommonSlots", Number(e.target.value))
                  }
                  placeholder="Min Common Slots"
                />
              </>
            )}

            {rule.type === "phaseWindow" && (
              <>
                <input
                  className="w-full p-2 border rounded"
                  value={rule.task}
                  onChange={(e) => handleChange(index, "task", e.target.value)}
                  placeholder="Task"
                />
                <input
                  className="w-full p-2 border rounded"
                  value={rule.allowedPhases.join(",")}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "allowedPhases",
                      e.target.value.split(",").map((v) => Number(v.trim()))
                    )
                  }
                  placeholder="Allowed Phases (comma separated)"
                />
              </>
            )}

            {rule.type === "loadLimit" && (
              <>
                <input
                  className="w-full p-2 border rounded"
                  value={rule.group}
                  onChange={(e) => handleChange(index, "group", e.target.value)}
                  placeholder="Group"
                />
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={rule.maxSlotsPerPhase}
                  onChange={(e) =>
                    handleChange(index, "maxSlotsPerPhase", Number(e.target.value))
                  }
                  placeholder="Max Slots/Phase"
                />
              </>
            )}

            {errors[index] && (
              <p className="text-red-500 text-xs">{errors[index]}</p>
            )}
          </div>
        ))}
      </div>

      {/* 📤 Export Button */}
      <button
        disabled={!isValid()}
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
        className={`mt-4 px-4 py-2 rounded text-white ${
          isValid() ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        📤 Export rules.json
      </button>
      {/* TODO: Replace these with actual data from your app context or props */}
      <button
  onClick={async () => {
    // Example placeholder data
    const columnHeaders: string[] = []; // e.g., ["Task", "Phase", "Group"]
    const dataRows: any[] = []; // e.g., [{ Task: "A", Phase: 1, Group: "X" }]
    const suggestions = await fetchRuleSuggestions(columnHeaders, dataRows);
    setRules((prev) => [...prev, ...suggestions]);
  }}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
>
  🤖 Suggest Rules
</button>
    </div>
  );
}
