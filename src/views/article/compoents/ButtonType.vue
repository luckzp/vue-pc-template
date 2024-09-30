<template>
    <a-space :size="12">
        <a-button v-for="(ele, index) in btnList" :key="index" :type="activeBtn == ele ? 'primary' : 'default'"
            @click="lightBtn(ele)">
            {{ ele }}
        </a-button>
    </a-space>
</template>

<script setup lang="ts">
defineProps<{
    activeBtn: string | number;
    btnList: Array<string | number>;
}>();

const emit = defineEmits(['update:activeBtn']);

const lightBtn = (item: string | number) => {
    emit('update:activeBtn', item);
};
</script>