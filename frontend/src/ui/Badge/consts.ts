import type { Severity, Tier } from "@dave/shared";

export const TIER_CLASS: Record<Tier, string> = {
  critical: "tierCritical",
  standard: "tierStandard",
  experimental: "tierExperimental",
};

export const SEVERITY_CLASS: Record<Severity, string> = {
  sev1: "sev1",
  sev2: "sev2",
  sev3: "sev3",
  sev4: "sev4",
};
