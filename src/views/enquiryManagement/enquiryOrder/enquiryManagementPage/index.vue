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
          <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" :fixedNO="true"
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column customKey="JNPFTableKey_388658">
            <el-table-column prop="quotationNo" label="询价单号"/>
            <el-table-column prop="customerCode" label="客户编码"/>
            <el-table-column prop="quotationDate" label="询价日期"/>
            <el-table-column prop="supplierCode" label="供应商编号"/>
            <el-table-column prop="supplierName" label="供应商名称" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag>
                </div>
                <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="approvalStatus" label="审批状态" align="center" v-if="showAppCodeFlag">
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
                <el-button type="text" @click="addOrUpdateHandle(scope.row, 'edit')" size="mini"
                  :disabled="scope.row.documentStatus == 'draft' ? false : true">编辑</el-button>
                <el-button type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" size="mini"
                  @click="handleDel(scope.row.id,)" class="JNPF-table-delBtn">删除</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="(scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn') && showAppCodeFlag"
                      @click.native="addEnquiry(scope.row.id, 'add')">
                      重新提交
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.approvalStatus === 'ing' && showAppCodeFlag"
                      @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                      审批撤回
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleUserRelation(scope.row, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="copyFun(scope.row.id, 'copy')">
                      复制
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="downloadOrder(scope.row.id)">
                      下载报价单
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>
    <EstablishForm v-if="establishVisible" @close="closeForm" ref="establishForm"></EstablishForm>
  </div>
</template>

<script>
import { getEnquiryManagementList } from '@/api/enquiryManagement/index'
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
      tableDataList:[],
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
      },
    }
  },
  async created() {
    this.search()
  },
  methods: {
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
      getEnquiryManagementList(this.formlist).then(res => {
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