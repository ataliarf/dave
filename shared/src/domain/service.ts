export const TIERS = ["critical", "standard", "experimental"] as const;
export type Tier = (typeof TIERS)[number];

export interface Service {
  id: string;
  name: string;
  team: string;
  tier: Tier;
  language: string;
  repo: string;
}
