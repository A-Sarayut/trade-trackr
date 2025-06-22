<script setup lang="ts">
const data = ref([
    {
        date: '2024-03-11T15:30:00',
        asset: 'BTC',
        side: 'Long',
        strategy: 'momentum',
        rr: 1.5,
        pnl: 24,
        result: 'TP'
    },
    {
        date: '2024-03-11T10:10:00',
        asset: 'AVAX',
        side: 'Long',
        strategy: 'momentum',
        rr: 1.5,
        pnl: 24,
        result: 'TP'
    },
    {
        date: '2024-03-11T08:50:00',
        asset: 'HYPE',
        side: 'Short',
        strategy: 'momentum',
        rr: 1.5,
        pnl: 24,
        result: 'SP'
    },
    {
        date: '2024-03-10T19:45:00',
        asset: 'AVAX',
        side: 'Short',
        strategy: 'momentum',
        rr: 1.5,
        pnl: 24,
        result: 'SL'
    },
    {
        date: '2024-03-10T15:55:00',
        asset: 'AVAX',
        side: 'Short',
        strategy: 'momentum',
        rr: 1.5,
        pnl: 24,
        result: 'TP'
    }
])
</script>

<template>
    <UTable sticky :data="data" class="flex-1">
        <template #date-cell="{ row }">
            <span class="text-sm text-gray-500">
                {{ row.original.date ? new Date(row.original.date).toLocaleDateString("en-US") : '' }}
            </span>
        </template>
    </UTable>
</template>
