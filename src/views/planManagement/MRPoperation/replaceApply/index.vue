<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="listQuery.applyNo" placeholder="请输入申请单号" clearable @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="listQuery.productDrawingNo" placeholder="请输入品名规格" clearable
                                      @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <div class="JNPF-common-head-left">

                    </div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                     @click="columnSetFun()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>

                <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange"
                            custom-column>
                    <el-table-column prop="orderNo" label="申请单号" min-width="190" sortable="custom">
                        <template slot-scope="scope">
                            <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                                {{ scope.row.orderNo }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="planNo" label="计划单号" min-width="190" />
                    <el-table-column prop="productCode" label="产品编码" min-width="140" />
                    <el-table-column prop="productName" label="产品名称" min-width="140" />
                    <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" />
                    <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />

                    <el-table-column prop="productSource" label="产品来源" align="center" min-width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.productSource === 'out'">外协</div>
                            <div v-else-if="scope.row.productSource === 'purchase'">采购</div>
                            <div v-else>生产</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" width="120" />
                    <el-table-column prop="remark" min-width="140" label="备注" />
                    <el-table-column prop="approvalStatus" label="审批状态" align="center" sortable="custom" width="120"
                                     fixed="right">
                        <template slot-scope="scope">
                            <div v-if="scope.row.approvalStatus === 'ing'"><el-tag>审批中</el-tag> </div>
                            <div v-else-if="scope.row.approvalStatus === 'ok'"><el-tag type="success">审批通过</el-tag></div>
                            <div v-else-if="scope.row.approvalStatus === 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
                            <div v-else-if="scope.row.approvalStatus === 'withdrawn' && scope.row.documentStatus === 'submit'">
                                <el-tag type="warning">审批撤回</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="90" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id)" :editDisabled="!!scope.row.outboundId" :hasEdit="false"
                                       :hasDel="false">
                                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                                            @click.native="addOrUpdateHandle(scope.row.id, 'anew')">
                                            重新提交
                                        </el-dropdown-item>
                                        <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                                                          @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                                            审批撤回
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                                            查看详情
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                            @pagination="initData" />
            </div>
        </div>
        <ReplaceRulesForm v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    </div>

</template>
<script>
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import ReplaceRulesForm from '@/views/planManagement/MRPoperation/pendClculationPlan/ReplaceRulesForm.vue'
import { getMrpReplaceApplyList } from '@/api/calculationList/calculationList'
export default {
    components: { ReplaceRulesForm },
    name:'replaceApply',
    data() {
        return {
            activeName: "",
            options: [],
            listQuery: {},
            initListQuery: {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
            },
            tableData: [],
            btnLoading: false,
            listLoading: false,
            formVisible: false,
            total: 0,
        }
    },
    created() {
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
        this.initData()
    },
    methods: {
        columnSetFun() {
            this.$refs.dataTable.showDrawer()
        },
        closeForm(isRefresh) {
            this.formVisible = false
            if (isRefresh) {
                this.initData()
            }
        },
        initData(planData) {
            const loadkey = +new Date()
            this.loadkey = loadkey
            this.listLoading = true
            getMrpReplaceApplyList(this.listQuery).then((res) => {
                if (this.loadkey !== loadkey) return
                this.tableData = res.data.records
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading = false
            })
            if (planData) {
                this.$nextTick(() => {
                    this.addOrUpdateHandle(planData, 'add')
                })
            }
        },
        addOrUpdateHandle(idOrPlanData, btnType = 'add') {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.Form.init(idOrPlanData, btnType)
            })
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                batchDeleteReplaceRules([id]).then((res) => {
                    this.$message.success('删除成功')
                    this.initData()
                })
            }).catch(() => { })
        },
        sortChange({ prop, order }) {
            let newProp;
            if (prop === 'purchaseOrderNo' || prop === 'productName' || prop === 'productDrawingNo') { newProp = prop }
            else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
            this.listQuery.orderItems[0].asc = order !== 'descending'
            this.listQuery.orderItems[0].column = order === null ? "" : newProp

            this.initData()
        },
        search() {
            this.listQuery.pageNum = 1
            this.initData()
        },
        reset() {
            this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
            this.search()
        },
        withdrawnHandle(formId) {
            let _data = {
                formId
            }
            this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                withdrawn(_data).then(res => {
                    this.$message({
                        type: 'success',
                        message: "撤回成功",
                        duration: 1500,
                        onClose: () => {
                            this.initData()
                        }
                    })
                })
            }).catch(() => { })
        },
    }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
