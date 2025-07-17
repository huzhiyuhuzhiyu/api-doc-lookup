<script>
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import {deepClone} from "@/utils";

export default {
  name: "bindingForm",
  components: {TableFormProduct},
  data() {
    return {
      loading: false,
      btnLoading: false,
      initListQuery: {
        type: 'customer', // 默认类型为客户
        name: '',
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
      listQuery: {},
      linesList: [],
      linesListItems: [
        {
          prop: 'productName',
          label: '产品名称',
          value: '',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          value: '',
          type: 'view',
          minWidth: 90,
        },
        {
          prop: 'num',
          label: '出入库数量',
          value: '',
          type: 'view',
          minWidth: 90,
        },
        {
          prop: 'receivedQuantity',
          label: '退货数量',
          type: 'input',
          value: '',
          minWidth: 120,
          itemRules: [
            {
              validator: this.formValidate('noZero', '退货数量不能为0', (errMsg) => {
                this.$message.error(errMsg)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['退货数量不能为空', (errMsg) => {
                  this.$message.error(`退货数量不能为空`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg) => {
                  this.$message.error(errMsg)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [(rowIndex, value) => +value <= +this.linesList[rowIndex]?.num, "不能大于出入库数量", (errMsg, rowIndex) => {
                  this.$message.error(`退货清单第${ rowIndex + 1 }行：退货数量${ errMsg }`)
                }]
              }), trigger: 'blur'
            },
            {required: true, message: '退货数量不能为空', trigger: ['blur', 'change'],},
          ]
        },
        {prop: 'remark', label: '备注', value: '', type: 'input', maxlength: 200, minWidth: 160}
      ],
      linesTableHeight: 0,
    }
  },
  methods: {
    async init() {
      this.$nextTick(() => this.refreshTableHeight())
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
      maxHeight -= 100 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },
    goBack() {
      this.$emit('close');
    },
    async handleSubmit() {
      if (!this.linesList.length) return this.$message.error('无退货信息')
      // 校验表单
      this.btnLoading = true
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_2) return this.btnLoading = false
      const attachmentList = this.fileListMap(type, this.fileList)
      const params = deepClone(this.dataForm)
      const newLines = this.linesList.map(item => ({...item, notificationType: 'external_process'}))
      let MSG = '提交成功'
      try {
        const apiMethod = params.id ? updateExpReceiptReturnGoods : addExpReceiptReturnGoods
        const res = await apiMethod({
          returnGoods: params,
          attachmentList: attachmentList,
          lines: newLines,
          flowData: this.flowData
        },)
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      } catch (error) {
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
                      placeholder="公司抬头"
                      clearable @keyup.enter.native="search()"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                <el-form-item>
                  <el-select v-model.trim="listQuery.name"
                    placeholder="公司抬头"
                    clearable @keyup.enter.native="search()"/>
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
                        hasC: false,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                    }">
              <template slot="top">
                <div class="tableTopContainer">
                  <div class="left">
                    <template>
                      <div class="left-top">
                        <div style="margin-right: 6px">公司抬头</div>
                        <el-select></el-select>
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
