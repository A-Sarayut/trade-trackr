<script setup lang="ts">
import EquityCurve from '~/components/EquityCurve.vue';
import { type Trade } from '~/types/trade'

definePageMeta({
  name: 'dashboard'
})

const open = ref(false);
const toast = useToast();
const tradeHistory = useTradeHistoryStore();
const totalTrades = computed(() => tradeHistory.tradeList.length);

const finishTrades = computed(() => tradeHistory.tradeList.filter(trade => trade.result !== 'Pending' && trade.result !== 'Cancel'))
const winRate = computed(() => {
  const winTrades = finishTrades.value.filter(trade => ['Take profit', 'Stop profit'].includes(trade.result)).length;

  return finishTrades.value.length > 0 ? (winTrades / finishTrades.value.length * 100).toFixed(2) + '%' : '0%';
});

const totalPNL = computed(() => {
  const totalPnl = finishTrades.value.reduce((acc, trade) => acc + (trade.pnl ?? 0), 0);
  return totalPnl.toFixed(2);
});

const handleAddTrade = (trade: Trade) => {
  try {
    tradeHistory.addTrade(trade);
  } catch (error) {
    console.error("Error adding trade:", error);
    toast.add({
      title: "Error",
      description: "Failed to add the trade. Please try again.",
      color: "error",
      icon: "mdi:close-circle"
    });
    return;
  }

  toast.add({
    title: "Success",
    description: "Trade added successfully.",
    color: "success",
    icon: "mdi:close-circle"
  });

  open.value = false;
};



</script>

<template>
  <div class="grid grid-cols-1 gap-8">
    <header class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <CardStat class="text-center" title="Total Trade" :value="totalTrades" />
      <CardStat class="text-center" title="Win Rate" :value="winRate" />
      <CardStat class="col-span-2 text-center sm:col-span-1" title="Total PNL"
        :value="formatCurrency(parseFloat(totalPNL))" :classText="parseFloat(totalPNL) != 0 ?
          parseFloat(totalPNL) < 0 ? 'text-error' : 'text-success'
          : undefined" />
    </header>

    <EquityCurve :trade-data="tradeHistory.tradeList" />
    <section class="flex flex-col gap-2 justify-end">
      <span class="ms-auto">
        <UButton @click="open = true" label="New Trade" icon="ic-baseline-add" />
        <NewTrade v-model="open" @submit="handleAddTrade" />
      </span>
      <TradeList />
    </section>
  </div>
</template>