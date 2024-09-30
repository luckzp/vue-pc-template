import request from './request'
const baseUrl = '/learnServ/article'

// 生成文章大纲，消耗次数
export const createArticleId = (data: any) =>
  request(`${baseUrl}/createArticle`, undefined, 'POST_JSON', data)

// 检查是否存在同名文章
export const checkArticleIsExist = (data: any) =>
  request(`${baseUrl}/checkArticleIsExist`, undefined, 'POST_JSON', data)

// 获取历史文章
export const getHistoryArticle = () => request(`${baseUrl}/historyArticle`, undefined, 'POST')

// 重新生成大纲，不消耗次数
export const regenerateOutline = (data: any) =>
  request(`${baseUrl}/generateOutline`, undefined, 'POST_JSON', data)

// 根据文章id轮询生成大纲以及内容
export const getArticleById = (id: number) =>
  request(`${baseUrl}/getArticleById?articleId=${id}`, undefined, 'GET')

// 点击下一步触发根据大纲生成内容
export const generateContent = (data: object) =>
  request(`${baseUrl}/generate`, undefined, 'POST_JSON', data)

// 内容生成失败，重新生成内容，不扣次数
export const regenerateContent = (data: object) =>
  request(`${baseUrl}/regenerate`, undefined, 'POST_JSON', data)

// 点击上一步
export const updateOutline = (data: object) =>
  request(`${baseUrl}/updateOutline`, undefined, 'POST_JSON', data)

// 导出为word文档
export const exportWord = (data: object) =>
  request(`${baseUrl}/exportWord`, undefined, 'POST_DOWNLOAD', data)

// 返回9.9版本信息
export const getSubscription = () => request(`${baseUrl}/getSubscription`, undefined, 'GET')

// 获取示例文章id
export const getSampleArticleId = () => request(`${baseUrl}/getSampleArticleId`, undefined, 'GET')
