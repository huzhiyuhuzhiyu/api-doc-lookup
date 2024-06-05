<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <el-row v-if="res.length >0" class="JNPF-common-search-box" :gutter="16">
                <!--        v-if="res.length >0"          -->
                <el-form @submit.native.prevent size="medium">
                    <el-col :span="8">
                        <el-form-item label="时间" prop="">
                            <el-date-picker
                                v-model="res[tabIndex].timeData"
                                align="right"
                                type="date"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期"
                                :picker-options="pickerOptions"
                                clearable
                                size="small"
                                @change="(e)=>timeChange(e,true)"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-date-picker v-model="res[tabIndex].times" type="datetimerange" range-separator="-"
                                        style="width: 90%;"
                                        format="HH:mm:ss"
                                        readonly
                                        size="small"
                        >
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-tooltip class="item" effect="dark" content="前3小时数据" placement="top">
                            <el-button circle icon="el-icon-arrow-left" @click="updateQueryDate('minus')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="后3小时数据" placement="top">
                            <el-button circle icon="el-icon-arrow-right" @click="updateQueryDate('add')"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <div>
                        <el-button type="primary" icon="el-icon-plus" @click="dialog = true">新增
                        </el-button>
                    </div>
                </div>

                <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab"
                         style="height:1100px;width: 100%;overflow:auto;"
                >
                    <el-tab-pane v-for="(item, index) in res" :key="index" :label="item.name" :name="item.name"
                    ></el-tab-pane>
                    <div style="">
                        <div id="chart" style="width: 98%;min-height: 500px;max-height: 500px;padding-top: 1vw;"></div>
                        <div class="testbox">
                            <el-table v-if="resDataList.length >0" :data="resDataList[tabIndex]" stripe height="300px"
                                      border
                            >

                                <el-table-column prop="timeDate" label="日期" width="220">
                                    <template slot-scope="{row}">
                                        {{ row.time }}
                                    </template>
                                </el-table-column>
                                <el-table-column v-for="(item,index2) in codeNameList[tabIndex]" :key="item.code"
                                                 :label="item.displayName"
                                >
                                    <template slot-scope="scope">
                                        {{ scope.row[item.code] }}
                                    </template>
                                </el-table-column>

                            </el-table>
                        </div>
                    </div>
                </el-tabs>


            </div>
        </div>

        <el-drawer
            title=""
            :before-close="handleClose"
            :visible.sync="dialog"
            direction="ltr"
            custom-class="demo-drawer"
            ref="drawer"
        >
            <div class="demo-drawer__content">
                <el-form :model="query" ref="ruleForm" label-position="right" label-width="120px">
                    <el-form-item label="时间" prop="timeData" :rules="[{ required: true, message: '时间不能为空'}]">
                        <!--                                                <el-date-picker v-model="query.timeData"
                                                                                        type="datetimerange"
                                                                                        range-separator="-"
                                                                                        style="width: 90%;"
                                                                                        start-placeholder="开始日期"
                                                                                        end-placeholder="结束日期"
                                                                                        clearable
                                                                                        size="small"
                                                                                        @change="timeChange"
                                                                                        :picker-options="pickerOptions"
                                                                                        :default-time="['00:00:00', '03:00:00']"
                                                                        >
                                                                        </el-date-picker>-->
                        <el-date-picker
                            v-model="query.timeData"
                            style="width: 90%;"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions"
                            clearable
                            size="small"
                            @change="timeChange"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <!--                    <el-form-item label="粒度" prop="every"
                                                      :rules="[{ required: true, message: '粒度不能为空'},{ type: 'number', message: '粒度必须为数字值'}]"
                                        >
                                            <el-input v-model.number="query.every" style="width: 90%;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="时间单位" prop="unit" :rules="[{ required: true, message: '时间单位不能为空'}]">
                                            <el-select v-model="query.unit" placeholder="请选择" clearable style="width: 90%;">
                                                <el-option v-for="(item, index) in unitOption" :key="index" :label="item.label"
                                                           :value="item.value" :disabled="item.disabled"
                                                >
                                                </el-option>
                                            </el-select>
                                        </el-form-item>-->
                    <el-form-item label="设备" prop="uid">
                        <el-select v-model="query.uid" filterable placeholder="请选择"
                                   @change="(e)=>idChange(e)" style="width: 90%;"
                        >
                            <el-option v-for="(item,index2) in equipmentOptions" :key="item.F_Id"
                                       :label="item.name" :value="index2"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据类型" prop="codes">
                        <el-select v-model="query.codes" placeholder="请选择" multiple style="width: 90%;">
                            <el-option v-for="(item, index) in codeOptions" :key="index"
                                       :label="item.name" :value="item.dictionary.code" :disabled="item.disabled"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>

                <!--                <div>
                                    <div
                                        style="width: 90%; margin-left: 10%; margin-bottom: 1vh; padding: 10px; background-color: rgba(255, 255, 255, 0.5); box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;"
                                        v-for="(item,index) in query.codes" :key="index" class="dataform"
                                    >
                                        <div style="padding: 0 0 0 5px ">
                                            <div class="text">{{ item }}汇总方式</div>
                                            <div style="padding: 5px 0 5px 0;">
                                                <el-select v-model="query.funs[index]" placeholder="请选择" size="small">
                                                    <el-option v-for="item in funOption" :key="item.value" :label="item.label"
                                                               :value="item.value"
                                                    >
                                                    </el-option>
                                                </el-select>
                                            </div>
                                            <div class="text">{{ item }}过滤表达式</div>
                                            <div style="padding: 5px 0 5px 0;">
                                                <el-input v-model="query.filters[index]" placeholder="请输入过滤数据的表达式"></el-input>
                                            </div>
                                            <div class="text">{{ item }}是否填充</div>
                                            <div style="padding: 5px 0 5px 0;">
                                                <el-radio-group v-model="query.createEmptys[index]">
                                                    <el-radio :label="true" border>true</el-radio>
                                                    <el-radio :label="false" border>false</el-radio>
                                                </el-radio-group>
                                            </div>
                                            <div class="text">{{ item }}填充值</div>
                                            <div style="padding: 5px 0 5px 0;">
                                                <el-input v-model="query.fills[index]" placeholder="请输入过滤数据的表达式"></el-input>
                                            </div>
                                        </div>
                                    </div>

                                </div>-->

                <div class="demo-drawer__footer">
                    <div style="padding-left: 10%;">
                        <el-button style="width: 40%;" @click="cancelForm">取 消</el-button>
                        <el-button style="width: 40%;" type="primary" @click="$refs.drawer.closeDrawer()"
                                   :loading="loading"
                        >
                            {{ loading ? '提交中 ...' : '确 定' }}
                        </el-button>
                    </div>

                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getState } from '@/api/equipment'
import { selectEquipmentParameter } from '@/api/report'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

import moment from 'moment'

export default {
    name: 'EquipmentParameterReport',
    data() {
        return {
            editableTabsValue: 0,
            tabIndex: 0,

            loading: false,
            dialog: false,
            timer: null,

            equipmentOptions: [],
            codeOptions: [],
            unitOption: [
                {
                    label: '小时',
                    value: 'h',
                    disabled: false
                },
                {
                    label: '天',
                    value: 'd',
                    disabled: false
                },
                {
                    label: '秒', //不小于5秒
                    value: 's',
                    disabled: false
                },
                {
                    label: '分钟',
                    value: 'm',
                    disabled: false
                }

            ],
            funOption: [
                {
                    value: 'DIFF',
                    label: '时段差异'
                },
                {
                    value: 'SUM',
                    label: '时段求和'
                },
                {
                    value: 'MEAN',
                    label: '平均值'
                },
                {
                    value: 'MEDIAN',
                    label: '中位数'
                },
                {
                    value: 'STDDEV',
                    label: '平方差'
                },
                {
                    value: 'SPREAD',
                    label: '极差'
                },
                {
                    value: 'MAX',
                    label: '最大值'
                },
                {
                    value: 'MIN',
                    label: '最小值'
                },
                {
                    value: 'INC',
                    label: '增长统计'
                },
                {
                    value: 'FIRST',
                    label: '第一个'
                },
                {
                    value: 'last',
                    label: '最后一个'
                }

            ],

            query: {
                name: '',
                uid: undefined,
                timeData: '',
                start: '',
                stop: '',
                every: -1,
                unit: 'h',
                funs: [],
                codes: [],
                filters: [],
                createEmptys: [],
                fills: []
            },
            res: [],
            //处理后的集合
            resDataList: [],
            dateList: [],
            nameList: [],
            codeNameList: [],

            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },

            myChart: undefined

        }
    },
    created() {
        this.selectEquipmentList()
    },
    mounted() {
    },
    methods: {
        //搜索设备列表
        selectEquipmentList() {
            getDataInterfaceRes('349818079917646597').then(res => {
                let data = res.data
                this.equipmentOptions = data
            })
        },
        //搜索设备点位列表
        getcodeOptions() {
            getDictionaryDataSelector('349819091223061253').then(res => {
                this.codeOptions = res.data.list
            })
        },
        // 设备改变事件
        idChange(e) {
            let id = this.equipmentOptions[e].F_Id

            this.query.uid = this.equipmentOptions[e].uuid

            this.codeOptions = []
            this.query.codes = []
            //删除之前的数据类型

            getState(id).then(res => {
                this.query.name = res.data.name

                console.log(res.data.result.mapping.mappingLines)

                let codes = res.data.result.mapping.mappingLines

                let arr = []

                let activecodes = []

                for (let i = 0; i < codes.length; i++) {
                    if (codes[i].category == 'NORM') {
                        arr.push(codes[i])

                        activecodes.push(codes[i].dictionary.code)
                    }
                }

                this.codeOptions = arr
                this.query.codes = activecodes
            })
        },

        //删除tab
        removeTab(targetName) {

            for (let i = 0; i < this.res.length; i++) {
                let it = this.res[i]
                if (it.name == targetName) {
                    this.res.splice(i, 1)

                    this.codeNameList.splice(i, 1)
                    this.dateList.splice(i, 1)
                    this.nameList.splice(i, 1)
                    this.resDataList.splice(i, 1)//[this.tabIndex] = arr;
                }

            }

            if (this.res.length > 0) {
                this.tabIndex = this.tabIndex - 1
            } else {
                this.tabIndex = 0
            }

            this.charts()
        },

        //点击tab
        clickTab(e) {
            this.tabIndex = e.index

            this.charts()

        },

        initData(query) {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid || query) {
                    if (this.regularCheck()) {

                        let res = this.disposeQuery(query)

                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });

                        selectEquipmentParameter(res).then(res => {
                            // TODO
                            let _data = res.data
                            let arr = []
                            let date = []//_data.outputs[0].timeDate.slice(0, _data.outputs[0].timeDate.length - 1)

                            for (let j = 0; j < _data.outputs[0].timeDate.length - 1; j++) {
                                let item = {
                                    time: moment((new Date(_data.outputs[0].timeDate[j]).getTime())).format('YYYY-MM-DD HH:mm:ss')//_data.outputs[0].timeDate[j]
                                }

                                date.push(item.time)

                                for (let i = 0; i < _data.outputs.length; i++) {
                                    item[`${_data.outputs[i].code}`] = _data.outputs[i].data[j]

                                }
                                arr.push(item)
                            }

                            let codeNames = []
                            for (let i = 0; i < _data.outputs.length; i++) {
                                codeNames.push({
                                    code: _data.outputs[i].code,
                                    displayName: _data.outputs[i].displayName,
                                    data: _data.outputs[i].data.slice(0, _data.outputs[i].data.length - 1)
                                })
                            }

                            // TODO
                            this.codeNameList.push(codeNames)
                            this.dateList.push(date)
                            this.nameList.push(_data.name)
                            this.resDataList.push(arr)

                            this.loading = false
                            this.dialog = false
                            this.clearData()
                            this.charts()

                            loading.close();
                        })

                    }

                }
            })
        },

        //处理请求参数
        disposeQuery(query) {

            var res = []

            for (let i = 0; i < query.codes.length; i++) {
                let i1 = {
                    uid: query.uid,
                    code: query.codes[i],
                    every: query.every,
                    start: query.start,
                    stop: query.stop,
                    unit: query.unit,
                    fun: 'last',
                    filter: '',
                    createEmpty: true,
                    fill: 'usePrevious'
                }

                res.push(i1)

            }

            return res
        },

        //正则校验
        regularCheck() {
            var f = true

            /* if (!this.query.stop || !this.query.start) {
                 f = false
                 this.$message({
                     message: '没有选择时间',
                     type: 'warning'
                 })
                 return f
             }
             if (!this.query.unit) {
                 f = false
                 // console.log("没有时间粒度");
                 this.$message({
                     message: '没有时间粒度',
                     type: 'warning'
                 })
                 return f
             }
             if ((this.ids.length != this.codes.length) || (this.ids.length != this.funs.length) || (this.codes
                 .length != this.funs.length)) {
                 f = false
                 // console.log("请完善查询信息");
                 this.$message({
                     message: '请完善查询信息',
                     type: 'warning'
                 })
                 return f
             }
 */
            return f
        },

        //搜索
        search() {
            this.initData()
        },
        //确定时间
        timeChange(e,f) {
            console.log(e)
            let d1 = new Date(e)

            let start = moment(Number(d1.getTime())).format('YYYY-MM-DD 00:00:00')
            let stop = moment(Number(d1.getTime())).format('YYYY-MM-DD 03:00:00')
            this.query.start = start;
            this.query.stop = stop
            this.query.times = [start,stop]

            if(f){
                this.res[this.tabIndex].start = start;
                this.res[this.tabIndex].stop = stop;
                this.res[this.tabIndex].times = [start,stop];

                let _query = JSON.parse(JSON.stringify(this.res[this.tabIndex]))
                this.updateDate(_query);
            }


        },
        handleadd() {
            this.list++
            this.filterList.push('')
            this.deletes = true
        },
        handledelete(index) {
            this.ids.splice(index, 1)
            this.codes.splice(index, 1)
            this.funs.splice(index, 1)
            this.filterList.splice(index, 1)

            this.codeOptions.splice(index, 1)

            this.list--
            if (this.list == 1) {
                this.deletes = false
                this.list = 1
            }
        },
        charts() {

            var chart = this.$echarts.init(document.getElementById('chart'))

            window.addEventListener('resize', () => {
                chart.resize()
            })
            let option = {
                title: {
                    text: ''
                },
                legend: {
                    show: true,
                    orient: 'vertical',
                    right: 20,
                    data: []
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: '2%',
                    top: '8%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },

                series: []
            }
            let clist = this.codeNameList[this.tabIndex] || []
            if (clist != null && clist != undefined && clist.length > 0) {
                for (let i = 0; i < clist.length; i++) {
                    option.legend.data.push(clist[i].displayName)
                    option.xAxis.data = this.dateList[this.tabIndex]

                    let item = {
                        name: clist[i].displayName,
                        data: clist[i].data,
                        type: 'line',
                        symbol: 'triangle',
                        symbolSize: 4

                    }

                    option.series.push(item)
                }
            }

            chart.setOption(option, true)

        },

        //关闭抽屉
        handleClose(done) {
            if (this.loading) {
                return
            }
            this.$confirm('确定要提交表单吗？').then(_ => {
                this.loading = true
                this.saveForm()
                /* this.timer = setTimeout(() => {
                     done()
                     // 动画关闭需要一定的时间
                     setTimeout(() => {

                     }, 400)
                 }, 2000)*/
            }).catch(_ => {

            })
        },

        cancelForm() {
            this.loading = false
            this.dialog = false
            this.clearData()
            clearTimeout(this.timer)
        },

        saveForm() {
            let str = JSON.stringify(this.query)
            this.res.push(JSON.parse(str))
            this.initData(JSON.parse(str))
        },

        //确定事件
        closeDrawer() {
            this.handleClose()
        },

        clearData() {
            this.query.name = ''
            this.query.uid = ''
            this.query.timeData = ''
            this.query.start = ''
            this.query.stop = ''
            this.query.every = -1
            this.query.unit = 'h'
            this.query.funs = []
            this.query.codes = []
            this.query.filters = []
        },

        //修改参数信息
        updateQueryDate(val) {
            let _query = this.res[this.tabIndex]

            let d1 = new Date(_query.start)
            let d2 = new Date(_query.stop)
            if (val == 'add') {
                d1.setTime(d1.getTime() + (3600 * 1000 * 3))
                _query.start = moment(Number(d1.getTime())).format('YYYY-MM-DD HH:mm:ss')

                d2.setTime(d2.getTime() + 3600 * 1000 * 3)
                _query.stop = moment(Number(d2.getTime())).format('YYYY-MM-DD HH:mm:ss')
            } else {
                d1.setTime(d1.getTime() - 3600 * 1000 * 3)
                _query.start = moment(Number(d1.getTime())).format('YYYY-MM-DD HH:mm:ss')

                d2.setTime(d2.getTime() - 3600 * 1000 * 3)
                _query.stop = moment(Number(d2.getTime())).format('YYYY-MM-DD HH:mm:ss')
            }
            // _query.timeData = moment(Number(d1.getTime())).format('YYYY-MM-DD')
            // this.$set(_query, 'timeData', moment(Number(d1.getTime())).format('YYYY-MM-DD'))
            console.log(_query.timeData)


            _query.times = [_query.start,_query.stop]

            // this.res[this.tabIndex] = _query;



            this.updateDate(_query)

        },
        updateDate(query) {
            console.log(query)
            if (this.regularCheck()) {

                let res = this.disposeQuery(query)

                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                selectEquipmentParameter(res).then(res => {
                    // TODO
                    let _data = res.data
                    let arr = []
                    let date = []
                    for (let j = 0; j < _data.outputs[0].timeDate.length - 1; j++) {
                        let item = {
                            time: moment((new Date(_data.outputs[0].timeDate[j]).getTime())).format('YYYY-MM-DD HH:mm:ss')
                        }

                        date.push(item.time)

                        for (let i = 0; i < _data.outputs.length; i++) {
                            item[`${_data.outputs[i].code}`] = _data.outputs[i].data[j]

                        }
                        arr.push(item)
                    }

                    let codeNames = []
                    for (let i = 0; i < _data.outputs.length; i++) {
                        codeNames.push({
                            code: _data.outputs[i].code,
                            displayName: _data.outputs[i].displayName,
                            data: _data.outputs[i].data.slice(0, _data.outputs[i].data.length - 1)
                        })
                    }

                    // TODO
                    this.codeNameList[this.tabIndex] = codeNames
                    this.dateList[this.tabIndex] = date
                    this.nameList[this.tabIndex] = _data.name
                    this.resDataList[this.tabIndex] = arr

                    this.loading = false
                    this.dialog = false
                    this.clearData()

                    this.charts()

                    loading.close()
                })

            }

        }
    },
    watch: {}
}
</script>

<style scoped>
.search_box {
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
    justify-content: flex-end;
}


.dataform {
    transition: all 0.5s;
}

.dataform:hover {
    box-shadow: 0px 0px 10px #c2c2c2;
}

.el-table {
    height: 600px;
    width: 100%;
    overflow: auto;
}


.testbox .el-table--scrollable-x .el-table__body-wrapper {
    overflow: auto !important;
}

.testbox .el-table__fixed-right-patch {
    background-color: #f5f7fa !important;
}
</style>
