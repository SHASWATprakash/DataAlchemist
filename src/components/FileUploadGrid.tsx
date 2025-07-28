"use client";

import { useState } from "react";
import { parseCSV } from "@/lib/parseCSV";
import { parseXLSX } from "@/lib/parseXLSX";

type ParsedEntity = "clients" | "workers" | "tasks";

export default function FileUploadGrid() {
  const [data, setData] = useState<Record<ParsedEntity, any[]>>({
    clients: [],
    workers: [],
    tasks: [],
  });

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    entity: ParsedEntity
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    let parsedData: any[] = [];

    try {
      if (ext === "csv") {
        parsedData = await parseCSV(file);
      } else if (ext === "xlsx") {
        parsedData = await parseXLSX(file);
      } else {
        alert("Unsupported file format");
        return;
      }

      // TODO: Normalize headers here if needed
      setData((prev) => ({ ...prev, [entity]: parsedData }));
    } catch (err) {
      console.error("Parsing failed:", err);
      alert("Failed to parse file");
    }
  };

  return (
    <div className="space-y-6 text-black">
      <div className="grid gap-4">
        {(["clients", "workers", "tasks"] as ParsedEntity[]).map((entity) => (
          <label key={entity} className="flex flex-col font-medium">
            {entity.toUpperCase()} file:
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => handleFile(e, entity)}
              className="mt-1"
            />
          </label>
        ))}
      </div>

      <div className="bg-gray-100 p-4 rounded max-h-[300px] overflow-auto">
        <h3 className="font-semibold mb-2">Parsed Preview</h3>
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
