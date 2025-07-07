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

        <ULink to="/" active class="text-nowrap flex flex-row items-center gap-1 font-bold font-nunito text-3xl">
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 h-6 fill-[#1ab3aa]">
                    <rect x="80" y="220" width="120" height="200" rx="8" />
                    <rect x="240" y="140" width="120" height="280" rx="8" />
                    <rect x="400" y="80" width="120" height="340" rx="8" />
                </svg>
            </span>
            Trade Trackr
        </ULink>
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
