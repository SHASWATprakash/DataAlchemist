import { z } from "zod";

export const coRunRuleSchema = z.object({
  type: z.literal("coRun"),
  tasks: z.array(z.string().min(1)).min(2, "At least 2 tasks are required"),
});

export const slotRestrictionRuleSchema = z.object({
  type: z.literal("slotRestriction"),
  group: z.string().min(1),
  minCommonSlots: z.number().min(1),
});

export const phaseWindowRuleSchema = z.object({
  type: z.literal("phaseWindow"),
  task: z.string().min(1),
  allowedPhases: z.array(z.number().int().min(1)),
});

export const loadLimitRuleSchema = z.object({
  type: z.literal("loadLimit"),
  group: z.string().min(1),
  maxSlotsPerPhase: z.number().min(1),
});

export const ruleSchemas = {
  coRun: coRunRuleSchema,
  slotRestriction: slotRestrictionRuleSchema,
  phaseWindow: phaseWindowRuleSchema,
  loadLimit: loadLimitRuleSchema,
};

export const RuleUnionSchema = z.discriminatedUnion("type", [
  coRunRuleSchema,
  slotRestrictionRuleSchema,
  phaseWindowRuleSchema,
  loadLimitRuleSchema,
]);

export type Rule = z.infer<typeof RuleUnionSchema>;
