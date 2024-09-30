import {Message} from "element-ui";

export function isFile(item){
    return item && item.type === 1
}
export const wordSuffix = ['doc','docx']
export const excelSuffix = ['xls','xlxs']
export const pptSuffix = ['ppt','pptx']
export const pdfSuffix = ['pdf']
export const imgSuffix = ['jpg','jpeg','png','gif','bmp']
export const mindSuffix = ['mind']
export const txtSuffix = ['txt']

const iconMap = new Map([
    [pdfSuffix,'zgt-ifont zgt-ifont-pdf'],
    [wordSuffix,'zgt-ifont zgt-ifont-doc'],
    [excelSuffix,'zgt-ifont zgt-ifont-excel'],
    [pptSuffix,'zgt-ifont zgt-ifont-ppt'],
    [imgSuffix,'zgt-ifont zgt-ifont-tupian'],
    [mindSuffix,'zgt-ifont zgt-ifont-suolvetu-siweidaotu'],
    [txtSuffix,'zgt-ifont zgt-ifont-txt'],
    [[''],'icon-ym icon-ym-extend-folder']
])

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
