"use client";

import React, { useState } from "react";
import { DataGrid, Column, Row } from "react-data-grid";
import { validateClientRow, validateWorkerRow, validateTaskRow } from "@/lib/schemas";

type Props = {
  data: any[];
  entity: "clients" | "workers" | "tasks";
};

export default function DataGridRenderer({ data, entity }: Props) {
  const [rows, setRows] = useState(data);
  const [invalidRows, setInvalidRows] = useState<Record<number, boolean>>({});

  const columns: Column<any>[] = Object.keys(data[0] ?? {}).map((key) => ({
    key,
    name: key,
    editable: true,
    resizable: true,
    className: "text-sm",
    cellClass: (row: any) => {
      const rowIndex = rows.indexOf(row);
      return invalidRows[rowIndex] ? "bg-red-100 text-red-700" : "";
    },
  }));

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

  const handleRowsChange = (newRows: any[], changes: { indexes: number[] }) => {
    const updatedErrors: Record<number, boolean> = { ...invalidRows };

    changes.indexes.forEach((index) => {
      const row = newRows[index];
      updatedErrors[index] = !validateRow(row);
    });

    setRows(newRows);
    setInvalidRows(updatedErrors);
  };

  return (
    <div className="mt-8 border border-gray-300 rounded shadow overflow-hidden">
      <h2 className="font-semibold text-lg px-4 py-2 bg-gray-100 text-black">
        {entity.toUpperCase()} Table
      </h2>
      <DataGrid
        columns={columns}
        rows={rows}
        onRowsChange={handleRowsChange}
        className="rdg-light"
        style={{ minHeight: 300 }}
      />
      {Object.values(invalidRows).some(Boolean) && (
        <div className="text-red-700 bg-red-100 text-sm p-2">
          ⚠️ Some rows have invalid data. Errors are highlighted.
        </div>
      )}
    </div>
  );
}
