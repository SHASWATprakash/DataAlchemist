"use client";

import { useState, useEffect } from "react";
import { parseCSV } from "@/lib/parseCSV";
import { parseXLSX } from "@/lib/parseXLSX";
import { normalizeRows } from "@/lib/normalizeHeaders";
import { validateClientRow } from "@/lib/schemas";
import DataGridRenderer from "./DataGridRenderer";

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
        const text = await file.text();
        parsedData = await parseCSV(text);
      } else if (ext === "xlsx") {
        parsedData = await parseXLSX(file);
      } else {
        alert("Unsupported file format");
        return;
      }

      const normalized = normalizeRows(parsedData);
      setData((prev) => ({ ...prev, [entity]: normalized }));
     


    } catch (err) {
      console.error(`❌ Failed to parse ${entity}:`, err);
      
      alert("Failed to parse file");
    }
  };

  useEffect(() => {
    const loadSampleData = async () => {
      const entities: ParsedEntity[] = ["clients", "workers", "tasks"];

      for (const entity of entities) {
        try {
          const res = await fetch(`/samples/${entity}.csv`);
          if (!res.ok) throw new Error(`Status ${res.status}`);
          const text = await res.text();
          const parsed = await parseCSV(text);
          const normalized = normalizeRows(parsed);

          setData((prev) => ({ ...prev, [entity]: normalized }));
        } catch (err) {
          console.warn(`⚠️ Failed to load sample ${entity}.csv:`, err);
        }
      }
    };

    loadSampleData();
  }, []);

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
        <h3 className="font-semibold mb-2">Parsed Preview (Normalized)</h3>
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {data.clients.length > 0 && (
        <div className="bg-red-100 text-red-800 p-4 rounded">
          <h4 className="font-semibold mb-2">Validation Errors: Clients</h4>
          {data.clients.map((row, i) => {
            const err = validateClientRow(row);
            return err ? (
              <div key={i}>
                Row {i + 1}: {JSON.stringify(err)}
              </div>
            ) : null;
          })}
        </div>
      )}

      {(["clients", "workers", "tasks"] as ParsedEntity[]).map((entity) => (
        <DataGridRenderer key={entity} entity={entity} data={data[entity]} />
      ))}
    </div>
  );
}
