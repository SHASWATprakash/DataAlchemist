"use client";

import FileUploadGrid from "@/components/FileUploadGrid";
import RuleBuilder from "@/components/RuleBuilder";
import PrioritizationTuner from "@/components/PrioritizationTuner";
import NaturalQueryBox from "@/components/NaturalQueryBox"; // ✅ Add this

export default function Home() {
  // TODO: Replace these with actual state or props as needed
  const rules: unknown = [];
  const priorities: unknown = [];
  const parsedCSVData: unknown = [];

  return (
    <main className="min-h-screen bg-white text-black p-10 space-y-10">
      <h1 className="text-4xl font-bold text-center text-indigo-600">
        🧪 Data Alchemist
      </h1>
      <p className="text-center text-gray-700 max-w-2xl mx-auto">
        Upload raw data, configure rules, tune priorities, and export a clean allocation config.
      </p>

      {/* 🔹 Step 1: Upload + Live Validation */}
      <FileUploadGrid />

      {/* 🔹 Step 2: Rule Builder */}
      <RuleBuilder />

      {/* 🔹 Step 3: Prioritization Weights */}
      <PrioritizationTuner />

      {/* 🔹 Step 4: Natural Language Insights */}
     <NaturalQueryBox
  rules={rules}
  priorities={priorities}
  gridData={parsedCSVData}
/>
    </main>
  );
}
