<script>

import {debounce} from "throttle-debounce";

export default {
    name: "index" ,
    data(){
        return{
            fileTypeInstance:null,
            fileCheckInstance:null,
            fileOperateInstance:null,
            fileTypeOption:null,
            fileCheckOption:null,
            fileOperateOption:null,

        }
    },
    methods:{
      initCharts(){
        this.fileTypeInstance = this.$echarts.init(document.getElementById('fileType'))
        this.fileCheckInstance = this.$echarts.init(document.getElementById('fileCheck'))
        this.fileOperateInstance = this.$echarts.init(document.getElementById('fileOperate'))
        window.onresize = debounce(100,false,()=>{
           this.fileTypeInstance.resize()
           this.fileCheckInstance.resize()
           this.fileOperateInstance.resize()
        })
      },
      loadData(){
         const fileTypeOption = {
             title: {
                 text: 'Rainfall vs Evaporation',
                 left: 'center'
             },
              xAxis: {
                  type: 'category',
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                  {
                      data: [120, 200, 150, 80, 70, 110, 130],
                      type: 'bar'
                  }
              ]
          };
         const fileCheckOption =  {
             xAxis: {
                 type: 'category',
                 data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
             },
             yAxis: {
                 type: 'value'
             },
             series: [
                 {
                     data: [120, 200, 150, 80, 70, 110, 130],
                     type: 'line'
                 }
             ]
         };
         const fileOperateOption ={
             xAxis: {
                 type: 'category',
                 data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
             },
             yAxis: {
                 type: 'value'
             },
             series: [
                 {
                     data: [120, 200, 150, 80, 70, 110, 130],
                     type: 'bar'
                 }
             ]
         }
          this.fileTypeInstance.setOption(fileTypeOption)
          this.fileCheckInstance.setOption(fileCheckOption)
          this.fileOperateInstance.setOption(fileOperateOption)
      },
    },
    beforeDestroy() {
      window.onresize = null
    },
    mounted() {
        this.initCharts()
        this.loadData()
    },

}
</script>

<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center  JNPF-flex-main height-full" style="background: #fff">
            <div class="header">


                <el-row :gutter="10">
                    <el-col :span="6">
                        <div class="header-item">
                            <div class="item-text">
                                <span class="item-num">897</span>原始文档数
                            </div>

                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="header-item">
                            <div class="item-text">
                                <span class="item-num">387</span>转换文档数
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="header-item">
                            <div class="item-text">
                                <span class="item-num">22</span>关联订单数
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="header-item">
                            <div class="item-text">
                                <span class="item-num">0</span>当日更新文档数
                            </div>
                        </div>
                    </el-col>
                </el-row>

            </div>
            <div class="charts">
                <el-row :gutter="10" class="height-full">
                    <el-col :span="8" class="height-full">
                        <div class="charts-item left height-full">
                            <div id="fileType" class="height-full"></div>
                        </div>

                    </el-col>
                    <el-col :span="8" class="height-full">
                        <div class="charts-item center height-full">
                            <div id="fileCheck" class="height-full"></div>
                        </div>
                    </el-col>
                    <el-col :span="8" class="height-full">
                        <div class="charts-item right height-full">
                            <div id="fileOperate" class="height-full"></div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="table"></div>
        </div>

    </div>
</template>

<style scoped lang="scss">
.header{
    height: 70px;
    padding: 5px 20px;
    .header-item{
        text-align: right;
        background-image: url("~@/assets/images/esop/line.png");
        background-size: 100%;
        background-position: -10px 45px;
        background-repeat: no-repeat;
        height: 60px;
        .item-text{
            width: 66%;
            .item-num{
                font-size: 40px;
                color: red;
            }
        }

    }
}
.charts{
    height: 300px;
    .charts-item{
        padding: 10px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .left{
        background-image: url("~@/assets/images/esop/left-border.png");
    }
    .center{
        background-image: url("~@/assets/images/esop/center-boder.png");
    }
    .right{
        background-image: url("~@/assets/images/esop/right-border.png");
    };
}
</style>
