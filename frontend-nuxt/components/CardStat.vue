<script setup lang="ts">
defineProps<{
    title?: string
    value?: string | number
}>() 
</script>

<template>
    <UCard>
        <h2 class="text-lg font-semibold truncate" :title="title">{{ title ?? 'N/A' }}</h2>
        <p class="text-2xl font-bold truncate" :title="String(value)">{{ value ?? 0 }}</p>
    </UCard>
</template>