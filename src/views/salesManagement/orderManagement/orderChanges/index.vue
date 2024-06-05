<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单据列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="dataForm.orderNo" @keyup.enter.native="search()" placeholder="请输入变更单号" />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="dataForm.documentStatus" placeholder="请选择单据状态" clearable>
                      <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="dataForm.approvalStatus" placeholder="请选择审批状态" clearable>
                      <el-option v-for="(item, index) in approvalStateList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
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
                <topOpts @add="addSupplier('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange"
                custom-column>
                <el-table-column prop="orderNo" label="变更单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="ordersNo" label="订单号" min-width="200" sortable="custom">

                </el-table-column>
                <el-table-column prop="applyReason" label="申请理由" min-width="120" />

                <el-table-column prop="reasonRejection" label="驳回理由" min-width="120" />
                <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180"></el-table-column>
                <el-table-column prop="submitDate" label="申请日期" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="申请人" width="100"></el-table-column>
                <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>

                <el-table-column prop="documentStatus" label="单据状态" width="100">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                    <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="approvalStatus" label="审批状态" sortable="custom" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag
                        >审批中</el-tag> </div>
                    <div v-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag
                        type="success">审批通过</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag
                        type="danger">审批拒绝</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'"><el-tag type="warning">审批撤回</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="updateHandle(scope.row.id, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="handleDel(scope.row.id)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                          @click.native="addSupplier(scope.row.id, 'add')">
                          重新提交
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                          @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                          审批撤回
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" @keyup.enter.native="search()" placeholder="请输入变更单号" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.ordersNo" @keyup.enter.native="search()" placeholder="请输入订单号" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%;"
                      start-placeholder="请选择申请开始时间" end-placeholder="请选择申请结束时间" clearable
                      :picker-options="global.timePickerOptions">
                    </el-date-picker>
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addSupplier('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" @sort-change="sortChange" :fixedNO="true"
                custom-column :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="变更单号" fixed="left" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.ordersChangeId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="ordersNo" fixed="left" label="订单号" min-width="200" sortable="custom">
                </el-table-column>
                <el-table-column prop="customerProductDrawingNo" fixed="left" label="客户产品图号" min-width="160" sortable="custom" />
                <el-table-column prop="productCode" fixed="left" label="产品编码" min-width="120" />
                <el-table-column prop="productName" fixed="left" label="产品名称" min-width="120" />
                <el-table-column prop="productDrawingNo" fixed="left" label="产品图号" min-width="120" />
                <el-table-column prop="num" label="原数量(主)" min-width="120" />
                <el-table-column prop="mainUnit" label="单位(主)" min-width="120" />
                <el-table-column prop="assistantNum" label="原数量(副)" min-width="120" />
                <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" />
                <el-table-column prop="price" label="原单价" min-width="120" />
                <el-table-column prop="excludingTaxAmount" label="原金额" min-width="120" />
                <el-table-column prop="deliveryDate" label="原交货日期" min-width="120" />
                <el-table-column prop="ask" label="要求" min-width="120" />
                <el-table-column prop="newPrice" label="新单价" min-width="120" />
                <el-table-column prop="newExcludingTaxAmount" label="新金额" min-width="120" />
                <el-table-column prop="newDeliveryDate" label="新交货日期" min-width="120" />
                <el-table-column prop="newAsk" label="新要求" min-width="120" />
                <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
                <el-table-column prop="createTime" label="申请日期" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="申请人" width="100"></el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="updateHandle(scope.row.ordersChangeId, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="handleDel(scope.row.ordersChangeId)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.ordersChangeId, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <el-dialog :title="'更多查询'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20"  >

        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="变更单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入变更单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单号">
              <el-input v-model="linesQuery.ordersNo" placeholder="请输入订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户产品图号">
              <el-input v-model="linesQuery.customerProductDrawingNo" placeholder="请输入客户产品图号" clearable />
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
            <el-form-item label="新交货日期">
              <el-date-picker v-model="linesQuery.deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择新交货开始日期" end-placeholder="请选择新交货结束日期"
                :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
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
          搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteOrdersChange, getOrdersChangeList, getOrdersChangeLineList } from '@/api/salesManagement/orderChanges'
import Form from './Form'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
export default {
  name: 'carrierProfile',
  components: { Form, },
  data() {
    return {
      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        orderNo: "",
        ordersNo: "",
        customerProductDrawingNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        pageNum: 1,
        pageSize: 20,
        deliveryEd: "",
        deliverySd: "",
        endTime: "",
        startTime: "",
        deliveryDateArr: [],
        createTimeArr: [],
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      visible: false,
      activeName: "dataTable",
      tableData: [],
      listLoading: false,
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],

      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: " 审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],
      initListQuery: {
        approvalStatus: "",
        orderNo: "",
        documentStatus: "",
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
      dataForm: {

      },
      linesQuery: {

      },
      total: 0,
      formVisible: false,
      filterText: '',

    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.dataForm = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    // 点击切换明细
    handleClick(e) {
      console.log(e);
      this.activeName = e.name
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop==="ordersNo"||prop === 'partnerCode' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop === 'productName' || prop === 'productDrawingNo') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());

      }
      if (this.activeName == "dataTable") {
        this.dataForm.orderItems[0].asc = order !== "descending"
        this.dataForm.orderItems[0].column = order === null ? "" : newProp

      } else {
        
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.search()


    },
    dataFormSubmit() {
      this.dataForm.pageNum = 1
      Object.keys(this.dataForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.dataForm[key]
        this.dataForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.initData()

    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        getOrdersChangeList(this.dataForm).then(res => {
          console.log("res++", res);
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        if (this.linesQuery.deliveryDateArr && this.linesQuery.deliveryDateArr.length > 0) {
          this.linesQuery.deliverySd = this.linesQuery.deliveryDateArr[0]
          this.linesQuery.deliveryEd = this.linesQuery.deliveryDateArr[1]
        } else {
          this.linesQuery.deliverySd = ''
          this.linesQuery.deliveryEd = ''
        }
        if (this.linesQuery.createTimeArr && this.linesQuery.createTimeArr.length > 0) {
          this.linesQuery.startTime = this.linesQuery.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.linesQuery.endTime = this.linesQuery.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.linesQuery.startTime = ''
          this.linesQuery.endTime = ''
        }
        console.log("this.linesQuery",this.linesQuery);
        getOrdersChangeLineList(this.linesQuery).then(res => {
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
        Object.keys(this.dataForm).forEach(key => {
          let item = this.dataForm[key]
          this.dataForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.dataForm.pageNum = 1
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
        this.dataForm = JSON.parse(JSON.stringify(this.initListQuery))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()

        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
        this.linesQuery.createTimeArr = []
        this.linesQuery.deliveryDate = []
      }


      this.search()
    },

    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    updateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        console.log(4444444);
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype,)
        })
        // }, 600);
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteOrdersChange(id).then(res => {
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
<style  scoped>
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
</style>

