<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="query.formulaNumber" placeholder="请输入公式编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="query.formulaName" placeholder="请输入公式名称" clearable />
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
                    <topOpts @add="addSupplier('add')" />
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange"
                    custom-column >
                    <el-table-column prop="formulaNumber" label="公式编码" sortable="custom">
                        <template slot-scope="scope">

                            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                scope.row.formulaNumber
                            }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="formulaName" label="公式名称" sortable="custom" />
                    <el-table-column prop="remark" label="备注" />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" width="120" />
                    <el-table-column prop="state" label="公式状态" width="120" sortable="custom" align="center" fixed="right">
                        <template slot-scope="{row}">
                          <el-tag type="success" v-if="row.state == 'enable'">启用</el-tag>
                          <el-tag type="danger" v-else-if="row.state == 'disabled'">禁用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                              @del="handleDel(scope.row.id,)">
                              <el-dropdown hide-on-click>
                                <span class="el-dropdown-link">
                                 <el-button type="text" size="mini">
                                  {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                 </el-button>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                                    查看详情
                                  </el-dropdown-item>
                                </el-dropdown-menu>
                              </el-dropdown>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="query.pageNum" :background="background"
                    :limit.sync="query.pageSize" @pagination="initData" />
            </div>
        </div>

        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    </div>
</template>
  
<script>
import { deleteFormulaData, getFormulaList } from '@/api/basicData/index'
import DepForm from './depForm'
export default {
    name: 'quality',
    components: { DepForm },
    data() {
        return {
            depFormVisible: false,
            background: true,//分页器背景颜色
            visible: false,
            tableDataList: [],
            query: {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    "asc": false,
                    "column": ""
                }, {
                    "asc": false,
                    "column": "create_time"
                }],
                formulaNumber: "",
                formulaName: "",
            },
            listLoading: false,
            total: 0,
            formVisible: false,
        }
    },
    created() {
        this.initData()
    },
    methods: {
        sortChange({ prop, order }) {
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.query.orderItems[0].asc = order !== 'descending'
            this.query.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },
        // 关闭新建、编辑页面
        closeForm(isRefresh) {
            this.formVisible = false
            if (isRefresh) {
                this.initData()
            }
        },
        initData() {

            getFormulaList(this.query).then(res => {
                console.log("表格", res);
                this.tableDataList = res.data.records
                this.listLoading = false
                this.total = res.data.total

            }).catch(() => {
                this.listLoading = false
            })
        },
        search() {
            this.query.pageNum=1
            this.initData()
        },
        reset() {
            this.$refs['tableForm'].$refs.JNPFTable.clearSort()

            this.query = {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    "asc": false,
                    "column": ""
                }, {
                    "asc": false,
                    "column": "create_time"
                }],
                customerMaterialCode: "",
                materialCode: "",
                dataType: '',
            }
            this.search()
        },
        addSupplier(type) {

            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init("", type)
            })
        },
        addOrUpdateHandle(id, btnType) {
            this.depFormVisible = true
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.depForm.init(id, btnType)
                })
                // }, 600);
            }


        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                deleteFormulaData(id).then(res => {
                    this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
                })
            }).catch(() => { })
        },
        handleUserRelation(id, btnType) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, btnType)
            })
        }
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
  