<template>
    <div class="JNPF-common-layout">
        <!-- 弹出框 -->
        <Detailspages v-if="!flags" :equipmentId="equipmentId" :optionDate="optionDate" @handle="handles"/>
        <div v-show="flags" v-loading="loading" class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="12">
                <el-form @submit.native.prevent>
                    <el-col :span="5">
                        <el-form-item label="车间">
                            <JNPFTreeSelect v-model="query.mrpWorkshopId" placeholder="请选择"
                                            :options="mrpWorkshopIdOptions" :props="mrpWorkshopIdProps"
                                            clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="状态">
                            <el-select v-model="query.state" multiple collapse-tags placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                           :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="设备">
                            <el-input v-model="query.name" placeholder="编号/名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="search()">查询</el-button>
                            <el-button size="mini" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>
                    <!-- 定时刷新 -->
                    <el-col style="text-align: right; display: flex;" :span="5">
                        <el-form-item label="定时">
                            <el-select v-model="value" @change="updatetimes">
                                <el-option v-for="item in updatetime" :key="item.value" :label="item.label"
                                           :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div>
                            <el-button style="margin-left: 5px;" icon="el-icon-refresh" size="mini" type="primary"
                                       @click="refreshnow()"
                            >
                            </el-button>
                        </div>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main" style="overflow-y: auto;width: 100%;">
                <!-- 五个小方块 -->
                <div class="text" style="width: 100%;display: flex;margin-top: 10px;padding-left: 10px;">
                    <div style="display: flex; ">
                        <div style="min-width: 118px; overflow: hidden; display: flex; align-items: center;"
                             v-for="(item, index) in stateNumberList" :key="index"
                             :style="{ backgroundColor: settings.parentBgc, marginRight: settings.marginRight, borderRadius: settings.radius }"
                        >
                            <div class="tags" :style="{ backgroundColor: item.color }">
                                <strong style="transform: scale(1.2); display: inline-block;">{{ item.number }}</strong>
                            </div>

                            <div style="text-align: center;" :style="{ width: settings.rightWidth }">
                                <p style="line-height: 22px; ">{{ item.name }}</p>
                                <p style="line-height: 22px; " v-show="item.code != 'all'">{{ item.ratio }}%</p>
                            </div>
                        </div>
                        
                    </div>
                     <div style="padding: 4px 0; width:140px; display: flex;align-items: center;margin: 0 10px;">
                        <el-select v-model="sizeFlag" placeholder="请选择">
                            <el-option v-for="item in flagOption" :key="item.value" :label="item.label"
                                       :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div style="flex:1;"></div>
                   

                </div>

                <!-- 设备状态和时间 -->
                <div
                    style="width: 100%; overflow: auto; display: flex;margin-top: 10px;flex-wrap: wrap;flex-direction: row;"
                >
                    <div style="width: 24%; margin: 0.5%;" v-for="(item, index) in list" :key="index"
                         :class="[sizeFlag ? 'big' : 'small']"
                    >
                        <div id="equipmentstatuss"
                             :style="{ backgroundColor: item.state_color + '4D', border: '2px solid' + item.state_color }"
                             @click="handle(item.id)"
                        >
                            <!-- (flag ? 'big' :  'small') -->
                            <div class="ys" :style="{ backgroundColor: item.state_color }">
                                <div class="wz text">{{ item.state_tit }}</div>
                            </div>
                            <!-- 编号 -->
                            <div style="" :title="item.code" class="uisss text"
                                 :style="{ borderBottom: '2px solid' + item.state_color }"
                            >{{ item.code }}
                            </div>
                            <!-- 时间 -->
                            <div class="mingcheng" style="">
                                <div class="text"
                                     style=""
                                >
                                    <strong :title="item.name" style="font-size: 26px;">{{ item.name }}</strong>
                                    <div class="chejian" style="">{{ item.mrpWorkshopName }}</div>
                                </div>
                                <div class="text fontc">状态持续时间:{{ item.currentStateTime }}</div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { getColorListApi, getEquipmentNumberByState, getListState } from '@/api/equipment'

import { formatTime, getTodayMs } from '@/utils/jx/jx-date'

import Detailspages from './detailspages'
import request from '@/utils/request'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

import sett from '@/settings'
import moment from 'moment'

export default {
    name: 'equipmentmap',
    components: {
        Detailspages
    },
    data() {
        return {
            list: [],
            listQuery: {
                currentPage: 1,
                pageSize: 30,
                sort: 'desc',
                sidx: 'code',
                isIot: true,
                typeSList: ["SCJC", "CG", "JC"]
            },
            flags: true,
            query: {
                name: undefined,
                categoryId: undefined,
                active: 1,
                mrpWorkshopId: undefined,
                mrpWorkshopIds: [],
                state: undefined,
                date: undefined
            },
            options: [{
                value: 'error',
                label: '故障'
            },
                {
                    value: 'boot',
                    label: '生产中'
                },
                {
                    value: 'warn',
                    label: '警报'
                },
                {
                    value: 'online',
                    label: '在线'
                },
                {
                    value: 'offline',
                    label: '离线'
                }
            ],
            value1: [],
            loading: true,
            flag: true, //控制展示精简版，详细版
            typeTitle: '详细版', //版本名称

            equipmentId: '',

            mrpWorkshopIdOptions: [],
            mrpWorkshopIdProps: {
                'label': 'name',
                'value': 'id',
                'children': 'children'
            },

            sizeFlag: true,
            flagOption: [{
                label: '详细版',
                value: true
            },
                {
                    label: '精简版',
                    value: false
                }
            ],

            //设备状态数组  在线 生产 报警 故障 离线 总数
            stateList: [],
            stateNumberList: [],
            settings: {},

            updatetime: [{
                value: '不刷新',
                label: '不刷新'
            },
                {
                    value: '5',
                    label: '5s'
                },
                {
                    value: '10',
                    label: '10s'
                },
                {
                    value: '30',
                    label: '30s'
                },
                {
                    value: '60',
                    label: '1m'
                },
                {
                    value: '300',
                    label: '5m'
                },
                {
                    value: '900',
                    label: '15m'
                },
                {
                    value: '1800',
                    label: '30m'
                },
                {
                    value: '3600',
                    label: '1h'
                },
                {
                    value: '7200',
                    label: '2h'
                },
                {
                    value: '86400',
                    label: '1d'
                }],
            value: '',
            timer: null,
            //选中的日期
            optionDate:undefined

        }
    },
    created() {
        this.settings = sett

        getColorListApi(colorList => {
            this.options = []
            for (const value of colorList) {
                if ('all' != value.code) {
                    this.options.push({ 'value': value.code, 'label': value.name })
                }
            }

        })

        this.query.date = moment(Number(new Date().getTime())).format('YYYY-MM-DD HH:mm:ss')
        this.initData(true)

        this.getmrpWorkshopIdOptions()


    },
    updated() {
    },
    mounted() {
    },
    methods: {

        //加载生产车间树
        getmrpWorkshopIdOptions() {
            getDataInterfaceRes('342715607101211205').then(res => {
                let data = res.data
                this.mrpWorkshopIdOptions = data
            })
        },

        // 分页请求函数
        initData(boo) {
            this.loading = boo || false
            let _query = {
                ...this.listQuery,
                ...this.query,
                // dataType: 0,
                menuId: this.menuId
            }

            if (this.query.date != undefined) {
                _query.startTime = moment(new Date(this.query.date).getTime()).format('YYYY-MM-DD 00:00:00')
                _query.stopTime = moment(new Date(this.query.date).getTime()).format('YYYY-MM-DD HH:mm:ss')
            }

            getEquipmentNumberByState(_query).then(res => {
                this.stateNumberList = res.data
                getListState(_query).then(res => {
                    this.list = []
                    let todayMs = getTodayMs()

                    for (let i = 0; i < res.data.list.length; i++) {
                        let _data = res.data.list[i]
                        //非空加载
                        if (_data.result != null) {
                            if (_data.result.online) { //如果在线
                                if (_data.result.boot) {//运行
                                    let boot = _data.stateTime.bootTime
                                    _data.currentStateTime = formatTime(boot)
                                } else if (_data.result.warn) { //报警
                                    let warn = _data.stateTime.warnTime
                                    _data.currentStateTime = formatTime(warn)
                                } else if (_data.result.error) { //异常
                                    let error = _data.stateTime.errorTime
                                    _data.currentStateTime = formatTime(error)
                                } else { //在线
                                    let online = _data.stateTime.onlineTime
                                    _data.currentStateTime = formatTime(online)
                                }

                            } else {
                                console.log(_data)
                                let offline = _data.stateTime.offlineTime
                                _data.currentStateTime = formatTime(offline)
                            }

                            this.list.push(_data)
                        }
                    }

                    // 把颜色和状态 加到数据数组中
                    if (this.list.length > 0 && this.stateNumberList.length > 0) {
                        this.list.forEach(item => {
                            for (let i = 0; i < this.stateNumberList.length; i++) {
                                let el = this.stateNumberList[i]
                                if (item.result.online) { //在线
                                    if (item.result.boot && el.code == 'boot') {
                                        this.$set(item, 'state_tit', el.name)
                                        this.$set(item, 'state_color', el.color)
                                        break
                                    } else if (item.result.warn && el.code == 'warn') {
                                        this.$set(item, 'state_tit', el.name)
                                        this.$set(item, 'state_color', el.color)
                                        break
                                    } else if (item.result.error && el.code == 'error') {
                                        this.$set(item, 'state_tit', el.name)
                                        this.$set(item, 'state_color', el.color)
                                        break
                                    } else {
                                        if (el.code == 'online') {
                                            this.$set(item, 'state_tit', el.name)
                                            this.$set(item, 'state_color', el.color)
                                            break
                                        }
                                    }
                                } else {
                                    if (el.code == 'offline') {
                                        this.$set(item, 'state_tit', el.name)
                                        this.$set(item, 'state_color', el.color)
                                        break
                                    }

                                }

                            }
                        })

                    }

                    this.loading = false
                })

            })

        },

        // 定时触发函数
        updatetimes(e) {
            clearInterval(this.timer)
            this.timer = null
            this.listQuery.currentPage = 1
            if (e != '不刷新') {
                this.timer = setInterval(this.initData, e * 1000)
            }
        },

        // 立即刷新按钮
        refreshnow() {
            this.initData(true)
        },

        //搜索
        search() {
            this.listQuery.currentPage = 1
            this.listQuery.pageSize = 20
            this.listQuery.sort = 'desc'
            this.listQuery.sidx = 'code'
            this.initData(true)
        },

        // 触底加载
        hamdle(e) {
            let el = e.target
            //判断是否到达div容器底部
            if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
                if (this.flag) {
                    this.loading = true
                    this.flag = false
                    //控制页数
                    this.listQuery.currentPage = this.listQuery.currentPage + 1
                    //调用后台接口
                    let conditions = []
                    for (let kets in this.query) {
                        if (kets == 'customer_id' && this.query[kets] != undefined) {
                            let objects = {
                                key: kets,
                                value: parseInt(this.query[kets]) || null,
                                queryExpression: 'EQ'
                            }
                            conditions.push(objects)
                        } else {
                            let objects = {
                                key: kets,
                                value: this.query[kets] || null,
                                queryExpression: 'EQ'
                            }
                            conditions.push(objects)
                        }
                    }
                    let _query = {
                        ...this.listQuery,
                        ...this.query,
                        conditions,
                        dataType: 0
                    }
                    getListState(_query).then(res => {
                        if (res.data.list.length == 0) {
                            this.loading = false
                            this.open5()
                        } else {
                            for (let i = 0; i < res.data.list.length; i++) {
                                let _data = res.data.list[i]
                                //判断返回为非空
                                if (res.data.list[i].result != null) {
                                    this.list.push(_data)
                                }
                            }
                            this.shuju()
                            //this.screen();

                            setTimeout(() => {
                                this.flag = true
                                this.loading = false
                            }, 500)
                        }
                    })
                }
            }
        },

        // 统计状态台数
        shuju() {
            this.resetStateList()

            if (this.list.length > 0 && this.stateList.length > 0) {

                // 在线 生产 报警 故障 离线 总数
                this.list.forEach(item => {
                    if (item.result.online) { //在线

                        if (item.result.boot) {
                            this.stateList[1].number += 1
                        } else if (item.result.warn) {
                            this.stateList[2].number += 1
                        } else if (item.result.error) {
                            this.stateList[3].number += 1
                        } else {
                            this.stateList[0].number += 1
                        }
                    } else { //离线
                        this.stateList[4].number += 1
                    }
                })

                this.stateList[5].number = this.list.length

                this.stateList.forEach(el => {
                    if (el.name != '总数') {
                        el.ratio = ((el.number / this.list.length * 100).toFixed(0)) + '%'
                    }
                })

            }

        },
        // 搜索按钮
        multiselectionfilter() {
            this.listQuery.currentPage = 1
            this.list = []
            this.loading = true
            let conditions = []
            for (let kets in this.query) {
                if (kets == 'customer_id' && this.query[kets] != undefined) {
                    let objects = {
                        key: kets,
                        value: parseInt(this.query[kets]) || null,
                        queryExpression: 'EQ'
                    }
                    conditions.push(objects)
                } else {
                    let objects = {
                        key: kets,
                        value: this.query[kets] || null,
                        queryExpression: 'EQ'
                    }
                    conditions.push(objects)
                }
            }
            let _query = {
                ...this.listQuery,
                conditions,
                menuId: this.menuId
            }
            request({
                url: `/api/iot/equipments/getList`,
                method: 'post',
                data: _query
            }).then((res) => {
                for (let i = 0; i < res.data.list.length; i++) {
                    let _data = res.data.list[i]
                    this.list.push(_data)
                }
                setTimeout(() => {
                    this.loading = false
                }, 500)

                if (this.value1.length == 0) {
                    return
                } else if (this.value1.length == 1) {
                    let s1 = this.value1[0]
                    let listss = []
                    if (s1 == 'lixian') {
                        for (let i = 0; i < this.list.length; i++) {
                            if (this.list[i].online == false) {
                                listss.push(this.list[i])
                            }
                        }
                        if (listss.length == 0) {
                            this.open4()
                            return
                        }
                        this.list = listss
                        this.shuju()
                    } else {
                        for (let i = 0; i < this.list.length; i++) {
                            if (this.list[i][s1] == true) {
                                listss.push(this.list[i])
                            }
                        }
                        if (listss.length == 0) {
                            this.open4()
                            return
                        }
                        this.list = listss
                        this.shuju()
                    }
                } else if (this.value1.length == 2) {
                    for (let s = 0; s < this.value1.length; s++) {
                        if (this.value1[s] == 'lixian') {
                            this.open3()
                            return
                        }
                    }
                    let s1 = this.value1[0]
                    let s2 = this.value1[1]
                    let listss = []
                    for (let i = 0; i < this.list.length; i++) {
                        if (this.list[i][s1] == true && this.list[i][s2] == true) {
                            listss.push(this.list[i])
                        }
                    }
                    if (listss.length == 0) {
                        this.open4()
                        return
                    }
                    this.list = listss
                    this.shuju()
                } else if (this.value1.length == 3) {
                    let s1 = this.value1[0]
                    let s2 = this.value1[1]
                    let s3 = this.value1[2]
                    for (let s = 0; s < this.value1.length; s++) {
                        if (this.value1[s] == 'lixian') {
                            this.open3()
                            return
                        }
                    }
                    let listss = []
                    for (let i = 0; i < this.list.length; i++) {
                        if (
                            this.list[i][s1] == true &&
                            this.list[i][s2] == true &&
                            this.list[i][s3] == true
                        ) {
                            listss.push(this.list[i])
                        }
                    }
                    if (listss.length == 0) {
                        this.open4()
                        return
                    }
                    this.list = listss
                    this.shuju()
                } else if (this.value1.length == 4) {
                    let s1 = this.value1[0]
                    let s2 = this.value1[1]
                    let s3 = this.value1[2]
                    let s4 = this.value1[3]
                    for (let s = 0; s < this.value1.length; s++) {
                        if (this.value1[s] == 'lixian') {
                            this.open3()
                            return
                        }
                    }
                    let listss = []
                    for (let i = 0; i < this.list.length; i++) {
                        if (
                            this.list[i][s1] == true &&
                            this.list[i][s2] == true &&
                            this.list[i][s3] == true &&
                            this.list[i][s4] == true
                        ) {
                            listss.push(this.list[i])
                        }
                    }
                    if (listss.length == 0) {
                        this.open4()
                        return
                    }
                    this.list = listss
                    this.shuju()
                }
            })
        },

        open3() {
            this.$message({
                message: '离线不可多选',
                type: 'warning',
                duration: 3000,
                center: true
            })
        },
        // 重置按钮
        reset() {
            for (let key in this.query) {
                this.query[key] = undefined
            }
            this.listQuery.currentPage = 1
            this.value1 = []
            this.query.date = moment(Number(new Date().getTime())).format('YYYY-MM-DD HH:mm:ss')
            this.initData(true)
        },

        //重置状态集合
        resetStateList() {

            this.stateList.forEach(el => {
                el.number = 0
                if (el.name != '总数') {
                    el.ratio = '0%'
                }
            })

        },

        open4() {
            this.$message.error('无数据')
        },
        open5() {
            this.$message({
                message: '已经到底了',
                type: 'warning',
                duration: 3000,
                center: true
            })
        },

        handle(id) {
            this.equipmentId = id
            this.optionDate = this.query.date
            this.flags = false
        },
        handles() {
            this.flags = true
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null
    }

}
</script>

<style scoped>
#equipmentstatuss {
    width: 100%;
    height: 200px;
    position: relative;
    overflow: hidden;
    padding: 0.5vw;
    border-radius: 5px;
}

#equipmentstatuss .ys {
    width: 35%;
    position: absolute;
    right: -4%;
    bottom: 0px;
    transform: skew(-35deg);
}

#equipmentstatuss .ys .wz {
    transform: skew(35deg);
    color: #000000;
    text-align: center;
    line-height: 30px;
}

.small {
    width: 11.8% !important;
    margin: 0.3% !important;
}

.big .mingcheng {
    margin: 20px 0;
}

.small .mingcheng {
    margin: 0 !important;
}

.small #equipmentstatuss {
    height: 100px !important;
}

.small .ys,
.small .fontc,
.small .chejian {
    display: none !important;
}

.chejian {
    margin: 10px 0;
}

.small strong {
    font-size: 16px !important;
    color: #000;
}

strong {
    /* //超出两行省略号 */
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    /* 主要针对于非中文的  word-wrap属性允许长的内容可以自动换行。 */
    /* break-word 在长单词或 URL 地址内部进行换行。 */
    word-wrap: break-word;
}

.small .uisss {
    border: 0 !important;
    color: #000;
    height: 50%;
}

.big .uisss {
    height: 20px;
}

.uisss {
    /* 1.设置元素当一行显示不下的时候,也不自动换行 */
    white-space: nowrap;
    /* 2.设置元素超出的部分隐藏 */
    overflow: hidden;
    /* 3.设置内容超出的时候以省略号(...)显示 */
    text-overflow: ellipsis;
}

.tags {
    min-width: 46px;
    height: 46px;
    text-align: center;
    line-height: 46px;
    color: #000;
    padding: 0 10px;

}

.app-container {
    width: 100%;
    background-color: white;
}

.fontc {
    margin-top: 5px;
    color: #464547;
}

._item {
    width: 12%;
    height: 150px;
    /* border: 1px solid #000; */
    margin-right: 10px;
    border-radius: 5px;
    overflow: hidden;

}

._list {
    width: 100%;
    height: 150px;
    /* border: 1px solid palegreen; */
    padding-top: 30px;

}

._list > div {
    text-align: center;

}

.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}

.el-icon-arrow-down {
    font-size: 12px;
}
</style>
