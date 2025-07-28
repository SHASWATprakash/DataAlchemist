"use client";

import { useState } from "react";
import FileUploadGrid from "@/components/FileUploadGrid";
import RuleBuilder from "@/components/RuleBuilder";
import PrioritizationTuner from "@/components/PrioritizationTuner";
import NaturalQueryBox from "@/components/NaturalQueryBox";

type ParsedEntity = "clients" | "workers" | "tasks";
type ParsedData = Record<ParsedEntity, any[]>;

export default function Home() {
  const [parsedCSVData, setParsedCSVData] = useState<ParsedData>({
    clients: [],
    workers: [],
    tasks: [],
  });

  const handleParsedData = (updated: ParsedData) => {
    setParsedCSVData(updated);
  };

  return (
    <main className="min-h-screen bg-white text-black p-10 space-y-10">
      <h1 className="text-4xl font-bold text-center text-indigo-600">
        🧪 Data Alchemist
      </h1>
      <p className="text-center text-gray-700 max-w-2xl mx-auto">
        Upload raw data, configure rules, tune priorities, and export a clean allocation config.
      </p>

      {/* 🔹 Step 1: Upload + Live Validation */}
      <FileUploadGrid onParsed={setParsedCSVData} />

      {/* 🔹 Step 2: Rule Builder */}
      <RuleBuilder />

      {/* 🔹 Step 3: Prioritization Weights */}
      <PrioritizationTuner tasks={parsedCSVData.tasks} />

      {/* 🔹 Step 4: Natural Language Insights */}
      <NaturalQueryBox
        rules={[]} // update if rules come from RuleBuilder
        priorities={[]} // update if priorities are exportable
        gridData={parsedCSVData}
      />
    </main>
  );
}
