<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.orderNo" placeholder="请输入领用单号" clearable @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.maintainerIdText" placeholder="请输入领用人" clearable @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="orderForm.returnFlag" placeholder="请选择是否归还" clearable style="width: 100%;">
                <el-option v-for="(item, index) in collectionList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="dataFormSubmit()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addSupplier('', 'add')">领用</el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" fixedNO custom-column style="padding-bottom: 50px;">
          <el-table-column prop="orderNo" label="领用单号" width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                scope.row.orderNo
                            }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="departmentIdText" label="领用部门" width="120" />
          <el-table-column prop="maintainerIdText" label="领用人" width="120"></el-table-column>
          <el-table-column prop="collectionTime" label="领用日期" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="returnFlag" label="是否归还" width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.returnFlag == 1">是</div>
              <div v-else-if="scope.row.returnFlag == 0">否</div>
            </template>
          </el-table-column>
          <el-table-column prop="returnTime" label="归还日期" width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="returngongju(scope.row.id)" size="mini" :disabled="scope.row.returnFlag==1">归还</el-button>
              <el-button type="text" @click="handleDel(scope.row.id,)" class="JNPF-table-delBtn" :disabled="scope.row.returnFlag==0" size="mini">删除</el-button>
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
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <el-dialog title="归还" :visible.sync="dialogFormVisible" width="400px" top="40vh" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="归还日期" label-width="100px">
          <el-date-picker v-model="form.returnTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="{disabledDate (time) {
          return time.getTime() > Date.now()
        }}">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogreturn" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { CollectionandreturnList, deleteCollectionandreturn, guihuanCollectionandreturn } from '@/api/dailyManagement/Maintenance'
import Form from './Form'
export default {
  name: 'circulate',
  components: { Form },
  data () {
    return {
      btnLoading: false,
      orderFormreturn: {
        returnTime: '',
        id: ''
      },
      form: {
        returnTime: ''
      },
      dialogFormVisible: false,
      tableData: [],
      listLoading: false,
      collectionList: [
        { label: "否", value: 0 },
        { label: "是", value: 1 }
      ],
      orderForm: {
        orderNo: '',
        maintainerIdText: '',
        returnFlag: '',
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
  created () {
    this.initData()
  },
  methods: {
    sortChange ({ prop, order }) {
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
    dataFormSubmit () {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm (isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData () {
      this.listLoading = true
      CollectionandreturnList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false

      }).catch(() => {
        this.listLoading = false
      })
    },
    reset () {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.orderForm = {
        orderNo: '',
        auditStatus: '',
        documentStatus: '',
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
      this.dataFormSubmit()
    },

    addSupplier (id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    returngongju (id) {
      // this.$confirm('此操作将归还工具，是否继续！', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   guihuanCollectionandreturn(id).then(res => {
      //     this.initData()
      //     this.$message({
      //       type: 'success',
      //       message: "归还成功",
      //       duration: 1500,
      //     })
      //   })
      // }).catch(() => { })
      this.dialogFormVisible = true
      this.orderFormreturn.id = id
      this.form.returnTime = this.jnpf.getToday()
    },
    dialogreturn () {
      this.btnLoading = true
      this.orderFormreturn.returnTime = this.form.returnTime
      guihuanCollectionandreturn(this.orderFormreturn).then(res => {
        this.btnLoading = false
        this.dialogFormVisible = false
        this.initData()
        this.$message({
          type: 'success',
          message: "归还成功",
          duration: 1500,
        })
      }).catch(() => {
        this.dialogFormVisible = false
        this.btnLoading = false
      })
    },
    handleDel (id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteCollectionandreturn(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation (id, btnType) {
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
::v-deep .el-table .cell.el-tooltip {
  width: 98% !important;
}
.JNPF-common-search-box {
  padding-top: 8px;
  padding-bottom: 8px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #f5f7fa;
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