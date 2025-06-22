<script setup lang="ts">
import EquityCurve from '~/components/EquityCurve.vue';

definePageMeta({
    name: 'dashboard'
})
</script>

<template>
    <div class="grid grid-cols-1 gap-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <CardStat title="Total Trade" :value="20" />
            <CardStat title="Win Rate" value="20%" />
            <CardStat title="Total PNL" value="20%" />
        </div>

        <EquityCurve />
        <TradeList />
    </div>
</template>