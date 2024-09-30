<template>
    <div class="ground-container">
        <div class="ground-main-box">
            <GroundItem v-if="groundList.length" :groundList="groundList"></GroundItem>
        </div>

        <div class="addTitle">
            <a-tooltip>
                <template #title>新增一级章节</template>
                <SvgIcon icon-class="circel_add" class-name="text-4xl text-red-500!" @click="addFirstLevelTitle" />
            </a-tooltip>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import type { OutlineItem, OutlineInfo } from '@/views/article/type';
import { scrollToViewFn } from '@/utils/commontFn';
import GroundItem from './GroundItem.vue';
import { computed, defineExpose, inject, provide, reactive, ref } from 'vue';
import type { Ref } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue'
const isDemo = inject<Ref<boolean>>('isDemo', ref(false));

const groundList = ref<OutlineItem[]>([]);

// 保存每个章节数量级别
const outlineInfo = computed(() => {
    const leng = groundList.value.length;
    const obj = reactive({
        needNum: 6,
        allSum: leng,
        hasNoTitle: false,
        hasNoCorrectTitle: false,
    });

    getLevelInfo(groundList.value, obj);
    return obj;
});

const getLevelInfo = (list: OutlineItem[], obj: OutlineInfo) => {
    list.forEach((item) => {
        if (!item.children?.length) obj.needNum += 2;
        if (!item.title) obj.hasNoTitle = true;
        if (item.title?.length < 2 || item.title?.length > 40) obj.hasNoCorrectTitle = true;
        if (item.children) {
            obj.allSum += item.children.length;
            getLevelInfo(item.children, obj);
        }
    });
};

const initArticeLoutLine = (data: OutlineItem[]) => {
    setMoreInfo(data);
    groundList.value = data;
};

const setMoreInfo = (list: OutlineItem[], preOrder = '') => {
    list.forEach((item, index) => {
        item.serialNumber = preOrder + String(index + 1);
        if (item.children) {
            setMoreInfo(item.children, item.serialNumber + '.');
        }
    });
};

const rebuildList = () => {
    setMoreInfo(groundList.value);
};

// 添加一级标题
const addFirstLevelTitle = async () => {
    const len = groundList.value.length;
    if (len >= 20) {
        return message.warn('一级标题不能超过20个');
    }
    const outlineItem: OutlineItem = {
        title: '',
        serialNumber: String(len + 1),
    };
    groundList.value.push(outlineItem);

    scrollToViewFn('.ground-main-box', 'scrollId' + outlineItem.serialNumber);
};

// 提供一个方法，可以被后代组件注入
provide('rebuildList', rebuildList);
provide('outlineInfo', outlineInfo);

defineExpose({ groundList, outlineInfo, initArticeLoutLine });
</script>
<style lang="less" scoped>
.ground-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-left: 50px;

    .ground-main-box {
        flex: 1;
        height: 0;
        overflow: auto;
    }

    .addTitle {
        margin-top: 24px;
        text-align: center;
    }
}
</style>