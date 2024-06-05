<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="请购单列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.orderNo" placeholder="请输入请购单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="listQuery.documentStatus" placeholder="单据状态" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
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
              <!-- <div class="JNPF-common-head">
                <topOpts @add="addOrUpdateHandle('', 'add')"></topOpts>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div> -->

              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="dataTable"
                :data="tableDataList" @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="请购单号" min-width="180" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="applicationReason" label="申请理由" min-width="180" />



                <el-table-column prop="reasonRejection" label="驳回理由" align="left" min-width="180" />

                <el-table-column prop="approvalCompletionDate" label="审批完成时间" align="left" min-width="180"
                  sortable="custom" />

                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                <el-table-column prop="createByName" label="创建人" />
                <el-table-column prop="documentStatus" label="单据状态" align="center" sortable="custom" min-width="120"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                    <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>

                <el-table-column prop="approvalStatus" label="审批状态" align="center" sortable="custom" min-width="120"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing'"><el-tag>审批中</el-tag> </div>
                    <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'"><el-tag type="warning">审批撤回</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus !== 'draft'" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus !== 'draft'" @click="handleDel(scope.row.id)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                          @click.native="addOrUpdateHandle(scope.row.id, 'add')">
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
                  </template>
                </el-table-column>

              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入请购单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-date-picker v-model="linesQuery.startAndEndTime" type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%;"
                      start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间" clearable
                      :picker-options="global.timePickerOptions">
                    </el-date-picker>
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <!-- <div class="JNPF-common-head">
                <topOpts @add="addOrUpdateHandle('', 'add')"></topOpts>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div> -->

              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="linesTableData"
                :data="linesTableData" @sort-change="sortChange" :partentOrChild="'child'" custom-column>
                <el-table-column prop="orderNo" label="请购单号" min-width="180" fixed="left" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.procurementRequirementsId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="applicationReason" label="请购理由" min-width="180" />
                <el-table-column prop="productCode" label="产品编码" min-width="140" show-overflow-tooltip fixed="left" />
                <el-table-column prop="productName" label="产品名称" min-width="140" show-overflow-tooltip sortable="custom"
                  fixed="left" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="140" show-overflow-tooltip
                  sortable="custom" fixed="left" />

                <el-table-column prop="planQuantity" label="数量(主)" min-width="140" />
                <el-table-column prop="mainUnit" label="单位(主)" min-width="140" show-overflow-tooltip />
                <el-table-column prop="planQuantity2" label="数量(副)" min-width="140" />
                <el-table-column prop="deputyUnit" label="单位(副)" min-width="140" show-overflow-tooltip />
                <el-table-column prop="deliveryDate" label="交货日期" min-width="140" sortable="custom" />
                <el-table-column prop="remark" label="备注" min-width="140" />



                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                <el-table-column prop="createByName" label="创建人" />
                <el-table-column label="操作" min-width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false :
                      scope.row.approvalStatus == 'ok'" @click="addOrUpdateHandle(scope.row.procurementRequirementsId, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft' ? false :
                      scope.row.approvalStatus == 'ok'" @click="handleDel(scope.row.procurementRequirementsId)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.procurementRequirementsId, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>


              </JNPF-table>
              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :background="background"
                :limit.sync="linesQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>


    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="请购单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入请购单号" clearable />
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="linesQuery.deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.startAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>


  </div>
</template>
  
<script>
import { getPurProcurementRequirementsList, deletepurProcurementRequire, linesRequirements } from '@/api/purchasingManagement/purchaseInquirySheet'
import JNPFForm from './Form'
import moment from 'moment'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
export default {
  name: 'fixedPointPricing',
  components: { JNPFForm },
  data() {
    return {
      title: "更多查询",
      activeName: 'dataTable',
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      linesTableData: [],
      formVisible: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        userFlag: false,
        approvalStatus: "",   // 审批状态
        createByName: "",
        documentStatus: "",   // 单据状态
        endTime: "",
        keyword: "",
        applicationReason: '',   // 申请理由
        orderNo: "",          // 申请单号
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        deliveryDate: [],
        startAndEndTime: [],
      },
      documentStatusList: [{
        label: "草稿",
        value: "draft"
      }, {
        label: "提交",
        value: "submit"
      },],
      statusList: [{
        label: "审批中",
        value: "ing"
      }, {
        label: "审批通过",
        value: "ok"
      }, {
        label: "审批拒绝",
        value: "rebut"
      },],

      total: 0,
      detailVisible: false,
      linesTotal: 0,
      linesQuery: {},

      initLinesQuery: {
        createByName: "",
        deliveryDate: "",
        deliveryEndDate: "",
        deliveryStartDate: "",
        endTime: "",
        keyword: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        userFlag: false,
        orderNo: "",
        pageNum: 1,
        pageSize:20,
        productCode: "",
        productDrawingNo: "",
        productName: "",
        startTime: "",
        startAndEndTime: [],
        deliveryDateArr:[],
      },

      formVisible: false,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productDrawingNo') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }

      if (this.activeName === 'dataTable') {
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (prop === 'createTime') {
          newProp = prop
        }
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },


    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {

        if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
          this.listQuery.startTime = this.listQuery.startAndEndTime[0] + " 00:00:00"
          this.listQuery.endTime = this.listQuery.startAndEndTime[1] + " 23:59:59"
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        getPurProcurementRequirementsList(this.listQuery).then(res => {
          console.log(res, '请购单列表');
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        if (this.linesQuery.startAndEndTime && this.linesQuery.startAndEndTime.length > 0) {
          this.linesQuery.startTime = this.linesQuery.startAndEndTime[0] + " 00:00:00"
          this.linesQuery.endTime = this.linesQuery.startAndEndTime[1] + " 23:59:59"
        } else {
          this.linesQuery.startTime = ''
          this.linesQuery.endTime = ''
        }
        this.jnpf.searchTimeFormat(this.linesQuery,'deliveryDateArr','deliveryStartDate','deliveryEndDate')
        linesRequirements(this.linesQuery).then(res => {
          console.log("res++", res);
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    search() {
      if (this.activeName === 'dataTable') {
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listQuery.pageNum = 1
      } else {
        Object.keys(this.linesQuery).forEach(key => {
          let item = this.linesQuery[key]
          this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.linesQuery.pageNum = 1
      }
      this.initData()
    },
    reset() {
      if (this.activeName === 'dataTable') {
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
        this.linesQuery.startAndEndTime = []
        this.linesQuery.deliveryDate = []
      }
      this.initData()
    },
    // 点击切换明细
    handleClick(e) {
      console.log(e);
      this.activeName = e.name
      this.initData()
    },


    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })

    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletepurProcurementRequire(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
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

  
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />