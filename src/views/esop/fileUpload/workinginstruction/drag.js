import {hasClass} from "@/utils";
import {Message} from "element-ui";

const SuffixReg = /\.\w+$/
function isDirectory(file) {
    return file.type === '' && !SuffixReg.test(file.name)
}
function isFile(file) {
    return !isDirectory(file)
}
function readFile(item){
    return new Promise(resolve => {
        item.file((file) => {
            resolve(file);
        });
    })

}

function readDirectory(directoryEntry,fileList) {

        const directoryReader = directoryEntry.createReader();
        directoryReader.readEntries( (entries) => {
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];

                if (entry.isFile) {
                    readFile(entry).then(file=>fileList.push(file))
                } else if (entry.isDirectory) {
                     readDirectory(entry,fileList);  // Recursively read subdirectories
                }
            }
        });

}
function readFileItems(params) {
    return new Promise(async (resolve,reject)=>{
        let fileList = []
        const items = Array.from(params)
        console.log(items.length)
        console.log(items)
        try {
            for (let i = 0; i < items.length; i++) {

                const item = items[i].webkitGetAsEntry(); // Get the entry
                console.log(item)
                if (item) {
                    if (item.isDirectory) {
                        resolve()
                        return Message.info('暂不支持文件夹上传，请重新选择')
                    }
                    const file = await readFile(item)
                    console.log(file)
                    fileList.push(file)
                }
            }
        }catch (e) {
            console.error(e)
        }

        resolve(fileList)
    })

}
function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        if (!hasClass(el, className)) {
            el.className += ' ' + className;
        }
    }
}
function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        if (hasClass(el, className)) {
            const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }
}
const dropStyleClassName='container-drop-wrapper'

function fileOnlyHandler(files){
   return files.filter(isFile)
}





export function readFileBlob(file){
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result)
        }
        reader.readAsArrayBuffer(file);
    })
}


const registerFlag = 'drag-register'
export default (function(){
    let targetElement = null,timer =null;
    let resultFn = null
    let fileOnly = false

    function addDragEvent(el,{value,fileOnly}){
        if(el.getAttribute(registerFlag)){

            return
        }
        function showDragStyle() {
            addClass(el, dropStyleClassName);
        }
        function hideDragStyle() {
            removeClass(el, dropStyleClassName);
        }
        el.setAttribute(registerFlag,true)
        const eventHandler={
            el:null,
            async ondrop(e,el){
                e.preventDefault()
                hideDragStyle(el)
                // let items = e.dataTransfer.items;
                let files = Array.from( e.dataTransfer.files);
                if (fileOnly){
                    return value && value(fileOnlyHandler(files),files)
                }
                return value && value(files)
            },
            dragleave(e,el){
                e.preventDefault()
                timer = setTimeout(() => {
                    hideDragStyle(el)
                }, 200)
            },
            dragenter(e,el){
                e.preventDefault()
                showDragStyle(el)
                e.dataTransfer.effectAllowed = 'move';
            },
            dragover(e){
                e.preventDefault()
                clearTimeout(timer)
                e.dataTransfer.dropEffect = 'move';
            },
        }
        el.ondragenter = eventHandler.dragenter
        el.ondragleave = eventHandler.dragleave
        el.ondragover = eventHandler.dragover
        el.ondrop = eventHandler.ondrop
    }
    function removeDragEvent(el){
        if(!el.getAttribute(registerFlag)){
            return
        }
        el.removeAttribute(registerFlag)
        el.ondragenter = null
        el.ondragleave = null
        el.ondragover = null
        el.ondrop = null
    }



    return {
        bind(el, {modifiers,value,arg}, vnode, prevVnode) {

            resultFn = value
            fileOnly = modifiers.onlyFile
            if(!arg){
                addDragEvent(el,{value,fileOnly})
            }else{
                removeDragEvent(el)
            }

        },
        update(el, {modifiers,value,arg}, vnode, prevVnode) {
            resultFn = value
            fileOnly = modifiers.onlyFile
            if(!arg){
                addDragEvent(el,{value,fileOnly})
            }else{
                removeDragEvent(el)
            }
        },
        unbind(el, binding, vnode, prevVnode) {
               removeDragEvent(el)
        }

    }
}())
