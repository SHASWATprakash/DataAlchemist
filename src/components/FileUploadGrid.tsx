"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

type ParsedEntity = "clients" | "workers" | "tasks";

export default function FileUploadGrid() {
  const [data, setData] = useState<Record<ParsedEntity, any[]>>({
    clients: [],
    workers: [],
    tasks: [],
  });

  const handleFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
    entity: ParsedEntity
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop();

    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setData((prev) => ({ ...prev, [entity]: result.data }));
        },
      });
    } else if (extension === "xlsx") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target?.result, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setData((prev) => ({ ...prev, [entity]: json }));
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file type. Use CSV or XLSX.");
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
