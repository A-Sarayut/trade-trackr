import { defineStore } from "pinia";
import type { Trade } from "~/types/trade";

export const useTradeHistoryStore = defineStore(
  "tradeHistory",
  () => {
    const tradeList = ref<Trade[]>([]);

    const addTrade = (trade: Trade) => {
      tradeList.value.push(trade);
    };

    const updateTrade = (index: number, value: Trade) => {
      tradeList.value[index] = value;
    };

    const removeTrade = (index: number) => {
      tradeList.value.splice(index, 1);
    };

    return { tradeList, addTrade, updateTrade, removeTrade };
  },
  {
    persist: true,
  }
);
