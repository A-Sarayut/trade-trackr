<template>
    <div>
        <!-- Trigger Button -->
        <UButton @click="isOpen = true" :disabled="!trades.length" icon="i-heroicons-document-arrow-down"
            variant="outline" color="neutral">
            Export Data
        </UButton>

        <!-- Export Modal -->
        <UModal v-model:open="isOpen" title="Export Trading Data" :close="{
            color: 'primary',
            variant: 'outline',
            class: 'rounded-md'
        }" :ui="{ footer: 'justify-end' }">

            <template #body>
                <div class="space-y-6">
                    <!-- Date Range Filter -->
                    <label class="block text-sm font-medium mb-2">Date Range (Optional)</label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-gray-500 mb-1">From</label>
                            <input v-model="dateRange.from" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-xs text-gray-500 mb-1">To</label>
                            <input v-model="dateRange.to" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <!-- Symbol Filter -->
                    <label class="block text-sm font-medium mb-2">Symbols (Optional)</label>
                    <input v-model="symbolFilter" type="text" placeholder="e.g., AAPL, TSLA, SPY (comma-separated)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    <!-- File Format -->
                    <div>
                        <label class="block text-sm font-medium mb-2">File Format</label>
                        <USelect v-model="fileFormat" :items="fileFormats" />
                    </div>

                    <!-- Preview -->
                    <div v-if="filteredData.length > 0">
                        <label class="block text-sm font-medium mb-2">Preview</label>
                        <div class="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                            <pre class="text-xs">{{ previewText }}</pre>
                        </div>
                    </div>

                    <!-- Export Stats -->
                    <div class="bg-blue-50 rounded-md p-3">
                        <h4 class="font-medium text-blue-900 mb-1">Export Summary</h4>
                        <p class="text-sm text-blue-700">
                            <span class="font-bold">{{ filteredData.length }} trades</span> will be
                            exported
                        </p>
                    </div>
                </div>
            </template>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <UButton @click="isOpen = false" variant="outline">
                        Cancel
                    </UButton>
                    <UButton @click="handleExport" :loading="isExporting" :disabled="filteredData.length === 0"
                        color="success">
                        Export {{ fileFormat.toUpperCase() }}
                    </UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { useCsvExport } from '~/composables/useCsvExport'
import type { Trade } from '~/types/trade'


interface Props {
    trades?: Trade[]
}

interface FileFormat {
    label: string
    value: 'csv' | 'json'
}

interface DateRange {
    from: string
    to: string
}

const props = withDefaults(defineProps<Props>(), {
    trades: () => [],
})

const { exportTradesToCSV, convertToCSV, exportToJSON } = useCsvExport()
const toast = useToast()

const isOpen = ref<boolean>(false)
const isExporting = ref<boolean>(false)
const fileFormat = ref<'csv' | 'json'>('csv')
const dateRange = ref<DateRange>({
    from: '',
    to: ''
})
const symbolFilter = ref<string>('')


const fileFormats = ref<FileFormat[]>(
    [
        { label: 'CSV', value: 'csv' },
        { label: 'JSON', value: 'json' }
    ]
)


const filteredData = computed(() => {
    const tradeData = props.trades.map(item => ({ ...item, })).sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());

    let filtered = tradeData

    // Date range filter
    if (dateRange.value.from) {
        filtered = filtered.filter(trade => new Date(trade.entryDate) >= new Date(dateRange.value.from))
    }
    if (dateRange.value.to) {
        filtered = filtered.filter(trade => new Date(trade.entryDate) <= new Date(dateRange.value.to))
    }

    // Symbol filter
    if (symbolFilter.value) {
        const symbols = symbolFilter.value.split(',').map(s => s.trim().toUpperCase())
        filtered = filtered.filter(trade =>
            symbols.includes(trade.asset?.toUpperCase())
        )
    }

    return filtered
})

const previewText = computed(() => {
    if (filteredData.value.length === 0) return 'No data to preview'

    if (fileFormat.value === 'json') {
        return JSON.stringify(filteredData.value.slice(0, 3), null, 2)
    } else {
        const preview = [...filteredData.value].slice(0, 3)
        // Format trades for CSV export
        const formattedTrades = preview.map((trade) => ({
            Date: trade.entryDate || "",
            Asset: trade.asset || "",
            Side: trade.side || "",
            "Entry Date": trade.entryDate || "",
            "Exit Date": trade.exitDate || "",
            Strategy: trade.strategy || "",
            RR: trade.rr,
            Result: trade.result || "",
            PNL: trade.pnl || "",
            Notes: trade.note || "",
        }));

        return convertToCSV(formattedTrades)
    }
})

const handleExport = async () => {
    if (filteredData.value.length === 0) {
        toast.add({
            title: 'No data to export',
            description: 'Please adjust your filters',
            color: 'warning'
        })
        return
    }

    try {
        isExporting.value = true
        const timestamp = new Date().toISOString().split('T')[0]

        if (fileFormat.value === 'json') {
            exportToJSON(filteredData.value, `trades-${timestamp}.json`)
        } else {
            exportTradesToCSV(filteredData.value as Trade[], `trades-${timestamp}.csv`)
        }

        toast.add({
            title: 'Export successful!',
            description: `${filteredData.value.length} trades exported`,
            color: 'success'
        })

        isOpen.value = false
    } catch (error) {
        console.error('Export failed:', error)
        toast.add({
            title: 'Export failed',
            description: 'There was an error during export',
            color: 'error'
        })
    } finally {
        isExporting.value = false
    }
}

</script>