<script setup lang="ts">
const route = useRoute()

const currentPage = computed(() => {
    // return route.name ? route.name.toString().replace(/-/g, ' ') : 'Home'
    return route.name ? route.name.toString() : 'Home'
})
</script>

<template>
    <h1 class="first-letter:uppercase font-bold mb-8 text-5xl">
        {{ currentPage }}
    </h1>
</template>