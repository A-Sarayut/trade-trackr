export interface Trade {
  entryDate: string; // dd/mm/yyyy
  exitDate: string | null; // dd/mm/yyyy
  asset: string; // e.g., "AAPL", "BTC"
  side: string; // e.g., "Long", "Short"
  strategy: string; // e.g., "Scalping", "Day Trading", "Swing Trading", "Position Trading"
  rr: number; // Risk-Reward ratio
  result: string; 
  pnl: number | null; // Profit and Loss
  note: string | null; // Additional notes about the trade
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

export const enumSide = [
  "Long",
  "Short",
] as const;
