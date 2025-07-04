export interface Trade {
  entryDate: string; // dd/mm/yyyy
  exitDate: string | null | undefined; // dd/mm/yyyy
  asset: string; // e.g., "AAPL", "BTC"
  side: "Long" | "Short";
  strategy: string; // e.g., "Scalping", "Day Trading", "Swing Trading", "Position Trading"
  rr: number | null | undefined; // Risk-Reward ratio
  result: "Pending" | "Take profit" | "Stop profit" | "Stop loss" | "Cancel";
  pnl: number | null | undefined; // Profit and Loss
  note: string | null | undefined; // Additional notes about the trade
}

export const enumResult = [
  "Pending",
  "Take profit",
  "Stop profit",
  "Stop loss",
  "Cancel",
] as const;

export const enumStrategy = [
  "Scalping",
  "Day Trading",
  "Swing Trading",
  "Position Trading",
] as const;
