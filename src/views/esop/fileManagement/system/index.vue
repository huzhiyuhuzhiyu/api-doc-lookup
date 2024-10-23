<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
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
                <div class="JNPF-common-search-box searchWrapper" style="width: 100%;display: flex;align-items: center;height: 34px;padding-top: 0">

                        <SearchPlane
                            :transition-time="500"
                            :loading.sync="searchPlaneLoading"
                            class="search-com"
                            :searchDropDownList="allSearchDropDownList"
                            @search-change="searchChange"
                            @item-click="searchItemClick"
                            :list="searchList"
                            :keyword.sync="keyword"
                            style="width: calc(100% - 34px)"
                        ></SearchPlane>

                        <SwitchListAndFilter style="width: 39px" @command="filterExtHandler" :switch-list.sync="allSwitchList" :current-ext.sync="currentExt" :file-ext-filter-option="fileExtFilterOption"/>

                </div>
                <div style="height: calc(100% - 35px)">
                    <JNPF-table  class="table-style" v-if="allSwitchList" v-loading="listLoading" :data="fileList" empty-text="暂无文件" size="mini">
                        <el-table-column prop="fullName" label="文件名" custom-column>
                            <template slot-scope="scope">
                          <span v-if="scope.row.type" class="pointer" @click="listItemClick(scope.row)" >
                            {{ scope.row.fullName }}
                          </span>
                                <span class='cursor-pointer' v-else @click="openFolder(scope.row)">
                            <i class='icon-ym icon-ym-extend-folder text-warning' />
                            {{ scope.row.fullName }}
                          </span>
                            </template>
                        </el-table-column>
                        <!--              <el-table-column prop="fileSize" label="大小">-->
                        <!--                <template slot-scope="scope">{{ scope.row.fileSize | toFileSize() }}</template>-->
                        <!--              </el-table-column>-->
                        <el-table-column prop="creatorTime" label="创建日期" width="200"/>
                        <el-table-column label="操作" fixed="right" width="200">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" @click="handleDownLoad(scope.row.id)"
                                           :disabled="!scope.row.type">下载</el-button>
                                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                           @click="handleDel(scope.$index, scope.row.id)" v-if="scope.row.canEdit">删除</el-button>
                                <el-dropdown v-if="scope.row.canEdit">
                                    <el-button type=" text" size="mini">
                                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="shareFolder(scope.row.id)" v-if="scope.row.type">
                                            共享
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="getFolder(scope.row.id)">重命名
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="moveTo(scope.row.id, scope.row.parentId)">
                                            移动到
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </JNPF-table>
                    <GridFileList v-loading="gridFileListLoading" class="table-style" style="border: 1px solid #ebeef5 !important;" v-else @item-click="listItemClick" @command="allItemCommandHandler"  :list="fileList" :file-options="allFileOptions"></GridFileList>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { getcategoryTree } from '@/api/basicData/index'
import { getPartnerList, releasePartner } from '@/api/customerManagement/index'

import SuperQuery from '@/components/SuperQuery/index.vue'
import {FileCategoryType} from "@/views/esop/fileCategoryManagement/constants";
import FileUploadDrop from "@/views/esop/fileUpload/workinginstruction/component/FileUploadDrop.vue";
import GridFileList from "@/views/drawingDocument/document/GridFileList.vue";
import {AllList} from "@/api/extend/document";
import {isFile, Type2SuffixArr} from "@/views/drawingDocument/document/utils";
import SearchPlane from "@/views/drawingDocument/document/SearchPlane.vue";
import SwitchListAndFilter from "@/views/drawingDocument/document/SwitchListAndFilter.vue";

export default {
    name: 'myCustomer',
    components: {SwitchListAndFilter, SearchPlane, GridFileList, FileUploadDrop, SuperQuery, },
    data() {
        return {
            allFileOptions:[

            ],
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
            allSearchDropDownList:[
            ],
            fileList:[],
            allSwitchList:false,
            shareVisible:false,
            gridFileListLoading:false,
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
            initListQuery: {
                "businessId": 0,
                "businessType": "",
                "categoryId": 0,
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
                "pageNum": 0,
                "pageSize": 0,
                "productsId": 0,
                "startTime": "",
                "startUpdateTime": "",
                "superQuery": {
                    "condition": [
                        {
                            "field": "",
                            "fieldValue": "",
                            "symbol": ""
                        }
                    ],
                    "matchLogic": ""
                },
                "totalRowFlag": false
            },
            listQuery: {},
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
    },
    created() {

        AllList({
            parentId:0
        }).then(res=>{
            this.fileList = res.data.list
        })
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
        this.getcategoryTree()
        // this.initData()
        if (localStorage.getItem("punterFlag")) {
            let roleFlag = JSON.parse(localStorage.getItem('punterFlag'))
            this.expands = roleFlag
            this.toggleExpand(roleFlag)
        }
    },
    computed: {
        currMenuId() {
            return (this.$route.meta.modelId || '') + this.partentOrChild
        }
    },
    beforeDestroy() {
        window.onresize = null
    },
    methods: {
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
        listItemClick(){},
        allItemCommandHandler(){},

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
        async switchStyle() {
            await this.$nextTick();
            const programmes = this.$refs.programmes ? this.$refs.programmes.offsetWidth : 0
            if (programmes <= 100) {
                this.programmelist = []
                this.programmelist1 = this.datalist.slice(0)
                Math.floor(programmes / 100)
            } else {
                let num = Math.floor(programmes / 100)
                if (num - 1 > this.datalist.length) {
                    num = this.datalist.length + 1
                }
                this.programmelist = this.datalist.slice(0, num - 1)
                this.programmelist1 = this.datalist.slice(num - 1)
            }
            // 附带防抖的监听适配模式屏幕缩放
            window.onresize = () => {
                clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    this.switchStyle()
                }, 100);
            };
        },
        filterNode(value, data) {
            console.log(value, data);
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
        columnSetFun() {
            this.$refs.dataTable.showDrawer()
        },
        getcategoryTree() {
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
                    this.initData()
                })
            }).catch(() => {
                this.listLoading = false
                this.treeLoading = false
            })
        },
        initData() {
            this.listLoading = true
            Object.keys(this.listQuery).forEach(key => {
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
            getPartnerList(this.listQuery).then(res => {
                this.tableData = res.data.records
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

        // 关闭新建编辑页面
        closeForm(isRefresh) {
            this.shareVisible=false
            this.formVisible = false
            this.recordFormVisible = false
            if (isRefresh) {
                this.keyword = ''
                this.initData()
            }
        },
        search() {
            this.listQuery.pageNum = 1
            this.initData()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
            this.$refs.SuperQuery.conditionList = []
            this.programmefrom = {}
            this.programmetitle = ''
            this.filterText = ''
            this.getcategoryTree()
        },

        addOrUpdateHandle(id, btntype) {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.Form1.init(id, btntype)
            })
        },
        // 写记录
        handleRecord(row) {
            this.recordFormVisible = true
            this.$nextTick(() => {
                this.$refs.RecordForm1.init(row.id)
            })
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                deleteOrders(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                    })
                })
            }).catch(() => {})
        },
        releaseFun() {
            if (this.selectData.length) {
                let idList = this.selectData.map(item => item.id)
                releasePartner(idList).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "释放成功",
                        duration: 1500,
                    })
                }).catch(() => { })
            } else {
                this.$message.warning('请选择您要释放的客户数据！')
            }
        },
    }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style scoped lang="scss">
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
</style>
