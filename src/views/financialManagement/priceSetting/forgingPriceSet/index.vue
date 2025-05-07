<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select placeholder="请选择产品类型" v-model="tableQuery.productType" clearable>
                                <el-option v-for="(item, index) in productTypeList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
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
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" :data="tableDataList" ref="dataTable" @sort-change="sortChange"
                    custom-column customKey="JNPFTableKey_300777">
                    <el-table-column prop="productType" label="产品类型" sortable="custom" width="120" >
                        <template slot-scope="scope">
                            <div>{{ scope.row.productType=='pt008'?'接头':'套筒' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="forgingRange" label="重量区间" width="350">
                         
                    </el-table-column>
                    <el-table-column prop="price" label="单价(元)" />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人"></el-table-column>
                    <el-table-column prop="updateTime" label="修改时间" width="180" />
                    <el-table-column prop="updateByName" label="修改人"></el-table-column>
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)" />
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
                    :limit.sync="tableQuery.pageSize" @pagination="initData" />
            </div>
        </div>


        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    </div>
</template>
  
<script>
import { delForgingPrice, getForgingPriceList, } from '@/api/financialManagement/index'
import DepForm from './depForm'
export default {
    name: 'quality',
    components: { DepForm, },
    data() {
        return {
            productTypeList:[
                {
                    label:" 套筒",
                    value:"pt004",
                },
                {
                    label:"接头",
                    value:"pt008",
                }
            ],
            depFormVisible: false,
            background: true,//分页器背景颜色
            visible: false,
            tableDataList: [],
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
                productType: "",
               
            },
            createTimeArr: [],
            total: 0,
            formVisible: false,
            filterText: ''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.treeBox.filter(val)
        }
    },
    created() {
        this.initData()
        // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
    },
    methods: {
        sortChange({ prop, order }) {
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.tableQuery.orderItems[0].asc = order === "ascending"
            this.tableQuery.orderItems[0].column = order === null ? "" : newProp
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
            getForgingPriceList(this.tableQuery).then(res => {
                // 
                console.log("电镀价格", res);
                this.tableDataList = res.data.records
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        search() {
            this.tableQuery.pageNum = 1
            if (this.createTimeArr && this.createTimeArr.length > 0) {
                this.tableQuery.startTime = this.createTimeArr[0]
                this.tableQuery.endTime = this.createTimeArr[1]
            } else {
                this.tableQuery.startTime = ""
                this.tableQuery.endTime = ""
            }
            this.initData()
        },
        reset() {
            this.createTimeArr = []
            this.$refs['dataTable'].$refs.JNPFTable.clearSort()
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
                code: "",
                name: "",
                startTime: "",
                endTime: "",
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
                delForgingPrice(id).then(res => {
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
  