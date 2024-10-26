import moment from "moment/moment";

export const ALL_TEXT ='全部'

export const fileExtFilterOption =Object.freeze( [
    {
        text:ALL_TEXT,
        icon:'zgt-ifont-quanbu'
    },
    {
        text:'txt',
        icon:'zgt-ifont-txt'
    },
    {
        text:'pdf',
        icon:'zgt-ifont-pdf'
    },
    {
        text:'word',
        icon:'zgt-ifont-doc'
    },
    {
        text:'excel',
        icon:'zgt-ifont-excel'
    },
    {
        text:'ppt',
        icon:'zgt-ifont-ppt'
    },
    {
        text:'图片',
        icon:'zgt-ifont-tupian'
    }, {
        text:'思维导图',
        icon:'zgt-ifont-suolvetu-siweidaotu'
    },
])
export const TIME_OPTION ={
    "NO_LIMIT":'不限时间',
    "ONE_WEEK":'最近七天',
    "ONE_MONTH":'最近一个月',
    "TOW_MONTH":'最近两个月',
    "THREE_MONTH":'最近三个月'
}
export function getBeforeDate(n){
    const date = new Date()
    date.setDate(date.getDate() - n)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date
}

export function timeOptionHandler(timeOption){
    const data ={
        start:'',
        end: new Date()
    }

    if(timeOption === TIME_OPTION.NO_LIMIT){
        data.end =''
        return data
    }
    switch (timeOption){
        case TIME_OPTION.ONE_WEEK:
            data.start = getBeforeDate(7)
            break;
        case TIME_OPTION.ONE_MONTH:
            data.start = getBeforeDate(30)
            break;
        case TIME_OPTION.TOW_MONTH:
            data.start = getBeforeDate(60)
            break;
        case TIME_OPTION.THREE_MONTH:
            data.start = getBeforeDate(90)
            break;
    }
    data.start= moment(data.start).format('YYYY-MM-DD HH:mm:ss')
    data.end = moment(data.end).format('YYYY-MM-DD HH:mm:ss')
    return data
}



export const FILE_EXT_OPTION=fileExtFilterOption.reduce((acc,cur)=>{
    acc[cur.text] = cur.text
    return acc
},{})
export function fileExtOptionHandler(ext){
    if(ext === FILE_EXT_OPTION[ALL_TEXT]){
        return ''
    }
    switch (ext){
        case '图片':
            return 'pic'
        case '思维导图':
            return 'mindMap'
        default:
            return ext
    }
}
export const FILE_CATEGORY_OPTION={
    "all":'全部',
    "share":'我的共享',
    "shareToMe":'共享给我'
}
export function fileCategoryOptionHandler(category){
    switch (category){
        case FILE_CATEGORY_OPTION.all:
            return ''
        case FILE_CATEGORY_OPTION.share:
            return 'share'
        case FILE_CATEGORY_OPTION.shareToMe:
            return 'shareToMe'
        default:
            return ''
    }
}
export const TIME_OPTION_FLAG ='time';
export const FILE_EXT_OPTION_FLAG ='fileType';
export const FILE_CATEGORY_OPTION_FLAG ='documentType';
export const FILE_OPERATE ={
    DOWNLOAD:'DOWNLOAD',
    DELETE:'DELETE',
    SHARE:'SHARE',
    RENAME:'RENAME',
    MOVE:'MOVE',
    UNSHARE:'UNSHARE',
    RECOVERY:'RECOVERY',
    TRASH_DEL:'TRASH_DEL',
    DETAIL:'DETAIL',
    REVERT:'REVERT'
}
