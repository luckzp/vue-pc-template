<template>
    <span
        class="inline-block w-26 h-8 text-sm text-gray-600 leading-8 text-center rounded-lg transition-all duration-300 cursor-pointer hover:text-indigo-600 hover:bg-gray-100">
        <SvgIcon :iconClass="icon" class="text-lg mr-2 align-sub" />
        <span>{{ text }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue'

defineProps<{
    icon: string;
    text: string;
}>();
</script>