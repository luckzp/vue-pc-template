<template>
    <div class="flex flex-col p-[20px] min-w-[750px] max-w-[960px] mx-auto h-[100vh]">
        <div class="pb-[20px] text-right">
            <OprateTip :icon="'tool_history_01'" :text="'历史文章'" />
        </div>
        <div class="flex-1 h-0  flex flex-col">

            <a-steps :current="currentStep" :items="items"></a-steps>
            <StateTip v-if="tipState > 0" :tipState="tipState" :contentWriteStatusInfo="contentWriteStatusInfo"
                @retryCreateOutlne="retryCreateOutlne" @retryGetContent="retryGetContent"></StateTip>
            <div v-show="tipState === 0" class="flex-1 h-0 py-[30px] mt-[20px] overflow-auto">
                <BaseInfo ref="articleRef" v-show="currentStep == 0"></BaseInfo>
                <GroundSet ref="groundRef" v-show="currentStep == 1" />
                <ContentWrite ref="contentWriteRef" v-show="currentStep == 2" />
            </div>
            <div v-show="tipState === 0" class="flex justify-center gap-2 mt-2.5">
                <a-button v-if="currentStep === 0" type="primary" @click="() => nextStep_form()">
                    下一步
                </a-button>
                <template v-if="currentStep === 1">

                    <a-button @click="prevStep" class="common-btn">上一步</a-button>
                    <a-button class="common-btn" @click="generateOutline">
                        重新生成
                    </a-button>
                    <a-button type="primary" @click="nextStep_outLine" class="common-btn">
                        <span>下一步</span>
                        <br />
                        <span class="count">(-{{ groundRef?.outlineInfo.needNum }}次)</span>
                    </a-button>
                </template>

                <a-button v-if="currentStep == items.length - 1" :loading="loading_export" type="primary"
                    @click="handleExport()">
                    <SvgIcon icon-class="word"></SvgIcon>
                    导出为word
                </a-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { downLoadFile } from '@/utils/commontFn';

import OprateTip from './compoents/OprateTip.vue'
import BaseInfo from './compoents/BaseInfo.vue';
import GroundSet from './compoents/GroundSet.vue';
import ContentWrite from './compoents/ContentWrite.vue';
import { ref, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import StateTip from './compoents/StateTip.vue';

import {
    createArticleId,
    exportWord,
    checkArticleIsExist,
    getArticleById,
    regenerateOutline,
    generateContent,
    regenerateContent,
    updateOutline,
    getSampleArticleId,
} from '@/api/article';
const articleRef = ref<InstanceType<typeof BaseInfo>>();
const groundRef = ref<InstanceType<typeof GroundSet>>();
const contentWriteRef = ref<InstanceType<typeof ContentWrite>>();

const tipState = ref<number>(0); // 状态页的种类状态
const currentStep = ref<number>(0);
const items = [
    {
        title: '文章基本信息',
        key: '0',
    },
    {
        title: '大纲设置',
        key: '1',
    },
    {
        title: '内容编写',
        key: '2',
    },
];
const articleId = ref<number>(0); // 文章id
const articleTitle = ref<string>('');
let timer: number;
const loading_export = ref(false);

// 点击下一步生成大纲
const nextStep_form = async () => {
    const judge = await articleRef.value?.formRef?.validate().catch(() => { });
    if (!judge) return;
    await generateOutline();
};
const contentWriteStatusInfo = ref({
    progress: 0,
    progressMessage: '',
});
// 生成大纲消耗次数
const generateOutline = async () => {
    // 调用生成大纲的接口，在生成大纲接口中也会判断余量
    const { data } = await createArticleId(articleRef.value?.formState);


    currentStep.value = 1;
    tipState.value = 1; // 显示生成中状态页
    articleId.value = data.id;
    // 轮询生成大纲
    generateAticle();
};

// 轮询获取大纲或内容
const generateAticle = async (flag = false) => {
    // true代表是从历史文章的已完成点过来的
    clearInterval(timer);
    getArticle(flag);
    timer = setInterval(async () => {
        getArticle(flag);
    }, 5000);
};

const getArticle = async (flag = false) => {
    const { code, data } = await getArticleById(articleId.value);
    if (code == '200') {
        articleTitle.value = data.articleTitle;

        if (data.articleStatus == 1) {
            // 大纲生成成功
            clearInterval(timer);
            tipState.value = 0; //不显示
            await nextTick();
            groundRef.value?.initArticeLoutLine(data.outLine || []);
        } else if (data.articleStatus == 2) {
            // 大纲生成失败
            clearInterval(timer);
            tipState.value = 2;

        } if (data.articleStatus == 3) {
            // 内容编写中;
            contentWriteStatusInfo.value = {
                progress: data.progress,
                progressMessage: data.progressMessage,
            };
        }
        if (data.articleStatus == 5) {
            // 内容编写完成
            clearInterval(timer);
            tipState.value = 0; // 不显示
            await nextTick();
            if (!flag) {
                message.success('内容编写成功！');
            }
            contentWriteRef.value?.setContent(data.outLine || []);
        } else if (data.articleStatus == 4) {
            // 内容编写失败
            clearInterval(timer);
            tipState.value = 4;
        }
    }
};
// 重新生成大纲，不消耗次数
const retryCreateOutlne = async () => {
    tipState.value = 1; // 显示生成中状态页
    const { code, data } = await regenerateOutline(articleRef.value?.formState);
    if (code !== '200') return false;
    articleId.value = data.id;
    // 轮询生成大纲
    generateAticle();
};
const retryGetContent = async () => {
}

const judgeOutline = () => {
    const { hasNoCorrectTitle, hasNoTitle } = groundRef.value?.outlineInfo || {};
    if (hasNoTitle) {
        message.error('大纲标题不得为空!');
        return false;
    } else if (hasNoCorrectTitle) {
        message.error('大纲标题字数应大于2、小于40!');
        return false;
    }
    return true;
};
// 点击上一步
const prevStep = async () => {
    articleRef.value!.formRef?.resetFields();
    const flag = judgeOutline();
    if (!flag) return;

    const params = {
        articleId: articleId.value,
        outLine: groundRef.value?.groundList,
    };

    const { code, data, msg } = await updateOutline(params);
    if (code === '200') {
        currentStep.value--;
        const { articleTitle, articleType, articleKeyword, otherRequirements } = data || {};
        Object.assign(articleRef.value!.formState, {
            articleTitle,
            articleType,
            articleKeyword,
            // chaptersNum,
            otherRequirements,
        });
    } else {
        message.error(msg);
    }
};

// 生成内容
const nextStep_outLine = async () => {
    const flag = judgeOutline();
    if (!flag) return;

    const params = {
        articleId: articleId.value,
        outLine: groundRef.value?.groundList,
    };
    const { code } = await generateContent(params);


    // 不存在相同的且余量足
    currentStep.value++;
    tipState.value = 3; // 显示内容编写中

    // 轮询生成大纲
    generateAticle();
};
const onClickExport = async (articleId: number, articleTitle: string) => {
    try {
        await downLoadFile({ articleId }, exportWord, 'application/msword', `${articleTitle}.doc`);
        message.success('导出成功');
    } catch (error) {
        message.error('导出失败');
    }
};
const handleExport = async () => {
    loading_export.value = true;
    await onClickExport(articleId.value, articleTitle.value);
    loading_export.value = false;
};
</script>

<style scoped></style>