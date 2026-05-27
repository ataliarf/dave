import { hashString } from "../../../utils/hash";

/** Maps a team name to one of the 8 team-stripe color buckets (1..8). */
export function hashTeamColor(team: string): number {
  return (hashString(team) % 8) + 1;
}
