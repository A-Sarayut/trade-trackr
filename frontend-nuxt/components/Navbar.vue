<script setup lang="ts">
// import type { NavigationMenuItem } from '@nuxt/ui'

// const items = [
//     {
//         label: 'Dashboard',
//         icon: 'i-ic-outline-space-dashboard',
//         to: '/'
//     },
//     {
//         label: 'History',
//         icon: 'i-lucide-database',
//         to: '/history'
//     }
// ] satisfies NavigationMenuItem[]

const colorMode = useColorMode()

const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set(_isDark) {
        colorMode.preference = _isDark ? 'dark' : 'light'
    }
})
</script>

<template>
    <div class="flex gap-4 py-2 px-4  flex-wrap sm:flex-nowrap items-center shadow-lg dark:bg-neutral-800">
        <ULink to="/" active class="text-nowrap font-bold text-3xl">Trade Trackr</ULink>
        <div class="flex-1 flex gap-2 items-center justify-end">
            <!-- <UNavigationMenu :items="items" class="w-full justify-end">
                <template #item="{ item }">
                    <NuxtLink :to="item.to" class="text-md font-medium">
                        {{ item.label }}
                    </NuxtLink>
                </template>
</UNavigationMenu> -->
            <ClientOnly v-if="!colorMode?.forced">
                <UButton :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="ghost"
                    @click="isDark = !isDark" />
                <template #fallback>
                    <div class="size-8" />
                </template>
            </ClientOnly>
        </div>
    </div>
</template>
