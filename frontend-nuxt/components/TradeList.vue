<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { NuxtUIColor, NuxtUIVariant } from '~/types/nuxt-ui';
import { enumResult, type Trade } from '~/types/trade';


const tradeHistory = useTradeHistoryStore()
const toast = useToast();

const columns: TableColumn<Trade>[] = [
    { accessorKey: 'entryDate', header: 'Entry Date' },
    { accessorKey: 'exitDate', header: 'Exit Date' },
    { accessorKey: 'asset', header: 'Asset' },
    { accessorKey: 'side', header: 'Side' },
    { accessorKey: 'strategy', header: 'Strategy' },
    { accessorKey: 'rr', header: 'RR' },
    { accessorKey: 'pnl', header: 'PNL' },
    { accessorKey: 'result', header: 'Result' },
    { accessorKey: 'note', header: 'Note' },
    { accessorKey: 'actions', header: 'Actions', cell: () => '' }
]

const tradeList = ref(tradeHistory.tradeList)
const bufferTrade = ref<Trade | null>(null);
const tradeID = ref<string | null>(null)
const isEditing = ref(false);
const confirmModal = ref(false);

const globalFilter = ref()

// Pagination config
const pageSize = 10
const currentPage = ref(1)
const totalItems = computed(() => tradeList.value.length)

// Slice data based on page
const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return tradeList.value.slice(start, start + pageSize)
})


const onEditTrade = (trade: Trade, id: string) => {
    bufferTrade.value = trade;
    tradeID.value = id;
    isEditing.value = true;
}

const onDeleteTrade = (id: string) => {
    confirmModal.value = true;
    tradeID.value = id;
};

const handleUpdateTrade = (trade: Trade) => {
    try {
        if (tradeID.value === null) {
            console.error("Edit ID is null, cannot update trade.");
            toast.add({
                title: "Error",
                description: "Failed to update the trade. Please try again.",
                color: "error",
                icon: "mdi:close-circle"
            });
            return;
        }
        tradeHistory.updateTrade(tradeID.value, trade);
    } catch (error) {
        console.error("Error updating trade:", error);
        toast.add({
            title: "Error",
            description: "Failed to update the trade. Please try again.",
            color: "error",
            icon: "mdi:close-circle"
        });
        return;
    }

    toast.add({
        title: "Success",
        description: "Trade updated successfully.",
        color: "success",
        icon: "mdi:check-circle"
    });

    isEditing.value = false;
};

const handleDeleteTrade = () => {
    try {
        if (tradeID.value === null) {
            console.error("Delete ID is null, cannot delete trade.");
            toast.add({
                title: "Error",
                description: "Failed to delete the trade. Please try again.",
                color: "error",
                icon: "mdi:check-circle"
            });
            return;
        }
        tradeHistory.removeTrade(tradeID.value);
    } catch (error) {
        console.error("Error deleting trade:", error);
        toast.add({
            title: "Error",
            description: "Failed to delete the trade. Please try again.",
            color: "error",
            icon: "mdi:check-circle"
        });
        tradeID.value = null;
        return;
    }

    toast.add({
        title: "Success",
        description: "Trade deleted successfully.",
        color: "success",
        icon: "mdi:check-circle"
    });

    tradeID.value = null;
};

const colorResult = (result: typeof enumResult[number]): { color: NuxtUIColor, icon: string } => {
    let color: NuxtUIColor = "neutral"
    let icon = "mdi:cancel"
    switch (result) {
        case "Pending":
            color = "warning"
            icon = "mdi:clock"
            break;
        case "Take profit":
            color = "success"
            icon = "mdi:check-circle"
            break;
        case "Stop profit":
            color = "info"
            icon = "mdi:check-underline-circle"
            break;
        case "Stop loss":
            color = "error"
            icon = "mdi:close-circle"
            break;

        default:
            break;
    }
    return { color, icon }
}

</script>

<template>
    <div class="flex flex-col gap-4 w-full border border-accented rounded-lg py-4">
        <div class="px-4">
            <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
        </div>

        <UTable sticky :data="paginatedRows" v-model:global-filter="globalFilter" :columns="columns"
            class="flex-1 border-y border-accented">

            <template #entryDate-cell="{ row }">
                <td class="text-sm font-bold text-gray-500">
                    {{ row.original.entryDate ? formatDate(row.original.entryDate) : '' }}
                </td>
            </template>

            <template #exitDate-cell="{ row }">
                <td class="text-sm font-bold text-gray-500">
                    {{ row.original.exitDate ? formatDate(row.original.exitDate) : '' }}
                </td>
            </template>

            <template #side-header="h">
                <span class="flex justify-center">
                    {{ h.header.column.columnDef.header }}
                </span>
            </template>
            <template #side-cell="{ row }">
                <span class="flex justify-center">
                    <UBadge :color="row.original.side === 'Long' ? 'success' : 'error'" variant="soft" size="lg">
                        {{ row.original.side }}
                    </UBadge>
                </span>
            </template>

            <template #asset-header="h">
                <span class="flex justify-center">
                    {{ h.header.column.columnDef.header }}
                </span>
            </template>
            <template #asset-cell="{ row }">
                <td class="flex font-bold justify-center">
                    <p>{{ row.original.asset }}</p>
                </td>
            </template>

            <template #pnl-header="h">
                <span class="flex justify-end">
                    {{ h.header.column.columnDef.header }}
                </span>
            </template>
            <template #pnl-cell="{ row }">
                <td class="font-bold flex justify-end"
                    :class="{ 'text-error': (row.original.pnl ?? 0) < 0, 'text-success': (row.original.pnl ?? 0) > 0 }">
                    {{ row.original.pnl ? formatCurrency(row.original.pnl) : '' }}
                </td>
            </template>

            <template #result-header="h">
                <span class="flex justify-center">
                    {{ h.header.column.columnDef.header }}
                </span>
            </template>
            <template #result-cell="{ row }">
                <td class="flex font-bold justify-center">
                    <UBadge :color="colorResult(row.original.result as typeof enumResult[number]).color" variant="soft"
                        size="lg" :icon="colorResult(row.original.result as typeof enumResult[number]).icon">
                        {{ row.original.result }}
                    </UBadge>
                </td>
            </template>

            <template #note-cell="{ row }">
                <td class="text-sm">
                    <UModal v-if="row.original.note" title="Note" :close="{
                        color: 'primary',
                        variant: 'outline',
                        class: 'rounded-md'
                    }">
                        <UButton color="neutral" icon="ic:outline-sticky-note-2" variant="link" />

                        <template #body>
                            <div class="overflow-auto">
                                <pre class="font-sans">{{ row.original.note }}</pre>
                            </div>
                        </template>
                    </UModal>
                </td>

            </template>

            <template #actions-cell="{ row }">
                <td class="text-sm">
                    <UDropdownMenu
                        :items="[[
                            { label: 'Edit', icon: 'ic-baseline-edit', onSelect: () => onEditTrade(row.original, row.original.id) },
                            { label: 'Delete', icon: 'ic-baseline-delete-forever', color: 'error', onSelect: () => onDeleteTrade(row.original.id) }]]"
                        :content="{
                            align: 'start',
                            side: 'bottom',
                            sideOffset: 8
                        }" :ui="{
                            content: 'w-48'
                        }">
                        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
                    </UDropdownMenu>
                </td>
            </template>
        </UTable>

        <UPagination class="ms-auto pe-4" v-model:page="currentPage" :items-per-page="pageSize" :total="totalItems"
            :sibling-count="1" />
    </div>




    <NewTrade v-if="bufferTrade" v-model="isEditing" is-edit :initial-data="{
        ...bufferTrade,
        side: bufferTrade.side as 'Long' | 'Short',
        strategy: bufferTrade.strategy as 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading',
        result: bufferTrade.result as 'Pending' | 'Take profit' | 'Stop profit' | 'Stop loss' | 'Cancel',
        pnl: bufferTrade.pnl ?? undefined,
        note: bufferTrade.note ?? undefined,
        exitDate: bufferTrade.exitDate ?? undefined
    }" :key="tradeID ?? ''" @submit="handleUpdateTrade" />

    <ConfirmModal v-model:open="confirmModal" @confirm="handleDeleteTrade"
        description="You really want to delete this trade" />
</template>


<style scoped>
pre {
    white-space: pre-wrap;
    /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;
    /* Mozilla, since 1999 */
    white-space: -pre-wrap;
    /* Opera 4-6 */
    white-space: -o-pre-wrap;
    /* Opera 7 */
    word-wrap: break-word;
    /* Internet Explorer 5.5+ */
}
</style>