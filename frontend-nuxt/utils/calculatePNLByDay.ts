import type { Trade } from "~/types/trade";

export default function calculatePNLByDay(trades: Trade[]) {
  const pnlMap: Record<string, number> = {};

  for (const trade of trades) {
    if (trade.pnl === null) continue;

    // Convert yyyy/mm/dd → yyyy-mm-dd
    const [yyyy, mm, dd] = trade.entryDate.split("-");
    const formattedDate = `${dd}-${mm}-${yyyy}`;

    if (!pnlMap[formattedDate]) {
      pnlMap[formattedDate] = 0;
    }

    pnlMap[formattedDate] += trade.pnl;
  }

  // Convert to sorted array
  return Object.entries(pnlMap)
    .map(([date, pnl]) => ({ date, pnl }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
