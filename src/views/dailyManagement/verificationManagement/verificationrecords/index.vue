<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="orderForm.verificationAgency" placeholder="请输入检定机构" clearable
                                @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="orderForm.actualMaintenanceIdText" placeholder="请输入实际执行人" clearable
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
                    <!-- <el-button style="float: right;margin-right: 10px;" size="mini" type="primary"
                      icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button> -->
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <el-button size="mini" type="primary" icon="el-icon-plus"
                        @click="addSupplier('', 'add')">送检</el-button>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>

                <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" fixedNO
                    custom-column style="padding-bottom: 50px;">
                    <!-- <el-table-column prop="equipmentIdCode" label="设备编码" width="200" /> -->
                    <el-table-column prop="verificationAgency" label="检定机构" width="200" sortable="custom" />
                    <el-table-column prop="departmentIdText" label="计划执行部门" width="150" />
                    <el-table-column prop="maintainerIdText" label="计划执行人" width="120"></el-table-column>
                    <el-table-column prop="planMaintenanceDate" label="计划检定日期" width="180"
                        sortable="custom"></el-table-column>
                    <el-table-column prop="actualDepartmentIdText" label="实际执行部门" width="150" />
                    <el-table-column prop="actualMaintenanceIdText" label="实际执行人" width="120"></el-table-column>
                    <el-table-column prop="actualMaintenanceDate" label="实际检定日期" width="180"
                        sortable="custom"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                    <el-table-column label="操作" width="180" fixed="right">
                        <!-- <template slot-scope="scope">
                          <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
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
                      </template> -->
                        <template slot-scope="scope">
                            <!-- <el-button type="text" @click="addSupplier(scope.row.id, 'edit')" size="mini">送检</el-button> -->
                            <el-button type="text" @click="recover(scope.row.id, 'recover')" size="mini" :disabled="scope.row.recoverFlag == '0' ? false : true">收回</el-button>
                            <el-button type="text" @click="handleDel(scope.row.id,)" size="mini" :disabled="scope.row.recoverFlag == '1' ? false : true"
                                class="JNPF-table-delBtn">删除</el-button>
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
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                    @pagination="initData" />
            </div>
        </div>
        <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    </div>
</template>
<script>
import { VerificationrecordsList, deleteVerificationrecords, updateVerificationrecords } from '@/api/dailyManagement/Maintenance'
import Form from './Form'
export default {
    name: 'verificationrecords',
    components: { Form, },
    data() {
        return {
            tableData: [],
            listLoading: false,
            orderForm: {
                verificationAgency: '',
                actualMaintenanceIdText: '',
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time" /* 使用倒序日期作为默认排序 */
                }],
            },
            total: 0,
            formVisible: false,
        }
    },
    created() {
        this.initData()
    },
    methods: {
        //收回
        recover(id) {
            this.$confirm('请确定检定工具是否收回！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                updateVerificationrecords(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "收回成功",
                        duration: 1500,
                    })
                })
            }).catch(() => { })
        },
        sortChange({ prop, order }) {
            let newProp
            if (prop === 'equipmentIdName') {
                newProp = prop
            } else {
                newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            }
            this.orderForm.orderItems[0].asc = order !== "descending"
            this.orderForm.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },
        // 关闭新建编辑页面
        closeForm(isRefresh) {
            this.formVisible = false
            if (isRefresh) {
                this.initData()
            }
        },
        initData() {
            this.listLoading = true
            VerificationrecordsList(this.orderForm).then(res => {
                console.log("res++", res);
                this.tableData = res.data.records
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading = false
            })
        },

        search() {
            Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
                let item = this.orderForm[key]
                this.orderForm[key] = typeof item === 'string' ? item.trim() : item
            })
            this.orderForm.pageNum = 1 // 重置页码
            this.initData()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.orderForm = {
                verificationAgency: '',
                actualMaintenanceIdText: '',
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time" /* 使用倒序日期作为默认排序 */
                }],
            }
            this.search()
        },

        addSupplier(id, btntype) {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.Form.init(id, btntype)
            })
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                deleteVerificationrecords(id).then(res => {
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
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.Form.init(id, btnType)
            })
        }
    }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />

