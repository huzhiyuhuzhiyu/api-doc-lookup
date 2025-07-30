<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!establishVisible">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <!-- 查询条件 -->
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 4">
                <el-form-item>
                  <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                    @keyup.enter.native="search('basic')" />
                  <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                    clearable>
                    <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                      :value="item2.value"></el-option>
                  </el-select>
                  <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                    :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                    :type="item.dateType"
                    :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                  $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <!-- 台账表格 -->
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addEnquiry('', 'add')" :addText="'新建'">
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table customKey="hsCodes" v-loading="loading" :data="tableDataList" :has-c="true"
            @selection-change="(val) => selectedRow = val" :row-key="'id'" fixedNO :setColumnDisplayList="columnList"
            @sort-change="sortChange" ref="dataTable" custom-column>
            <template v-for="column in columnsConfig">
              <el-table-column v-if="typeof column.show === 'function' ? column.show() : true" :key="column.prop"
                :prop="column.prop" :label="column.label" :min-width="column.minWidth" :sortable="column.sortable"
                :fixed="column.fixed" :align="getAlign(column.align)">
                <template v-if="column.slot" v-slot="scope">
                  <template v-if="column.dictType">
                    <span>
                      <el-tag
                        :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">{{
                          global.getDictLabelGlobal(column.dictType, scope.row[column.prop])
                        }}</el-tag>
                    </span>
                  </template>
                </template>
              </el-table-column>
            </template>
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="{ row }">
                <el-button :disabled="row.documentStatus == 'draft' ? false : true" size="mini" type="text" @click="addOrUpdateHandle(row, 'edit')">
                  编辑
                </el-button>
                <el-button :disabled="row.documentStatus == 'draft' ? false : true" style="color: rgb(245, 108, 108)" size="mini" type="text"
                  @click="handleDel(row.id)">
                  删除
                </el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(row, 'look')">
                      详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="initData" />
        </div>
      </div>
    </div>
    <EstablishForm v-if="establishVisible" @close="closeForm" ref="establishForm"></EstablishForm>
  </div>
</template>

<script>
import { getEnquiryManagementList, deleteEnquiryManagement } from '@/api/enquiryManagement/index'
import EstablishForm from './establishForm'
export default {
  name: 'enquiryManagementPage',
  components: {
    EstablishForm
  },
  data() {
    return {
      establishVisible: false,
      searchList: [
        { field: 'quotationNo', fieldValue: '', label: '询价单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerCode', fieldValue: '', label: '客户编号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      form: {},
      tableDataList: [],
      total: 0,
      listLoading: false,
      basicQuery: {},
      formlist: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: "create_time"
        }],
        quotationNo: "",
        cooperativePartnerIdText: "",
        deliver: "",
        bidder: "",
        approvalStatus: '',
        documentStatus: "",
        submitStartDate: '',
        submitEndDate: '',
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        columnList: [],
      },
      columnsConfig: [
        {
          prop: "quotationNo",
          label: "询价单号",
          minWidth: 220,
          align: "left",
          sortable: 'custom',
        },
        {
          prop: "customerCode",
          label: "客户编码",
          minWidth: 220,
          align: "left",
          sortable: 'custom',
        },
        {
          prop: "quotationDate",
          label: "询价日期",
          minWidth: 120,
          sortable: 'custom',
        },
        {
          prop: "cooperativePartnerId",
          label: "供应商编号",
          minWidth: 220,
          align: "left",
          sortable: 'custom',
        },
        {
          prop: "supplierName",
          label: "供应商名称",
          minWidth: 220,
          align: "left",
        },
        {
          prop: "documentStatus",
          label: "单据状态",
          minWidth: 120,
          slot: true,
          dictType: 'documentStatusList',
        },
      ]
    }
  },
  async created() {
    this.form = JSON.parse(JSON.stringify(this.formlist))
    this.search()
  },
  activated() {
    // 刷新表格
    if (this.$refs.tableForm) {
      this.$refs.tableForm.doLayout()
    }
  },
  methods: {
    getAlign(align) {
      return align || 'center'
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop == 'cooperativePartnerIdText' || prop == 'cooperativePartnerCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.form.orderItems[0].asc = order !== 'descending'
      this.form.orderItems[0].column = newProp
      this.search('basic')
    },
    // 查询条件重置
    reset() {
      this.$refs.tableForm.$refs.JNPFTable.clearSort()
      this.form = JSON.parse(JSON.stringify(this.formlist))
      this.searchList.forEach(item => {
        item.fieldValue = ''
      })
      this.search('basic')
    },
    handleUserRelation(row, type) {
      this.establishVisible = true
      this.$nextTick(() => {
        this.$refs.establishForm.init(row.id, type)
      })
    },
    // 编辑
    addOrUpdateHandle(res, type) {
      this.establishVisible = true
      this.$nextTick(() => {
        this.$refs.establishForm.init(res.id, type)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteEnquiryManagement(id).then(res => {
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
    // 关闭新建、编辑页面
    closeForm() {
      this.establishVisible = false
      this.search('basic')
    },
    // 查询
    search(type) {
      Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })
      this.form.pageNum = 1 // 重置页码
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
      }
      this.initData()
    },
    // 查询接口
    initData() {
      this.listLoading = true
      // 处理查询条件
      const searchData = {}
      this.searchList.forEach((item) => {
        if (item.fieldValue) {
          searchData[item.field] = item.fieldValue
        }
      })
      console.log(searchData);
      getEnquiryManagementList({
        ...this.form,
        ...searchData
      }).then(res => {
        this.tableDataList = res.data.records
        this.listLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })

    },
    // 新建询价
    addEnquiry(id, type) {
      this.establishVisible = true
      this.$nextTick(() => {
        this.$refs.establishForm.init(id, type)
      })
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
  }
}
</script>
<style scoped lang="scss"></style>