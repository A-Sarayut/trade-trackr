<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'

const chartData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
        {
            data: [100, 120, 99, 80, 70],
            fill: false,
            borderColor: 'oklch(72.3% 0.219 149.579)',
            tension: 0.1
        }
    ]
}

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
</script>

<template>
    <div class="">
        <h1 class="first-letter:uppercase font-bold text-neutral-500 mb-4 text-2xl">
            Equity Curve
        </h1>
        <BaseChart class="max-h-[280px]" :data="chartData" :options="chartOptions" />
    </div>
</template>
