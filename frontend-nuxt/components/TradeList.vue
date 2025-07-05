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

const onEditTrade = (trade: Trade, index: number) => {
    bufferTrade.value = trade;
    editTradeIndex.value = index;
    isEditing.value = true;
}

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

        <template #actions-cell="{ row }">
            <td class="text-sm">
                <UButton color="primary" class="text-xs" @click="onEditTrade(row.original, row.index)">
                    Edit
                </UButton>
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

</template>
