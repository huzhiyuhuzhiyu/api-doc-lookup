<script>

import {debounce} from "throttle-debounce";
import {fileTypeStatistic, increaseStatistic, uploadStatistic} from "@/api/esop/dashborad";
import {ApplicationType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {notEmpty} from "@/utils";
function randomData() {
    return Math.round(Math.random()*1000);
}
function getFullPath(pathName){
    return '/esop/fileManagement/'+pathName
}
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
            topData:[
                {
                    title:'作业指导书',
                    icon:'zgt-ifont zgt-ifont-zuoyezhidaoshu',
                    item:[
                        {
                            name:'本日新增',
                            value:22
                        },
                        {
                            name:'本周新增',
                            value:500
                        },
                        {
                            name:'本月新增',
                            value:0
                        },

                    ],
                    pathName:'workinginstruction',
                    type:ApplicationType.WORK
                },
                {
                    title:'检验指导书',
                    pathName:'checkinstruction',
                    icon:'zgt-ifont zgt-ifont-nianjian',
                    item:[
                        {
                            name:'本日新增',
                            value:randomData()
                        },
                        {
                            name:'本周新增',
                            value:randomData()
                        },
                        {
                            name:'本月新增',
                            value:randomData()
                        },

                    ],
                    type:ApplicationType.INSPECT
                },
                {
                    title:'图文档',
                    pathName:'docment',
                    icon:'zgt-ifont zgt-ifont-weibiaoti--copy',
                    item:[
                        {
                            name:'本日新增',
                            value:randomData()
                        },
                        {
                            name:'本周新增',
                            value:randomData()
                        },
                        {
                            name:'本月新增',
                            value:randomData()
                        },

                    ],
                    type: ApplicationType.IMAGE
                },
                {
                    title:'办公文件',
                    pathName:'office',
                    icon:'zgt-ifont zgt-ifont-bangongwenjian',
                    item:[
                        {
                            name:'本日新增',
                            value:randomData()
                        },
                        {
                            name:'本周新增',
                            value:randomData()
                        },
                        {
                            name:'本月新增',
                            value:randomData()
                        },

                    ],
                    type: ApplicationType.OFFICE
                },
                {
                    title:'系统附件',
                    pathName:'system',
                    icon:'zgt-ifont zgt-ifont-gongdanxitong-fujian',
                    item:[
                        {
                            name:'本日新增',
                            value:randomData()
                        },
                        {
                            name:'本周新增',
                            value:randomData()
                        },
                        {
                            name:'本月新增',
                            value:randomData()
                        },

                    ],
                    type: ApplicationType.SYSTEM
                },
            ],
            topDataMap:new Map(),
            topLoading:false,
            leftBottomLoading:false,
            rightBottomLoading:false,
        }
    },
    methods:{
      initCharts(){
        this.fileTypeInstance = this.$echarts.init(document.getElementById('fileType'))
        this.fileOperateInstance = this.$echarts.init(document.getElementById('fileOperate'))
        window.onresize = debounce(100,false,()=>{
           this.fileTypeInstance.resize()
           this.fileOperateInstance.resize()
        })
      },
      async loadUploadType(){
          this.rightBottomLoading = true
          try {
              const {data} =  await fileTypeStatistic()
              console.log('loadUploadType',data)
              const x=[]
              const y=[]
              data.forEach(({fileType,count})=>{
                  if(!fileType) return
                  x.push(fileType)
                  y.push(count)
              })
              const fileOperateOption ={
                  xAxis: {
                      type: 'category',
                      data: x
                  },
                  yAxis: {
                      type: 'value'
                  },
                  series: [
                      {
                          data: y,
                          type: 'bar',
                          name:'文档数量'
                      },
                  ],
                  legend: {
                      bottom: 10
                  },
                  tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                          type: 'shadow'
                      }
                  },
                  title: {
                      left: 'center',
                      text: '文件类型统计',
                      top: 20
                  },
                  color: [ '#00b8d9', '#36b37e'],
              }
              this.fileOperateInstance.setOption(fileOperateOption)
          }catch (e) {

          }finally {
              this.rightBottomLoading = false
          }

      },
      async loadUploadNum(){
          this.leftBottomLoading = true
          try {
              const {data} =   await increaseStatistic()
              console.log('loadUploadNum',data)
              data.filter(notEmpty).forEach(item=>{
                  const obj = this.topDataMap.get(item.type)
                  if(obj){
                      obj.item[0].value = item.dailyCount
                      obj.item[1].value = item.weeklyCount
                      obj.item[2].value = item.monthlyCount || 0
                  }
              })
          }catch (e) {

          }finally {
              this.leftBottomLoading = false
          }


      },
      async loadUploadNumByDay(){
          this.topLoading = true
          try {
              const {data} = await uploadStatistic()
              const x=[]
              const y=[]
              data.forEach(({count,date})=>{
                  x.push(date)
                  y.push(count)
              })
              const fileTypeOption = {
                  xAxis: {
                      type: 'category',
                      data: x
                  },
                  yAxis: {
                      type: 'value'
                  },
                  series: [
                      {
                          data:  y,
                          type: 'line',
                          name:'文档数量'
                      }
                  ],
                  legend: {
                      // data: ['文档数量'],
                      // top: 10,
                      // isShow:true
                      bottom: 10
                  },
                  title: {
                      left: 'center',
                      text: '文件上传统计',
                      top: 20
                  },
                  tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                          type: 'shadow'
                      }
                  },
                  color: ['#4a657a', '#308e92', '#b1cfa5', '#f5d69f', '#f5898b', '#ef5055'],
              };
              this.fileTypeInstance.setOption(fileTypeOption)
          }catch (e) {

          }finally {
                this.topLoading = false
          }

      },
      async loadData(){
            this.loadUploadType()
            this.loadUploadNum()
            this.loadUploadNumByDay()
      },
      blockClick(pathName){
        const path =  getFullPath(pathName)
        this.$router.push({path})
      }
    },
    beforeDestroy() {
      window.onresize = null
    },
    mounted() {
        this.topData.forEach(item=>this.topDataMap.set(item.type,item))
        this.initCharts()
        this.loadData()

    },

}
</script>

<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center  JNPF-flex-main height-full">
           <div class="wrapper height-full">
               <div class="header" v-loading="topLoading">
                   <div class="header-item pointer" @click="blockClick(top.pathName)" v-for="top in topData">
                       <div class="item-title">
                               {{top.title}}
                       </div>
                       <div  class="flex-row justify-center align-center" style="height: calc(100% - 28px)">
                           <div style="width: 20%;height: 100%" class="flex-row justify-center align-center">
                               <span :class="top.icon" style="font-size: 38px"></span>
                           </div>
                           <div style="width: 80%;height: 100%">
                               <div class="height-full flex-column justify-center align-center">
                                   <div class="item-text"  v-for="item in top.item">
                                       <div class="item-text-left">{{ item.value }}</div>
                                       <div class="item-text-right">{{item.name}}</div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
               <div class="charts">
                   <el-row :gutter="10" class="height-full">
                       <el-col :span="12" class="height-full" v-loading="leftBottomLoading">
                           <div class="charts-item left height-full">
                               <div id="fileType" class="height-full"></div>
                           </div>

                       </el-col>
                       <el-col :span="12" class="height-full">
                           <div class="charts-item right height-full" v-loading="rightBottomLoading">
                               <div id="fileOperate" class="height-full"></div>
                           </div>
                       </el-col>
                   </el-row>
               </div>

           </div>

        </div>

    </div>
</template>

<style scoped lang="scss">
@media (max-width: 1600px) {
    .item-text-left{
        font-size: 28px !important;
    }
}
@media (max-width: 1350px) {
    .item-text-left{
        font-size: 24px !important;
    }
}
.wrapper{

    .header{
        padding: 5px 0;
        display: flex;
        height: 217px;
        .header-item{
            background-color: #fff;
            margin: 0 5px;
            height: 207px;
            width: 20%;
            padding: 7px;
            display: flex;
            flex-direction: column;
            .item-title{
                text-align: center;
                //color: rgb(24,144,255);
                font-size: 24px;
                margin-top: 7px;
                height: 28px;
            }
            .item-text{
                width: 100%;
                text-align: center;
                font-size: 18px;
                color: #c2c2c2;
                display: flex;
                .item-text-left{
                    color: #ff0000;
                    font-size: 32px;
                    width:42%;
                }
                .item-text-right {
                    width: 58%;
                    display: flex;
                    align-items: center;
                    justify-content: left;
                    font-size: 14px;
                }
            }

        }
    }
    .charts{
        padding: 5px;
        height: calc(100% - 217px);
        .charts-item{
            background-color: #fff;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        //.left{
        //    background-image: url("~@/assets/images/esop/left-border.png");
        //}
        //.center{
        //    background-image: url("~@/assets/images/esop/center-boder.png");
        //}
        //.right{
        //    background-image: url("~@/assets/images/esop/right-border.png");
        //};
    }
}

</style>
