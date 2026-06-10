import { getNewDate, getNewDateTimestamp } from '@/utils/jx/jx-date'
import { getIotData } from '@/utils/jx/iot'

const state = {
    newDate: getNewDate(),//今日日期
    newTimestamp: getNewDateTimestamp(),//当前日期的时间戳
    iot_data: getIotData(),//iot参数模板

    iotURLv1: 'http://iot.zhouguantong.com//api/v1/equipment',
    iotURLv2: 'http://iot.zhouguantong.com//api/v2/equipment',

    loadingText: '加载中，请稍后...',
    loadingBackground: 'rgba(255, 255, 255, 0.8)',
    loadingSpinner: 'el-icon-loading',

    logo : require("@/assets/images/jnpf.png"),
    logo1 : require("@/assets/images/os1_"+(localStorage.getItem('aaa') ? localStorage.getItem('aaa') : 'zgt')+".png"),
    logo2 : require("@/assets/images/os2_"+(localStorage.getItem('aaa') ? localStorage.getItem('aaa') : 'iot')+".png"),
}

const mutations = {
    SET_NET_DATE: (state, new_date) => {
        state.new_date = new_date
    },
    SET_LOGO:(state)=>{
        state.logo1=require("@/assets/images/os1_"+(localStorage.getItem('aaa') ? localStorage.getItem('aaa') : 'zgt')+".png")
        state.logo2=require("@/assets/images/os2_"+(localStorage.getItem('aaa') ? localStorage.getItem('aaa') : 'iot')+".png")
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
