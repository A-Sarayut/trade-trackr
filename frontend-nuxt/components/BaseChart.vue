<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    Chart,
    type ChartType,
    type ChartData,
    type ChartOptions,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale
} from 'chart.js'

// Register chart components
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale)

interface Props {
    chartId?: string
    type?: ChartType
    data: ChartData
    options?: ChartOptions
}

const props = withDefaults(defineProps<Props>(), {
    chartId: 'line-chart',
    type: 'line',
    options: () => ({})
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
    if (canvasRef.value) {
        new Chart(canvasRef.value, {
            type: props.type,
            data: props.data,
            options: props.options
        })
    }
})
</script>

<template>
    <canvas :id="chartId" ref="canvasRef" />
</template>

<style scoped>
canvas {
    max-width: 100%;
}
</style>
