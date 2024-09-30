import { message } from 'ant-design-vue'
import { nextTick } from 'vue'
// import { exportWord } from '@/api/createArticle';
// import { downLoadFile } from '@/utils';

// 导出文章word
// export const onClickExport = async (articleId: number, articleTitle: string) => {
//   try {
//     await downLoadFile({ articleId }, exportWord, 'application/msword', `${articleTitle}.doc`);
//     message.success('导出成功');
//   } catch (error) {
//     message.error('导出失败');
//   }
// };
// 平滑滚动到视口
export const scrollToViewFn = async (parentClass: string, needScrollId: string) => {
  await nextTick()
  const { bottom: boxBottom } = document.querySelector(parentClass)?.getBoundingClientRect() || {
    bottom: 0
  }
  const itemDom = document.getElementById(needScrollId)
  const { bottom, height } = itemDom?.getBoundingClientRect() || { bottom: 0, height: 0 }
  if (bottom + height > boxBottom) {
    itemDom?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }
}

/**
 * 下载文件
 * @param param：接口传参
 * @param requestFunction：下载文件的接口
 * @param fileType：下载文件的mimeType类型
 * @param fileName：下载文件名称
 */
export const downLoadFile = async (
  param: unknown,
  requestFunction: any,
  fileType: string,
  fileName: string = ''
) => {
  const data: any = await requestFunction(param)
  if (data.code) {
    return Promise.reject('导出失败')
  }

  const blob = new Blob([data], { type: fileType })
  const url = window.URL.createObjectURL(blob)
  const downloadElement = document.createElement('a')
  downloadElement.href = url
  downloadElement.download = fileName
  downloadElement.click()
  URL.revokeObjectURL(downloadElement.href)
}
