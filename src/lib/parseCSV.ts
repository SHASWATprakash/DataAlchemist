import Papa from "papaparse";

export const parseCSV = async (text: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data as any[]),
      error: reject,
    });
  });
};
