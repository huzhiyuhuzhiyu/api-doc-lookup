<script>

import {debounce} from "throttle-debounce";
function randomData() {
    return Math.round(Math.random()*1000);
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

                    ]
                },
                {
                    title:'检验指导书',
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

                    ]
                },
                {
                    title:'图文档',
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

                    ]
                },
                {
                    title:'办公文件',
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

                    ]
                },
                {
                    title:'系统附件',
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
                },

            ]

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
      loadData(){
         const fileTypeOption = {
              xAxis: {
                  type: 'category',
                  data: new Array(30).fill(0).map((item,index)=>'10-'+(index+1))
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                  {
                      data:  new Array(30).fill(0).map((item,index)=>randomData()),
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

         const fileOperateOption ={
             xAxis: {
                 type: 'category',
                 data: ['pdf','xlsx','xls','doc','txt','xmind','png','jpeg']
             },
             yAxis: {
                 type: 'value'
             },
             series: [
                 {
                     data:  new Array(8).fill(0).map((item,index)=>randomData()),
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
          this.fileTypeInstance.setOption(fileTypeOption)
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
        <div class="JNPF-common-layout-center  JNPF-flex-main height-full">
           <div class="wrapper height-full">
               <div class="header">
                   <div class="header-item" v-for="top in topData">
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
                       <el-col :span="12" class="height-full">
                           <div class="charts-item left height-full">
                               <div id="fileType" class="height-full"></div>
                           </div>

                       </el-col>
                       <el-col :span="12" class="height-full">
                           <div class="charts-item right height-full">
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
