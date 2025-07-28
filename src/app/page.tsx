"use client";

import { useState } from "react";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState({
    clients: null,
    workers: null,
    tasks: null,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-800 text-white flex flex-col items-center justify-center p-10 gap-6">
      <h1 className="text-4xl font-bold">🧪 Data Alchemist</h1>
      <p className="text-center text-lg max-w-2xl">
        Upload your client, worker, and task CSV/XLSX files. We'll parse, validate, and AI-boost your data into structured magic ✨
      </p>

      {/* Upload UI Placeholder */}
      <div className="w-full max-w-3xl bg-white text-black rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Step 1: Upload Files</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="font-medium">Clients File</span>
            <input type="file" accept=".csv,.xlsx" />
          </label>
          <label className="flex flex-col">
            <span className="font-medium">Workers File</span>
            <input type="file" accept=".csv,.xlsx" />
          </label>
          <label className="flex flex-col">
            <span className="font-medium">Tasks File</span>
            <input type="file" accept=".csv,.xlsx" />
          </label>
        </div>
      </div>

      {/* Placeholder for next steps */}
      <div className="w-full max-w-3xl mt-8 text-center">
        <p className="italic text-white/80">Next: Display parsed data in editable grid...</p>
      </div>
    </div>
  );
}
