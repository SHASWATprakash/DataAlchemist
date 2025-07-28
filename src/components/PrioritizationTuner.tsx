"use client";

import React, { useEffect, useState } from "react";

type Priority = {
  label: string;
  value: number;
};

type Props = {
  tasks: any[]; // expects parsed task objects with at least a `taskname`
};

const LOCAL_STORAGE_KEY = "prioritization-tasks";

export default function PrioritizationTuner({ tasks }: Props) {
  const [priorities, setPriorities] = useState<Priority[]>([]);

  // Sync with sample tasks
  useEffect(() => {
    if (!tasks.length) return;

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Priority[] = JSON.parse(stored);
        setPriorities(parsed);
        return;
      } catch (err) {
        console.error("Error loading stored priorities", err);
      }
    }

    // Init with parsed task names and default 50 weight
    const initial = tasks.map((task) => ({
      label: task.taskname || "Unnamed Task",
      value: 50,
    }));
    setPriorities(initial);
  }, [tasks]);

  // Save on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(priorities));
  }, [priorities]);

  const updateLabel = (i: number, newLabel: string) => {
    const updated = [...priorities];
    updated[i].label = newLabel;
    setPriorities(updated);
  };

  const updateValue = (i: number, newVal: number) => {
    const updated = [...priorities];
    updated[i].value = newVal;
    setPriorities(updated);
  };

  const addTask = () => {
    setPriorities([...priorities, { label: "New Task", value: 50 }]);
  };

  const removeTask = (index: number) => {
    setPriorities(priorities.filter((_, i) => i !== index));
  };

  const resetToTasks = () => {
    const fresh = tasks.map((t) => ({ label: t.taskname || "Unnamed Task", value: 50 }));
    setPriorities(fresh);
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
    <div className="p-6 mt-10 bg-white rounded shadow space-y-6 text-black">
      <h2 className="text-xl font-semibold">🎯 Prioritization Tuner</h2>

      <div className="space-y-4">
        {priorities.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={p.label}
              onChange={(e) => updateLabel(i, e.target.value)}
              className="p-2 border rounded w-32"
            />
            <div className="flex-1 space-y-1">
              <label className="block text-sm font-medium">
                {p.label} — {p.value}
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={p.value}
                onChange={(e) => updateValue(i, Number(e.target.value))}
                className="w-full"
              />
            </div>
            <button
              onClick={() => removeTask(i)}
              className="text-red-600 hover:underline"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={exportPriorities}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          📤 Export priorities.json
        </button>
        <button
          onClick={resetToTasks}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          🔄 Reset to Task List
        </button>
        <button
          onClick={addTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ➕ Add Task
        </button>
      </div>
    </div>
  );
}
