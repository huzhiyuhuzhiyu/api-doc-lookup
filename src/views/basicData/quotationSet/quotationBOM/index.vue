<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <!-- <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="query.code" placeholder="请输入BOM编码" clearable />
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="query.name" placeholder="请输入BOM名称" clearable />
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="query.customerProductNo" placeholder="请输入客户物料号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="query.customerDrawingNumber" placeholder="请输入客户图号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="query.materialCode" placeholder="请输入产品图号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select v-model="query.convertBomFlag" placeholder="请选择是否转生产BOM">
                              <el-option v-for="(item, index) in convertBomFlagList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                                {{ $t('common.reset') }}
                            </el-button>
                        </el-form-item>
                    </el-col>
                    <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                        icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button> -->
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <topOpts @add="addSupplier('', 'add')">
                        <el-button size="mini" type="primary" @click="handleBatch">批量转生产BOM</el-button>
                    </topOpts>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange"
                    custom-column fixedNO hasC @selection-change="currentChange" >
                    <el-table-column prop="customerProductNo" label="客户物料号" sortable="custom" min-width="140">
                        <template slot-scope="scope">
                            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">
                                {{ scope.row.customerProductNo }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customerDrawingNumber" label="客户图号" min-width="500" sortable="custom" />
                    <el-table-column prop="materialCode" label="产品图号" min-width="500" sortable="custom" />
                    <el-table-column prop="convertBomFlag" label="转生产BOM标志" min-width="160">
                      <template slot-scope="scope">
                        <div v-if="scope.row.convertBomFlag == '1'">已转</div>
                        <div v-else-if="scope.row.convertBomFlag == '0'">未转</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="convertBomTime" label="转生产BOM时间" min-width="230"/>
                    <el-table-column prop="createByName" label="创建人" width="120" />
                    <el-table-column prop="createTime" label="创建时间" min-width="230" sortable="custom" />
                    <el-table-column prop="remark" label="备注" min-width="200" />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
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
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="query.pageNum" :background="background" :limit.sync="query.pageSize"
                    @pagination="initData" />
            </div>
        </div>

        <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
            lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
            <el-row :gutter="20">
                <el-form ref="diaForm" :model="query" label-position="top">
                    <!-- <el-col :span="12">
                        <el-form-item label="BOM编码">
                            <el-input v-model.trim="query.code" placeholder="请输入BOM编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="BOM名称">
                            <el-input v-model.trim="query.name" placeholder="请输入BOM名称" clearable />
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="客户物料号">
                            <el-input v-model.trim="query.customerProductNo" placeholder="请输入客户物料号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户图号">
                            <el-input v-model.trim="query.customerDrawingNumber" placeholder="请输入客户图号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品图号">
                            <el-input v-model.trim="query.materialCode" placeholder="请输入产品图号" clearable />
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
                <el-button type="primary" @click="search()">搜 索</el-button>
            </span>
        </el-dialog>

        <!-- 批量转生产BOM -->
        <el-dialog title="提示" :close-on-click-modal="false" append-to-body :visible.sync="analyseDialog"
            class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
            <el-row :gutter="15" style="margin-top: 18px;">
                <el-form ref="elForm" :model="dataForm" label-position="top">
                    <el-row :gutter="30">
                        <el-col :sm="24">
                            <el-form-item prop="flag">
                                <el-checkbox v-model="dataForm.flag">遇产品已有BOM直接覆盖</el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="analyseDialog = false">{{ $t('common.cancelButton') }}</el-button>
                <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
                    {{ $t('common.submitButton') }}
                </el-button>
            </span>
        </el-dialog>

        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    </div>
</template>
  
<script>
import { getQuotationBOMList, deleteQuotationBOMData, batchBomTransfer } from '@/api/salesManagement/index'
import DepForm from './depForm'
import moment from 'moment'
export default {
    name: 'quality',
    components: { DepForm, },
    data() {
        return {
            convertBomFlagList:[
              {label:'未转',value:0},
              {label:'已转',value:1},
              {label:'全部',value:''}
            ],
            depFormVisible: false,
            background: true,//分页器背景颜色
            visible: false,
            tableDataList: [],
            query: {
              orderItems: [{
                  "asc": false,
                  "column": ""
              }, {
                  "asc": false,
                  "column": "create_time"
              }],
              pageNum: 1,
              pageSize: 20,
              materialCode:"",
              customerProductNo:"",
              customerDrawingNumber:"",
              convertBomFlag:0,
            },
            listLoading: false,
            total: 0,
            formVisible: false,
            analyseDialog: false,
            selectedData: [],
            dataForm: {
                flag: false
            },
            btnLoading: false
        }
    },
    created() {
        this.initData()
        window.addEventListener('resize', this.handleResize);
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            this.$nextTick(() => {
                this.$refs.tableForm.doLayout(); // 解决表格错位
            });
            // 处理窗口大小变化的逻辑
        },
        sortChange({ prop, order }) {
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.query.orderItems[0].asc = order !== 'descending'
            this.query.orderItems[0].column = order === null ? "" : newProp

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
            this.listLoading = true
            this.visible = false
            getQuotationBOMList(this.query).then(res => {
                this.tableDataList = res.data.records
                this.listLoading = false
                this.total = res.data.total
            }).catch(() => {
                this.listLoading = false
            })
        },
        search() {
            this.query.pageNum = 1
            this.initData()
        },
        reset() {
            this.$refs['tableForm'].$refs.JNPFTable.clearSort()

            this.query = {
              orderItems: [{
                  "asc": false,
                  "column": ""
              }, {
                  "asc": false,
                  "column": "create_time"
              }],
              pageNum: 1,
              pageSize: 20,
              materialCode:"",
              customerProductNo:"",
              customerDrawingNumber:"",
              convertBomFlag:0,
            }
            this.search()
        },
        addSupplier(id, type) {

            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, type)
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
                deleteQuotationBOMData(id).then(res => {
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                        onClose: () => {
                            this.initData()
                        }
                    })
                })
            }).catch(() => { })
        },
        handleUserRelation(id, btnType) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, btnType)
            })
        },
        currentChange(data) {
            this.selectedData = data
        },
        async handleBatch() {
            this.dataForm.flag = false
            this.btnLoading = false
            if (!this.selectedData.length) return this.$message.error('请至少选择一条BOM数据')
            let arr=this.selectedData.filter(line => !line.productsId)
            let str=""
            if(arr.length){
                arr.forEach(item => {
                    str+=item.name+'、'
                });
            str=str.substring(0,str.length-1)
             this.$message.error("客户物料号"+str+"主产品不存在")   
            return 
            }
            this.analyseDialog = true
        },
        dataFormSubmit() {
            this.btnLoading = true
            const ids = this.selectedData.map(line => line.id)
            const needOverride = this.dataForm.flag
            batchBomTransfer({ ids, needOverride }).then(res => {
                this.$message.success('操作成功')
                this.selectedData = []
                this.$refs.tableForm.$refs.JNPFTable.clearSelection()
                this.analyseDialog = false
                this.search()
            }).catch(err => {
                this.btnLoading = false
            })
        }
    }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
.custom-row {}
</style>