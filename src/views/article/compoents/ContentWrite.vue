<script setup lang="ts">
import type { OutlineItem } from '../type.ts';
import { inject, ref, type Ref } from 'vue';
import ContentItem from './ContentItem.vue';
const contentList = ref<OutlineItem[]>([]);

const isDemo = inject<Ref<boolean>>('isDemo', ref(false));

const setContent = (content: OutlineItem[]) => {
    contentList.value = content || [];
};
defineExpose({ setContent });
</script>

<template>
    <div class="content-write-container">
        <div class="content-box">
            <ContentItem :contentList="contentList"></ContentItem>
        </div>
        <SvgIcon v-if="isDemo" icon-class="demoIcon" class="demoIcon"></SvgIcon>
    </div>
</template>

<style lang="less" scoped>
.content-write-container {
    position: relative;
    height: 100%;
    padding: 16px;
    padding-right: 6px;
    border-radius: 12px;
    border: 1px solid rgba(220, 220, 220, 1);

    .content-box {
        height: 100%;
        overflow: auto;
    }

    .demoIcon {
        position: absolute;
        top: -1px;
        right: -1px;
        width: 82px;
        height: 63px;
        margin: 0;
    }
}
</style>
