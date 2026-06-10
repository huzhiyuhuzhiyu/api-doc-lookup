<template>


    <div v-show="showBox" class="box text">
        <div class="box_left">
             <!-- :class="route1.hasChildren ? 'hasChildren' : 'noChildren'" -->
             <!-- <div class="br" v-if="!route.hasChildren"></div> -->
                <div v-for="route in menuList" :key="route.enCode" :item="route" :base-path="route.path" style="">
                    <div class="item">
                        <i class="text el-icon" :class="route.type==1 ? 'el-icon-eleme' : 'el-icon-star-off'"></i>
                        <el-link :underline="false" :icon="route.icon" class="text"> {{route.fullName}}</el-link>
                    </div>
                    <div style="margin-left:0px;display:flex;flex-wrap:wrap;" >
                        <div v-for="route1 in route.children" :key="route1.enCode" :item="route1" :base-path="route1.path">
                            <div class="item" :class="route1.hasChildren ? 'hasChildren' : 'noChildren'">
                                <i class="text el-icon" :class="route1.type==1 ? 'el-icon-eleme' : 'el-icon-star-off'"></i>
                                <el-link :underline="false" :icon="route1.icon" class="text"> {{route1.fullName}}</el-link>
                            </div>
                            <div style="margin-left:0px;display:flex;flex-wrap:wrap;">
                                <div v-for="route2 in route1.children" :key="route2.enCode" :item="route2" :base-path="route2.path">
                                    <div class="item" :class="route2.hasChildren ? 'hasChildren' : 'noChildren'">
                                        <i class="text el-icon" :class="route2.type==1 ? 'el-icon-eleme' : 'el-icon-star-off'"></i>
                                        <el-link :underline="false" :icon="route2.icon" class="text"> {{route2.fullName}}</el-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            <!-- {{menuList}} -->
        </div>
        <div class="box_right">
            <div style="text-align:right;"><el-button type="text" @click="closeBox">×</el-button></div>
            <div v-for="route in menuList" :key="route.enCode" :item="route" :base-path="route.path">{{route.fullName}}</div>
        </div>
    </div>
</template>

<script>
    import {
        mapGetters,
        mapState
    } from 'vuex'

    export default {
        data() {
            return {
                defaultOpeneds: []
            }
        },
        props: {
          showBox: {
            type: Boolean
          }
        },
        computed: {
            ...mapGetters([
                'permission_routes',
                'sidebar',
                'menuList'
            ]),

        },
        created() {
        },
        methods: {
            closeBox(){
                this.showBox = false
            }

        },
    }
</script>
<style lang="scss" scoped>
    .box {
        position: fixed;
        top: 60px;
        left: 210px;
        background: rgba(0, 0, 0, 0.5);
        height: calc(100vh - 60px);
        width: calc(100vw - 280px);
        z-index: 3000;
        box-shadow: 5px 5px 5px silver;
        display: flex;
    }

    .box_left {
        padding: 20px;
        overflow: scroll;
        background: white;
        height: 100%;
        flex: 1;
    }

    .box_right {
        padding: 5px 20px;
        width: 200px;
        line-height: 34px;
        font-weight: bold;
        background: white;
        border-left: 1px solid silver;
    }

    .el-icon {
        margin-right: 6px;
        margin-top: -2px;
    }

    .el-icon-eleme {
        color: transparent
    }

    .el-icon-star-off {
        color: #bbb;
    }

    .el-icon-star-off:hover {
        color: orange;
    }

    .noChildren{
        // float:left;
    }
    // .hasChildren *{
    //     font-weight:bold;
    //     color:red;
    // }
    // .hasChildren:before{
    //     display:block;
    //     width:100vw;
    //     content:"";

    // }
    .item {
        display: flex;
        width: calc( calc(100vw - 560px) / 4);
        line-height: 30px;
        align-items: center;
    }

    .br {
        background: red;
        height: 4px;
        width: 100vw;
    }
</style>
