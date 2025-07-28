// src/lib/ruleSchemas.ts
import { z } from "zod";

export const coRunSchema = z.object({
  type: z.literal("coRun"),
  tasks: z.array(z.string()).min(2),
});

export const slotRestrictionSchema = z.object({
  type: z.literal("slotRestriction"),
  group: z.string(),
  minCommonSlots: z.number().min(1),
});

export const phaseWindowSchema = z.object({
  type: z.literal("phaseWindow"),
  task: z.string(),
  allowedPhases: z.array(z.number()).min(1),
});

export const loadLimitSchema = z.object({
  type: z.literal("loadLimit"),
  group: z.string(),
  maxSlotsPerPhase: z.number().min(1),
});

export const ruleSchema = z.discriminatedUnion("type", [
  coRunSchema,
  slotRestrictionSchema,
  phaseWindowSchema,
  loadLimitSchema,
]);
