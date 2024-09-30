<script setup lang="ts">
import type { OutlineItem } from '../type';
defineProps({
    contentList: {
        type: Array<OutlineItem>,
        default: () => [],
    },
});
</script>

<template>
    <template v-for="item in contentList" :key="item.serialNumber">
        <div class="content-item">
            <div class="content-item-title">
                <span>{{ item.serialNumber }}</span>
                &nbsp;
                <span>{{ item.title }}</span>
            </div>
            <div v-if="item.content">
                <v-md-preview :text="item.content" class="content-item-content"></v-md-preview>
            </div>
        </div>
        <!-- 递归组件 -->
        <ContentItem v-if="item.children" :contentList="item.children"></ContentItem>
    </template>
</template>

<style lang="less">
.content-write-container {
    .content-item {
        .content-item-title {
            font-weight: 600;
            margin-bottom: 5px;
        }

        .content-item-content {
            font-size: 14px;
            word-break: break-word;
            margin-bottom: 5px;

            .vuepress-markdown-body:not(.custom) {
                padding: 0;
            }

            .vuepress-markdown-body {
                color: #000000;
                font-size: 14px;
                background-color: transparent;

                .v-md-prism-markdown {
                    text-wrap: wrap;
                }

                p {
                    word-break: break-word;
                    margin: 0;
                    text-indent: 2em;
                }

                ul,
                ol {
                    margin: 0;
                }

                h1,
                h2,
                h3,
                h4 {
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
