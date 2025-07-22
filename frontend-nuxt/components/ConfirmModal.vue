<script setup lang="ts">
import type { NuxtUIColor } from '~/types/nuxt-ui';

const props = defineProps<{
    title?: string,
    description?: string,
    color?: NuxtUIColor,
}>();
const emit = defineEmits(['confirm', 'cancel']);
const open = defineModel<boolean>('open', { default: false });

</script>

<template>
    <UModal :title="props.title ?? 'Are you sure?'" :description="props.description" v-model:open="open" :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-md '
    }" :ui="{ footer: 'justify-end gap-4' }">
        <template #footer>
            <UButton label="Cancel" color="neutral" variant="outline" @click="() => { emit('cancel'); open = false }" />
            <UButton label="Confirm" :color="props.color ?? 'warning'" @click="() => { emit('confirm'); open = false }" />
        </template>


    </UModal>
</template>