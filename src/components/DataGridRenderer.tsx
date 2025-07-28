"use client";

import { DataGrid } from "react-data-grid";

type Props = {
  data: any[];
  entity: string;
};

export default function DataGridRenderer({ data, entity }: Props) {
  if (data.length === 0) return null;

  const columns = Object.keys(data[0]).map((key) => ({
    key,
    name: key,
    editable: true,
    resizable: true
  }));

  return (
    <div className="mt-6 border border-gray-300 rounded shadow overflow-auto">
      <h2 className="font-semibold text-lg px-4 py-2 bg-gray-100 text-black">
        {entity.toUpperCase()} Table
      </h2>
      <DataGrid
        columns={columns}
        rows={data}
        className="rdg-light"
        style={{ minHeight: 300 }}
      />
    </div>
  );
}
