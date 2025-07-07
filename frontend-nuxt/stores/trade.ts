import { defineStore } from "pinia";
import type { Trade } from "~/types/trade";

export const useTradeHistoryStore = defineStore(
  "tradeHistory",
  () => {
    const tradeList = ref<Trade[]>([]);

    const sortData = () => {
      tradeList.value = tradeList.value.sort(
        (a, b) =>
          new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()
      );
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
