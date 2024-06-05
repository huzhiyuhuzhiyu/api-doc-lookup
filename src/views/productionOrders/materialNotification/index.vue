<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="dataForm.orderNo" @keyup.enter.native="search()" placeholder="请输入单号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model="dataForm.saleOrderNo" @keyup.enter.native="search()" placeholder="请输入领料人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-date-picker v-model="dataForm.orderDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" :picker-options="global.timePickerOptions" start-placeholder="领料开始日期"
                end-placeholder="领料结束日期" clearable>
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
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier('', 'add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" custom-column>
          <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="saleOrderNo" label="生产订单号" width="180" >  </el-table-column>
          <el-table-column prop="applyReason" label="领料人" min-width="150" />
          <el-table-column prop="reasonRejection" label="领料日期" min-width="150" sortable="custom"/>
          <el-table-column prop="createTime" label="驳回理由" width="180" ></el-table-column>
          <el-table-column prop="ddd" label="审批完成时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="ccc" label="提交时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="fff" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="ggg" label="创建人" width="120"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
          <el-table-column prop="documentStatus" label="单据状态" fixed="right" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
              <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" fixed="right" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag
                  type="warning">审批中</el-tag> </div>
              <div v-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag
                  type="success">审批通过</el-tag></div>
              <div v-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag
                  type="danger">审批拒绝</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180">
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
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize" @pagination="initData" />
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
        <!-- 更多搜索 -->
    <!-- <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">
        <el-form :model="orderForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="单号">
              <el-input v-model="orderForm.orderNo" placeholder="请输入单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产订单号">
              <el-input v-model="orderForm.cooperativePartnerCode" placeholder="请输入生产单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料人">
              <el-input v-model="orderForm.cooperativePartnerName" placeholder="请输入领料人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料日期">
              <el-date-picker v-model="orderForm.orderDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" :picker-options="global.timePickerOptions" start-placeholder="开始日期"
                end-placeholder="结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="领料状态">
              <el-select v-model="orderForm.orderType" placeholder="请选择领料状态" clearable>
                <el-option v-for="(item, index) in orderList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="orderForm.approvalStatus" placeholder="请选择审批状态" filterable clearable>
                <el-option v-for="(item, index) in approvalStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="orderForm.documentStatus" placeholder="请选择单据状态" filterable clearable>
                <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="orderForm.createTimeArr" type="datetimerange" format="yyyy-MM-dd HH:mm:ss"
                :picker-options="global.timePickerOptions" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"
                start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { WithdrawalList, deleteWithdrawal } from '@/api/productOrdes/index'
import Form from './Form'
export default {
  name: 'carrierProfile',
  components: { Form, },
  data() {
    return {
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
      dataForm: {
        approvalStatus: "",
        orderNo: "",
        saleOrderNo: "",
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
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'saleOrderNo') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());

      }
      this.dataForm.orderItems[0].asc = order === "ascending"
      this.dataForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()


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

      WithdrawalList(this.dataForm).then(res => {
        console.log("res++", res);
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    search() {
      this.dataFormSubmit()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.dataForm = {
        approvalStatus: "",
        orderNo: "",
        saleOrderNo: "",
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
        deleteWithdrawal(id).then(res => {
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


::v-deep.el-table__body-wrapper {
  height: auto !important;
}
</style>

