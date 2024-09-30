<script>
import {ext2Icon,previewFile} from "@/views/drawingDocument/document/utils";
import {debounce} from "throttle-debounce";


function getPath(e){
    let path = e.path || (e.composedPath && e.composedPath())
    if(path){return path}
    let el = e.target
    path = []
    while(el){
        path.push(el)
        el = el.parentElement
    }
    return path
}


export default {
    name: "SearchPlane",
    props:{
        searchDropDownList:{
            type:Array,
            default:()=>[]
        },
        debounceWait:{
            type:Number,
            default:300
        },
        list:{
            type:Array,
            default:()=>[]
        },
        keyword:{
            type:String,
            default:''
        },
        loading:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            searchPlaneTransform:'scale(0)',
            searchFocus:false,
            keyword:'',

        }
    },
    computed:{
        inputKeyWord:{
            get(){
                return this.keyword
            },
            set(val){
                this.$emit('update:keyword',val)
            }
        },
        cLoading:{
            get(){
                return this.loading
            },
            set(val){
                this.$emit('update:loading',val)
            }
        }
    },
    created() {
        this.searchChange = debounce(this.debounceWait,false,()=>{
            this.$emit('search-change',this.getSearchParams())
        })
    },

    methods:{
        getSearchParams(){
            const data ={
                keyword:this.keyword,
            }
            this.searchDropDownList.reduce((pre,cur)=>{
                pre[cur.flag] = cur.currentChoose
                return pre
            },data)
            return data
        },

        searchPlaneDropCommand(flag,command,item){
            console.log(flag,command,item)
            item.currentChoose =  item.option[command]
            this.searchChange()
        },
        windowClickHandler(e){
            getPath(e)
                .map(item=>[...(item.classList ? item.classList.values() : [])])
                .flat(Infinity)
                .includes('search-left') || this.hideSearchPanel()
        },
        hideSearchPanel(){
            this.searchFocus = false
            this.searchPlaneTransform='scale(0)'
            window.removeEventListener('click',this.windowClickHandler,{capture:true})
        },
        showSearchPanel(){
            this.searchFocus = true
            this.searchPlaneTransform = 'scale(1)'
        },
        searchFocusHandler(){
            this.showSearchPanel()
            window.addEventListener('click',this.windowClickHandler,true)
        },
        ext2Icon,
    }
}
</script>

<template>
    <div class="search-left" style="transition: all 300ms;position: relative;">
        <!-- <el-form-item label="关键词" style="margin: 0!important;">-->
        <el-input @input="searchChange"  :class="[searchFocus?'active':'']" class="search-input"  @focus="searchFocusHandler"   suffix-icon="el-icon-search" v-model="inputKeyWord" placeholder="请输入关键词查询" clearable/>
        <!-- </el-form-item>-->
        <div v-loading="cLoading"  :style="{transform:searchPlaneTransform}" class="search-panel">
            <div class="panel-head">
                <div class="panel-head-left">共{{list.length}}条结果</div>
                <div class="panel-head-right">
                    <div class="right-tag-item" v-for="item in searchDropDownList" :key="item.flag">
                        <el-dropdown @command="searchPlaneDropCommand(item.flag,$event,item)">
                                         <span class="el-dropdown-link">
                                             {{ item.currentChoose }}<i class="el-icon-arrow-down el-icon--right"></i>
                                         </span>
                            <el-dropdown-menu
                                :append-to-body="false"
                                class="right-tag-dropdown" slot="dropdown">
                                <el-dropdown-item   v-for="(v,k,index) in item.option"
                                                    :key="k"
                                                    :class="item.currentChoose === v ?'dropdown-item-active':''"
                                                    :command="k">{{v}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
            <div class="panel-body">
                <div class="panel-body-list">
                    <div class="infinite-list">
                        <div class="infinite-list-item" v-for="(item,index) in list" :key="index" @click="$emit('item-click',{item,position:'left',hideSearchPanel})">
                            <div class="item-wrap">
                                <div class="item-wrap-base">
                                    <i :class="ext2Icon('ppt')" style="margin-right: 8px"></i>
                                    <div class="base-title">{{item.fullName}}</div>
                                    <div class="base-source" @click.stop="$emit('item-click',{item,position:'right',hideSearchPanel})">
                                        来自： <span class="source-btn">{{item.source || '暂无来源'}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.search-input{
    width: 260px;
}
.search-input.active{
    width: 100%;
}
.search-input.active ::v-deep .el-input__inner{
    border-color: #3fb9f8;
    outline: 0;
}
.search-panel{
    transition: all 300ms;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 24px 0 rgba(0,0,0,.17);
    display: flex;
    flex-direction: column;
    left: 0;
    padding: 12px 8px;
    position: absolute;
    right: 0;
    top: 36px;
    z-index: 1000;
    transform: scale(0);
    transform-origin: top left;
    .panel-head{
        align-items: center;
        display: flex;
        justify-content: space-between;
        padding: 0 8px;
        .panel-head-left{
            color: #999;
            font-size: 13px;
            font-weight: 400;
        }
        .panel-head-right{
            align-items: center;
            display: flex;
            flex: 1;
            justify-content: flex-end;
            .right-tag-item{
                ::v-deep .el-dropdown{
                    min-width: 110px;
                    .el-dropdown-link{
                        align-items: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        box-sizing: border-box;
                        color: #222;
                        cursor: pointer;
                        display: flex;
                        font-size: 12px;
                        height: 26px;
                        justify-content: space-between;
                        line-height: 24px;
                        margin-left: 8px;
                        padding: 0 10px;
                        &:hover {
                            border: 1px solid #3fb9f8;
                            color: #3fb9f8;
                        }
                    }
                }
            }

        }
    }
    .panel-body{
        flex: 1;
        margin-top: 10px;
        overflow-y: hidden;
        text-align: left;
        .panel-body-history{
            display: flex;
            flex-direction: column;
            height: 250px;
            margin-top: 10px;
            overflow-y: auto;
            position: relative;
            .history-list{
                flex: 1;
                overflow-y: auto;
                .history-item{
                    align-items: center;
                    color: #222;
                    cursor: pointer;
                    display: flex;
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    font-weight: 400;
                    padding: 12px 8px;
                }
                .history-clear{
                    color: #21ab86;
                    font-family: PingFangSC-Regular;
                    font-size: 13px;
                    font-weight: 400;
                    margin: 10px 0 10px 8px;
                }
            }

        }

        .panel-body-list{
            display: flex;
            height: 382px;
            width: 100%;
            .infinite-list{
                height: 100%;
                margin-bottom: 10px;
                overflow-x: hidden;
                overflow-y: auto;
                width: 100%;
                .infinite-list-item{
                    align-items: flex-start;
                    box-sizing: border-box;
                    display: flex;
                    padding: 0 16px 0 8px;
                    width: 100%;
                    &:hover{
                        background: #f7f7f7;
                        border-radius: 6px;
                        cursor: pointer;
                    }
                    .item-wrap{
                        border-top: 1px solid transparent;
                        flex: 1;
                        overflow: hidden;
                        padding: 15px 0;
                        .item-wrap-base{
                            align-items: center;
                            display: flex;
                            justify-content: space-between;
                            .base-title{
                                color: #222;
                                flex: 1;
                                font-size: 14px;
                                font-weight: 500;
                                margin-right: 20px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            .base-source{
                                color: #999;
                                font-family: PingFangSC-Regular;
                                font-size: 12px;
                                font-weight: 400;
                                .source-btn{
                                    color: #222;
                                    font-family: PingFangSC-Regular;
                                    font-size: 12px;
                                    font-weight: 400;
                                    &:hover{
                                        color: #3fb9f8;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

.dropdown-item-active{
    background-color: #ecf8fe;
    color: #65c7f9;
}
.right-tag-dropdown{
    ::v-deep .el-dropdown-menu__item{
        box-sizing: border-box;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
