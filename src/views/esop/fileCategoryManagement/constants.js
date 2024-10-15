/**
 * File Category Type Enum
 * @readonly
 * @enum {string}
 * @property {string} SYSTEM_ATTACHMENT - 系统附件
 * @property {string} OFFICE_DOCUMENT - 办公文件
 * @property {string} IMAGE_DOCUMENT - 图文档
 * @type {{SYSTEM_ATTACHMENT: string, OFFICE_DOCUMENT: string, IMAGE_DOCUMENT: string}}
 */
export const FileCategoryType ={
    "IMAGE_DOCUMENT":"image_document",
    "OFFICE_DOCUMENT":"office_document",
    "SYSTEM_ATTACHMENT":"system_attachment"
}
export const FileCategoryTypeChinese ={
    "IMAGE_DOCUMENT":"图文档",
    "OFFICE_DOCUMENT":"办公文件",
    "SYSTEM_ATTACHMENT":"系统附件"
}

export const FileCategoryTypeList =[
    {
        fullName  :FileCategoryTypeChinese.SYSTEM_ATTACHMENT,
        enCode:FileCategoryType.SYSTEM_ATTACHMENT
    },
    {
        fullName :FileCategoryTypeChinese.OFFICE_DOCUMENT,
        enCode:FileCategoryType.OFFICE_DOCUMENT
    },
    {
        fullName :FileCategoryTypeChinese.IMAGE_DOCUMENT,
        enCode:FileCategoryType.IMAGE_DOCUMENT
    }
]
