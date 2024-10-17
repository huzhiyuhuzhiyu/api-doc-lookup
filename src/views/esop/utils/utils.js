import {isEmpty, notEmpty} from "@/utils";
import {ApplicationType, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";

export function deleteLastChildList(category){
    if(isEmpty(category)) return
    for (let categoryElement of category) {
        if(categoryElement.parentId !== '-1' && isEmpty(categoryElement.childrenList)){
            delete categoryElement.childrenList
        }else{
           deleteLastChildList(categoryElement.childrenList)
        }
    }
    return category
}

export function flatArr(arr,fn,listName='childrenList'){
    for (let arrElement of arr) {
        fn(arrElement)
        if(notEmpty(arrElement[listName])){
            flatArr(arrElement[listName],fn)
        }
    }
}

export function getFilePreviewUrl(filePath){
    return `/api/file/Image/document/${filePath}`
}


export const TopParentId = '-1'


export function downloadFile(filePath ='/static/销售订单导入模板.xlsx'){
    const a = document.createElement('a')
    a.setAttribute('download', '')
    a.setAttribute('href', location.origin + filePath)
    a.click()
}

export function getTitleForType(applicationType,pageType){

    let name =''
    if(applicationType === ApplicationType.INSPECT){
        name = '检查指导书'
    }else if(applicationType === ApplicationType.WORK){
        name = '作业指导书'
    }else if(applicationType === ApplicationType.IMAGE) {
        name = '图文档'
    }

    if(pageType === ModelType.ADD){
        return `新增${name}`
    }
    if(pageType === ModelType.VIEW){
        return `查看${name}`
    }
    return `编辑${name}`
}
