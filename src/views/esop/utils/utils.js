import {formatDate, getWeekFirstDay, isEmpty, notEmpty} from "@/utils";
import {ApplicationType, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {getMenuList} from "@/api/system/menu";
import {createButton} from "@/api/system/buttonAuthorize";
import {SearchTimeType} from "@/views/esop/utils/constants";

export function deleteLastChildList(category) {
    if (isEmpty(category)) return
    for (let categoryElement of category) {
        if (categoryElement.parentId !== '-1' && isEmpty(categoryElement.childrenList)) {
            delete categoryElement.childrenList
        } else {
            deleteLastChildList(categoryElement.childrenList)
        }
    }
    return category
}

export function flatArr(arr, fn, listName = 'childrenList') {
    for (let arrElement of arr) {
        fn(arrElement)
        if (notEmpty(arrElement[listName])) {
            flatArr(arrElement[listName], fn)
        }
    }
}

export function getFilePreviewUrl(filePath) {
    return `/api/file/Image/document/${filePath}`
}


export const TopParentId = '-1'


export function downloadFile(filePath = '/static/销售订单导入模板.xlsx') {
    const a = document.createElement('a')
    a.setAttribute('download', '')
    a.setAttribute('href', location.origin + filePath)
    a.click()
}

export function getTitleForType(applicationType, pageType) {

    let name = ''
    if (applicationType === ApplicationType.INSPECT) {
        name = '检查指导书'
    } else if (applicationType === ApplicationType.WORK) {
        name = '作业指导书'
    } else if (applicationType === ApplicationType.IMAGE) {
        name = '图文档'
    }

    if (pageType === ModelType.ADD) {
        return `新增${name}`
    }
    if (pageType === ModelType.VIEW) {
        return `查看${name}`
    }
    return `编辑${name}`
}

export function isHasProcessApplicationType(applicationType) {
    return [ApplicationType.INSPECT, ApplicationType.WORK].includes(applicationType)
}


export const BtnType = {
    add: {
        fullName: '新增', enCode: 'btn_add'
    },
    edit: {
        fullName: '编辑', enCode: 'btn_edit'
    },
    detail: {
        fullName: '详情', enCode: 'btn_detail'
    },
    remove: {
        fullName: '删除', enCode: 'btn_remove'
    },
    batchRemove: {
        fullName: '批量删除', enCode: 'btn_batch_remove'
    },
    copy: {
        fullName: '复制', enCode: 'btn_copy'
    },
    import: {
        fullName: '导入', enCode: 'btn_import'
    },
    export: {
        fullName: '导出', enCode: 'btn_export'
    },
    issue: {
        fullName: '下达', enCode: 'btn_issue'
    },
}
const normalBtn = [BtnType.add, BtnType.edit, BtnType.detail, BtnType.remove, BtnType.batchRemove, BtnType.copy]

/**
 * 给指定模块添加所有按钮权限
 * @param moduleName 模块名称
 * @param btns  需要添加的权限按钮数组
 * @param findField 模块名称的字段 默认为fullName
 * @returns {Promise<void>}
 */
export async function setAllBtnAuth(moduleName = "ESOP管理", btns = normalBtn, findField = 'fullName') {
    const map = new Map()
    const {data: {list}} = await getMenuList('309228585019769285', {keyword: '', category: "Web"})

    flatArr(list, (item) => {
        map.set(item[findField], item)
    }, 'children')
    const module = map.get(moduleName)
    if (isEmpty(module)) return console.log('未找到模块')

    const promiseObj = {}
    const resObj = {}
    if (!module.hasChildren) {
        promiseObj[module.fullName] = (addBtnFn(btns, module.id))
    } else {
        flatArr(module.children, (item) => {
            if (!item.hasChildren) {
                promiseObj[item.fullName] = (addBtnFn(btns, item.id, item.fullName))
            }
        }, 'children')
    }
    const msg = []
    for (const key of Object.keys(promiseObj)) {
        resObj[key] = []
        const res = await Promise.allSettled(promiseObj[key].fullName)
        res.forEach((item, index) => {
            if (item.status === 'fulfilled') {
                resObj[key].push(item.value)
            } else {
                const str = key + `按钮${btns[index].fullName}添加失败`
                msg.push(str)
            }
        })
    }
}

function addBtnFn(btns, moduleId, fullName) {
    const promiseArr = []
    btns.forEach(item => {
        let query = {
            parentId: '-1',
            moduleId: moduleId,
            fullName: item.fullName,
            enCode: item.enCode,
            sortCode: 0,
            icon: '',
            enabledMark: 1,
            description: ''
        }
        promiseArr.push(createButton(query))
    })
    return {fullName: promiseArr}
}

// window.setAllBtnAuth = setAllBtnAuth

/**
 * 处理查询时的时间
 * @param data
 * @param timeArr
 * @param startField
 * @param endField
 * @returns {*}
 */
export function executeQueryTime(data, timeArr, startField = "startTime", endField = "endTime") {
    if (isEmpty(timeArr)) {
        data[startField] = ''
        data[endField] = ''
        return data
    }
    data[startField] = formatDate(timeArr[0])
    data[endField] = formatDate(timeArr[1])
    return data
}

const Status2ChineseMap = new Map([
    [1,'等待审核'],
    [2,'审核通过'],
    [3,'审核驳回'],
    [4,'流程撤回'],
    [5,'审核终止'],
])
const Status2TagTypeMap =new Map([
    [1,'primary'],
    [2,'success'],
    [3,'danger'],
    [4,'info'],
    [5,'info'],
])


export function getUploadFileSaveData(data) {
   const  { applicationType,
            documentStatus,
            openProcess,
            productsId,
            routingId,
            orderNo,
            id,
            approvalFlag,
            version,
            categoryId,
            bimFileUploadLineList,
            flowData,
            projectId,
            categoryName} = data
   return {
        bimFileUpload:{
                applicationType,
                documentStatus,
                openProcess,
                productsId,
                routingId,
                orderNo,
                projectId,
                id,
                approvalFlag,
                version,
                categoryId,
                categoryName
        },
        bimFileUploadLineList,
        flowData,
    }
}


export function isNoProductPage(applicationType) {
    return [ApplicationType.OFFICE,ApplicationType.IMAGE].includes(applicationType)
}

/**
 * 获取审核状态中文
 * @param status
 * @returns {string|string}
 */
export function getStatusChinese(status) {
    return Status2ChineseMap.get(status) || '未知流程'
}

export function getStatusTagType(status) {
    return Status2TagTypeMap.get(status) || 'info'
}

export function getTimeForSearchTimeType(timeType){
    let startTime = ''
    let endTime = ''
    switch (timeType) {
        case SearchTimeType.DAY:
            endTime  = formatDate(new Date())
            startTime = formatDate(new Date(),'YYYY-MM-DD 00:00:00')
            break;
        case SearchTimeType.WEEK:
            endTime  = formatDate(new Date())
            startTime = getWeekFirstDay()
            break;
        case SearchTimeType.MONTH:
            endTime = formatDate(new Date())
            startTime = formatDate(new Date(),'YYYY-MM-01 00:00:00')
            break;
    }
    return [startTime,endTime]
}

