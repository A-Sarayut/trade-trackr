<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { type Trade } from '~/types/trade'

const props = defineProps<{
    tradeData: Trade[]
}>()
const data = computed(() => {
    // break reactivity with Array.map to extract shallow copies
    const tradeData = props.tradeData.map(item => ({ ...item, })).sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());
    return calculatePNLByDay(tradeData)
})
const triggerUpdate = ref(false)

const chartData = computed<ChartData>(() => {
    return {
        labels: data.value.map(item => item.date),
        datasets: [
            {
                data: data.value.map(item => item.pnl),
                fill: false,
                borderColor: 'oklch(72.3% 0.219 149.579)',
                tension: 0.1
            }
        ]
    }
})

const chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
        title: {
            display: false,
            text: 'TradeTrackr Weekly PnL'
        },
    },
    scales: {
        y: {
            ticks: {
                callback: function (value) {
                    return `${value.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    })}`
                }
            }
        }
    }
}

watch(() => props.tradeData, () => {
    triggerUpdate.value = !triggerUpdate.value
}, { deep: true, immediate: true })

</script>

<template>
    <div>
        <h1 class="first-letter:uppercase font-bold text-neutral-500 mb-4 text-2xl">
            Equity Curve
        </h1>
        <BaseChart class="max-h-[280px]" :data="chartData" :options="chartOptions" :key="String(triggerUpdate)" />
    </div>
</template>
