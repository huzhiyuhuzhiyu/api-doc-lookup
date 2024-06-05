<template>
    <div class="JNPF-common-layout">

        <div style="display: flex;width: 100%;">

            <div style="width: 25vw;overflow-y: auto;height: 100%;">
                <div style="width: 90%; margin: 5px auto 0; padding: 23px 10px 5px; background-color: #fff; ">
                    <el-form :model="query" ref="ruleForm" label-width="88px" label-position="right">
                        <el-form-item label="时间" prop="times" :rules="[{ required: true, message: '时间不能为空'}]">
                            <el-date-picker v-model="query.times" type="datetimerange" range-separator="-"
                                start-placeholder="开始日期" end-placeholder="结束日期" clearable style="width: 90%;"
                                size="small" @change="timeChange" :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="粒度" prop="every"
                            :rules="[{ required: true, message: '粒度不能为空'},{ type: 'number', message: '粒度必须为数字值'}]">
                            <el-input v-model.number="query.every" style="width: 90%;"></el-input>
                        </el-form-item>
                        <el-form-item label="时间单位" prop="unit" :rules="[{ required: true, message: '时间单位不能为空'}]">
                            <el-select v-model="query.unit" placeholder="请选择" clearable style="width: 90%;">
                                <el-option v-for="(item, index) in unitOption" :key="index" :label="item.label"
                                    :value="item.value" :disabled="item.disabled">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>

                <div style="display: flex;">
                    <div style="width: 90%;display: flex;margin-top: 1vh; justify-content: space-between;flex-direction: column;align-items: flex-end;">
                        <div style="width: calc(100% - 50px); box-sizing: border-box; margin-bottom: 1vh; padding: 10px; background-color: rgba(255, 255, 255, 0.5); box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;" v-for="(item,index) in list" :key="index" class="dataform">
                            <!-- 设备选择 -->
                            <div class="search_box">
                                <div class="text fonttohide">设备</div>
                                <div style="width: 70%;">
                                    <el-select v-model="ids[index]" filterable placeholder="请选择"
                                        @change="(e)=>idChange(e,index)">
                                        <el-option v-for="(item,index2) in equipmentOptions" :key="item.F_Id"
                                            :label="item.name" :value="index2">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <!--数据类型  -->
                            <div class="search_box">
                                <div class="text fonttohide">数据类型</div>
                                <div style="width: 70%;">
                                    <el-select v-model="codes[index]" placeholder="请选择">
                                        <el-option v-for="(item, index) in codeOptions[index]" :key="index"
                                            :label="item.name" :value="item.dictionary.code" :disabled="item.disabled">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <!-- 汇总方式 -->
                            <div class="search_box">
                                <div class="text fonttohide">汇总方式</div>
                                <div style="width: 70%;">
                                    <el-select v-model="funs[index]" placeholder="请选择" size="small">
                                        <el-option v-for="item in optionss" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="search_box">
                                <div class="text fonttohide">过滤表达式</div>
                                <div style="width: 70%;">
                                    <el-input v-model="filterList[index]" style="max-width: 225px" placeholder="请输入过滤数据的表达式"></el-input>
                                </div>
                            </div>
                            <!-- 删除按钮 -->
                            <div style="text-align: end;margin-top: 10px;" v-show="deletes">
                                <el-button icon="el-icon-delete" @click="handledelete(index)"></el-button>
                            </div>
                        </div>

                    </div>
                </div>

                <div>
                    <!-- 添加按钮 -->
                    <div style="width: 97%;display: flex;justify-content:center;">
                        <el-button style="margin-right: 2vw;" type="primary" plain size="small"
                            icon="el-icon-circle-plus" @click="handleadd">添加
                        </el-button>

                        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                    </div>
                </div>
            </div>
            <div
                style="flex:1;border-radius: 10px;margin-top: 0.5vw;background-color:#FFFFFF ;overflow-y: auto;align-items: center;display: flex;max-height: 90vh;flex-direction: column;box-shadow:-moz-box-shadow:0px 0px 10px #C2C2C2; -webkit-box-shadow:0px 0px 10px #C2C2C2; box-shadow:0px 0px 10px #C2C2C2;">
                <div class="text"
                    style="width: 100%;display: flex;align-items: center;justify-content: flex-end;padding-top: 1vw;padding-right: 1vw;">
                    切换图表：
                    <el-select v-model="valueasd" placeholder="请选择" @change="chartswitchings()" size="small">
                        <el-option v-for="item in optionsasd" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div id="charts"
                    style="width: 98%;min-height: 79vh;max-height: 79.5vh;padding-top: 1vw;padding-left: 1vw;">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getListChart,
        getState
    } from '@/api/equipment'
    import {
        getDictionaryDataSelector
    } from '@/api/systemData/dictionary'
    import {
        getDataInterfaceRes
    } from '@/api/systemData/dataInterface'

    import moment from 'moment'

    export default {
        name: 'datacharts',
        data() {
            return {
                value1: [],
                value: [],
                deletes: false,
                myChart: null,
                values: '',
                optionss: [
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
                        value: 'LAST',
                        label: '最后一个'
                    },

                ],
                valuess: '',
                optionsasd: [
                    {
                        value: 'line',
                        label: '折线图'
                    },
                    {
                        value: 'bar',
                        label: '柱状图'
                    },
                    {
                        value: '下载图片',
                        label: '保存为图片'
                    }
                ],
                valueasd: 'line',

                option1: {
                    title: {
                        text: '设备数据分析'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [],
                        right: '1%'
                    },
                    grid: {
                        left: '2%',
                        right: '80px',
                        bottom: '2%',
                        top: '8%',
                        containLabel: true
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            restore: {
                                title: '还原'
                            },
                            dataView: {
                                title: '数据视图'
                            },
                            magicType: {
                                type: ['line', 'bar', 'stack']
                            },
                            saveAsImage: {
                                type: 'png'
                            }
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: []
                },
                option2: {
                    title: {
                        text: '设备数据分析'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [],
                        right: '1%'
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
                },

                equipmentOptions: [],

                list: 1,
                ids: [],
                codes: [],
                funs: [],
                filterList:[],

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
                    // {
                    //     label: '周',
                    //     value: 'w'
                    // },
                    // {
                    //     label: '月',
                    //     value: 'M'
                    // },
                    {
                        label: '秒', //不小于5秒
                        value: 's',
                        disabled: false
                    },
                    {
                        label: '分钟',
                        value: 'm',
                        disabled: false
                    },


                ],


                query: {
                    times: [],
                    start: '',
                    stop: '',
                    every: 1,
                    unit: '',
                },
                codeOptions: [],
                codeProps: {
                    'label': 'fullName',
                    'value': 'enCode'
                },

                iotData: {}

            }
        },
        created() {
            this.selectEquipmentList()
            //this.getcodeOptions()
        },
        mounted() {
            // let fontSizeValue = localStorage.getItem('fontSizeValue') ? localStorage.getItem('fontSizeValue') : 16
            // document.getElementsByTagName('body')[0].style.setProperty('--fSize', fontSizeValue + 'px');
            // this.charts();
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
            idChange(e, index) {

                let id = this.equipmentOptions[e].F_Id;

                //删除之前的数据类型
                this.codes.splice(index, 1);

                getState(id).then(res => {


                    this.codeOptions.splice(index, 0, res.data.result.mapping.mappingLines)

                    // TODO
                    // console.log(res.data.result);
                    // console.log(this.codeOptions[index]);

                })
            },

            initData() {
                this.$refs["ruleForm"].validate((valid) => {
                    if (valid) {
                        if (this.regularCheck()) {
                            var ids = [];
                            for (var i = 0; i < this.ids.length; i++) {
                                ids.push(this.equipmentOptions[this.ids[i]])
                            }


                            let _query = {
                                ids: ids,
                                codes: this.codes,
                                funs: this.funs,
                                filters: this.filterList,
                                params: {
                                    start:this.query.start,
                                    stop:this.query.stop,
                                    every:this.query.every,
                                    unit:this.query.unit
                                }
                            }

                            getListChart(_query).then(res => {

                                // TODO
                                // console.log(res)
                                let _data = res.data

                                for (var i = 0; i < _data[0].result.timeDate.length; i++) {
                                    let date = new Date(_data[0].result.timeDate[i])

                                    let item = ''
                                    if (this.query.unit == 'd') { //粒度为天
                                        if (i < (_data[0].result.timeDate.length - 1)) {
                                            date = date.setDate(date.getDate() - 1)
                                            date = new Date(date)
                                        }

                                        item = moment(Number(date.getTime())).format(
                                                'MM-DD'
                                                ) //  (date.getMonth() + 1) + '-' + date.getDate()
                                    } else if ((this.query.unit == 's')) { //粒度为秒
                                        item = moment(Number(date.getTime())).format('HH:mm:ss')
                                    } else if ((this.query.unit == 'm')) { //粒度为分钟
                                        item = moment(Number(date.getTime())).format('HH:mm')
                                    } else {
                                        item = moment(Number(date.getTime())).format(
                                            'HH:mm') //  date.getHours() + ':' + date.getSeconds()
                                    }

                                    _data[0].result.timeDate[i] = item
                                }

                                this.iotData = _data
                                // TODO
                                console.log(this.iotData)
                                this.charts()

                            })

                        }

                    }
                })
            },

            //正则校验
            regularCheck() {
                var f = true;

                if (!this.query.stop || !this.query.start) {
                    f = false;
                    this.$message({
                        message: "没有选择时间",
                        type: 'warning'
                    });
                    return f;
                }
                if (!this.query.unit) {
                    f = false;
                    // console.log("没有时间粒度");
                    this.$message({
                        message: "没有时间粒度",
                        type: 'warning'
                    });
                    return f;
                }
                if ((this.ids.length != this.codes.length) || (this.ids.length != this.funs.length) || (this.codes
                        .length != this.funs.length)) {
                    f = false;
                    // console.log("请完善查询信息");
                    this.$message({
                        message: "请完善查询信息",
                        type: 'warning'
                    });
                    return f;
                }





                return f;
            },


            //搜索
            search() {

                this.initData()
            },
            //确定时间
            timeChange(e) {
                let d1 = new Date(e[0])
                let d2 = new Date(e[1])
                let d3 = new Date();

                if (d2.getTime() > d3.getTime()) {
                    d2 = d3;
                }

                let f = true

                if (d1.getFullYear() == d2.getFullYear()) {
                    if (d1.getMonth() == d2.getMonth()) {
                        if (d1.getDate() == d2.getDate()) {
                            this.query.unit = 'h'
                            f = false
                            this.unitOption[2].disabled = false
                        } else {
                            this.unitOption[2].disabled = true
                        }
                    }
                }

                if (f) {
                    this.query.unit = 'd'
                }
                // this.query.start = getDateJSON(e[0])
                // this.query.stop = getDateJSON(e[1])

                this.query.start = moment(Number(d1.getTime())).format('YYYY-MM-DD HH:mm:ss')
                this.query.stop = moment(Number(d2.getTime())).format('YYYY-MM-DD HH:mm:ss')
                console.log(this.query);



            },

            handleadd() {
                this.list++
                this.filterList.push("")
                this.deletes = true
            },
            handledelete(index) {
                this.ids.splice(index, 1)
                this.codes.splice(index, 1)
                this.funs.splice(index, 1)
                this.filterList.splice(index,1)

                this.codeOptions.splice(index, 1);




                this.list--
                if (this.list == 1) {
                    this.deletes = false
                    this.list = 1
                }
            },
            charts() {
                this.myChart = this.$echarts.init(document.getElementById('charts'))
                // 一个组件内有多个图表都有响应式

                this.myChart.clear()

                window.addEventListener('resize', () => {
                    this.myChart.resize()
                })

                let option = this.option1

                this.setOptionData(option)

                this.myChart.setOption(option)
                // console.log(this.myChart.resize);
            },

            //给option赋值
            setOptionData(option) {
                //得到现在时间
                // var time = new Date();
                // //得到开始时间
                // var startTime = new Date(this.query.start);
                // //得到结束时间
                // let endTime = new Date(this.query.stop);

                // //x轴赋值
                // if (time.getTime() < endTime.getTime()) {
                //     if (this.query.unit == 'h') {//粒度为小时
                //         let danwei = 3600000;

                //         let length = (time.getTime()-startTime.getTime())/danwei

                //         option.xAxis.data = this.iotData[0].result.timeDate.slice(0, (time.getHours() + 1))
                //     } else if (this.query.unit == 'd') {//粒度为天
                //          option.xAxis.data = this.iotData[0].result.timeDate.slice(0, (time.getHours() + 1))
                //     } else {
                //         option.xAxis.data = this.iotData[0].result.timeDate
                //     }
                // } else {
                //     option.xAxis.data = this.iotData[0].result.timeDate
                // }


                option.xAxis.data = this.iotData[0].result.timeDate

                option.legend.data = [];
                option.series = []



                for (var i = 0; i < this.iotData.length; i++) {
                    // console.log(this.iotData[i].result);
                    option.legend.data.push(this.iotData[i].name)
                    let item = {
                        name: this.iotData[i].name,
                        type: this.valueasd,
                        data: this.iotData[i].result.data,
                    }


                    // if (time.getTime() < endTime.getTime()) {
                    //     if (this.query.unit == 'h') {
                    //         item.data = this.iotData[i].result.data.slice(0, (time.getHours() + 1))
                    //     } else {
                    //         item.data = this.iotData[i].result.data;
                    //     }
                    // } else {
                    //     item.data = this.iotData[i].result.data;
                    // }


                    if (this.valueasd == 'line') {
                        item.markPoint = {
                                data: [{
                                    name: '最大值',
                                    type: 'max'
                                }]
                            },
                            item.markLine = {
                                data: [{
                                    name: '平均值',
                                    type: 'average'
                                }]
                            }
                    }


                    option.series.push(item);
                }
            },

            // 切换图表类型
            chartswitchings() {
                if (this.valueasd == 'bar') {
                    this.myChart = this.$echarts.init(document.getElementById('charts'))
                    let options = this.option2

                    this.setOptionData(options)

                    this.myChart.setOption(options, true)
                    //一个组件内有多个图表都有响应式
                    window.addEventListener('resize', () => {
                        this.myChart.resize()

                    })

                } else if (this.valueasd == 'line') {
                    this.myChart = this.$echarts.init(document.getElementById('charts'))
                    let options = this.option1

                    this.setOptionData(options)

                    this.myChart.setOption(options, true)

                    //一个组件内有多个图表都有响应式
                    window.addEventListener('resize', () => {
                        this.myChart.resize()
                    })
                } else if (this.valueasd == '下载图片') {
                    this.Export()
                    // console.log(this.myChart.getDataURL);
                }
            },

            // 下载图片
            Export() {
                // console.log(this.myChart);
                let img = new Image()
                img.src = this.myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1, //放大2倍
                    backgroundColor: '#fff'
                })

                img.onload = () => {
                    let canvas = document.createElement('canvas')
                    canvas.width = img.width
                    canvas.height = img.height
                    let ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0)
                    let dataURL = canvas.toDataURL('image/png')

                    let a = document.createElement('a')
                    // 创建一个单击事件
                    let event = new MouseEvent('click')
                    // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
                    a.download = '图片.png' || '下载图片名称'
                    // 将生成的URL设置为a.href属性
                    a.href = dataURL
                    // 触发a的单击事件
                    a.dispatchEvent(event)
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

    .fonttohide {
        text-align: right;
        width: 90px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 10px;
    }
</style>
