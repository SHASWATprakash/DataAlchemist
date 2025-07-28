import { z } from "zod";

// Clients
export const clientSchema = z.object({
  clientid: z.string().min(1),
  clientname: z.string().min(1),
  prioritylevel: z.coerce.number().min(1).max(5),
  requestedtaskids: z.string(),
  grouptag: z.string().optional(),
  attributesjson: z.string().optional(),
});
export const validateClientRow = (row: any) => {
  const result = clientSchema.safeParse(row);
  return result.success ? null : result.error?.format();
};

// Workers
export const workerSchema = z.object({
  workerid: z.string().min(1),
  workername: z.string().min(1),
  skills: z.string(),
  availableslots: z.string(), // assuming CSV string like "1,2,3"
  maxloadperphase: z.coerce.number().min(1),
  workergroup: z.string().optional(),
  qualificationlevel: z.string().optional(),
});
export const validateWorkerRow = (row: any) => {
  const result = workerSchema.safeParse(row);
  return result.success ? null : result.error?.format();
};

// Tasks
export const taskSchema = z.object({
  taskid: z.string().min(1),
  taskname: z.string().min(1),
  category: z.string(),
  duration: z.coerce.number().min(1),
  requiredskills: z.string(),
  preferredphases: z.string(), // "1-3" or "2,4,5"
  maxconcurrent: z.coerce.number().min(1),
});
export const validateTaskRow = (row: any) => {
  const result = taskSchema.safeParse(row);
  return result.success ? null : result.error?.format();
};
