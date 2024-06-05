<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-left">
            <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
                <div v-for="item in treeDatas" :key="item.name" class="left-foundation"
                    :class="item.typeCode == actionname ? 'active' : ''" @click="activefoundation(item.typeCode)">{{
                        item.name }}
                </div>
            </el-scrollbar>
        </div>
        <div class="JNPF-common-layout-center JNPF-flex-main" v-if="actionname == 'faultType'" key="1">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.code" placeholder="请输入编码" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.name" placeholder="请输入名称" clearable
                                @keyup.enter.native="search()" />
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
                    <topOpts @add="addSupplier(actionname, 'add')" />
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <el-table ref="dataTable" :data="tableDataList" v-bind="tableDataList" hasNO fixedNO v-loading="listLoading"
                    :header-cell-style="{ background: '#f5f7fa' }" height="100%" class="common-table-list"
                    @sort-change="sortChange">
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' show-overflow-tooltip />
                    <el-table-column prop="code" label="编码" width="200">
                        <template slot-scope="scope">
                            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, actionname, 'look')">{{
                                scope.row.code
                            }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" width="200" sortable="custom" show-overflow-tooltip />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" width="110" show-overflow-tooltip />
                    <el-table-column prop="remark" label="备注" min-width="300" show-overflow-tooltip />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, actionname, 'edit')"
                                @del="handleDel(scope.row.id, scope.row.parentId)">
                                <el-dropdown hide-on-click>
                                    <span class="el-dropdown-link">
                                        <el-button type="text" size="mini">
                                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            @click.native="handleUserRelation(scope.row.id, actionname, 'look')">
                                            查看详情
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
                    :limit.sync="tableQuery.pageSize" @pagination="initData" />
            </div>
        </div>
        <div class="JNPF-common-layout-center JNPF-flex-main" v-if="actionname == 'faultLocation'" key="2">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.code" placeholder="请输入编码" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.name" placeholder="请输入名称" clearable
                                @keyup.enter.native="search()" />
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
                    <topOpts @add="addSupplier(actionname, 'add')" />
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <!-- <JNPF-table v-loading="listLoading" :data="tableDataList" row-key="id" v-if="refreshTable" :fixedNO="true"
                    @sort-change="sortChange" custom-column> -->
                <el-table ref="dataTable" :data="tableDataList" v-bind="tableDataList" hasNO fixedNO v-loading="listLoading"
                    :header-cell-style="{ background: '#f5f7fa' }" height="100%" class="common-table-list"
                    @sort-change="sortChange">
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                    <el-table-column prop="code" label="编码" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, actionname, 'look')">{{
                                scope.row.code
                            }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" width="200" sortable="custom" show-overflow-tooltip />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" width="110" show-overflow-tooltip />
                    <el-table-column prop="remark" label="备注" width="auto" show-overflow-tooltip />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, actionname, 'edit')"
                                @del="handleDel(scope.row.id, scope.row.parentId)">
                                <el-dropdown hide-on-click>
                                    <span class="el-dropdown-link">
                                        <el-button type="text" size="mini">
                                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            @click.native="handleUserRelation(scope.row.id, actionname, 'look')">
                                            查看详情
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-empty description="暂无数据" :image-size="120" v-else></el-empty> -->
                <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
                    :limit.sync="tableQuery.pageSize" @pagination="initData" />
            </div>
        </div>
        <div class="JNPF-common-layout-center JNPF-flex-main" v-if="actionname == 'maintenanceItem'" key="3">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.code" placeholder="请输入编码" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.name" placeholder="请输入名称" clearable
                                @keyup.enter.native="search()" />
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
                    <topOpts @add="addSupplier(actionname, 'add')" />
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <!-- <JNPF-table v-loading="listLoading" :data="tableDataList" row-key="id" v-if="refreshTable" :fixedNO="true"
                    @sort-change="sortChange" custom-column> -->
                <el-table ref="dataTable" :data="tableDataList" v-bind="tableDataList" hasNO fixedNO v-loading="listLoading"
                    :header-cell-style="{ background: '#f5f7fa' }" height="100%" class="common-table-list"
                    @sort-change="sortChange">
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                    <el-table-column prop="code" label="编码" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, actionname, 'look')">{{
                                scope.row.code
                            }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" width="200" sortable="custom" show-overflow-tooltip />
                    <el-table-column prop="itemRequirements" label="要求" width="320" show-overflow-tooltip />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" width="110" show-overflow-tooltip />
                    <el-table-column prop="remark" label="备注" width="auto" show-overflow-tooltip />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, actionname, 'edit')"
                                @del="handleDel(scope.row.id, scope.row.parentId)">
                                <el-dropdown hide-on-click>
                                    <span class="el-dropdown-link">
                                        <el-button type="text" size="mini">
                                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            @click.native="handleUserRelation(scope.row.id, actionname, 'look')">
                                            查看详情
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
                    :limit.sync="tableQuery.pageSize" @pagination="initData" />
            </div>
        </div>
        <div class="JNPF-common-layout-center JNPF-flex-main" v-if="actionname == 'inspectionItem'" key="4">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.code" placeholder="请输入编码" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="tableQuery.name" placeholder="请输入名称" clearable
                                @keyup.enter.native="search()" />
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
                    <topOpts @add="addSupplier(actionname, 'add')" />
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <!-- <JNPF-table v-loading="listLoading" :data="tableDataList" row-key="id" v-if="refreshTable" :fixedNO="true"
                    @sort-change="sortChange" custom-column> -->
                <el-table ref="dataTable" :data="tableDataList" v-bind="tableDataList" hasNO fixedNO v-loading="listLoading"
                    :header-cell-style="{ background: '#f5f7fa' }" height="100%" class="common-table-list"
                    @sort-change="sortChange">
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                    <el-table-column prop="code" label="编码" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, actionname, 'look')">{{
                                scope.row.code
                            }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" width="200" sortable="custom" show-overflow-tooltip />
                    <el-table-column prop="itemRequirements" label="要求" width="320" show-overflow-tooltip />
                    <el-table-column prop="inspectionMethod" label="点检方法" width="320" show-overflow-tooltip />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" width="110" show-overflow-tooltip />
                    <el-table-column prop="remark" label="备注" width="auto" show-overflow-tooltip />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, actionname, 'edit')"
                                @del="handleDel(scope.row.id, scope.row.parentId)">
                                <el-dropdown hide-on-click>
                                    <span class="el-dropdown-link">
                                        <el-button type="text" size="mini">
                                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            @click.native="handleUserRelation(scope.row.id, actionname, 'look')">
                                            查看详情
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
                    :limit.sync="tableQuery.pageSize" @pagination="initData" />
            </div>
        </div>
        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    </div>
</template>
  
<script>
import { parametersShelveslist, deleteparametersShelves } from '@/api/basicData/index'
import DepForm from './depForm'
export default {
    name: 'BasicParameters',
    components: { DepForm, },
    data() {
        return {
            depFormVisible: false,
            background: true,//分页器背景颜色
            // visible: false,
            treeDatas: [
                { name: '故障类型', typeCode: 'faultType' },
                { name: '故障部位', typeCode: 'faultLocation' },
                { name: '保养项目', typeCode: 'maintenanceItem' },
                { name: '点检项目', typeCode: 'inspectionItem' }
            ],
            actionname: 'faultType',
            tableDataList: [],
            treeLoading: false,
            listLoading: false,
            // userRelationListVisible: false,
            // organizeIdTree: [],
            treeQuery: {
                code: "",
                name: ""
            },
            tableQuery: {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "createTime"
                }],
                code: "",
                name: "",
                typeCode: 'faultType'
            },
            // gradeList: [],
            total: 0,
            // diagramVisible: false,
            // formVisible: false,
            // expands: true,
            expandsTable: true,
            // refreshTree: true,
            refreshTable: true,
        }
    },
    created() {
        // this.getWarehouseList(true)
        this.initData()
    },
    methods: {
        activefoundation(typeCode) {
            this.tableQuery = {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "createTime"
                }],
                code: "",
                name: "",
                typeCode: typeCode
            }
            this.actionname = typeCode
            this.tableQuery.typeCode = typeCode
            this.$nextTick(() => {
                this.initData()
            })
        },
        sortChange({ prop, order }) {

            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.tableQuery.orderItems[0].asc = order !== 'descending'
            this.tableQuery.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },
        // 关闭新建、编辑页面
        closeForm(isRefresh) {
            this.depFormVisible = false
            if (isRefresh) {
                // this.getWarehouseList(true)
                this.initData()
            }
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // getWarehouseList(isInit) {
        //     this.treeLoading = true
        //     getWarehouseList(this.treeQuery).then(res => {
        //         console.log("树形结构", res);
        //         this.treeData = res.data
        //         this.$nextTick(() => {
        //             this.treeLoading = false
        //             if (isInit) this.initData()
        //         })
        //     }).catch(() => {
        //         this.treeLoading = false
        //     })
        // },
        initData() {
            this.listLoading = true
            parametersShelveslist(this.tableQuery).then(res => {
                console.log("故障类型表格", res);
                this.tableDataList = res.data.records
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        // 树形列表index层级，实现方法（可复制直接调用）
        setTableIndex(arr, index) {
            console.log("arr", arr, index);
            arr.forEach((item, key) => {
                item.index = key + 1;
                if (index) {
                    item.index = index + 1;
                }
                if (item.childrenList.length > 0) {
                    this.setTableIndex(item.childrenList, item.index);
                }
            });
        },
        search() {
            Object.keys(this.tableQuery).forEach(key => { // 清除搜索条件两端空格
                let item = this.tableQuery[key]
                this.tableQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.tableQuery.pageNum = 1 // 重置页码
            this.initData()
        },
        reset() {
            this.$refs.dataTable.clearSort() // 清除排序箭头高亮
            this.tableQuery = {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "createTime"
                }],
                code: "",
                name: "",
                typeCode: this.actionname
            }
            // this.getWarehouseList(true)
            this.search()
        },

        addSupplier(actionname, type) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init('', actionname, type)
            })
        },
        addOrUpdateHandle(id, actionname, btntype) {
            this.depFormVisible = true
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.depForm.init(id, actionname, btntype)
                })
                // }, 600);
            }
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                deleteparametersShelves(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                    })
                })
            }).catch(() => { })
        },
        handleUserRelation(id, parentId, btnType) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, parentId, btnType)
            })
        }
    }
}
</script>
<style scoped>
/* ::v-deep .el-table-title{
    background: red !important;
} */
.common-table-list {
    border: none !important;
    border-top: 1px solid #EBEEF5 !important;
}

::v-deep .el-tabs__header {
    margin-bottom: 5px;
    padding: 0 10px;
}

.JNPF-common-el-tree-scrollbar {
    padding: 20px 0px;
}

.left-foundation {
    text-align: center;
    line-height: 40px;
    /* border-radius: 5px; */
    cursor: pointer;
    margin-bottom: 5px;
    font-size: 16px;
}

.left-foundation:hover {
    background-color: #1890ff;
    opacity: 0.9;
}

.JNPF-common-layout-left {
    width: 180px;
}

.JNPF-common-search-box {
    padding: 8px 0 0 0;
    margin-left: 0 !important;
    margin-bottom: 5px;
}

.active {
    background-color: #1890ff;
    color: #fff;
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
}</style>