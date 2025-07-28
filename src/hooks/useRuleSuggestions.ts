export const fetchRuleSuggestions = async (headers: string[], rows: any[]) => {
  const res = await fetch("/api/suggest-rules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ headers, sampleRows: rows.slice(0, 3) }),
  });

  if (!res.ok) throw new Error("Failed to fetch suggestions");
  const data = await res.json();
  return data.rules || [];
};
