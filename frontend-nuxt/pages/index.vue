<script setup lang="ts">
import EquityCurve from '~/components/EquityCurve.vue';
import {  type Trade } from '~/types/trade'

definePageMeta({
    name: 'dashboard'
})

const open = ref(false);
const toast = useToast();
const tradeHistory= useTradeHistoryStore();

const handleAddTrade = (trade: Trade) => {
  try {
    tradeHistory.addTrade(trade);
  } catch (error) {
    console.error("Error adding trade:", error);
    toast.add({
      title: "Error",
      description: "Failed to add the trade. Please try again.",
      color: "error",
    });
    return;
  }

  toast.add({
    title: "Success",
    description: "Trade added successfully.",
    color: "success",
  });

  open.value = false;
};



</script>

<template>
    <div class="grid grid-cols-1 gap-8">
        <header class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <CardStat title="Total Trade" :value="20" />
            <CardStat title="Win Rate" value="20%" />
            <CardStat title="Total PNL" value="20%" />
        </header>

        <EquityCurve />
        <section class="flex flex-col justify-end">
            <span class="ms-auto">
                 <UButton @click="open = true" label="New Trade" icon="ic-baseline-add"/>
                <NewTrade v-model="open" @submit="handleAddTrade" />
            </span>
            <TradeList />
        </section>
    </div>
</template>