export const normalizeHeaders = (row: Record<string, any>) => {
  const normalized: Record<string, any> = {};
  Object.entries(row).forEach(([key, value]) => {
    const normKey = key
      .toLowerCase()
      .replace(/\s+/g, "")        // remove spaces
      .replace(/[^a-z0-9]/gi, ""); // remove special chars
    normalized[normKey] = value;
  });
  return normalized;
};

export const normalizeRows = (rows: Record<string, any>[]) =>
  rows.map(normalizeHeaders);
