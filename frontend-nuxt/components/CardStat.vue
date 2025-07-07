<script setup lang="ts">
defineProps<{
    title?: string
    value?: string | number
    classText?: string
}>() 
</script>

<template>
    <UCard>
        <h2 class="text-lg font-bold text-neutral-500 truncate" :title="title">{{ title ?? 'N/A' }}</h2>
        <p class="text-3xl font-extrabold truncate" :class="classText" :title="String(value)">{{ value ?? 0 }}</p>
    </UCard>
</template>