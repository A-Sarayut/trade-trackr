<script setup lang="ts">
import EquityCurve from '~/components/EquityCurve.vue';

definePageMeta({
    name: 'dashboard'
})

// const tradeHistory = useTradeHistoryStore()
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
                <NewTrade />
            </span>

            <!-- <div v-for="trade in tradeHistory.tradeList" class="mb-4">
                {{ trade }}
            </div> -->

            <TradeList />
        </section>
    </div>
</template>