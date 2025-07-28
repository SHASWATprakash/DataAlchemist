"use client";

import { useState } from "react";
import FileUploadGrid, { ParsedData } from "@/components/FileUploadGrid";
import RuleBuilder from "@/components/RuleBuilder";
import PrioritizationTuner from "@/components/PrioritizationTuner";
import NaturalQueryBox from "@/components/NaturalQueryBox";

export default function Home() {
  const [parsedCSVData, setParsedCSVData] = useState<ParsedData>({
    clients: [],
    workers: [],
    tasks: [],
  });

  return (
    <main className="min-h-screen bg-white text-black p-10 space-y-10">
      <h1 className="text-4xl font-bold text-center text-indigo-600">
        🧪 Data Alchemist
      </h1>

      <FileUploadGrid onParsed={setParsedCSVData} />
      <RuleBuilder />
      <PrioritizationTuner tasks={parsedCSVData.tasks} />
      <NaturalQueryBox
        rules={[]} // todo
        priorities={[]} // todo
        gridData={parsedCSVData}
      />
    </main>
  );
}
