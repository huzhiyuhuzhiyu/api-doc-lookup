<script>
const iconMap = new Map([
    [['pdf'],'iconfont icon-pdf'],
    [['doc','docx'],'iconfont icon-doc'],
    [['xls','xlxs'],'iconfont icon-excel'],
    [['ppt','pptx'],'iconfont icon-ppt'],
    [['png','jpg','jpeg'],'iconfont icon-tupian'],
    [['mind'],'iconfont icon-suolvetu-siweidaotu'],
    [[''],'icon-ym icon-ym-extend-folder']
])
export default {
    name: "index",
    props:{
        list:{
            type:Array,
            default:()=>[]
        },
        fileOptions:{
            type:Object,
            default:()=>({})
        }

    },
    methods:{
        ext2Icon(ext){
            const txt = ext ? ext.toLowerCase().replace('.','') : ""
            for(let [key,value] of iconMap){
                console.log(txt)
                if(key.includes(txt)) return value
            }
        },
    }
}
</script>

<template>
    <div class="grid-file-list">
        <div class="file-list">
            <div @click="$emit('item-click',item)" :class="['doc-item','pointer',item.isHover ? 'doc-item-hover' :'']" v-for="(item,index) in list" :key="item.id">
                <div :class="['item-cover']">
                    <i :class="[ext2Icon(item.fileExtension || item.fullName.split('.')[1])]" style="font-size: 45px"></i>
                </div>
<!--                docItemCommandHandler()  listDropDownChange($event,item) $emit('visible-change',$event,item)-->
                <el-dropdown @command="$emit('command',$event,item,index)" @visible-change="(visible)=>$set(item,'isHover',visible)" class="icon-more">
                    <span class="el-icon el-icon-more"></span>
                    <el-dropdown-menu slot="dropdown">
                        <template
                            v-for="option in fileOptions"
                           >
                            <el-dropdown-item
                                :key="option.value"
                                v-if="typeof option.isShow === 'function'
                                              ?  option.isShow(item)
                                              : true"
                                :command="option.value"
                                :disabled="typeof option.disabled === 'function'
                                              ?  option.disabled(item)
                                              : option.disabled"
                            >
                                {{option.text}}
                            </el-dropdown-item>
                        </template>

                    </el-dropdown-menu>
                </el-dropdown>

                <el-tooltip effect="dark" placement="top">
                    <div slot="content" style="width: 200px">
                        <el-row>
                            <el-col style="text-align: right" :span="8">{{item.type?'文件名':'文件夹名'}}：</el-col>
                            <el-col :span="16">{{item.fullName}}</el-col>
                        </el-row>
                        <el-row>
                            <el-col style="text-align: right" :span="8">创建日期：</el-col>
                            <el-col :span="16">{{item.creatorTime}}</el-col>
                        </el-row>
                        <el-row v-if="item.type">
                            <el-col style="text-align: right" :span="8">是否共享：</el-col>
                            <el-col :span="16">{{item.isShare ? '是':'否'}}</el-col>
                        </el-row>
                    </div>
                    <div class="name">  {{item.fullName}} </div>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.grid-file-list{
    .icon-more{
        background: #ebebeb;
        border-radius: 4px;
        display: none;
        height: 20px;
        position: absolute;
        right: 8px;
        top: 8px;
        width: 20px;
        z-index: 5;
        justify-content: center;
        align-items: center;
    }

    .file-list{
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;
        .doc-item-hover{
            background: #f7f7f7;
            .icon-more{
                display: flex;
            }
        }
        .doc-item{

            &:hover{
                background: #f7f7f7;
                .icon-more{
                    display: flex;
                }
            }
            align-items: center;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            height: 158px;
            position: relative;
            width: 136px;
            .item-cover{
                background-position: 50%;
                background-size: contain;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                box-shadow: 2.20234px 2.20234px 0 0 rgba(0,0,0,.04);
                height: 80px;
                margin: 16px 0 12px;
                position: relative;
                width: 56px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .name{
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                color: #222;
                display: -webkit-box;
                font-size: 13px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px;
                overflow: hidden;
                text-align: center;
                text-overflow: ellipsis;
                width: 104px;
                word-break: break-all;
            }
        }
    }
}


</style>
