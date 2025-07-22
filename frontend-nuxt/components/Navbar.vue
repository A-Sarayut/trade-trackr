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
const confirmModal = ref(false)
const tradeHistory = useTradeHistoryStore()
const toast = useToast();

const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set(_isDark) {
        colorMode.preference = _isDark ? 'dark' : 'light'
    }
})

const handleReset = () => {
    tradeHistory.removeAll()

    toast.add({
        title: "Success",
        description: "Trades deleted successfully.",
        color: "success",
        icon: "mdi:check-circle"
    });
}
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
            <!-- <ClientOnly v-if="!colorMode?.forced">
                <UButton :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="ghost"
                    @click="isDark = !isDark" />
                <template #fallback>
                    <div class="size-8" />
                </template>
            </ClientOnly> -->

            <USlideover title="Setting" :close="{
                color: 'primary',
                variant: 'outline',
                class: 'rounded-md'
            }" :ui="{ footer: 'justify-end' }">
                <UButton color="neutral" variant="link" icon="ic-baseline-settings" size="xl" />

                <template #body>
                    <!-- <Placeholder class="h-full" /> -->
                    <div class="flex flex-col gap-4">
                        <UCard>
                            <div class="flex flex-nowrap sm:items-center gap-x-4">
                                <div class="flex ring ring-default  rounded-md w-fit h-fit p-2">
                                    <UIcon name="ic-outline-dark-mode" class="size-8 text-blue-800" />
                                </div>
                                <div class="flex items-center justify-between flex-1 gap-2 flex-wrap">
                                    <div>
                                        <h3 class="font-semibold">
                                            Dark Theme
                                        </h3>
                                        <small class="text-neutral-500">
                                            Switch to dark mode
                                        </small>
                                    </div>
                                    <USwitch v-model="isDark" />
                                </div>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="flex flex-nowrap sm:items-center  gap-x-4">
                                <div class="flex ring ring-default rounded-md w-fit h-fit p-2">
                                    <UIcon name="ic-twotone-delete-forever" class="size-8 text-error" />
                                </div>
                                <div class="flex items-center justify-between flex-1 gap-2 flex-wrap">
                                    <div>
                                        <h3 class="font-semibold">
                                            Reset All Data
                                        </h3>
                                        <small class="text-neutral-500">
                                            Permanently delete all trade data
                                        </small>
                                    </div>
                                    <UButton color="error" variant="outline" @click="confirmModal = true">Reset
                                    </UButton>
                                </div>
                            </div>
                        </UCard>
                    </div>
                </template>
            </USlideover>

            <ConfirmModal v-model:open="confirmModal" @confirm="handleReset"
                description="Your trade history will be permanently deleted " color="error" />
        </div>
    </div>
</template>
