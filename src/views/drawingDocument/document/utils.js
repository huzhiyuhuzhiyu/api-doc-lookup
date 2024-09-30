import {Message} from "element-ui";

export function isFile(item){
    return item && item.type === 1
}
const iconMap = new Map([
    [['pdf'],'zgt-ifont zgt-ifont-pdf'],
    [['doc','docx'],'zgt-ifont zgt-ifont-doc'],
    [['xls','xlxs'],'zgt-ifont zgt-ifont-excel'],
    [['ppt','pptx'],'zgt-ifont zgt-ifont-ppt'],
    [['png','jpg','jpeg'],'zgt-ifont zgt-ifont-tupian'],
    [['mind'],'zgt-ifont zgt-ifont-suolvetu-siweidaotu'],
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
