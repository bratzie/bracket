export interface Match {
  winner: string;
  loser?: string;
  top: Match | string;
  bottom: Match | string;
}
