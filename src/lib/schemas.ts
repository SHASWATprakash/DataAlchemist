import { z } from "zod";

export const clientSchema = z.object({
  clientid: z.string().min(1),
  clientname: z.string().min(1),
  prioritylevel: z.coerce.number().min(1).max(5),
  requestedtaskids: z.string(),
  grouptag: z.string().optional(),
  attributesjson: z.string().optional()
});

export const validateClientRow = (row: any) => {
  const parsed = clientSchema.safeParse(row);
  return parsed.success ? null : parsed.error.format();
};
