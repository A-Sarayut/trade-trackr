import { defineStore } from "pinia";
import type { Trade } from "~/types/trade";

export const useTradeHistoryStore = defineStore(
  "tradeHistory",
  () => {
    const tradeList = ref<Trade[]>([]);

    const sortData = () => {
      tradeList.value = tradeList.value.sort((a, b) => {
        // Sort by date descending
        const dateDiff =
          new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime();
        if (dateDiff !== 0) return dateDiff;

        // If same date, show 'pending' first
        if (a.result === "Pending" && b.result !== "Pending") return -1;
        if (b.result === "Pending" && a.result !== "Pending") return 1;

        return 0; // keep original order if both are same status or neither is pending

        // new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()
      });
    };

    const addTrade = (trade: Trade) => {
      tradeList.value.push(trade);
      sortData();
    };

    const updateTrade = (id: string, value: Trade) => {
      const index = tradeList.value.findIndex((item) => item.id == id);
      if (index !== -1) {
        tradeList.value[index] = value;
        sortData();
      }
    };

    const removeTrade = (id: string) => {
      const index = tradeList.value.findIndex((item) => item.id == id);
      if (index !== -1) {
        tradeList.value.splice(index, 1);
      }
    };

    return { tradeList, addTrade, updateTrade, removeTrade };
  },
  {
    persist: true,
  }
);
