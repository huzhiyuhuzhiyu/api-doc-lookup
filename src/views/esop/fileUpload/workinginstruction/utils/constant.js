
export const ORDER_CODE_FILE_UPLOAD = 'WJSCSQ'

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
    "COPY":'copy',
    "SEARCH":'search',
}
export const isModelType=(type)=>{
    return Object.values(ModelType).includes(type)
}


/**
 * 文件分类类型
 * @type {{DRAFT: string, SUBMIT: string}}
 * @readonly
 * @enum {string}
 * @property {string} DRAFT - 草稿
 * @property {string} SUBMIT - 提交
 * @property {string} BACK - 退回
 */
export const DocumentStatus ={
    DRAFT: 'draft',
    SUBMIT: 'submit',
    BACK:'back',
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
    "SYSTEM":"system",
    "CUSTOMER_PRODUCT":"customer_product",
}
export const ApplicationType2Chinese = {
    [ApplicationType.WORK]:'作业指导书',
    [ApplicationType.IMAGE]:'图文档',
    [ApplicationType.OFFICE]:'办公文档',
    [ApplicationType.INSPECT]:'检验指导书',
    [ApplicationType.CUSTOMER_PRODUCT]:'客户产品工艺',
}
const ApplicationType2PathSuffix={
    [ApplicationType.WORK]:'workinginstruction',
    [ApplicationType.IMAGE]:'docment',
    [ApplicationType.OFFICE]:'office',
    [ApplicationType.INSPECT]:'checkinstruction',
    [ApplicationType.CUSTOMER_PRODUCT]:'customerProduct',
}

/**
 *  审批状态
 *  @readonly
 *  @enum {string}
 *  @property {string} ING - 审批中
 *  @property {string} OK - 通过
 *  @property {string} REBUT - 驳回
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

export const FileManagementPageType={
    FileManagementWork:'FileManagementWork',
    FileManagementCustomerProduct:'FileManagementCustomerProduct',
    FileManagementImage:'FileManagementImage',
    FileManagementOffice:'FileManagementOffice',
    FileManagementInspect:'FileManagementInspect',
    FileManagementAttachment:'FileManagementAttachment',
}
export const FileTrashPageType={
    FileTrashWork:'FileTrashWork',
    FileTrashImage:'FileTrashImage',
    FileTrashOffice:'FileTrashOffice',
    FileTrashInspect:'FileTrashInspect',
    FileTrashAttachment:'FileTrashAttachment',
    FileTrashCustomerProduct:'FileTrashCustomerProduct',
}
export const FileCheckPageType={
    FileCheckWork:'FileCheckWork',
    FileCheckImage:'FileCheckImage',
    FileCheckOffice:'FileCheckOffice',
    FileCheckInspect:'FileCheckInspect',
    FileCheckAttachment:'FileCheckAttachment',
    FileCheckCustomerProduct:'FileCheckCustomerProduct',
}

export const FileUploadPageType={
    FileUploadWork:'FileUploadWork',
    FileUploadImage:'FileUploadImage',
    FileUploadOffice:'FileUploadOffice',
    FileUploadInspect:'FileUploadInspect',
    FileUploadCustomerProduct:'FileUploadCustomerProduct',
}

export const FileAuditPageType={
    FileAuditWork:'FileAuditWork',
    FileAuditImage:'FileAuditImage',
    FileAuditOffice:'FileAuditOffice',
    FileAuditInspect:'FileAuditInspect',
    FileAuditCustomerProduct:'FileAuditCustomerProduct',
}


function getESOPUploadPath(type){
     return `/esop/fileUpload/${type}`
}
function getESOPManagementPath(type){
     return `/esop/fileManagement/${type}`
}



const WorkUploadPath = getESOPUploadPath(ApplicationType2PathSuffix[ApplicationType.WORK])
const ImageUploadPath = getESOPUploadPath(ApplicationType2PathSuffix[ApplicationType.IMAGE])
const OfficeUploadPath = getESOPUploadPath(ApplicationType2PathSuffix[ApplicationType.OFFICE])
const InspectUploadPath = getESOPUploadPath(ApplicationType2PathSuffix[ApplicationType.INSPECT])
const CustomerProductUploadPath = getESOPUploadPath(ApplicationType2PathSuffix[ApplicationType.CUSTOMER_PRODUCT])

export const FileManagementPageType2FileUploadUrl={
    [FileManagementPageType.FileManagementWork]: WorkUploadPath,
    [FileManagementPageType.FileManagementImage]:ImageUploadPath,
    [FileManagementPageType.FileManagementOffice]:OfficeUploadPath,
    [FileManagementPageType.FileManagementInspect]:InspectUploadPath,
    [FileManagementPageType.FileManagementCustomerProduct]:CustomerProductUploadPath,
}

export const ApplicationType2FileManagementUrl={
    [ApplicationType.WORK]:getESOPManagementPath(ApplicationType2PathSuffix[ApplicationType.WORK]),
    [ApplicationType.IMAGE]:getESOPManagementPath(ApplicationType2PathSuffix[ApplicationType.IMAGE]),
    [ApplicationType.OFFICE]:getESOPManagementPath(ApplicationType2PathSuffix[ApplicationType.OFFICE]),
    [ApplicationType.INSPECT]:getESOPManagementPath(ApplicationType2PathSuffix[ApplicationType.INSPECT]),
    [ApplicationType.CUSTOMER_PRODUCT]:getESOPManagementPath(ApplicationType2PathSuffix[ApplicationType.CUSTOMER_PRODUCT]),
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
    ...FileManagementPageType,
    ...FileTrashPageType,
    ...FileCheckPageType,
    ...FileUploadPageType,
    ...FileAuditPageType,
}

export const FileManagePageSet = new Set(Object.values(FileManagementPageType))
export const FileTrashPageSet = new Set(Object.values(FileTrashPageType))
export const FileCheckPageSet = new Set(Object.values(FileCheckPageType))
export const FileUploadPageSet = new Set(Object.values(FileUploadPageType))
export const FileAuditPageSet = new Set(Object.values(FileAuditPageType))
