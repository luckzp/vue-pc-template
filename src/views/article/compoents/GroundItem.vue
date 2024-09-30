<script setup lang="ts">
import { message } from 'ant-design-vue';
import type { OutlineItem } from '../type.ts';
import { scrollToViewFn } from '@/utils/commontFn';
import { inject, ref } from 'vue';
import type { Ref } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue'
const props = defineProps({
    groundList: {
        type: Array<OutlineItem>,
        default: () => [],
    },
});

// 注入一个值，若为空则使用提供的函数类型的默认值
const rebuildList = inject<() => void>('rebuildList', () => { });
const outlineInfo = inject<Ref<{ allSum: number }>>('outlineInfo', ref({ allSum: 0 }));
const isDemo = inject<Ref<boolean>>('isDemo', ref(false));

const title1 = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const orderLevel = title1.concat(['十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十']);

const removeItem = (index: number) => {
    let num = ref(1);
    getCurrentNum(props.groundList[index].children || [], num);
    if (outlineInfo?.value.allSum - num.value < 3) {
        return message.warn('至少保留三个标题');
    }
    props.groundList.splice(index, 1);
    rebuildList?.();
};

const getCurrentNum = (list: OutlineItem[], num: Ref<number>) => {
    list?.forEach((item) => {
        num.value++;
        item.children && getCurrentNum(item.children, num);
    });
};

const addItem = async (item: OutlineItem) => {
    item.children ??= [];
    const length = item.children.length;
    const outlineItem = { title: '', serialNumber: item.serialNumber! + '.' + (length + 1) };
    item.children.push(outlineItem);

    scrollToViewFn('.ground-main-box', 'scrollId' + outlineItem.serialNumber);
};

const getLevel = (serialNumber?: string) => {
    return serialNumber?.split('.').length || 1;
};
</script>

<template>
    <template v-for="(item, index) in groundList" :key="item.serialNumber">
        <div class="ground-item" :id="'scrollId' + item.serialNumber">
            <div class="ground-item-content">
                <div class="ground-item-order"
                    :style="{ 'text-indent': (getLevel(item.serialNumber) - 1) * 32 + 'px' }">
                    <span v-if="getLevel(item.serialNumber) === 1">{{ orderLevel[(Number(item.serialNumber) || 1) - 1]
                        }}</span>
                    <span v-else>{{ item.serialNumber }}</span>
                </div>
                <div class="ground-item-title">
                    <a-input v-model:value="item.title" :readonly="isDemo" :maxlength="40"
                        :placeholder="`填写${orderLevel[getLevel(item.serialNumber) - 1]}级标题`" />
                </div>
            </div>

            <div class="ground-item-operate">
                <a-tooltip>
                    <template #title>删除本章节</template>
                    <SvgIcon icon-class="circel_remove" class="text-[24px]" @click="removeItem(index)" />
                </a-tooltip>
                <a-tooltip>
                    <template #title>新增子章节</template>
                    <SvgIcon v-if="getLevel(item.serialNumber) < 3" icon-class="circel_add" class="text-[24px]"
                        @click="addItem(item)" />
                </a-tooltip>
            </div>
        </div>
        <!-- 递归组件 -->
        <GroundItem v-if="item.children" :groundList="item.children"></GroundItem>
    </template>
</template>

<style lang="less" scoped>
.ground-item {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 16px;

    &:first-of-type {
        margin-top: 0;
    }

    .ground-item-content {
        display: flex;
        align-items: center;
        gap: 16px;
        width: calc(100% - 100px);

        .ground-item-order {
            // font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
        }

        .ground-item-title {
            flex: 1;
        }
    }

}
</style>
