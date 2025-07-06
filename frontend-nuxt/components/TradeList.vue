<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { Trade } from '~/types/trade';


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

const bufferTrade = ref<Trade | null>(null);
const editTradeIndex = ref<number | null>(null);
const isEditing = ref(false);
const confirmModal = ref(false);

const onEditTrade = (trade: Trade, index: number) => {
    bufferTrade.value = trade;
    editTradeIndex.value = index;
    isEditing.value = true;
}

const onDeleteTrade = (index: number) => {
    confirmModal.value = true;
    editTradeIndex.value = index;
};

const handleUpdateTrade = (trade: Trade) => {
    try {
        if (editTradeIndex.value === null) {
            console.error("Edit index is null, cannot update trade.");
            toast.add({
                title: "Error",
                description: "Failed to update the trade. Please try again.",
                color: "error",
            });
            return;
        }
        tradeHistory.updateTrade(editTradeIndex.value, trade);
    } catch (error) {
        console.error("Error updating trade:", error);
        toast.add({
            title: "Error",
            description: "Failed to update the trade. Please try again.",
            color: "error",
        });
        return;
    }

    toast.add({
        title: "Success",
        description: "Trade updated successfully.",
        color: "success",
    });

    isEditing.value = false;
};

const handleDeleteTrade = () => {
    try {
        if (editTradeIndex.value === null) {
            console.error("Delete index is null, cannot delete trade.");
            toast.add({
                title: "Error",
                description: "Failed to delete the trade. Please try again.",
                color: "error",
            });
            return;
        }
        tradeHistory.removeTrade(editTradeIndex.value);
    } catch (error) {
        console.error("Error deleting trade:", error);
        toast.add({
            title: "Error",
            description: "Failed to delete the trade. Please try again.",
            color: "error",
        });
        editTradeIndex.value = null;
        return;
    }

    toast.add({
        title: "Success",
        description: "Trade deleted successfully.",
        color: "success",
    });

    editTradeIndex.value = null;
};

</script>

<template>
    <UTable sticky :data="tradeHistory.tradeList" :columns="columns" class="flex-1">

        <template #entryDate-cell="{ row }">
            <td class="text-sm text-gray-500">
                {{ row.original.entryDate ? formatDate(row.original.entryDate) : '' }}
            </td>
        </template>

        <template #exitDate-cell="{ row }">
            <td class="text-sm text-gray-500">
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
                <UBadge :color="row.original.side === 'Long' ? 'success' : 'error'" variant="soft">
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
            <td class="flex justify-center">
                <UInput v-model="row.original.asset" variant="none" class="w-[80px]" :ui="{ 'base': 'text-center' }"
                    maxlength="5" />
            </td>
        </template>

        <template #pnl-cell="{ row }">
            <td class="text-sm"
                :class="{ 'text-error': (row.original.pnl ?? 0) < 0, 'text-success': (row.original.pnl ?? 0) > 0 }">
                {{ row.original.pnl ? row.original.pnl : '' }}
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
                        { label: 'Edit', icon: 'ic-baseline-edit', onSelect: () => onEditTrade(row.original, row.index) },
                        { label: 'Delete', icon: 'ic-baseline-delete-forever', color: 'error', onSelect: () => onDeleteTrade(row.index) }]]"
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

    <NewTrade v-if="bufferTrade" v-model="isEditing" :initial-data="{
        ...bufferTrade,
        side: bufferTrade.side as 'Long' | 'Short',
        strategy: bufferTrade.strategy as 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading',
        result: bufferTrade.result as 'Pending' | 'Take profit' | 'Stop profit' | 'Stop loss' | 'Cancel',
        pnl: bufferTrade.pnl ?? undefined,
        note: bufferTrade.note ?? undefined,
        exitDate: bufferTrade.exitDate ?? undefined
    }" :key="editTradeIndex?.toString()" @submit="handleUpdateTrade" />

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