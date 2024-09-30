<template>
    <svg :class="svgClass">
        <use :xlink:href="`#icon-${iconClass}`" />
    </svg>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
    iconClass: {
        type: String,
        required: true,
    },
    className: {
        type: String,
        default: '',
    }
});

const svgClass = computed(() =>
    `inline-block w-[1em] h-[1em] align-[-0.15em] fill-current overflow-hidden mx-[5px] cursor-pointer focus:outline-none ${props.className}`
);
</script>