import {Message} from "element-ui";
import {isEmpty} from "@/utils";

export function isFile(item){
    return item && item.fileExtension !== null
}
export const wordSuffix = ['doc','docx','docm']
export const excelSuffix = ['xls','xlsx','xlsm']
export const pptSuffix = ['ppt','pptx','pptm']
export const pdfSuffix = ['pdf','pdfx']
export const imgSuffix = ['jpg','jpeg','png','gif','bmp',]
export const mindSuffix = ['mind']
export const txtSuffix = ['txt']
export const unknownSuffix = ['unknown']

const iconMap = new Map([
    [pdfSuffix,'zgt-ifont zgt-ifont-pdf'],
    [wordSuffix,'zgt-ifont zgt-ifont-doc'],
    [excelSuffix,'zgt-ifont zgt-ifont-excel'],
    [pptSuffix,'zgt-ifont zgt-ifont-ppt'],
    [imgSuffix,'zgt-ifont zgt-ifont-tupian'],
    [mindSuffix,'zgt-ifont zgt-ifont-suolvetu-siweidaotu'],
    [txtSuffix,'zgt-ifont zgt-ifont-txt'],
    [[''],'icon-ym icon-ym-extend-folder'],
    [unknownSuffix,'zgt-ifont zgt-ifont-weizhiwenjian'],
])

export const Type2SuffixArr=new Map([
    ['思维导图',mindSuffix],
    ['pdf',pdfSuffix],
    ['word',wordSuffix],
    ['excel',excelSuffix],
    ['ppt',pptSuffix],
    ['图片',imgSuffix],
    ['txt',txtSuffix]
])
export function  getExt(item,nameField = 'fullName'){
    if(!isFile(item)){
        return ''
    }
    if(item.fileExtension){
        return item.fileExtension
    }
    // 因为文件对象的字段非常之多，只适配 fullName filename
    let fileName = typeof item[nameField] !== 'string' ? item['filename'] : item[nameField]
    if(isEmpty(fileName) || fileName.indexOf('.') === -1){
      return unknownSuffix[0]
    }
    const split = fileName.split('.')
    return split[split.length-1]
}
export function  ext2Icon(ext){
    const txt = ext ? ext.toLowerCase().replace('.','') : ""
    for(let [key,value] of iconMap){
        if(key.includes(txt)) return value
    }
    return ''
}

export function previewFile(item){
    Message.info("预览功能尚未实现，敬请期待")
}
