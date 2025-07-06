<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { enumResult, enumSide, enumStrategy, type Trade } from '~/types/trade'

const open = defineModel({ type: Boolean, default: false })

const schema = z.object({
    entryDate: z.string().date('Must be a valid date'),
    exitDate: z.optional(z.string().date('Must be a valid date')),
    asset: z.string().min(1, 'Asset is required, example: "BTC"')
        .max(5, 'Asset must be less than 5 characters'),
    side: z.enum(['Long', 'Short'], {
        errorMap: () => ({ message: 'Side must be either Long or Short' })
    }),
    strategy: z.enum(enumStrategy, {
        errorMap: () => ({ message: 'Strategy must be one of the predefined strategies' })
    }),
    rr: z.number().min(0, 'RR must be a positive number'),
    result: z.enum(enumResult),
    pnl: z.optional(z.number()),
    note: z.optional(z.string().max(200, 'Note must be less than 200 characters'))
}).superRefine((data, ctx) => {
    if (
        data.result !== "Pending" &&
        data.result !== "Cancel" &&
        (data.pnl === undefined || data.pnl === null)
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['pnl'],
            message: 'PNL is required unless result is Pending or Cancel'
        });
    }
});

type Schema = z.output<typeof schema>

const props = defineProps<{
    isEdit?: boolean,
    initialData?: Partial<Schema>
}>()

const emit = defineEmits<{
    (e: 'submit', data: Trade): void
}>()


onMounted(() => {
    if (props.initialData) {
        state.value = {
            ...state.value,
            ...props.initialData
        }
    }
})


const state = ref<Schema>({
    entryDate: new Date().toISOString().split('T')[0], // Default to today
    exitDate: undefined,
    asset: "",
    side: "Long",
    strategy: enumStrategy[0], // Default to the first strategy
    rr: 1.5,
    result: "Pending",
    pnl: undefined,
    note: undefined,
})


watch(() => state.value.result, (newValue) => {
    if (newValue === 'Pending' || newValue === 'Cancel') {
        state.value.pnl = undefined // Reset PNL if result is Pending or Cancel
    }
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    const newTrade = {
        ...event.data,
        exitDate: event.data.exitDate ?? null, // Always provide exitDate
        note: event.data.note ?? null, // Always provide exitDate
        pnl: event.data.pnl ?? null, // Always provide exitDate
    }

    emit('submit', newTrade)
}
</script>

<template>
    <UModal v-model:open="open" :title="isEdit ? 'Update trade' : 'New trade'"
        :description="isEdit ? 'Update the trade' : 'Create a new trade'" :close="{
            color: 'primary',
            variant: 'outline',
            class: 'rounded-md'
        }" :ui="{ footer: 'justify-end' }">

        <template #body>
            <UForm :schema="schema" :state="state" class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit="onSubmit">
                <UFormField size="lg" label="Entry Date" name="entryDate">
                    <UInput v-model="state.entryDate" type="date" class="input-field" />
                </UFormField>

                <UFormField size="lg" label="Exit Date" name="exitDate">
                    <UInput v-model="state.exitDate" type="date" class="input-field" />
                </UFormField>

                <UFormField size="lg" label="Asset" name="asset">
                    <UInput v-model="state.asset" class="input-field" />
                </UFormField>

                <UFormField size="lg" label="Side" name="side">
                    <USelect v-model="state.side" :items="[...enumSide]" class="input-field w-full" placeholder="BTC" />
                </UFormField>

                <UFormField size="lg" label="Strategy" name="strategy">
                    <USelect v-model="state.strategy" :items="[...enumStrategy]" class="input-field w-full" />
                </UFormField>

                <UFormField size="lg" label="RR" name="rr">
                    <UInputNumber v-model="state.rr" class="input-field" :step="0.1" />
                </UFormField>

                <UFormField size="lg" label="Result" name="result">
                    <USelect v-model="state.result" :items="[...enumResult]" class="input-field w-full" />
                </UFormField>

                <UFormField size="lg" label="PNL" name="pnl">
                    <UInputNumber v-model="state.pnl" :disabled="['Pending', 'Cancel'].includes(state.result || '')"
                        class="input-field" locale="en-US" :step="0.01" :format-options="{
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'symbol',
                            signDisplay: 'exceptZero'
                        }" :ui="{
                            base: (state.pnl ?? 0) > 0 ? 'text-green-500' :
                                (state.pnl ?? 0) < 0 ? 'text-red-500' : ''
                        }" />
                </UFormField>

                <UFormField size="lg" label="Note" name="note" class="col-span-full">
                    <UTextarea v-model="state.note" class="input-field w-full" autoresize :maxrows="8" />
                </UFormField>

                <div class="col-span-full flex justify-end">
                    <UButton type="submit">
                        Submit
                    </UButton>
                </div>
            </UForm>
        </template>
    </UModal>
</template>

<style scoped>
.input-field {
    width: 100%;
}
</style>