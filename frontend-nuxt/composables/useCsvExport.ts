import type { Trade } from "~/types/trade";

export interface TradeExport {
  id: string
  date: string
  symbol: string
  side: 'BUY' | 'SELL'
  entryPrice: number
  exitPrice: number
  quantity: number
  pnl: number
  pnlPercentage?: string
  strategy?: string
  notes?: string
  status?: 'open' | 'closed'
  entryTime?: string
  exitTime?: string
  createdAt?: string
  updatedAt?: string
}

export const useCsvExport = () => {
  const convertToCSV = <T extends Record<string, any>>(data: T[]): string => {
    if (!data || data.length === 0) return "";

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV header row
    const csvHeaders = headers.join(",");

    // Create CSV data rows
    const csvRows = data.map((row) => {
      return headers
        .map((header) => {
          const value = row[header];
          // Handle values that might contain commas, quotes, or newlines
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"') || value.includes("\n"))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? "";
        })
        .join(",");
    });

    return [csvHeaders, ...csvRows].join("\n");
  };

  const downloadCSV = (
    csvContent: string,
    filename: string = "trades-export.csv"
  ): void => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const exportTradesToCSV = (trades: Trade[], filename?: string): void => {
    if (!trades || trades.length === 0) {
      console.warn("No trades to export");
      return;
    }

    // Format trades for CSV export
    const formattedTrades = trades.map((trade) => ({
      Date: trade.entryDate || "",
      Asset: trade.asset || "",
      Side: trade.side || "",
      "Entry Date": trade.entryDate || "",
      "Exit Date": trade.exitDate || "",
      Strategy: trade.strategy || "",
      RR: trade.rr,
      Result: trade.result || "",
      PNL: trade.pnl || "",
      Notes: trade.note || "",
    }));

    const csvContent = convertToCSV(formattedTrades);
    const timestamp = new Date().toISOString().split("T")[0];
    const defaultFilename = filename || `trades-${timestamp}.csv`;

    downloadCSV(csvContent, defaultFilename);
  };

  const exportToJSON = <T>(data: T[], filename: string): void => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return {
    exportTradesToCSV,
    convertToCSV,
    exportToJSON
  };
};
