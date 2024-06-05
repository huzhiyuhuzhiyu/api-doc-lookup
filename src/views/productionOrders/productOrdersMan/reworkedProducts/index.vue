<!-- 成品订单返工管理 -->
<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="orderForm.orderNo" @keydown.enter.native="dataFormSubmit()"
                                placeholder="请输入不良处理单号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="orderForm.productDrawingNo" @keydown.enter.native="dataFormSubmit()"
                                placeholder="请输入产品图号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select v-model="orderForm.repairFlag" placeholder="请选择是否返修">
                                <el-option v-for="(item, index) in repairList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="dataFormSubmit()">
                                {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset')
                                }}
                            </el-button>
                        </el-form-item>
                    </el-col>
                    <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
                        @click="moreQueries()">更多查询</el-button>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">


                <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange"
                    custom-column :fixedNO="true">
                    <el-table-column prop="orderNo" label="不良处理单号" min-width="200">

                    </el-table-column>
                    <el-table-column prop="productCode" label="产品编码" min-width="120" sortable="custom">
                    </el-table-column>
                    <el-table-column prop="productName" label="产品名称" min-width="120" sortable="custom"
                        :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="productDrawingNo" label="产品图号" min-width="220"
                        :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="treatmentResults" label="处理结果" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.treatmentResults == 'qualified'">合格 </div>
                            <div v-if="scope.row.treatmentResults == 'unqualified'">不合格 </div>
                            <div v-if="scope.row.treatmentResults == 'concessive_acceptance'">让步接收 </div>
                            <div v-if="scope.row.treatmentResults == 'discard'">报废 </div>
                            <div v-if="scope.row.treatmentResults == 'select'">挑选 </div>
                            <div v-if="scope.row.treatmentResults == 'repair'">返工返修 </div>
                            <div v-if="scope.row.treatmentResults == 'discard_repair'">报废和返修 </div>

                        </template>
                    </el-table-column>
                    <el-table-column prop="mainUnit" label="单位" width="120"
                        :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="repairQuantity" label="返修数量" width="120" sortable="custom"
                        :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="repairFlag" label="是否返修" width="120">
                        <template slot-scope="scope">
                            <div>{{ scope.row.repairFlag ? "是" : "否" }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="处理说明" width="120"
                        :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"
                        :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>

                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" :disabled="scope.row.repairFlag"
                                @click="updateHandle(scope.row)">返工</el-button>

                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                    @pagination="initData" />
            </div>
        </div>

        <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />

        <!-- 更多查询弹框 -->
        <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
            lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
            <el-row :gutter="20">

                <el-form ref="diaForm" :model="orderForm" label-width="120px" label-position="top">
                    <el-col :span="12">
                        <el-form-item label="不良处理号">
                            <el-input v-model="orderForm.orderNo" placeholder="请输入订单号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品编码">
                            <el-input v-model="orderForm.productCode" placeholder="请输入产品编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品名称">
                            <el-input v-model="orderForm.productName" placeholder="请输入产品名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品图号">
                            <el-input v-model="orderForm.productDrawingNo" placeholder="请输入产品图号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否返修">
                            <el-select v-model="orderForm.repairFlag" placeholder="请选择是否返修">
                                <el-option v-for="(item, index) in repairList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="创建时间">
                            <el-date-picker v-model="orderForm.createTimeArr" type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="创建开始时间"
                                end-placeholder="创建结束时间" :picker-options="global.timePickerOptions"
                                :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                </el-form>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
                <el-button type="primary" @click="dataFormSubmit()">
                    搜索</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import Form from './Form'
import { getUnqualifiedList } from '@/api/productOrdes/finishedProductOrders'
import { getProductionResource } from '@/api/basicData/productionResourceSetting'
export default {
    name: 'carrierProfile',
    components: { Form },
    data() {
        return {
            repairList: [
                { label: "是", value: 1, },
                { label: "否", value: 0, },
            ],
            orderForm: {
                orderNo: "",
                productCode: "",
                productName: "",
                productDrawingNo: "",
                repairFlag: 0,
                showRepair: true,
                pageNum: 1,
                pageSize: 20,
                orderItems: [
                    {
                        asc: false,
                        column: "",
                    },
                    {
                        asc: false,
                        column: "createTime",
                    },
                ],
                createTimeArr: [],
                endTime: "",
                startTime: "",
            },











            btnLoading: false,
            visible: false,
            title: "更多查询",

            tableData: [],
            listLoading: false,



            total: 0,
            formVisible: false,
            formVisibles: false,
            filterText: '',




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
        // 关闭新建编辑页面
        closeForm(isRefresh) {
            this.formVisible = false
            if (isRefresh) {
                this.keyword = ''
                this.initData()
            }
        },
        sortChange({ prop, order }) {
            console.log("prop", prop);
            let newProp;
            if (prop === 'productName' || prop === 'createTime' || prop === 'productCode') {
                newProp = prop
            } else {
                newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            }

            this.orderForm.orderItems[0].asc = order !== 'descending'
            this.orderForm.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },


        moreQueries() {
            this.visible = true
        },
        dataFormSubmit() {
            this.orderForm.pageNum = 1
            Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
                let item = this.orderForm[key]
                this.orderForm[key] = typeof item === 'string' ? item.trim() : item
            })

            if (this.orderForm.createTimeArr && this.orderForm.createTimeArr.length > 0) {
                this.orderForm.startTime = this.orderForm.createTimeArr[0]
                this.orderForm.endTime = this.orderForm.createTimeArr[1]
            } else {
                this.orderForm.startTime = ""
                this.orderForm.endTime = ""
            }
            this.initData()

        },

        initData() {
            this.listLoading = true

            getUnqualifiedList(this.orderForm).then(res => {
                console.log("res++", res);
                this.tableData = res.data.records
                this.total = res.data.total
                this.listLoading = false
                this.visible = false
            }).catch(() => {
                this.listLoading = false
            })

        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort()// 清除排序箭头高亮
            this.orderForm.createTimeArr = []
            this.orderForm = {
                orderNo: "",
                productCode: "",
                productName: "",
                productDrawingNo: "",
                repairFlag: 0,
                showRepair: true,
                pageNum: 1,
                pageSize: 20,
                orderItems: [
                    {
                        asc: false,
                        column: "",
                    },
                    {
                        asc: false,
                        column: "createTime",
                    },
                ],
                createTimeArr: [],
                endTime: "",
                startTime: "",
            }
            this.dataFormSubmit()
        },
        updateHandle(data) {
            if (data.routingId) {
                this.formVisible = true
                console.log(4444444);
                this.$nextTick(() => {
                    this.$refs.Form.init(data)
                })
            } else {
                let obj = {
                    productCode: data.productCode
                }
                getProductionResource(obj).then(res => {
                    console.log(res);
                    if (res.data.records.length) {
                        this.formVisible = true
                        data.routingId = res.data.records[0].routingId
                        data.routingName = res.data.records[0].routingName

                        this.$nextTick(() => {
                            this.$refs.Form.init(data)
                        })
                    } else {
                        return this.$message({
                            message: "返工产品没有工艺路线，请先配置工艺路线",
                            type: "error"
                        })
                    }
                })

            }



        },

    }
}
</script>
<style scoped>
.el-tab-pane {
    height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
    height: calc(100% - 40px);
}

.el-tabs {
    height: 100%;
}

.el-tabs__nav-scroll {
    padding-left: 10px;
}

.JNPF-common-head {
    padding: 10px;
}

.JNPF-common-search-box {
    padding-top: 5px;
    padding-bottom: 10px;
    margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 0px !important;
}

.pagination-container {
    background-color: #ebeef5;
    margin-top: 0px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.main {
    padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
    padding: 0 !important;
    padding-bottom: 10px !important;
    margin-bottom: 0;
    padding-left: 10px !important;
    background: #fff;
}

.el-button--small {
    padding: 1;
}

::v-deep .JNPF-common-page-header {
    padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
    padding-bottom: 0;
}


::v-deep.el-table__body-wrapper {
    height: auto !important;
}

.required {
    color: red;
    margin-right: 4px;
}
</style>
