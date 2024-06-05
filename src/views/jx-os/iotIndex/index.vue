<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <el-row class="" :gutter="10">
                <el-col :span="24">
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="card-header">
                            <span>设备数量</span>
                        </div>
                        <div class="todo-box-body">
                            <a class="item">
                                <i class="icon-ym icon-ym-flowTodo"></i>
                                <div class="text">
                                    <p class="num">{{EquipmentNumber}}</p>
                                    <p class="name">总数量</p>
                                </div>
                            </a>
                            <a class="item">
                                <i class="icon-ym icon-ym-flowTodo"></i>
                                <div class="text">
                                    <p class="num">{{isIotEquipmentNumber}}</p>
                                    <p class="name">联网设备</p>
                                </div>
                            </a>
                            <a class="item">
                                <i class="icon-ym icon-ym-flowTodo"></i>
                                <div class="text">
                                    <p class="num">{{isNotIotEquipmentNumber}}</p>
                                    <p class="name">未联网设备</p>
                                </div>
                            </a>
                            <a class="item">
                                <i class="icon-ym icon-ym-flowTodo"></i>
                                <div class="text">
                                    <p class="num">{{SCEquipmentNumber}}</p>
                                    <p class="name">生产设备</p>
                                </div>
                            </a>
                            <a class="item">
                                <i class="icon-ym icon-ym-flowTodo"></i>
                                <div class="text">
                                    <p class="num">{{SCJCEquipmentNumber}}</p>
                                    <p class="name">生产检测设备</p>
                                </div>
                            </a>
                            <a class="item">
                                <i class="icon-ym icon-ym-flowTodo"></i>
                                <div class="text">
                                    <p class="num">{{JCEquipmentNumber}}</p>
                                    <p class="name">检测设备</p>
                                </div>
                            </a>
                            <a class="item">
                                <i class="icon-ym icon-ym-flowTodo"></i>
                                <div class="text">
                                    <p class="num">{{NHEquipmentNumber}}</p>
                                    <p class="name">点位设备</p>
                                </div>
                            </a>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="card-header">
                            <span>今日CPK</span>
                        </div>
                        <div class="card-body">
                            1.33
                        </div>
                    </el-card>
                </el-col>


            </el-row>

            <el-row class="paddingTop" :gutter="10">
                <el-col :span="8">
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="card-header">
                            <span>今日CPK</span>
                        </div>
                        <div class="card-body">
                            1.33
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="card-header">
                            <span>今日CPK</span>
                        </div>
                        <div class="card-body">
                            1.33
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="card-header">
                            <span>今日CPK</span>
                        </div>
                        <div class="card-body">
                            1.33
                        </div>
                    </el-card>
                </el-col>

            </el-row>


        </div>
    </div>
</template>

<script>
import  {selectIotEquipmentCountByTypeS} from '@/api/equipment'

import {getEquipmentAllStateNumber} from  '@/api/screen'

import { formatTime } from '@/utils/jx/jx-date'

import request from '@/utils/request'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

import moment from 'moment'

export default {
    // components: { Detailspages },
    data() {
        return {
            //设备数量
            EquipmentNumber:0,
            //联网设备数量
            isIotEquipmentNumber:0,
            //未联网设备数量
            isNotIotEquipmentNumber:0,
            //生产设备数量
            SCEquipmentNumber:0,
            //生产检测设备数量
            SCJCEquipmentNumber:0,
            //检测设备数量
            JCEquipmentNumber:0,
            //点位设备数量
            NHEquipmentNumber:0,
        }
    },
    created() {
        this.getEquipmentNumber()
        this.getIsIotEquipmentNumber();
        this.getIsNotIotEquipmentNumber();
        this.getSCEquipmentNumber();
        this.getSCJCEquipmentNumber();
        this.getJCEquipmentNumber();
        this.getNHEquipmentNumber();

        this.getEquipmentAllStateNumber();
    },
    mounted() {
    },

    methods: {
        getEquipmentNumber(){
            let _query={
            }
            selectIotEquipmentCountByTypeS(_query).then(res=>{
                this.EquipmentNumber = res.data
            })

        },
        getIsIotEquipmentNumber(){
            let _query={
                isIot:true
            }
            selectIotEquipmentCountByTypeS(_query).then(res=>{
                this.isIotEquipmentNumber = res.data
            })

        },
        getIsNotIotEquipmentNumber(){
            let _query={
                isIot:false
            }
            selectIotEquipmentCountByTypeS(_query).then(res=>{
                this.isNotIotEquipmentNumber = res.data
            })

        },
        getSCEquipmentNumber(){
            let _query={
                typeS:"CG"
            }
            selectIotEquipmentCountByTypeS(_query).then(res=>{
                this.SCEquipmentNumber = res.data
            })

        },
        getSCJCEquipmentNumber(){
            let _query={
                typeS:"SCJC"
            }
            selectIotEquipmentCountByTypeS(_query).then(res=>{
                this.SCJCEquipmentNumber = res.data
            })

        },
        getJCEquipmentNumber(){
            let _query={
                typeS:"JC"
            }
            selectIotEquipmentCountByTypeS(_query).then(res=>{
                this.JCEquipmentNumber = res.data
            })

        },
        getNHEquipmentNumber(){
            let _query={
                typeS:"NH"
            }
            selectIotEquipmentCountByTypeS(_query).then(res=>{
                this.NHEquipmentNumber = res.data
            })

        },
        //得到设备所有状态的数量
        getEquipmentAllStateNumber(){
            let _query={
                mrpworkshopId : '-1'
            }
            getEquipmentAllStateNumber(_query).then(res=>{
                console.log(res)
            })

        }

    }
}
</script>

<style scoped>
    .paddingTop{
        padding: 10px 0;
    }

    .card-header{
        position: relative;
        padding-left: 13px;
        /*margin: 24px 0;*/
    }
    .card-header:before {
        content: "";
        background-color: #3796EC;
        width: 4px;
        height: 16px;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -8px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }




</style>
