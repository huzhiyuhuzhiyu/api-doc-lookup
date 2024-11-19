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
          <div></div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" fixedNO custom-column style="padding-bottom: 50px;">
          <el-table-column prop="orderNo" label="领用单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                scope.row.orderNo
                            }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="maintainerIdText" label="领用人" min-width="120"></el-table-column>
          <el-table-column prop="collectionTime" label="领用日期" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="productName" label="设备名称" min-width="200"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag>
              </div>
              <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center" v-if="showAppCodeFlag">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'">
                <el-tag>审批中</el-tag>
              </div>
              <div v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'">
                <el-tag type="success">审批通过</el-tag>
              </div>
              <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'">
                <el-tag type="danger">审批拒绝</el-tag>
              </div>
              <div v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                <el-tag type="warning">审批撤回</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUserRelation(scope.row.id,'edit')" size="mini" :disabled="scope.row.documentStatus == 'submit'">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id,)" class="JNPF-table-delBtn" size="mini" :disabled="scope.row.documentStatus == 'submit'">删除</el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="(scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn') && showAppCodeFlag" @click.native="handleUserRelation(scope.row.id, 'add')">
                    重新提交
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.approvalStatus === 'ing' && showAppCodeFlag" @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
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
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
      </div>
    </div>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>
<script>
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { CollectionandreturnList, deleteCollectionandreturn, guihuanCollectionandreturn } from '@/api/dailyManagement/Maintenance'
import Form from './Form'
export default {
  // name: 'circulate',
  components: { Form, SuperQuery },
  data() {
    return {
      showAppCodeFlag: true,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "领用单号",
          type: 'input'
        },
        {
          prop: 'maintainerIdText',
          label: "领用人",
          type: 'input'
        },
        { // 日期选择器（区间）
          prop: 'collectionTime',
          label: '领用日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'documentStatus',
          label: "单据状态",
          type: 'select',
          options: [
            { label: '草稿', value: 'draft' },
            { label: '提交', value: 'submit' }
          ]
        },
        {
          prop: 'approvalStatus',
          label: "审批状态",
          type: 'select',
          options: [
            { label: '审批中', value: 'ing' },
            { label: '审批通过', value: 'ok' },
            { label: '审批拒绝', value: 'rebut' },
            { label: '审批撤回', value: 'withdrawn' },
          ]
        }
      ],
      superQueryVisible: false,
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
      orderForm: {
        equipmentType: 'tool',
        requisitionType: 'requisition',
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
  async created() {
    const res = await this.jnpf.getBusInfo('b055')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    this.initData()
  },
  methods: {
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
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.dataFormSubmit()
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
    dataFormSubmit() {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
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
      CollectionandreturnList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false

      }).catch(() => {
        this.listLoading = false
      })
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.orderForm = {
        equipmentType: 'tool',
        requisitionType: 'requisition',
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