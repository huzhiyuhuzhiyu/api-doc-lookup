<script>
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { getCompanyPage, setCompany } from "@/api/customerAndFactory";
import { getCooperativeData } from "@/api/basicData";

export default {
  name: "bindingForm",
  components: { TableFormProduct },
  data() {
    return {
      loading: false,
      btnLoading: false,
      companyName: '',
      companyNameOptions: [],
      total: 0,
      initListQuery: {
        type: 'customer', // 默认类型为客户
        name: '',
        hasSalesperson: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        superQuery: {},
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {
        type: "customer",
        saleFlag: 1,
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
      linesList: [],
      linesListItems: [
        {
          prop: 'code',
          label: '客户编码',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'name',
          label: '客户名称',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'contacts',
          label: '联系人',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'mobilePhone',
          label: '手机',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'phone',
          label: '电话',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'salespersonIdText',
          label: '所属销售',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'companyId',
          label: '公司抬头',
          type: 'select',
          options: [],
          minWidth: 160,
          change: this.handleChangeCompanyId,
        },
      ],
      linesTableHeight: 0,
    }
  },
  methods: {
    async init() {
      await this.initSelect()
      await this.initData()
      this.setLinesListItems()
      this.$nextTick(() => this.refreshTableHeight())
    },
    async initData() {
      this.loading = true
      try {
        const response = await getCooperativeData(this.listQuery)
        const { total, records } = response.data
        this.linesList = records
        this.total = total

      } finally {
        this.loading = false
      }
    },
    async initSelect() {
      const params = {
        type: 'customer',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 9999
      }
      const response = await getCompanyPage(params)
      this.companyNameOptions = response.data.records.map(item => ({
        label: item.name,
        value: item.id
      }))
    },
    handleChangeCompanyId(val, { row }) {
      this.$refs.tableForm.$refs.tableRef.$refs.JNPFTable.toggleRowSelection(row, true)
    },
    handleChangeCompanyName(val) {
      this.linesList.forEach(item => {
        item.companyId = val
        this.$refs.tableForm.$refs.tableRef.$refs.JNPFTable.toggleRowSelection(item, true)
      })
    },
    setLinesListItems() {
      this.linesListItems = this.linesListItems.map(item => {
        if (item.prop === 'companyId') {
          return {
            ...item,
            options: this.companyNameOptions
          }
        }
        return item
      })
    },
    search() {
      this.init()
    },
    reset() {
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      let maxHeight = mainRef.clientHeight
      maxHeight -= 180 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },
    goBack() {
      this.$emit('close');
    },
    async handleSubmit() {
      let selectionList = this.$refs.tableForm.$refs.tableRef.selection

      if (selectionList.length === 0) {
        this.$message.warning('未选择任何数据')
        return
      }

      const unboundItems = selectionList.filter(item => !item.companyId)
      if (unboundItems.length > 0) {
        const maxDisplay = 3
        const displayedNames = unboundItems.slice(0, maxDisplay).map(item => item.name || '客户')
        const moreCount = unboundItems.length - maxDisplay

        let message = `以下客户未选择公司抬头：${ displayedNames.join('、') }`
        if (moreCount > 0) {
          message += `等${ unboundItems.length }个客户`
        }

        this.$message.warning(message)
        return
      }
      // 校验表单
      this.btnLoading = true
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_2) return this.btnLoading = false
      let MSG = '绑定成功'
      try {
        const params = selectionList.map(item => ({
          cooperativePartnerId: item.id,
          companyId: item.companyId,
        }))
        const res = await setCompany(params)
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      } catch ( error ) {
        this.btnLoading = false
      }
    },
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-preview-main transitionForm org-form">
          <div class="JNPF-common-page-header">
            <el-page-header @back="goBack" content="绑定公司抬头"/>
            <div class="options">
              <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
                保存并提交
              </el-button>
              <el-button @click="goBack">{{
                  $t('common.cancelButton')
                }}
              </el-button>
            </div>
          </div>
          <div class="main" v-loading="loading" ref="main">
            <el-row class="JNPF-common-search-box" :gutter="16" style="margin-bottom: 5px !important;">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.name"
                              placeholder="客户名称"
                              clearable @keyup.enter.native="search()"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="有无业务员">
                    <el-select v-model.trim="listQuery.hasSalesperson" placeholder="请选择">
                      <el-option
                        v-for="item in global.booleanOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search"
                               @click="search()">查询
                    </el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <TableForm-product
              @input="contentChanges"
              :value="linesList"
              :hasToolbar="false"
              ref="tableForm" :tableItems="linesListItems"
              :hasActionbar="false"
              :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: true,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                    }">
              <template slot="top">
                <div class="tableTopContainer mb-5">
                  <div class="left">
                    <template>
                      <div class="left-top">
                        <div style="margin-right: 6px">公司抬头</div>
                        <el-select v-model="companyName" placeholder="请选择" @change="handleChangeCompanyName">
                          <el-option
                            v-for="item in companyNameOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </template>
                  </div>
                  <div class="right">
                    <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                      <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                               @click="$refs.tableForm.$refs.tableRef.showDrawer()"/>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </TableForm-product>
            <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                        @pagination="initData"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<style scoped lang="scss">
.left-top {
  display: flex;
  align-items: center;
}
</style>
