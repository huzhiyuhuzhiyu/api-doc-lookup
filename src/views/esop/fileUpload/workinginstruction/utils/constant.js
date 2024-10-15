/**
 * 弹窗类型
 * @type {{ADD: string, EDIT: string, VIEW: string}}
 * @readonly
 * @enum {string}
 * @property {string} ADD - 新增
 * @property {string} EDIT - 编辑
 * @property {string} VIEW - 查看
 */
export const ModelType ={
    "ADD":'add',
    "EDIT":'edit',
    "VIEW":'look',
}
/**
 * 文件分类类型
 * @type {{DRAFT: string, SUBMIT: string}}
 * @readonly
 * @enum {string}
 * @property {string} DRAFT - 草稿
 * @property {string} SUBMIT - 提交
 */
export const DocumentStatus ={
    DRAFT: 'draft',
    SUBMIT: 'submit',
}
/**
 * 申请类型
 * @readonly
 * @enum {string}
 * @property {string} WORK - 作业指导书
 * @property {string} INSPECT - 检验指导书
 * @property {string} IMAGE - 图文档
 */
export const ApplicationType ={
    "WORK":"work",
    "INSPECT":"inspect",
    "IMAGE":"image",

}
