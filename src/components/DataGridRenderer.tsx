"use client";

import React, { useState, useEffect } from "react";
import { DataGrid, Column } from "react-data-grid";
import {
  validateClientRow,
  validateWorkerRow,
  validateTaskRow,
} from "@/lib/schemas";

type EntityType = "clients" | "workers" | "tasks";

type Props = {
  data: any[];
  entity: EntityType;
};

export default function DataGridRenderer({ data, entity }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [invalidRows, setInvalidRows] = useState<Record<number, boolean>>({});

  // ✅ Always update rows when incoming data changes
  useEffect(() => {
    setRows(data || []);
    const errors: Record<number, boolean> = {};

    data.forEach((row, index) => {
      const isValid =
        entity === "clients"
          ? !validateClientRow(row)
          : entity === "workers"
          ? !validateWorkerRow(row)
          : !validateTaskRow(row);

      if (!isValid) errors[index] = true;
    });

    setInvalidRows(errors);
  }, [data, entity]);

  const validateRow = (row: any): boolean => {
    switch (entity) {
      case "clients":
        return validateClientRow(row) === null;
      case "workers":
        return validateWorkerRow(row) === null;
      case "tasks":
        return validateTaskRow(row) === null;
    }
  };

  const handleRowsChange = (
    updatedRows: any[],
    { indexes }: { indexes: number[] }
  ) => {
    const updatedErrors: Record<number, boolean> = { ...invalidRows };

    indexes.forEach((index) => {
      const row = updatedRows[index];
      updatedErrors[index] = !validateRow(row);
    });

    setRows(updatedRows);
    setInvalidRows(updatedErrors);
  };

  const columns: Column<any>[] =
    rows.length > 0
      ? Object.keys(rows[0]).map((key) => ({
          key,
          name: key,
          editable: true,
          resizable: true,
          className: "text-sm",
          cellClass: (row: any) =>
            invalidRows[rows.indexOf(row)] ? "bg-red-100 text-red-700" : "",
        }))
      : [];

  return (
    <div className="mt-8 border border-gray-300 rounded shadow overflow-hidden">
      <h2 className="font-semibold text-lg px-4 py-2 bg-gray-100 text-black">
        {entity.toUpperCase()} Table
      </h2>

      {columns.length > 0 ? (
        <DataGrid
          columns={columns}
          rows={rows}
          onRowsChange={handleRowsChange}
          className="rdg-light"
          style={{ minHeight: 300 }}
        />
      ) : (
        <div className="text-sm text-gray-500 px-4 py-2">
          ⚠️ No data to display for <b>{entity}</b>.
        </div>
      )}

      {Object.values(invalidRows).some(Boolean) && (
        <div className="text-red-700 bg-red-100 text-sm p-2">
          ⚠️ Some rows have invalid data. Errors are highlighted.
        </div>
      )}
    </div>
  );
}
