import type { ReactNode } from "react";
import type { Severity, Tier } from "@dave/shared";

export type BadgeTone = "tier" | "severity" | "neutral" | "team";

interface BaseProps {
  children: ReactNode;
  className?: string;
}

interface TierProps extends BaseProps {
  tone: "tier";
  value: Tier;
}

interface SeverityProps extends BaseProps {
  tone: "severity";
  value: Severity;
}

interface NeutralProps extends BaseProps {
  tone: "neutral";
}

interface TeamProps extends BaseProps {
  tone: "team";
  /** Hash bucket 1-8 (use hashTeamColor) — colored left dot. */
  bucket: number;
}

export type BadgeProps = TierProps | SeverityProps | NeutralProps | TeamProps;
