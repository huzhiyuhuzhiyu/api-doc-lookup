<template>
  <el-drawer title="检验明细" :visible.sync="drawerVisible" :wrapperClosable="false" size="40%" append-to-body
    class="JNPF-common-drawer columnSettings-drawer">
    <div class="JNPF-flex-main">
      <el-scrollbar class="column-list" v-loading="loading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="检验项目" :name="'inspectionItems'">
            <TableForm-ware :value="linesList" @input="contentChanges" ref="linesForm" :tableItems="linesListItems"
              :openMode="openMode" @addth="addOrDelLinesItem" @deleteth="addOrDelLinesItem"
              :productsId="scope.row ? scope.row.productsId : ''" :num="rowNum" :nowNum="nowNum" />
            <!-- :nowNum="this.rowNum != '0' ? nowNum : 0" -->
          </el-tab-pane>
          <el-tab-pane label="不良原因" :name="'adverseCauses'">
            <TableForm-ware-two :value="linesListTwo" @input="contentChangesTwo" ref="linesFormTwo"
              :tableItems="linesListItemsTwo" :openMode="openMode" @addth="addOrDelLinesItemTwo"
              @deleteth="addOrDelLinesItemTwo" :productsId="scope.row ? scope.row.productsId : ''" :num="rowNum"
              :nowNum="nowNumTwo" />
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
      <div class="footer">
        <el-button @click="drawerVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="btnLoading" type="primary" @click="saveSettings" v-if="openMode !== '只读'">
          {{ $t('common.confirmButton') }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import TableFormWare from "./TableForm-ware.vue"
import TableFormWareTwo from "./TableForm-ware-two.vue"
import { getInspectionItem } from '@/api/inspectionManagement/index' // 产品检验项目列表

export default {
  components: { TableFormWare, TableFormWareTwo },
  props: {
    openMode: {
      type: String,
      default: '新建'
    },
  },
  beforeCreate() {
    this.initLinesListItems = () => [
      { prop: "name", label: "检验项目", value: "", type: 'view', minWidth: 120 },
      {
        prop: "unqualifiedQuantity", label: "不合格数量", value: "0", type: "input", itemRules: [
          { required: true, trigger: "blur" },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('不合格数量：' + errMsg) }] }), trigger: 'blur' }
        ], minWidth: 180
      },
      { prop: "remark", label: "备注", value: "", type: 'input', minWidth: 120 },
    ]
  },
  data() {
    return {
      loading: false,
      drawerVisible: false,
      btnLoading: false,
      activeName: "inspectionItems",
      scope: {},

      linesList: [],
      linesListItems: this.initLinesListItems(),
      linesListTwo: [],
      linesListItemsTwo: [
        { prop: "name", label: "不良原因名称", value: "", type: 'view', minWidth: 180 },
        {
          prop: "unqualifiedQuantity", label: "不良品数量", value: "", type: "input", itemRules: [
            { required: true, trigger: "blur" },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`不良品数量：${errMsg}`) }), trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('不良品数量：' + errMsg) }] }), trigger: 'blur' }
          ], minWidth: 180
        },
        { prop: "remark", label: "备注", value: "", type: 'input', minWidth: 120 },
      ],
    }
  },
  computed: {
    rowNum() {
      this.$nextTick(() => { this.linesListItems = this.initLinesListItems() }) // rowNum发生改变，重新渲染linesListItems
      let tempUnqualifiedQuantity = this.$parent.title.includes('检') ? (this.scope.row ? this.scope.row.unqualifiedQuantity : 0) :
        (this.scope.row ? this.scope.row.inspectionUnqualifiedQuantity : 0)
      return this.scope.row ? tempUnqualifiedQuantity ? tempUnqualifiedQuantity : 0 : 0
    },
    nowNum() {
      let tempNum = 0
      this.linesList.forEach(item => {
        tempNum += item.unqualifiedQuantity ? Number(item.unqualifiedQuantity) : 0
      })
      let tempUnqualifiedQuantity = this.$parent.title.includes('检') ? (this.scope.row ? this.scope.row.unqualifiedQuantity : 0) :
        (this.scope.row ? this.scope.row.inspectionUnqualifiedQuantity : 0)
      let newNumber = this.scope.row ? this.jnpf.math('subtract', [tempUnqualifiedQuantity, tempNum]) : 0
      return this.jnpf.numberFormat(newNumber, 4)
    },
    nowNumTwo() {
      let tempNum = 0
      this.linesListTwo.forEach(item => {
        tempNum += item.unqualifiedQuantity ? Number(item.unqualifiedQuantity) : 0
      })
      let tempUnqualifiedQuantity = this.$parent.title.includes('检') ? (this.scope.row ? this.scope.row.unqualifiedQuantity : 0) :
        (this.scope.row ? this.scope.row.inspectionUnqualifiedQuantity : 0)
      let newNumber = this.scope.row ? this.jnpf.math('subtract', [tempUnqualifiedQuantity, tempNum]) : 0
      return this.jnpf.numberFormat(newNumber, 4)
    }
  },
  methods: {
    async init(scope, readOnly) {
      this.drawerVisible = true
      this.scope = scope
      this.linesList = scope.row.itemList || []
      if (!this.linesList.length && this.openMode !== '只读') { // 自动设置检验项目
        this.loading = true
        await getInspectionItem({ id: scope.row.productsId, inspectionCategory: this.$parent.inspectionType.replace('_batch', '') }).then((res) => {
          this.addOrDelLinesItem(res.data)
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
      }
      this.linesListTwo = scope.row.causesList || []
      this.activeName = "inspectionItems"
    },
    async saveSettings() {
      this.btnLoading = true
      let focusItem

      let submitFlag_1 = true
      let form_1 = this.$refs.linesForm.$refs.main
      let valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag_1) {
        this.activeName = 'inspectionItems'
        let formItems = form_1.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            submitFlag_1 = false
            focusItem = formItem
            return true
          }
        });
      }

      let submitFlag_2 = true
      let form_2 = this.$refs.linesFormTwo.$refs.main
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag_2) {
        this.activeName = 'adverseCauses'
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            submitFlag_2 = false
            focusItem = formItem
            return true
          }
        });
      }

      if (!this.linesList.length) {
        let errMsg = '至少有一项检验项目'
        this.activeName = 'inspectionItems'
        this.$message.error(errMsg)
        this.btnLoading = false
      } else if (this.nowNum != 0 && this.rowNum != '0') {
        let errMsg = '检验项目不合格数量与总不合格数量不匹配'
        this.activeName = 'inspectionItems'
        this.$message.error(errMsg)
        this.btnLoading = false
      } else if (!submitFlag_1) {
        this.activeName = 'inspectionItems'
        this.jnpf.focusItem(focusItem.$children[1].$el)
        this.$nextTick(() => { this.jnpf.formItemValidate(focusItem) });
        this.btnLoading = false
      } else if (this.nowNumTwo != 0) {
        let errMsg = '不良原因分配不良数量与总不良数量不匹配'
        this.activeName = 'adverseCauses'
        this.$message.error(errMsg)
        this.btnLoading = false
      } else if (!submitFlag_2) {
        this.activeName = 'adverseCauses'
        this.jnpf.focusItem(focusItem.$children[1].$el)
        this.$nextTick(() => { this.jnpf.formItemValidate(focusItem) });
        this.btnLoading = false
      } else {
        let effective = this.linesListTwo.filter(line => line.num != 0)
        this.$emit('confirm', { itemList: this.linesList, causesList: effective }, this.scope)
      }
    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'
      if (type === 'Object') { this.linesList.splice(data.$index, 1) }
      else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          // if (this.rowNum == "0") item.unqualifiedQuantity = 0
          const hasFlag = this.linesList.find(i => item.id === i.id)
          if (hasFlag) { hasItemList.push(item.name) }
          else { tempList.push(item) }
        }
        if (hasItemList.length) this.$message.error(`已经存在的检验项目：${hasItemList.join('、')}`)
        this.linesList = JSON.parse(JSON.stringify(tempList))
        this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() });
      }
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    addOrDelLinesItemTwo(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'
      if (type === 'Object') { this.linesListTwo.splice(data.$index, 1) }
      else {
        let tempList = JSON.parse(JSON.stringify(this.linesListTwo))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          const hasFlag = this.linesListTwo.find(i => item.id === i.id)
          if (hasFlag) { hasItemList.push(item.name) }
          else { tempList.push(item) }
        }
        if (hasItemList.length) this.$message.error(`已经存在的不良原因：${hasItemList.join('、')}`)
        this.linesListTwo = JSON.parse(JSON.stringify(tempList))
        this.$nextTick(() => { this.$refs.linesFormTwo.setDefaultValue() });
      }
    },
    contentChangesTwo(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesListTwo = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesListTwo[dataOrIndex][prop] = value
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.columnSettings-drawer {
  font-size: 16px;

  .JNPF-flex-main {
    overflow: hidden;
  }

  .columnSetting-head {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 14px;
    color: #303133;
  }

  .column-list {
    height: 100%;
    padding: 8px 10px 0;

    .column-item {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0;
      font-size: 12px;
      color: #303133;
      cursor: pointer;
      border-bottom: 1px solid #e3e6eb;

      &:hover {
        background: rgba(25, 144, 250, 0.1);
      }

      .column-item-icon {
        margin: auto 8px auto 10px;
        color: #909399;
        cursor: move;
        font-size: 14px;
      }

      .el-switch {
        transform: scale(0.8);
      }

      .column-item-label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        display: flex;
        align-items: center;
      }

      .check-box {
        margin-right: 16px;
      }
    }

    >>>.el-tabs__header {
      margin-bottom: 0;
    }
  }

  .footer {
    margin: 4px 20px 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>