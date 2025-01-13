<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-left">
            <div class="JNPF-common-title">
                <h2>物料分类</h2>
                <span class="options">
                    <el-dropdown>
                        <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="getWarehouseList()">刷新数据</el-dropdown-item>
                            <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                            <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
            </div>

            <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
                <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                    highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                    class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
                    <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                        <i
                            :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                        <span class="text" :title="data.name">{{ data.name }}</span>
                    </span>
                </el-tree>
            </el-scrollbar>
        </div>
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @keyup.native.enter="search()"  v-model="tableQuery.code" placeholder="请输入产品编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @keyup.native.enter="search()"  v-model="tableQuery.name" placeholder="请输入产品名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @keyup.native.enter="search()"  v-model="tableQuery.drawingNo" placeholder="请输入产品图号" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                $t('common.reset') }}
                            </el-button>

                        </el-form-item>

                    </el-col>


                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <!-- <el-dropdown> -->
                    <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('', 'add')">
                        新建
                    </el-button>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="search()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableDataList" @sort-change="sortChange"
                    custom-column >

                    <el-table-column prop="code" label="产品编码" sortable="custom" min-width="200"></el-table-column>
                    <el-table-column prop="name" label="产品名称" sortable="custom" min-width="200"></el-table-column>
                    <el-table-column prop="drawingNo" label="产品图号" sortable="custom" min-width="200"></el-table-column>
                    <el-table-column prop="storageType" label="存储类型" width="130">
                        <template slot-scope="scope">
                            <div v-if="scope.row.storageType == 'network_path'">网络地址</div>
                            <div v-else-if="scope.row.storageType == 'local_path'">本地文件</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" />
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                            <el-button type="text" @click="handleDel(scope.row.id,)" style=" color: #ff3a3a">删除</el-button>
                            <el-dropdown hide-on-click>
                                <span class="el-dropdown-link">
                                    <el-button type="text" size="mini">
                                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="downloadImage(scope.row)" :disabled="scope.row.storageType=='network_path'">
                                        下载文件
                                    </el-dropdown-item>
                                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                                        查看详情
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
                    :limit.sync="tableQuery.pageSize" @pagination="initData" />
            </div>
        </div>


        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" @refreshDataList="initData"/>
    </div>
</template>
  
<script>
import { getDownloadUrl } from '@/api/common'
import { getworkingbimDrawingData, getworkingbimDrawingDetail } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import DepForm from './depForm'
import moment from 'moment'
export default {
    name: 'quality',
    components: { DepForm, },
    data() {
        return {
            expands: true,
            refreshTree: true,
            defaultProps: {
                children: 'childrenList',
                label: 'name'
            },
            treeData: [],
            treeLoading: false,
            storeageTypeList: [{
                label: "网络地址",
                value: "networ_ path"
            }, {
                label: "本地文件",
                value: "local_path"
            }],
            depFormVisible: false,
            background: true,//分页器背景颜色
            visible: false,
            tableDataList: [
            ],
            listLoading: false,
            tableQuery: {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
                drawingNo: "",
                name: "",
                code: "",
                productCategoryId: "", // 类型id
            },

            total: 0,
        }
    },
    created() {
        this.getcategoryTree()
        this.initData()
        // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        handleNodeClick(data, node) {
            if (this.tableQuery.productCategoryId === data.id) return
            this.tableQuery.productCategoryId = data.id
            this.search()
        },
        // 展开或折叠全部
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
        getcategoryTree() {
            this.listLoading = true
            this.treeLoading = true
            this.tableQuery.productCategoryId = "" // 重置数据类型id筛选
            getcategoryTree({ classAttribute: "material" }).then(res => {
                this.treeData = res.data
                this.$nextTick(() => {
                    this.treeLoading = false
                    this.initData()
                })
            }).catch(() => {
                this.treeLoading = false
                this.listLoading = false
            })
        },
        downloadImage(row) {
            // // 创建一个a标签
            // const link = document.createElement('a');
            // // 设置a标签的href属性为图片的URL
            // link.href = row.drawingPath;
            // // 设置a标签的download属性为图片的文件名
            // link.download = '图纸文件';
            // // 模拟点击a标签进行下载
            // link.click();
            if (!row.path) return
            getDownloadUrl('document', row.path).then(res => {
                this.jnpf.downloadFile(res.data.url, row.filename)
            })
        },
        sortChange({ prop, order }) {
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.tableQuery.orderItems[0].asc = order === "ascending"
            this.tableQuery.orderItems[0].column = order === null ? "" : newProp
            this.initData()


        },
        // 关闭新建、编辑页面
        closeForm(isRefresh) {
            this.depFormVisible = false
            if (isRefresh) {
                this.initData()
            }
        },
        initData() {
            getworkingbimDrawingData(this.tableQuery).then(res => {
                this.tableDataList = res.data.records
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        search() {
            this.tableQuery.pageNum = 1
            this.initData()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.tableQuery = {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
                drawingNo: "",
                name: "",
                code: ""
            }
            this.search()
        },
        addSupplier(id, type) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, type)
            })
        },
        addOrUpdateHandle(id, type) {
            this.depFormVisible = true
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.depForm.init(id, type)
                })
                // }, 600);
            }
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                getworkingbimDrawingDetail(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                    })
                })
            }).catch(() => { })
        },
    }
}
</script>
<style scoped>
::v-deep .el-tabs__header {
    margin-bottom: 5px;
    padding: 0 10px;
}

.JNPF-common-search-box {
    padding: 8px 0 0 0;
    margin-left: 0 !important;
    margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 8px !important;
}

.pagination-container {
    background-color: #f5f7fa;
    margin-top: 0px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
    padding: 0;
}

::v-deep.el-tree-node__content {
    height: 30px;
    line-height: 30px;
}

.JNPF-common-el-tree {
    margin: 5px 0;
}

.el-tabs__nav-scroll {
    padding-left: 0;
}
</style>
  