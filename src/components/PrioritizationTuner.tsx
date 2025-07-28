"use client";

import { useState, useEffect } from "react";

type Task = {
  taskid: string;
  taskname: string;
};

type Priority = {
  taskid: string;
  label: string;
  value: number;
};

type Props = {
  tasks: Task[];
};

const LOCAL_STORAGE_KEY = "prioritization-tasks";

export default function PrioritizationTuner({ tasks }: Props) {
  const [priorities, setPriorities] = useState<Priority[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let initial: Priority[] = [];

    try {
      const existing: Priority[] = stored ? JSON.parse(stored) : [];
      const priorityMap = new Map(existing.map((p) => [p.taskid, p]));

      initial = tasks.map((task) => ({
        taskid: task.taskid,
        label: task.taskname,
        value: priorityMap.get(task.taskid)?.value ?? 50,
      }));
    } catch (err) {
      console.warn("⚠️ Failed to parse stored priorities:", err);
      initial = tasks.map((task) => ({
        taskid: task.taskid,
        label: task.taskname,
        value: 50,
      }));
    }

    setPriorities(initial);
  }, [tasks]);

  useEffect(() => {
    if (priorities.length) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(priorities));
    }
  }, [priorities]);

  const updateValue = (index: number, value: number) => {
    const updated = [...priorities];
    updated[index].value = value;
    setPriorities(updated);
  };

  const updateLabel = (index: number, label: string) => {
    const updated = [...priorities];
    updated[index].label = label;
    setPriorities(updated);
  };

  const addTask = () => {
    setPriorities([
      ...priorities,
      { taskid: `T${priorities.length + 1}`, label: "New Task", value: 50 },
    ]);
  };

  const removeTask = (index: number) => {
    setPriorities(priorities.filter((_, i) => i !== index));
  };

  const resetToDefaults = () => {
    const reset = tasks.map((task) => ({
      taskid: task.taskid,
      label: task.taskname,
      value: 50,
    }));
    setPriorities(reset);
  };

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify({ priorities }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "priorities.json";
    anchor.click();
  };

  return (
    <div className="p-6 mt-10 bg-white rounded shadow space-y-6 text-black">
      <h2 className="text-xl font-semibold">🎯 Prioritization Tuner</h2>

      {priorities.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          No tasks loaded yet. Upload a CSV to begin prioritizing.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {priorities.map((p, i) => (
              <div key={p.taskid} className="flex items-center gap-3">
                <input
                  type="text"
                  value={p.label}
                  onChange={(e) => updateLabel(i, e.target.value)}
                  className="p-2 border rounded w-48"
                  placeholder="Task name"
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
                  title="Remove Task"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={exportToJson}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              📤 Export priorities.json
            </button>
            <button
              onClick={resetToDefaults}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              🔄 Reset to Tasks
            </button>
            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              ➕ Add Task
            </button>
          </div>
        </>
      )}
    </div>
  );
}
