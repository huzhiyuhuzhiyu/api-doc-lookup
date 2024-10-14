import {isEmpty, notEmpty} from "@/utils";

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
