<template>
  <div class="flex mt-[80px] justify-center ">
    <div class="box-item" v-show="tipState == 1">
      <img src="@/assets/imgs/outline_ing.png" alt="" />
      <strong>大纲生成中，预计等待8-15s</strong>
      <span>生成好后可调整大纲</span>
    </div>
    <div class="box-item" v-show="tipState == 2">
      <img src="@/assets/imgs/outline_fail.png" alt="" />
      <strong>大纲生成失败</strong>
      <a-button type="primary" @click="emits('retryCreateOutlne')">
        <SvgIcon icon-class="retry"></SvgIcon>
        重新生成
      </a-button>
      <img class="erweiCode" src="@/assets/imgs/aiHelpCode.png" alt="" />
      <em>遇到问题？联系客服</em>
    </div>

    <div class="box-item" v-show="tipState == 3">
      <a-progress class="progressBox" type="circle" :percent="contentWriteStatusInfo.progress" :size="150"
        strokeColor="#534ffe" :strokeWidth="7">
        <template #format="percent">
          <div class="rate">{{ percent }}%</div>
          <span class="text">{{ contentWriteStatusInfo.progressMessage }}</span>
        </template>
      </a-progress>
      <strong>内容编写中,请稍候</strong>
      <span class="writing-tip">
        可以去试试其他功能哦
        <br />
        PS：【历史范文】中查看编写结果
      </span>
    </div>

    <div class="box-item" v-show="tipState == 4">
      <img src="@/assets/imgs/outline_fail.png" alt="" />
      <strong>内容编写失败</strong>
      <a-button type="primary" @click="emits('retryGetContent')">
        <SvgIcon icon-class="retry"></SvgIcon>
        重新生成
      </a-button>
      <img class="erweiCode" src="@/assets/imgs/aiHelpCode.png" alt="" />
      <em>遇到问题？联系客服</em>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  tipState: number;
  contentWriteStatusInfo: { progress: number; progressMessage: string };
}>();

const emits = defineEmits<{
  (event: 'retryCreateOutlne'): void;
  (event: 'retryGetContent'): void;
}>();
</script>

<style lang="less" scoped>
.box-item {


  strong {
    display: block;
    margin-top: 24px;
    margin-bottom: 8px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
  }

  span {
    display: block;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
  }

  .erweiCode {
    display: block;
    margin: 48px auto 0;
  }

  em {
    margin-top: 10px;
    font-style: normal;
  }

  .progressBox {
    :deep(.ant-progress-text) {
      .rate {
        color: #534ffe;
        font-weight: 600;
        font-size: 20px;
      }

      .text {
        margin-top: 10px;
        color: #4e5969;
        font-size: 14px;
      }
    }
  }

  .writing-tip {
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
  }
}
</style>
