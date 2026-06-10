/**
 * 审批流程编码
 * @readonly
 * @enum {string}
 * @property {string} WORK - 作业指导书
 * @property {string} INSPECT - 检验指导书
 * @property {string} IMAGE - 图文档
 */
export const FlowCode={
    "WORK":'b048',
    "INSPECT":'b049',
    "IMAGE":'b050',
    "OFFICE":'b052',
    "CUSTOMER_PRODUCT":'b065',
}

export const FlowId={
    "WORK":'614838882801931013',
    "INSPECT":'615901895025876485',
    "IMAGE":'615902865885617669',
    "OFFICE":'616955543407424965',
}
/**
 * 页面间跳转传递的时间参数
 * @type {{MONTH: number, WEEK: number, DAY: number}}
 */
export const SearchTimeType = {
    DAY:'DAY',
    WEEK:'WEEK',
    MONTH:'MONTH',
}
/**
 * 页面间跳转传递的时间参数
 * @type {{MONTH: number, WEEK: number, DAY: number}}
 */
export const SearchTimeType2Chinese = {
    [SearchTimeType.DAY]:'今日',
    [SearchTimeType.WEEK] :'本周',
    [SearchTimeType.MONTH] :'本月',
}
