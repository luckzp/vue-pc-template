<template>
    <a-form ref="formRef" :model="formState" name="basic" :rules="rules" :label-col="{ style: { width: '130px' } }"
        :wrapper-col="{ span: 18 }" autocomplete="off" class="pr-[40px]" :colon="false">
        <a-form-item label="文章类型" name="articleType" required>
            <ButtonType v-model:activeBtn="formState.articleType" :btnList="['通用文章', '开题报告', '研究报告']" />
        </a-form-item>
        <a-form-item class="formItem-title" label="文章标题" name="articleTitle">
            <a-input v-model:value.trim="formState.articleTitle" :minLength="1" :maxLength="50" allowClear
                placeholder="文章标题尽可能具体，如：基于用户体验的元宇宙虚拟偶像设计研究" />
        </a-form-item>

        <a-form-item label="关键词" name="articleKeyword">
            <a-input v-model:value.trim="formState.articleKeyword" :minLength="5" :maxLength="30" allowClear
                placeholder="文章亮点或各部分核心点，逗号分隔，不超过5个" />
        </a-form-item>


        <a-form-item class="formItem-other" label="其他要求" name="otherRequirements">
            <a-textarea v-model:value.trim="formState.otherRequirements" :rows="6" :maxLength="50" allowClear
                placeholder="关于文章的其他要求，例如想要文章里使用什么方法等" />
        </a-form-item>
    </a-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import type { RuleObject } from 'ant-design-vue/es/form/interface';
import ButtonType from './ButtonType.vue';
import type { BaseInfo } from '../type.ts';
import type { FormInstance } from 'ant-design-vue';

const formRef = ref<FormInstance>();

const formState: BaseInfo = reactive({
    articleType: '通用文章',
    articleTitle: '人工智能',
    articleKeyword: '深度学习，Transformer',
    otherRequirements: '',
});

const checkTitle = (_rule: RuleObject, value: string) => {
    if (value === '') {
        return Promise.reject('请输入文章标题');
    } else if (value.length < 1 || value.length > 50) {
        return Promise.reject('文章标题必须在1到50个字符之间');
    } else {
        return Promise.resolve();
    }
};

const checkKeyWord = (_rule: RuleObject, value: string) => {
    if (value === '') {
        return Promise.reject('请输入关键词');
    } else if (value.length < 6 || value.length > 30) {
        return Promise.reject('关键词必须在6到30个字符之间');
    } else if (value.split(/[,，]/gi).length > 5) {
        return Promise.reject('关键词不能超过5个');
    } else {
        return Promise.resolve();
    }
};



const rules = {
    articleTitle: [{ required: true, trigger: ['blur', 'change'], validator: checkTitle }],
    articleKeyword: [{ required: true, trigger: ['blur', 'change'], validator: checkKeyWord }],
};


defineExpose({
    formRef,
    formState,
});
</script>

<style lang="less" scoped>
.formItem-title {
    :deep(.ant-form-item-control-input-content) {
        position: relative;

        .formItem-title-select {
            position: absolute;
            right: -100px;
            top: 5px;
        }
    }
}

.formItem-other {
    :deep(textarea) {
        resize: none;
    }
}
</style>