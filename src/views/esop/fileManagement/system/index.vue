<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-left treeBox" style="transition: width 500ms" :style="leftFlag ? 'width:15px;background:#fff' : ''">
            <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
                <div class="title_box">
                    <h2>系统附件分类</h2>
                    <span class="options" v-if="!leftFlag">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
                </div>
                <div> <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:200px;margin:10px auto;display:block" suffix-icon="el-icon-search" clearable>
                </el-input></div>
            </div>

            <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
                <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <i class="el-icon-notebook-2" />
                    <span class="text">{{ node.label }}</span>
                  </span>
                </el-tree>
            </el-scrollbar>
            <div v-if="!leftFlag" class="retract " style="position: absolute">
                <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
            </div>
            <div v-if="leftFlag" class="expand " style="position: absolute">
                <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
            </div>
        </div>
        <div class="JNPF-common-layout-center JNPF-flex-main" style="background: #fff;padding: 10px;">
            <div class="main JNPF-flex-main height-full">
                <el-row class="JNPF-common-search-box" :gutter="16">
                    <el-form @submit.native.prevent>
                        <el-col :span="4" style="padding-left: 0 !important;">
                            <el-form-item>
                                <el-input @clear="search" @keyup.enter.native="search" v-model="listQuery.superQuery.condition[0].fieldValue" placeholder="文件名" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-date-picker v-model="createTimeArr" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                                                @change="search"
                                                style="width: 100%" start-placeholder="创建开始时间" end-placeholder="创建结束时间" clearable></el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item>
                                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                                    {{ $t('common.search') }}
                                </el-button>
                                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col   :span="6" class="JNPF-common-head-right" style="display:flex;justify-content:flex-end;align-items:center;float: right;line-height: 34px;padding-right: 16px !important;">
                                                    <SwitchListAndFilter :needFilter="false" style="width: 39px" @command="filterExtHandler" :switch-list.sync="allSwitchList" :current-ext.sync="currentExt" :file-ext-filter-option="fileExtFilterOption"/>

                        </el-col>
                    </el-form>
                </el-row>
<!--                <div class="JNPF-common-search-box searchWrapper" style="width: 100%;display: flex;align-items: center;height: 34px;padding-top: 0;justify-content: space-between;">-->

<!--&lt;!&ndash;                        <SearchPlane&ndash;&gt;-->
<!--&lt;!&ndash;                            :transition-time="500"&ndash;&gt;-->
<!--&lt;!&ndash;                            :loading.sync="searchPlaneLoading"&ndash;&gt;-->
<!--&lt;!&ndash;                            class="search-com"&ndash;&gt;-->
<!--&lt;!&ndash;                            :searchDropDownList="allSearchDropDownList"&ndash;&gt;-->
<!--&lt;!&ndash;                            @search-change="searchChange"&ndash;&gt;-->
<!--&lt;!&ndash;                            @item-click="searchItemClick"&ndash;&gt;-->
<!--&lt;!&ndash;                            :list="searchList"&ndash;&gt;-->
<!--&lt;!&ndash;                            :keyword.sync="keyword"&ndash;&gt;-->
<!--&lt;!&ndash;                            style="width: calc(100% - 34px)"&ndash;&gt;-->
<!--&lt;!&ndash;                        ></SearchPlane>&ndash;&gt;-->
<!--                        <el-form @submit.native.prevent style="display: flex;justify-content: center;">-->
<!--                            <el-row :gutter="16">-->
<!--                                <el-col :span="4">-->
<!--                                    <el-form-item   style="margin-bottom: 0px !important">-->
<!--                                        <el-input v-model="listQuery.superQuery.condition[0].fieldValue" placeholder="请输入文件名" style="width: 200px" clearable-->
<!--                                                  @clear="search"-->
<!--                                                  @keyup.enter.native="search()" ></el-input>-->
<!--                                    </el-form-item>-->
<!--                                </el-col>-->
<!--                                <el-col :span="8">-->
<!--                                    <el-form-item >-->
<!--                                        <el-date-picker v-model="createTimeArr" type="datetimerange" :default-time="['00:00:00', '23:59:59']"-->
<!--                                                        style="width: 100%" start-placeholder="创建开始时间" end-placeholder="创建结束时间" clearable></el-date-picker>-->
<!--                                    </el-form-item>-->
<!--                                </el-col>-->
<!--                                <el-col :span="6">-->
<!--                                    <el-form-item  style="margin-bottom: 0px !important;margin-left: 10px">-->
<!--                                        <el-button type="primary" icon="el-icon-search" @click="search()" size="mini">-->
<!--                                            {{$t('common.search')}}</el-button>-->
<!--                                        <el-button icon="el-icon-refresh-right" @click="reset()" size="mini">{{$t('common.reset')}}-->
<!--                                        </el-button>-->
<!--                                    </el-form-item>-->
<!--                                </el-col>-->
<!--                            </el-row>-->



<!--                        </el-form>-->

<!--                        <SwitchListAndFilter :needFilter="false" style="width: 39px" @command="filterExtHandler" :switch-list.sync="allSwitchList" :current-ext.sync="currentExt" :file-ext-filter-option="fileExtFilterOption"/>-->

<!--                </div>-->
                <div style="height: calc(100% - 35px)" v-loading="listLoading">

                    <JNPF-table  v-if="allSwitchList"   class="table-style" :data="fileList" empty-text="暂无文件" size="mini" customKey="JNPFTableKey_731928">
                            <el-table-column prop="filename" label="文件名" custom-column min-width="150">
                                <template slot-scope="scope">
                                    <el-link :underline="false" type="primary" @click="listItemClick(scope.row)" >
                                        {{ scope.row.filename }}
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column prop="fileSize" label="大小" width="100">
                                <template slot-scope="scope">{{ scope.row.fileSize | toFileSize }}</template>
                            </el-table-column>

                            <el-table-column prop="fileSize" label="业务名称"  width="160">
                                <template slot-scope="{row}">{{ getBusinessTitle(row.configKey) }}</template>
                            </el-table-column>

                            <el-table-column prop="createTime" label="创建日期" width="200"/>
                            <el-table-column label="操作"
                                             fixed="right" width="200">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="text" @click="handleDownLoad(scope.row.documentId)">下载</el-button>
                                    <el-button size="mini" type="text" @click="listItemClick(scope.row)" >详情</el-button>
                                    <template v-if="!isFileCheckPage">
                                        <el-button v-if="isFileTrashPage" size="mini" type="text" class="JNPF-table-successBtn" @click="handleRevert(scope.row.id)">还原</el-button>
                                        <el-button v-else size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除</el-button>
                                    </template>


                                </template>
                            </el-table-column>
                        </JNPF-table>
                    <GridFileList
                        v-else
                        class="table-style"
                        style="border: 1px solid #ebeef5 !important;"
                        @item-click="listItemClick"
                        @command="allItemCommandHandler"
                        :list="fileList"
                        :file-options="allFileOptions"
                    >
                        <template v-slot:tooltip="{ item }">
                            <el-row>
                                <el-col style="text-align: right" :span="8">{{ item.type ? '文件名' : '文件夹名' }}：</el-col>
                                <el-col :span="16">{{ item.filename }}</el-col>
                            </el-row>
                            <el-row>
                                <el-col style="text-align: right" :span="8">文件大小：</el-col>
                                <el-col :span="16">{{ item.fileSize | toFileSize() }}</el-col>
                            </el-row>
                            <el-row  >
                                <el-col style="text-align: right" :span="8">业务名称：</el-col>
                                <el-col :span="16">{{ getBusinessTitle(item.configKey) }}</el-col>
                            </el-row>
                        </template>
                        <template v-slot:bottom="{item}">
                            <div>
                                <p class="li-upload-p1 name">{{ item.filename }}</p>
                                <p class="li-upload-p2 file-size" >{{ item.fileSize | toFileSize() }}</p>
                            </div>
                        </template>
                    </GridFileList>
                    <pagination  style="height: 36px" :total="total" :page.sync="listQuery.pageNum"
                                 :limit.sync="listQuery.pageSize" @pagination="initData" />
                </div>

                <Preview  class="search-left" :visible.sync="previewVisible" :file="previewFile" />
            </div>
        </div>
        <component
            ref="detailRef"
            v-if="showDetailVisible"
            :is="componentPath"
            v-bind="componentBindParams"
            v-on="componentBindEvents"
        ></component>
    </div>
</template>

<script>

import { getcategoryTree } from '@/api/basicData/index'

import {FileCategoryType} from "@/views/esop/fileCategoryManagement/constants";
import GridFileList from "@/views/drawingDocument/document/GridFileList.vue";
import {AllList, Download} from "@/api/extend/document";
import {isFile, Type2SuffixArr} from "@/views/drawingDocument/document/utils";
import SearchPlane from "@/views/drawingDocument/document/SearchPlane.vue";
import SwitchListAndFilter from "@/views/drawingDocument/document/SwitchListAndFilter.vue";
import {deepClone, getSuccessInfo, isEmpty, notEmpty, trim} from "@/utils";
import {systemAttachmentsDelete, systemAttachmentsList} from "@/api/esop/fileManage/system";
import ShowDetailMinix from "@/views/esop/fileManagement/system/ShowDetailMinix";
import Preview from "@/components/upload-wj/Preview.vue";
import {FILE_OPERATE} from "@/views/drawingDocument/document/constant";
import {getFilePreviewUrl, getTimeForSearchTimeType} from "@/views/esop/utils/utils";
import {isModelType, ModelType, PageType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {recycleBinAttachList, recycleBinAttachRevert, recycleBinList} from "@/api/esop/fileTrash/attachment";

export default {
    name:"FileManagementSystem",
    mixins:[ShowDetailMinix],
    components: {Preview, SwitchListAndFilter, SearchPlane, GridFileList},
    props:{
        pageType:{
            type:String,
            default:PageType.FileManagementAttachment
        }
    },
    data() {
        return {
            createTimeArr:[],
            previewVisible:false,
            previewFile:{},
            searchPlaneLoading:false,
            currentExt:'',
            fileExtFilterOption:Object.freeze( [
                {
                    text:'全部',
                    icon:'zgt-ifont-quanbu'
                },
                {
                    text:'txt',
                    icon:'zgt-ifont-txt'
                },
                {
                    text:'pdf',
                    icon:'zgt-ifont-pdf'
                },
                {
                    text:'word',
                    icon:'zgt-ifont-doc'
                },
                {
                    text:'excel',
                    icon:'zgt-ifont-excel'
                },
                {
                    text:'ppt',
                    icon:'zgt-ifont-ppt'
                },
                {
                    text:'图片',
                    icon:'zgt-ifont-tupian'
                }, {
                    text:'思维导图',
                    icon:'zgt-ifont-suolvetu-siweidaotu'
                },
            ]),
            keyword:"",
            allSearchDropDownList:[],
            fileList:[],
            allSwitchList:false,
            shareVisible:false,
            superQueryVisible: false,
            programmefrom: {},
            partentOrChild: 'partent',
            programmetitle: '',
            datalist: [],
            programmelist1: [],
            programmelist: [],
            treeLoading: false,
            treeData: [],
            defaultProps: {
                children: 'childrenList',
                label: 'name'
            },
            filterText: "",
            leftFlag: false,
            recordFormVisible: false,
            title: "更多查询",
            visible: false,
            tableData: [],
            listLoading: false,

            listQuery: {
            "businessId": "",
                "businessType": "",
                "categoryId": "",
                "createByName": "",
                "endTime": "",
                "endUpdateTime": "",
                "keyword": "",
                "orderItems": [
                {
                    "asc": true,
                    "column": ""
                }
            ],
                "pageNum": 1,
                "pageSize": 20,
                "productsId": null,
                "startTime": "",
                "startUpdateTime": "",
                "superQuery": {
                "condition": [
                    {
                        "field": "filename",
                        "fieldValue": "",
                        "symbol": "like"
                    }
                ],
                    "matchLogic": ""
            },
            "totalRowFlag": false
        },
            total: 0,
            formVisible: false,
            selectData: [],
            expands: true,
            refreshTree: true,
        }
    },
    watch: {
        filterText(val) {
            this.$refs.treeBox.filter(val);
        },
        "$route.query.type":{
            immediate:true,
            handler(val){
                if(!this.isFileManagementPage){
                    return
                }
                const type = this.$route.query.type
                if(isModelType(type) && notEmpty(val)){
                    if(type === ModelType.SEARCH){
                        return this.modelTypeSearchHandler(type,this.$route.query)
                    }
                }
            }
        }
    },

    created() {

        this.getcategoryTree(true)
        if (localStorage.getItem("punterFlag")) {
            let roleFlag = JSON.parse(localStorage.getItem('punterFlag'))
            this.expands = roleFlag
            this.toggleExpand(roleFlag)
        }
    },
    computed: {
        allFileOptions(){
            const res = [
                {
                    text:'下载',
                    value:FILE_OPERATE.DOWNLOAD,
                },

                // {
                //     text:'详情',
                //     value:FILE_OPERATE.DETAIL,
                // },
            ]
            if(this.isFileManagementPage){
                res.push({
                        text:'删除',
                        value:FILE_OPERATE.DELETE,
                        isShow:()=>!this.isFileTrashPage
                    })

            }
            if(this.isFileTrashPage){
                res.push({
                        text:'还原',
                        value:FILE_OPERATE.REVERT,
                })
            }
            return res
        },
        isFileTrashPage(){
            return this.pageType === PageType.FileTrashAttachment
        },
        isFileManagementPage(){
            return this.pageType === PageType.FileManagementAttachment
        }, isFileCheckPage(){
            return this.pageType === PageType.FileCheckAttachment
        },
        initFn(){
            return this.isFileTrashPage ? recycleBinAttachList:systemAttachmentsList
        },
        currMenuId() {
            return (this.$route.meta.modelId || '') + this.partentOrChild
        }
    },

    methods: {
        modelTypeSearchHandler(type,{searchTimeType}){
            if(isEmpty(searchTimeType)){
                return
            }
            const [startTime,endTime]= getTimeForSearchTimeType(searchTimeType)
            this.createTimeArr = [startTime,endTime]

            this.search()
        },
        async handleRevert(id){
            await recycleBinAttachRevert(id)
            getSuccessInfo()
            this.initData()
        },
        recycleBinAttachRevert,
        getBusinessTitle(configKey){
             if(isEmpty(this.configKey2Detail[configKey])){
                 return '历史数据无编码'
             }
            return this.configKey2Detail[configKey].title
        },
        filterExtHandler(command){
            if(command === ALL_TEXT){
                this.currentExt= ''
                return this.list = this.listCopy
            }
            this.currentExt= command
            const suffixArr = Type2SuffixArr.get(command)
            if(suffixArr && suffixArr.length){
                return this.list = this.listCopy.filter(item=>suffixArr.includes(item.fileExtension))
            }
        },
        async searchChange(data){
            if(data.keyword === ''){
                return this.searchList = []
            }
            this.searchPlaneLoading = true
            const { start,end }= timeOptionHandler(data[TIME_OPTION_FLAG])
            const fileType = fileExtOptionHandler(data[FILE_EXT_OPTION_FLAG])
            const documentType = fileCategoryOptionHandler(data[FILE_CATEGORY_OPTION_FLAG])
            const params ={
                keyword:data.keyword,
                start,
                end,
                fileType,
                parentId:this.parentId,
                documentType,
                subsetFlag:true
            }

            switch (this.activeTab){
                case "shareoutPanel":
                    params.documentType = 'share'
                    break;
                case "sharetomePanel":
                    params.documentType = 'shareToMe'
                    break;
                case "trashPanel":
                    params.documentType = 'trash'
                    break;

            }
            try {
                const res = await AllList(params)
                this.searchList = res.data.list.filter(item=>isFile(item))
            }catch (e) {
                console.error(e)
            }finally {
                this.searchPlaneLoading = false
            }

        },
        searchItemClick(){},
        searchList(){},
        listItemClick(item){
            this.previewFile = {
                name:item.filename,
                filename:item.filePath,
                url: getFilePreviewUrl(item.filePath)
            }
            this.previewVisible = true
        },
        handleDownLoad(id) {
            Download(id).then(res => {
                this.jnpf.downloadFile(res.data.url, res.data.name)
            })
        },
        allItemCommandHandler(command, item,index){
            switch (command) {
                case FILE_OPERATE.DOWNLOAD:
                    return this.handleDownLoad(item.documentId)
                case FILE_OPERATE.DELETE:
                    return this.handleDel(item.id)
                case FILE_OPERATE.DETAIL:
                    return this.showDetail(item)
                case FILE_OPERATE.REVERT:
                    return this.handleRevert(item.id)
                default:
                    break;
            }
        },

        // // 设置默认展开
        setexpand(expands) {
            this.refreshTree = false
            this.expands = expands
            this.$nextTick(() => {
                this.refreshTree = true
                localStorage.setItem("punterFlag", expands)
            })
        },
        toggleExpand(expands) {
            this.refreshTree = false
            this.expands = expands
            this.$nextTick(() => {
                this.refreshTree = true
                this.$nextTick(() => {
                    this.$refs.treeBox.setCurrentKey(this.companyId)
                })
            })
        },

        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        handleNodeClick(data, node) {
            this.listQuery.categoryId = node.data.id
            this.search();
        },
        changeLeft() {
            this.leftFlag = !this.leftFlag
        },

        getcategoryTree(isInit=false) {
            this.treeLoading = true
            this.listLoading = true
            getcategoryTree({
                keyword: "",
                type: FileCategoryType.SYSTEM_ATTACHMENT
            }).then(res => {
                this.treeData = res.data.length ? res.data : []
                this.listLoading = false
                this.$nextTick(() => {
                    // this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
                    this.listQuery.categoryId = ''
                    this.treeLoading = false
                    this.listLoading = false

                    if(isInit && notEmpty(this.$route.query.type)){
                        return
                    }
                    this.initData()

                })
            }).catch(() => {
                this.listLoading = false
                this.treeLoading = false
            })
        },
        initData() {
            this.listLoading = true
            trim(this.listQuery)
            this.jnpf.searchTimeFormat(this.listQuery, this.createTimeArr, 'startTime', 'endTime')
            const params = deepClone(this.listQuery)
            if(params.superQuery.condition[0].fieldValue === ''){
                delete params.superQuery
            }
           this.initFn(params).then(res => {
                this.fileList = res.data.records
                this.total = res.data.total
                this.listLoading = false
                this.visible = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        sortChange({ prop, order }) {
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.listQuery.orderItems[0].asc = order === 'ascending'
            this.listQuery.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },
        search() {
            this.listQuery.pageNum = 1
            this.initData()
        },
        reset(){
            this.listQuery.categoryId = ""
            this.listQuery.superQuery.condition[0].fieldValue = ""
            this.createTimeArr = []
            const treeBox = this.$refs.treeBox
            treeBox && treeBox.setCurrentKey(null)
            this.search()
        },


        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                systemAttachmentsDelete(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                    })
                })
            }).catch(() => {})
        },

    }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style scoped lang="scss">
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
.file-size{
    margin-top: 3px;
    color: #999;
    font-size: 12px;
    text-align: center;

}
.is-reverse {
    color: #fff !important;
    background-color: #3fb9f8;
}
.plan-list-item {
    & + & {
        margin-top: 5px;
    }
    height: 34px;
    align-items: center;
    line-height: 34px;
    color: #606266;
    font-size: 14px;
    cursor: pointer;
    text-align: left;
    &:hover {
        background-color: #3fb9f8;
    }
    .plan-list-name {
        &:hover {
            color: #606266;
        }
        .el-link--inner {
            // width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
.gjsearch {
    display: flex;
    background-color: #fff;
    padding: 8px;
    justify-content: space-between;
    align-items: center;
}
.treeBox_bot {
    .search-button {
        float: right;
        margin-right: 0;
        border: none;
        background-color: #fff;
        color: #606266;
    }
    .is-reverse {
        color: #fff;
        background-color: #3fb9f8;
    }
}
.title_box {
    width: 100%;
    display: flex;
    border-bottom: 1px solid #ebeef5;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 0 10px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.table-style{
    height: calc(100% - 36px)
}
</style>
