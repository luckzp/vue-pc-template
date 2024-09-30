export type OutlineItem = {
  serialNumber: string
  title: string
  content?: string | null
  children?: OutlineItem[] | null
}

export type BaseInfo = {
  articleType: string // 文章类型
  articleTitle: string // 文章表土
  articleKeyword: string // 关键词
  otherRequirements: string // 其它要求
}

export type MessageType = {
  id: number
  updateTime: string
  articleStatus: number // 0大纲生成中 1大纲设置=大纲生成完成 2大纲生成失败 3内容编写中 4内容编写失败 5已完成
  // articleOutline: string;
  loading_export?: boolean
} & BaseInfo

export type OutlineInfo = {
  needNum: number
  allSum: number
  hasNoTitle: boolean
  hasNoCorrectTitle: boolean
}
