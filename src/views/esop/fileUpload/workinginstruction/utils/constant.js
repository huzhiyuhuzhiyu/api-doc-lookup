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
 * @property {string} OFFICE - 办公文件
 * @property {string} SYSTEM - 系统附件
 */
export const ApplicationType = {
    "WORK":"work",
    "INSPECT":"inspect",
    "IMAGE":"image",
    "OFFICE":"office",
    "SYSTEM":"system"
}
/**
 *  审批状态
 *  @readonly
 *  @enum {string}
 *  @property {string} ING - 审批中
 *  @property {string} NO - 不通过
 *  @property {string} OK - 通过
 *  @property {string} REBUT - 驳回
 *  @property {string} TRANSFERRED - 转交
 *  @property {string} WAIT - 待审批
 *  @property {string} WITHDRAWN - 已撤回
 */
export const ApprovalStatus ={
    ING: 'ing',
    NO: 'no',
    OK: 'ok',
    REBUT: 'rebut',
    TRANSFERRED: 'transferred',
    WAIT: 'wait',
    WITHDRAWN: 'withdrawn',
}


/**
 * 文件管理作业页面类型
 * @readonly
 * @enum {string}
 * @property {string} FileManagementWork - 文件管理 作业指导书
 * @property {string} FileUploadWork - 文件上传作业指导书
 * @property {string} FileManagementImage - 文件管理 图文档
 * @property {string} FileManagementImage - 文件管理 图文档
 * @property {string} FileManagementInspect - 文件管理 检验指导书
 */
export const PageType ={
    FileManagementWork:'FileManagementWork',
    FileManagementDocument:'FileManagementDocument',
    FileManagementImage:'FileManagementImage',
    FileManagementOffice:'FileManagementOffice',
    FileManagementInspect:'FileManagementInspect',
    FileUploadWork:'FileUploadWork',
}
export const FileManagePageSet = new Set([
    PageType.FileManagementOffice,
    PageType.FileManagementWork,
    PageType.FileManagementDocument,
    PageType.FileManagementImage,
    PageType.FileManagementInspect,
])
